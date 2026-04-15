# 앱 빌드 가이드 (데스크톱 앱 & EXE 파일)

## 📋 개요

이 가이드에서는 음성 변환 도구를 두 가지 방식으로 앱화하는 방법을 설명합니다:

1. **데스크톱 GUI 앱** - 윈도우 창에서 실행되는 애플리케이션
2. **EXE 실행 파일** - Python 설치 없이 Windows에서 독립적으로 실행

---

## 방법 1: 데스크톱 GUI 앱 실행

### 설정

```bash
pip install pysimplegui pillow
```

### 실행

```bash
python document_to_speech_gui.py
```

### GUI 앱 기능

- ✅ 파일 선택 (UI 클릭/드래그)
- ✅ 옵션 설정 (속도, 언어)
- ✅ 실시간 변환 진행 상황 표시
- ✅ 완료 후 출력 폴더 자동 열기
- ✅ 직관적인 윈도우 인터페이스

### 스크린샷 (예상)

```
┌─────────────────────────────────────────────┐
│  한국어 문서 음성 변환                      │
│  문서를 MP3 음성 파일로 변환하세요          │
├─────────────────────────────────────────────┤
│ 1. 파일 선택:                                │
│   [파일경로____________] [파일 선택]        │
│                                               │
│ 2. 옵션 설정:                                │
│   ☐ 느린 속도로 읽기                       │
│   음성 언어: [한국어 (ko) ▼]               │
│                                               │
│ 3. 출력 파일명:                             │
│   [output.mp3_____________]                  │
│                                               │
│ ┌─────────────────────────────────────────┐ │
│ │ [변환 로그...]                          │ │
│ │ [시작] 파일 변환 시작...                │ │
│ │ 입력 파일: sample.txt                   │ │
│ │ 출력 파일: output.mp3                   │ │
│ │ [성공] 변환 완료!                       │ │
│ └─────────────────────────────────────────┘ │
│                                               │
│ [음성으로 변환] [출력 폴더 열기] [종료]    │
└─────────────────────────────────────────────┘
```

---

## 방법 2: EXE 파일 빌드

### 사전 요구사항

1. **PyInstaller 설치** (자동으로 됨)
2. **빌드 스크립트 준비**

### 빌드 단계

#### 단계 1: 빌드 스크립트 실행

```bash
python build_exe.py
```

**출력 예시:**
```
============================================================
Python 스크립트 → Windows EXE 파일 변환
============================================================

작업 디렉토리: C:\Users\...\클로드작업물

필요 파일 확인:
  ✓ document_to_speech.py
  ✓ document_to_speech_gui.py
  ✓ requirements.txt

============================================================
빌드 시작...
============================================================

[1/5] PyInstaller 설치 중...
      [OK] PyInstaller 설치 완료

[2/5] 커맨드라인 도구(document_to_speech.py) → exe 변환...
      [OK] 변환 완료
      위치: dist/DocumentToSpeech.exe

[3/5] GUI 앱(document_to_speech_gui.py) → exe 변환...
      [OK] 변환 완료
      위치: dist/DocumentToSpeechApp.exe

[4/5] 임시 파일 정리 중...
      [OK] 정리 완료

[5/5] 빌드 완료!
```

#### 단계 2: 생성된 파일 확인

```
dist/
├── DocumentToSpeech.exe      (CLI 버전, ~50MB)
└── DocumentToSpeechApp.exe   (GUI 버전, ~60MB)
```

---

## 사용 방법

### DocumentToSpeechApp.exe (GUI 버전)

**가장 간단한 방법:**

1. `dist` 폴더의 `DocumentToSpeechApp.exe` 더블클릭
2. 앱 실행
3. 파일 선택 → 변환 시작
4. MP3 파일 다운로드 완료

**명령줄에서 실행:**
```bash
dist\DocumentToSpeechApp.exe
```

### DocumentToSpeech.exe (CLI 버전)

**명령줄에서 사용:**

```bash
# 기본 사용
dist\DocumentToSpeech.exe input.txt

# 출력 파일 지정
dist\DocumentToSpeech.exe input.docx output.mp3

# 느린 속도
dist\DocumentToSpeech.exe input.pdf --slow

# 다른 언어
dist\DocumentToSpeech.exe input.txt --lang en
```

---

## EXE 파일 배포

### 다른 컴퓨터에서 사용

1. **요구사항**: Windows 7 이상
2. **설치**: 필요 없음 (독립 실행)
3. **배포**: exe 파일만 배포하면 됨

### 배포 방법

```bash
# dist 폴더의 exe 파일을 다른 사람에게 공유
# 예: DocumentToSpeechApp.exe (60MB)
```

---

## 커스터마이징

### GUI 앱 수정

`document_to_speech_gui.py`를 편집하여:

1. **윈도우 크기 변경**
   ```python
   window = sg.Window(..., size=(700, 700), ...)
   # 700을 다른 값으로 변경
   ```

2. **기본 언어 변경**
   ```python
   default_value='한국어 (ko)',
   # 'English (en)' 등으로 변경
   ```

3. **색상 테마 변경**
   ```python
   sg.theme('DarkBlue3')  # 다른 테마로 변경
   ```

4. **윈도우 아이콘 추가**
   ```bash
   # 1. icon.ico 파일 준비
   # 2. build_exe.py 수정:
   '--icon', 'icon.ico',
   ```

### 빌드 최적화

**파일 크기 줄이기:**

```python
# build_exe.py에서 다음 옵션 추가
'--onefile',
'--noupx',  # UPX 사용 안함
```

**로드 시간 개선:**

```python
# document_to_speech_gui.py 수정
# 불필요한 import 제거
```

---

## 트러블슈팅

### 문제: "Python이 설치되지 않았습니다"

**원인**: 시스템에 Python이 없음
**해결**: `DocumentToSpeechApp.exe` 사용 (Python 불필요)

### 문제: EXE 파일이 바이러스로 감지됨

**원인**: 일부 백신이 PyInstaller로 만든 exe를 의심함
**해결**:
1. 신뢰할 수 있는 출처에서 다운로드
2. 백신 제외 목록에 추가
3. 다시 빌드 (최신 PyInstaller 사용)

### 문제: "음성이 생성되지 않음"

**원인**: 인터넷 연결 필요 (gTTS 사용)
**해결**: 인터넷 연결 확인

### 문제: EXE 빌드 실패

**해결 단계:**

```bash
# 1. 경로 확인
cd C:\Users\...\클로드작업물

# 2. Python 버전 확인
python --version

# 3. 필수 파일 확인
dir document_to_speech.py
dir document_to_speech_gui.py

# 4. PyInstaller 재설치
pip install --upgrade pyinstaller

# 5. 다시 빌드
python build_exe.py
```

---

## 성능 비교

| 항목 | GUI 앱 | CLI 앱 | 웹 앱 |
|------|--------|--------|-------|
| 실행 방식 | exe 더블클릭 | 명령줄 | 브라우저 |
| 파일 크기 | ~60MB | ~50MB | - |
| Python 필요 | ❌ | ❌ | ✅ |
| 설치 필요 | ❌ | ❌ | ❌ |
| 사용자 친화성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 배포 난이도 | 쉬움 | 쉬움 | 중간 |

---

## 다음 단계

### 1. 고급 기능 추가

```python
# document_to_speech_gui.py에 추가:
- 배치 처리 (여러 파일 동시 변환)
- 변환 이력 저장
- 음성 스타일 선택
- 자동 저장 폴더 지정
```

### 2. 설치 프로그램 만들기

```bash
# Inno Setup 사용:
pip install cx_Freeze
# 또는 NSIS 사용
```

### 3. 아이콘 & 스플래시 추가

```bash
# icon.ico 준비 (256x256px 이상)
# splash.png 준비 (사용자 정의 스플래시 화면)
```

### 4. 버전 관리

```python
# document_to_speech_gui.py
VERSION = "1.0.0"
```

---

## 요약

```
빠른 시작:
1. GUI 앱 즉시 사용:
   python document_to_speech_gui.py

2. EXE로 변환:
   python build_exe.py

3. 배포:
   dist\DocumentToSpeechApp.exe 공유
```

---

## 추가 리소스

- PySimpleGUI 문서: https://pysimplegui.readthedocs.io
- PyInstaller 문서: https://pyinstaller.readthedocs.io
- gTTS 문서: https://gtts.readthedocs.io
