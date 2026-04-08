---
name: report-json-generator
description: "리포트 블록 에디터용 JSON 데이터를 생성하는 스킬. 사용자가 질문과 데이터(CSV, XLSX, 테이블 등)를 제공하면 report_block_editor_v2.html에서 바로 로드할 수 있는 구조화된 리포트 JSON을 생성한다. '리포트 만들어줘', '보고서 JSON', '블록 에디터용 데이터', '리포트 블록', '분석 리포트 생성', '예적금 현황 분석', '이상거래 분석' 등 리포트나 보고서 JSON 생성과 관련된 요청에 사용한다. 데이터를 분석해서 시각적 리포트로 만들고 싶다는 의도가 보이면 이 스킬을 적용한다."
---

# 리포트 블록 에디터 JSON 생성기

사용자가 질문과 데이터를 제공하면, `report_block_editor_v2.html`에서 로드할 수 있는 리포트 JSON을 생성한다.

## 에디터 기능 안내 (사용자 지원 시 참고)

### 데이터 입력
- **직접 붙여넣기**: CSV, TSV, JSON, 일반 텍스트 지원
- **파일 업로드**: CSV, TSV, JSON, TXT, **XLSX(엑셀)** 파일 드래그 앤 드롭 또는 클릭 업로드 지원
  - XLSX 파일은 SheetJS(xlsx.js) 라이브러리로 브라우저에서 직접 파싱됨
  - 첫 번째 시트를 자동 로드하며, 시트 정보(개수, 이름) 표시

### 샘플 미리보기
- AI 자동 구성 모달에서 템플릿을 선택하면 **메인 미리보기에 샘플 데이터가 자동 표시**됨
- 모달을 닫아도 **샘플 미리보기가 유지**되며, 상단에 "샘플 미리보기입니다" 배너 표시
- "원래 상태로 복원" 버튼으로 이전 상태로 되돌릴 수 있음
- "에디터에 적용" 버튼으로 샘플/AI 생성 결과를 확정

### JSON 복사
- JSON 탭에서 현재 편집 중인 리포트의 전체 JSON을 **복사** 또는 **다운로드** 가능
- 미리보기에서 블록을 편집한 후 JSON 탭으로 전환하면 편집 내용이 반영된 JSON 확인 가능

## 실행 흐름

1. 사용자의 질문과 데이터를 분석한다
2. 아래 블록 타입 레퍼런스를 참고하여 리포트 JSON을 생성한다
3. 생성한 JSON을 `report_output.json` 파일로 저장한다 (경로: 작업 디렉토리)
4. 사용자에게 JSON 파일 경로를 안내하고, 에디터의 "가져오기" 또는 "AI 응답 붙여넣기" 탭으로 로드하도록 안내한다

## 출력 JSON 구조

```json
{
  "id": "report_[timestamp]",
  "title": "리포트 제목",
  "query": "사용자가 던진 질문",
  "answer": "질문에 대한 요약 답변 1~2문장",
  "createdAt": "2026-03-20T10:00:00.000Z",
  "blocks": [
    { "id": "blk_1", "type": "블록타입", "data": { ... } }
  ]
}
```

## 작업 순서

1. 사용자의 질문과 데이터를 파악한다
2. 데이터 특성에 맞는 블록 구성을 결정한다 (아래 템플릿 참고)
3. 실제 데이터 수치를 반영하여 각 블록의 data를 채운다
4. 완성된 JSON을 ```json 코드 블록으로 출력한다

## 블록 타입 레퍼런스

사용 가능한 블록 타입과 data 구조는 아래와 같다. 리포트 목적에 맞게 조합하여 사용한다.

### 레이아웃

**heading** — 섹션 제목
```json
{ "text": "섹션 제목", "level": 2 }
```

**text-section** — 본문 텍스트
```json
{ "text": "분석 내용 텍스트" }
```

**divider** — 구분선
```json
{}
```

**callout** — 콜아웃 박스 (type: note/tip/warning/danger)
```json
{ "type": "tip", "title": "참고", "text": "내용" }
```

**blockquote** — 인용문
```json
{ "text": "인용문 내용", "author": "출처" }
```

**code-block** — 코드 블록
```json
{ "lang": "sql", "code": "SELECT * FROM ..." }
```

### 데이터

**summary-cards** — 핵심 KPI 요약 카드 (3~4개 권장)
```json
{
  "cards": [
    { "label": "총 건수", "value": "1,234건", "sub": "전월 대비 +12%" }
  ]
}
```

**number-stat** — 숫자 통계
```json
{
  "items": [
    { "value": "5.6억", "label": "총 금액", "color": "#2563eb", "diff": "+8.3%", "diffDir": "up" }
  ]
}
```

**data-table** — 데이터 테이블
```json
{
  "caption": "테이블 제목",
  "columns": [
    { "key": "name", "label": "이름", "align": "left", "type": "text", "width": "auto" },
    { "key": "status", "label": "상태", "align": "center", "type": "badge", "width": "auto" }
  ],
  "rows": [
    { "name": "항목1", "status": { "text": "정상", "color": "green" } }
  ]
}
```
- type이 "badge"인 컬럼의 값은 `{"text":"텍스트","color":"red|green|orange|blue|gray"}` 형식
- type이 "text"인 컬럼의 값은 문자열
- 선택사항: `"filter"`, `"groupBy"`, `"aggregate"` 필드로 데이터 처리 힌트 표시 가능
  - filter: `"사업장 == 'A사업장' AND 잔액 >= 5000000"`
  - groupBy: `"은행, 계좌분류"`
  - aggregate: `"SUM:계좌잔액, AVG:이자율"`

**key-value** — 키-값 쌍
```json
{ "items": [{ "key": "담당자", "value": "홍길동" }] }
```

**progress-bar** — 진행률 바
```json
{
  "items": [
    { "label": "달성률", "value": 75, "max": 100, "color": "#2563eb" }
  ]
}
```

### 차트

**bar-chart** — 막대 차트
```json
{
  "title": "월별 매출",
  "labels": ["1월", "2월", "3월"],
  "datasets": [
    { "label": "매출", "data": [100, 200, 150], "backgroundColor": "#2563eb" }
  ]
}
```

**line-chart** — 선 차트
```json
{
  "title": "추세",
  "labels": ["1월", "2월", "3월"],
  "datasets": [
    { "label": "금액", "data": [100, 150, 120], "borderColor": "#2563eb", "backgroundColor": "rgba(37,99,235,0.1)", "fill": true }
  ]
}
```

**pie-chart** — 파이/도넛 차트
```json
{
  "title": "구성비",
  "labels": ["A", "B", "C"],
  "data": [40, 35, 25],
  "colors": ["#2563eb", "#7c3aed", "#059669"],
  "doughnut": false
}
```

**radar-chart** — 레이더 차트
```json
{
  "title": "역량 비교",
  "labels": ["영업", "마케팅", "개발"],
  "datasets": [
    { "label": "현재", "data": [80, 65, 90], "borderColor": "#2563eb", "backgroundColor": "rgba(37,99,235,0.15)" }
  ]
}
```

**scatter-chart** — 산점도
```json
{
  "title": "분포",
  "datasets": [
    { "label": "데이터", "data": [{"x":10,"y":20}, {"x":25,"y":35}], "backgroundColor": "#2563eb" }
  ]
}
```

### 분석

**alert-box** — 경고/안내 박스 (level: info/warning/error/success)
```json
{ "level": "warning", "title": "주의사항", "text": "내용" }
```

**pattern-analysis** — 패턴 분석
```json
{
  "items": [
    { "level": "critical", "title": "고위험", "description": "설명" },
    { "level": "warning", "title": "주의", "description": "설명" },
    { "level": "normal", "title": "정상", "description": "설명" }
  ]
}
```

**compare-cards** — 비교 카드
```json
{
  "items": [
    {
      "title": "옵션 A",
      "values": [{ "label": "비용", "value": "500만원" }]
    }
  ]
}
```

**pros-cons** — 장단점
```json
{ "pros": ["장점 1", "장점 2"], "cons": ["단점 1"] }
```

**swot** — SWOT 분석
```json
{ "s": ["강점"], "w": ["약점"], "o": ["기회"], "t": ["위협"] }
```

### 인터랙티브

**timeline** — 타임라인
```json
{ "items": [{ "date": "2026-01", "title": "이벤트", "desc": "설명" }] }
```

**steps** — 단계
```json
{ "items": [{ "title": "1단계", "desc": "설명" }] }
```

**checklist** — 체크리스트
```json
{ "items": [{ "text": "항목", "checked": true }] }
```

### 인사이트

**insight-card** — AI 인사이트 카드
```json
{
  "color": "purple",
  "icon": "💡",
  "title": "AI 인사이트",
  "items": ["인사이트 내용 1", "인사이트 내용 2"]
}
```

**gauge** — 게이지
```json
{ "items": [{ "label": "달성률", "value": 75, "color": "#2563eb", "max": 100 }] }
```

**metric-card** — 메트릭 카드
```json
{ "icon": "📊", "iconBg": "#eff6ff", "label": "메트릭", "value": "1,234", "change": "+12.5%", "changeDir": "up" }
```

**funnel** — 퍼널
```json
{
  "items": [
    { "label": "방문", "value": 1000, "color": "#2563eb" },
    { "label": "가입", "value": 500, "color": "#7c3aed" }
  ]
}
```

**heatmap** — 히트맵
```json
{
  "rows": ["1월", "2월"],
  "cols": ["주유", "식사"],
  "data": [[80, 50], [30, 90]],
  "minColor": "#dcfce7",
  "maxColor": "#dc2626"
}
```

### 보고서

**approval-box** — 결재방 (결재라인 표시)
```json
{
  "layout": "row",
  "lines": [
    { "title": "담당", "name": "김팀장", "status": "approved" },
    { "title": "검토", "name": "권부장", "status": "pending" },
    { "title": "승인", "name": "홍대표", "status": "pending" }
  ]
}
```
- layout: "row"(가로) / "column"(세로)
- status: "approved"(승인) / "rejected"(반려) / "pending"(대기)

**report-header** — 보고서 헤더 (제목 + 메타 정보)
```json
{
  "title": "금융자산현황 보고서",
  "subtitle": "2026년 3월 기준",
  "date": "2026-03-20",
  "department": "경영지원실",
  "bgColor": "#0F172A",
  "accentColor": "#6366F1"
}
```

**design-guide** — 디자인 가이드 (색상 팔레트·폰트·스타일)
```json
{
  "palette": [
    { "name": "주색", "color": "#0F172A", "ratio": "60-70%" },
    { "name": "보조색", "color": "#6366F1", "ratio": "20-30%" },
    { "name": "액센트", "color": "#38BDF8", "ratio": "10%" }
  ],
  "headerFont": "Trebuchet MS",
  "bodyFont": "Calibri",
  "style": "professional",
  "notes": "테이블 구조: 다크-라이트 샌드위치 패턴"
}
```

### 참조/액션

**source-info** — 데이터 출처
```json
{ "source": "내부 DB", "timestamp": "2026-03-20 10:00", "note": "비고" }
```

**date-range** — 조회 기간
```json
{ "label": "조회 기간", "start": "2026-01-01", "end": "2026-03-20" }
```

**related-questions** — 후속 질문
```json
{ "questions": ["후속 질문 1?", "후속 질문 2?", "후속 질문 3?"] }
```

**action-buttons** — 액션 버튼
```json
{
  "buttons": [
    { "label": "공유하기", "icon": "📤", "style": "default" },
    { "label": "다운로드", "icon": "📥", "style": "default" }
  ]
}
```

**rating** — 평점
```json
{ "score": 4.2, "max": 5, "label": "종합 평가" }
```

**before-after** — 비포/애프터
```json
{ "beforeLabel": "Before", "afterLabel": "After", "beforeText": "변경 전", "afterText": "변경 후" }
```

## 템플릿 프리셋

분석 목적에 따라 다음 블록 조합을 참고한다.

### 일반 현황 분석 (예적금, 잔액 등)
source-info → heading(H2) → summary-cards → bar-chart → heading(H3) → data-table → alert-box → callout → date-range → related-questions → action-buttons

### 이상거래/리스크 분석
source-info → heading(H2) → summary-cards → pattern-analysis → data-table → heading(H3) → line-chart → alert-box → steps → date-range → related-questions → action-buttons

### 일반 분석
source-info → heading(H2) → summary-cards → bar-chart → data-table → callout → related-questions

### 비교 분석
source-info → heading(H2) → summary-cards → compare-cards → bar-chart → data-table → pros-cons → callout → related-questions

### 타임라인 리포트
source-info → heading(H2) → summary-cards → timeline → line-chart → data-table → alert-box → related-questions

### 대시보드 요약
source-info → heading(H2) → number-stat → bar-chart → pie-chart → data-table → gauge → insight-card → related-questions

### 공식 보고서 (결재방 포함)
report-header → approval-box → heading(H2) → summary-cards → data-table(filter/groupBy/aggregate) → heading(H3) → data-table → bar-chart → design-guide → date-range → action-buttons

## 엔터프라이즈 UI 디자인 가이드라인 (필수 준수)

이 가이드라인은 JSON/React 출력 모두에 적용된다.
**목표: 실제 운영 중인 금융/ERP/사내 업무 시스템처럼 보이게 만든다. AI 데모 대시보드처럼 보이면 안 된다.**

### 레이아웃 원칙
- 화면의 중심은 **데이터 테이블**이다 (카드가 아님)
- 배치 순서: 조회조건 → 요약 → 결과 테이블 → 상세 분석
- 모든 영역을 카드로 감싸지 않는다. 필요한 영역만 약하게 구분한다
- 장식보다 정보 전달 우선. 좌우 여백은 과하지 않게, 업무 화면 밀도 유지
- 실제 사용자가 바로 조회/판단/다운로드할 수 있는 구조

### 카드 사용 규칙
- 카드 남용 금지. 숫자 요약 카드도 최소 개수만 사용
- border-radius: 4px~8px 수준 (과하지 않게)
- box-shadow 최소화 또는 거의 사용하지 않음

### 텍스트 규칙
- 제목은 **업무형 명사**로 작성 (보고서형 문장 금지)
- 좋은 예: `사용 내역`, `이상 거래`, `카드별 집계`, `확인 필요 항목`
- 나쁜 예: `주요 이상거래 패턴 분석`, `즉시 확인 필요 분석 결과`, `AI 인사이트`

### 색상 규칙
- 전체 화면 기본: 흰색 + 회색 계열
- 포인트 컬러 1개만 사용 (기본: #2563EB)
- 상태색은 필요한 경우만: 빨강(#DC2626)=위험만, 초록=최소, 파랑=기본 강조
- 무지개색 사용 금지. 같은 계열 밝기 차이로 표현
- 그라데이션 사용 금지
- 추천 팔레트: 메인 #2563EB / 보조 #CBD5E1 / 회색 #94A3B8 / 위험 #DC2626

### 차트 규칙
- 차트는 의미 있는 경우만 사용. 파이차트 남용 금지
- bar chart / line chart 중심
- 색상: 메인컬러 1개 + 회색 + 강조색 1개
- hover 효과 최소화

### 테이블 규칙
- 테이블이 화면 중심. zebra row 가능
- 숫자는 우측 정렬. 상태 badge는 최소 색상 사용
- header는 연한 회색 배경

### 절대 피할 것
- 과도한 rounded 카드, 모든 블록 동일 스타일
- 너무 많은 인사이트 박스, 의미 없는 추천 영역
- 관련 질문 칩 남발, 과한 gradient/shadow/color palette
- "디자인 잘한 AI 대시보드" 느낌

## 작성 가이드

- 각 블록의 id는 `"blk_1"`, `"blk_2"` 같은 고유값을 사용한다
- 숫자는 읽기 좋게 포맷팅한다 (600000000 → "6억원", 1234567 → "123.5만원")
- 원본 데이터가 제공되면 반드시 해당 데이터를 기반으로 구성하고 임의 데이터를 만들지 않는다
- badge 컬럼의 color는 red, green, orange, blue, gray 중 선택한다
- 차트 색상은 메인 `#2563eb` 중심으로, 보조 `#CBD5E1`, 위험 `#DC2626` 활용
- 한국어로 작성한다
- JSON 코드 블록만 출력한다 (앞뒤 설명 없이)
