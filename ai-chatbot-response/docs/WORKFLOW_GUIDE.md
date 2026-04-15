# BranchQ 워크플로우 가이드

## 1. 파이프라인 개요

```
MD 스펙 작성 → HTML 미리보기 → React 코드 구현 → 브라우저 테스트 → 개발자 전달 (ZIP)
```

| 단계 | 도구 | 산출물 |
|------|------|--------|
| 설계 | MD 파일 (00~04) | 타입 정의, 디자인 토큰, 화면 스펙 |
| 미리보기 | branch_ui_generator_v27.html | HTML/Pencil/Figma 프롬프트 |
| 블록 편집 | report_block_editor_v2.html | 리포트 JSON 데이터 |
| 구현 | React + Vite + Tailwind | 동작하는 프론트엔드 |
| 테스트 | 브라우저 (localhost:5173) | QA 검증 완료 |
| 전달 | npm run handoff | ZIP 패키지 |

---

## 2. MD 스펙 읽는 순서

| 순서 | 파일 | 핵심 내용 |
|------|------|----------|
| 1 | `00_master_prompt_v2.md` | 명명 규칙, AppState 타입, 블록 14종 계약, 모달 M1~M6 |
| 2 | `01_design_v2.md` | 색상 토큰, 타이포그래피, 간격, 그림자, 반응형 |
| 3 | `03_design_spec_v2.md` | S0~S6 화면 레이아웃, 메시지 버블, InputBar, SubPanel |
| 4 | `02_react_prompt_v2.md` | 폴더 구조, 컴포넌트 아키텍처, BlockRenderer 패턴 |
| 5 | `AI_챗봇_응답블록_가이드.md` | 15개 블록 JSON 스키마, 6개 씬 타입 조합 |

### 핵심 규칙
- **폰트**: 한국어 = Noto Sans KR, 숫자 = Inter (절대 불변)
- **색상**: --brq-* CSS 변수 사용, hex 하드코딩 금지
- **레이아웃**: Sidebar(70px) + Header(56px) + ChatArea(flex) + InputBar(56px)
- **블록**: 14종 고정, props 불변, 확장만 가능

---

## 3. HTML 미리보기 도구

### branch_ui_generator_v27.html
- 메뉴 구조 (GNB, Sidebar) 정의
- 필드, 그리드, 버튼 스펙 입력
- 출력 탭: HTML / Pencil.dev / Figma / Diff

### report_block_editor_v2.html
- 블록 단위 리포트 편집기
- JSON 입출력 (report_output.json)
- 40+ 블록 타입 실시간 미리보기

---

## 4. React 개발 가이드

### 프로젝트 실행
```bash
cd ai-chatbot-response
npm install
npm run dev        # http://localhost:5173
npm run build      # 프로덕션 빌드
```

### 폴더 구조
```
src/
├── types/       → 타입 정의 (Block, Message, AppState)
├── constants/   → 카테고리, 모델, 토큰 상수
├── data/        → 목업 씬 데이터
├── utils/       → 포맷 유틸 (통화, 날짜, 퍼센트)
├── layout/      → Sidebar, Header, InputBar, AppLayout
├── chat/        → ChatArea, MessageBubble, WelcomeScreen, ShareRow
├── blocks/      → BlockRenderer + 15개 블록 컴포넌트
├── modals/      → ModalOverlay + M1~M6
├── hooks/       → useChatState, useModalState, useSubPanelState, useToast
├── components/  → SubPanel, Toast
└── App.tsx      → 메인 앱 (전체 조립)
```

### 새 블록 추가 체크리스트
1. `src/types/index.ts`에 data 인터페이스 + Block 유니온 추가
2. `src/blocks/` 폴더에 컴포넌트 파일 생성
3. `src/blocks/BlockRenderer.tsx` switch case 추가
4. `src/data/mockScenes.ts`에 샘플 데이터 추가
5. `00_master_prompt_v2.md`에 ASCII + props 문서화

---

## 5. 브라우저 테스트 시나리오

### S0: Welcome 화면
- [ ] BranchQ 로고 + "무엇을 도와드릴까요?" 표시
- [ ] 카테고리 필 5개 렌더링 (일반질의, 분석, 예측, 이상거래, 상담)
- [ ] 추천 질문 4개 카드 표시 → 클릭 시 대화 시작

### S1: 일반질의
- [ ] User 메시지 버블 (우측, 파란색)
- [ ] AI 응답: TextContent + DataTable + RelatedQuestions
- [ ] 테이블: 컬럼 정렬, 배지 색상, 금액 우측정렬
- [ ] ShareRow: PDF + 공유 버튼

### S2: 분석
- [ ] ReportHeader: 카테고리 배지 + 제목 + 부제 + 날짜
- [ ] NumberStat: 4개 카드, 값(Inter 28px Bold), diff(녹/적)
- [ ] PatternAnalysis: critical(빨강), warning(노랑), normal(초록)
- [ ] DataTable + AlertBox + BarChart

### S3: 예측
- [ ] ReportHeader + DataTable (분기별)
- [ ] Callout: important 타입 (좌측 보더)
- [ ] BarChart: 월별 추이

### S4: 이상거래
- [ ] DataTable: 배지(위험/주의/정상) + 점수(90+ 빨강, 80+ 주황, <80 파랑)
- [ ] ShareRow: "신고하기" (빨간색)

### S5: 상담
- [ ] TextContent + Steps (번호 원형 + 연결선)
- [ ] SourceBox: 다운로드 아이콘 + 링크
- [ ] ShareRow: "다운로드" (파란색)

### S6: 보고서
- [ ] ApprovalBox: 작성자/검토/승인 수평 셀
- [ ] ReportHeader + NumberStat + DataTable + BarChart + AlertBox
- [ ] ShareRow: "저장" (파란색)

### 모달 테스트
- [ ] M1: GPT-4 버튼 클릭 → AI 모델 선택 모달
- [ ] M3: 공유 버튼 → 4가지 옵션 그리드
- [ ] M5: 이메일 → 받는사람/제목/내용 폼
- [ ] M6: 신고하기 → 확인 다이얼로그
- [ ] 공통: ESC 닫기, 외부 클릭 닫기

### SubPanel 테스트
- [ ] 사이드바 "최근" → 슬라이드 인, 대화 목록
- [ ] 사이드바 "설정" → 토글 스위치
- [ ] 닫기 → 슬라이드 아웃, ChatArea 복원

### 반응형
- [ ] Desktop (1280px+): 전체 레이아웃
- [ ] Tablet (768px): 사이드바 축소 (아이콘만)
- [ ] Mobile (640px-): 사이드바 숨김, 햄버거 메뉴

---

## 6. 개발자 전달 절차

```bash
# 1. 빌드 테스트
npm run build

# 2. ZIP 패키지 생성
npm run handoff

# 3. 결과 확인
# → BranchQ_Handoff_YYYYMMDD.zip 생성됨
```

### ZIP 내용물
- `src/` — 전체 React 소스코드
- `docs/specs/` — MD 설계 문서 5개
- `docs/WORKFLOW_GUIDE.md` — 이 가이드
- `README.md` — 설치/실행 안내
- `package.json`, `vite.config.ts`, `tsconfig*.json`

---

## 7. 블록 타입 빠른 참조

| 타입 | 용도 | 핵심 props |
|------|------|-----------|
| text-content | 본문 텍스트 | text |
| report-header | 리포트 헤더 | category, title, subtitle, date |
| number-stat | 핵심 수치 카드 | items[{label, value, diff, trend}] |
| summary-cards | 요약 카드 | cards[{label, value, sub}] |
| data-table | 데이터 테이블 | columns, rows, title |
| bar-chart | 막대 차트 | data[{label, value}], title |
| line-chart | 선 차트 | series, labels, title |
| alert-box | 경고 박스 | level, title, message |
| callout | 콜아웃 | type, title, text |
| pattern-analysis | 패턴 분석 | items[{level, title, description}] |
| steps | 단계 가이드 | items[{title, description}] |
| key-value | 키-값 목록 | items[{key, value}] |
| approval-box | 결재선 | lines[{role, name}] |
| source-box | 출처 정보 | links[{name, description}], downloadable |
| related-questions | 관련 질문 | items[] |
| date-range | 기간 선택 | startDate, endDate, reQueryLabel |
