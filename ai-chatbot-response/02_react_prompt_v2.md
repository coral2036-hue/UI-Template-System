# BranchQ React Prompt v2

## Folder [Core]
```
/components    — 공통 UI 컴포넌트
/layout        — Sidebar, Header, InputBar
/chat          — ChatArea, MessageBubble
/blocks        — Block 14종 (PascalCase: DataTable.tsx, BarChart.tsx ...)
/modals        — Modal 6종 (ModelSelect.tsx, ApiSetting.tsx ...)
/builder       — UI 빌더/제너레이터
/hooks         — useChatState, useModalState, useSubPanelState, useTheme
/utils         — formatCurrency, formatDate, formatPercent
/types         — Block, Message, AppState 타입 정의
/constants     — 색상 토큰, 카테고리 목록, 기본값
/services      — API 호출, 파일 다운로드
/context       — ThemeContext, AppStateContext
```
파일 네이밍: → 00_master#naming 참조

## Core Components [Core]
- Sidebar
- Header
- InputBar
- ChatArea
- MessageBubble (User / AI)
- ShareRow
- BlockRenderer
- SubPanel (recent / report / settings)
- ThemeProvider

## Rendering Order [Core]
AIText → Blocks (gap=16 세로 스택) → ShareRow

## Hooks [Core]
- useChatState — messages, loading, sendMessage
- useModalState — modal open/close, type
- useSubPanelState — panel open/close, type
- useTheme — light/dark toggle, 토큰 참조

## BlockRenderer [Core]
switch(block.type) exhaustive
- 새 블록 추가 시 체크리스트:
  1. types에 Block union 추가
  2. blocks/ 폴더에 컴포넌트 파일 생성
  3. BlockRenderer switch case 추가
  4. 00_master Block ASCII + props 추가

## ShareRow Handler [Core]
- onPdfDownload
- onExcelDownload
- openShareModal
- reportIssue
⚠️ 색상: → 00_master#sharerow 참조, hex 하드코딩 금지 (v25 버그)

## Modal Rule [Core]
- ESC close
- outside click close
- focus return
- → 00_master#modal-contract (M1~M6) 참조

## Error / Loading / Empty [Core]
| 상황 | UI |
|------|-----|
| API 에러 | toast error + 재시도 버튼 |
| 네트워크 오류 | 전역 에러 배너 |
| AI 응답 대기 | typing dots (●●●) in AI 버블 위치 |
| 300ms~2s 로딩 | spinner |
| 2s+ 로딩 | skeleton |
| 데이터 없음 | Empty State (아이콘 + "아직 내역이 없습니다") |

## Theme [Visual]
- ThemeProvider: light/dark 모드 토글
- useTheme(): `{ theme, toggleTheme, tokens }`
- 모든 색상은 semantic token 경유 (→ 01_design#semantic-token)
- CSS 변수: `--brq-*` prefix

## Output Mode [Core]
v27 기준 3종 출력 모드:
- HTML — 기본 웹 출력
- Pencil.dev — .pen 파일 생성 (→ 04_figma_optimize#pencil)
- Figma — Plugin API 코드 (→ 04_figma_optimize)
