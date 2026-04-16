# Executor 명령어 빠른 참조

**위치:** `scripts/executor.py`

---

## 🚀 시작 (Setup)

```bash
cd UI_TEMPLATE_SYSTEM
chmod +x scripts/executor.py
```

---

## 📦 제품 관리 (Product)

### 새 상품 생성
```bash
python scripts/executor.py product create \
  --name "상품명" \
  --dbfunc "branchq_get_all_xxxx_info" \
  --config "examples/config.json"  # 선택사항
```

**예시:**
```bash
python scripts/executor.py product create \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"
```

### 상품 목록 조회
```bash
python scripts/executor.py product list
```

**출력:**
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

### 상품 상세정보
```bash
python scripts/executor.py product info --id credit-card
```

**출력:**
```json
{
  "id": "credit-card",
  "name": "신용카드",
  "components": 4,
  "hooks": 4,
  "screens": ["list", "detail", "form", "report"],
  "version": "1.2.0",
  "dbFunction": "branchq_get_all_card_info"
}
```

---

## 🚀 배포 (Deployment)

### 배포 시작

```bash
# Canary 배포 (권장)
python scripts/executor.py deploy start \
  --product credit-card \
  --version 1.2.0 \
  --stage canary

# 모든 제품 배포
python scripts/executor.py deploy start \
  --version 1.0.0 \
  --stage canary

# 드라이 런 (실제 배포 안 함)
python scripts/executor.py deploy start \
  --product credit-card \
  --stage canary \
  --dry-run
```

### 배포 상태 조회
```bash
python scripts/executor.py deploy status
```

**출력:**
```json
{
  "deployments": [
    {
      "id": "deploy-1713268200",
      "products": ["credit-card"],
      "stage": "canary",
      "status": "deployed",
      "started_at": "2026-04-16T10:00:00Z"
    }
  ]
}
```

### 배포 일시중지
```bash
python scripts/executor.py deploy pause --id deploy-1713268200
```

### 배포 재개
```bash
python scripts/executor.py deploy resume --id deploy-1713268200
```

---

## 🔄 롤백 (Rollback)

### 롤백 시작

```bash
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "high error rate" \
  --version 1.1.0
```

**이유 예시:**
- `"high error rate"`
- `"high latency"`
- `"low success rate"`
- `"manual request"`
- `"bug discovered"`

---

## 📊 메트릭 (Metrics)

### 메트릭 수집
```bash
# 전체 메트릭
python scripts/executor.py metrics collect

# 특정 상품만
python scripts/executor.py metrics collect --product credit-card
```

**출력:**
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
  }
}
```

### 트렌드 분석
```bash
# 24시간 (기본)
python scripts/executor.py metrics trend

# 48시간
python scripts/executor.py metrics trend --hours 48

# 1시간
python scripts/executor.py metrics trend --hours 1
```

**출력:**
```json
{
  "period": "last-24-hours",
  "metrics": {
    "error_rate": {
      "current": 0.002,
      "previous": 0.0025,
      "change": "-20%"
    }
  }
}
```

---

## 📈 대시보드 (Dashboard)

### 대시보드 시작
```bash
# 기본 포트 8000
python scripts/executor.py dashboard serve

# 커스텀 포트
python scripts/executor.py dashboard serve --port 5000
```

**접속:** http://localhost:8000

---

## 📌 버전 관리 (Version)

### 버전 증가

```bash
# Patch 버전 증가 (1.2.0 → 1.2.1)
python scripts/executor.py version increment \
  --product credit-card \
  --bump patch

# Minor 버전 증가 (1.2.0 → 1.3.0)
python scripts/executor.py version increment \
  --product credit-card \
  --bump minor

# Major 버전 증가 (1.2.0 → 2.0.0)
python scripts/executor.py version increment \
  --product credit-card \
  --bump major
```

**버전 관리:**
- **Patch (1.0.1)**: 버그 수정
- **Minor (1.1.0)**: 새 기능 추가
- **Major (2.0.0)**: 구조 변경

---

## 🔍 시스템 상태 (Status)

### 전체 시스템 상태
```bash
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

## 💡 일반적인 작업 흐름

### 신규 상품 런칭 (30분)

```bash
# 1. 상품 생성 (2분)
python scripts/executor.py product create \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"

# 2. 설정 커스터마이징 (10분)
nano generated/futures/config.json

# 3. Figma 디자인 (10분)
# ... Figma에서 작업 ...

# 4. 테스트 (3분)
npm test -- generated/futures/components.test.ts

# 5. 배포 시작 (5분)
python scripts/executor.py deploy start \
  --product futures \
  --version 1.0.0 \
  --stage canary

# 6. 모니터링 (자동)
# → Canary 25% (5-10분)
# → Canary 50% (10-20분)
# → 수동 승인 필요
# → Production 100%
```

### 긴급 롤백 (5분)

```bash
# 1. 문제 감지
python scripts/executor.py metrics collect

# 2. 즉시 롤백
python scripts/executor.py rollback start \
  --stage canary-50 \
  --reason "error_rate: 0.8%" \
  --version 1.2.0

# 3. 검증
python scripts/executor.py metrics collect

# 4. 원인 분석
# ... 조사 ...

# 5. 수정 후 재배포
python scripts/executor.py deploy start --product credit-card --stage canary
```

### 정기 모니터링 (일일)

```bash
# 1. 대시보드 확인
python scripts/executor.py dashboard serve

# 2. 메트릭 수집
python scripts/executor.py metrics collect

# 3. 트렌드 분석
python scripts/executor.py metrics trend --hours 24

# 4. 시스템 상태
python scripts/executor.py status
```

---

## 🛠️ 옵션 정리

### 글로벌 옵션
```bash
--help          # 도움말 표시
```

### Product 옵션
```bash
--name          # 상품명 (필수)
--dbfunc        # DB 함수명 (필수)
--config        # 설정 파일 경로 (선택)
--id            # 상품 ID (필수, info 명령)
```

### Deploy 옵션
```bash
--product       # 상품 ID (선택, 기본값: all)
--version       # 버전 (선택, 기본값: latest)
--stage         # 스테이지 (선택, 기본값: canary)
--dry-run       # 드라이 런 (실제 배포 안 함)
--id            # 배포 ID (필수, pause/resume)
```

### Rollback 옵션
```bash
--stage         # 롤백 대상 (필수)
--reason        # 롤백 이유 (필수)
--version       # 복구할 버전 (필수)
```

### Metrics 옵션
```bash
--product       # 상품 ID (선택, 기본값: all)
--hours         # 분석 기간 (선택, 기본값: 24)
```

### Dashboard 옵션
```bash
--port          # 포트 (선택, 기본값: 8000)
```

### Version 옵션
```bash
--product       # 상품 ID (필수)
--bump          # 버전 타입 (patch/minor/major)
```

---

## 📝 로그 파일

로그는 자동으로 저장됩니다:

```bash
# 로그 파일 확인
tail -f UI_TEMPLATE_SYSTEM/executor.log

# 특정 작업만 필터링
grep "product create" UI_TEMPLATE_SYSTEM/executor.log
grep "deploy start" UI_TEMPLATE_SYSTEM/executor.log
grep "ERROR" UI_TEMPLATE_SYSTEM/executor.log
```

---

## 🔗 관련 명령어

### GitHub Actions

```bash
# 로컬에서 workflow 테스트 (act 설치 필수)
act -j test          # 테스트 실행
act -j build         # 빌드 실행
act -j deploy-canary # 배포 시뮬레이션
```

### npm 명령어

```bash
cd UI_TEMPLATE_SYSTEM

# 의존성 설치
npm ci

# 테스트 실행
npm test

# 린팅
npm run lint

# 빌드 (있는 경우)
npm run build
```

---

## ⚠️ 주의사항

1. **배포 전 항상 테스트 실행**
   ```bash
   npm test -- generated/product-id/components.test.ts
   ```

2. **Production 배포 전 승인 대기**
   - Canary 25% 검증
   - Canary 50% 검증
   - 수동 승인 필수

3. **긴급 상황에서 즉시 롤백**
   ```bash
   python scripts/executor.py rollback start \
     --stage canary-50 \
     --reason "critical issue" \
     --version previous-version
   ```

4. **정기적인 메트릭 모니터링**
   - 일일 확인
   - 배포 후 집중 모니터링 (1시간)

5. **로그 보존**
   - executor.log: 모든 작업 기록
   - GitHub Actions: 모든 워크플로우 로그
   - 90일간 유지

---

**버전:** 1.0.0  
**마지막 업데이트:** 2026-04-16
