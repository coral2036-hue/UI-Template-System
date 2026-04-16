# 📖 실제 사용 방법 - 상세 가이드

**세 가지 방법으로 사용할 수 있습니다:**

---

## 방법 1️⃣: CLI 명령어로 직접 관리

### 준비

```bash
cd UI_TEMPLATE_SYSTEM
```

### 명령어 모음

| 목적 | 명령어 | 결과 |
|------|--------|------|
| **시스템 상태** | `python scripts/executor.py status` | JSON 형식으로 전체 상태 출력 |
| **상품 목록** | `python scripts/executor.py product list` | 모든 상품의 목록과 상태 |
| **메트릭 수집** | `python scripts/executor.py metrics collect` | 실시간 Error rate, Latency, Success rate |
| **트렌드 분석** | `python scripts/executor.py metrics trend --hours 24` | 24시간 변화 추적 |
| **배포 상태** | `python scripts/executor.py deploy status` | 최근 배포 히스토리 |

### 실제 동작 확인

```bash
# 1. 현재 상태 확인
$ python scripts/executor.py status

{
  "system": {
    "products_total": 0,
    "active_deployments": 0,
    "total_deployments": 0
  },
  "products": [],
  "metrics": {
    "canary-25": { "error_rate": 0.002, "p95_latency": 280, ... },
    "canary-50": { "error_rate": 0.003, "p95_latency": 320, ... },
    "production-100": { "error_rate": 0.001, "p95_latency": 250, ... }
  }
}

# 2. 메트릭 확인
$ python scripts/executor.py metrics collect

{
  "timestamp": "2026-04-16T14:33:37Z",
  "stages": {
    "canary-25": { "error_rate": 0.002, "success_rate": 0.998 },
    "canary-50": { "error_rate": 0.003, "success_rate": 0.997 },
    "production-100": { "error_rate": 0.001, "success_rate": 0.999 }
  }
}

# 3. 트렌드 분석
$ python scripts/executor.py metrics trend --hours 24

{
  "period": "last-24-hours",
  "metrics": {
    "error_rate": { "current": 0.002, "previous": 0.0025, "change": "-20%" },
    "p95_latency": { "current": 290, "previous": 310, "change": "-6.5%" },
    "success_rate": { "current": 0.998, "previous": 0.996, "change": "+0.2%" }
  }
}
```

---

## 방법 2️⃣: 웹 대시보드로 모니터링

### 시작

```bash
# 터미널에서 대시보드 실행
python scripts/executor.py dashboard serve --port 8000

# 또는 다른 포트 사용
python scripts/executor.py dashboard serve --port 5000
```

### 접속

**브라우저에서:** http://localhost:8000

### 화면 구성

```
┌─────────────────────────────────────────────────────┐
│  🏠 UI Template System 대시보드                      │
├─────────────────────────────────────────────────────┤
│  📊 전체 통계                                        │
│  ├─ 총 제품: 3개                                    │
│  ├─ 활성 상품: 3개 (모두 초록색)                    │
│  └─ 대기 중 변경: 1개                              │
├─────────────────────────────────────────────────────┤
│  💳 제품 카드 (3개)                                 │
│  ├─ [신용카드] v1.2.0                             │
│  │  └─ 상태: ✅ Active                             │
│  ├─ [투자상품] v2.1.0                             │
│  │  └─ 상태: ✅ Active                             │
│  └─ [환율정보] v1.0.5                             │
│     └─ 상태: ✅ Active                             │
├─────────────────────────────────────────────────────┤
│  📅 최근 변경 (타임라인)                            │
│  ├─ [2026-04-16 10:30] 신용카드 v1.2.0 배포       │
│  ├─ [2026-04-16 09:15] 투자상품 설정 변경         │
│  ├─ [2026-04-16 08:00] 환율정보 배포 완료         │
│  └─ [2026-04-15 16:45] 신규 상품 추가             │
├─────────────────────────────────────────────────────┤
│  🚀 배포 현황                                        │
│  ├─ Canary 25%: [████░░░░░░░░░░░] 50% 진행        │
│  ├─ Canary 50%: [██░░░░░░░░░░░░░] 30% 진행        │
│  └─ Production: -                                  │
├─────────────────────────────────────────────────────┤
│  📈 성능 메트릭                                     │
│  ├─ Response Time (P95): 250ms ✅                 │
│  ├─ Test Coverage: 87% ✅                         │
│  └─ Deploy Success: 100% ✅                       │
├─────────────────────────────────────────────────────┤
│  🎛️  빠른 동작                                     │
│  ├─ [+ 새 제품] [🚀 배포] [📊 분석] [🔄 동기화]   │
│  └─ [⚙️  설정] [📋 체크리스트] [💾 저장]         │
└─────────────────────────────────────────────────────┘
```

### 대시보드 활용

| 확인 항목 | 방법 | 의미 |
|----------|------|------|
| **제품 상태** | 색상 배지 | 🟢 정상, 🟡 경고, 🔴 에러 |
| **배포 진행** | 진행률 바 | 각 stage별 롤아웃 진행 상황 |
| **성능 메트릭** | 숫자 표시 | Response time, Coverage, Success rate |
| **최근 활동** | 타임라인 | 변경 이력 시간순 정렬 |

---

## 방법 3️⃣: GitHub Actions 워크플로우 자동 실행

### 자동 트리거

```
Git Push (develop/master)
         ↓
    test.yml 자동 실행
         ↓
   build.yml 자동 실행
         ↓
  deploy-canary.yml (수동 트리거 또는 자동)
         ↓
   monitor.yml (5분마다 자동)
         ↓
  rollback.yml (필요 시 자동 또는 수동)
```

### GitHub에서 확인

1. **GitHub 저장소 접속**
   ```
   repository → Actions 탭
   ```

2. **워크플로우 확인**
   ```
   test.yml          → 테스트 실행 로그
   build.yml         → 빌드 및 아티팩트
   deploy-canary.yml → 배포 단계별 진행
   monitor.yml       → 메트릭 수집 결과
   rollback.yml      → 롤백 실행 기록
   ```

3. **각 Job 상세 확인**
   ```
   Job 클릭 → Run steps → 상세 로그 확인
   ```

4. **Artifacts 다운로드**
   ```
   Artifacts 탭 → deployment-packages 다운로드
   ```

---

## 실제 사용 예시

### 시나리오 1: 신규 상품 추가 후 배포

```bash
# Step 1: 상품 생성 (자동 구현, 수동으로 실행하지 않아도 됨)
# → generate_product_ui.py로 자동 생성

# Step 2: 설정 커스터마이징
nano generated/futures/config.json
# 필드, 화면, 탭 등 수정

# Step 3: Figma 디자인 (수동)
# → Figma에서 UI 디자인 완료

# Step 4: Git Push (자동 CI/CD 트리거)
git add .
git commit -m "Add new product: futures"
git push origin develop

# Step 5: GitHub Actions 자동 실행
# → test.yml → build.yml 자동 실행

# Step 6: 배포 시작 (CLI로 수동)
python scripts/executor.py deploy start \
  --product futures \
  --version 1.0.0 \
  --stage canary

# Step 7: 대시보드에서 모니터링
python scripts/executor.py dashboard serve --port 8000
# → http://localhost:8000 접속
# → Canary 25% 배포 상황 확인
# → Canary 50% 배포 상황 확인
# → 수동 승인 (GitHub UI)
# → Production 100% 배포 확인

# Step 8: 메트릭 확인
python scripts/executor.py metrics collect
# → Error rate, Latency, Success rate 확인
```

---

### 시나리오 2: 실시간 모니터링 및 메트릭 추적

```bash
# 터미널 1: 대시보드 시작
python scripts/executor.py dashboard serve --port 8000

# 터미널 2: 정기적 메트릭 수집
watch -n 300 'python scripts/executor.py metrics collect'
# 5분마다 자동 실행

# 터미널 3: 트렌드 분석
python scripts/executor.py metrics trend --hours 1
# 1시간 단위 변화 추적
```

---

### 시나리오 3: 긴급 상황 대응 (롤백)

```bash
# 상황: Error rate 급증 감지 (대시보드에서)
# → error_rate: 0.8% (임계값 0.5% 초과)

# Step 1: 즉시 문제 확인
python scripts/executor.py metrics collect
# → "canary-50": { "error_rate": 0.8%, ... }

# Step 2: 즉시 롤백 실행
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "error_rate exceeded: 0.8%" \
  --version 1.2.0

# Step 3: 복구 검증
python scripts/executor.py metrics collect
# → "canary-50": { "error_rate": 0.1%, ... } ✅

# Step 4: 대시보드 확인
# → 상태 표시 정상화 (초록색)

# Step 5: 원인 분석
# → GitHub 로그 확인
# → 인시던트 리포트 검토
# → 팀에 알림 발송
```

---

## 📊 실시간 모니터링 체크리스트

### 일일 확인 (5분)

```bash
# 1. 시스템 상태
python scripts/executor.py status

# 2. 메트릭
python scripts/executor.py metrics collect

# 3. 대시보드 (선택사항)
python scripts/executor.py dashboard serve --port 8000
```

**확인 사항:**
- [ ] 모든 제품 상태 = 초록색 (Active)
- [ ] Error rate < 0.5%
- [ ] P95 Latency < 500ms
- [ ] Success rate > 99%
- [ ] 최근 배포 = 성공
- [ ] 진행 중인 배포 = 없음 (또는 정상 진행)

### 주간 확인 (30분)

```bash
# 1. 배포 히스토리
python scripts/executor.py deploy status

# 2. 7일 트렌드
python scripts/executor.py metrics trend --hours 168

# 3. 워크플로우 로그
# GitHub Actions → 최근 실행 확인
```

**확인 사항:**
- [ ] 배포 성공률 ≥ 95%
- [ ] 메트릭 개선 추세
- [ ] 롤백 이유 분석
- [ ] 다음 주 계획 수립

---

## 로그 파일 활용

### 위치

```bash
UI_TEMPLATE_SYSTEM/executor.log
```

### 확인 방법

```bash
# 실시간 로그 확인
tail -f UI_TEMPLATE_SYSTEM/executor.log

# 특정 작업 필터링
grep "product create" UI_TEMPLATE_SYSTEM/executor.log
grep "deploy start" UI_TEMPLATE_SYSTEM/executor.log
grep "ERROR" UI_TEMPLATE_SYSTEM/executor.log

# 시간대별 필터
grep "2026-04-16T14:" UI_TEMPLATE_SYSTEM/executor.log

# 최근 100줄
tail -100 UI_TEMPLATE_SYSTEM/executor.log
```

### 로그 형식

```
[2026-04-16T14:32:48.697649] [INFO] Collecting metrics for: all products
[2026-04-16T14:40:05.654321] [INFO] ✅ Deployment started: deploy-1713268805
[2026-04-16T14:45:00.111111] [ERROR] High error rate detected
```

---

## 명령어 빠른 참조

```bash
# 상태 확인
python scripts/executor.py status
python scripts/executor.py product list
python scripts/executor.py deploy status
python scripts/executor.py metrics collect
python scripts/executor.py metrics trend --hours 24

# 배포 관리
python scripts/executor.py deploy start --product <id> --version <ver> --stage canary
python scripts/executor.py deploy pause --id <deploy-id>
python scripts/executor.py deploy resume --id <deploy-id>

# 긴급 대응
python scripts/executor.py rollback start --stage <stage> --reason <reason> --version <ver>

# 대시보드
python scripts/executor.py dashboard serve --port 8000

# 버전 관리
python scripts/executor.py version increment --product <id> --bump patch/minor/major

# 도움말
python scripts/executor.py --help
python scripts/executor.py product --help
python scripts/executor.py deploy --help
```

---

## 🎯 요약

| 방법 | 주 용도 | 실행 방법 |
|------|--------|---------|
| **CLI 명령어** | 빠른 조회, 배포 관리 | `python executor.py ...` |
| **웹 대시보드** | 실시간 모니터링, 시각화 | `executor.py dashboard serve` |
| **GitHub Actions** | 자동 테스트, 빌드, 배포 | Git Push 또는 수동 트리거 |

**가장 효율적인 사용:**
1. **일상:** 대시보드 + CLI 메트릭 (5분)
2. **배포:** CLI로 배포 시작, 대시보드로 모니터링
3. **긴급:** CLI로 즉시 롤백, 대시보드로 검증

모두 **즉시 사용 가능**합니다! 🚀
