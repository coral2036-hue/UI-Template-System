# BranchQ 개발자 가이드

## 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [설치 및 실행](#2-설치-및-실행)
3. [아키텍처](#3-아키텍처)
4. [디자인 시스템](#4-디자인-시스템)
5. [컴포넌트 상세](#5-컴포넌트-상세)
6. [상태 관리](#6-상태-관리)
7. [블록 시스템](#7-블록-시스템)
8. [모달 시스템](#8-모달-시스템)
9. [확장 가이드](#9-확장-가이드)
10. [트러블슈팅](#10-트러블슈팅)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 이름 | BranchQ AI 챗봇 프론트엔드 |
| 용도 | K-Branch 기업자금관리 AI 어시스턴트 UI |
| 스택 | React 19 + TypeScript 5.9 + Vite 8 + Tailwind CSS v4 |
| 아이콘 | lucide-react |
| 상태관리 | React Hooks + Context (Redux 미사용) |

## 2. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 (HMR)
npm run dev          # → http://localhost:5173

# 타입 체크
npx tsc --noEmit

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 개발자 전달 ZIP 생성
npm run handoff
```

## 3. 아키텍처

### 폴더 구조
```
src/
├── types/index.ts       ← 전체 타입 정의 (Block, Message, AppState)
├── constants/
│   ├── categories.ts    ← 5개 카테고리 + 사이드바 네비
│   └── models.ts        ← AI 모델 목록
├── data/
│   └── mockScenes.ts    ← 6개 씬 목업 데이터
├── utils/
│   ├── formatCurrency.ts ← "1,234,567원"
│   ├── formatDate.ts     ← "YYYY.MM.DD"
│   └── formatPercent.ts  ← "12.5%"
├── layout/
│   ├── AppLayout.tsx    ← 전체 셸 (sidebar + header + main + inputbar)
│   ├── Sidebar.tsx      ← 좌측 70px, 네비 + 카테고리
│   ├── Header.tsx       ← 상단 56px, 로고 + 드롭다운 + 모델
│   └── InputBar.tsx     ← 하단 56px, 첨부 + 입력 + 전송
├── chat/
│   ├── ChatArea.tsx     ← 메시지 스크롤 영역 (max-w 800px)
│   ├── MessageBubble.tsx ← User/AI 메시지 렌더링 + 블록
│   ├── WelcomeScreen.tsx ← S0 초기 화면
│   ├── ShareRow.tsx     ← btnType별 액션 버튼
│   └── TypingIndicator.tsx ← 로딩 점 애니메이션
├── blocks/
│   ├── BlockRenderer.tsx ← 블록 타입 → 컴포넌트 라우팅
│   └── [15개 블록].tsx  ← 각 블록 컴포넌트
├── modals/
│   ├── ModalOverlay.tsx ← 공통 오버레이 (Portal, ESC, 포커스)
│   ├── ModelSelectModal.tsx  ← M1
│   ├── ShareModal.tsx        ← M3
│   ├── EmailModal.tsx        ← M5
│   └── ConfirmModal.tsx      ← M6
├── hooks/
│   ├── useChatState.ts       ← 메시지, 로딩, 카테고리, 모델
│   ├── useModalState.ts      ← 모달 열기/닫기
│   ├── useSubPanelState.ts   ← 패널 토글
│   └── useToast.ts           ← 토스트 알림
├── components/
│   ├── SubPanel.tsx     ← 우측 320px 슬라이드
│   └── Toast.tsx        ← 우상단 알림
└── App.tsx              ← 메인 앱 (전체 조립)
```

### 데이터 흐름
```
App.tsx
 ├── useChatState() ──→ messages[], loading, selectedCategory
 ├── useModalState() ──→ modal type
 ├── useSubPanelState() ──→ panel type
 ├── useToast() ──→ toast state
 │
 ├── Sidebar ←── onCategorySelect → loadScene(category)
 ├── Header ←── onSceneSelect → loadScene(scene)
 │               onModelClick → openModal('model-select')
 ├── ChatArea / WelcomeScreen ←── messages, loading
 │   └── MessageBubble
 │       ├── BlockRenderer → 15개 블록 컴포넌트
 │       └── ShareRow ←── onShareAction → openModal / showToast
 ├── InputBar ←── onSend → sendMessage(text)
 ├── SubPanel ←── type → recent/report/settings
 ├── Modals ←── modal state → M1/M3/M5/M6
 └── Toast ←── toast state
```

### 화면 전환 로직
```
messages.length === 0  →  S0 (WelcomeScreen)
messages.length > 0    →  ChatArea (블록 조합은 카테고리에 따라)

카테고리 → 씬 매핑:
  general  → S1 (TextContent + DataTable + RelatedQuestions)
  analysis → S2 (ReportHeader + NumberStat + PatternAnalysis + ...)
  forecast → S3 (DataTable + Callout + BarChart)
  anomaly  → S4 (DataTable with badges + scores)
  consult  → S5 (Steps + SourceBox)
  report   → S6 (ApprovalBox + ReportHeader + NumberStat + ...)
```

## 4. 디자인 시스템

### 색상 토큰 (index.css)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-brq-primary` | #1E293B | 사이드바 배경 |
| `--color-brq-accent` | #2563EB | 버튼, 링크, 선택 상태 |
| `--color-brq-success` | #16A34A | 상승, 정상 |
| `--color-brq-warning` | #CA8A04 | 주의 |
| `--color-brq-error` | #DC2626 | 위험, 하락 |
| `--color-brq-gray-50` ~ `900` | 11단계 | 배경, 텍스트, 보더 |

### 폰트 규칙 (절대 규칙)
| 대상 | 폰트 | CSS 클래스 |
|------|-------|-----------|
| 한국어 텍스트 | Noto Sans KR | 기본 (body) |
| 숫자/영문 값 | Inter | `.font-number` |
| 혼합 (한+숫자) | Noto Sans KR | 기본 |

### 간격 규칙
| 값 | 용도 |
|-----|------|
| 4px | 아이콘-텍스트 |
| 8px | 요소 내부 |
| 12px | 블록 내부 그룹 |
| 16px | 블록 간 간격 |
| 24px | 섹션 패딩 |

### 반경
| 값 | 대상 |
|-----|------|
| 4px | 인풋, 배지 |
| 6px | 카드, 칩 |
| 8px | 모달, 블록 |
| 20px | 알약 버튼, InputBar |

## 5. 컴포넌트 상세

### Layout 컴포넌트

**Sidebar** (70px)
- 상단: 새 채팅, 최근, 리포트, 설정 (SubPanel 토글)
- 하단: 5개 카테고리 (씬 전환)
- 반응형: md → 48px (아이콘만), sm → hidden

**Header** (56px)
- 좌: 햄버거(모바일) + "BranchQ" + 씬 드롭다운 + 모델 버튼
- 우: 도움말 + 알림

**InputBar** (56px)
- 첨부(40x40) + 텍스트 입력(flex-1, r20) + 전송(40x40, r20)
- Enter 전송, 비활성: 빈 텍스트 또는 로딩 중

### Chat 컴포넌트

**MessageBubble**
- User: 우측, bg accent, 흰색 텍스트, r(16,4,16,16)
- AI: 좌측, bg 흰색, border gray-200, r(4,16,16,16)
  - 구조: aiText → Blocks (gap-4) → ShareRow

**ShareRow** (btnType별)
| btnType | 버튼 |
|---------|------|
| general | PDF + 공유 |
| report | PDF + 공유 |
| report-save | 저장(blue) + PDF + 공유 |
| anomaly | 신고하기(red) + 공유 |
| consult | 다운로드(blue) + 공유 |

## 6. 상태 관리

### useChatState
```typescript
{ messages, loading, selectedCategory, selectedModel,
  sendMessage, selectCategory, selectModel, loadScene, clearMessages }
```
- `sendMessage(text)` → UserMessage 추가 → 1.2초 후 AIMessage (목업)
- `loadScene(key)` → 프리셋 대화 로드

### useModalState
```typescript
{ modal, openModal, closeModal }
```
- `modal`: null | 'model-select' | 'share' | 'email' | 'confirm'

### useSubPanelState
```typescript
{ subPanel, openPanel, closePanel, togglePanel }
```
- `subPanel`: null | 'recent' | 'report' | 'settings'

### useToast
```typescript
{ toast, showToast, dismissToast }
```
- 자동 소멸: info/success 3초, warning/error 5초

## 7. 블록 시스템

### BlockRenderer 패턴
```typescript
// blocks/BlockRenderer.tsx
switch (block.type) {
  case 'data-table': return <DataTable {...block.data} />;
  case 'bar-chart': return <BarChart {...block.data} />;
  // ... 16개 타입 전수 처리
}
```

### 15개 블록 + 1 (date-range)
| # | 타입 | 컴포넌트 | 핵심 Props |
|---|------|---------|-----------|
| 1 | text-content | TextContent | `text` |
| 2 | report-header | ReportHeader | `category, title, subtitle, date` |
| 3 | number-stat | NumberStat | `items[{label, value, diff, trend}]` |
| 4 | summary-cards | SummaryCards | `cards[{label, value, sub}]` |
| 5 | data-table | DataTable | `columns, rows, title` |
| 6 | bar-chart | BarChart | `data[{label,value}], datasets?` |
| 7 | line-chart | LineChart | `series, labels` |
| 8 | alert-box | AlertBox | `level, title, message` |
| 9 | callout | Callout | `type, title, text` |
| 10 | pattern-analysis | PatternAnalysis | `items[{level, title, desc}]` |
| 11 | steps | Steps | `items[{title, description}]` |
| 12 | key-value | KeyValue | `items[{key, value}]` |
| 13 | approval-box | ApprovalBox | `lines[{role, name}]` |
| 14 | source-box | SourceBox | `links[], downloadable?` |
| 15 | related-questions | RelatedQuestions | `items[]` |
| 16 | date-range | DateRange | `startDate, endDate` |

### DataTable 특수 렌더링
- **Badge 컬럼** (`type: 'badge'`): `{text: "위험", color: "#DC2626"}` → 배경+텍스트 색상 알약
- **Score 컬럼** (`type: 'score'`): `{value: 95}` → 20px Bold, 색상: >=90 빨강, >=80 주황, <80 파랑
- **금액 컬럼** (`align: 'right'`): Inter Bold, 우측정렬

## 8. 모달 시스템

### 공통 규격 (ModalOverlay)
- Portal: `#modal-root` → `createPortal`
- 오버레이: black/50 + blur 4px
- 컨테이너: max-w 480px, radius 8, padding 24, shadow modal
- 닫기: ESC키, 외부 클릭, X 버튼
- 포커스: 열기 시 저장 → 닫기 시 복원
- 접근성: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

### 모달 목록
| ID | 타입 | 트리거 |
|----|------|--------|
| M1 | ModelSelectModal | Header 모델 버튼 |
| M3 | ShareModal | ShareRow "공유" |
| M5 | EmailModal | ShareModal → "이메일" |
| M6 | ConfirmModal | ShareRow "신고하기" |

## 9. 확장 가이드

### 새 블록 타입 추가
1. `src/types/index.ts` → data 인터페이스 정의 + Block 유니온 추가
2. `src/blocks/NewBlock.tsx` → 컴포넌트 구현
3. `src/blocks/BlockRenderer.tsx` → switch case 추가
4. `src/data/mockScenes.ts` → 목업 데이터에 샘플 추가
5. 테스트: 브라우저에서 해당 씬 확인

### 실제 API 연동
1. `src/hooks/useChatState.ts`의 `sendMessage` 내 setTimeout을 fetch로 교체
2. 응답 JSON 형식: `{ aiText?, blocks: Block[], btnType }`
3. `buildSceneMessages` 대신 API 응답을 직접 messages 배열에 추가

### 다크 모드
1. `src/index.css`에 `.dark` 셀렉터로 시맨틱 토큰 오버라이드
2. `src/hooks/useTheme.ts` → `html.classList.toggle('dark')` 추가
3. SubPanel 설정에서 토글 연결

## 10. 키워드 매칭 시스템

사용자 입력 → 자동 씬 매칭으로 실제 서비스와 유사한 대화를 구현합니다.

### 작동 원리
```
사용자 입력 → matchSceneByKeyword(text) → SceneKey → buildAIResponse(key) → AI 메시지
```

### 키워드 테이블 (`src/data/mockScenes.ts`)
| 키워드 | 매칭 씬 |
|--------|---------|
| 이상, 거래, 탐지, 위험, 신고 | anomaly (S4) |
| 분석, 리포트, 패턴, 추이 | analysis (S2) |
| 예측, 자금흐름, 예상, 전망 | forecast (S3) |
| 등록, 방법, 절차, 상담, 안내 | consult (S5) |
| 보고서, 작성, 분기, 결산 | report (S6) |
| 조회, 카드, 사용, 내역, 잔액 | general (S1) |
| (매칭 없음) | general (기본) |

매칭 로직: 키워드 포함 개수가 가장 높은 씬 선택 (동점 시 우선순위: 위가 높음)

### CategoryPillBar
- S0 Welcome + ChatArea 상단에 공통 카테고리 필 바 표시
- 대화 중에도 카테고리 전환 가능
- 컴포넌트: `src/chat/CategoryPillBar.tsx`

### 카테고리별 추천 질문
- `CATEGORY_QUESTIONS` 상수 → 카테고리 선택 시 관련 질문 3개 표시
- S0에서 카테고리 탭 전환 → 추천 질문 즉시 업데이트

## 11. 배포

자세한 내용은 `docs/DEPLOY_GUIDE.md` 참조.

```bash
# 정적 빌드 (dist/ 폴더 생성)
npm run build

# Vercel 배포
npx vercel --prod

# Netlify 배포
netlify deploy --prod --dir=dist

# ZIP 패키지 생성
npm run handoff
```

| 배포 대상 | 설정 파일 |
|----------|----------|
| 정적 서버 | `vite.config.ts` (base: './') |
| Vercel | `vercel.json` |
| Netlify | `netlify.toml` |

## 12. 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| 한글이 빈칸으로 표시 | Inter 폰트 사용 | Noto Sans KR로 변경 |
| 모달이 안 열림 | modal-root div 없음 | index.html 확인 |
| 블록이 안 보임 | BlockRenderer case 누락 | switch 문 확인 |
| 색상 불일치 | hex 하드코딩 | CSS 변수(--brq-*) 사용 |
| 숫자 폰트 다름 | font-number 클래스 누락 | `.font-number` 추가 |
| 타입 에러 | Block 유니온 미갱신 | types/index.ts 확인 |
