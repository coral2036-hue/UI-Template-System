# 한국어 문서 음성 변환 (Document to Speech)

한국어 텍스트 문서를 음성(MP3)으로 자동 변환하는 Python 도구입니다.

## 기능

- ✅ **다양한 문서 포맷 지원**: .txt, .docx, .pdf
- ✅ **한국어 자동 지원**: gTTS를 통한 자연스러운 한국어 음성
- ✅ **간단한 사용법**: 명령어 한 줄로 변환 완료
- ✅ **음성 속도 조절**: 느린/보통 속도 선택 가능
- ✅ **로깅 시스템**: 상세한 변환 로그 기록
- ✅ **에러 처리**: 안정적인 오류 관리 및 피드백

## 설치

### 1. Python 설치
Python 3.7 이상이 필요합니다. [python.org](https://www.python.org)에서 설치하세요.

### 2. 라이브러리 설치

```bash
pip install -r requirements.txt
```

또는 개별 설치:

```bash
pip install gTTS python-docx pdfplumber tqdm
```

## 사용 방법

### 기본 사용법

```bash
python document_to_speech.py <입력파일>
```

**예시:**
```bash
python document_to_speech.py sample.txt
python document_to_speech.py my_document.docx
python document_to_speech.py report.pdf
```

### 출력 파일명 지정

```bash
python document_to_speech.py <입력파일> <출력파일>
```

**예시:**
```bash
python document_to_speech.py sample.txt my_audio.mp3
python document_to_speech.py document.docx output.mp3
```

### 느린 속도로 변환

```bash
python document_to_speech.py <입력파일> --slow
```

**예시:**
```bash
python document_to_speech.py sample.txt --slow
python document_to_speech.py document.docx output.mp3 --slow
```

### 다른 언어로 변환

```bash
python document_to_speech.py <입력파일> --lang <언어코드>
```

**언어 코드 예시:**
- `ko`: 한국어 (기본값)
- `en`: 영어
- `ja`: 일본어
- `zh`: 중국어

**예시:**
```bash
python document_to_speech.py sample.txt --lang en
```

## 예시

### 예시 1: 기본 사용
```bash
$ python document_to_speech.py hello.txt

2024-04-14 10:30:45,123 - INFO - 파일에서 텍스트 추출 중: hello.txt
2024-04-14 10:30:45,234 - INFO - 텍스트 추출 완료: 150 글자
2024-04-14 10:30:46,345 - INFO - 음성 변환 시작: hello.mp3
2024-04-14 10:30:50,456 - INFO - 음성 변환 완료: hello.mp3 (0.25 MB)
2024-04-14 10:30:50,567 - INFO - 변환 완료: hello.txt → hello.mp3

✓ 변환 완료!
생성 파일: hello.mp3
```

### 예시 2: 출력 파일명 지정
```bash
python document_to_speech.py document.docx my_audio.mp3 --slow
```

### 예시 3: DOCX 파일 변환
```bash
python document_to_speech.py presentation.docx presentation_audio.mp3
```

## 지원되는 파일 포맷

| 포맷 | 확장자 | 설명 |
|------|--------|------|
| Text | .txt | 일반 텍스트 파일 |
| Word | .docx | Microsoft Word 2007 이상 |
| Word (구버전) | .doc | Microsoft Word 97-2003 |
| PDF | .pdf | PDF 문서 |

## 로그 확인

변환 과정의 상세 로그는 `document_to_speech.log` 파일에 저장됩니다.

```bash
# 로그 파일 내용 확인
cat document_to_speech.log
```

## 주의사항

1. **인터넷 연결 필수**: gTTS는 Google 서버를 이용하므로 인터넷이 필요합니다.
2. **파일 인코딩**: .txt 파일은 UTF-8 인코딩을 권장합니다.
3. **파일 크기**: 매우 긴 문서의 경우 변환에 시간이 걸릴 수 있습니다.
4. **특수문자**: 특수문자나 기호가 많으면 음성 인식이 부자연스러울 수 있습니다.

## 트러블슈팅

### 문제: "지원하지 않는 파일 포맷입니다"
**해결**: 파일 확장자를 확인하세요. 지원되는 포맷은 .txt, .docx, .pdf입니다.

### 문제: "파일을 찾을 수 없습니다"
**해결**: 입력 파일의 경로와 파일명을 정확히 확인하세요.

### 문제: 음성이 너무 빠름
**해결**: `--slow` 옵션을 추가하세요.

### 문제: 네트워크 오류 발생
**해결**: 인터넷 연결을 확인하고 다시 시도하세요. 특정 IP 차단 문제로 실패할 수 있으므로, 시간을 두고 재시도해보세요.

## 시스템 요구사항

- Python 3.7 이상
- 인터넷 연결
- 200MB 이상의 디스크 여유공간 (MP3 파일 저장용)

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

## 기술 정보

### 사용 라이브러리
- **gTTS**: Google Text-to-Speech API를 이용한 음성 변환
- **python-docx**: Word 문서(.docx) 읽기
- **pdfplumber**: PDF 문서에서 텍스트 추출
- **tqdm**: 진행 상황 표시

### 동작 원리
1. 입력 파일을 읽어 텍스트를 추출합니다.
2. 추출된 텍스트를 정리하고 청크로 분할합니다.
3. gTTS를 통해 각 청크를 음성으로 변환합니다.
4. 음성 파일들을 병합하여 최종 MP3 파일을 생성합니다.

## 피드백 및 개선사항

버그 리포트나 개선 제안은 언제든 환영합니다!
