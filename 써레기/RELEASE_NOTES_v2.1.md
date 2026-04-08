# Report Block Editor v2.1 Release Notes

## 릴리즈 일자: 2026-03-23

---

## 주요 변경사항

### 1. 디자인 리뉴얼 — "AI 티 제거"

기존 AI가 생성한 듯한 뻔한 디자인을 전문 금융 보고서 스타일로 전면 리디자인했습니다.

#### 색상 팔레트 변경
| 항목 | Before | After |
|------|--------|-------|
| Primary | `#2563eb` (밝은 파랑) | `#1e293b` (slate-800, 진한 회청색) |
| Accent | 없음 | `#4f46e5` (indigo-600, 강조용) |
| 차트 기본색 | 파랑 일색 | slate 계열 (`#475569`, `#64748b`, `#94a3b8`) |
| 배지(badge) | 알약형 (20px radius) | 직사각형 태그 (3px radius) |

#### 모서리 축소
| 항목 | Before | After |
|------|--------|-------|
| 기본 | 8px | 4px |
| 큰 요소 | 12px | 6px |
| 최대 | 16px | 8px |

#### 이모지 전면 제거
- 차트 제목: `📊 📈 🍩 🕸️` → 텍스트만
- 알림 아이콘: `⚠️ 🚨 ℹ️ ✅` → CSS 텍스트 심볼 (`! !! i ✓`)
- 콜아웃 아이콘: `💡 📝 ⚠️ 🚫` → `✓ i ! ✗`
- SWOT: `💪 ⚡ 🌟 ⚠️` → `S W O T` 문자
- 장단점: `👍 👎` → 텍스트 "장점" / "단점"
- 좌측 패널 아이콘: 이모지 → 텍스트 심볼 (`H T ─ ※ ▦ ▤ ▊ ⌇ ◔ ! ◉` 등)

#### 스타일 압축
- 블록 간격: 24px → 16px
- 카드 패딩: 18-20px → 12-16px
- 테이블 헤더: 어두운 배경(gray-800) → 밝은 배경(gray-100)
- 그라데이션 배경 전면 제거 (insight-card, 미리보기 영역 등)
- summary-card 상단 3px 색상 바 제거
- compare-card 상단 3px 색상 바 제거
- hover 애니메이션(translateY) 제거
- 그림자 강도 50% 감소

---

### 2. 새 블록 타입

#### 결재방 (approval-box)
- 결재라인 표시 (담당 → 검토 → 승인)
- 가로/세로 레이아웃 지원
- 상태: 승인(approved) / 반려(rejected) / 대기(pending)
- 도장 스타일 시각화

#### 보고서 헤더 (report-header)
- 다크 배경 + 액센트 원 장식
- 제목, 부제, 작성일, 부서 표시
- 배경색/액센트색 커스터마이징 가능

#### 디자인 가이드 (design-guide)
- 색상 팔레트 스와치 표시
- 헤더/본문 폰트 카드
- 스타일 태그 + 비고란

#### 공식 보고서 템플릿 프리셋 추가
report-header → approval-box → heading → summary-cards → data-table → bar-chart → design-guide → date-range → action-buttons

---

### 3. data-table 기능 강화
- **조건 필터**: `사업장 == 'A사업장' AND 잔액 >= 5000000`
- **그룹화**: `GROUP BY 은행, 계좌분류`
- **집계 연산**: `SUM:계좌잔액, AVG:이자율`
- 에디터 UI에서 편집 가능, AI 프롬프트에 힌트로 포함

---

### 4. JSON 탭 기능 추가
- **JSON 복사** 버튼 — 현재 리포트를 클립보드에 복사
- **다운로드** 버튼 — `{제목}_{날짜}.json` 파일로 저장

---

### 5. React 프롬프트 출력 개선
- `chart.js` / `react-chartjs-2` → **recharts** (Claude 아티팩트 호환)
- **lucide-react** 아이콘 사용 지시
- **Tailwind CSS** 클래스 사용 지시
- 금지 라이브러리 목록 명시 (chart.js, @mui/material, styled-components 등)

---

### 6. 스킬(SKILL.md) 업데이트
- XLSX 업로드 지원 안내 추가
- 샘플 미리보기 동작 설명 추가
- JSON 복사/다운로드 기능 안내 추가
- 새 블록 타입 레퍼런스 추가 (approval-box, report-header, design-guide)
- 공식 보고서 템플릿 프리셋 추가
- report_output.json 저장 워크플로우 추가

---

## 기술 상세

### 변경 파일
- `report_block_editor_v2.html` — CSS 변수, 블록 스타일, 렌더러, 에디터, 샘플 생성기
- `.claude/skills/report-json-generator/SKILL.md` — 스킬 문서

### CSS 변수 변경 요약
```
--primary: #2563eb → #1e293b
--accent: (신규) #4f46e5
--radius: 8px → 4px
--radius-lg: 12px → 6px
--shadow: 약 50% 감소
```

### 호환성
- Chart.js 4.x 호환
- SheetJS (xlsx.js) 0.18.5 호환
- 기존 JSON 데이터 100% 호환 (색상만 새 팔레트로 업데이트 권장)
