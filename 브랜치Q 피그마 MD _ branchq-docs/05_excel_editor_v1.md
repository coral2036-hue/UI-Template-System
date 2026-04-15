# BranchQ Excel Editor Design v1

## 위치: Feature Layer (base에 포함되지 않음)

## AppState 연동 [Core]
- Excel Panel은 SubPanel과 **동시 오픈 불가** — Excel 열면 SubPanel 닫힘
- AppState에 직접 포함하지 않음 — ExcelSidePanel 자체 state로 관리
- ChatArea와 공존: Excel 열리면 ChatArea width 축소 (body.paddingRight sync)

## Architecture: Adapter Pattern for Spreadsheet Engine

### ISpreadsheetEngine Interface
```typescript
interface ISpreadsheetEngine {
  init(container: HTMLElement, options: EngineOptions): void;
  destroy(): void;
  resize(): void;
  loadData(columns: Column[], rows: Row[]): void;
  getData(): { columns: Column[]; rows: Row[] };
  getCellValue(col: number, row: number): CellValue;
  setCellValue(col: number, row: number, value: CellValue): void;
  setCellFormula(col: number, row: number, formula: string): void;
  getSelection(): CellRange | null;
  setSelection(range: CellRange): void;
  setCellStyle(range: CellRange, style: CellStyle): void;
  getSheets(): SheetInfo[];
  addSheet(name: string): void;
  switchSheet(index: number): void;
  renameSheet(index: number, name: string): void;
  setColumnFilter(col: number, filter: FilterSpec): void;
  sortColumn(col: number, direction: 'asc' | 'desc'): void;
  toXlsx(): ArrayBuffer;
  toCsv(): string;
  on(event: SpreadsheetEvent, handler: Function): void;
  off(event: SpreadsheetEvent, handler: Function): void;
}
```

### Engine Options
```typescript
interface EngineOptions {
  readOnly?: boolean;
  showToolbar?: boolean;
  showFormulaBar?: boolean;
  showSheetTabs?: boolean;
  showScrollbars?: boolean;
  defaultFont?: string;
  defaultFontSize?: number;
}
```

## Engine Implementations
| Engine | License | Excel Compat | Formula | Cost |
|--------|---------|-------------|---------|------|
| SpreadJS | Commercial | 100% | 450+ | Paid |
| jspreadsheet | MIT | 70% | Basic | Free |
| HTMLTable | Custom | 30% | Manual | Free |

## React Component
```typescript
interface ExcelSidePanelProps {
  isOpen: boolean;
  columns: Column[];
  data: Row[];
  sheetName: string;
  filename: string;
  onClose: () => void;
}
```

## State
```typescript
width: number;        // 280~70vw
activeCell: CellRef;
formula: string;
selectedRange: CellRange;
sheets: Sheet[];
activeSheet: number;
isDirty: boolean;
exportMenuOpen: boolean;
toolbarState: ToolbarState;
```

## Resizer
- min 280px, max 70vw, init 50vw
- body.paddingRight sync
- hover: accent color

## 툴바 버튼 [Visual]
```
[B][I][U] | [좌][중][우] | [색상▼][배경▼] | [테두리▼] | [병합] | [Undo][Redo]
```
- 그룹: 서식(Bold/Italic/Underline), 정렬, 색상, 테두리, 셀 병합, 히스토리
- 크기: h=32 각 btn w=32, gap=4, 그룹 간 구분선
- 아이콘: Lucide 16px

## 수식바 [Visual]
```
[A1 ▼] [fx] [= SUM(A1:A10)]
```
- 셀 참조: w=80, 드롭다운
- fx 라벨: w=24
- 수식 입력: flex-1, h=28

## 시트 탭 [Visual]
```
[Sheet1] [Sheet2] [+] ← 하단, h=28, bg=gray-100
```
- active: bg=white, border-top=accent 2px
- 더블클릭: 이름 편집
- 우클릭: 삭제/복제 메뉴
- [+]: 새 시트 추가

## 셀 컨텍스트 메뉴 [Visual]
- 복사 / 붙여넣기 / 잘라내기
- 행 삽입 / 행 삭제
- 열 삽입 / 열 삭제
- 셀 서식
- 정렬 (오름차순/내림차순)
- 필터

## 키보드 단축키 [Core]
| 단축키 | 동작 |
|--------|------|
| Ctrl+C/V/X | 복사/붙여넣기/잘라내기 |
| Ctrl+Z/Y | Undo/Redo |
| Ctrl+B/I/U | Bold/Italic/Underline |
| Tab | 다음 셀 |
| Enter | 아래 셀 |
| Escape | 편집 취소 |
| F2 | 셀 편집 모드 |

## 핵심 원칙: 외부 라이브러리 역할 분담

### 외부 라이브러리(SpreadJS 등)가 담당
셀 편집, 수식 계산, 셀 서식, 셀 선택/드래그, 키보드 네비게이션, 복사/붙여넣기, Undo/Redo, 정렬/필터, 멀티시트, 스크롤바/가상 스크롤, Excel import/export, 수식 참조 하이라이트

### React가 담당
패널 열기/닫기, 리사이저 드래그, 서식 도구바 UI (→ engine API 호출), 수식바 UI, 시트 탭 UI, 내보내기 드롭다운 (다운로드/이메일/모바일/클립보드), isDirty 추적 (닫기 시 저장 확인), engine lifecycle (init/destroy via React ref)
