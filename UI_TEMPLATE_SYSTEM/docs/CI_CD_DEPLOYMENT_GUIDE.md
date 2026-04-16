# CI/CD 파이프라인 및 자동 배포 가이드

**목차**
- [개요](#개요)
- [아키텍처](#아키텍처)
- [파이프라인 플로우](#파이프라인-플로우)
- [실행기 (Executor) 사용법](#실행기-executor-사용법)
- [배포 전략](#배포-전략)
- [모니터링 및 롤백](#모니터링-및-롤백)
- [트러블슈팅](#트러블슈팅)

---

## 개요

이 시스템은 **GitHub Actions**를 기반으로 한 완전 자동화된 CI/CD 파이프라인을 제공합니다:

| 단계 | 목표 | 자동 실행 |
|------|------|---------|
| **Test** | 코드 검증, 테스트 실행 | Push to master/develop |
| **Build** | 컴포넌트 생성, 아티팩트 패킹 | Test 성공 후 |
| **Deploy-Canary** | 단계적 배포 (25% → 50% → 100%) | 수동 트리거 또는 develop 푸시 |
| **Monitor** | 실시간 메트릭 수집, 자동 롤백 | 5분 간격 |
| **Rollback** | 문제 발생 시 자동 복구 | 메트릭 임계값 초과 시 |

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│          GitHub Actions Workflows                        │
├─────────────────────────────────────────────────────────┤
│  test.yml              (Unit tests, linting)             │
│  build.yml             (Build, artifact generation)      │
│  deploy-canary.yml     (Phased rollout)                  │
│  monitor.yml           (Metrics collection)              │
│  rollback.yml          (Automated recovery)              │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│          Executor CLI (Python)                           │
├─────────────────────────────────────────────────────────┤
│  · 제품 생성/관리                                        │
│  · 배포 오케스트레이션                                  │
│  · 메트릭 수집 및 분석                                  │
│  · 대시보드 관리                                        │
│  · 버전 관리                                            │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│          Deployment Environment                          │
├─────────────────────────────────────────────────────────┤
│  Staging-Canary (25% traffic)                           │
│  Staging (50% traffic)                                   │
│  Production (100% traffic)                               │
└─────────────────────────────────────────────────────────┘
```

---

## 파이프라인 플로우

### 1️⃣ 테스트 & 린팅 (test.yml)

**트리거 조건:**
- `master` 또는 `develop` 브랜치 푸시
- `UI_TEMPLATE_SYSTEM/**` 경로 변경
- Pull Request 생성

**실행 작업:**
```bash
# Node.js 18.x, 20.x 이중 테스트
npm ci                          # 의존성 설치
npm run lint                    # 린팅 검사
npm test -- --coverage          # 단위 테스트
npm test -- generated/*/components.test.ts  # 컴포넌트 테스트
```

**출력물:**
- 커버리지 리포트 (codecov)
- 린팅 결과
- 테스트 결과

---

### 2️⃣ 빌드 & 아티팩트 생성 (build.yml)

**트리거 조건:**
- `test.yml` 성공 후
- 수동 트리거 가능

**실행 작업:**
```bash
# 버전 생성 (날짜 기반: YYYY.MM.DD.HHMM)
VERSION=2026.04.16.1030

# API 문서 생성
python scripts/generate_api_docs.py

# 아티팩트 패킹
tar -czf ui-components-${VERSION}.tar.gz generated/
zip -r ui-components-${VERSION}.zip generated/
```

**출력물:**
```
artifacts/
├── ui-components-2026.04.16.1030/
│   ├── generated/
│   ├── templates/
│   ├── MANIFEST.json
│   └── README.md
├── ui-components-2026.04.16.1030.tar.gz
└── ui-components-2026.04.16.1030.zip
```

---

### 3️⃣ 카나리 배포 (deploy-canary.yml)

**배포 전략: 3단계 롤아웃**

```
┌──────────────────────────────────────────────────────────┐
│  Stage 1: Canary 25%  (5-10분 모니터링)                 │
│  ├─ 25% 트래픽만 새 버전으로                            │
│  ├─ 메트릭: Error rate, P95 latency, Success rate        │
│  └─ Pass → Stage 2 진행                                 │
│                                                          │
│  Stage 2: Canary 50%  (10-20분 모니터링)                │
│  ├─ 50% 트래픽으로 확대                                 │
│  ├─ 메트릭 재검증                                       │
│  └─ Pass → Manual Approval                              │
│                                                          │
│  Stage 3: Production 100%  (수동 승인 후)               │
│  ├─ 전체 트래픽으로 배포                                │
│  ├─ 최종 헬스 체크                                      │
│  └─ Complete                                            │
└──────────────────────────────────────────────────────────┘
```

**메트릭 검증 기준:**

| 메트릭 | 임계값 | 초과 시 |
|--------|--------|--------|
| Error Rate | > 0.5% | ⚠️ Warning |
| P95 Latency | > 500ms | ⚠️ Warning |
| Success Rate | < 99% | ⚠️ Warning |

---

### 4️⃣ 모니터링 (monitor.yml)

**주기:**
- 5분마다 자동 실행
- 수동 트리거 가능
- Canary 배포 완료 후 자동 실행

**수집 메트릭:**
```json
{
  "timestamp": "2026-04-16T10:30:00Z",
  "stages": {
    "canary-25": {
      "error_rate": 0.002,
      "p95_latency": 280,
      "success_rate": 0.998,
      "traffic_percentage": 25
    }
  },
  "summary": {
    "total_errors": 145,
    "total_requests": 1000000,
    "average_latency": 290,
    "critical_alerts": 0
  }
}
```

**생성 리포트:**
- 모니터링 리포트 (Markdown)
- 트렌드 분석 (24시간 비교)
- 자동 롤백 판정

---

### 5️⃣ 자동 롤백 (rollback.yml)

**롤백 트리거:**

| 조건 | 작동 | 롤백 대상 |
|------|------|---------|
| Error rate > 0.5% | 즉시 | Canary stage |
| P95 latency > 500ms | 즉시 | Canary stage |
| Success rate < 99% | 즉시 | Canary stage |
| 수동 요청 | 즉시 | 지정된 stage |

**롤백 프로세스:**
```
1. 현재 배포 중지
2. 이전 버전 복구
3. 헬스 체크 실행
4. 인시던트 리포트 생성
5. 팀 알림 발송
```

---

## 실행기 (Executor) 사용법

### 설치

```bash
cd UI_TEMPLATE_SYSTEM
chmod +x scripts/executor.py
```

### 기본 명령어

#### 제품 관리

```bash
# 새 상품 생성
python scripts/executor.py product create \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"

# 상품 목록 조회
python scripts/executor.py product list

# 상품 상세 정보
python scripts/executor.py product info --id credit-card
```

**출력 예시:**
```json
[
  {
    "id": "credit-card",
    "name": "신용카드",
    "components": 4,
    "hooks": 4,
    "screens": ["list", "detail", "form", "report"],
    "version": "1.2.0",
    "dbFunction": "branchq_get_all_card_info"
  }
]
```

#### 배포 관리

```bash
# 배포 시작 (드라이 런)
python scripts/executor.py deploy start \
  --product credit-card \
  --version 1.2.0 \
  --stage canary \
  --dry-run

# 배포 시작 (실제)
python scripts/executor.py deploy start \
  --product credit-card \
  --version 1.2.0 \
  --stage canary

# 배포 상태 확인
python scripts/executor.py deploy status

# 배포 일시 중지
python scripts/executor.py deploy pause --id deploy-1713268200

# 배포 재개
python scripts/executor.py deploy resume --id deploy-1713268200
```

**배포 상태:**
```json
{
  "deployments": [
    {
      "id": "deploy-1713268200",
      "products": ["credit-card"],
      "stage": "canary",
      "version": "1.2.0",
      "status": "deployed",
      "started_at": "2026-04-16T10:00:00Z",
      "deployed_at": "2026-04-16T10:05:00Z"
    }
  ]
}
```

#### 롤백

```bash
# 롤백 시작
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "high error rate" \
  --version 1.1.0
```

#### 메트릭

```bash
# 메트릭 수집
python scripts/executor.py metrics collect

# 트렌드 분석 (24시간)
python scripts/executor.py metrics trend --hours 24
```

**메트릭 출력:**
```json
{
  "timestamp": "2026-04-16T10:30:00Z",
  "stages": {
    "canary-25": {
      "error_rate": 0.002,
      "p95_latency": 280,
      "success_rate": 0.998
    }
  }
}
```

#### 대시보드

```bash
# 대시보드 서빙 (포트 8000)
python scripts/executor.py dashboard serve

# 커스텀 포트
python scripts/executor.py dashboard serve --port 5000
```

**접속:**
- http://localhost:8000/dashboard.html

#### 버전 관리

```bash
# 버전 증가 (Patch)
python scripts/executor.py version increment \
  --product credit-card \
  --bump patch
# 결과: 1.1.0 → 1.1.1

# 버전 증가 (Minor)
python scripts/executor.py version increment \
  --product credit-card \
  --bump minor
# 결과: 1.1.1 → 1.2.0

# 버전 증가 (Major)
python scripts/executor.py version increment \
  --product credit-card \
  --bump major
# 결과: 1.2.0 → 2.0.0
```

#### 시스템 상태

```bash
# 전체 시스템 상태
python scripts/executor.py status
```

**출력:**
```json
{
  "system": {
    "products_total": 3,
    "active_deployments": 1,
    "total_deployments": 47
  },
  "products": [
    {
      "id": "credit-card",
      "name": "신용카드",
      "status": "active"
    }
  ],
  "recent_deployments": [...]
}
```

---

## 배포 전략

### 일반적인 배포 프로세스

```bash
# 1. 개발 완료 → develop 브랜치 푸시
git push origin develop

# 2. 자동 실행: test.yml → build.yml
# (약 2-3분 소요)

# 3. 배포 준비 확인
python scripts/executor.py deploy status

# 4. 카나리 배포 시작
python scripts/executor.py deploy start \
  --product credit-card \
  --version 1.2.0 \
  --stage canary

# 5. 단계별 모니터링
# - Canary 25% (5-10분)
# - Canary 50% (10-20분)
# - 수동 승인 필요
# - Production 100%

# 6. 최종 메트릭 확인
python scripts/executor.py metrics collect
python scripts/executor.py metrics trend --hours 1
```

### 긴급 배포 (Hotfix)

```bash
# 1. Hotfix 브랜치에서 수정
git checkout -b hotfix/critical-bug
# ... 수정 ...
git push origin hotfix/critical-bug

# 2. master 브랜치로 PR 생성
# → CI/CD 자동 실행

# 3. 빠른 배포
python scripts/executor.py deploy start \
  --product credit-card \
  --stage production  # Canary 생략 가능
```

### 롤백 필요 시

```bash
# 1. 문제 감지
python scripts/executor.py metrics collect
# → error_rate > 0.5% 확인

# 2. 즉시 롤백
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "high error rate (0.8%)" \
  --version 1.1.0

# 3. 원인 분석
# → 대시보드 확인
# → 인시던트 리포트 검토

# 4. 수정 후 재배포
# → 개발 → 푸시 → 배포 반복
```

---

## 모니터링 및 롤백

### 대시보드 확인

**주요 지표:**
- 각 stage별 에러율, 레이턴시, 성공률
- 배포 진행 현황
- 최근 변경 이력
- 성능 트렌드

**URL:** http://localhost:8000/dashboard.html

### 자동 롤백 조건

| 메트릭 | 임계값 | 대응 |
|--------|--------|------|
| Error Rate | > 0.5% | 자동 롤백 |
| P95 Latency | > 500ms | 경고 알림 |
| Success Rate | < 99% | 경고 알림 |

### 수동 롤백

```bash
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "Manual request: design issue detected" \
  --version 1.1.0
```

---

## GitHub Actions 로컬 테스트

```bash
# act 설치 (macOS)
brew install act

# 로컬에서 workflow 실행
act -j test          # test.yml 실행
act -j build         # build.yml 실행
act -j deploy-canary # deploy-canary.yml 실행
```

---

## 트러블슈팅

### 배포 실패

**증상:** Deploy 단계에서 빨간 X

**원인 및 해결:**
```bash
# 1. 테스트 실패 확인
# → GitHub Actions 로그 확인
# → 로컬에서 npm test 실행

# 2. 문제 수정
git push origin develop

# 3. 다시 배포
python scripts/executor.py deploy start --stage canary
```

### 메트릭 수집 실패

```bash
# 1. 모니터링 상태 확인
python scripts/executor.py metrics collect

# 2. 수동 트리거
# → GitHub Actions → monitor 워크플로우 → Run workflow

# 3. 로그 확인
# → Artifacts → metrics-*.json 다운로드
```

### 롤백 실패

```bash
# 1. 이전 버전 존재 확인
python scripts/executor.py product info --id credit-card

# 2. 로그 확인
tail -f UI_TEMPLATE_SYSTEM/executor.log

# 3. 수동 복구
python scripts/executor.py deploy start \
  --product credit-card \
  --version 1.1.0 \
  --stage canary
```

---

## 체크리스트

배포 전:
- [ ] 모든 테스트 통과 확인
- [ ] 체인지로그 업데이트
- [ ] 버전 번호 결정
- [ ] 팀 알림 발송

배포 후:
- [ ] Canary 25% 메트릭 확인 (5-10분)
- [ ] Canary 50% 메트릭 확인 (10-20분)
- [ ] 수동 승인
- [ ] Production 100% 메트릭 확인

---

**문제 발생 시:**
1. 대시보드 확인
2. 메트릭 분석
3. 필요 시 롤백
4. 원인 분석
5. 수정 후 재배포
