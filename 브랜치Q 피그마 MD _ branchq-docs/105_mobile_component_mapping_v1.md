# BranchQ Mobile Component Mapping v1

> → 100_mobile_master_prompt — 총론·Work Entry Points
> → 101_mobile_layout_spec — 변환 규칙
> → 102_mobile_screen_spec — 뷰 V01~V13
> → 103_mobile_interaction — Drawer/BottomSheet/BlockFullView

## 목적
기존 `ai-chatbot-response/src/` 컴포넌트를 **재사용**하여 모바일을 구현하기 위한 매핑표. **새 파일은 최소 추가** 원칙(→ 00_master_prompt#작업 원칙, README#규칙)을 따른다.

---

## Layout 컴포넌트 [Core]

| 파일 | 현재 역할 | 모바일 반영 | 수정 범위 |
|---|---|---|---|
| `src/layout/AppLayout.tsx` | Sidebar + Header + ChatArea + InputBar + SubPanel 조립 | 반응형 분기 — sm 이하에서 Sidebar Drawer 모드 | 기존 props 유지, `responsive: boolean` optional prop 추가 또는 CSS만으로 처리 |
| `src/layout/Sidebar.tsx` | 70px 고정 사이드바 | `mobileOpen` 상태 이미 존재(→ App.tsx:27) → Drawer 모드 강화 | Drawer 스타일·제스처 추가(103 규칙), 아이콘·항목은 변경 금지 |
| `src/layout/Header.tsx` | 56px 헤더, `onMenuToggle` 이미 보유 | 모바일 높이 52, 알림 🔔 아이콘 추가 | 알림 아이콘 onClick → V13 네비게이트, 기타 변경 없음 |
| `src/layout/InputBar.tsx` | 카테고리 칩 + 입력 + 전송 | Safe Area padding, 음성 아이콘, IME 대응 | CSS 보강 + 음성 버튼 1개 추가 |

---

## Chat 컴포넌트 [Core]

| 파일 | 현재 역할 | 모바일 반영 | 수정 범위 |
|---|---|---|---|
| `src/chat/ChatArea.tsx` | 메시지 스트림 렌더 | 1열 적층 분기, 키보드 대응 스크롤 | 레이아웃 CSS만 |
| `src/chat/WelcomeScreen.tsx` | S0 웰컴 | 카테고리 그리드 2×3, 추천 질문 세로 리스트 | 그리드 분기 CSS |
| `src/chat/CategoryPillBar.tsx` | 카테고리 칩 | V03 BottomSheet 트리거 연결 | onClick만 변경 |
| `src/chat/MessageBubble.tsx` | 버블 | max-width 84%, 길게 누르기 액션 | 이벤트 1개 추가 |
| `src/chat/ShareRow.tsx` | 공유 액션 버튼 그룹 | 오버플로우 시 `⋯` → 액션시트(V10 Share) | overflow 감지 로직 |
| `src/chat/TypingIndicator.tsx` | 타이핑 인디케이터 | 변경 없음 | — |

---

## Modal 컴포넌트 [Core]

| 파일 | 현재 역할 | 모바일 반영 | 수정 범위 |
|---|---|---|---|
| `src/modals/ModalOverlay.tsx` | 중앙 정렬 모달 래퍼 | 모바일에서 BottomSheet 래퍼로 **분기** 또는 **신규 BottomSheet 추가** | (권장) 분리 — 새 파일 `BottomSheet.tsx` |
| `src/modals/ModelSelectModal.tsx` (M1) | 모델 리스트 | V09 BottomSheet half | 내부 JSX 유지, 래퍼만 교체 |
| `src/modals/ShareModal.tsx` (M3) | 공유 옵션 | V10 BottomSheet half + 스택 | 래퍼 교체 |
| `src/modals/SendMethodModal.tsx` (M7·M8) | MMS·카톡 | V10 서브시트 | 래퍼 교체 |
| `src/modals/EmailModal.tsx` (M5) | 이메일 미리보기 | V11 **풀스크린** 유지 (개발 중, → CLAUDE.md) | 모바일에서도 풀스크린 그대로 |
| `src/modals/ConfirmModal.tsx` (M6) | 확인 모달 | V10 스택 내 BottomSheet peek | 래퍼 교체 |

---

## Block 컴포넌트 (14종) [Core]
`src/blocks/`의 모든 블록은 **props 변경 금지**(→ 00_master_prompt 절대 규칙). 모바일은 컨테이너 너비만 100%, 내부 레이아웃은 아래 규칙.

| 블록 | 모바일 규칙 |
|---|---|
| `NumberStat.tsx` | 2열 그리드 `calc(50% - 8)`, 숫자 28 → 24 허용 |
| `DataTable.tsx` | 핵심 2~3열만 + "전체 보기" → V08 BlockFullView |
| `BarChart.tsx` / `LineChart.tsx` | 폭 100%, 탭 → V08 가로모드 |
| `AlertBox.tsx` / `Callout.tsx` | 폭 100%, padding 16 |
| `ApprovalBox.tsx` | 폭 100%, 버튼 h36 유지 |
| `DateRange.tsx` / `KeyValue.tsx` | 1열 스택 |
| `PatternAnalysis.tsx` / `SummaryCards.tsx` | 1열 카드 |
| `RelatedQuestions.tsx` | 1열 칩 스택 |
| `ReportHeader.tsx` | 폭 100% |
| `SourceBox.tsx` / `TextContent.tsx` | 폭 100% |
| `Steps.tsx` | 세로 스텝 리스트 |
| `BlockRenderer.tsx` | 분기 불필요 (각 블록이 자체 반응형) |

---

## 신규 추가 컴포넌트 (최소) [Core]
append-only / 새 파일 1개 이하 원칙(→ README#규칙)을 최대한 준수하되, 모바일 전용으로 다음 2개 + 훅 1개가 필요. **현재 스캐폴딩 완료** 상태.

| 신규 파일 | 역할 | 관련 뷰 | 상태 |
|---|---|---|---|
| `src/components/BottomSheet.tsx` | 스냅 높이(peek/half/full), 드래그 제스처, 백드롭, 스택 지원 | V03·V09·V10·일부 M1~M8 | ✅ 작성됨 |
| `src/components/BlockFullView.tsx` | 블록 풀스크린 래퍼, 핀치 줌, 더블탭 원복, 드래그 닫기 | V08 | ✅ 작성됨 |
| `src/hooks/useMobileUI.ts` | isMobile·drawerOpen·bottomSheetStack·blockFullView 상태 | 전역 | ✅ 작성됨 |

> `ModalOverlay.tsx`를 그대로 두고 위 2개 컴포넌트 + 훅 1개만 추가. 기존 Modal JSX는 재사용.

### BottomSheet Props
```ts
interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialSnap?: 'peek' | 'half' | 'full';       // default: 'half'
  snaps?: BottomSheetSnap[];                     // default: ['peek','half','full']
  stacked?: boolean;                             // 스택 뒤에 있을 때 scale/opacity 보정
  showClose?: boolean;                           // default: true
  showHandle?: boolean;                          // default: true
  children: ReactNode;
}
```
임계값: 닫기=80px / 스냅 이동=60px / 애니메이션 200ms ease-out (→ 01_design#Animation)

### BlockFullView Props
```ts
interface BlockFullViewProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  suggestLandscape?: boolean;
  children: ReactNode;
}
```
줌 범위 1.0~3.0, 더블탭 원복, 아래 드래그 ≥120px 시 닫기.

### useMobileUI 인터페이스
```ts
const {
  isMobile,                    // < 640px (→ 101#반응형 정책)
  drawerOpen, openDrawer, closeDrawer, toggleDrawer,
  bottomSheetStack, openBottomSheet, closeBottomSheet, closeAllBottomSheets,
  blockFullView, openBlockFullView, closeBlockFullView,
} = useMobileUI();
```
BottomSheet 스택 depth는 최대 2 (→ 103#스택).

---

## State 추가 [Core]
→ 00_master_prompt#AppState를 수정하지 않고 **append-only**로 확장. `useChatState`·`useModalState`는 그대로 두고, 모바일 전용 훅만 추가.

```ts
// src/hooks/useMobileUI.ts (신규)
interface MobileUIState {
  drawerOpen: boolean;
  bottomSheet: { id: string; snap: 'peek' | 'half' | 'full' } | null;
  blockFullView: { blockId: string } | null;
}
```

- `mobileMenuOpen`은 기존 `App.tsx:27`에 이미 존재 → `drawerOpen`으로 단순 리네이밍 혹은 그대로 유지 선택
- AppState 타입 파일(`src/types/`)은 base 규약상 수정 금지 → 신규 타입은 훅 파일 내부에만 정의

---

## 파일 경로 요약 [Core]

### 재사용 (수정 최소)
```
src/layout/{AppLayout,Sidebar,Header,InputBar}.tsx
src/chat/{ChatArea,WelcomeScreen,CategoryPillBar,MessageBubble,ShareRow,TypingIndicator}.tsx
src/modals/{ModelSelectModal,ShareModal,SendMethodModal,EmailModal,ConfirmModal,ModalOverlay}.tsx
src/blocks/*.tsx (17개 파일, props 변경 금지)
```

### 신규 (완료)
```
src/components/BottomSheet.tsx        ✅
src/components/BlockFullView.tsx      ✅
src/hooks/useMobileUI.ts              ✅
src/index.css (@theme 블록에 mobile 토큰 5종 추가)  ✅
```

### 건드리지 않음
```
src/types/** (AppState 등 contract)
src/constants/**, src/data/**, src/utils/**
```

---

## Claude Code 작업 가이드 [Core]
본 문서군을 기반으로 Claude Code가 작업할 때의 기본 절차.

1. **뷰 단위로 작업**: 102의 V01~V13 중 1개씩, 해당 뷰에 관여하는 컴포넌트만 수정
2. **Figma 먼저**: V## 프레임이 Figma `6.모바일서비스 개선`에 존재하는지 확인 → 없으면 먼저 생성 (→ 100#Work Entry Points)
3. **코드는 뒤**: Figma 프레임을 기준으로 `src/` 변경
4. **토큰 확인**: 새 색상·spacing 리터럴이 PR에 포함되지 않는지 검증 (→ 00_master_prompt 절대 규칙)
5. **QA 5개**: DOM 존재·optional chaining·문법·클릭 flow 5개·console 0 (→ README#코드 생성 전 점검)

---

## QA [Core]
- [ ] 신규 파일이 3개 이하(`BottomSheet`, `BlockFullView`, `useMobileUI`)
- [ ] 블록 14종 props 변경 0건
- [ ] AppState contract 수정 0건
- [ ] 모바일 추가 state는 `useMobileUI` 훅 내부에 한정
- [ ] 기존 파일 수정은 반응형 CSS·분기·래퍼 교체에 한정
