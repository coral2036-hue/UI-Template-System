# 한국어 문서 음성 변환 도구 - 설치 및 실행 가이드

## 프로젝트 개요

한국어 텍스트 문서(.txt, .docx, .pdf)를 MP3 음성 파일로 자동 변환하는 도구입니다.

### 두 가지 사용 방법 제공:
1. **커맨드라인 도구** - `document_to_speech.py`
2. **웹 인터페이스** - `web_app.py` (브라우저에서 파일 업로드 및 다운로드)

---

## 설치 방법

### 1단계: 필수 라이브러리 설치

```bash
pip install -r requirements.txt
```

또는 개별 설치:

```bash
pip install gTTS==2.4.0 python-docx==1.1.2 pdfplumber==0.11.0 tqdm==4.66.2 Flask==3.0.0 Flask-CORS==4.0.0 Werkzeug==3.0.1
```

---

## 사용 방법

### 방법 1: 커맨드라인 도구 사용

#### 기본 사용

```bash
python document_to_speech.py <입력파일>
```

**예시:**
```bash
python document_to_speech.py sample.txt
python document_to_speech.py document.docx
python document_to_speech.py report.pdf
```

#### 출력 파일명 지정

```bash
python document_to_speech.py <입력파일> <출력파일>
```

**예시:**
```bash
python document_to_speech.py sample.txt my_audio.mp3
python document_to_speech.py document.docx output.mp3
```

#### 느린 속도로 변환

```bash
python document_to_speech.py <입력파일> --slow
```

#### 다른 언어로 변환

```bash
python document_to_speech.py <입력파일> --lang <언어코드>
```

**지원 언어:**
- `ko` (한국어, 기본값)
- `en` (영어)
- `ja` (일본어)
- `zh` (중국어)

---

### 방법 2: 웹 인터페이스 사용 (추천)

웹 브라우저에서 파일을 업로드하고 음성 파일을 다운로드할 수 있습니다.

#### 웹 서버 시작

```bash
python web_app.py
```

**출력:**
```
* Running on http://127.0.0.1:5000
```

#### 웹 브라우저에서 접속

브라우저를 열고 다음 주소로 이동합니다:

```
http://127.0.0.1:5000
```

#### 웹 인터페이스 사용법

1. **파일 선택**
   - 클릭하여 파일 선택 또는 파일을 드래그&드롭
   - 지원 형식: .txt, .docx, .pdf

2. **옵션 설정** (선택사항)
   - 느린 속도로 읽기: 체크박스
   - 음성 언어: 드롭다운 메뉴에서 선택

3. **변환 시작**
   - "음성으로 변환" 버튼 클릭
   - 변환이 진행됩니다 (진행 표시 바)

4. **파일 다운로드**
   - 변환 완료 후 "MP3 파일 다운로드" 버튼으로 저장
   - 로컬 컴퓨터에 MP3 파일이 저장됩니다

---

## 파일 구조

```
project/
├── document_to_speech.py       # 커맨드라인 도구
├── web_app.py                  # Flask 웹 애플리케이션
├── requirements.txt            # 의존성 목록
├── README.md                   # 기능 설명서
├── SETUP_GUIDE.md             # 이 파일
├── templates/
│   └── index.html             # 웹 인터페이스 HTML
├── static/
│   ├── style.css              # 웹 스타일시트
│   └── script.js              # 웹 인터페이스 JavaScript
├── uploads/                   # 임시 업로드 폴더 (자동 생성)
├── outputs/                   # 변환된 MP3 파일 저장 폴더
└── test_files/
    ├── sample.txt             # 텍스트 파일 샘플
    ├── sample.docx            # Word 파일 샘플
    └── sample.pdf             # PDF 파일 샘플
```

---

## 테스트 방법

### 1. 커맨드라인 도구 테스트

```bash
python document_to_speech.py test_files/sample.txt test_output.mp3
```

생성된 `test_output.mp3` 파일을 재생하여 음성을 확인합니다.

### 2. 웹 인터페이스 테스트

```bash
python web_app.py
```

브라우저에서 `http://127.0.0.1:5000` 접속하여:
- test_files/sample.txt 업로드
- 변환 시작
- MP3 파일 다운로드
- 재생하여 음성 확인

---

## 로그 파일

변환 과정의 상세 로그는 다음 파일에 저장됩니다:

```
document_to_speech.log
```

로그 내용 확인:

```bash
# Linux/Mac
cat document_to_speech.log

# Windows PowerShell
Get-Content document_to_speech.log
```

---

## 주의사항

### 인터넷 연결 필수
gTTS는 Google 서버를 이용하므로 인터넷이 필요합니다.

### 파일 크기 제한
- 웹 인터페이스: 최대 50MB
- 커맨드라인: 제한 없음 (로컬 처리만 사용하면 더 큰 파일도 가능)

### 텍스트 파일 인코딩
.txt 파일은 **UTF-8 인코딩**을 권장합니다.

### 음성 품질
- 특수문자가 많으면 발음이 부자연스러울 수 있습니다
- 정리된 텍스트를 사용하는 것을 권장합니다

---

## 트러블슈팅

### 문제: "ModuleNotFoundError: No module named 'gTTS'"

**해결:**
```bash
pip install -r requirements.txt
```

### 문제: 포트 5000이 이미 사용 중

**해결:** 웹_app.py 마지막 줄 수정:
```python
app.run(debug=True, host='127.0.0.1', port=5001)  # 5001로 변경
```

### 문제: 웹 인터페이스 접속 불가

**해결:**
1. Flask 서버 재시작
2. 방화벽 확인
3. 포트 설정 확인

### 문제: 음성 파일이 생성되지 않음

**해결:**
1. 인터넷 연결 확인
2. 파일 형식 확인 (.txt, .docx, .pdf)
3. 파일이 비어있지는 않은지 확인

---

## 성능 최적화

### 큰 파일 처리
- 50MB 이상의 파일은 작은 부분으로 나누어 처리
- 느린 인터넷 속도인 경우 청크 크기 조정 가능

### 병렬 처리
여러 파일을 동시에 처리하려면:

```bash
# Linux/Mac
python document_to_speech.py file1.txt &
python document_to_speech.py file2.txt &
python document_to_speech.py file3.txt &

# Windows
start python document_to_speech.py file1.txt
start python document_to_speech.py file2.txt
start python document_to_speech.py file3.txt
```

---

## 추가 옵션

### 커맨드라인 도움말

```bash
python document_to_speech.py --help
```

### 웹 서버 옵션

debug 모드 비활성화 (프로덕션):
```python
# web_app.py 마지막 줄
app.run(debug=False, host='0.0.0.0', port=5000)
```

---

## 다음 단계

1. **배포**: 프로덕션 환경에 배포하려면 Gunicorn 사용 권장
   ```bash
   pip install gunicorn
   gunicorn web_app:app
   ```

2. **커스터마이징**: 
   - 언어 추가
   - 음성 스타일 변경
   - UI 디자인 수정

3. **통합**: 다른 애플리케이션에 API로 통합

---

## 지원

문제가 발생하면:
1. 로그 파일 확인 (`document_to_speech.log`)
2. 에러 메시지 읽기
3. 트러블슈팅 섹션 참고
4. 인터넷 연결 확인
