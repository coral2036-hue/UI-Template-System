#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Python 스크립트를 Windows 실행 파일(.exe)로 변환하는 빌드 스크립트
PyInstaller를 사용합니다
"""

import os
import sys
import subprocess


def install_pyinstaller():
    """PyInstaller 설치"""
    print("[1/5] PyInstaller 설치 중...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'pyinstaller', '-q'],
                      check=True)
        print("      [OK] PyInstaller 설치 완료")
        return True
    except Exception as e:
        print(f"      [오류] PyInstaller 설치 실패: {e}")
        return False


def build_cli_exe():
    """커맨드라인 도구를 exe로 변환"""
    print("\n[2/5] 커맨드라인 도구(document_to_speech.py) → exe 변환...")

    cmd = [
        sys.executable, '-m', 'pyinstaller',
        '--onefile',
        '--console',
        '--name', 'DocumentToSpeech',
        '--icon', 'NONE',
        'document_to_speech.py'
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print("      [OK] 변환 완료")
        print("      위치: dist/DocumentToSpeech.exe")
        return True
    except Exception as e:
        print(f"      [오류] 변환 실패: {e}")
        return False


def build_gui_exe():
    """GUI 앱을 exe로 변환"""
    print("\n[3/5] GUI 앱(document_to_speech_gui.py) → exe 변환...")

    cmd = [
        sys.executable, '-m', 'pyinstaller',
        '--onefile',
        '--windowed',
        '--name', 'DocumentToSpeechApp',
        '--icon', 'NONE',
        'document_to_speech_gui.py'
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print("      [OK] 변환 완료")
        print("      위치: dist/DocumentToSpeechApp.exe")
        return True
    except Exception as e:
        print(f"      [오류] 변환 실패: {e}")
        return False


def cleanup():
    """빌드 임시 파일 정리"""
    print("\n[4/5] 임시 파일 정리 중...")
    try:
        # build 폴더 제거
        if os.path.exists('build'):
            import shutil
            shutil.rmtree('build')

        # spec 파일 제거
        for file in os.listdir('.'):
            if file.endswith('.spec'):
                os.remove(file)

        print("      [OK] 정리 완료")
        return True
    except Exception as e:
        print(f"      [경고] 정리 중 오류 발생: {e}")
        return True


def main():
    """메인 함수"""
    print("=" * 60)
    print("Python 스크립트 → Windows EXE 파일 변환")
    print("=" * 60)

    # 현재 디렉토리 확인
    current_dir = os.getcwd()
    print(f"\n작업 디렉토리: {current_dir}")

    # 필요 파일 확인
    print("\n필요 파일 확인:")
    required_files = [
        'document_to_speech.py',
        'document_to_speech_gui.py',
        'requirements.txt'
    ]

    for file in required_files:
        if os.path.exists(file):
            print(f"  ✓ {file}")
        else:
            print(f"  ✗ {file} (찾을 수 없음)")

    print("\n" + "=" * 60)
    print("빌드 시작...")
    print("=" * 60)

    # 빌드 단계
    if not install_pyinstaller():
        sys.exit(1)

    if not build_cli_exe():
        sys.exit(1)

    if not build_gui_exe():
        sys.exit(1)

    cleanup()

    # 최종 결과
    print("\n[5/5] 빌드 완료!")
    print("=" * 60)
    print("\n생성된 파일:")
    dist_dir = os.path.join(current_dir, 'dist')

    if os.path.exists(dist_dir):
        exe_files = [f for f in os.listdir(dist_dir) if f.endswith('.exe')]
        for exe_file in exe_files:
            exe_path = os.path.join(dist_dir, exe_file)
            size = os.path.getsize(exe_path) / (1024 * 1024)
            print(f"  ✓ {exe_file} ({size:.1f} MB)")
            print(f"    경로: {exe_path}")
    else:
        print("  dist 폴더를 찾을 수 없습니다")

    print("\n" + "=" * 60)
    print("설명:")
    print("  - DocumentToSpeech.exe: 커맨드라인 도구")
    print("    사용: DocumentToSpeech.exe input.txt output.mp3")
    print("")
    print("  - DocumentToSpeechApp.exe: GUI 데스크톱 앱")
    print("    사용: 더블클릭으로 실행")
    print("=" * 60)


if __name__ == '__main__':
    main()
