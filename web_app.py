#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
웹 기반 음성 변환 애플리케이션
Flask를 이용한 웹 인터페이스
"""

import os
import sys
import logging
import json
import zipfile
import io
from pathlib import Path
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, send_file, jsonify
from flask_cors import CORS

# 메인 스크립트의 클래스 import
from document_to_speech import DocumentToSpeech
from document_to_speech_batch import BatchConverter

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask 앱 설정
app = Flask(__name__)
CORS(app)

# 설정
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'txt', 'docx', 'pdf', 'doc'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# 폴더 생성
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE


def allowed_file(filename):
    """업로드 가능한 파일인지 확인"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """메인 페이지"""
    return render_template('index.html')


@app.route('/api/convert', methods=['POST'])
def convert():
    """파일 음성 변환 API"""
    try:
        # 파일 검증
        if 'file' not in request.files:
            return jsonify({'error': '파일이 없습니다'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': '파일명이 없습니다'}), 400

        if not allowed_file(file.filename):
            return jsonify({
                'error': '지원되지 않는 파일 형식입니다. (txt, docx, pdf만 가능)'
            }), 400

        # 파일 저장
        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(input_path)

        # 출력 파일 설정
        base_name = os.path.splitext(filename)[0]
        output_filename = f"{base_name}.mp3"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)

        # 음성 변환 옵션
        lang = request.form.get('lang', 'ko')
        speeds_json = request.form.get('speeds', '["normal"]')

        try:
            import json
            selected_speeds = json.loads(speeds_json)
        except:
            selected_speeds = ['normal']

        # 음성 변환 수행
        try:
            # 선택된 속도가 1개 이상인 경우
            if len(selected_speeds) > 1:
                # 여러 버전 한 번에 생성
                temp_dir = os.path.join(app.config['OUTPUT_FOLDER'], f"temp_{base_name}")
                os.makedirs(temp_dir, exist_ok=True)

                # 텍스트 추출 (여러 번 추출하지 않기 위해)
                text_extractor = DocumentToSpeech(lang=lang)
                text = text_extractor.extract_text(input_path)

                results = {}
                speed_labels = {'slow': '느림', 'normal': '보통'}

                for speed in selected_speeds:
                    # gTTS는 slow/normal만 지원 (fast는 지원 안함)
                    if speed not in speed_labels:
                        continue

                    slow_param = (speed == 'slow')
                    output_file = os.path.join(temp_dir, f"{base_name}_{speed_labels.get(speed, speed)}.mp3")

                    try:
                        converter = DocumentToSpeech(lang=lang)
                        converter.text_to_speech(text, output_file, slow=slow_param)
                        results[speed] = output_file
                        logger.info(f"생성: {speed} -> {output_file}")
                    except Exception as e:
                        logger.error(f"실패: {speed} - {str(e)}")
                        results[speed] = None

                # ZIP 파일로 묶기
                zip_filename = f"{base_name}_여러버전.zip"
                zip_path = os.path.join(app.config['OUTPUT_FOLDER'], zip_filename)

                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for speed, file_path in results.items():
                        if file_path and os.path.exists(file_path):
                            zipf.write(file_path, arcname=os.path.basename(file_path))

                logger.info(f"배치 변환 완료: {filename} -> {zip_filename}")

                return jsonify({
                    'success': True,
                    'message': f'{len(selected_speeds)}가지 버전 변환 완료!',
                    'filename': zip_filename,
                    'download_url': f'/api/download/{zip_filename}',
                    'files': list(results.keys())
                })

            else:
                # 단일 버전 변환
                speed = selected_speeds[0] if selected_speeds else 'normal'
                slow = (speed == 'slow')

                converter = DocumentToSpeech(lang=lang)
                converter.convert(input_path, output_path, slow=slow)

                logger.info(f"변환 완료: {filename} -> {output_filename}")

                return jsonify({
                    'success': True,
                    'message': '변환이 완료되었습니다',
                    'filename': output_filename,
                    'download_url': f'/api/download/{output_filename}'
                })

        except Exception as e:
            logger.error(f"변환 실패: {str(e)}")
            return jsonify({'error': f'변환 실패: {str(e)}'}), 500

        finally:
            # 임시 업로드 파일 삭제
            if os.path.exists(input_path):
                os.remove(input_path)

    except Exception as e:
        logger.error(f"오류: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/<filename>')
def download(filename):
    """파일 다운로드 (MP3 또는 ZIP)"""
    try:
        filename = secure_filename(filename)
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)

        if not os.path.exists(file_path):
            return jsonify({'error': '파일을 찾을 수 없습니다'}), 404

        # 파일 형식에 따라 mimetype 설정
        if filename.endswith('.zip'):
            mimetype = 'application/zip'
        else:
            mimetype = 'audio/mpeg'

        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype=mimetype
        )

    except Exception as e:
        logger.error(f"다운로드 오류: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/status')
def status():
    """서버 상태 확인"""
    return jsonify({'status': 'ok', 'message': '서버가 정상 작동 중입니다'})


@app.errorhandler(404)
def not_found(error):
    """404 에러 처리"""
    return jsonify({'error': '페이지를 찾을 수 없습니다'}), 404


@app.errorhandler(500)
def server_error(error):
    """500 에러 처리"""
    return jsonify({'error': '서버 오류가 발생했습니다'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
