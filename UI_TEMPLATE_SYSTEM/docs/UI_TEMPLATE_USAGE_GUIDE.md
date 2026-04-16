# BranchQ UI 템플릿 시스템 - 사용 가이드

**목차**
- [개요](#개요)
- [템플릿 구조](#템플릿-구조)
- [신규 상품 추가](#신규-상품-추가)
- [템플릿 커스터마이징](#템플릿-커스터마이징)
- [자동 생성 프로세스](#자동-생성-프로세스)
- [FAQ](#faq)

---

## 개요

**UI 템플릿 시스템**은 신규 금융상품이나 기능이 추가될 때, Figma 디자인부터 React 컴포넌트, API 문서, 테스트 케이스까지 **자동으로 생성**하는 시스템입니다.

### 핵심 가치

| 항목 | 설명 |
|------|------|
| **일관성** | 모든 상품이 동일한 UI/UX 패턴을 따름 |
| **신속성** | 수동 작업 시간 80% 단축 |
| **확장성** | 신규 상품 추가가 매우 간편 |
| **품질** | 검증된 템플릿과 자동 테스트 |
| **문서화** | 자동으로 생성되는 API 문서 |

### 지원하는 상품 (현재)

- 신용카드 (credit-card)
- 투자상품 (investment)
- 환율 정보 (exchange)
- *더 많은 상품 추가 예정*

---

## 템플릿 구조

### 4가지 기본 템플릿

```
┌─────────────────────────────────────────┐
│       UI TEMPLATE SYSTEM (4가지)        │
├─────────────────────────────────────────┤
│                                          │
│ 1. List View (목록 조회)                 │
│    └─ 요약 지표 + 필터 + 데이터 테이블  │
│                                          │
│ 2. Detail View (상세 조회)              │
│    └─ 정보 패널 + 탭 + 차트 + 거래내역  │
│                                          │
│ 3. Form Modal (입력/수정)               │
│    └─ 폼 필드 + 검증 + 제출             │
│                                          │
│ 4. Report Section (리포트)              │
│    └─ 지표 카드 + 차트 + 테이블 + 인사이트 │
│                                          │
└─────────────────────────────────────────┘
```

### 템플릿 파일

```
UI_TEMPLATE_SYSTEM.yaml
├── templates:
│   ├── list-view
│   │   ├── layout
│   │   ├── dataBinding
│   │   ├── interactions
│   │   └── responsive
│   ├── detail-view
│   │   ├── layout
│   │   ├── detailSections
│   │   ├── detailTabs
│   │   └── dataBinding
│   ├── form-modal
│   │   ├── formFields
│   │   ├── formActions
│   │   └── validation
│   └── report-section
│       ├── metrics
│       ├── charts
│       ├── tables
│       └── insights
│
├── products:
│   ├── credit-card (기존 상품)
│   ├── investment (기존 상품)
│   └── exchange (기존 상품)
│
├── newProductChecklist (신규 상품 추가 단계)
└── customizationRules (커스터마이징 규칙)
```

---

## 신규 상품 추가

### Step 1: 준비 (5분)

신규 상품 추가 전 다음을 확인하세요:

- [x] **DB 함수 명세서** (`클라우드브랜치Q_(DB)표준Funcs명세서_r4.0.xlsx`)
  - 함수명: `branchq_get_all_{product}_info`
  - 입력 파라미터: contract_no, user_id, biz_no, start_dt, end_dt
  - 출력 필드: 반드시 확인

- [x] **상품 기본정보**
  - 상품 ID: (예: "futures")
  - 상품 이름: (예: "선물거래")
  - 카테고리: (예: "investment")

### Step 2: 자동 생성 (2분)

자동 생성 스크립트 실행:

```bash
# 기본 생성
python generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info"

# 커스텀 설정으로 생성
python generate_product_ui.py \
  --product "futures" \
  --name "선물거래" \
  --dbfunc "branchq_get_all_futures_info" \
  --config "custom_config.json"
```

생성 결과:

```
generated/futures/
├── config.json                    # 상품 설정
├── components/
│   ├── ListViewContainer.tsx
│   ├── DetailViewContainer.tsx
│   ├── FormModal.tsx
│   └── ReportSection.tsx
├── hooks/
│   ├── use-list.ts
│   ├── use-detail.ts
│   ├── use-form.ts
│   └── use-report.ts
├── api.yaml                       # OpenAPI 문서
├── components.test.ts             # 테스트 케이스
└── CHECKLIST.md                   # 작업 체크리스트
```

### Step 3: 데이터 바인딩 정의 (15분)

생성된 `config.json`을 수정하여 실제 데이터 필드를 정의합니다.

**예: 선물거래 상품**

```json
{
  "productId": "futures",
  "productName": "선물거래",
  "dbFunction": "branchq_get_all_futures_info",

  "screens": {
    "list": {
      "summaryMetrics": [
        {
          "id": "total-entry",
          "label": "총 진입액",
          "value": "totalEntryAmount",
          "format": "currency"
        },
        // ... 추가 지표
      ],

      "listColumns": [
        {
          "field": "contractNo",
          "label": "계약번호",
          "width": "100px"
        },
        {
          "field": "productName",
          "label": "상품명",
          "width": "150px"
        },
        // ... 추가 열
      ]
    }
  }
}
```

### Step 4: Figma 디자인 생성 (1시간)

Figma에서:

1. **목록 화면 디자인**
   - 기존 "list-view" 템플릿 복사
   - 열 이름을 `config.json`의 listColumns에 맞게 변경
   - 상품 아이콘/색상 추가

2. **상세 화면 디자인**
   - 기존 "detail-view" 템플릿 복사
   - 정보 섹션을 `detailSections`에 맞게 수정
   - 탭을 `detailTabs`에 맞게 수정

3. **폼 모달 디자인**
   - 기존 "form-modal" 템플릿 복사
   - 폼 필드를 `formFields`에 맞게 수정

4. **리포트 섹션 디자인**
   - 기존 "report-section" 템플릿 복사
   - 차트와 지표를 상품에 맞게 커스터마이징

5. **Code Connect 설정**
   - Figma 노드에 메타데이터 추가
   - 컴포넌트와 React 파일 연결

### Step 5: 코드 구현 (3시간)

생성된 stub 파일들을 구현:

```typescript
// components/ListViewContainer.tsx
export const FuturesListView: React.FC<Props> = () => {
  const { data, metrics, loading, error, fetchList } = useFuturesList();

  useEffect(() => {
    fetchList();
  }, []);

  // 구현...
};

// hooks/use-list.ts
export const useFuturesList = () => {
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  const fetchList = useCallback(async (params) => {
    const response = await api.get('/futures/list', { params });
    setData(response.data.items);
    setMetrics(response.data.summary);
  }, []);

  return { data, metrics, fetchList };
};
```

### Step 6: 테스트 (1시간)

```bash
# 생성된 테스트 케이스 실행
npm test -- components.test.ts

# 시각적 회귀 테스트
npm run test:visual

# E2E 테스트
npm run test:e2e
```

### Step 7: 배포 (30분)

```bash
# 빌드
npm run build

# 개발 환경 배포
npm run deploy:dev

# 스테이징 환경 배포
npm run deploy:staging

# 운영 환경 배포
npm run deploy:prod
```

---

## 템플릿 커스터마이징

### 요약 지표 추가

```yaml
# UI_TEMPLATE_SYSTEM.yaml - 기본 템플릿
summaryMetrics:
  - { label: "총 진입액", value: "totalEntryAmount", format: "currency" }

# 상품별 커스터마이징 (config.json)
"summaryMetrics": [
  {
    "id": "total-entry",
    "label": "총 진입액",
    "value": "totalEntryAmount",
    "format": "currency",
    "icon": "wallet",
    "color": "primary"
  },
  {
    "id": "total-current",
    "label": "총 평가액",
    "value": "totalCurrentValue",
    "format": "currency"
  }
]
```

### 데이터 테이블 열 추가

```json
"listColumns": [
  {
    "field": "contractNo",
    "label": "계약번호",
    "width": "100px",
    "sortable": true,
    "searchable": true
  },
  {
    "field": "productName",
    "label": "상품",
    "width": "150px",
    "sortable": true
  },
  {
    "field": "pnlAmount",
    "label": "손익",
    "width": "120px",
    "format": "currency",
    "align": "right",
    "color": "dynamic"
  }
]
```

### 탭 추가

```json
"detailTabs": [
  {
    "id": "overview",
    "label": "개요",
    "contentType": "chart"
  },
  {
    "id": "transactions",
    "label": "거래 내역",
    "contentType": "table"
  },
  {
    "id": "analysis",
    "label": "분석",
    "contentType": "analysis"
  },
  {
    "id": "custom",
    "label": "커스텀 탭",
    "contentType": "custom"
  }
]
```

### 차트 추가

```json
"charts": [
  {
    "id": "pnl-trend",
    "type": "line",
    "title": "손익 추이",
    "dataSource": "GET /api/futures/report/pnl-trend",
    "xAxis": "date",
    "yAxis": "pnl",
    "colors": ["#2196F3"]
  },
  {
    "id": "monthly-performance",
    "type": "bar",
    "title": "월별 성과",
    "dataSource": "GET /api/futures/report/monthly-performance",
    "categories": ["수익", "손실"]
  }
]
```

---

## 자동 생성 프로세스

### 생성 대상

스크립트 실행 시 다음 파일들이 자동 생성됩니다:

#### 1. React 컴포넌트 (4개)
- `ListViewContainer.tsx` - 목록 조회
- `DetailViewContainer.tsx` - 상세 조회
- `FormModal.tsx` - 입력/수정 폼
- `ReportSection.tsx` - 리포트 섹션

#### 2. Custom Hooks (4개)
- `use-list.ts` - 목록 조회 로직
- `use-detail.ts` - 상세 조회 로직
- `use-form.ts` - 폼 제출 로직
- `use-report.ts` - 리포트 조회 로직

#### 3. API 문서
- `api.yaml` - OpenAPI 3.0 명세

#### 4. 테스트
- `components.test.ts` - React 컴포넌트 테스트

#### 5. 설정 파일
- `config.json` - 상품 설정
- `CHECKLIST.md` - 작업 체크리스트

### 생성 템플릿

각 컴포넌트는 다음 기본 구조를 따릅니다:

```typescript
// ListViewContainer.tsx 기본 구조
export const ProductListView: React.FC<Props> = () => {
  const { data, metrics, loading, error, fetchList } = useProductList();

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      {/* 헤더 */}
      {/* 필터 및 검색 */}
      {/* 요약 지표 */}
      {/* 데이터 테이블 */}
    </div>
  );
};
```

---

## FAQ

### Q1. 기존 상품에 새 화면을 추가하려면?

기존 상품의 설정 JSON을 수정하고, 새 Tab 또는 섹션을 추가합니다:

```json
{
  "productId": "credit-card",
  "screens": {
    "detail": {
      "tabs": [
        { "id": "overview", "label": "개요" },
        { "id": "transactions", "label": "거래 내역" },
        { "id": "new-analytics", "label": "분석 (신규)" }
      ]
    }
  }
}
```

### Q2. 특정 상품만 특별한 UI가 필요하면?

`customizationRules`를 사용하여 상품별 커스터마이징을 합니다:

```yaml
# UI_TEMPLATE_SYSTEM.yaml
customizationRules:
  listView:
    customizable: true
    constraints:
      minColumns: 3
      maxColumns: 10
```

### Q3. API 응답 형식이 다르면?

`dataBinding` 섹션에서 응답 필드를 매핑합니다:

```json
{
  "dataBinding": {
    "listApi": {
      "response": {
        "items": "data.products",  // API의 items 경로
        "total": "pagination.total"  // API의 total 경로
      }
    }
  }
}
```

### Q4. 자동 생성된 코드는 수정 가능한가?

네, 생성된 코드는 **시작점(stub)**일 뿐입니다. 실제 구현은 개발자가 자유롭게 수정 가능합니다.

생성 후 다시 실행해도 기존 파일을 덮어쓰지 않습니다 (옵션 설정 가능).

### Q5. 변경사항을 추적할 수 있나?

```bash
# 버전 관리
npm run version:increment  # patch/minor/major

# 변경 로그
npm run changelog:generate
```

### Q6. 다른 팀과 공유하려면?

```bash
# 생성된 파일들 export
npm run export:artifacts

# Figma 링크 공유
# Figma 디자인은 자동으로 업데이트됨
```

---

## 모범 사례

### ✅ Do

- ✅ 템플릿 구조를 따릅니다
- ✅ `config.json`을 먼저 정의합니다
- ✅ 생성된 테스트 케이스를 실행합니다
- ✅ 변경사항을 버전 관리합니다
- ✅ 팀과 설정을 공유합니다

### ❌ Don't

- ❌ 템플릿 구조를 무시합니다
- ❌ 각 상품마다 다른 UI 패턴을 만듭니다
- ❌ 테스트 없이 배포합니다
- ❌ 변경 로그를 남기지 않습니다
- ❌ 설정을 개인 저장소에 숨깁니다

---

## 지원

문제가 발생하면:

1. **CHECKLIST.md**의 체크리스트를 확인하세요
2. **FAQ**에서 유사한 질문을 찾으세요
3. **예시 파일** (`examples/` 폴더)을 참고하세요
4. 팀 리더에게 문의하세요

---

**마지막 업데이트:** 2026-04-16
**버전:** 1.0.0
