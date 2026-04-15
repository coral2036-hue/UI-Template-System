# BranchQ Mobile Master Prompt v1

> Feature Layer (Mobile 묶음). base 00~04 문서는 건드리지 않고 append-only 원칙으로 추가된다.
> 상위 문서: `00_master_prompt_v2.md`, `01_design_v2.md`, `03_design_spec_v2.md`

## 프로젝트 목표
BranchQ PC 웹의 기능을 모바일 환경에서 제공한다. 완전히 새로운 앱을 설계하지 않고, PC 메인화면 구조(Sidebar/Header/ChatArea/InputBar/SubPanel/Modal)를 **1:1 계승**한 뒤 모바일 폼팩터에 맞춰 노출 방식만 변형한다. 디자인 산출은 Figma `브랜치Q 업그레이드 > 6.모바일서비스 개선` 페이지에서 진행된다.

## Design Philosophy [Context]
- 톤: PC와 동일 — 금융 전문가용 업무 도구, 신뢰감·깔끔·데이터 중심
- 사용 맥락: 외근·이동 중 빠른 조회 / 알림 수신·즉시 대응 / 간단한 신규 질문·요청
- 밀도: 모바일 폼팩터에 맞춰 1컬럼 적층, 블록 간 spacing은 PC 값 그대로 계승
- 인증·진입: **기존 앱의 인증 흐름을 사용** — 본 문서 범위 외

## 절대 규칙
- 계승 우선: PC 요소를 제거·재해석하지 않고 변형만 한다
- 토큰 재정의 금지: 모든 색상·간격·타이포는 `→ 01_design` 역참조
- block contract 유지 = Block 14종 props 변경 금지, 모바일은 1열 적층만 추가 규칙
- layout contract 유지 = Sidebar(70) + Header(56) + ChatArea 비율은 PC 한정, 모바일은 Drawer화
- 기능 동등성: S1~S6 / Modal M1~M8 / Block 14종 전체 지원

---

## Inheritance Map [Core]
PC 요소 → Mobile 변환 규칙. 세부 치수·토큰은 `→ 01_design` 참조.

| PC 요소 | Mobile 변환 | 상세 문서 |
|---|---|---|
| Sidebar (70px 고정) | 햄버거 Drawer (280px) | 101_mobile_layout_spec |
| Header (56px) | Header 유지, 높이만 조정 | 101 |
| ChatArea | 단일 컬럼, 블록 1열 적층 | 101, 102 |
| InputBar (56px) | 하단 고정 + Safe Area | 101, 103 |
| SubPanel (recent/report/settings) | 풀스크린 서브뷰 | 102 |
| Modal M1~M8 | BottomSheet (M5만 풀스크린) | 102, 103 |
| Block 14종 | 1열 적층 + BlockFullView | 102, 103 |
| Header 알림 아이콘 | Notifications 화면 + 딥링크 | 104 |

---

## Mobile Scope [Core]
본 문서군이 다루는 범위.

### 포함
- PC 메인화면 계승 (5요소 전체)
- 13 뷰 상태 정의 (→ 102_mobile_screen_spec)
- Drawer / BottomSheet / BlockFullView 인터랙션 (→ 103)
- 푸시 수신 → 딥링크 라우팅 (→ 104)
- 기존 `src/` 컴포넌트 재사용 매핑 (→ 105)

### 제외
- 인증·진입 (기존 앱 흐름 사용)
- 신규 Block 추가 (14종 유지)
- 신규 Modal 추가 (M1~M8 유지)
- PC 메인 base 문서 수정

---

## Documentation Index [Core]
| # | 파일 | 내용 |
|---|------|------|
| 100 | 100_mobile_master_prompt_v1.md | 본 문서 — 총론·범위·계승 원칙 |
| 101 | 101_mobile_layout_spec_v1.md | PC 5요소 → 모바일 변환표, 반응형 정책, 모바일 추가 토큰 |
| 102 | 102_mobile_screen_spec_v1.md | 13 뷰 상태 + 진입 경로 + 3 시나리오 탭 경로 |
| 103 | 103_mobile_interaction_v1.md | Drawer / BottomSheet / BlockFullView / Safe Area 규칙 |
| 104 | 104_mobile_notification_deeplink_v1.md | 푸시 수신 → 딥링크 라우팅 규칙 |
| 105 | 105_mobile_component_mapping_v1.md | 기존 `src/` 컴포넌트 재사용 매핑표 |

---

## 사용 맥락 3종 [Context]
101·102 문서의 설계 기준이 되는 시나리오.

| 시나리오 | 설명 | 목표 탭 수 |
|---|---|---|
| 외근 중 빠른 조회 | 이동 중 최근 대화·리포트 확인 | 3 탭 이내 |
| 알림 즉시 대응 | 이상거래·승인 요청 푸시 수신 후 현장 처리 | 2 탭 이내 |
| 간단한 신규 질문 | 짧은 Q&A, 음성·텍스트 입력 | 2 탭 + 타이핑 |

---

## 기능 동등성 선언 [Core]
모바일은 PC와 동일 기능을 제공한다. 별도 명시가 없으면 PC 스펙(`00_master_prompt_v2`, `03_design_spec_v2`)을 그대로 따른다.

- Category: `general` | `analysis` | `forecast` | `anomaly` | `consult` (→ 00_master_prompt#AppState)
- Scene: S0(Welcome), S1~S6 전체 지원 (→ 03_design_spec)
- Modal: M1~M8 전체 지원 (→ 00_master_prompt#Modal Contract)
- Block: 14종 전체 지원 (→ `AI_챗봇_응답블록_가이드.md`)

---

## 작업 원칙 [Core]
- state 먼저 확인 — 모바일 전용 state 추가 시 00_master_prompt AppState에 append-only
- 기존 컴포넌트 재사용 우선 (→ 105)
- 새 파일은 최소 확장 (BottomSheet wrapper, BlockFullView 정도만 허용)
- 텍스트 1줄 표시 우선, 2줄 줄바꿈 최소화 (PC 원칙 계승)
- reinterpret 금지 / append only

---

## Work Entry Points [Core]
Claude Code가 본 문서군을 읽고 실제 작업을 수행할 때 참조할 경로.

### Figma
- 파일: `https://www.figma.com/design/moHy3BaQLmzoGcXTgbJeI1/브랜치Q-업그레이드`
- fileKey: `moHy3BaQLmzoGcXTgbJeI1`
- 대상 페이지: `6.모바일서비스 개선`
- 프레임 네이밍: `Mobile/V{번호}_{이름}` (예: `Mobile/V01_Main-Welcome`) — 102의 13 뷰와 1:1 대응

### 코드
- 프로젝트 루트: `ai-chatbot-response/`
- 개발 가이드: `ai-chatbot-response/CLAUDE.md`
- 재사용 대상 컴포넌트: `ai-chatbot-response/src/layout/`, `src/chat/`, `src/modals/`, `src/blocks/` (→ 105)
- 신규 컴포넌트 (스캐폴딩 완료):
  - `src/components/BottomSheet.tsx` ✅
  - `src/components/BlockFullView.tsx` ✅
  - `src/hooks/useMobileUI.ts` ✅
  - `src/index.css` @theme 블록에 mobile 토큰 5종 추가 ✅

### MCP 도구 사용 원칙
- Figma 읽기: `mcp__Figma__get_metadata` / `get_design_context` (fileKey 위 값 사용)
- Figma 쓰기: `mcp__9139c944-...__use_figma` — 새 프레임 생성 시 101의 변환표·102의 뷰 정의 준수
- 코드 편집: Read → Edit/Write, 기존 컴포넌트 우선 재사용

---

## QA 체크 [Core]
문서 완성 시 교차 확인.

- [ ] 101~105 모든 문서에서 디자인 토큰 재정의 0건 (색상 hex / 폰트 / spacing 숫자 리터럴)
- [ ] 모든 토큰 언급은 `→ 01_design#...` 형태의 역참조
- [ ] PC 5요소 ↔ 모바일 13 뷰 매핑 누락 없음 (101·102 교차)
- [ ] 3 시나리오 탭 경로가 102에 명시
- [ ] 영문 타이틀 + 한글 섹션 + `[Core]`/`[Visual]`/`[Context]` 태그 컨벤션 준수
- [ ] Figma `6.모바일서비스 개선` 페이지 프레임과 102 뷰 번호 1:1 대응
