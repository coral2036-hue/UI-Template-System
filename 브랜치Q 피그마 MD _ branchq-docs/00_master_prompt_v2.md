# BranchQ Master Prompt v2

## 프로젝트 목표
BranchQ는 금융 업무용 AI 질의응답, 보고서, 이상거래 탐지, 상담 지원 시스템이다.

## Design Philosophy [Context]
- 톤: 금융 전문가용 업무 도구 — 신뢰감, 깔끔, 데이터 중심
- 느낌: Slack + Bloomberg Terminal — 채팅 기반이지만 데이터가 풍부
- 밀도: 중간 (너무 여백 많지 않고, 너무 빽빽하지 않음)
- 색감: 차분한 네이비 기반, 강조는 블루, 위험은 빨강
- 그래픽: 일러스트/이미지 없음, 데이터와 텍스트 중심
- 참고 톤: 은행 내부 업무 시스템 (고객용 앱 아님)

## 절대 규칙
- state 먼저 정의
- block contract 먼저 정의
- layout contract 유지
- 기존 구조 임의 변경 금지
- visual보다 interaction 우선

---

## Common Standards [Core]

### 네이밍 표준
| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `DataTable`, `AlertBox` |
| Block 타입 | kebab-case | `data-table`, `alert-box` |
| Hook | camelCase, use- prefix | `useChatState` |
| State 키 | camelCase | `selectedCategory` |
| Figma 레이어 | 카테고리/이름 | `Block/DataTable`, `Modal/Share` |
| CSS 변수 | kebab-case, --brq- prefix | `--brq-color-primary` |
| 파일명 | 컴포넌트=PascalCase.tsx, 유틸=camelCase.ts | `DataTable.tsx`, `formatCurrency.ts` |

### 토큰 사용 표준
| 구분 | 규칙 |
|------|------|
| 색상 | hex 직접 사용 금지 → 반드시 토큰명 참조 (→ 01_design) |
| 간격 | → 01_design#spacing 참조 |
| radius | → 01_design#radius 참조 |

### 데이터 표현 표준
| 데이터 | 형식 | 예시 |
|--------|------|------|
| 금액 | 천단위 콤마 + 원 | `1,234,567원` |
| 날짜 | YYYY.MM.DD | `2026.04.10` |
| 시간 | HH:mm | `14:30` |
| 퍼센트 | 소수 1자리 + % | `12.5%` |
| 빈 데이터 | 대시 | `-` |

### 확장 표준 (새 요소 추가 절차)
1. 타입 정의 → 00_master_prompt에 interface/enum 추가
2. 디자인 스펙 → 03_design_spec에 레이아웃/상태 추가
3. 컴포넌트 → 02_react_prompt에 파일/폴더 등록
4. Figma → 04_figma_optimize에 레이어 네이밍 등록
5. QA → README 체크리스트 통과 확인

### 인터랙션 표준
| 상황 | 규칙 |
|------|------|
| 호버 피드백 | opacity 0.8 또는 background 변경 (→ 01_design) |
| 로딩 표시 | 300ms 이하=없음, 300ms~2s=spinner, 2s+=skeleton |
| 토스트 | 위치=우상단, 지속=3초(info/success) 5초(warning/error), auto dismiss |
| 에러 메시지 | 인라인=필드 하단 red, 전역=toast error |
| 키보드 | Tab 순서 보장, Enter=primary action, ESC=close/cancel |

### 기존 표준 구체화
- "block contract 유지" = Block 14종 + props 변경 금지, 확장만 허용
- "layout contract 유지" = Sidebar(70) + Header(56) + ChatArea(나머지) 비율 변경 금지
- "클릭 flow 5개" = ① 카테고리 선택 ② 메시지 전송 ③ ShareRow 버튼 ④ Modal 열기/닫기 ⑤ SubPanel 토글
- "최소 확장" = 기존 컴포넌트 재사용 우선, 새 파일 1개 이하

---

## AppState [Core]
```ts
type Category = 'general' | 'analysis' | 'forecast' | 'anomaly' | 'consult';
type Model = { id: string; name: string; provider: string };
type ModalType = 'model-select' | 'api-setting' | 'share' | 'kakao-preview' | 'email' | 'confirm' | 'mms' | 'kakao-alimtalk';

interface ToastState {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface AppState {
  selectedCategory: Category;
  selectedModel: Model;
  subPanelOpen: 'recent' | 'report' | 'settings' | null;
  modal: ModalType | null;
  messages: Message[];
  loading: boolean;
  toast: ToastState | null;
}
```

## Message Contract [Core]
```ts
interface UserMessage {
  role: 'user';
  text: string;
  attachments?: { name: string; type: string; url: string }[];
}

interface AIMessage {
  role: 'ai';
  text?: string;
  blocks: Block[];
  btnType: 'report' | 'report-save' | 'anomaly' | 'consult';
}

type Message = UserMessage | AIMessage;
```

## Modal Contract [Core]
| ID | 타입 | 설명 |
|----|------|------|
| M1 | model-select | AI 모델 선택 |
| M2 | api-setting | API 키 설정 |
| M3 | share | 공유 옵션 (6개: 링크복사/카카오톡/MMS/이메일/다운로드) |
| M4 | kakao-preview | 카카오톡 미리보기 (legacy, M8으로 대체 예정) |
| M5 | email | 이메일 전송 (Q&A 전체 렌더링 + PDF/Excel 자동 첨부) |
| M6 | confirm | 확인/삭제 등 범용 확인 |
| M7 | mms | MMS 발송 (Q&A 캡처 이미지 첨부 + 폰 목업 미리보기) |
| M8 | kakao-alimtalk | 카카오 알림톡 전송 (단일 고정 템플릿) |

## ShareRow 통일 규칙 [Core]
h=36, min-w=90, radius=20, right-align
| btnType | 색상 | 버튼 |
|---------|------|------|
| anomaly | error(red) | 신고하기 |
| report-save | accent(blue) | 저장 |
| report | gray | PDF, 공유 |
| consult | accent(blue) | 다운로드 |

---

## Block 14종 — 시각 구조 + Props [Visual]

### report-header
```
┌─────────────────────────────────────┐
│ [카테고리 badge]                     │  badge: accent bg, white text, radius=4
│ [제목] 20px Bold                    │  Noto Sans KR
│ [부제] 14px gray-500                │
│ [생성일시] 12px gray-400            │
└─────────────────────────────────────┘
bg=white, border=gray-200, radius=8, pad=20
```
props: `category(string), title(string), subtitle?(string), date(string)`

### number-stat
```
┌──────────────┐
│ [라벨] 12 gray│  Noto Sans KR
│ [값] 28 Bold  │  Inter
│ [▲2.5%] 12   │  green=up, red=down
└──────────────┘
w=173, h=90, bg=white, border=gray-200, radius=6, pad=16
4개 가로 배치, gap=12
```
props: `label(string), value(string|number), diff?(string), trend?('up'|'down')`

### summary-cards
```
┌────────┐ ┌────────┐ ┌────────┐
│ [제목]  │ │ [제목]  │ │ [제목]  │
│ [설명]  │ │ [설명]  │ │ [설명]  │
│ [값]    │ │ [값]    │ │ [값]    │
└────────┘ └────────┘ └────────┘
각 카드: bg=white, border=gray-200, radius=6, pad=16
가로 배치, gap=12, flex-1
```
props: `cards({ title: string, description?: string, value: string }[])`

### data-table
```
┌─────────────────────────────────────┐
│ [제목]                      [더보기] │  h=48, pad=16
├──────┬────────┬────────┬───────────┤
│ 이름  │  금액   │  날짜   │   상태    │  h=40, bg=gray-50, 12px bold
├──────┼────────┼────────┼───────────┤
│ 홍길동 │1,234원 │ 04.10  │ ●정상     │  h=44, border-b=gray-100
│ 김철수 │5,678원 │ 04.09  │ ●주의     │
└──────┴────────┴────────┴───────────┘
bg=white, radius=8, border=gray-200
⚠️ 금액=right + Inter Bold, 상태=center + badge색상
⚠️ 이상거래: score ≥90 red, ≥80 orange, <80 blue, 24px Bold
```
props: `title?(string), columns({key,label,align,format?}[]), rows(object[]), maxRows?(number)`

### bar-chart
```
┌─────────────────────────────────────┐
│ [제목] 16 SemiBold                  │
│                                     │
│  ██ 120  ████ 250  ██████ 380      │  bar: accent
│  1분기    2분기      3분기           │  label: 12px gray-500
│                                     │
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=20
⚠️ 라벨 센터링: centerX = barX + barWidth/2, textX = centerX - textWidth/2
```
props: `title?(string), data({label:string, value:number}[]), color?(string)`

### line-chart
```
┌─────────────────────────────────────┐
│ [제목] 16 SemiBold      [범례]      │
│                                     │
│      ╱‾‾╲    ╱‾‾╲                  │  line: accent (stroke=2)
│    ╱      ╲╱      ╲               │  dot: radius=3
│  ╱                    ╲            │
│  1월  2월  3월  4월  5월            │
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=20
```
props: `title?(string), series({name:string, data:number[], color?:string}[]), labels(string[])`

### alert-box
```
┌─────────────────────────────────────┐
│ ⚠️ [제목] 14 Bold                   │
│ [내용 텍스트] 13 Regular             │
└─────────────────────────────────────┘
type별 배경: error=red-50, warning=amber-50, info=blue-50, success=green-50
border-left=4px solid (type color), radius=6, pad=12 16
```
props: `type('error'|'warning'|'info'|'success'), title(string), content(string)`

### callout
```
┌─────────────────────────────────────┐
│ 💡 [내용 텍스트] 14 Regular          │
└─────────────────────────────────────┘
bg=blue-50, border=blue-200, radius=6, pad=12 16
```
props: `icon?(string), content(string)`

### pattern-analysis
```
┌─────────────────────────────────────┐
│ [제목] 16 SemiBold                  │
├─────────────────────────────────────┤
│ 패턴 1: [설명] ───── [수치]         │  14px, pad=12
│ 패턴 2: [설명] ───── [수치]         │  border-b=gray-100
│ 패턴 3: [설명] ───── [수치]         │
├─────────────────────────────────────┤
│ 종합: [요약 텍스트]                  │  bg=gray-50, 13px
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200
```
props: `title(string), patterns({label:string, description:string, value:string}[]), summary?(string)`

### steps
```
┌─────────────────────────────────────┐
│ [제목] 16 SemiBold                  │
│                                     │
│  ① [단계 제목] ─── [설명]           │  accent circle, 14px
│  │                                  │  연결선: gray-200
│  ② [단계 제목] ─── [설명]           │
│  │                                  │
│  ③ [단계 제목] ─── [설명]           │
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=20
```
props: `title?(string), steps({title:string, description:string}[])`

### key-value
```
┌─────────────────────────────────────┐
│ [키]          │ [값]                │  키: 14px gray-500, 값: 14px gray-900
│ [키]          │ [값]                │  border-b=gray-100, pad=8 0
│ [키]          │ [값]                │
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=16
```
props: `items({key:string, value:string}[])`

### query-detail
```
┌─────────────────────────────────────┐
│ 🔍 질의 상세                         │  14 SemiBold
│ [쿼리 내용 or 분석 조건]              │  13 mono, bg=gray-50
│ [실행 시간] [결과 건수]               │  12 gray-400
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=16
```
props: `query(string), executionTime?(string), resultCount?(number)`

### source-box
```
┌─────────────────────────────────────┐
│ 📋 출처                              │  14 SemiBold
│ • [출처명] — [설명]                  │  13, accent link
│ • [출처명] — [설명]                  │
└─────────────────────────────────────┘
bg=gray-50, radius=6, border=gray-200, pad=12 16
```
props: `sources({name:string, description?:string, url?:string}[])`

### related-questions
```
┌─────────────────────────────────────┐
│ 💬 관련 질문                         │  14 SemiBold
│ ┌─────────────────────────────────┐ │
│ │ "다른 기간으로 비교해볼까요?"     │ │  13, clickable, hover=gray-50
│ ├─────────────────────────────────┤ │
│ │ "부서별로 나눠서 보여줘"         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
bg=white, radius=8, border=gray-200, pad=16
```
props: `questions(string[])`

---

## QA [Core]
- DOM 존재 확인
- optional chaining
- node --check
- 클릭 플로우 5개 (→ 기존 표준 구체화 참조)
- console error 0
