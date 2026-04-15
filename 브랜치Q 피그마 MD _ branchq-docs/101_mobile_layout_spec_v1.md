# BranchQ Mobile Layout Spec v1

> → 100_mobile_master_prompt — 총론·범위
> → 01_design_v2 — 디자인 토큰 단일 소스 (색상·타이포·spacing·radius·shadow)
> → 03_design_spec_v2 — PC 화면 S0~S6, Modal M1~M8 스펙

## 목적
PC 웹의 5요소 레이아웃(Sidebar/Header/ChatArea/InputBar/SubPanel+Modal)을 모바일 폼팩터에 맞춰 **변환하는 규칙**을 정의한다. 토큰은 재정의하지 않는다.

---

## PC → Mobile 변환표 [Core]

### Sidebar
| 항목 | PC | Mobile |
|---|---|---|
| 배치 | 좌측 고정, width 70 | **Drawer**, 좌→우 슬라이드 |
| 가시성 | 상시 노출 | 기본 숨김, 햄버거 아이콘 탭으로 열림 |
| 폭 | 70 | **280** (Drawer 열린 상태) |
| 배경 | primary (→ 01_design#color) | 동일 |
| 아이콘 | 9종 (→ 01_design#Sidebar Icons) | 동일, 세로 나열 + 라벨 노출 |
| 닫기 | — | 백드롭 탭, 좌측 스와이프, ESC (→ 103) |

### Header
| 항목 | PC | Mobile |
|---|---|---|
| 높이 | 56 (→ 01_design#Header) | **52** (모바일 전용 하한) |
| 좌 | ≡ + BranchQ + 시나리오 드롭다운 | ≡(햄버거) + BranchQ 로고 + 시나리오 배지(탭 시 BottomSheet) |
| 우 | 도움말 + 알림 | 알림 🔔 + 모델 선택(M1 트리거) |
| 배경·테두리 | white, border-bottom gray-200 | 동일 |

### ChatArea
| 항목 | PC | Mobile |
|---|---|---|
| 너비 | Sidebar·SubPanel 제외 나머지 | 화면 100% (좌우 패딩 16) |
| 블록 레이아웃 | 그리드 2~4열 가능 | **1열 적층** 고정 (예외: NumberStat 2열 허용) |
| 메시지 버블 | User 우측 accent / AI 좌측 white | 동일, max-width 84% |
| 스크롤 | 영역 내부 스크롤 | 페이지 단위 스크롤, InputBar는 하단 고정 |

### InputBar
| 항목 | PC | Mobile |
|---|---|---|
| 높이 | 56 | **56 + Safe Area bottom** |
| 위치 | ChatArea 하단 | 화면 하단 고정(`position: sticky/fixed`) |
| 구성 | 카테고리 칩 + 입력 + 전송 | 좌: 카테고리 칩 / 중: 입력 / 우: 음성 + 전송 + 첨부 |
| radius | 20 (→ 01_design#radius) | 동일 |
| IME 대응 | — | 키보드 올라올 때 스크롤 오프셋 보정 (→ 103) |

### SubPanel
| 항목 | PC | Mobile |
|---|---|---|
| 방식 | 우측 슬라이드 패널 | **풀스크린 서브뷰** (뒤로가기로 복귀) |
| 종류 | recent / report / settings | 동일 |
| 진입 | Sidebar 아이콘 | Drawer 내 해당 항목 탭 |

### Modal
| 항목 | PC | Mobile |
|---|---|---|
| 방식 | 중앙 정렬, max-w 480 (→ 01_design#Modal) | **BottomSheet** (M5 이메일은 풀스크린) |
| 상단 | 일반 radius 8 | 상단 radius **16**, 하단 0 (모바일 추가 규칙) |
| 오버레이 | black/50 | 동일 |
| 닫기 | X 버튼, ESC | X 버튼, 하단 스와이프, 백드롭 탭 |

### Block (14종)
| 항목 | PC | Mobile |
|---|---|---|
| 컨테이너 너비 | 가변 | 화면 폭 - 32 (좌우 16 패딩) |
| NumberStat | 173×90, 2~4열 | **2열 or 1열**, 숫자 28 → 24 허용 |
| Table | 전체 노출 | 핵심 2~3열 + "전체 보기" → BlockFullView |
| Chart | 내부 bar ratio | 폭 100%, 탭 시 BlockFullView 가로모드 |
| 기타 11종 | PC props 그대로 | props 변경 금지, 너비만 100% |

---

## 반응형 정책 [Core]
PC의 `→ 01_design#Responsive` 규칙을 확장하되 기존 값은 변경하지 않는다.

| 폭 | 동작 |
|---|---|
| ≥ lg (1024px) | PC 원본 레이아웃 |
| md (768~1023) | Sidebar collapse 48 (→ 01_design#Responsive) |
| sm (640~767) | Sidebar hidden, 햄버거 Drawer 사용 |
| **< sm (360~639)** | 본 문서 규칙 전면 적용 — Drawer + 1열 블록 + BottomSheet + Safe Area |

ChatArea 최소 너비 **320px** (→ 01_design#Responsive) 계승.

---

## Mobile 추가 토큰 [Core]
PC에 없는 모바일 전용 값만 선언. 기타 모든 토큰은 `→ 01_design` 참조.
CSS 변수 실체는 `ai-chatbot-response/src/index.css`의 `@theme` 블록에 정의되어 있다.

| 토큰명 | CSS 변수 | 값 | 근거 |
|---|---|---|---|
| mobile-header-height | `--brq-mobile-header-height` | 52px | 56(PC)에서 터치 영역 유지하며 화면 높이 확보 |
| mobile-tap-target-min | `--brq-mobile-tap-target-min` | 44px | 모바일 접근성 최소 터치 타겟 |
| mobile-safe-area-bottom | `env(safe-area-inset-bottom)` | 런타임 | iOS 홈 인디케이터 |
| mobile-safe-area-top | `env(safe-area-inset-top)` | 런타임 | iOS 노치 |
| mobile-drawer-width | `--brq-mobile-drawer-width` | 280px | Sidebar 70 → Drawer 변환 값 |
| mobile-bottomsheet-radius-top | `--brq-mobile-bottomsheet-radius-top` | 16px | Modal radius 8의 2배(모바일 관습) |
| mobile-block-side-padding | `--brq-mobile-block-side-padding` | 16px | ChatArea 좌우 기본 패딩 |
| mobile-backdrop-opacity | — | 0.5 (→ 01_design#Opacity overlay) | PC overlay 계승 |

> 위 8개 외 색상·타이포·spacing·shadow·animation은 모두 `→ 01_design`. **재정의 금지**.

---

## 수평 공존 요소 width 지정 [Core]
→ 01_design#Responsive 및 04_figma_optimize Lessons의 "수평 공존 요소 반드시 명시적 width 지정" 규칙 계승. 모바일에서는 대부분 1열 적층으로 이 이슈를 회피하나, 다음 경우에는 명시적 width 필요.

- InputBar 내부 [카테고리 칩 | 입력 | 아이콘 그룹] — 입력만 `flex: 1`, 나머지는 고정 width
- Header [≡ | 로고·시나리오 | 알림·모델] — 좌·우는 고정, 중앙만 `flex: 1`
- NumberStat 2열 — 각 카드 `width: calc(50% - 8)` 명시

---

## 변환 요약 (Figma 작업 시 참고)
Figma `6.모바일서비스 개선` 페이지의 프레임 세팅 기준.

- 아트보드: **iPhone 15 Pro(393×852)** 기본, 최소 지원 360×640
- Safe Area: 상단 59, 하단 34 (iPhone 기준) — 디자인 가이드 레이어로 표시
- Status Bar(상단 44)는 프레임에 포함하되 앱 UI는 Safe Area 내부로 제한
- Frame 네이밍: `Mobile/V{번호}_{이름}` (→ 102)

---

## QA [Core]
- [ ] 101 내 색상 hex 리터럴 0개
- [ ] 모든 토큰 언급에 `→ 01_design#...` 역참조 포함
- [ ] Mobile 추가 토큰은 PC에 존재하지 않는 8종으로만 한정
- [ ] 수평 공존 요소 3개소(InputBar/Header/NumberStat)의 width 지정 규칙 명시
