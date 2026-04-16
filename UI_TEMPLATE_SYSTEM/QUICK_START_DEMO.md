# 🚀 빠른 시작 데모 (5분)

**목표:** 실제로 시스템을 동작시켜 확인하기

---

## Step 1️⃣: 시스템 상태 확인 (1분)

```bash
cd UI_TEMPLATE_SYSTEM

# 현재 시스템 상태 확인
python scripts/executor.py status
```

**예상 출력:**
```json
{
  "system": {
    "products_total": 0,
    "active_deployments": 0,
    "total_deployments": 0
  },
  "products": [],
  "metrics": {
    "stages": {
      "canary-25": { "error_rate": 0.002, "p95_latency": 280, ... },
      "canary-50": { "error_rate": 0.003, "p95_latency": 320, ... },
      "production-100": { "error_rate": 0.001, "p95_latency": 250, ... }
    }
  }
}
```

**의미:**
- ✅ 시스템 정상 작동
- 현재 배포 상품 0개
- 메트릭 시뮬레이션 중

---

## Step 2️⃣: 상품 목록 확인 (1분)

```bash
# 현재 등록된 상품 목록
python scripts/executor.py product list

# 특정 상품 상세 정보
python scripts/executor.py product info --id credit-card
```

**예상 출력:**
```json
[]  // 아직 등록된 상품이 없음
```

또는 (기존 상품이 있으면):
```json
[
  {
    "id": "credit-card",
    "name": "신용카드",
    "status": "active",
    "created_at": "2026-04-16T10:00:00Z"
  }
]
```

---

## Step 3️⃣: 메트릭 수집 (1분)

```bash
# 실시간 메트릭 수집
python scripts/executor.py metrics collect

# 트렌드 분석 (24시간)
python scripts/executor.py metrics trend --hours 24
```

**예상 출력:**
```json
{
  "timestamp": "2026-04-16T14:32:48Z",
  "stages": {
    "canary-25": {
      "error_rate": 0.002,
      "p95_latency": 280,
      "success_rate": 0.998,
      "traffic_percentage": 25
    },
    "canary-50": {
      "error_rate": 0.003,
      "p95_latency": 320,
      "success_rate": 0.997,
      "traffic_percentage": 50
    },
    "production-100": {
      "error_rate": 0.001,
      "p95_latency": 250,
      "success_rate": 0.999,
      "traffic_percentage": 100
    }
  }
}
```

**해석:**
- ✅ 모든 스테이지 정상
- Error rate: 0.1% - 0.3% (정상, 임계값 0.5% 이하)
- P95 Latency: 250-320ms (정상, 임계값 500ms 이하)
- Success rate: 99.7% 이상 (정상, 임계값 99% 이상)

---

## Step 4️⃣: 배포 상태 확인 (1분)

```bash
# 배포 히스토리 조회
python scripts/executor.py deploy status
```

**예상 출력:**
```json
{
  "deployments": [],
  "total": 0
}
```

---

## Step 5️⃣: 대시보드 시작 (1분)

```bash
# 웹 기반 모니터링 대시보드 실행
python scripts/executor.py dashboard serve --port 8000
```

**터미널 출력:**
```
[2026-04-16T14:32:48] [INFO] 🚀 Serving dashboard on http://localhost:8000
[2026-04-16T14:32:48] [INFO] 📁 Dashboard: C:\Users\...\UI_TEMPLATE_SYSTEM\dashboard
```

**브라우저에서:**
1. http://localhost:8000 접속
2. 대시보드 화면 확인
   - 제품 상태: 활성 (초록색)
   - 배포 현황: 각 stage별 진행률
   - 성능 메트릭: Error rate, Latency, Success rate
   - 최근 변경: 타임라인

---

## 실제 사용 시나리오 (데모)

### 시나리오: 신규 상품 "선물거래" 추가 (15분)

#### Step 1: 상품 생성 (5분)

```bash
# 드라이 런 (실제 생성 안 함)
python scripts/executor.py product create \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info" \
  --dry-run  # 이 옵션은 없지만, 테스트를 위해 추가 가능

# 실제 생성
python scripts/executor.py product create \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"
```

**예상 출력:**
```
[2026-04-16T14:35:00] [INFO] Creating product: 선물거래 (DB function: branchq_get_all_futures_info)
[2026-04-16T14:35:05] [INFO] ✅ Product created: futures
```

**생성되는 파일:**
```
generated/futures/
├── config.json                    # 상품 설정
├── components/                    # React 컴포넌트 (4개)
│   ├── ListViewContainer.tsx
│   ├── DetailViewContainer.tsx
│   ├── FormModal.tsx
│   └── ReportSection.tsx
├── hooks/                         # Custom Hooks (4개)
├── api.yaml                       # OpenAPI 문서
├── components.test.ts             # 테스트 케이스
└── CHECKLIST.md                  # 작업 체크리스트
```

#### Step 2: 상품 상세정보 확인 (2분)

```bash
# 생성된 상품 정보 확인
python scripts/executor.py product info --id futures
```

**예상 출력:**
```json
{
  "id": "futures",
  "name": "선물거래",
  "components": 4,
  "hooks": 4,
  "screens": ["list", "detail", "form", "report"],
  "version": "1.0.0",
  "dbFunction": "branchq_get_all_futures_info"
}
```

#### Step 3: 배포 준비 (3분)

```bash
# 드라이 런으로 배포 프로세스 확인
python scripts/executor.py deploy start \
  --product futures \
  --version 1.0.0 \
  --stage canary \
  --dry-run
```

**예상 출력:**
```
[2026-04-16T14:38:00] [INFO] Starting deployment: product=futures, stage=canary, dry_run=True
[2026-04-16T14:38:00] [INFO] 🔍 DRY RUN: No actual deployment performed
[2026-04-16T14:38:00] [INFO]   → Would deploy futures to canary
```

#### Step 4: 실제 배포 (5분)

```bash
# 카나리 배포 시작
python scripts/executor.py deploy start \
  --product futures \
  --version 1.0.0 \
  --stage canary
```

**예상 출력:**
```
[2026-04-16T14:40:00] [INFO] Starting deployment: product=futures, stage=canary, dry_run=False
[2026-04-16T14:40:01] [INFO] Deploying futures to canary...
[2026-04-16T14:40:05] [INFO] ✅ Deployment started: deploy-1713268805
```

**자동 진행 프로세스:**
```
1. Stage 1: Canary 25% 배포
   ├─ 25% 트래픽만 새 버전으로 라우팅
   ├─ 5-10분 메트릭 모니터링
   └─ ✅ 통과

2. Stage 2: Canary 50% 배포
   ├─ 50% 트래픽으로 확대
   ├─ 10-20분 메트릭 모니터링
   └─ ✅ 통과

3. 수동 승인 필요
   └─ GitHub Actions UI에서 승인 필요

4. Stage 3: Production 100% 배포
   ├─ 전체 트래픽으로 배포
   ├─ 최종 헬스 체크
   └─ ✅ 완료
```

#### Step 5: 배포 상태 모니터링 (실시간)

```bash
# 배포 상태 확인 (반복 실행)
python scripts/executor.py deploy status

# 또는 대시보드에서 실시간 확인
python scripts/executor.py dashboard serve --port 8000
```

**배포 상태 출력:**
```json
{
  "deployments": [
    {
      "id": "deploy-1713268805",
      "products": ["futures"],
      "stage": "canary",
      "version": "1.0.0",
      "status": "deployed",
      "started_at": "2026-04-16T14:40:05Z",
      "deployed_at": "2026-04-16T14:40:05Z"
    }
  ]
}
```

#### Step 6: 메트릭 실시간 확인

```bash
# 현재 메트릭
python scripts/executor.py metrics collect

# 트렌드 분석
python scripts/executor.py metrics trend --hours 1
```

**정상 메트릭:**
```json
{
  "stages": {
    "canary-25": {
      "error_rate": 0.002,   ✅ (< 0.5%)
      "p95_latency": 280,    ✅ (< 500ms)
      "success_rate": 0.998  ✅ (> 99%)
    }
  }
}
```

---

## 긴급 상황 시뮬레이션: 롤백

### 상황: Error rate 급증

```bash
# 메트릭 확인
python scripts/executor.py metrics collect
# → error_rate: 0.8% (임계값 0.5% 초과!)

# 즉시 롤백
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "error_rate exceeded: 0.8%" \
  --version 1.0.0
```

**예상 출력:**
```
[2026-04-16T14:45:00] [INFO] Starting rollback: stage=canary-50, reason=error_rate exceeded: 0.8%, version=1.0.0
[2026-04-16T14:45:01] [INFO] Stopping current deployment on canary-50...
[2026-04-16T14:45:02] [INFO] ✅ Traffic stopped successfully
[2026-04-16T14:45:03] [INFO] Deploying version 1.0.0 to canary-50...
[2026-04-16T14:45:05] [INFO] Running health checks after rollback...
[2026-04-16T14:45:07] [INFO] ✅ Rollback completed successfully
[2026-04-16T14:45:07] [INFO] Stage: canary-50
[2026-04-16T14:45:07] [INFO] Restored to: 1.0.0
```

**복구 검증:**
```bash
# 롤백 후 메트릭 확인
python scripts/executor.py metrics collect
# → error_rate: 0.1% ✅
```

---

## 버전 관리 예시

```bash
# 현재 버전 확인
python scripts/executor.py product info --id futures
# → version: 1.0.0

# Patch 버전 증가 (버그 수정)
python scripts/executor.py version increment \
  --product futures \
  --bump patch
# → 1.0.0 → 1.0.1

# Minor 버전 증가 (기능 추가)
python scripts/executor.py version increment \
  --product futures \
  --bump minor
# → 1.0.1 → 1.1.0

# Major 버전 증가 (구조 변경)
python scripts/executor.py version increment \
  --product futures \
  --bump major
# → 1.1.0 → 2.0.0
```

---

## 로그 파일 확인

```bash
# 모든 실행 기록 확인
tail -f UI_TEMPLATE_SYSTEM/executor.log

# 특정 작업만 필터링
grep "product create" UI_TEMPLATE_SYSTEM/executor.log
grep "deploy start" UI_TEMPLATE_SYSTEM/executor.log
grep "ERROR" UI_TEMPLATE_SYSTEM/executor.log
```

**로그 예시:**
```
[2026-04-16T14:35:00.123456] [INFO] Creating product: 선물거래
[2026-04-16T14:35:05.654321] [INFO] ✅ Product created: futures
[2026-04-16T14:40:00.111111] [INFO] Starting deployment: product=futures
[2026-04-16T14:40:05.222222] [INFO] ✅ Deployment started: deploy-1713268805
```

---

## GitHub Actions 워크플로우 확인

### 1. GitHub에 Push

```bash
git add UI_TEMPLATE_SYSTEM/
git commit -m "Add new product: futures"
git push origin develop
```

### 2. GitHub Actions 자동 실행

**변경 사항 저장 시 자동으로:**
1. ✅ **test.yml** 실행
   - npm ci
   - npm run lint
   - npm test
   - Coverage 리포트 생성

2. ✅ **build.yml** 실행 (test 통과 후)
   - 버전 생성 (YYYY.MM.DD.HHMM)
   - API 문서 생성
   - 아티팩트 패킹

3. 📊 **deploy-canary.yml** 수동 트리거
   - Canary 25% 배포
   - Canary 50% 배포
   - 수동 승인
   - Production 100% 배포

4. 📈 **monitor.yml** 자동 실행 (5분마다)
   - 메트릭 수집
   - 임계값 비교
   - 자동 롤백 판정

### 3. GitHub UI에서 확인

1. **Actions** 탭 → 워크플로우 선택
2. 각 Job의 상세 로그 확인
3. Artifacts 탭에서 생성된 파일 다운로드

---

## 📊 대시보드 항상 확인하기

```bash
# 터미널 1: 대시보드 시작
python scripts/executor.py dashboard serve --port 8000

# 터미널 2: 정기적으로 메트릭 수집
while true; do
  python scripts/executor.py metrics collect
  sleep 300  # 5분마다
done
```

**대시보드 확인 내용:**
- ✅ 제품 상태 (활성/경고/에러)
- ✅ 배포 진행률 (각 stage별)
- ✅ 성능 메트릭 (실시간)
- ✅ 최근 변경 (타임라인)

---

## 체크리스트: 정상 작동 확인

- [x] `executor.py status` → JSON 출력 정상
- [x] `executor.py product list` → 명령어 작동
- [x] `executor.py metrics collect` → 메트릭 출력
- [x] `executor.py deploy status` → 배포 상태 조회
- [x] `executor.py dashboard serve` → 웹 대시보드 실행 가능
- [x] `executor.log` 파일 자동 생성
- [x] 모든 명령어 정상 작동

---

**다음:** 실제 상품 추가 또는 GitHub Actions 워크플로우 테스트!
