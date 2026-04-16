# 🌐 웹 기반 Executor 대시보드 가이드

**Executor를 웹 브라우저에서 사용할 수 있습니다!**

---

## 🚀 시작하기

### 1단계: Flask 설치

```bash
pip install flask flask-cors
```

### 2단계: 웹 서버 시작

```bash
cd UI_TEMPLATE_SYSTEM

# 기본 포트 5000
python scripts/executor_api.py

# 또는 다른 포트 사용
python scripts/executor_api.py --port 8080
```

### 3단계: 브라우저에서 접속

```
http://localhost:5000
```

---

## 🎯 웹 대시보드 기능

### 탭 1️⃣: 📊 상태 (Status)

**목적:** 시스템 전체 상태 한눈에 보기

| 기능 | 설명 |
|------|------|
| **🔄 시스템 상태** | 전체 시스템 통계 및 메트릭 |
| **📊 실시간 메트릭** | 현재 Error rate, Latency, Success rate |
| **📈 트렌드 분석** | 1시간/24시간/1주일 추이 |

**사용 예시:**
```
1. [상태 조회] 버튼 클릭
2. JSON 형식으로 전체 상태 표시
3. 메트릭 카드에 요약 정보 표시
```

---

### 탭 2️⃣: 📦 상품 (Product)

**목적:** 상품 생성 및 관리

| 기능 | 설명 |
|------|------|
| **📦 상품 목록** | 등록된 모든 상품 조회 |
| **➕ 새 상품 생성** | 신규 상품 자동 생성 |
| **🔍 상품 정보** | 특정 상품의 상세 정보 |

**사용 예시:**

#### 새 상품 생성
```
1. 상품명 입력: "선물거래"
2. DB 함수명 입력: "branchq_get_all_futures_info"
3. [상품 생성] 버튼 클릭
4. 결과 메시지 확인
```

#### 상품 정보 조회
```
1. 상품 ID 입력: "credit-card"
2. [정보 조회] 버튼 클릭
3. 스크린 수, 버전, 상태 등 확인
```

---

### 탭 3️⃣: 🚀 배포 (Deploy)

**목적:** 배포 실행 및 제어

| 기능 | 설명 |
|------|------|
| **🚀 배포 시작** | 카나리 또는 프로덕션 배포 |
| **📊 배포 상태** | 배포 히스토리 조회 |
| **⏸️ 배포 제어** | 일시중지/재개 |

**사용 예시:**

#### 배포 시작
```
1. 상품 ID 입력 (선택): "futures"
2. 버전 입력: "1.0.0"
3. 스테이지 선택: "Canary"
4. [배포 시작] 클릭
5. 배포 ID 확인
```

#### 배포 상태 확인
```
1. [상태 조회] 클릭
2. 최근 배포 목록 확인
3. 각 배포의 진행 상황 파악
```

#### 배포 제어
```
1. 배포 ID 입력: "deploy-1713268805"
2. [일시 중지] 또는 [재개] 클릭
3. 결과 확인
```

---

### 탭 4️⃣: 📈 메트릭 (Metrics)

**목적:** 성능 메트릭 모니터링

| 기능 | 설명 |
|------|------|
| **📊 메트릭 수집** | 실시간 메트릭 데이터 |
| **📊 메트릭 요약** | 시각적 요약 카드 |
| **🔍 메트릭 해석** | 임계값 가이드 |

**메트릭 해석:**

```
✅ 정상:
  • Error rate < 0.1%
  • P95 Latency < 250ms
  • Success rate > 99.5%

⚠️ 경고:
  • Error rate 0.1-0.5%
  • P95 Latency 250-500ms
  • Success rate 99-99.5%

🚨 긴급 (즉시 롤백 필요):
  • Error rate > 0.5%
  • P95 Latency > 500ms
  • Success rate < 99%
```

**사용 예시:**
```
1. [메트릭 수집] 클릭
2. 상세 JSON 확인
3. 요약 카드에서 한눈에 파악
4. 메트릭 해석 가이드 참고
```

---

### 탭 5️⃣: ⏮️ 롤백 (Rollback)

**목적:** 문제 발생 시 긴급 복구

| 기능 | 설명 |
|------|------|
| **⏮️ 긴급 롤백** | 즉시 이전 버전으로 복구 |
| **📋 롤백 가이드** | 언제 롤백하는지 설명 |

**사용 예시:**

#### 롤백 실행
```
1. 롤백 대상 스테이지 선택: "canary-50"
2. 롤백 이유 선택: "에러율 증가"
3. 복구할 버전 입력: "1.0.0"
4. 확인 메시지에서 "OK" 클릭
5. 롤백 완료 메시지 확인
```

**롤백 언제 하나요?**
- Error rate > 0.5%
- P95 Latency > 500ms
- Success rate < 99%
- 심각한 버그 발견

---

## 📊 화면 구성 상세

### 헤더
```
🚀 Executor Web Dashboard
UI Template System 관리 및 배포 제어
```

### 탭 네비게이션
```
[📊 상태] [📦 상품] [🚀 배포] [📈 메트릭] [⏮️ 롤백]
```

### 카드 레이아웃
```
┌─────────────────────────┐
│ 🔄 시스템 상태          │
├─────────────────────────┤
│ [상태 조회]             │
├─────────────────────────┤
│ {JSON 결과}             │
└─────────────────────────┘
```

### 입력 폼
```
라벨: 입력창

[버튼]
```

### 출력 영역
```
{
  "key": "value",
  "status": "success"
}
```

---

## 🔗 REST API 엔드포인트

CLI 없이 직접 API를 호출할 수도 있습니다.

### 상태 조회
```bash
curl http://localhost:5000/api/status
```

### 메트릭 수집
```bash
curl http://localhost:5000/api/metrics
```

### 상품 목록
```bash
curl http://localhost:5000/api/products
```

### 상품 정보
```bash
curl http://localhost:5000/api/products/credit-card
```

### 배포 시작
```bash
curl -X POST http://localhost:5000/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "product": "futures",
    "version": "1.0.0",
    "stage": "canary"
  }'
```

### 롤백
```bash
curl -X POST http://localhost:5000/api/rollback \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "canary-50",
    "reason": "high error rate",
    "version": "1.0.0"
  }'
```

---

## 💻 웹 대시보드 vs CLI vs GitHub Actions

| 방법 | 장점 | 단점 | 사용 시점 |
|------|------|------|---------|
| **웹 대시보드** | 시각적, 쉬운 조작, 완벽한 UI | 약간의 설정 필요 | 일상적 모니터링 |
| **CLI** | 빠른 실행, 스크립트 가능 | 터미널 필요 | 자동화, 빠른 조회 |
| **GitHub Actions** | 완전 자동, 검증된 프로세스 | 설정 필요, 느린 피드백 | 신규 배포 |

**추천:** 웹 대시보드 + CLI 조합 사용

---

## 🎨 웹 대시보드 UI 특징

### 디자인
- 현대적 그래디언트 헤더
- 카드 기반 레이아웃
- 반응형 디자인 (모바일 지원)
- 색상 코드: 보라색(주색), 회색(보조색)

### 상호작용
- 탭 전환 (클릭)
- 실시간 API 호출
- JSON 결과 포맷팅
- 에러 하이라이팅
- 로딩 상태 표시

### 접근성
- 명확한 라벨
- 큰 버튼
- 충분한 색상 대비
- 키보드 네비게이션

---

## ⚙️ 포트 변경

기본값은 5000이지만, 이미 사용 중이면:

```bash
# 포트 5000 확인
lsof -i :5000

# 다른 포트로 실행
python scripts/executor_api.py --port 8080
python scripts/executor_api.py --port 9000
```

---

## 🔒 보안 고려사항

### 현재 설정
- 로컬호스트만 접속 가능 (기본값: 127.0.0.1)
- CORS 활성화됨
- 인증 없음 (로컬 환경 가정)

### 프로덕션 배포 시
```bash
# 특정 IP에서만 접속 허용
python scripts/executor_api.py --host 192.168.1.100 --port 5000

# 또는 리버스 프록시 사용
# nginx/apache에서 인증 및 HTTPS 설정
```

---

## 🐛 트러블슈팅

### Flask 설치 오류
```bash
pip install --upgrade pip
pip install flask flask-cors
```

### 포트 이미 사용 중
```bash
# 현재 프로세스 확인
lsof -i :5000

# 프로세스 종료
kill -9 <PID>

# 또는 다른 포트 사용
python scripts/executor_api.py --port 8080
```

### API 호출 실패
1. 서버 실행 확인
2. URL 정확 확인: http://localhost:5000
3. 브라우저 개발자 도구 (F12) → Network 탭 확인

### JSON 결과가 비어있음
1. Executor 초기화 대기 (몇 초)
2. 로그 파일 확인: tail -f executor.log
3. API 헬스 체크: curl http://localhost:5000/api/health

---

## 📱 모바일 접속

### 같은 네트워크의 다른 기기에서 접속
```bash
# 호스트 IP 확인
ipconfig getifaddr en0  # macOS
hostname -I              # Linux

# 서버 실행 (모든 인터페이스)
python scripts/executor_api.py --host 0.0.0.0 --port 5000

# 다른 기기에서 접속
http://192.168.1.100:5000
```

⚠️ **주의:** 보안이 필요하면 VPN이나 방화벽으로 보호하세요.

---

## 🚀 고급 사용법

### 터미널 2개 실행

**터미널 1: 웹 대시보드**
```bash
python scripts/executor_api.py --port 5000
```

**터미널 2: CLI 커맨드**
```bash
# 실시간 로그 확인
tail -f executor.log

# 또는 CLI 명령어 직접 실행
python scripts/executor.py status
```

### 두 방식 함께 사용
```
웹 대시보드          CLI
    ↓               ↓
  보기            작업
    ↓               ↓
  메트릭         배포/롤백
    ↓               ↓
  모니터링        빠른 실행
```

---

## 📊 정기 모니터링 루틴

### 아침 (5분)
1. http://localhost:5000 접속
2. [📊 상태] 탭 → [상태 조회]
3. 메트릭 카드 확인
4. 이상 없으면 작업 시작

### 배포 중 (계속)
1. [🚀 배포] 탭 → [배포 상태]
2. 각 단계별 진행 확인
3. Canary 25% / 50% 메트릭 확인

### 문제 발생 시 (즉시)
1. [📈 메트릭] 탭 → [메트릭 수집]
2. Error rate 확인
3. > 0.5%이면 [⏮️ 롤백] 탭으로
4. 버전 입력 후 [롤백 실행]

### 퇴근 (5분)
1. [📊 상태] 탭 → [상태 조회]
2. 최종 메트릭 확인
3. 배포 완료 확인

---

## 💡 팁

### 1. 브라우저 탭 여러 개 열기
```
탭 1: 웹 대시보드 (모니터링)
탭 2: 상태 조회 결과 (한눈에)
탭 3: 메트릭 분석
```

### 2. 북마크 저장
```
http://localhost:5000
→ Executor Dashboard로 저장
```

### 3. DevTools 사용
```
F12 → Network 탭
→ 각 API 호출 상세 확인
```

### 4. 자동 새로고침
브라우저 확장 프로그램 "Auto Refresh" 설치
→ 5초 또는 10초마다 자동 갱신

---

## 📞 지원

### 웹 대시보드 문제
1. 브라우저 개발자 도구 확인 (F12)
2. executor.log 파일 확인
3. 포트 변경 후 재실행

### API 문제
```bash
# 헬스 체크
curl http://localhost:5000/api/health

# 상태 조회
curl http://localhost:5000/api/status

# 로그 확인
tail -100 executor.log
```

---

**마지막 업데이트:** 2026-04-16  
**지원 버전:** 1.0.0+

웹 대시보드로 편하게 관리하세요! 🚀
