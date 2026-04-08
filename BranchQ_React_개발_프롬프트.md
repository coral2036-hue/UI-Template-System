# Branch Q React 개발 프롬프트 템플릿

> 이 템플릿을 AI 코딩 어시스턴트(Claude, Cursor 등)에 붙여넣어 사용하세요.

---

## 🔧 프로젝트 초기 설정 프롬프트

```
당신은 React 프론트엔드 개발자입니다.
아래 사양으로 "Branch Q" AI 금융 업무 지원 시스템을 개발합니다.

[기술 스택]
- React 18+ (함수형 컴포넌트, Hooks)
- TypeScript
- Chart.js 4 (차트 렌더링)
- XLSX.js (Excel 다운로드)
- CSS Variables (디자인 토큰)
- Noto Sans KR + Inter 폰트

[디자인 참고]
- Figma: https://www.figma.com/design/moHy3BaQLmzoGcXTgbJeI1/claude-code
- 페이지: "브랜치Q"

[CSS 변수]
:root {
  --primary: #1e293b;
  --accent: #2563EB;
  --accent-bg: #eff6ff;
  --accent-border: #bfdbfe;
  --success: #16a34a;
  --success-bg: #f0fdf4;
  --warning: #ca8a04;
  --warning-bg: #fefce8;
  --error: #dc2626;
  --error-bg: #fef2f2;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --radius: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
}
```

---

## 📐 레이아웃 컴포넌트 프롬프트

```
Branch Q의 기본 레이아웃을 구현해주세요.

[구조]
<AppLayout>
  <Sidebar width={70} />       // 좌측 고정
  <MainArea>
    <Header height={56} />     // 상단 고정
    <Content />                // 스크롤 영역
    <InputBar />               // 하단 고정 (Chat Mode)
  </MainArea>
</AppLayout>

[Sidebar 70px]
- 로고: "BranchQ" 13px Bold #2563EB
- 메뉴: 이모지 아이콘 18px + 라벨 10px Bold, 세로 중앙 정렬
  - 💬 새 채팅
  - 🕐 최근 질문 ▸ (클릭 → 232px 서브패널)
  - 📋 맞춤보고서 ▸ + "Beta" 태그 8px accent
  - ⚙️ 사용 설정 ▸
  - 🚪 로그아웃 (하단 고정)
- active 상태: bg #EFF6FF, color #2563EB

[Header 56px]
- 좌: "Branch Q" 17px Bold #2563EB + 시나리오 제목 15px Bold
- 우: ? 도움말 + 🔔 알림 (빨간 dot 8px)

[SubPanel 232px]
- position: fixed, left: 70px, height: 100vh
- 배타적 토글 (3개 중 1개만)
- 외부 클릭 시 닫힘
```

---

## 💬 채팅 화면 프롬프트

```
Chat Mode 화면을 구현해주세요.

[ChatArea]
- max-width: 720px, 중앙 정렬
- 사용자 메시지: 우측 정렬, bg #2563EB, color white, radius 20px
  - 버블 크기: text width + padding 24px
- AI 메시지: 좌측 정렬, bg white, border 1px #E5E7EB, radius 8px

[AI 응답 구조]
<AIMsgShell>
  <AIText />           // 텍스트 본문
  <AIBlocks>           // 블록 렌더러 (14종)
    {blocks.map(block => <BlockRenderer type={block.type} data={block.data} />)}
  </AIBlocks>
  <ShareRow />         // 하단 버튼 (우측 정렬)
</AIMsgShell>

[ShareRow 규칙]
- 우측 정렬, gap 10px
- 버튼: h=36px, min-w=90px, radius=20px, border 1px #E5E7EB
- "신고하기": border #FECACA, color #DC2626
- btnType별 조합:
  report: PDF | Excel | 공유하기 | 신고하기
  report-save: 보고서저장 | PDF | Excel | 공유하기 | 신고하기
  anomaly: PDF | Excel | 공유하기 | 신고하기
  consult: 매뉴얼다운로드 | 공유하기 | 신고하기

[InputBar - 하단 고정]
- 카테고리 탭: 6개 pill 버튼 (일반/분석/예측/이상거래/상담/보고서)
- 2-Row 입력박스:
  Row1: 사업장 Select(120px) + Input(flex:1)
  Row2: ModelBadge(pill) + SearchBtn(36px circle #2563EB)
```

---

## 📊 블록 렌더러 프롬프트

```
AI 응답 블록 렌더러 14종을 구현해주세요.

[number-stat]
- grid: auto-fit minmax(150px, 1fr), gap 16px
- 카드: bg white, border 1px #E5E7EB, radius 6px, h=90px
- 값: Inter Bold 28px (color 지정 가능)
- 라벨: Noto Sans KR Medium 13px gray-500
- diff: "▲ +6.2%" 12px Bold (green=up / red=down)

[data-table]
- th: bg #F3F4F6, font 12px Semi Bold
- 금액 컬럼: text-align right, Inter Bold
- score 타입: 24px Bold, ≥90 빨강 / ≥80 주황 / <80 파랑
- badge 타입: 가운데 정렬, radius 3px, bg+color 조합

[bar-chart / line-chart]
- Chart.js 4 사용
- Y축 눈금 + 그리드 라인 (rgba(0,0,0,.05))
- 범례: 우측 상단
- bar: borderRadius 6, 값 텍스트 바 중앙(흰색) 또는 상단(색상)

[query-detail]
- 접기/펼치기 토글 (헤더 클릭)
- 필터: 시작일/종료일 input + "기간 내역 조회" 버튼
- Excel 다운로드: XLSX.utils.table_to_book() 사용
- 테이블: max-height 320px, overflow-y auto

[alert-box]
- 4단계: warning(노랑bg) / error(빨강bg) / info(시안bg) / success(초록bg)
- icon + title Bold + message

[callout]
- border-left 3px solid
- tip(초록) / note(회색) / important(노랑) / danger(빨강)

[steps]
- counter-reset: step
- 원형 번호: 24px, bg gray-800, color white, Inter Bold
- 연결선: width 2px, #E5E7EB, 마지막 항목 제외

[pattern-analysis]
- critical: bg #FEF2F2, border-left #DC2626
- warning: bg #FEFCE8, border-left #CA8A04
- normal: bg #F0FDF4, border-left #16A34A
```

---

## 🔧 모달 컴포넌트 프롬프트

```
모달/팝업 컴포넌트들을 구현해주세요.

[공통 모달]
- overlay: position fixed, inset 0, bg rgba(0,0,0,.5), backdrop-filter blur(4px)
- box: bg white, radius 8-16px, shadow 0 20px 60px rgba(0,0,0,.2)
- 닫기: ✕ 버튼 28px, bg gray-100, radius 4px

[M1 - 모델선택 드롭다운]
- 위로 열림 (bottom: calc(100% + 4px))
- 그룹별: 브랜치Q(3) / Anthropic(3) / OpenAI(3) / Google(2)
- 각 항목: name + tier 뱃지 (무료=파랑 / 고급=노랑 / 프리미엄=보라)

[M2 - API 설정]
- 좌측: 탭 리스트 180px (프로바이더별 로고 + 이름 + 상태 dot)
- 우측: 패널 (API키 입력 or 등록완료 상태)
- 미설정: input + 저장 + 발급 안내 가이드
- 등록완료: 마스킹 키 표시 + 삭제/변경 + 연결 테스트 결과 + 사용 가능 모델

[M3 - 전송방법 선택]
- 2개 카드: MMS(초록원 💬) / 카카오톡(노랑원 💬)
- 각 카드: icon + title Bold + description

[M4 - 카카오톡 미리보기]
- 스마트폰 프레임: 320px, radius 24px, border 6px #222
- 알림톡 버블: 노란색 + 흰색 카드 내 "상세 내용 확인" 버튼
- 전화번호 입력 + 추가 + recipient 태그
- "전송하기 (N명)" 버튼

[E1 - 전송완료]
- 중앙: ✓ 원 56px #16A34A + "전송 완료" 22px Bold
- "확인" 버튼 120x40 #2563EB radius 20px

[E2 - 삭제확인]
- "⚠️ 삭제 확인" + 경고 메시지
- 취소(border) + 삭제(bg #DC2626)
```

---

## 📝 보고서 빌더 프롬프트

```
보고서 빌더 화면을 구현해주세요.

[레이아웃]
- 헤더: "✏️ 보고서 빌더" + "📝 MD 편집" 탭 (active: border-bottom 2px accent)
- 좌측: 프리뷰 영역 (960px, bg #F1F5F9)
  - 빈 상태: "MD 편집 후 프리뷰 적용 버튼을 클릭하세요."
  - 입력 상태: 마크다운 → 블록 렌더링 결과
- 우측: 에디터 패널 (410px)
  - "MD / JSON 편집" + 글자수 카운터
  - "📥 파일 가져오기" 버튼 (accept: .md, .txt)
  - "기본 템플릿" 버튼
  - textarea: monospace 11px, bg #F9FAFB
- 하단: "👁 프리뷰 적용"(accent bg) + "💾 저장"(border)
```

---

## 🚀 시나리오별 데이터 프롬프트

```
각 시나리오의 AI 응답 데이터를 JSON으로 구성해주세요.

[S1 - 일반질의] 5턴 멀티턴
Turn 1: "이번 주 법인카드 사용내역 알려줘"
  → report-header + number-stat(3) + data-table(7행) + callout(note) + source-box + related-questions

Turn 2: "전주와 이번주 중 사용내역이 많은 주는 언제야?"
  → report-header + number-stat(2) + "약 7배 많음 ▲" + bar-chart(전주vs이번주) + text-content + related-questions

Turn 3: "2월은?"
  → report-header + number-stat(3) + bar-chart(기간별) + text-content + related-questions

Turn 4: "어 3월꺼는 가지고 있어서 다시 조회 안한거야??"
  → text-content + data-table(월별비교) + callout(important) + alert-box(warning) + query-detail(24건)

Turn 5: "이상거래는 없었나 있었으면 나열해줘"
  → report-header + callout(FDS기준) + data-table(이상3건) + data-table(주의2건) + alert-box + steps(3) + source-box

[S4 - 이상거래] score 테이블
columns: 유형(badge), 거래일시(2줄), 거래처(2줄), 금액(우측정렬Bold), 위험근거, 점수(score24px), 액션(badge)
rows: 5건 (계좌이체x3 + 법인카드x2)
score 색상: 98빨강, 95빨강, 88주황, 82주황, 75파랑

[S6 - 보고서] 결재란 우측상단
결재란: {roles: [{role:"작성",name:""},{role:"검토",name:""},{role:"승인",name:""}]}
위치: 보고서 카드 내부 right-top
보고서 제목 width: max 350px (결재란과 겹침 방지)
```

---

## 🔄 최신 반영사항 (v2) — 개발 시 필수 확인

### 1. data-table 금액 컬럼 우측 정렬
```tsx
// 금액 셀 렌더링
<td style={{ textAlign: 'right', fontFamily: 'Inter', fontWeight: 700 }}>
  {formatAmount(row.amount)}
</td>

// score 셀 렌더링
const getScoreColor = (score: number) => {
  if (score >= 90) return '#DC2626'; // 빨강
  if (score >= 80) return '#EA580C'; // 주황
  return '#2563EB'; // 파랑
};
<td style={{ textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: getScoreColor(score) }}>
  {score}
</td>
```

### 2. 차트 바 비율 — 데이터 정확 반영
```tsx
// 바 높이 계산: 데이터 비율 그대로
const maxValue = Math.max(...data);
const barHeight = (value / maxValue) * MAX_BAR_HEIGHT;

// 값 텍스트 위치
if (barHeight > 30) {
  // 바 내부 흰색 가운데
  <text fill="white" textAnchor="middle" />
} else {
  // 바 상단 외부
  <text fill={barColor} y={barTop - 4} />
}
```

### 3. ShareRow 우측 정렬
```tsx
<div className="share-row" style={{
  display: 'flex',
  justifyContent: 'flex-end', // 우측 정렬
  gap: '10px'
}}>
  {btnType === 'report-save' && <ActionBtn>보고서 저장</ActionBtn>}
  <ActionBtn>PDF</ActionBtn>
  <ActionBtn>Excel</ActionBtn>
  <ShareDropdown>공유하기</ShareDropdown>
  <ActionBtn className="danger">신고하기</ActionBtn>
</div>
```

### 4. S4 이상거래 테이블 행 구조
```tsx
// 각 행: 좌측 컬러바(3px) + 70px 높이
<tr style={{ height: 70, borderLeft: `3px solid ${typeColor}` }}>
  <td><Badge color={typeColor}>{type}</Badge></td>
  <td style={{ whiteSpace: 'pre-line' }}>{datetime}</td>
  <td style={{ whiteSpace: 'pre-line' }}>{merchant}</td>
  <td style={{ textAlign: 'right', fontWeight: 700 }}>{amount}</td>
  <td>{reason}</td>
  <td><ScoreDisplay score={score} /></td>
  <td><Badge color={actionColor}>{action}</Badge></td>
</tr>
```

### 5. S6 결재란 우측 상단 배치
```tsx
<div className="report-card" style={{ position: 'relative' }}>
  <div className="report-title" style={{ maxWidth: 350 }}>
    📊 2026년 3월 자금현황 보고서
  </div>
  <div className="approval-box" style={{
    position: 'absolute',
    top: 20,
    right: 20
  }}>
    <ApprovalTable roles={['작성','검토','승인']} />
  </div>
</div>
```

### 6. number-stat 카드 비교 뱃지
```tsx
// 두 카드 사이에 비교 텍스트
<div className="ns-grid">
  <NumberStat value="757만" label="전주 (3/16~3/22)" color="red" />
  <span className="ns-compare" style={{ color: '#DC2626', fontWeight: 700 }}>
    약 7배 많음 ▲
  </span>
  <NumberStat value="107만" label="이번주 (3/23~3/26)" color="blue" />
</div>
```

