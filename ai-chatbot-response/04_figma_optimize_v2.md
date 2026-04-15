# BranchQ Figma Optimize v2

## Utility First [Core]
loadFonts() → stackBlocks() → detectOverlaps()

## ⚠️ Font Loading (CRITICAL) [Core]
```
반드시 loadFontAsync({ family: "Noto Sans KR", style: "Regular" }) 선행
Inter 폰트로 한글 텍스트 설정 시 빈칸 렌더링 — 절대 금지
사례: 715개 노드를 수동 수정
```
- 한글 = Noto Sans KR (→ 01_design#font-rule)
- 숫자/영문 = Inter
- 혼합 폰트: 한 텍스트 노드에 한글+영문 혼합 불가 → 별도 노드로 분리

## ⚠️ Height Rule (CRITICAL) [Core]
- y 추정 금지
- node.height 읽기
- **2-pass 필수:**
  1. 노드 생성 + 임시 배치
  2. node.height 읽기 → 후속 노드 y 재계산
- 텍스트 블록 높이는 렌더링 전 알 수 없음
- 고정 y값 → 오버랩 100% 발생

## Auto Layout [Core]
| 항목 | 값 |
|------|-----|
| stackBlocks gap | 16 |
| section padding | 24 |
| block internal pad | 16~20 |
| message gap | 16 (다른 발신자) / 8 (같은 발신자) |

## Canvas [Core]
ROW1 ROW2 ROW3 constant

## ⚠️ Verify 3종 세트 (매 작업 후 필수) [Core]
- detectOverlaps() — 요소 간 겹침 없음
- checkOverflow() — 부모 프레임 밖 넘침 없음
- checkClipping() — 텍스트 잘림 없음
- → 스크린샷 촬영으로 시각 확인까지 완료

## DESC Rule [Core]
화면 확정 후 마지막 작성

---

## Component Naming [Core]
| 대상 | 규칙 | 예시 |
|------|------|------|
| 프레임 | 화면/역할 | `S2_Analysis`, `Header` |
| 블록 | Block/타입 | `Block/DataTable`, `Block/NumberStat` |
| 모달 | Modal/이름 | `Modal/Share`, `Modal/Email` |
| 아이콘 | Icon/이름 | `Icon/Settings`, `Icon/Alert` |
| Variable | 카테고리/이름 | `color/primary`, `spacing/md` |
| Style | 카테고리/이름 | `text/heading-1`, `fill/surface` |

## 반복 요소 처리 [Core]
- 테이블 row: Component Instance로 반복 (auto layout vertical)
- 차트 데이터: 실제 데이터 기반 비율 계산
- 카드 그리드: auto layout horizontal wrap

---

## ⚠️ Lessons (과거 이슈 레퍼런스) [Core]

| Severity | 이슈 | 원인 | 규칙 |
|----------|------|------|------|
| CRITICAL | 한글 빈칸 렌더링 | Inter가 한글 미지원 | loadFontAsync(Noto Sans KR) 필수 |
| CRITICAL | 오버랩 발생 | 고정 y값 사용 | 2-pass: 생성→높이읽기→재배치 |
| CRITICAL | 혼합 폰트 불가 | Plugin API 제약 | 한글/영문 노드 분리 |
| HIGH | 수평 겹침(3회 반복) | width 미지정 | 수평 공존 요소 width 필수 (→ 01_design#responsive) |
| HIGH | ROW 충돌 | 좌표 미재계산 | ROW 변경 시 전체 좌표 재계산 |
| MEDIUM | 차트 라벨 틀어짐 | 수동 x값 | 수학적 센터링 (→ 01_design#chart) |
| MEDIUM | 색상 하드코딩 | 토큰 미사용 | 토큰 참조만 허용 (→ 00_master#color-token) |
| LOW | 인증 만료 | 장시간 작업 | 단계별 저장 권장 |

---

## Pencil.dev Mode [Core]
v25+ 추가. .pen 파일 리소스 맵 생성:
- buildPencilMcpBlock(): 컴포넌트 ID + variable token 맵
- buildPencilMcpCode(): batch_design 코드 생성
- 메뉴별: GNB, sidebar, query, grid, sample data, pagination
- 대시보드: KPI cards, card grids, Quick Actions
- 로그인: Card layout, tabs, form inputs

## Design↔Code Mapping [Visual]
| Figma 컴포넌트 | React 컴포넌트 | 파일 |
|----------------|---------------|------|
| Block/ReportHeader | ReportHeader | blocks/ReportHeader.tsx |
| Block/NumberStat | NumberStat | blocks/NumberStat.tsx |
| Block/DataTable | DataTable | blocks/DataTable.tsx |
| Block/BarChart | BarChart | blocks/BarChart.tsx |
| Block/LineChart | LineChart | blocks/LineChart.tsx |
| Block/AlertBox | AlertBox | blocks/AlertBox.tsx |
| Block/Callout | Callout | blocks/Callout.tsx |
| Block/PatternAnalysis | PatternAnalysis | blocks/PatternAnalysis.tsx |
| Block/Steps | Steps | blocks/Steps.tsx |
| Block/KeyValue | KeyValue | blocks/KeyValue.tsx |
| Block/QueryDetail | QueryDetail | blocks/QueryDetail.tsx |
| Block/SourceBox | SourceBox | blocks/SourceBox.tsx |
| Block/RelatedQuestions | RelatedQuestions | blocks/RelatedQuestions.tsx |
| Modal/ModelSelect | ModelSelect | modals/ModelSelect.tsx |
| Modal/Share | Share | modals/Share.tsx |
| Modal/Email | Email | modals/Email.tsx |
