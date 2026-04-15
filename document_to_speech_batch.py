#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
배치 음성 변환 도구
여러 속도, 언어로 한 번에 음성 파일 생성
"""

import os
import logging
from pathlib import Path
from document_to_speech import DocumentToSpeech

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BatchConverter:
    """배치 변환을 처리하는 클래스"""

    def __init__(self):
        self.speeds = ['slow', 'normal']
        self.speed_labels = {
            'slow': '느림',
            'normal': '보통'
        }
        self.languages = ['ko', 'en', 'ja', 'zh']
        self.language_labels = {
            'ko': '한국어',
            'en': '영어',
            'ja': '일본어',
            'zh': '중국어'
        }

    def get_speed_param(self, speed):
        """속도를 gTTS slow 파라미터로 변환"""
        # gTTS는 slow/normal만 지원
        if speed == 'slow':
            return True
        else:  # normal
            return False

    def convert_batch_by_speed(self, input_file, output_dir=None):
        """같은 언어로 여러 속도 버전 생성"""
        if output_dir is None:
            output_dir = '.'

        input_path = Path(input_file)
        if not input_path.exists():
            logger.error(f"파일을 찾을 수 없습니다: {input_file}")
            return {}

        base_name = input_path.stem
        os.makedirs(output_dir, exist_ok=True)

        results = {}
        converter = DocumentToSpeech(lang='ko')

        for speed in self.speeds:
            slow = self.get_speed_param(speed)
            output_file = os.path.join(
                output_dir,
                f"{base_name}_{self.speed_labels[speed]}.mp3"
            )

            try:
                logger.info(f"변환 중: {speed} 속도로 {output_file}")
                converter.text_to_speech(
                    converter.extract_text(input_file),
                    output_file,
                    slow=slow
                )
                results[speed] = output_file
                logger.info(f"완료: {output_file}")
            except Exception as e:
                logger.error(f"실패: {speed} - {str(e)}")
                results[speed] = None

        return results

    def convert_batch_by_language(self, input_file, output_dir=None):
        """여러 언어 버전 생성"""
        if output_dir is None:
            output_dir = '.'

        input_path = Path(input_file)
        if not input_path.exists():
            logger.error(f"파일을 찾을 수 없습니다: {input_file}")
            return {}

        base_name = input_path.stem
        os.makedirs(output_dir, exist_ok=True)

        results = {}

        try:
            text = DocumentToSpeech().extract_text(input_file)
        except Exception as e:
            logger.error(f"텍스트 추출 실패: {str(e)}")
            return {}

        for lang in self.languages:
            output_file = os.path.join(
                output_dir,
                f"{base_name}_{self.language_labels[lang]}.mp3"
            )

            try:
                logger.info(f"변환 중: {self.language_labels[lang]} - {output_file}")
                converter = DocumentToSpeech(lang=lang)
                converter.text_to_speech(text, output_file, slow=False)
                results[lang] = output_file
                logger.info(f"완료: {output_file}")
            except Exception as e:
                logger.error(f"실패: {self.language_labels[lang]} - {str(e)}")
                results[lang] = None

        return results

    def convert_batch_all(self, input_file, output_dir=None):
        """모든 조합 생성 (3가지 속도 + 4가지 언어 = 12개 파일)"""
        if output_dir is None:
            output_dir = '.'

        input_path = Path(input_file)
        if not input_path.exists():
            logger.error(f"파일을 찾을 수 없습니다: {input_file}")
            return {}

        base_name = input_path.stem
        os.makedirs(output_dir, exist_ok=True)

        results = {}
        total = len(self.speeds) * len(self.languages)
        current = 0

        try:
            text = DocumentToSpeech().extract_text(input_file)
        except Exception as e:
            logger.error(f"텍스트 추출 실패: {str(e)}")
            return {}

        for lang in self.languages:
            for speed in self.speeds:
                current += 1
                slow = self.get_speed_param(speed)
                key = f"{lang}_{speed}"

                output_file = os.path.join(
                    output_dir,
                    f"{base_name}_{self.language_labels[lang]}_{self.speed_labels[speed]}.mp3"
                )

                try:
                    logger.info(f"[{current}/{total}] {self.language_labels[lang]} - {self.speed_labels[speed]}")
                    converter = DocumentToSpeech(lang=lang)
                    converter.text_to_speech(text, output_file, slow=slow)
                    results[key] = output_file
                    logger.info(f"완료: {output_file}")
                except Exception as e:
                    logger.error(f"실패: {key} - {str(e)}")
                    results[key] = None

        return results


def main():
    """메인 함수 - 테스트"""
    print("=" * 60)
    print("배치 음성 변환 도구")
    print("=" * 60)

    input_file = 'test_files/sample.txt'
    output_dir = 'batch_output'

    if not os.path.exists(input_file):
        print(f"오류: {input_file}을 찾을 수 없습니다")
        return

    converter = BatchConverter()

    print("\n[1] 속도별 배치 변환 (같은 언어)")
    print("-" * 60)
    results = converter.convert_batch_by_speed(input_file, output_dir)
    for speed, file in results.items():
        if file:
            size = os.path.getsize(file) / (1024 * 1024)
            print(f"  ✓ {speed:8} → {Path(file).name:40} ({size:.1f}MB)")
        else:
            print(f"  ✗ {speed:8} → 실패")

    print("\n[2] 언어별 배치 변환 (같은 속도)")
    print("-" * 60)
    results = converter.convert_batch_by_language(input_file, output_dir)
    for lang, file in results.items():
        if file:
            size = os.path.getsize(file) / (1024 * 1024)
            print(f"  ✓ {lang:2} → {Path(file).name:40} ({size:.1f}MB)")
        else:
            print(f"  ✗ {lang:2} → 실패")

    print("\n" + "=" * 60)
    print(f"생성된 파일: {output_dir}/ 폴더")
    print("=" * 60)


if __name__ == '__main__':
    main()
