# BranchQ AI 챗봇 - 개발 가이드

## 프로젝트 개요
K-Branch 기업자금관리서비스의 AI 챗봇 프론트엔드 (React 19 + TypeScript + Vite + Tailwind CSS v4)

## 설계 문서 위치
모든 설계 문서는 `../브랜치Q 피그마 MD _ branchq-docs/` 폴더에 있습니다.

### 필수 참조 문서 (개발 전 반드시 읽을 것)
| 우선순위 | 파일 | 내용 |
|---------|------|------|
| 1 | `00_master_prompt_v2.md` | 공통 규약, 타입 정의, ShareRow, 모달 타입 |
| 2 | `01_design_v2.md` | 디자인 토큰 (색상, 폰트, 간격) |
| 3 | `03_design_spec_v2.md` | 화면 레이아웃, 모달 M1~M6 스펙 |
| 4 | `AI_챗봇_응답블록_가이드.md` | 블록 14종 JSON 스키마, 씬별 조합 |

### 기능별 업무흐름도
| 파일 | 기능 |
|------|------|
| `12_이메일_미리보기_전송_업무흐름도.md` | **이메일 미리보기 및 전송 (현재 개발 대상)** |
| `10_엑셀_편집기_업무흐름도.md` | 엑셀 편집기 |
| `11_엑셀_분석기_업무흐름도.md` | 보고서 빌더 |

## 현재 개발 과제: 이메일 미리보기 및 전송

### 핵심 요구사항
1. M5 이메일 전송 모달을 수정 → Q&A 답변화면 전체를 미리보기 렌더링
2. PDF, Excel 파일을 첨부파일로 자동 생성 및 등록
3. 받는 사람: 드롭다운 리스트 선택 + 직접 입력
4. 추가 첨부파일: 사용자가 직접 파일 추가 가능 (최대 5개, 10MB)

### 개발 순서
`12_이메일_미리보기_전송_업무흐름도.md`의 섹션 12 파일 구조를 따라 구현하세요.

**Phase 1: 기반**
- `src/types/index.ts` → 타입 정의
- `src/hooks/useModal.ts`, `useEmailForm.ts` → 상태 관리
- `index.html`에 `<div id="modal-root"></div>` 추가

**Phase 2: 모달**
- `src/components/modals/ModalOverlay.tsx` → createPortal 사용
- `src/components/modals/ShareModal.tsx` → M3
- `src/components/modals/ConfirmModal.tsx` → M6

**Phase 3: 핵심**
- `src/components/email/RecipientSelector.tsx` → 드롭다운 + 직접입력
- `src/components/email/QAPreviewRenderer.tsx` → Q&A 축소 렌더링
- `src/components/email/AttachmentManager.tsx` → 자동 + 추가 첨부
- `src/components/modals/EmailPreviewModal.tsx` → M5 조합

**Phase 4: 유틸리티**
- `src/utils/generatePdf.ts` → html-to-image + jsPDF
- `src/utils/generateExcel.ts` → SheetJS
- `src/utils/captureQAImage.ts` → DOM → PNG

**Phase 5: 통합**
- `src/components/ActionButtons.tsx` 수정 → onShareClick
- `src/App.tsx` 수정 → 모달 상태 + 렌더링

### 필요 라이브러리
```bash
npm install html-to-image jspdf jspdf-autotable xlsx file-saver
npm install -D @types/file-saver
```

### 디자인 규칙
- 한글 폰트: Noto Sans KR (Inter 사용 금지)
- 모달: max-w-480, radius-8, pad-24, shadow-modal
- 버튼: radius-20, min-w-90, h-36
- 색상: `01_design_v2.md` 참조

### 피그마 디자인 참조
- 파일: https://www.figma.com/design/moHy3BaQLmzoGcXTgbJeI1/
- 페이지: "4. 공유 기능 개발"
- 주요 프레임: M5-이메일미리보기-수정안, 받는사람-드롭다운, 첨부파일-추가기능
