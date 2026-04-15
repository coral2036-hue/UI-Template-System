#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
한국어 문서 음성 변환 데스크톱 앱 (GUI)
PySimpleGUI를 이용한 윈도우 애플리케이션
"""

import PySimpleGUI as sg
import os
import threading
from pathlib import Path
from document_to_speech import DocumentToSpeech

# PySimpleGUI 테마 설정
sg.theme('DarkBlue3')
sg.set_options(font=('Arial', 10))

# 색상 설정
COLOR_PRIMARY = '#4F46E5'
COLOR_SUCCESS = '#10B981'
COLOR_ERROR = '#EF4444'


def create_window():
    """윈도우 레이아웃 생성"""

    layout = [
        # 타이틀
        [sg.Text('한국어 문서 음성 변환',
                font=('Arial', 20, 'bold'),
                text_color=COLOR_PRIMARY)],
        [sg.Text('문서를 MP3 음성 파일로 변환하세요',
                font=('Arial', 10),
                text_color='gray')],

        [sg.HorizontalSeparator()],

        # 파일 선택
        [sg.Text('1. 파일 선택:', font=('Arial', 11, 'bold'))],
        [sg.InputText(key='-FILE-', size=(50, 1),
                     disabled=True,
                     background_color='white',
                     text_color='black'),
         sg.FileBrowse('파일 선택',
                      file_types=(('문서 파일', '*.txt;*.docx;*.pdf;*.doc'),
                                ('모든 파일', '*.*')))],

        [sg.HorizontalSeparator()],

        # 옵션
        [sg.Text('2. 옵션 설정:', font=('Arial', 11, 'bold'))],
        [sg.Checkbox('느린 속도로 읽기', key='-SLOW-', default=False)],

        [sg.Text('음성 언어:'),
         sg.Combo(['한국어 (ko)', '영어 (en)', '일본어 (ja)', '중국어 (zh)'],
                 default_value='한국어 (ko)',
                 key='-LANG-',
                 readonly=True,
                 size=(25, 1))],

        [sg.HorizontalSeparator()],

        # 출력 파일
        [sg.Text('3. 출력 파일명:', font=('Arial', 11, 'bold'))],
        [sg.InputText(key='-OUTPUT-', size=(50, 1),
                     background_color='white',
                     text_color='black')],

        [sg.HorizontalSeparator()],

        # 상태 메시지
        [sg.Multiline(size=(60, 8),
                     key='-OUTPUT_TEXT-',
                     disabled=True,
                     background_color='black',
                     text_color='lightgreen',
                     font=('Courier', 9))],

        [sg.HorizontalSeparator()],

        # 버튼
        [sg.Button('음성으로 변환', key='-CONVERT-',
                  size=(15, 2),
                  button_color=(COLOR_PRIMARY, 'white')),
         sg.Button('출력 폴더 열기', key='-OPEN_FOLDER-',
                  size=(15, 2),
                  button_color=(COLOR_SUCCESS, 'white')),
         sg.Button('종료', size=(15, 2),
                  button_color=('red', 'white'))],
    ]

    window = sg.Window('문서 음성 변환 도구',
                      layout,
                      size=(700, 700),
                      resizable=True,
                      finalize=True)

    return window


def update_output(window, message, message_type='info'):
    """출력 텍스트 업데이트"""
    colors = {
        'info': 'lightgreen',
        'success': 'lightgreen',
        'error': 'red',
        'warning': 'yellow'
    }

    text_elem = window['-OUTPUT_TEXT-']
    text_elem.update(text_elem.get() + message + '\n',
                    text_color=colors.get(message_type, 'lightgreen'))

    # 스크롤을 맨 아래로
    text_elem.set_vscroll_position(1.0)


def clear_output(window):
    """출력 텍스트 초기화"""
    window['-OUTPUT_TEXT-'].update('')


def convert_file(file_path, output_path, slow, lang, window):
    """파일 변환 (별도 스레드에서 실행)"""
    try:
        if not file_path:
            update_output(window, '[오류] 파일을 선택해주세요', 'error')
            return

        if not os.path.exists(file_path):
            update_output(window, f'[오류] 파일을 찾을 수 없습니다: {file_path}', 'error')
            return

        # 출력 파일명 자동 설정
        if not output_path:
            base_name = Path(file_path).stem
            output_path = f"{base_name}_audio.mp3"

        update_output(window, f'[시작] 파일 변환 시작...', 'info')
        update_output(window, f'입력 파일: {file_path}', 'info')
        update_output(window, f'출력 파일: {output_path}', 'info')
        update_output(window, f'옵션: 속도={("느림" if slow else "보통")}, 언어={lang}', 'info')
        update_output(window, '', 'info')

        # 음성 변환
        converter = DocumentToSpeech(lang=lang)
        result = converter.convert(file_path, output_path, slow=slow)

        update_output(window, '[성공] 변환 완료!', 'success')
        update_output(window, f'생성된 파일: {result}', 'success')

        # 출력 경로 업데이트
        window['-OUTPUT-'].update(output_path)

    except Exception as e:
        update_output(window, f'[오류] 변환 실패: {str(e)}', 'error')


def main():
    """메인 함수"""
    window = create_window()

    while True:
        event, values = window.read()

        # 종료
        if event == sg.WINDOW_CLOSED or event == '종료':
            break

        # 파일 선택 후 자동으로 출력 파일명 제안
        if event == '-FILE-':
            file_path = values['-FILE-']
            if file_path:
                base_name = Path(file_path).stem
                output_name = f"{base_name}_audio.mp3"
                window['-OUTPUT-'].update(output_name)

        # 음성 변환
        if event == '-CONVERT-':
            file_path = values['-FILE-']
            output_path = values['-OUTPUT-']
            slow = values['-SLOW-']
            lang_text = values['-LANG-']

            # 언어 코드 추출
            lang = lang_text.split('(')[1].rstrip(')')

            clear_output(window)

            # 별도 스레드에서 변환 실행 (UI 반응성 유지)
            thread = threading.Thread(
                target=convert_file,
                args=(file_path, output_path, slow, lang, window),
                daemon=True
            )
            thread.start()

        # 출력 폴더 열기
        if event == '-OPEN_FOLDER-':
            output_path = values['-OUTPUT-']
            if output_path:
                output_dir = os.path.dirname(os.path.abspath(output_path))
                if os.path.exists(output_dir):
                    os.startfile(output_dir)
                else:
                    sg.popup_error('폴더를 찾을 수 없습니다')
            else:
                sg.popup_warning('출력 경로를 지정해주세요')

    window.close()


if __name__ == '__main__':
    main()
