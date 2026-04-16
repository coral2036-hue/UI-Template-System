# 🚀 EXE 파일 및 온라인 배포 가이드

Executor를 **EXE 파일** 또는 **온라인 웹사이트**로 배포할 수 있습니다.

---

## 📦 방법 1: EXE 파일로 배포 (Windows)

### 목표
- 클릭 한 번으로 실행
- Python 설치 불필요
- 팀원들과 쉽게 공유

### Step 1: PyInstaller 설치

```bash
pip install pyinstaller
```

### Step 2: EXE 생성

```bash
cd UI_TEMPLATE_SYSTEM

# 단순 CLI 버전
pyinstaller --onefile scripts/executor.py \
  --name ExecutorCLI \
  --console \
  --icon=icon.ico

# 웹 대시보드 버전 (권장)
pyinstaller --onefile scripts/executor_api.py \
  --name ExecutorDashboard \
  --console \
  --add-data "dashboard:dashboard" \
  --add-data "templates:templates"
```

### Step 3: 생성된 EXE 확인

```bash
dist/
├── ExecutorCLI.exe (CLI 버전)
└── ExecutorDashboard.exe (웹 대시보드 버전)
```

### Step 4: 실행

```bash
# 더블클릭 또는 터미널에서
.\ExecutorDashboard.exe

# 또는 포트 지정
.\ExecutorDashboard.exe --port 8080
```

---

## 🎯 EXE 사용 시나리오

### 시나리오 1: 팀원에게 배포

```
1. EXE 파일을 zip으로 압축
   └─ ExecutorDashboard.exe

2. 팀원에게 공유 (이메일, OneDrive, etc)

3. 팀원이 다운로드 후 실행
   └─ ExecutorDashboard.exe 더블클릭
   └─ http://localhost:5000 자동 접속
```

### 시나리오 2: 한국 은행 시스템에 배포

```
1. 보안 검사
   └─ 백신 검사
   └─ 코드 리뷰

2. 사내 배포 서버에 업로드
   └─ 모든 PC에서 다운로드 가능

3. 사용자가 실행
   └─ Python 설치 없이 바로 실행
```

---

## ⚠️ EXE 생성 시 주의사항

### 1. 의존성 패키지 포함

```bash
# requirements.txt 생성
pip freeze > requirements.txt

# 모든 패키지 포함하여 EXE 생성
pyinstaller --onefile scripts/executor_api.py \
  --hidden-import=flask \
  --hidden-import=flask_cors \
  --hidden-import=yaml
```

### 2. 윈도우 방화벽 허용

사용자가 처음 실행할 때:
- "Windows Defender 방화벽" 경고 표시
- "프라이빗 네트워크" 체크 후 "액세스 허용" 클릭

### 3. 파일 크기

- 단순 CLI: 30-50MB
- 웹 대시보드: 50-80MB

---

## 🌐 방법 2: 온라인 웹사이트로 배포

### 목표
- 누구나 어디서나 접속 가능
- 설치 불필요
- 항상 최신 버전

### 배포 플랫폼 선택

| 플랫폼 | 비용 | 난이도 | 추천 |
|--------|------|--------|------|
| **Heroku** | 무료~$7/월 | 쉬움 | ⭐⭐⭐ |
| **Replit** | 무료~$7/월 | 매우 쉬움 | ⭐⭐⭐ |
| **AWS** | 무료~$$$$ | 어려움 | ⭐⭐ |
| **구글 클라우드** | 무료~$$$$ | 어려움 | ⭐⭐ |
| **Azure** | 무료~$$$$ | 어려움 | ⭐⭐ |

**가장 쉬운 방법: Replit** (추천)

---

## 🚀 Replit으로 배포하기 (5분)

### Step 1: Replit 계정 생성

1. https://replit.com 접속
2. GitHub로 로그인 (또는 이메일)

### Step 2: 새 프로젝트 생성

1. "+ Create Repl" 클릭
2. "Import from GitHub" 선택
3. GitHub URL 입력: `https://github.com/your-repo`
4. "Import" 클릭

### Step 3: 설정 파일 추가

`replit.nix` 파일 생성:
```nix
{ pkgs }: {
  deps = [
    pkgs.python310
    pkgs.python310Packages.flask
    pkgs.python310Packages.flask-cors
  ];
  env = {
    PYTHONUNBUFFERED = "1";
  };
}
```

### Step 4: 시작 명령 설정

`.replit` 파일 수정:
```
run = "python UI_TEMPLATE_SYSTEM/scripts/executor_api.py --host 0.0.0.0 --port 3000"
```

### Step 5: 실행

1. "Run" 버튼 클릭
2. 웹팹이 자동 생성됨
3. 공유 링크 생성: https://your-project.replit.dev

---

## 🌐 Heroku로 배포하기 (10분)

### Step 1: Heroku 계정 생성

1. https://www.heroku.com 접속
2. 회원가입

### Step 2: Procfile 생성

프로젝트 루트에 `Procfile` 파일 생성:
```
web: python UI_TEMPLATE_SYSTEM/scripts/executor_api.py --host 0.0.0.0 --port $PORT
```

### Step 3: requirements.txt 생성

```bash
pip freeze > requirements.txt
```

### Step 4: Heroku CLI 설치

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli
```

### Step 5: 배포

```bash
# 로그인
heroku login

# 앱 생성
heroku create executor-dashboard

# 배포
git push heroku main

# 웹사이트 자동 생성
heroku open
```

**결과:** https://executor-dashboard.herokuapp.com

---

## 🔐 온라인 배포 시 보안 설정

### 1. 인증 추가

`executor_api.py` 수정:
```python
from flask import request
from functools import wraps

# 간단한 API 키 인증
API_KEY = "your-secret-key-123"

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        key = request.args.get('key') or request.headers.get('X-API-Key')
        if key != API_KEY:
            return jsonify({'error': 'Invalid API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/status')
@require_api_key
def api_status():
    return jsonify(executor.status())
```

### 2. HTTPS 강제

```python
from flask_talisman import Talisman

# HTTPS 강제
Talisman(app, force_https=True)
```

### 3. CORS 제한

```python
from flask_cors import CORS

# 특정 도메인만 허용
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"]
    }
})
```

### 4. Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(app)

@app.route('/api/status')
@limiter.limit("10 per minute")
def api_status():
    return jsonify(executor.status())
```

---

## 📊 배포 방식 비교

| 항목 | EXE | Replit | Heroku |
|------|-----|--------|--------|
| **설치** | 불필요 | 불필요 | 불필요 |
| **접속** | 로컬만 | 어디서나 | 어디서나 |
| **비용** | 무료 | 무료 | 무료~$7 |
| **난이도** | 중간 | 매우 쉬움 | 쉬움 |
| **속도** | 빠름 | 중간 | 중간 |
| **보안** | 높음 | 중간 | 설정 필요 |
| **공유** | 파일 전달 | URL 공유 | URL 공유 |
| **추천** | 로컬 팀 | 빠른 테스트 | 프로덕션 |

---

## 🎯 어떤 방식을 선택할까?

### EXE 파일
✅ **사용하면 좋은 경우:**
- 은행 같은 보안이 중요한 환경
- 인터넷 연결 불안정한 곳
- 사내 시스템
- 팀원과 공유

❌ **문제가 될 경우:**
- 여러 장소에서 접속
- 항상 최신 버전 필요

### 온라인 웹사이트 (Replit/Heroku)
✅ **사용하면 좋은 경우:**
- 전국 여러 지점
- 항상 최신 버전 제공
- 모바일에서도 접속
- 공개 가능한 업무

❌ **문제가 될 경우:**
- 보안이 매우 중요
- 인터넷 연결 불가
- 실시간 성능 필요

---

## 🚀 빠른 시작: 어떤 걸 먼저?

### 1단계: 로컬에서 테스트 (지금)
```bash
python scripts/executor_api.py --port 5000
# http://localhost:5000
```

### 2단계: EXE로 팀 공유 (1시간)
```bash
pyinstaller --onefile scripts/executor_api.py --name ExecutorDashboard
# dist/ExecutorDashboard.exe 공유
```

### 3단계: 온라인 배포 (선택, 1시간)
```bash
# Replit으로 배포
# https://executor-dashboard.replit.dev
```

---

## 📝 EXE 생성 스크립트

자동으로 EXE를 생성하는 배치 파일 생성:

**build_exe.bat**
```batch
@echo off
echo Building Executor Dashboard EXE...

pip install pyinstaller

cd UI_TEMPLATE_SYSTEM

pyinstaller --onefile scripts/executor_api.py ^
  --name ExecutorDashboard ^
  --console ^
  --icon=icon.ico ^
  --add-data "dashboard:dashboard"

echo.
echo ✅ EXE created: dist/ExecutorDashboard.exe
echo.
pause
```

**실행:**
```bash
build_exe.bat
```

---

## 🔗 배포 후 공유 방법

### EXE 파일 공유
```
1. dist/ExecutorDashboard.exe를 zip으로 압축
2. 이메일 또는 공유 드라이브에 업로드
3. 다운로드 링크 공유
4. 수신자가 exe 더블클릭으로 실행
```

### 온라인 웹사이트 공유
```
이 링크를 브라우저에 접속하세요:
https://executor-dashboard.replit.dev

또는 QR 코드:
[QR 코드]
```

---

## ⚙️ 팀 협업 설정

### 은행 내부망에 배포하기

1. **EXE 파일 방식**
   - IT 팀에 exe 파일 검사 요청
   - 사내 배포 서버에 업로드
   - 모든 PC에서 다운로드 가능

2. **온라인 방식**
   - 사내 Proxy를 통해 접속 가능하게 설정
   - 또는 VPN으로 접속

---

## 📋 체크리스트

### EXE 생성
- [ ] PyInstaller 설치: `pip install pyinstaller`
- [ ] EXE 생성: `pyinstaller --onefile scripts/executor_api.py`
- [ ] dist/ExecutorDashboard.exe 실행 확인
- [ ] 팀원에게 배포

### 온라인 배포 (Replit)
- [ ] Replit 계정 생성
- [ ] GitHub 리포지토리 연결
- [ ] replit.nix 파일 생성
- [ ] .replit 파일 수정
- [ ] "Run" 클릭
- [ ] 생성된 URL 공유

### 온라인 배포 (Heroku)
- [ ] Heroku 계정 생성
- [ ] Procfile 생성
- [ ] requirements.txt 생성
- [ ] Heroku CLI 설치
- [ ] `heroku create` 및 `git push heroku main`
- [ ] 생성된 URL 공유

---

## 🎁 추가 팁

### EXE 파일 크기 줄이기
```bash
pyinstaller --onefile --optimize=2 scripts/executor_api.py
```

### 아이콘 추가
```bash
pyinstaller --onefile --icon=myicon.ico scripts/executor_api.py
```

### 온라인 배포 모니터링
```bash
heroku logs --tail
```

---

## 📞 문제 해결

### EXE 실행 안 됨
1. 안티바이러스 확인
2. Python 버전 확인 (3.8 이상)
3. 관리자 권한으로 실행

### 온라인 배포 느림
1. 서버 업그레이드 (유료)
2. 데이터베이스 최적화
3. CDN 사용

---

**선택:** 
- 로컬만: **EXE 파일**
- 온라인: **Replit** (무료, 쉬움)
- 프로덕션: **Heroku** (비용 소모이지만 안정적)

---

**마지막 업데이트:** 2026-04-16
