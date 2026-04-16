# 🎨 BranchQ UI 템플릿 시스템

신규 금융상품 추가 시 **Figma 디자인부터 React 컴포넌트, API 문서까지 자동으로 생성**하는 시스템입니다.

## 📁 폴더 구조

```
UI_TEMPLATE_SYSTEM/
├── README.md                          # 이 파일
│
├── templates/
│   └── UI_TEMPLATE_SYSTEM.yaml       # 4가지 UI 템플릿 정의
│                                      # ├─ list-view
│                                      # ├─ detail-view
│                                      # ├─ form-modal
│                                      # └─ report-section
│
├── scripts/
│   └── generate_product_ui.py        # 신규 상품 UI 자동 생성 스크립트
│                                      # 사용법: python generate_product_ui.py --product "futures" ...
│
├── examples/
│   └── example_product_ui_config.json # 신규 상품 설정 예시 (선물거래)
│
├── docs/
│   ├── UI_TEMPLATE_USAGE_GUIDE.md    # 상세 사용 가이드 & 튜토리얼
│   └── UI_CHANGE_MANAGEMENT.md       # 변경 관리, 배포, 롤백 프로세스
│
└── generated/                         # 자동 생성된 상품별 파일들
    ├── futures/                       # 신규 상품 추가 시 자동 생성
    │   ├── config.json
    │   ├── components/
    │   ├── hooks/
    │   ├── api.yaml
    │   ├── components.test.ts
    │   └── CHECKLIST.md
    ├── derivatives/
    └── ...
```

## 🚀 빠른 시작 (5단계, 30분)

### 1️⃣ 준비 (5분)

```bash
# 현재 폴더 이동
cd "UI_TEMPLATE_SYSTEM"

# 스크립트 권한 설정
chmod +x scripts/generate_product_ui.py
```

### 2️⃣ 신규 상품 자동 생성 (2분)

```bash
# 기본 생성
python scripts/generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"

# 또는 커스텀 설정과 함께 생성
python scripts/generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info" \
  --config "examples/example_product_ui_config.json"
```

생성 결과:
```
generated/futures/
├── config.json                # 상품 설정
├── components/                # React 컴포넌트 스텁 (4개)
├── hooks/                     # Custom Hooks (4개)
├── api.yaml                   # OpenAPI 문서
├── components.test.ts         # 테스트 케이스
└── CHECKLIST.md              # 작업 체크리스트
```

### 3️⃣ 설정 커스터마이징 (10분)

```bash
# 생성된 설정 파일 수정
nano generated/futures/config.json

# 실제 데이터 필드 정의:
# - summaryMetrics (요약 지표)
# - listColumns (테이블 열)
# - detailSections (상세 정보 섹션)
# - formFields (입력 폼 필드)
# - charts (리포트 차트)
```

### 4️⃣ Figma 디자인 (10분)

Figma에서:
1. 기존 템플릿 복사
2. 상품명과 필드를 config.json에 맞게 변경
3. Code Connect 메타데이터 추가

### 5️⃣ 배포 (3분)

```bash
# 체크리스트 완료 확인
cat generated/futures/CHECKLIST.md

# 테스트
npm test -- generated/futures/components.test.ts

# 배포
npm run deploy:dev
```

## 📚 문서

| 파일 | 내용 | 대상 |
|------|------|------|
| **UI_TEMPLATE_USAGE_GUIDE.md** | 상세한 사용 가이드, Step-by-Step 튜토리얼, FAQ | 개발자 |
| **UI_CHANGE_MANAGEMENT.md** | 변경사항 관리, 배포 프로세스, 롤백, 모니터링 | 팀리더, DevOps |

## 🎯 핵심 개념

### 4가지 표준 UI 템플릿

#### 1. List View (목록 조회)
- 요약 지표 + 검색 + 필터 + 데이터 테이블
- 예시: 신용카드 목록, 투자상품 포트폴리오

#### 2. Detail View (상세 조회)
- 정보 패널 + 탭 + 차트 + 거래내역
- 예시: 카드 상세정보, 상품 분석

#### 3. Form Modal (입력/수정)
- 폼 필드 + 검증 + 제출
- 예시: 새 거래 시작, 정보 수정

#### 4. Report Section (리포트)
- 지표 카드 + 차트 + 테이블 + 인사이트
- 예시: 월별 분석, 성과 리포트

### 자동 생성 대상

```
React 컴포넌트
├── ListViewContainer.tsx
├── DetailViewContainer.tsx
├── FormModal.tsx
└── ReportSection.tsx

Custom Hooks
├── use-list.ts
├── use-detail.ts
├── use-form.ts
└── use-report.ts

문서
├── api.yaml (OpenAPI 3.0)
├── components.test.ts
├── CHECKLIST.md
└── config.json
```

## 💡 사용 예시

### 신규 상품 추가: "선물거래"

```bash
# 1단계: 자동 생성
python scripts/generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"

# 2단계: 설정 수정
# generated/futures/config.json 편집
# - 요약 지표: "총 진입액", "총 평가액", "총 손익율"
# - 테이블 열: "계약번호", "상품", "진입가", "손익" 등
# - 탭: "개요", "거래내역", "분석"
# - 차트: "손익 추이", "월별 성과"

# 3단계: Figma에서 디자인
# templates/UI_TEMPLATE_SYSTEM.yaml의 example 참고

# 4단계: Code Connect 설정
# Figma 노드에 메타데이터 추가

# 5단계: 테스트 및 배포
npm test -- generated/futures/components.test.ts
npm run deploy:prod
```

결과:
- ✅ React 컴포넌트 즉시 사용 가능
- ✅ 테스트 케이스 포함
- ✅ API 문서 자동 생성
- ✅ 개발 시간 80% 단축

## ⚙️ 설정 파일 (config.json) 상세

### 최소 필수 설정

```json
{
  "productId": "futures",
  "productName": "선물거래",
  "dbFunction": "branchq_get_all_futures_info",
  
  "screens": {
    "list": {
      "summaryMetrics": [...],
      "listColumns": [...],
      "filterOptions": [...]
    },
    "detail": {
      "infoPanel": {...},
      "tabs": [...]
    },
    "form": {
      "fields": [...]
    },
    "report": {
      "metrics": [...],
      "charts": [...]
    }
  }
}
```

자세한 예시: `examples/example_product_ui_config.json`

## 🔄 변경 관리

### 자동 생성 스크립트 재실행

기존 상품의 UI를 변경해야 할 때:

```bash
# 1. config.json 수정
nano generated/futures/config.json

# 2. React 컴포넌트 재생성 (선택사항)
python scripts/generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info" \
  --config "generated/futures/config.json"

# 3. 버전 업데이트
npm run version:patch

# 4. CHANGELOG 생성
npm run changelog:generate

# 5. 배포
npm run deploy:prod
```

### 버전 관리

- **Patch (1.0.1)**: 버그 수정, 문서 업데이트
- **Minor (1.1.0)**: 새 필드/탭 추가, 기능 개선
- **Major (2.0.0)**: 레이아웃 변경, API 구조 변경

자세한 내용: `docs/UI_CHANGE_MANAGEMENT.md`

## 📊 현재 지원 상품

### 기존 상품 (템플릿 기반 구성 완료)

| 상품 | ID | DB함수 | 상태 |
|------|-----|---------|------|
| 신용카드 | credit-card | branchq_get_all_card_info | ✅ |
| 투자상품 | investment | branchq_get_all_inv_list | ✅ |
| 환율 정보 | exchange | branchq_get_all_exg_rate | ✅ |

### 신규 추가 가능

```bash
python scripts/generate_product_ui.py \
  --product "new-product-id" \
  --name "상품 이름" \
  --dbfunc "branchq_get_all_xxxx_info"
```

## 🆘 문제 해결

### Q: 생성 스크립트 실행 오류

```bash
# 권한 설정
chmod +x scripts/generate_product_ui.py

# 파이썬 버전 확인
python --version  # 3.8+ 필요

# 재실행
python scripts/generate_product_ui.py --product "futures" ...
```

### Q: config.json 필드 모르겠음

```bash
# 예시 파일 참고
cat examples/example_product_ui_config.json

# 또는 템플릿 참고
less templates/UI_TEMPLATE_SYSTEM.yaml
```

### Q: Figma 디자인이 필요한가?

네, 다음 단계가 필요합니다:
1. 자동 생성 스크립트로 구조 생성 (완료)
2. Figma에서 실제 디자인 (수동)
3. Code Connect로 연결 (수동)

## 📞 지원

문제가 발생하면:

1. **docs/UI_TEMPLATE_USAGE_GUIDE.md** - 상세 가이드 및 FAQ
2. **generated/{product}/CHECKLIST.md** - 작업 체크리스트
3. **examples/** - 참고 예시

## 🎯 다음 단계

### Phase 1: 현재 (완료)
- [x] 4가지 UI 템플릿 정의
- [x] 자동 생성 스크립트
- [x] 문서 작성

### Phase 2: 진행 중
- [ ] Code Connect 설정 (Figma ↔ React 자동 동기화)
- [ ] 디자인 시스템 대시보드
- [ ] 실제 상품 적용

### Phase 3: 계획
- [ ] 모바일 반응형 템플릿
- [ ] 다크 모드 지원
- [ ] 접근성(A11y) 강화

## 📝 라이선스

Internal use only

---

**마지막 업데이트:** 2026-04-16  
**버전:** 1.0.0

생성된 파일들을 확인하려면:
```bash
tree UI_TEMPLATE_SYSTEM/
```

또는 Windows에서:
```bash
dir /s UI_TEMPLATE_SYSTEM
```
