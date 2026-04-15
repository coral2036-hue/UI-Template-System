# BranchQ Screen Spec v2

## Page Structure [Visual]
```
┌───────────────────────────────────────────────┐
│ ┌────┬──────────────────────────────────────┐ │
│ │    │ Header (h=56, bg=white, border-b)    │ │
│ │Side│──────────────────────────────────────│ │
│ │bar │  ChatArea (pad=24, max-w=800, center)│ │
│ │(70)│  [messages...]                       │ │
│ │    │──────────────────────────────────────│ │
│ │    │ InputBar (h=56, bg=white, border-t)  │ │
│ └────┴──────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
전체: 1440 x 100vh, 배경=gray-50
```

## S0 Welcome [Context]
```
┌──────────────────────────────────┐
│       🏦 BranchQ  24 Bold       │
│   "무엇을 도와드릴까요?" 16      │
│                                  │
│  [일반질의][분석][예측]           │  Category Pills
│  [이상거래][상담]                 │  gap=8, center
│                                  │
│  추천 질문:                      │
│  ┌────────────────────────────┐ │
│  │ "이번 달 이상거래 현황은?"  │ │  클릭→전송
│  │ "3분기 실적 분석해줘"       │ │
│  │ "예적금 상품 비교해줘"      │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
Pills: bg=white border=gray-200 radius=20 pad=8,16 | selected: bg=accent text=white
추천카드: bg=white border=gray-200 radius=8 pad=12,16 hover=gray-50
```

## S1 General Query [Core]
- 5 turn multi-turn
- Blocks: report-header → number-stat → data-table → callout → query-detail
- layout: 세로 스택 gap=16
- ⚠️ 멀티턴 높이: GAP=24, reduce()로 순차 배치, 고정 y값 금지
- ⚠️ 높이 추정 불가 → 2-pass 필수 (생성→높이 읽기→재배치)

## S2 Analysis [Core]
- number-stat ×4 (가로, gap=12)
- pattern-analysis
- alert-box

## S3 Forecast [Core]
- data-table
- bar-chart
- query-detail

## S4 Anomaly [Core]
- score table 5 rows
- ⚠️ badge: score ≥90 red, ≥80 orange, <80 blue
- ⚠️ 금액=right Inter Bold, score=center 24px Bold

## S5 Consult [Core]
- steps
- manual download btn

## S6 Report [Core]
- approval box: 우상단 고정
- report card
- ⚠️ title width=350px 제약 필수 (수평 겹침 방지)

## 화면 전환 조건 [Core]
| 입력 Category | 화면 |
|--------------|------|
| general | S1 |
| analysis | S2 |
| forecast | S3 |
| anomaly | S4 |
| consult | S5 |
| 리포트 저장 후 | S6 |

## 인터랙션 흐름 [Core]
User 입력 → loading(●●●) → AI 텍스트 → Blocks 렌더 → ShareRow

---

## Message Bubble [Visual]

### User
align=right, max-w=70%, bg=accent, text=white, radius=16 4 16 16, pad=12 16

### AI
align=left, max-w=85%, bg=white, border=gray-200, radius=4 16 16 16, pad=16

### Block 배치
AI text → gap=12 → Blocks (세로 gap=16) → gap=12 → ShareRow

### 메시지 간격
다른 발신자: gap=16 / 같은 발신자 연속: gap=8

---

## InputBar [Visual]
```
h=56, bg=white, border-top=gray-200, pad=8 16
[📎 w=40 h=40 r=20] [입력창 flex-1 h=40 r=20 bg=gray-100 pad=8,16] [▶ w=40 h=40 r=20 bg=accent]
```
placeholder="질문을 입력하세요" / 전송btn: disabled시 gray-300

---

## Category Pills [Visual]
가로, gap=8, center
default: bg=white border=gray-200 radius=20 pad=8,16 font=13
selected: bg=accent text=white border=accent
hover: bg=gray-50

---

## SubPanel [Visual]
```
Sidebar 오른쪽 슬라이드, w=320 h=100vh bg=white border-right=gray-200 shadow=lg
┌────────────────────┐
│ [제목] 16 Bold [✕] │  h=56 pad=16 border-b
├────────────────────┤
│ (콘텐츠)            │  pad=16 overflow-y=auto
│ recent: 대화 목록   │
│ report: 리포트 카드  │
│ settings: 설정 폼   │
└────────────────────┘
```
ChatArea width 축소

---

## State Screens [Context]

### Loading
AI 버블 위치에 ●●● typing dots, gray-400

### Error
⚠️ "오류가 발생했습니다" error색 + "잠시 후 다시 시도해주세요" gray-500 + [다시 시도] btn

### Empty (리포트/최근 없음)
아이콘 gray-300 + "아직 내역이 없습니다" 14px gray-400

---

## Modal M1~M6 상세 [Context]
공통: overlay=black/50 blur=4, container=white radius=8 shadow=modal max-w=480 center pad=24

### M1 model-select
```
│ AI 모델 선택          [✕] │
│ ○ GPT-4         추천      │  radio + badge
│ ○ Claude 3.5              │
│ ○ Gemini Pro              │
│            [취소] [적용]   │
```

### M2 api-setting
```
│ API 설정              [✕] │
│ API Key: [input]          │
│ Endpoint: [input]         │
│            [취소] [저장]   │
```

### M3 share
```
│ 공유                  [✕] │
│ [링크 복사] [카카오톡]     │
│ [이메일]   [다운로드]      │
```

### M4 kakao-preview
```
│ 카카오톡 미리보기     [✕] │
│ (미리보기 영역)            │
│            [취소] [전송]   │
```

### M5 email
```
│ 이메일 전송           [✕] │
│ 받는 사람: [input]        │
│ 제목: [input]             │
│ 내용: [textarea h=120]    │
│            [취소] [전송]   │
```

### M6 confirm
```
│ [타이틀]              [✕] │
│ [확인 메시지]              │
│            [취소] [확인]   │
```

---

## ⚠️ 텍스트 줄바꿈 규칙 [Core]
- UI 내 텍스트는 **1줄 표시 우선** — 2줄 이상 줄바꿈 최소화
- 긴 텍스트: `text-overflow: ellipsis` + `overflow: hidden` + `white-space: nowrap`
- 예외: AI 응답 본문, 모달 textarea, 블록 내 설명 텍스트
- 테이블 셀: nowrap 기본, 초과 시 ellipsis
- 제목: 1줄 강제, 초과 시 ellipsis (max-width 지정)
