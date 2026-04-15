# AI 챗봇 응답 블록 가이드

> K-Branch 기업자금관리서비스 AI 챗봇의 응답 블록 공통 포맷 정의서
>
> 버전: 1.0 | 작성일: 2026-03-30

---

## 1. 개요

### 1.1 목적
AI 챗봇이 사용자 질의에 대해 **구조화된 블록 단위**로 응답을 구성한다. 각 블록은 독립적인 렌더링 단위이며, 질의 유형에 따라 블록 조합이 결정된다.

### 1.2 설계 원칙
- **블록 독립성**: 각 블록은 자체 data 스키마를 가지며 독립적으로 렌더링된다
- **조합 기반**: 질의 유형(씬)에 따라 블록 조합이 달라진다
- **JSON 기반**: 모든 응답은 JSON 배열로 정의되며, 렌더러가 DOM으로 변환한다
- **공통 푸터**: 모든 응답 하단에 다운로드/공유/신고 액션이 자동 표시된다

### 1.3 응답 JSON 구조 (Envelope)

```json
{
  "scene": "analysis",
  "model": "sonnet",
  "timestamp": "오전 11:07",
  "aiText": "분석 결과를 안내드립니다.",
  "pills": ["📊 데이터 조회 중", "🔍 패턴 분석 중", "📋 보고서 생성 중"],
  "blocks": [
    { "type": "report-header", "data": { ... } },
    { "type": "number-stat", "data": { ... } },
    { "type": "data-table", "data": { ... } },
    { "type": "related-questions", "data": { ... } }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `scene` | string | 질의 유형 식별자 (`general`, `analysis`, `forecast`, `anomaly`, `consult`, `report`) |
| `model` | string | AI 모델명 (표시용) |
| `timestamp` | string | 응답 시각 |
| `aiText` | string | 블록 상단에 표시되는 본문 텍스트 |
| `pills` | string[] | 프로그레스 필 메시지 배열 |
| `blocks` | Block[] | 블록 배열 (순서대로 렌더링) |

---

## 2. 질의 유형 분류 (6종)

### P1. 일반 질의 (General)

| 항목 | 내용 |
|------|------|
| **scene** | `general` |
| **설명** | 단순 텍스트 질의 + 후속 대화 |
| **예시 질문** | "이번 주 법인카드 사용 내역 알려줘" |
| **특징** | 멀티턴 대화 가능, 테이블 데이터 포함 가능 |

**블록 플로우:**
```
[text-content] → [data-table] → [related-questions]
```

**프로그레스 필:**
```
📊 사용 내역 조회 중 → 📋 데이터 정리 중
```

---

### P2. 분석 질의 (Analysis)

| 항목 | 내용 |
|------|------|
| **scene** | `analysis` |
| **설명** | 데이터 분석 + 리포트 형태의 구조화된 응답 |
| **예시 질문** | "2월 법인카드 사용현황 리포트 작성해줘" |
| **특징** | 가장 풍부한 블록 조합, 보고서 헤더/통계/차트/패턴분석 포함 |

**블록 플로우:**
```
[report-header] → [number-stat] → [pattern-analysis] → [data-table]
→ [alert-box] → [bar-chart] → [text-content] → [steps]
→ [source-box] → [related-questions]
```

**프로그레스 필:**
```
📊 카드 사용 데이터 수집 중 → 🔍 사용 패턴 분석 중 → 📋 리포트 생성 중
```

---

### P3. 예측 질의 (Forecast)

| 항목 | 내용 |
|------|------|
| **scene** | `forecast` |
| **설명** | 미래 예측/전망 보고서 |
| **예시 질문** | "2026년 자금흐름 예상보고서 작성해줘" |
| **특징** | 예측 데이터 테이블 + 콜아웃(주의사항) + 추세 차트 |

**블록 플로우:**
```
[report-header] → [data-table] → [callout] → [bar-chart] → [related-questions]
```

**프로그레스 필:**
```
📊 과거 데이터 분석 중 → 🔮 예측 모델 실행 중 → 📋 보고서 구성 중
```

---

### P4. 이상거래 (Anomaly)

| 항목 | 내용 |
|------|------|
| **scene** | `anomaly` |
| **설명** | 이상 패턴 감지 알림 |
| **예시 질문** | "이상거래 감지 내역 보여줘" |
| **특징** | 뱃지(위험도) + 점수 컬럼이 있는 특수 테이블 |

**블록 플로우:**
```
[data-table (badge+score)] → [related-questions]
```

**프로그레스 필:**
```
📊 일별 통계 조회 중 → 🔍 이상거래 패턴 분석 중 → 📋 카테고리별 분류 중
```

---

### P5. 상담/가이드 (Consult)

| 항목 | 내용 |
|------|------|
| **scene** | `consult` |
| **설명** | 업무 절차 안내, 매뉴얼 참조 |
| **예시 질문** | "계좌 등록 방법을 알려줘" |
| **특징** | 단계별 안내(steps) + 출처(매뉴얼 링크) + fallback 시 운영자 문의 |

**블록 플로우:**
```
[text-content] → [steps] → [source-box (downloadable)] → [related-questions]
```

**프로그레스 필:**
```
📂 관련 매뉴얼 검색 중 → 📖 절차 정리 중
```

---

### P6. 보고서 (Report)

| 항목 | 내용 |
|------|------|
| **scene** | `report` |
| **설명** | 자금현황 등 정형 보고서 생성 |
| **예시 질문** | "자금현황 보고서 작성해줘" |
| **특징** | 보고서 헤더 + 통계 + 다중 테이블 + 차트 + 알림 |

**블록 플로우:**
```
[report-header] → [text-content] → [number-stat] → [data-table]
→ [bar-chart] → [alert-box] → [source-box] → [related-questions]
```

**프로그레스 필:**
```
📊 자금 데이터 수집 중 → 📋 보고서 구성 중 → ✅ 검증 중
```

---

## 3. 블록 타입 레퍼런스 (15종)

### 3.1 `text-content` - 텍스트 답변

**용도:** 일반 텍스트 응답. 줄바꿈(`\n`) 지원.

**JSON 스키마:**
```json
{
  "type": "text-content",
  "data": {
    "text": "계좌 등록은 [기초정보] > [계좌정보관리] 메뉴에서 진행할 수 있습니다.\n자세한 절차는 아래를 참고해주세요."
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `text` | string | O | 본문 텍스트 (`\n`으로 줄바꿈) |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| font-size | 16px |
| color | `var(--gray-700)` #374151 |
| line-height | 1.7 |
| white-space | pre-line |
| margin-bottom | 16px |
| 최대 길이(권장) | 500자 이내 |

---

### 3.2 `report-header` - 보고서 헤더

**용도:** 분석/예측/보고서 응답의 최상단에 보고서 제목과 메타정보 표시.

**JSON 스키마:**
```json
{
  "type": "report-header",
  "data": {
    "icon": "📊",
    "title": "2월 법인카드 사용현황 리포트",
    "subtitle": "2026.02.01 ~ 2026.02.28 기준",
    "subtitleIcon": "📅"
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `icon` | string | O | 제목 앞 이모지 |
| `title` | string | O | 보고서 제목 |
| `subtitle` | string | O | 부제 (기간, 기준일 등) |
| `subtitleIcon` | string | - | 부제 앞 이모지 |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 제목 font-size | 20px |
| 제목 font-weight | 700 |
| 부제 font-size | 14px |
| 부제 color | `var(--gray-500)` |
| 제목 최대 길이(권장) | 30자 이내 |
| 하단 margin | 8px |

---

### 3.3 `number-stat` - 숫자 통계

**용도:** 핵심 수치를 그리드 카드로 표시. 전월 대비 증감 표시 가능.

**JSON 스키마:**
```json
{
  "type": "number-stat",
  "data": {
    "items": [
      {
        "value": "156건",
        "label": "총 사용건수",
        "color": "#2563EB",
        "diff": "+12.3%",
        "diffDir": "up"
      },
      {
        "value": "4,820만원",
        "label": "총 사용금액",
        "color": "#059669",
        "diff": "-5.1%",
        "diffDir": "down"
      },
      {
        "value": "31만원",
        "label": "건당 평균",
        "color": "#7c3aed"
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | array | O | 통계 항목 배열 |
| `items[].value` | string | O | 수치 값 (포맷팅된 문자열) |
| `items[].label` | string | O | 항목 라벨 |
| `items[].color` | string | - | 값의 색상 (hex 또는 CSS var) |
| `items[].diff` | string | - | 증감 표시 (예: "+12.3%") |
| `items[].diffDir` | string | - | 증감 방향 (`"up"` / `"down"`) |

**세부 규격:**
| 항목 | 데스크톱 | 모바일 리포트 |
|------|---------|-------------|
| 그리드 | `auto-fit, minmax(110px, 1fr)` | `1fr 1fr` (2열 고정) |
| 항목 수(권장) | **2~4개** | 2~4개 |
| gap | 12px | 12px |
| 카드 padding | 18px 14px | 18px 14px |
| 카드 border | 1px solid `var(--gray-200)` | 동일 |
| 카드 border-radius | 4px | 4px |

| 텍스트 요소 | font-size | font-weight | color |
|------------|-----------|-------------|-------|
| 수치 값 | **28px** | 700 | `items[].color` 또는 `var(--gray-900)` |
| 라벨 | 14px | 500 | `var(--gray-500)` |
| 증감 표시 | 13px | 600 | up=`var(--success)` / down=`var(--error)` |

| letter-spacing | -0.3px (값) |

---

### 3.4 `summary-cards` - 요약 카드

**용도:** 여러 항목의 요약 정보를 카드 그리드로 표시.

**JSON 스키마:**
```json
{
  "type": "summary-cards",
  "data": {
    "cards": [
      {
        "label": "예적금 계좌 수",
        "value": "5개",
        "sub": "정기예금 3 / 적금 2"
      },
      {
        "label": "총 잔액",
        "value": "43억 2,500만원"
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `cards` | array | O | 카드 배열 |
| `cards[].label` | string | O | 카드 라벨 |
| `cards[].value` | string | O | 카드 값 |
| `cards[].sub` | string | - | 부가 정보 |

**세부 규격:**
| 항목 | 데스크톱 | 모바일 리포트 |
|------|---------|-------------|
| 그리드 | `auto-fit, minmax(150px, 1fr)` | `1fr 1fr` (2열 고정) |
| 카드 수(권장) | **2~4개** | 2~4개 |
| gap | 12px | 12px |
| 카드 padding | 16px 20px | 16px 20px |
| 카드 border | 1px solid `var(--gray-200)` | 동일 |
| 카드 border-radius | 4px | 4px |

| 텍스트 요소 | font-size | font-weight | color |
|------------|-----------|-------------|-------|
| 라벨 | 13px | 500 | `var(--gray-500)` |
| 값 | **24px** | 700 | `var(--gray-900)` |
| 부가정보 | 13px | 400 | `var(--gray-400)` |

| letter-spacing | -0.3px (값) |

---

### 3.5 `data-table` - 데이터 테이블

**용도:** 다양한 데이터를 테이블 형식으로 표시. 뱃지/점수 등 특수 컬럼 지원.

**JSON 스키마:**
```json
{
  "type": "data-table",
  "data": {
    "caption": "주요 사용처 TOP 5",
    "captionBadge": {
      "text": "상위 5건",
      "color": "blue"
    },
    "columns": [
      { "key": "date", "label": "등록일", "align": "left" },
      { "key": "company", "label": "회사명", "align": "left" },
      { "key": "currency", "label": "통화코드", "align": "center" },
      { "key": "balance", "label": "총잔고", "align": "right" },
      { "key": "status", "label": "상태", "align": "center", "type": "badge" },
      { "key": "score", "label": "위험점수", "align": "center", "type": "score" }
    ],
    "rows": [
      {
        "date": "20260228",
        "company": "(주)쿠콘글로벌지점",
        "currency": "EUR",
        "balance": "8.46",
        "status": { "text": "정상", "color": "green" },
        "score": { "value": 85, "max": 100 }
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `caption` | string | - | 테이블 제목 |
| `captionBadge` | object | - | 제목 옆 뱃지 `{ text, color }` |
| `columns` | array | O | 컬럼 정의 배열 |
| `columns[].key` | string | O | 데이터 키 |
| `columns[].label` | string | O | 헤더 표시 텍스트 |
| `columns[].align` | string | - | 정렬 (`left`/`center`/`right`) |
| `columns[].type` | string | - | 특수 타입 (`badge`/`score`) |
| `rows` | array | O | 행 데이터 배열 |

**특수 컬럼 타입:**
- `badge`: `{ text: "정상", color: "green" }` → 컬러 뱃지로 렌더링
- `score`: `{ value: 85, max: 100 }` → 프로그레스 바로 렌더링

**뱃지 색상:** `green`, `red`, `orange`, `blue`, `gray`

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 컨테이너 border | 1px solid `var(--gray-200)` |
| 컨테이너 border-radius | 4px |
| overflow-x | auto (가로 스크롤) |
| 테이블 font-size | 14px (데스크톱) / 13px (모바일) |
| 테이블 table-layout | auto |
| 헤더 배경 | `var(--gray-100)` |
| 헤더 font-size | 13px |
| 헤더 font-weight | 600 |
| 헤더 padding | 10px 14px |
| 셀 padding | 10px 14px |
| 행 간 구분선 | 1px solid `var(--gray-100)` |
| 짝수행 배경 | `var(--gray-50)` |
| hover 배경 | #f1f5f9 |
| 최대 행 수(권장) | **5~7행** (초과 시 스크롤 또는 "더보기") |
| 최대 컬럼 수(권장) | **4~6열** (720px 컨테이너 기준) |

**뱃지 규격:**
| 항목 | 값 |
|------|-----|
| padding | 3px 10px |
| border-radius | 3px |
| font-size | 13px |
| font-weight | 600 |

**점수(score) 규격:**
| 점수 범위 | 색상 |
|----------|------|
| 90점 이상 | #dc2626 (빨간) |
| 80~89점 | #ea580c (주황) |
| 80점 미만 | #2563EB (파란) |
| font-size | 20px, font-weight: 700 |

---

### 3.6 `bar-chart` - 바 차트

**용도:** 막대 그래프로 데이터 시각화. Chart.js 기반.

**JSON 스키마:**
```json
{
  "type": "bar-chart",
  "data": {
    "title": "월별 사용금액 추이",
    "labels": ["1월", "2월", "3월", "4월", "5월", "6월"],
    "datasets": [
      {
        "label": "사용금액",
        "data": [3200, 4820, 3900, 5100, 4200, 4600],
        "backgroundColor": "#3b82f6"
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | - | 차트 제목 |
| `labels` | string[] | O | X축 라벨 |
| `datasets` | array | O | 데이터셋 배열 |
| `datasets[].label` | string | O | 데이터셋 이름 (범례) |
| `datasets[].data` | number[] | O | 데이터 값 배열 |
| `datasets[].backgroundColor` | string/string[] | O | 막대 색상 |

**차트 사이즈 규격:**
| 항목 | 데스크톱 | 모바일 리포트 |
|------|---------|-------------|
| canvas 높이 | **260px** | **200px** |
| canvas wrapper 너비 | 85% (부모 대비) | 100% |
| 컨테이너 padding | 16px 20px | 16px 20px |
| 컨테이너 border | 1px solid `var(--gray-200)` | 동일 |
| 컨테이너 border-radius | 4px | 4px |
| 제목 font-size | 15px | 15px |
| 제목 font-weight | 700 | 700 |
| 제목 margin-bottom | 10px | 10px |

**Chart.js 옵션:**
| 항목 | 값 |
|------|-----|
| responsive | true |
| maintainAspectRatio | false |
| 범례 표시 | dataset 2개 이상일 때만 표시 |
| Y축 시작 | 0 (beginAtZero) |
| Y축 grid 색상 | `rgba(0,0,0,0.05)` |
| X축 grid | 표시 안함 |
| 막대 border-radius | 6px |

**데이터 권장 수량:**
| 항목 | 권장 |
|------|------|
| X축 라벨 수 | **4~8개** |
| 데이터셋 수 | **1~3개** (3개 초과 시 가독성 저하) |

---

### 3.7 `line-chart` - 라인 차트

**용도:** 추세/시계열 데이터를 선 그래프로 시각화. Chart.js 기반.

**JSON 스키마:** (`bar-chart`와 동일한 구조)
```json
{
  "type": "line-chart",
  "data": {
    "title": "자금흐름 추이",
    "labels": ["1월", "2월", "3월"],
    "datasets": [
      {
        "label": "유입",
        "data": [5000, 6200, 5800],
        "backgroundColor": "#22c55e"
      },
      {
        "label": "유출",
        "data": [4200, 5100, 4800],
        "backgroundColor": "#ef4444"
      }
    ]
  }
}
```

**차트 사이즈:** bar-chart와 동일 (260px/200px)

**라인 차트 전용 옵션:**
| 항목 | 값 |
|------|-----|
| tension (곡선도) | 0.3 |
| point radius | 4px |
| fill | enabled (배경 투명 채움, alpha 0.1) |
| 데이터 포인트 수(권장) | **4~12개** |
| 데이터셋 수(권장) | **1~3개** |

---

### 3.8 `alert-box` - 알림/경고

**용도:** 중요한 알림, 경고, 에러, 성공 메시지를 강조 표시.

**JSON 스키마:**
```json
{
  "type": "alert-box",
  "data": {
    "level": "warning",
    "title": "한도 초과 주의",
    "message": "2월 법인카드 사용금액이 월 한도의 85%에 도달했습니다.\n사용 현황을 점검해주세요."
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `level` | string | O | 심각도: `warning` / `error` / `info` / `success` |
| `title` | string | O | 알림 제목 |
| `message` | string | O | 알림 메시지 (`\n` 줄바꿈) |

**심각도별 스타일:**
| level | 배경색 | 테두리색 | 제목색 |
|-------|--------|---------|--------|
| `warning` | #fefce8 | #fef08a | #92400e |
| `error` | #fef2f2 | #fecaca | #991b1b |
| `info` | #ecfeff | #a5f3fc | #155e75 |
| `success` | #f0fdf4 | #bbf7d0 | #065f46 |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 컨테이너 padding | 14px 20px |
| 컨테이너 border-radius | 4px |
| display | flex, gap: 12px |
| 아이콘 크기 | 20px x 20px (원형, border-radius: 50%) |
| 제목 font-size | **16px**, font-weight: 700 |
| 메시지 font-size | 14px, line-height: 1.7 |
| 메시지 opacity | 0.85 |
| 메시지 최대 길이(권장) | **200자 이내** |
| white-space | pre-line |

---

### 3.9 `callout` - 콜아웃/팁

**용도:** 보충 설명, 주의사항, 팁 등을 좌측 보더 강조로 표시.

**JSON 스키마:**
```json
{
  "type": "callout",
  "data": {
    "type": "important",
    "title": "유의사항",
    "text": "예측 수치는 과거 3년간 데이터 기반이며, 실제 자금 흐름과 차이가 있을 수 있습니다."
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | string | O | 변형: `tip` / `note` / `important` / `danger` |
| `title` | string | - | 콜아웃 제목 |
| `text` | string | O | 콜아웃 본문 |

**변형별 스타일:**
| type | 배경색 | 좌측 보더 | 아이콘 |
|------|--------|----------|--------|
| `tip` | #f0fdf4 | green | 💡 |
| `note` | #f9fafb | gray | 📝 |
| `important` | #fefce8 | yellow | ⚠️ |
| `danger` | #fef2f2 | red | 🚨 |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 컨테이너 padding | 14px 20px |
| 컨테이너 border-radius | 4px |
| 좌측 보더 너비 | **3px** solid |
| display | flex, gap: 12px |
| 아이콘 font-size | 16px, font-weight: 700 |
| 제목 font-size | **16px**, font-weight: 700 |
| 본문 font-size | 14px, line-height: 1.7 |
| 본문 color | `var(--gray-700)` |
| white-space | pre-line |
| 본문 최대 길이(권장) | **300자 이내** |

---

### 3.10 `pattern-analysis` - 패턴 분석

**용도:** 감지된 패턴을 심각도별로 컬러 바로 표시.

**JSON 스키마:**
```json
{
  "type": "pattern-analysis",
  "data": {
    "items": [
      {
        "level": "critical",
        "title": "야간 대량 거래 패턴",
        "description": "22시~06시 사이 5건 이상 대량 이체가 감지되었습니다.\n총 금액: 1억 2,300만원"
      },
      {
        "level": "warning",
        "title": "신규 거래처 집중 패턴",
        "description": "최근 등록된 거래처에 3일 연속 이체가 발생했습니다."
      },
      {
        "level": "normal",
        "title": "정기 급여이체",
        "description": "매월 25일 정기 급여이체로 정상 패턴입니다."
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | array | O | 패턴 항목 배열 |
| `items[].level` | string | - | 심각도: `critical` / `warning` / `normal` |
| `items[].title` | string | O | 패턴 제목 |
| `items[].description` | string | O | 패턴 설명 |

**심각도별 스타일:**
| level | 배경색 | 좌측 보더 | 텍스트색 |
|-------|--------|----------|---------|
| `critical` | #fef2f2 | red | #7f1d1d |
| `warning` | #fefce8 | yellow | #78350f |
| `normal` | #f0fdf4 | green | #064e3b |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 컨테이너 gap | 8px (항목 간) |
| 항목 padding | 14px 18px |
| 항목 border-left | **3px** solid |
| 항목 border-radius | 4px |
| 항목 font-size | 14px, line-height: 1.7 |
| 제목 font-size | **16px**, font-weight: 700 |
| 항목 수(권장) | **2~4개** |
| white-space | pre-line |

---

### 3.11 `steps` - 단계별 안내

**용도:** 업무 절차를 번호 매긴 단계별로 안내.

**JSON 스키마:**
```json
{
  "type": "steps",
  "data": {
    "items": [
      {
        "title": "기초정보 메뉴 진입",
        "desc": "[기초정보] > [계좌정보관리] 메뉴를 클릭합니다."
      },
      {
        "title": "계좌 등록 버튼 클릭",
        "desc": "상단의 '신규 등록' 버튼을 클릭하여 등록 양식을 엽니다."
      },
      {
        "title": "필수 정보 입력",
        "desc": "은행명, 계좌번호, 예금주명 등 필수 항목을 입력합니다."
      }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | array | O | 단계 배열 |
| `items[].title` | string | O | 단계 제목 |
| `items[].desc` | string | O | 단계 설명 |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 단계 간 gap | 16px (좌우), padding-bottom: 20px (세로) |
| 번호 원형 크기 | **24px x 24px** |
| 번호 배경 | `var(--gray-800)`, color: #fff |
| 번호 font-size | 13px, font-weight: 700 |
| 세로 연결선 | 2px wide, `var(--gray-200)`, left: 13px |
| 제목 font-size | **18px**, font-weight: 700 |
| 설명 font-size | 15px, color: `var(--gray-600)` |
| 설명 line-height | 1.6 |
| 단계 수(권장) | **3~5개** (5개 초과 시 가독성 저하) |
| white-space | pre-line |

---

### 3.12 `key-value` - 키-값 목록

**용도:** 항목-값 쌍을 깔끔한 목록으로 표시.

**JSON 스키마:**
```json
{
  "type": "key-value",
  "data": {
    "items": [
      { "key": "보고서명", "value": "2월 자금현황 보고서" },
      { "key": "작성일", "value": "2026-03-15" },
      { "key": "작성자", "value": "재무팀 김담당" },
      { "key": "승인상태", "value": "승인완료" }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | array | O | 키-값 쌍 배열 |
| `items[].key` | string | O | 항목명 (좌측, 140px 고정) |
| `items[].value` | string | O | 항목 값 (우측) |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 키 너비 | **140px** (고정, flex-shrink: 0) |
| 값 너비 | flex: 1 (나머지 공간) |
| 행 padding | 12px 0 |
| 행 구분선 | 1px solid `var(--gray-100)` |
| font-size | 15px |
| 키 color | `var(--gray-500)`, font-weight: 500 |
| 값 color | `var(--gray-800)`, font-weight: 500 |
| 항목 수(권장) | **3~8개** |

---

### 3.13 `approval-box` - 결재선

**용도:** 보고서의 결재/서명란 시각화.

**JSON 스키마:**
```json
{
  "type": "approval-box",
  "data": {
    "lines": [
      { "role": "담당", "name": "김재무" },
      { "role": "팀장", "name": "이부장" },
      { "role": "본부장" }
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `lines` | array | O | 결재선 배열 |
| `lines[].role` | string | O | 직책/역할 |
| `lines[].name` | string | - | 결재자명 (미입력 시 빈칸) |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 결재선 수(권장) | **2~4개** |
| display | flex (가로 나열) |
| 각 칸 border | 1px solid `var(--gray-200)` |
| 역할 font-size | 13px |
| 이름 font-size | 15px, font-weight: 600 |

---

### 3.14 `source-box` - 출처 정보

**용도:** 응답의 데이터 출처, 참조 문서, 다운로드 링크 표시.

**JSON 스키마:**
```json
{
  "type": "source-box",
  "data": {
    "text": "출처: 통합CMS 계좌관리 매뉴얼 v3.2 (2026.01 개정)",
    "links": ["통합CMS_사용자매뉴얼_2024.pdf", "계좌등록_퀵가이드.pdf"],
    "downloadable": true
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `text` | string | O | 출처 설명 텍스트 |
| `links` | string[] | - | 참조 문서/링크 목록 |
| `downloadable` | boolean | - | 다운로드 가능 여부 (true 시 다운로드 아이콘 표시) |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| font-size | 13px |
| color | `var(--gray-500)` |
| 링크 수(권장) | **1~3개** |
| 링크 color | `var(--accent)`, text-decoration: underline |
| 다운로드 아이콘 | 📥 (downloadable=true 시) |

---

### 3.15 `related-questions` - 관련 질문

**용도:** 후속 질문 추천. 클릭 시 해당 질문으로 자동 재질의.

**JSON 스키마:**
```json
{
  "type": "related-questions",
  "data": {
    "items": [
      "계좌 조회는 어떻게 하나요?",
      "이체 등록 방법을 알려줘",
      "인증서 등록은 어떻게 하나요?"
    ]
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | string[] | O | 질문 문자열 배열 |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 질문 수(권장) | **3개** (최대 5개) |
| display | flex, flex-wrap: wrap, gap: 8px |
| 버튼 padding | 8px 14px |
| 버튼 border | 1px solid `var(--gray-200)` |
| 버튼 border-radius | **20px** (pill 형태) |
| 버튼 font-size | 14px |
| 버튼 color | `var(--gray-700)` |
| hover | border→`var(--accent)`, bg→`var(--accent-bg)` |
| 클릭 동작 | 입력창에 자동 입력 후 전송 |

---

### 3.16 `date-range` - 조회기간 설정

**용도:** AI가 질의에서 해석한 조회 기간을 표시하고, 사용자가 기간을 변경하여 재조회할 수 있는 인터랙티브 블록.

**JSON 스키마:**
```json
{
  "type": "date-range",
  "data": {
    "description": "현재 조회기간은 2025-10-27 ~ 2025-11-17 입니다.",
    "note": "AI가 입력 속 기간 표현을 해석한 결과입니다. 원하시다면 시작일/종료일을 직접 수정하여 조회할 수 있습니다.",
    "startDate": "2025-10-27",
    "endDate": "2025-11-17",
    "editable": true,
    "reQueryLabel": "이 기간으로 다시 조회"
  }
}
```

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `description` | string | O | 현재 조회기간 안내 문구 |
| `note` | string | - | AI 기간 해석 설명 (보조 텍스트) |
| `startDate` | string | O | 시작일 (YYYY-MM-DD) |
| `endDate` | string | O | 종료일 (YYYY-MM-DD) |
| `editable` | boolean | - | 사용자 수정 가능 여부 (기본: true) |
| `reQueryLabel` | string | - | 재조회 버튼 텍스트 (기본: "이 기간으로 다시 조회") |

**세부 규격:**
| 항목 | 값 |
|------|-----|
| 컨테이너 배경 | `var(--gray-50)` |
| 컨테이너 border | 1px solid `var(--gray-200)` |
| 컨테이너 border-radius | 8px |
| 컨테이너 padding | 20px |
| 설명 font-size | **14px**, font-weight: 600, color: `var(--gray-800)` |
| 보조 텍스트 font-size | 13px, color: `var(--gray-500)` |
| 날짜 입력 필드 | border: 1px solid `var(--gray-200)`, border-radius: 8px, padding: 10px 14px |
| 날짜 입력 font-size | 14px |
| 날짜 구분자 | "~" (가운데 표시) |
| 재조회 버튼 배경 | `var(--accent)` #2563EB |
| 재조회 버튼 color | #fff |
| 재조회 버튼 padding | 10px 24px |
| 재조회 버튼 border-radius | 8px |
| 재조회 버튼 font-size | 14px, font-weight: 600 |
| 하단 안내 | "선택된 기간으로 다시 조회합니다." (13px, gray-400) |

**시각적 레이아웃:**
```
┌──────────────────────────────────────────────────────────┐
│  조회 기간 설정                              [조회 기간 변경 ▼] │
│                                                          │
│  현재 조회기간은 2025-10-27 ~ 2025-11-17 입니다.            │
│  AI가 입력 속 기간 표현을 해석한 결과입니다...                │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                    │
│  │ 2025-10-27   │ ~  │ 2025-11-17   │                    │
│  └──────────────┘    └──────────────┘                    │
│  선택된 기간으로 다시 조회합니다.                             │
│                                                          │
│         [ 이 기간으로 다시 조회 ]                           │
└──────────────────────────────────────────────────────────┘
```

**표시 위치:** 데이터가 포함된 응답(P1 일반, P2 분석, P3 예측, P4 이상거래, P6 보고서)에서 **source-box 바로 위** 또는 **data-table 바로 아래**에 위치.

---

## 4. 공통 푸터 사양

### 4.1 개요
모든 AI 응답 하단에 자동으로 표시되는 고정 액션 영역이다. `blocks` JSON과 별개로, `scene` 값에 따라 버튼 조합이 결정된다.

### 4.2 푸터 버튼 목록

| 버튼 | 아이콘 | variant | 설명 |
|------|--------|---------|------|
| 보고서 저장 | 💾 | default | 보고서를 시스템에 저장 |
| PDF 다운로드 | 📄 | default | 응답 내용을 PDF로 내보내기 |
| 엑셀 다운로드 | 📊 | default | 테이블 데이터를 엑셀(.xlsx)로 내보내기 |
| 공유 | 📤 | default (드롭다운) | 이메일/카카오톡/링크복사 |
| 답변 신고 | ⚠ | danger | 부정확/부적절 답변 피드백 |
| 매뉴얼 다운 | 📥 | default | 관련 매뉴얼 파일 다운로드 |

### 4.3 씬별 푸터 버튼 분기

| 버튼 | P1 일반 | P2 분석 | P3 예측 | P4 이상거래 | P5 상담 | P6 보고서 |
|------|:-------:|:-------:|:-------:|:----------:|:-------:|:--------:|
| 보고서 저장 | - | - | - | - | - | **O** |
| PDF 다운 | **O** | **O** | **O** | **O** | - | **O** |
| 엑셀 다운 | **O** | **O** | **O** | **O** | - | **O** |
| 공유 | **O** | **O** | **O** | **O** | **O** | **O** |
| 답변 신고 | **O** | **O** | **O** | **O** | **O** | **O** |
| 매뉴얼 다운 | - | - | - | - | **O** | - |

### 4.4 공유 서브메뉴

공유 버튼 클릭 시 상단 방향 팝오버(drop-up)로 표시:

| 옵션 | 아이콘 | 동작 |
|------|--------|------|
| 이메일로 보내기 | ✉️ | 이메일 모달 (수신자 입력 → 발송) |
| 카카오톡 공유 | 💬 | 카카오톡 미리보기 모달 (폰 프레임 UI) |
| 링크 복사 | 🔗 | 클립보드 복사 + "링크가 복사되었습니다" 토스트 |

---

## 5. 프로그레스 필 (Thinking Indicator)

### 5.1 개요
AI 응답 생성 전에 표시되는 진행 상태 표시. 블록이 렌더링되기 전에 사라진다.

### 5.2 동작 규칙
1. 사용자 메시지 전송 후 즉시 표시
2. `pills` 배열의 각 항목을 300~500ms 간격으로 순차 표시
3. 각 필에 펄스 애니메이션(●) 적용
4. 모든 필 표시 후 체크마크(✓)로 변경 → "완료" 상태
5. 1초 후 프로그레스 카드 제거 → AI 응답 블록 렌더링 시작

### 5.3 씬별 프로그레스 필 예시

| 씬 | 필 메시지 |
|----|----------|
| general | `📊 사용 내역 조회 중` → `📋 데이터 정리 중` |
| analysis | `📊 카드 사용 데이터 수집 중` → `🔍 사용 패턴 분석 중` → `📋 리포트 생성 중` |
| forecast | `📊 과거 데이터 분석 중` → `🔮 예측 모델 실행 중` → `📋 보고서 구성 중` |
| anomaly | `📊 일별 통계 조회 중` → `🔍 이상거래 패턴 분석 중` → `📋 카테고리별 분류 중` |
| consult | `📂 관련 매뉴얼 검색 중` → `📖 절차 정리 중` |
| report | `📊 자금 데이터 수집 중` → `📋 보고서 구성 중` → `✅ 검증 중` |

---

## 6. 블록 조합 매트릭스

### 6.1 전체 매트릭스

| 블록 | P1 일반 | P2 분석 | P3 예측 | P4 이상거래 | P5 상담 | P6 보고서 |
|------|:-------:|:-------:|:-------:|:----------:|:-------:|:--------:|
| text-content | **필수** | **필수** | - | - | **필수** | **필수** |
| report-header | - | **필수** | **필수** | - | - | **필수** |
| number-stat | - | **필수** | - | - | - | **필수** |
| summary-cards | - | 선택 | 선택 | - | - | 선택 |
| data-table | **필수** | **필수** | **필수** | **필수** | - | **필수** |
| bar-chart | - | **필수** | **필수** | - | - | **필수** |
| line-chart | - | 선택 | 선택 | - | - | 선택 |
| alert-box | - | **필수** | - | - | - | **필수** |
| callout | - | - | **필수** | - | - | - |
| pattern-analysis | - | **필수** | - | - | - | - |
| steps | - | 선택 | - | - | **필수** | - |
| key-value | - | 선택 | 선택 | - | 선택 | 선택 |
| approval-box | - | 선택 | 선택 | - | - | 선택 |
| date-range | 선택 | **필수** | 선택 | 선택 | - | **필수** |
| source-box | - | **필수** | - | - | **필수** | **필수** |
| related-questions | **필수** | **필수** | **필수** | **필수** | **필수** | **필수** |
| 공통 푸터 | **항상** | **항상** | **항상** | **항상** | **항상** | **항상** |

### 6.2 블록 렌더링 순서 규칙
블록은 `blocks` 배열의 순서대로 렌더링된다. 권장 순서:

```
1. report-header (있는 경우)
2. text-content
3. number-stat / summary-cards
4. pattern-analysis
5. data-table
6. alert-box / callout
7. bar-chart / line-chart
8. steps
9. key-value
10. approval-box
11. source-box
12. related-questions
13. [공통 푸터 - 자동]
```

---

## 7. 디자인 토큰

### 7.1 색상 시스템

**기본 색상:**
| 변수 | 값 | 용도 |
|------|-----|------|
| `--accent` | #2563EB | 메인 액센트 (버튼, 링크) |
| `--accent-light` | #3b82f6 | 밝은 액센트 |
| `--accent-bg` | #eff6ff | 액센트 배경 |
| `--accent-border` | #bfdbfe | 액센트 테두리 |

**상태 색상:**
| 상태 | 색상 | 배경 | 테두리 |
|------|------|------|--------|
| success | #16a34a | #f0fdf4 | #bbf7d0 |
| warning | #ca8a04 | #fefce8 | #fef08a |
| error | #dc2626 | #fef2f2 | #fecaca |
| info | #0891b2 | #ecfeff | #a5f3fc |

**그레이스케일:**
| 변수 | 값 | 용도 |
|------|-----|------|
| `--gray-50` | #f9fafb | 배경 |
| `--gray-100` | #f3f4f6 | 테이블 헤더 |
| `--gray-200` | #e5e7eb | 테두리 |
| `--gray-500` | #6b7280 | 보조 텍스트 |
| `--gray-700` | #374151 | 본문 텍스트 |
| `--gray-800` | #1f2937 | 제목 |

### 7.2 라운딩 / 그림자
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius` | 4px | 기본 라운딩 |
| `--radius-lg` | 6px | 카드 라운딩 |
| `--radius-xl` | 8px | 메시지 버블 |
| 사용자 버블 | 20px | 채팅 버블 |
| 액션 버튼 | 20px | 푸터 버튼 |

### 7.3 타이포그래피
| 용도 | 크기 | 굵기 |
|------|------|------|
| AI 본문 | 16px | 400 |
| 블록 제목 | 15~18px | 700 |
| 테이블 헤더 | 13px | 600 |
| 테이블 본문 | 14px | 400 |
| 숫자 통계 값 | 28px | 700 |
| 요약 카드 값 | 24px | 700 |
| 라벨/부가정보 | 13px | 500 |

---

## 8. 전체 레이아웃 규격

### 8.1 챗 영역 컨테이너

| 항목 | 값 |
|------|-----|
| 메시지 최대 너비 | **720px** |
| 채팅 영역 padding | 24px 28px |
| 메시지 간 gap | 18px |
| 블록 간 gap | **14px** |

### 8.2 메시지 버블

| 항목 | 사용자 버블 | AI 버블 |
|------|-----------|---------|
| 배경 | `var(--accent)` #2563EB | #fff |
| 텍스트 색상 | #fff | `var(--gray-700)` |
| padding | 12px 24px | **28px 32px** |
| border-radius | 20px | 8px (`var(--radius-xl)`) |
| border | 없음 | 1px solid `var(--gray-200)` |
| 너비 | auto (inline-block) | 100% |
| font-size | 16px | 16px |
| line-height | 1.6 | 1.7 |
| 정렬 | 우측 | 좌측 |

### 8.3 입력 바

| 항목 | 값 |
|------|-----|
| 최대 너비 | 720px |
| 높이 | 44px |
| border-radius | 24px |
| border | 1px solid `var(--gray-200)` |
| focus | border→`var(--accent)` |
| 전송 버튼 크기 | 44px x 44px |
| 전송 아이콘 크기 | 22px x 22px |
| 업무 선택(select) 너비 | min 110px |

### 8.4 모바일 리포트 뷰

| 항목 | 값 |
|------|-----|
| 폰 프레임 너비 | **440px** |
| 폰 프레임 max-height | 90vh |
| 폰 프레임 border-radius | 24px |
| 헤더 높이 | 56px |
| 본문 padding | 20px |
| 본문 gap | 14px |
| 본문 배경 | `var(--gray-50)` |

**모바일 반응형 오버라이드:**
| 블록 | 데스크톱 | 모바일 리포트 |
|------|---------|-------------|
| summary-cards 그리드 | auto-fit(min 150px) | **1fr 1fr** (2열) |
| number-stat 그리드 | auto-fit(min 110px) | **1fr 1fr** (2열) |
| 차트 canvas 높이 | 260px | **200px** |
| 차트 wrapper 너비 | 85% | **100%** |
| 테이블 font-size | 14px | **13px** |

### 8.5 블록 공통 규격

| 항목 | 값 |
|------|-----|
| 블록 간 gap | **14px** |
| 블록 애니메이션 | fadeIn 0.4s ease (translateY: 6px→0) |
| 블록 margin-bottom | 0 (gap으로 관리) |

### 8.6 공통 푸터 규격

| 항목 | 값 |
|------|-----|
| margin-top | 18px |
| padding-top | 14px |
| border-top | 1px solid `var(--gray-100)` |
| display | flex, gap: 10px, justify-content: flex-end |
| 버튼 padding | 10px 18px |
| 버튼 border | 1px solid `var(--gray-200)` |
| 버튼 border-radius | **20px** (pill) |
| 버튼 font-size | 14px, font-weight: 500 |
| danger 버튼 | color: `var(--error)`, border: `var(--error-border)` |
| 공유 드롭다운 위치 | 상단 방향 (bottom: calc(100% + 6px)) |
| 드롭다운 min-width | 160px |
| 드롭다운 항목 padding | 12px 16px |

---

## 9. 수량/크기 요약표 (Quick Reference)

| 블록 | 항목 수 권장 | 주요 사이즈 |
|------|:-----------:|-----------|
| text-content | - | 500자 이내 |
| report-header | - | 제목 30자 이내 |
| number-stat | **2~4개** | 값 28px, 그리드 min 110px |
| summary-cards | **2~4개** | 값 24px, 그리드 min 150px |
| data-table | **5~7행, 4~6열** | 헤더 13px, 본문 14px |
| bar-chart | **4~8라벨, 1~3셋** | canvas 260px/200px |
| line-chart | **4~12포인트, 1~3셋** | canvas 260px/200px |
| alert-box | - | 메시지 200자 이내 |
| callout | - | 본문 300자 이내 |
| pattern-analysis | **2~4개** | 제목 16px, 본문 14px |
| steps | **3~5단계** | 원형 24px, 제목 18px |
| key-value | **3~8개** | 키 140px 고정 |
| approval-box | **2~4명** | 가로 나열 |
| source-box | **1~3 링크** | 13px |
| date-range | - | 날짜입력 14px, 버튼 accent |
| related-questions | **3개** (최대 5) | 버튼 14px, radius 20px |

---

## 부록: 전체 블록 JSON 스키마 요약

```
text-content    : { text }
report-header   : { icon, title, subtitle, subtitleIcon? }
number-stat     : { items: [{ value, label, color?, diff?, diffDir? }] }
summary-cards   : { cards: [{ label, value, sub? }] }
data-table      : { caption?, captionBadge?, columns: [{ key, label, align?, type? }], rows: [{}] }
bar-chart       : { title?, labels[], datasets: [{ label, data[], backgroundColor }] }
line-chart      : { title?, labels[], datasets: [{ label, data[], backgroundColor }] }
alert-box       : { level, title, message }
callout         : { type, title?, text }
pattern-analysis: { items: [{ level?, title, description }] }
steps           : { items: [{ title, desc }] }
key-value       : { items: [{ key, value }] }
approval-box    : { lines: [{ role, name? }] }
source-box      : { text, links[]?, downloadable? }
date-range       : { description, note?, startDate, endDate, editable?, reQueryLabel? }
related-questions: { items: [string] }
```
