# BranchQ Mobile Interaction v1

> → 100_mobile_master_prompt — 총론
> → 101_mobile_layout_spec — 변환 규칙·모바일 추가 토큰
> → 102_mobile_screen_spec — 뷰 V01~V13
> → 01_design_v2 — 토큰·상태 스타일·애니메이션

## 목적
모바일 전용 인터랙션 패턴(Drawer·BottomSheet·BlockFullView·InputBar)의 규칙을 정의한다. 토큰·애니메이션 duration은 `→ 01_design#Animation` 계승.

---

## Drawer [Core]
V04 Drawer의 열림/닫힘 규칙.

### 열기
- 트리거: Header ≡ 탭
- 방향: 좌 → 우 슬라이드
- duration: **200ms** (→ 01_design#Animation · SubPanel slide 계승)
- easing: ease-in-out
- 백드롭: black/50 (→ 01_design#Opacity overlay)

### 닫기 (3가지)
1. 백드롭 탭
2. 좌측 스와이프 (임계값: 이동 거리 ≥ 40% 또는 속도 ≥ 0.5px/ms)
3. ESC (하드웨어 백 키 포함)

### 상태
- width: 280 (→ 101#Mobile 추가 토큰 · mobile-drawer-width)
- 높이: 100vh
- 배경: primary(→ 01_design#color) + 상단 Safe Area 여백
- 포커스 트랩: 열린 상태에선 Drawer 내부 탭 순서만 순환

---

## BottomSheet [Core]
Modal M1~M8을 모바일에서 BottomSheet로 통일 (예외: V11 Email 풀스크린).

### 스냅 높이
| 레벨 | 화면 비율 | 용도 |
|---|---|---|
| peek | 40% | V03 Category-Sheet 등 단순 선택 |
| half | 75% | V09 Model / V10 Share 기본 |
| full | 100% - Status Bar | 리스트 길 때 확장 |

### 제스처
- 드래그 핸들: 상단 중앙 회색 바 (4×36, gray-300, margin-top 8) — 터치 영역은 상단 24 전체
- 아래로 드래그: 다음 하위 스냅으로 이동 / peek에서 추가 드래그 시 닫힘
- 위로 드래그: 다음 상위 스냅으로 이동
- 백드롭 탭: 즉시 닫힘

### 외형
- radius: 상단 16 (→ 101#Mobile 추가 토큰 · mobile-bottomsheet-radius-top), 하단 0
- 배경: white (→ 01_design#Semantic Token surface)
- shadow: modal (→ 01_design#Shadow)
- padding: 상단 20 / 좌우 16 / 하단 `16 + mobile-safe-area-bottom`

### 스택
- 상위 시트 push 시 하단 시트는 scale 0.96 + opacity 0.8로 비활성 표시
- 최대 스택 depth: 2 (예: V10 Share → V09 Model 추가 진입)
- 코드: `useMobileUI().bottomSheetStack`에 append, `closeBottomSheet()` 호출 시 상위 1개 pop (→ 105#useMobileUI 인터페이스)

### Animation
- open: 200ms ease-out, y: 100% → 목표 스냅
- close: 200ms ease-in, 역방향

---

## BlockFullView [Core]
V08 Block-FullView 규칙.

### 진입
- V02·V07 내부 블록을 탭하여 진입
- 애니메이션: 200ms ease-out, scale 0.92 → 1.0 + opacity 0 → 1

### 레이아웃
- 상단 바(52): [X 닫기] [블록 제목] [⋯ 메뉴 · 공유·저장]
- 본문: 블록 전체 노출
- 블록 유형별 동작
  - **Table**: 가로 스크롤, 첫 열 sticky, 행 호버=gray-50 (→ 01_design#Table Row)
  - **Chart**: 기기 방향 전환 시 가로 회전 지원, 회전 잠금 해제 권장 안내
  - **NumberStat·Key-Value 등**: 단순 확대 표시

### 제스처
- 핀치 줌: 1.0~3.0 배율, 더블탭 원복
- 좌우 스와이프(Table 한정): 가로 스크롤
- 아래로 강하게 드래그: 닫기 (**임계값 120px**, BlockFullView 구현 기준)

### 이탈
- X 탭, 백 키, 드래그 닫기 → 이전 뷰

---

## InputBar [Core]
V01·V02 하단 InputBar 동작.

### 레이아웃 (→ 101#InputBar)
- 고정 위치: `position: sticky; bottom: 0`
- 높이: 56 + `mobile-safe-area-bottom`
- 내부 순서: [카테고리 칩] [입력(flex:1)] [음성] [첨부] [전송]
- 배경: gray-100 (→ 01_design#Gray Scale)
- 입력 필드 radius: 20 (→ 01_design#Radius)

### IME (키보드) 대응
- 키보드 열림 시: ChatArea `padding-bottom`에 키보드 높이 가산, 마지막 메시지가 보이도록 자동 스크롤
- 키보드 닫힘: 원복 (200ms ease)
- iOS: `visualViewport` API로 키보드 높이 측정

### 전송 버튼 상태 (→ 01_design#Button)
- default: accent
- disabled: 입력 공백 또는 `loading=true`일 때
- loading: spinner 표시, 사용자 입력 차단

### 음성 입력
- 아이콘 탭: 녹음 시작, 입력 필드 placeholder 변경
- 종료: 자동 텍스트 삽입 후 전송 버튼은 수동
- 외근 시나리오 대응

### 첨부
- PC와 동일 파일 첨부 흐름(→ 00_master_prompt#Message Contract)
- 모바일은 카메라·갤러리·문서 3개 옵션을 액션시트로

---

## Safe Area [Core]
iOS·Android 양쪽 노치·홈 인디케이터 대응.

| 대상 | 규칙 |
|---|---|
| Header 상단 | `padding-top: mobile-safe-area-top` (→ 101) |
| InputBar 하단 | `padding-bottom: mobile-safe-area-bottom` |
| BottomSheet 하단 | 동일 |
| Drawer 상·하 | 상단은 Safe Area 포함, 하단 별도 여백 불필요 |
| Modal Full(V11) | 상·하 모두 Safe Area 준수 |

CSS 구현: `env(safe-area-inset-*)` 사용. Figma에서는 상단 59 / 하단 34 가이드 레이어로 표시.

---

## Gesture 요약표 [Core]
| 제스처 | 대상 | 동작 |
|---|---|---|
| 좌 스와이프 | Drawer | 닫기 |
| 하단 드래그 | BottomSheet | 스냅 다운 or 닫기 |
| 아래로 drag | BlockFullView | 닫기 |
| 핀치 줌 | BlockFullView 차트·표 | 1.0~3.0 |
| 가로 스크롤 | Table / Chat 가로 블록 | 표시 영역 확장 |
| 길게 누르기 | 메시지 버블 | 복사·인용(PC ⋯ 대응) |
| 스와이프(V13 리스트 아이템) | Notifications | 읽음 처리 / 삭제 |

---

## Animation Timing [Core]
기존 `→ 01_design#Animation` 계승. 모바일 추가 규칙만 명시.

| 대상 | duration | easing | 비고 |
|---|---|---|---|
| Drawer open/close | 200ms | ease-in-out | SubPanel slide 값 계승 |
| BottomSheet open | 200ms | ease-out | — |
| BottomSheet close | 200ms | ease-in | — |
| BottomSheet stack push | 150ms | ease-out | 하위 시트 scale 0.96 |
| BlockFullView open | 200ms | ease-out | scale + opacity |
| IME resize | 200ms | ease | ChatArea padding 보정 |

---

## 접근성 [Core]
- 모든 탭 타겟 ≥ 44×44 (→ 101#mobile-tap-target-min)
- 포커스 링: accent/20 ring (→ 01_design#Input focus)
- VoiceOver/TalkBack: Drawer/BottomSheet 열림 시 첫 포커스는 첫 번째 인터랙티브 요소
- 키보드 탐색(외부 키보드): Tab 순환, Enter 전송, ESC 닫기 (→ 00_master_prompt#인터랙션 표준 계승)

---

## QA [Core]
- [ ] Drawer/BottomSheet/BlockFullView 모두 duration이 → 01_design#Animation 값으로만 선언
- [ ] 모든 Safe Area 대상 4개소 규칙 명시
- [ ] IME 대응 절차 명시
- [ ] 44pt 최소 터치 타겟 선언
- [ ] 제스처 표 누락 없음
