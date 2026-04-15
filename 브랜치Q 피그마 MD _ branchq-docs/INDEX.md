# BranchQ 문서 가이드

이 문서는 branchq-docs 폴더 내 각 MD 파일의 역할, 포함 내용, 사용 시점을 설명한다.

---

## Base Layer (00~04) — 항상 로드

### 00_master_prompt_v2.md (323줄)
**역할:** 프로젝트의 중심 계약서. 모든 문서가 이 파일을 기준으로 동작한다.

| 섹션 | 내용 |
|------|------|
| Design Philosophy | 앱 톤/느낌 정의 (금융 업무 도구, 데이터 중심) |
| Common Standards | 네이밍, 토큰 사용, 데이터 표현, 확장 절차, 인터랙션 규칙 |
| AppState | 전체 앱 상태 TypeScript 정의 (Category, Model, Modal 등) |
| Message Contract | User/AI 메시지 구조, 첨부파일 |
| Modal Contract | M1~M6 모달 목록 및 역할 |
| ShareRow | 버튼 통일 규칙 (크기, 색상 코딩) |
| Block 14종 ASCII | 각 블록의 시각 구조(ASCII art) + props 정의 |
| QA | 코드 생성 전 점검 항목 |

**사용 시점:** 모든 작업 전 반드시 읽기. 새 블록/모달/화면 추가 시 여기서 타입 정의부터.

---

### 01_design_v2.md (201줄)
**역할:** 디자인 토큰과 시각 규칙의 단일 출처(Single Source of Truth).

| 섹션 | 내용 |
|------|------|
| Color | 5색 기본 토큰 + 용도 설명 |
| Gray Scale | gray-50~900 hex값 + 용도 |
| Semantic Token | Light/Dark 모드 대응 테이블 |
| Shadow / Opacity | 그림자, 투명도 토큰 |
| Typography | 9단계 타이포 스케일 (용도별 크기/굵기/폰트) |
| Font Rule | ⚠️ CRITICAL: 한글=Noto Sans KR, Inter 한글 금지 |
| Spacing / Radius | 값별 사용 기준 (4=인라인, 8=요소내 ...) |
| Component Specs | Sidebar, Header, NumberStat, Table, Modal, Chart 수치 |
| Sidebar Icons | 9개 아이콘 목록 + 동작 |
| Component State | Button/Input/Table Row/Toast 상태별 스타일 |
| Responsive | Breakpoint 4단계 + Sidebar collapse 규칙 |
| Animation | 대상별 duration/easing |

**사용 시점:** 색상, 크기, 간격, 폰트 등 시각적 값을 결정할 때. 다른 문서에서 `→ 01_design#` 참조.

---

### 02_react_prompt_v2.md (81줄)
**역할:** React 코드 구조와 개발 패턴 정의.

| 섹션 | 내용 |
|------|------|
| Folder | 11개 폴더 구조 + 각 역할 |
| Core Components | 9개 핵심 컴포넌트 목록 |
| Rendering Order | AI 응답 렌더링 순서 |
| Hooks | 4개 커스텀 훅 |
| BlockRenderer | 블록 렌더링 switch + 확장 체크리스트 |
| ShareRow Handler | 4개 핸들러 + 색상 토큰화 규칙 |
| Modal Rule | ESC/outside click/focus return |
| Error/Loading/Empty | 상황별 UI 패턴 테이블 |
| Theme | ThemeProvider, useTheme, CSS 변수 규칙 |
| Output Mode | HTML / Pencil.dev / Figma 3종 |

**사용 시점:** React 코드 생성/수정 시. 폴더 구조, 컴포넌트 네이밍, 에러 처리 방식 확인.

---

### 03_design_spec_v2.md (203줄)
**역할:** 화면별 상세 스펙. "무엇을 어디에 어떻게 배치하는가"를 정의.

| 섹션 | 내용 |
|------|------|
| Page Structure | 전체 레이아웃 ASCII (Sidebar + Header + ChatArea + InputBar) |
| S0 Welcome | 환영 화면 콘텐츠 (로고, 카테고리 Pills, 추천 질문) |
| S1~S6 | 각 화면별 블록 조합 + 주의사항 |
| 화면 전환 조건 | Category → Screen 매핑 테이블 |
| Message Bubble | User/AI 버블 디자인 (색상, radius, 간격) |
| InputBar | 내부 구조 (첨부/입력/전송 버튼) |
| Category Pills | 상태별 디자인 (default/selected/hover) |
| SubPanel | 슬라이드 패널 구조 (recent/report/settings) |
| State Screens | Loading(●●●), Error, Empty 상태 |
| Modal M1~M6 | 각 모달 내부 레이아웃 ASCII |
| 텍스트 줄바꿈 규칙 | 1줄 표시 우선, ellipsis 처리 |

**사용 시점:** 특정 화면을 디자인/구현할 때. "S2 만들어줘" 같은 지시에 이 파일 참조.

---

### 04_figma_optimize_v2.md (105줄)
**역할:** Figma Plugin API / Pencil.dev 작업 시 구현 규칙과 과거 교훈.

| 섹션 | 내용 |
|------|------|
| Font Loading | ⚠️ CRITICAL: loadFontAsync 필수, 빈칸 렌더링 방지 |
| Height Rule | ⚠️ CRITICAL: y 추정 금지, 2-pass 필수 |
| Auto Layout | gap/padding 구체값 |
| Verify 3종 세트 | 오버랩/오버플로우/클리핑 검증 |
| Component Naming | Figma 레이어/Variable/Style 네이밍 규칙 |
| Lessons 테이블 | 과거 이슈 8건 (severity별 원인+규칙) |
| Pencil.dev Mode | .pen 파일 생성 규칙 |
| Design↔Code Mapping | Figma 컴포넌트 ↔ React 파일 매핑 테이블 |

**사용 시점:** Figma 또는 Pencil.dev로 디자인 생성 시. 반드시 Lessons 테이블 확인 후 작업.

---

## Feature Layer (05~) — 필요 시 로드

### 05_excel_editor_v1.md (139줄)
**역할:** 스프레드시트 사이드 패널 기능 스펙.

| 섹션 | 내용 |
|------|------|
| AppState 연동 | SubPanel 공존 규칙 (동시 오픈 불가) |
| ISpreadsheetEngine | 어댑터 패턴 인터페이스 전체 |
| Engine 비교 | SpreadJS / jspreadsheet / HTMLTable |
| React Component | Props, State 정의 |
| 툴바/수식바/시트탭 | 버튼 목록, 레이아웃 ASCII |
| 컨텍스트 메뉴 | 우클릭 메뉴 항목 |
| 키보드 단축키 | Ctrl+C/V/Z 등 |
| 역할 분담 | 외부 라이브러리 vs React 담당 구분 |

**사용 시점:** Excel 편집 기능을 추가/수정할 때만.

---

### 06_feature_template.md (32줄)
**역할:** 신규 기능 추가 시 사용하는 체크리스트 템플릿.

포함 항목: 영향 범위, AppState 변경, 신규 요소, 디자인 체크(폰트/줄바꿈/높이/너비), 재사용 목록, QA

**사용 시점:** 새 기능을 기획/설계할 때 복사하여 사용.

---

### 07_changelog.md (13줄)
**역할:** 문서 변경 이력 추적.

형식: `날짜 | 파일 | 변경 내용` 테이블

**사용 시점:** 문서 수정 후 기록. 어떤 버전에서 무엇이 바뀌었는지 추적.

---

## 3-Tier 로딩 가이드

문서 내 각 섹션에 `[Core]` `[Visual]` `[Context]` 태그가 있다.

```
스크린샷 + Figma 있음  → [Core] 섹션만 (~600줄)
스크린샷만 있음        → [Core] + [Visual] (~970줄)
완전 제로 레퍼런스     → 전부 (~1,151줄)
```

## 문서 간 참조 관계

```
README.md ─── 읽는 순서 + 규칙
    │
    ├── 00_master ─── 공통 표준 (모든 문서의 기준점)
    │     │
    │     ├── 01_design ← 토큰 값 참조
    │     ├── 02_react ← 네이밍/색상 규칙 참조
    │     └── 03_spec ← Modal/Block 계약 참조
    │
    ├── 01_design ─── 시각 토큰
    │     │
    │     ├── 04_figma ← 폰트/정렬 규칙 구현 방법 참조
    │     └── 03_spec ← 색상/간격 값 참조
    │
    ├── 04_figma ─── Figma/Pencil 구현
    │     └── Lessons ← 01_design, 00_master cross-ref
    │
    ├── 05~07 ─── Feature Layer (base 참조, base 수정 안 함)
    │
    └── 10~13 ─── Workflow Layer (업무흐름도)
          ├── 10_엑셀_편집기_업무흐름도 ← 05_excel_editor 참조
          ├── 11_엑셀_분석기_업무흐름도 ← AI_챗봇_응답블록_가이드 + 03_spec 참조
          ├── 12_이메일_미리보기_전송_업무흐름도 ← 03_spec (M3/M5/M6) 참조
          └── 13_MMS_카카오_알림톡_업무흐름도 ← 03_spec (M3/M7/M8) 참조
```

---

## Workflow Layer (10~) — 업무흐름도

### 10_엑셀_편집기_업무흐름도.md
**역할:** 엑셀 편집기의 사용 의도/동기/업무 시나리오/상세 동작 흐름도.

| 섹션 | 내용 |
|------|------|
| 사용 의도 및 동기 | 왜 쓰는가, 어떤 업무 상황에서 쓰는가 |
| 메인 업무흐름도 | 패널 오픈 → 편집 → 서식 → 시트 → 내보내기 → 닫기 (Mermaid) |
| 셀 편집 흐름 | 셀 선택 → 편집 모드 → 값/수식 입력 → 확정 |
| 서식 적용 흐름 | 범위 선택 → 도구바 클릭 → 스타일 적용 |
| 시트 관리 흐름 | 전환/추가/이름변경/삭제/복제 |
| 정렬/필터 흐름 | 컨텍스트 메뉴 → 정렬/필터 실행 |
| 내보내기 흐름 | 다운로드/이메일/모바일/클립보드 4채널 |
| 키보드 단축키 상태도 | 일반/편집/범위선택/컨텍스트메뉴 상태 전환 |
| 에러 처리 | 8가지 예외 상황 및 대응 |

**사용 시점:** 엑셀 편집기 기능을 개발하거나 QA할 때.

---

### 11_엑셀_분석기_업무흐름도.md
**역할:** AI 데이터 분석기의 사용 의도/6종 질의 흐름/블록 렌더링/후속 액션 흐름도.

| 섹션 | 내용 |
|------|------|
| 사용 의도 및 동기 | 왜 쓰는가, 기존 방식 대비 장점, 6가지 업무 시나리오 |
| 메인 업무흐름도 | 질의 입력 → 분류 → AI 처리 → 렌더링 → 사후 액션 (Mermaid) |
| P1~P6 질의별 흐름 | 6종 각각의 블록 조합, 프로그레스 필, ShareRow |
| 블록 렌더링 파이프라인 | BlockRenderer type별 분기 흐름 |
| 화면 전환 상태도 | S0~S6 화면 전환 조건 (stateDiagram) |
| 프로그레스 필 흐름 | 질의 유형별 필 메시지 + 표시 순서 |
| ShareRow 후속 업무 | btnType별 버튼 → 모달/API 연동 흐름 |
| 에러 처리 | 12가지 예외 상황 및 대응 |

**사용 시점:** AI 분석 기능을 개발하거나 질의 유형별 블록 조합을 확인할 때.

---

### 12_이메일_미리보기_전송_업무흐름도.md
**역할:** 이메일 미리보기 모달(M5) 수정안의 전송 흐름/첨부파일 관리/받는 사람 드롭다운 흐름도.

| 섹션 | 내용 |
|------|------|
| 사용 의도 및 동기 | 왜 쓰는가, 4가지 업무 시나리오 |
| 진입 경로 | 답변화면 → [공유하기] → M3 → M5 (Mermaid) |
| 메인 업무흐름도 | M3 → M5 → M6 전체 흐름, 받는 사람/첨부 처리 포함 |
| 상태 다이어그램 | 모달 상태 전이 (stateDiagram) |
| 컴포넌트 구조 | App → Modal → Email 컴포넌트 트리 |
| 데이터 흐름 | EmailPayload, Contact, AttachmentState TypeScript |
| PDF/Excel 자동 생성 흐름 | html-to-image + jsPDF, SheetJS 파이프라인 |
| 사용자 첨부파일 추가 흐름 | 파일 추가 메뉴 3가지 소스 + 검증 |
| 받는 사람 선택 흐름 | 드롭다운 + 직접입력 + 키보드 탐색 |
| 전송 검증 규칙 | 4가지 검증 항목 |
| 라이브러리 의존성 | html-to-image, jspdf, xlsx, file-saver |
| 파일 구조 | src 폴더 구조 |
| 디자인 토큰 | 모달/입력/버튼/첨부 스펙 |
| 에러 처리 | 7가지 예외 상황 |
| 향후 확장 | 다중 수신자, CC/BCC, 예약 발송 등 |

**사용 시점:** 이메일 전송 기능 개발 시.

---

### 13_MMS_카카오_알림톡_업무흐름도.md
**역할:** MMS 발송(M7) / 카카오 알림톡(M8) 전송 흐름 + 수신자 상세 내용 확인 답변 화면.

| 섹션 | 내용 |
|------|------|
| 사용 의도 | 채널별 사용 동기 (MMS vs 카카오 알림톡) |
| 진입 경로 | M3 → M7 또는 M8 분기 (Mermaid) |
| 메인 업무흐름도 | MMS/카카오 병렬 흐름, 검증, 완료 모달 |
| 수신자 측 흐름 | 메시지 수신 → [상세 내용 확인] → DetailView |
| 상태 다이어그램 | M7/M8 상태 전이 + 수신자 측 흐름 |
| MMS 발송 상세 | MMSPayload, 본문 포맷, 이미지 생성 파이프라인 |
| 카카오 알림톡 상세 | AlimtalkPayload, 고정 템플릿, 미리보기 UI |
| 상세 내용 확인 → 답변 화면 | 라우팅 (URL, 딥링크), 화면 구성 |
| 수신자 선택 드롭다운 | MMS/카카오 연락처 드롭다운 차이점 |
| 에러 처리 | 10가지 예외 상황 (채널별) |
| 컴포넌트 구조 | ShareModal → MMS/KK → PhoneMockup + DetailView |
| 파일 구조 | src 폴더 구조 (pages/DetailView 포함) |
| 디자인 토큰 | 폰 목업, 카카오 색상 (#BFD9BA, #FDE935, #FFF8D1, #4876EB) |
| 향후 확장 | 다중 수신자, 발송 이력, 예약 발송, 친구톡 등 |

**사용 시점:** MMS/카카오 알림톡 기능 개발 또는 수신자 상세 화면 구현 시.
