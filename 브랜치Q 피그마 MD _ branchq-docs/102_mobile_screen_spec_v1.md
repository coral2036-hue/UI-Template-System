# BranchQ Mobile Screen Spec v1

> → 100_mobile_master_prompt — 총론
> → 101_mobile_layout_spec — 변환 규칙·모바일 추가 토큰
> → 03_design_spec_v2 — PC 화면 S0~S6 원본 스펙
> → 00_master_prompt_v2 — Modal Contract M1~M8

## 목적
모바일 앱에서 제공할 **13개 뷰 상태**를 정의한다. 각 뷰는 PC의 S0~S6 / M1~M8 / SubPanel을 **변형한 결과**이며, Figma `6.모바일서비스 개선` 페이지 프레임과 1:1 대응된다.

## 뷰 번호 규칙
- `V01` ~ `V13` (2자리)
- Figma 프레임 네이밍: `Mobile/V{번호}_{영문이름}` (예: `Mobile/V01_Main-Welcome`)

---

## 뷰 목록 [Core]

| # | 뷰 ID | 이름 | 계승 원본 | 주요 요소 |
|---|---|---|---|---|
| V01 | Main-Welcome | 메인 · 웰컴 | S0 WelcomeScreen | Header, Drawer 토글, 카테고리 그리드, 추천 질문, InputBar |
| V02 | Main-Chat | 메인 · 대화 진행 | S1~S5 ChatArea | Header, 메시지 스트림(1열 블록), ShareRow, InputBar |
| V03 | Category-Sheet | 카테고리 선택 시트 | (신규 변환) | BottomSheet 5 카테고리 그리드 2×3 |
| V04 | Drawer | 사이드 Drawer | Sidebar 9 아이콘 | 프로필·시나리오 배지 / 새채팅·카테고리 5 / 최근·리포트·설정 |
| V05 | SubPanel-Recent | 최근 대화 | SubPanel `recent` | 대화 목록(카테고리 배지·프리뷰·시간) |
| V06 | SubPanel-Report | 리포트 목록 | SubPanel `report` | 저장 리포트 리스트(필터 탭) |
| V07 | Report-Detail | 리포트 상세 | S6 Report | 커버 + 블록 스크롤 + 하단 고정 액션바 |
| V08 | Block-FullView | 블록 풀뷰 | (모바일 전용 확장) | 표 가로 스크롤 / 차트 가로모드 / 핀치 줌 |
| V09 | Modal-ModelSelect | 모델 선택 | M1 | BottomSheet — 모델 리스트 |
| V10 | Modal-Share | 공유 시트 | M3 + M7 + M8 통합 | BottomSheet — 카톡·메일·MMS·링크·PDF·Excel |
| V11 | Modal-Email | 이메일 미리보기 | M5 | **풀스크린** — Q&A 미리보기 + 첨부 관리 + 전송 |
| V12 | SubPanel-Settings | 설정 | SubPanel `settings` | 푸시/언어/시나리오/프로필 |
| V13 | Notifications | 알림 목록 | (모바일 전용 확장) | 탭(이상거래·승인·시스템) + 리스트 → 딥링크 (→ 104) |

> **M2 api-setting**, **M6 confirm**, **M7 MMS**, **M8 Kakao Alimtalk**: V10(Share Sheet) 내부에서 2단계 이동(BottomSheet 상단 스택)으로 처리. 별도 뷰 번호 불필요.

---

## 뷰 상세 [Visual]

### V01 Main-Welcome — `Mobile/V01_Main-Welcome`
- 계승: S0 WelcomeScreen (→ 03_design_spec#S0)
- 요소:
  - Header (→ 101#Header)
  - 중앙 인사 + 카테고리 그리드 2×3 (5 카테고리, 6번째 칸은 "전체 보기" 또는 비어있음)
  - 하단 추천 질문 리스트(최대 4개)
  - InputBar (→ 101#InputBar)
- 진입: 앱 시작 / Drawer "새 채팅"
- 이탈: 카테고리 탭 → V02 / InputBar 전송 → V02 / ≡ → V04

### V02 Main-Chat — `Mobile/V02_Main-Chat`
- 계승: S1~S5 Scene(→ 03_design_spec)의 ChatArea
- 요소:
  - Header (상단 타이틀 = 현재 대화명, 우: ⋯ 메뉴)
  - 메시지 스트림: User 버블(우, accent) / AI 버블(좌, white) + 블록 1열 적층
  - ShareRow(→ 00_master_prompt): AI 응답 하단, 카테고리별 버튼 구성 유지
  - InputBar
- 진입: V01 질문 전송 / V05 대화 탭 / 푸시 딥링크(→ 104)
- 이탈: 블록 탭 → V08 / ShareRow → V10 / ⋯ → 저장·삭제 액션시트 / ≡ → V04

### V03 Category-Sheet — `Mobile/V03_Category-Sheet`
- 진입: InputBar 좌측 카테고리 칩 탭 / V04 "새 채팅"
- 요소: BottomSheet 40% 높이, 그리드 2×3 카테고리(아이콘 + 라벨 + 1줄 설명)
- 이탈: 카테고리 선택 → V01 카테고리 프리셋 상태로 전환

### V04 Drawer — `Mobile/V04_Drawer`
- 계승: Sidebar 9 아이콘 (→ 01_design#Sidebar Icons)
- 요소: 상단 프로필·시나리오 / 중단 새채팅 + 카테고리 5 / 하단 최근·리포트·설정 / 로그아웃 없음(기존 앱 위임)
- 진입: Header ≡
- 이탈: 항목 탭 → 각 뷰 / 백드롭 탭 or 좌 스와이프 → 닫힘

### V05 SubPanel-Recent — `Mobile/V05_SubPanel-Recent`
- 계승: SubPanel `recent`
- 요소: 리스트 아이템 [카테고리 배지, 대화 제목(1줄), 마지막 메시지 프리뷰(1줄), 시간]
- 진입: V04 "최근"
- 이탈: 항목 탭 → V02 / 뒤로가기 → V04

### V06 SubPanel-Report — `Mobile/V06_SubPanel-Report`
- 계승: SubPanel `report`
- 요소: 상단 필터 탭(내 작성 / 공유받음 / 승인대기), 리스트
- 진입: V04 "리포트"
- 이탈: 항목 탭 → V07 / 뒤로가기 → V04

### V07 Report-Detail — `Mobile/V07_Report-Detail`
- 계승: S6 Report (→ 03_design_spec#S6)
- 요소: 커버 카드(제목·작성자·일시) / 블록 스크롤 / 하단 고정 액션바[공유(V10) · PDF · Excel · 승인]
- 진입: V06 / 푸시(승인 요청 딥링크, → 104)
- 이탈: 액션바 → V10 / 블록 탭 → V08

### V08 Block-FullView — `Mobile/V08_Block-FullView`
- 모바일 전용 확장 (PC에 없음)
- 요소: 상단 닫기 X / 블록 전체 표시(표=가로 스크롤, 차트=가로모드 회전 가능) / 핀치 줌 허용
- 진입: V02·V07 내 블록 탭
- 이탈: X → 이전 뷰

### V09 Modal-ModelSelect — `Mobile/V09_Modal-ModelSelect`
- 계승: M1 (→ 00_master_prompt#Modal Contract)
- 요소: BottomSheet 75%, 모델 리스트(라디오), "API 설정" 링크 → M2 상단 스택
- 진입: Header 우측 모델 아이콘

### V10 Modal-Share — `Mobile/V10_Modal-Share`
- 계승: M3 + M7 + M8 + 다운로드 통합
- 요소: BottomSheet 75%, 2열 그리드 [카톡·메일·MMS·링크복사·PDF·Excel·저장·이슈 보고]
- 진입: V02 ShareRow "공유" / V07 액션바 "공유"
- 2단계: 카톡·메일·MMS 선택 시 BottomSheet 스택 상단으로 V11 or 관련 서브시트 push

### V11 Modal-Email — `Mobile/V11_Modal-Email`
- 계승: M5 (→ CLAUDE.md 현재 개발 과제), 풀스크린
- 요소: 상단 [받는 사람 드롭다운·직접 입력] / 본문 [Q&A 미리보기 축소 렌더] / 첨부 [자동 PDF·Excel + 추가 업로드 최대 5개·10MB] / 하단 [전송]
- 진입: V10 "메일"
- 이탈: 전송 → Toast success → 이전 뷰 / 취소 X

### V12 SubPanel-Settings — `Mobile/V12_SubPanel-Settings`
- 계승: SubPanel `settings`
- 요소: 프로필, 시나리오 전환, 알림 수신 범위, 언어, 생체인증 on/off, 데이터 사용량
- 진입: V04 "설정"

### V13 Notifications — `Mobile/V13_Notifications`
- 모바일 전용 확장
- 요소: 상단 탭(이상거래·승인요청·시스템) / 리스트 아이템 [아이콘·유형·요약·시간·읽음 dot]
- 진입: Header 🔔 / 푸시 알림 센터
- 이탈: 항목 탭 → V02(이상거래→AnomalyDetail) or V07(승인요청) — 자세한 라우팅 → 104

---

## 3 시나리오 탭 경로 [Core]
100 문서의 사용 맥락을 뷰 번호로 구체화.

### 시나리오 1: 외근 중 빠른 조회 (3 탭)
V01 Main-Welcome
  → [1] Header ≡ → V04 Drawer
  → [2] "최근" → V05 SubPanel-Recent
  → [3] 항목 탭 → V02 Main-Chat

### 시나리오 2: 알림 즉시 대응 (2 탭)
푸시 수신 → 앱 열기 → V13 Notifications (자동 진입)
  → [1] 알림 항목 탭 → V02 (AnomalyDetail 뷰 상태) or V07 Report-Detail
  → [2] 하단 액션바 [담당자 연락 / 승인 / 반려]

### 시나리오 3: 간단한 신규 질문 (2 탭 + 타이핑)
V01 Main-Welcome
  → [1] 카테고리 칩 탭 (또는 V03 시트 → 카테고리 선택)
  → [타이핑]
  → [2] InputBar 전송 → V02 Main-Chat (응답 수신)

---

## Figma 프레임 매핑 체크 [Core]
- [ ] Figma `6.모바일서비스 개선` 페이지에 V01~V13 프레임 존재
- [ ] 각 프레임 네이밍이 `Mobile/V{번호}_{영문이름}` 형식
- [ ] V01·V02 사이즈 393×852 (iPhone 15 Pro) 기준 (→ 101#변환 요약)
- [ ] V08 Block-FullView는 가로/세로 두 프레임 모두 포함 권장

## QA [Core]
- [ ] 13 뷰가 PC 원본(S0~S6 + Modal M1~M8 + SubPanel) 누락 없이 커버
- [ ] 각 뷰에 계승 원본·진입·이탈 경로 명시
- [ ] 3 시나리오 탭 경로가 각각 3·2·2 탭 이내로 설계됨
- [ ] 뷰 간 라우팅에 고아(orphan) 없음
