# apps 추가 수정 사항 (2026-03-31 ~ 2026-04-01)

> 연구소에서 apps 코드를 받은 이후 추가로 수정한 내용
> `packages/bragent`는 우리 관리 영역이므로 여기에 기재하지 않음

---

## 1. useSearchStreamMutation.ts — text-only 응답 markdown 블록 감싸기

**경로**: `apps/client/src/hooks/search/useSearchStreamMutation.ts`

### 문제
`report_quvi` 응답에서 `blocks` 배열 없이 `text`만 내려오는 경우, 화면에 마크다운이 렌더링되지 않고 plain text로 표시됨 (줄바꿈, 볼드 등 깨짐)

### 수정 (259행 부근, `blocks.length > 0` 체크 직전에 추가)
```typescript
// report_quvi: blocks 없고 text만 있으면 markdown 블록으로 감싸기
if (blocks.length === 0 && agentType === 'report_quvi' && aqr?.text) {
  blocks = [{ type: 'markdown', content: aqr.text }];
}
```

---

## 2. AIResponse.tsx — FAQ 출처에 section + page 표시

**경로**: `apps/client/src/components/answers/aiResponse/AIResponse.tsx`

### 문제
FAQ 출처 태그에 `title`만 표시되고, `section`과 `page` 정보가 누락됨

### 수정 (225~228행)
```diff
- <span key={i} className="text-xs px-2 py-1 bg-white border rounded text-gray-600">
-   {typeof src === 'string' ? src : src.title ?? src.source ?? JSON.stringify(src)}
- </span>
+ <span key={i} className="text-xs px-2 py-1 bg-white border rounded text-gray-600">
+   {typeof src === 'string' ? src : [
+     src.title ?? src.source,
+     src.section,
+     src.page != null ? `P.${src.page}` : null
+   ].filter(Boolean).join(' > ')}
+ </span>
```

### 결과 예시
- section 있을 때: `[사용자메뉴얼] 통합계좌조회 > 조회방법 > P.13`
- section 없을 때: `[사용자메뉴얼] 통합계좌조회 > P.13`
- page도 없을 때: `[사용자메뉴얼] 통합계좌조회`

---

## 3. AIResponse.tsx — Excel 내보내기 버튼 제거

**경로**: `apps/client/src/components/answers/aiResponse/AIResponse.tsx`

### 수정
보고서 하단 Excel 내보내기 버튼 제거 (PDF 내보내기만 유지)

---

## 4. useSearchStreamMutation.ts — tool_results 파싱 추가

**경로**: `apps/client/src/hooks/search/useSearchStreamMutation.ts`

### 수정
`agent_query_result.result.tool_results`를 `bragent_tool_results`로 저장

```typescript
if (aqr?.tool_results && Array.isArray(aqr.tool_results) && aqr.tool_results.length > 0) {
  bragentExtra.bragent_tool_results = aqr.tool_results;
}
```

---

## 5. AIResponse.tsx — ToolDataRequery 컴포넌트 연동

**경로**: `apps/client/src/components/answers/aiResponse/AIResponse.tsx`

### 수정
- `BlockRenderer`의 children으로 `ToolDataRequery` 렌더링 (보고서 카드 내부, 푸터 앞)
- `data-export-exclude` 속성으로 PDF 출력에서 제외
- PDF 내보내기 버튼에도 `data-export-exclude` 추가
- `exportExcel` import 제거

### 연구소 참고사항

**응답 구조 변경** — `agent_query_result.result`에 `tool_results` 필드 추가됨:

```json
{
  "agent_query_result": {
    "result": {
      "text": "...",
      "blocks": [...],
      "tool_results": [{
        "name": "post_query_data",
        "rowCount": 6,
        "args": { "fromDate": "20260301", "toDate": "20260401" },
        "rows": [{ "com_nm": "씨앤에스", ... }],
        "column_metadata": [{ "column": "com_nm", "type": "varchar", "label": "회사명", ... }]
      }]
    }
  }
}
```

- `rows` + `column_metadata`가 직접 포함되므로 별도 API 호출 불필요
- 연구소 백엔드는 응답 그대로 프론트에 전달하면 됨

**연구소 프론트 사용법:**

```tsx
import { ToolDataRequery } from "@packages/bragent";
import type { PostQueryToolResult } from "@packages/bragent";

const toolResults: PostQueryToolResult[] =
  data.agent_query_result.result.tool_results ?? [];

<ToolDataRequery postQueryResults={toolResults} />
```

**의존성** — `ToolDataRequery` 내부에서 `exceljs`를 dynamic import하므로:
```bash
npm install exceljs
```
