const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

pres.layout = "LAYOUT_16x9";
pres.author = "K-Branch AI";
pres.title = "AI 챗봇 응답 블록 - 케이스별 샘플 화면";

// Design tokens
const C = {
  primary: "1E293B",
  accent: "2563EB",
  accentLight: "EFF6FF",
  white: "FFFFFF",
  bg: "F8FAFC",
  gray100: "F3F4F6",
  gray200: "E5E7EB",
  gray400: "9CA3AF",
  gray500: "6B7280",
  gray600: "4B5563",
  gray700: "374151",
  gray800: "1F2937",
  success: "16A34A",
  successBg: "F0FDF4",
  warning: "CA8A04",
  warningBg: "FEFCE8",
  error: "DC2626",
  errorBg: "FEF2F2",
  info: "0891B2",
  infoBg: "ECFEFF",
};

const mkShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

// ========================================
// SLIDE 1: Title
// ========================================
const s1 = pres.addSlide();
s1.background = { color: C.primary };

// Accent bar top
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

s1.addText("AI 챗봇 응답 블록", {
  x: 0.8, y: 1.4, w: 8.4, h: 1.0, fontSize: 42, fontFace: "Pretendard",
  color: C.white, bold: true, margin: 0,
});
s1.addText("케이스별 샘플 화면 가이드", {
  x: 0.8, y: 2.3, w: 8.4, h: 0.6, fontSize: 22, fontFace: "Pretendard",
  color: C.accent, bold: false, margin: 0,
});
s1.addText("K-Branch 기업자금관리서비스  |  2026.03", {
  x: 0.8, y: 4.6, w: 8.4, h: 0.4, fontSize: 13, fontFace: "Pretendard",
  color: C.gray400, margin: 0,
});

// Decorative shapes
s1.addShape(pres.shapes.RECTANGLE, { x: 8.5, y: 1.5, w: 1.2, h: 1.2, fill: { color: C.accent, transparency: 20 } });
s1.addShape(pres.shapes.RECTANGLE, { x: 9.0, y: 2.3, w: 0.8, h: 0.8, fill: { color: C.accent, transparency: 40 } });

// ========================================
// SLIDE 2: Overview
// ========================================
const s2 = pres.addSlide();
s2.background = { color: C.bg };
s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

s2.addText("응답 블록 시스템 개요", {
  x: 0.6, y: 0.3, w: 9, h: 0.7, fontSize: 26, fontFace: "Pretendard",
  color: C.gray800, bold: true, margin: 0,
});

s2.addText("6개 질의 유형  ×  15개 블록 타입  ×  공통 푸터", {
  x: 0.6, y: 0.9, w: 9, h: 0.4, fontSize: 14, fontFace: "Pretendard",
  color: C.accent, bold: true, margin: 0,
});

// 6 case cards in 2x3 grid
const cases = [
  { id: "P1", name: "일반 질의", desc: "텍스트 + 테이블", color: C.accent, emoji: "💬" },
  { id: "P2", name: "분석 질의", desc: "통계 + 차트 + 패턴", color: "7C3AED", emoji: "📊" },
  { id: "P3", name: "예측 질의", desc: "전망 + 콜아웃", color: "C2410C", emoji: "🔮" },
  { id: "P4", name: "이상거래", desc: "뱃지 + 점수 테이블", color: C.error, emoji: "🚨" },
  { id: "P5", name: "상담/가이드", desc: "단계별 안내", color: C.success, emoji: "📖" },
  { id: "P6", name: "보고서", desc: "정형 보고서 생성", color: C.info, emoji: "📋" },
];

cases.forEach((c, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.6 + col * 3.05;
  const y = 1.55 + row * 1.85;

  s2.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.85, h: 1.6, fill: { color: C.white },
    line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
  });
  // Accent left bar
  s2.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.6, fill: { color: c.color } });

  s2.addText(c.emoji + " " + c.id, {
    x: x + 0.2, y: y + 0.15, w: 2.4, h: 0.35, fontSize: 13, fontFace: "Pretendard",
    color: c.color, bold: true, margin: 0,
  });
  s2.addText(c.name, {
    x: x + 0.2, y: y + 0.5, w: 2.4, h: 0.4, fontSize: 17, fontFace: "Pretendard",
    color: C.gray800, bold: true, margin: 0,
  });
  s2.addText(c.desc, {
    x: x + 0.2, y: y + 0.9, w: 2.4, h: 0.35, fontSize: 12, fontFace: "Pretendard",
    color: C.gray500, margin: 0,
  });
});

// Block count summary
s2.addText("15개 블록 타입: text-content, report-header, number-stat, summary-cards, data-table, bar-chart, line-chart, alert-box, callout, pattern-analysis, steps, key-value, approval-box, source-box, related-questions", {
  x: 0.6, y: 5.0, w: 8.8, h: 0.4, fontSize: 10, fontFace: "Pretendard",
  color: C.gray400, margin: 0,
});

// ========================================
// Helper: Case slide template
// ========================================
function addCaseSlide(opts) {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

  // Tag
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.25, w: 1.1, h: 0.32, fill: { color: opts.tagColor },
  });
  s.addText(opts.tag, {
    x: 0.6, y: 0.25, w: 1.1, h: 0.32, fontSize: 11, fontFace: "Pretendard",
    color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Title
  s.addText(opts.title, {
    x: 1.85, y: 0.2, w: 7.5, h: 0.45, fontSize: 22, fontFace: "Pretendard",
    color: C.gray800, bold: true, margin: 0,
  });

  // Block flow
  s.addText("블록 플로우:  " + opts.flow, {
    x: 0.6, y: 0.72, w: 8.8, h: 0.3, fontSize: 10, fontFace: "Pretendard",
    color: C.gray500, margin: 0,
  });

  return s;
}

// ========================================
// SLIDE 3: P1 General
// ========================================
const s3 = addCaseSlide({
  tag: "P1 General", tagColor: C.accent,
  title: "일반 질의 — 외화 계좌 잔액 조회",
  flow: "텍스트답변 → 데이터테이블 → 관련질문",
});

// User bubble
s3.addShape(pres.shapes.RECTANGLE, {
  x: 5.5, y: 1.15, w: 4.0, h: 0.5, fill: { color: C.accent },
});
s3.addText("이번 달 외화 계좌 잔액 현황 보여줘", {
  x: 5.5, y: 1.15, w: 4.0, h: 0.5, fontSize: 13, fontFace: "Pretendard",
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// AI Response card
s3.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.85, w: 8.8, h: 3.4, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

// AI text
s3.addText([
  { text: "🤖 Sonnet", options: { fontSize: 10, color: C.gray400, bold: true, breakLine: true } },
  { text: "3월 기준 외화 계좌 잔액 현황을 안내드립니다.", options: { fontSize: 13, color: C.gray700 } },
], { x: 0.9, y: 1.95, w: 8.2, h: 0.6, fontFace: "Pretendard", margin: 0 });

// Data table
const tblHeader = [
  { text: "계좌번호", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard" } },
  { text: "통화", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard" } },
  { text: "은행", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard" } },
  { text: "잔액", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "right" } },
  { text: "상태", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "center" } },
];
const tblOpt = { fontSize: 10, color: C.gray700, fontFace: "Pretendard" };
const tblRows = [
  tblHeader,
  [{ text: "110-55-0012", options: tblOpt }, { text: "USD", options: tblOpt }, { text: "하나은행", options: tblOpt }, { text: "$125,430.50", options: { ...tblOpt, align: "right", bold: true } }, { text: "정상", options: { ...tblOpt, align: "center", color: C.success } }],
  [{ text: "220-88-0034", options: tblOpt }, { text: "EUR", options: tblOpt }, { text: "우리은행", options: tblOpt }, { text: "€42,180.00", options: { ...tblOpt, align: "right", bold: true } }, { text: "정상", options: { ...tblOpt, align: "center", color: C.success } }],
  [{ text: "330-11-0056", options: tblOpt }, { text: "JPY", options: tblOpt }, { text: "국민은행", options: tblOpt }, { text: "¥8,750,000", options: { ...tblOpt, align: "right", bold: true } }, { text: "정상", options: { ...tblOpt, align: "center", color: C.success } }],
  [{ text: "440-22-0078", options: tblOpt }, { text: "CNY", options: tblOpt }, { text: "신한은행", options: tblOpt }, { text: "¥285,600", options: { ...tblOpt, align: "right", bold: true } }, { text: "한도근접", options: { ...tblOpt, align: "center", color: C.warning } }],
];
s3.addTable(tblRows, { x: 0.9, y: 2.65, w: 8.2, colW: [1.8, 0.8, 1.2, 2.0, 1.0], border: { pt: 0.5, color: C.gray200 } });

// Related questions
s3.addText("관련 질문:  외화 계좌 거래내역을 보여줘  |  오늘 환율 조회해줘  |  외화 송금 방법 알려줘", {
  x: 0.9, y: 4.6, w: 8.2, h: 0.3, fontSize: 10, fontFace: "Pretendard", color: C.accent, margin: 0,
});

// Footer buttons
s3.addText("📄 PDF    📊 엑셀    📤 공유    ⚠ 신고", {
  x: 0.9, y: 5.0, w: 8.2, h: 0.3, fontSize: 10, fontFace: "Pretendard", color: C.gray400, margin: 0, align: "right",
});

// ========================================
// SLIDE 4: P2 Analysis
// ========================================
const s4 = addCaseSlide({
  tag: "P2 Analysis", tagColor: "7C3AED",
  title: "분석 질의 — 3월 급여이체 현황 리포트",
  flow: "보고서헤더 → 숫자통계 → 패턴분석 → 데이터테이블 → 알림경고 → 바차트 → 단계안내 → 출처정보 → 관련질문",
});

// Left column - Stats + Pattern
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.15, w: 4.5, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s4.addText("📊 3월 급여이체 현황 분석 리포트", {
  x: 0.85, y: 1.25, w: 4.0, h: 0.35, fontSize: 14, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0,
});
s4.addText("2026.03.01 ~ 2026.03.28 기준", {
  x: 0.85, y: 1.55, w: 4.0, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray500, margin: 0,
});

// Number stats (3 cards)
const stats = [
  { val: "342건", label: "총 이체건수", diff: "+8.2%", color: C.accent },
  { val: "18.7억", label: "총 이체금액", diff: "+3.5%", color: C.success },
  { val: "547만", label: "건당 평균", diff: "-4.3%", color: "7C3AED" },
];
stats.forEach((st, i) => {
  const sx = 0.85 + i * 1.4;
  s4.addShape(pres.shapes.RECTANGLE, { x: sx, y: 1.95, w: 1.3, h: 0.9, fill: { color: C.bg }, line: { color: C.gray200, width: 0.5 } });
  s4.addText(st.val, { x: sx, y: 2.0, w: 1.3, h: 0.35, fontSize: 16, fontFace: "Pretendard", color: st.color, bold: true, align: "center", margin: 0 });
  s4.addText(st.label, { x: sx, y: 2.32, w: 1.3, h: 0.2, fontSize: 9, fontFace: "Pretendard", color: C.gray500, align: "center", margin: 0 });
  s4.addText(st.diff, { x: sx, y: 2.5, w: 1.3, h: 0.2, fontSize: 9, fontFace: "Pretendard", color: st.diff.startsWith("+") ? C.success : C.error, align: "center", bold: true, margin: 0 });
});

// Pattern analysis
const patterns = [
  { level: "critical", title: "급여 지급일 집중", desc: "25일 단일 날짜에 72% 집중", bg: C.errorBg, border: C.error },
  { level: "warning", title: "신규 수령자 증가", desc: "전월 대비 15명 증가", bg: C.warningBg, border: C.warning },
  { level: "normal", title: "정기 이체 정상", desc: "285건 전량 정상 처리", bg: C.successBg, border: C.success },
];
patterns.forEach((p, i) => {
  const py = 3.05 + i * 0.65;
  s4.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: py, w: 4.0, h: 0.55, fill: { color: p.bg } });
  s4.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: py, w: 0.05, h: 0.55, fill: { color: p.border } });
  s4.addText(p.title, { x: 1.05, y: py + 0.03, w: 3.7, h: 0.22, fontSize: 11, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0 });
  s4.addText(p.desc, { x: 1.05, y: py + 0.25, w: 3.7, h: 0.2, fontSize: 9, fontFace: "Pretendard", color: C.gray600, margin: 0 });
});

// Right column - Chart + Table + Alert
s4.addShape(pres.shapes.RECTANGLE, {
  x: 5.3, y: 1.15, w: 4.1, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

// Chart placeholder
s4.addChart(pres.charts.BAR, [{
  name: "이체금액(억)", labels: ["경영지원", "IT개발", "영업", "연구소", "해외사업"],
  values: [3.2, 6.8, 4.5, 2.9, 1.3]
}], {
  x: 5.5, y: 1.25, w: 3.7, h: 2.0, barDir: "col",
  chartColors: ["3B82F6", "8B5CF6", "06B6D4", "10B981", "F59E0B"],
  showTitle: true, title: "부서별 급여이체 금액", titleColor: C.gray800, titleFontSize: 11,
  showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.gray600, dataLabelFontSize: 8,
  catAxisLabelColor: C.gray500, catAxisLabelFontSize: 8,
  valAxisLabelColor: C.gray500, valAxisLabelFontSize: 8,
  valGridLine: { color: C.gray200, size: 0.5 }, catGridLine: { style: "none" },
});

// Alert box
s4.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.45, w: 3.7, h: 0.65, fill: { color: C.warningBg }, line: { color: "FEF08A", width: 0.5 } });
s4.addText([
  { text: "⚠ 해외사업부 보류 건 확인 필요", options: { fontSize: 10, bold: true, color: "92400E", breakLine: true } },
  { text: "3건(1,850만원) 수령 계좌 변경으로 보류", options: { fontSize: 9, color: C.gray600 } },
], { x: 5.65, y: 3.5, w: 3.4, h: 0.55, fontFace: "Pretendard", margin: 0 });

// Steps preview
s4.addText([
  { text: "권고 조치사항", options: { fontSize: 10, bold: true, color: C.gray800, breakLine: true } },
  { text: "① 보류 건 확인  ② 한도 재조정  ③ 계좌 검증", options: { fontSize: 9, color: C.gray600 } },
], { x: 5.5, y: 4.25, w: 3.7, h: 0.5, fontFace: "Pretendard", margin: 0 });

// Footer
s4.addText("📄 PDF    📊 엑셀    📤 공유    ⚠ 신고", {
  x: 0.6, y: 5.15, w: 8.8, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray400, align: "right", margin: 0,
});

// ========================================
// SLIDE 5: P3 Forecast
// ========================================
const s5 = addCaseSlide({
  tag: "P3 Forecast", tagColor: "C2410C",
  title: "예측 질의 — 4월 자금 유출입 예측 보고서",
  flow: "보고서헤더 → 데이터테이블 → 콜아웃/팁 → 바차트 → 관련질문",
});

s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.15, w: 8.8, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s5.addText("🔮 2026년 4월 자금 유출입 예측 보고서", {
  x: 0.85, y: 1.25, w: 8.3, h: 0.35, fontSize: 14, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0,
});

// Forecast table
const fH = [
  { text: "구간", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard" } },
  { text: "예상 유입", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "right" } },
  { text: "예상 유출", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "right" } },
  { text: "순 유출입", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "right" } },
  { text: "리스크", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 10, fontFace: "Pretendard", align: "center" } },
];
const fo = { fontSize: 10, fontFace: "Pretendard", color: C.gray700 };
const fRows = [
  fH,
  [{ text: "1주차", options: fo }, { text: "12.5억", options: { ...fo, align: "right" } }, { text: "18.3억", options: { ...fo, align: "right", bold: true } }, { text: "-5.8억", options: { ...fo, align: "right", color: C.error, bold: true } }, { text: "높음", options: { ...fo, align: "center", color: C.error, bold: true } }],
  [{ text: "2주차", options: fo }, { text: "15.2억", options: { ...fo, align: "right" } }, { text: "9.8억", options: { ...fo, align: "right", bold: true } }, { text: "+5.4억", options: { ...fo, align: "right", color: C.success, bold: true } }, { text: "낮음", options: { ...fo, align: "center", color: C.success, bold: true } }],
  [{ text: "3주차", options: fo }, { text: "8.7억", options: { ...fo, align: "right" } }, { text: "11.2억", options: { ...fo, align: "right", bold: true } }, { text: "-2.5억", options: { ...fo, align: "right", color: C.error, bold: true } }, { text: "보통", options: { ...fo, align: "center", color: C.warning, bold: true } }],
  [{ text: "4주차", options: fo }, { text: "22.1억", options: { ...fo, align: "right" } }, { text: "25.6억", options: { ...fo, align: "right", bold: true } }, { text: "-3.5억", options: { ...fo, align: "right", color: C.error, bold: true } }, { text: "높음", options: { ...fo, align: "center", color: C.error, bold: true } }],
];
s5.addTable(fRows, { x: 0.85, y: 1.75, w: 4.4, colW: [1.0, 0.9, 0.9, 0.9, 0.7], border: { pt: 0.5, color: C.gray200 } });

// Chart
s5.addChart(pres.charts.BAR, [
  { name: "예상 유입", labels: ["1주차", "2주차", "3주차", "4주차"], values: [12.5, 15.2, 8.7, 22.1] },
  { name: "예상 유출", labels: ["1주차", "2주차", "3주차", "4주차"], values: [18.3, 9.8, 11.2, 25.6] },
], {
  x: 5.5, y: 1.65, w: 3.7, h: 2.2, barDir: "col",
  chartColors: ["3B82F6", "EF4444"], showLegend: true, legendPos: "t", legendFontSize: 9,
  catAxisLabelColor: C.gray500, catAxisLabelFontSize: 8,
  valAxisLabelColor: C.gray500, valAxisLabelFontSize: 8,
  valGridLine: { color: C.gray200, size: 0.5 }, catGridLine: { style: "none" },
});

// Callout
s5.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.0, w: 8.3, h: 0.7, fill: { color: C.warningBg } });
s5.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.0, w: 0.05, h: 0.7, fill: { color: C.warning } });
s5.addText([
  { text: "⚠ 유동성 리스크 주의", options: { fontSize: 11, bold: true, color: "92400E", breakLine: true } },
  { text: "1주차, 4주차 자금 유출 초과 예상. 법인세 납부(8.5억) + 급여이체(18.7억)가 주요 유출 요인. 최소 6.4억 유동성 확보 권장.", options: { fontSize: 9, color: C.gray600 } },
], { x: 1.05, y: 4.05, w: 7.9, h: 0.6, fontFace: "Pretendard", margin: 0 });

// Callout 2
s5.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.8, w: 8.3, h: 0.4, fill: { color: C.gray100 } });
s5.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.8, w: 0.05, h: 0.4, fill: { color: C.gray400 } });
s5.addText("📝 본 예측은 최근 3년간 동월 데이터의 가중 이동평균 기반. 실제 자금흐름과 차이 가능.", {
  x: 1.05, y: 4.82, w: 7.9, h: 0.35, fontSize: 9, fontFace: "Pretendard", color: C.gray500, margin: 0,
});

// ========================================
// SLIDE 6: P4 Anomaly
// ========================================
const s6 = addCaseSlide({
  tag: "P4 Anomaly", tagColor: C.error,
  title: "이상거래 — 감지 알림 응답",
  flow: "데이터테이블(뱃지+점수) → 관련질문",
});

s6.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.15, w: 8.8, h: 3.9, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s6.addText("최근 7일간 이상거래 5건 감지 (긴급 2건)", {
  x: 0.85, y: 1.25, w: 8.3, h: 0.35, fontSize: 13, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0,
});

const aH = [
  { text: "일시", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard" } },
  { text: "계좌", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard" } },
  { text: "유형", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard" } },
  { text: "금액", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard", align: "right" } },
  { text: "위험도", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard", align: "center" } },
  { text: "점수", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard", align: "center" } },
];
const ao = { fontSize: 9, fontFace: "Pretendard", color: C.gray700 };
const aRows = [
  aH,
  [{ text: "03.28 02:15", options: ao }, { text: "110-55-0012", options: ao }, { text: "심야 대량이체", options: ao }, { text: "8,500만", options: { ...ao, align: "right", bold: true } }, { text: "긴급", options: { ...ao, align: "center", color: C.error, bold: true } }, { text: "95", options: { ...ao, align: "center", color: C.error, bold: true, fontSize: 14 } }],
  [{ text: "03.27 23:42", options: ao }, { text: "220-88-0034", options: ao }, { text: "비인가 IP", options: ao }, { text: "3,200만", options: { ...ao, align: "right", bold: true } }, { text: "긴급", options: { ...ao, align: "center", color: C.error, bold: true } }, { text: "92", options: { ...ao, align: "center", color: C.error, bold: true, fontSize: 14 } }],
  [{ text: "03.27 14:30", options: ao }, { text: "330-11-0056", options: ao }, { text: "반복 소액이체", options: ao }, { text: "1,200만", options: { ...ao, align: "right", bold: true } }, { text: "주의", options: { ...ao, align: "center", color: C.warning, bold: true } }, { text: "82", options: { ...ao, align: "center", color: "EA580C", bold: true, fontSize: 14 } }],
  [{ text: "03.26 09:15", options: ao }, { text: "110-55-0012", options: ao }, { text: "신규거래처 대량", options: ao }, { text: "5,000만", options: { ...ao, align: "right", bold: true } }, { text: "주의", options: { ...ao, align: "center", color: C.warning, bold: true } }, { text: "78", options: { ...ao, align: "center", color: C.accent, bold: true, fontSize: 14 } }],
  [{ text: "03.25 16:50", options: ao }, { text: "440-22-0078", options: ao }, { text: "패턴 이탈", options: ao }, { text: "950만", options: { ...ao, align: "right", bold: true } }, { text: "참고", options: { ...ao, align: "center", color: C.gray500 } }, { text: "65", options: { ...ao, align: "center", color: C.accent, fontSize: 14 } }],
];
s6.addTable(aRows, { x: 0.85, y: 1.7, w: 8.3, colW: [1.2, 1.3, 1.4, 1.1, 0.8, 0.7], border: { pt: 0.5, color: C.gray200 } });

s6.addText("관련 질문:  긴급 건 상세 내역 보여줘  |  110-55-0012 거래내역 조회  |  이상거래 신고 절차", {
  x: 0.85, y: 4.5, w: 8.3, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.accent, margin: 0,
});
s6.addText("📄 PDF    📊 엑셀    📤 공유    ⚠ 신고", {
  x: 0.6, y: 5.15, w: 8.8, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray400, align: "right", margin: 0,
});

// ========================================
// SLIDE 7: P5 Consult
// ========================================
const s7 = addCaseSlide({
  tag: "P5 Consult", tagColor: C.success,
  title: "상담/가이드 — 다계좌이체 등록 안내",
  flow: "텍스트답변 → 단계안내 → 출처정보(다운로드) → 관련질문",
});

s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.15, w: 8.8, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s7.addText("다계좌이체 등록 절차를 안내드립니다.\n[대금지급] > [다계좌이체] 메뉴에서 진행하실 수 있습니다.", {
  x: 0.85, y: 1.25, w: 8.3, h: 0.55, fontSize: 12, fontFace: "Pretendard", color: C.gray700, margin: 0,
});

// Steps
const steps = [
  { title: "다계좌이체 메뉴 진입", desc: "[대금지급] > [다계좌이체] 선택" },
  { title: "출금 계좌 선택", desc: "잔액과 이체한도 확인 후 선택" },
  { title: "입금 계좌 등록", desc: "직접 입력 또는 엑셀 업로드 (최대 300건)" },
  { title: "결재 요청", desc: "결재선에 따라 승인자에게 전달" },
];
steps.forEach((st, i) => {
  const sy = 2.0 + i * 0.7;
  // Number circle
  s7.addShape(pres.shapes.OVAL, { x: 0.9, y: sy, w: 0.3, h: 0.3, fill: { color: C.gray800 } });
  s7.addText(String(i + 1), { x: 0.9, y: sy, w: 0.3, h: 0.3, fontSize: 12, fontFace: "Pretendard", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  // Connector line
  if (i < 3) {
    s7.addShape(pres.shapes.LINE, { x: 1.05, y: sy + 0.32, w: 0, h: 0.36, line: { color: C.gray200, width: 1.5 } });
  }
  s7.addText(st.title, { x: 1.4, y: sy - 0.02, w: 7.5, h: 0.25, fontSize: 13, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0 });
  s7.addText(st.desc, { x: 1.4, y: sy + 0.22, w: 7.5, h: 0.2, fontSize: 10, fontFace: "Pretendard", color: C.gray500, margin: 0 });
});

// Source box
s7.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.65, w: 8.3, h: 0.35, fill: { color: C.gray100 } });
s7.addText("📎 출처: 통합CMS 사용자 매뉴얼 v3.2  |  📥 다계좌이체_퀵가이드.pdf", {
  x: 0.95, y: 4.68, w: 8.1, h: 0.3, fontSize: 9, fontFace: "Pretendard", color: C.gray500, margin: 0,
});

s7.addText("📥 매뉴얼 다운    📤 공유    ⚠ 신고", {
  x: 0.6, y: 5.15, w: 8.8, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray400, align: "right", margin: 0,
});

// ========================================
// SLIDE 8: P6 Report
// ========================================
const s8 = addCaseSlide({
  tag: "P6 Report", tagColor: C.info,
  title: "보고서 — 3월 말 자금 포지션 보고서",
  flow: "보고서헤더 → 키값목록 → 결재선 → 숫자통계 → 데이터테이블 → 바차트 → 알림경고 → 출처정보 → 관련질문",
});

// Left column
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.15, w: 4.5, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s8.addText("📋 3월 말 자금 포지션 보고서", {
  x: 0.85, y: 1.25, w: 4.0, h: 0.3, fontSize: 14, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0,
});

// Key-value
const kvs = [
  ["기준일자", "2026년 3월 28일"], ["대상 법인", "웹케시씨앤에스(주)"], ["관리계좌", "24개 (원화 18 / 외화 6)"],
];
kvs.forEach((kv, i) => {
  const ky = 1.65 + i * 0.3;
  s8.addText(kv[0], { x: 0.85, y: ky, w: 1.2, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray500, margin: 0 });
  s8.addText(kv[1], { x: 2.1, y: ky, w: 2.9, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray800, bold: true, margin: 0 });
});

// Approval box
const roles = ["담당: 김재무", "팀장: 이경영", "본부장: ___"];
roles.forEach((r, i) => {
  s8.addShape(pres.shapes.RECTANGLE, { x: 0.85 + i * 1.35, y: 2.6, w: 1.25, h: 0.5, fill: { color: C.bg }, line: { color: C.gray200, width: 0.5 } });
  s8.addText(r, { x: 0.85 + i * 1.35, y: 2.6, w: 1.25, h: 0.5, fontSize: 9, fontFace: "Pretendard", color: C.gray600, align: "center", valign: "middle", margin: 0 });
});

// Number stats
const rStats = [
  { val: "487.3억", label: "총 자산", color: C.accent },
  { val: "312.5억", label: "가용자금", color: C.success },
  { val: "85.0억", label: "대출잔액", color: C.error },
  { val: "89.8억", label: "예적금", color: "7C3AED" },
];
rStats.forEach((st, i) => {
  const rx = 0.85 + i * 1.05;
  s8.addShape(pres.shapes.RECTANGLE, { x: rx, y: 3.3, w: 0.95, h: 0.75, fill: { color: C.bg }, line: { color: C.gray200, width: 0.5 } });
  s8.addText(st.val, { x: rx, y: 3.35, w: 0.95, h: 0.3, fontSize: 13, fontFace: "Pretendard", color: st.color, bold: true, align: "center", margin: 0 });
  s8.addText(st.label, { x: rx, y: 3.65, w: 0.95, h: 0.2, fontSize: 8, fontFace: "Pretendard", color: C.gray500, align: "center", margin: 0 });
});

// Alert boxes
s8.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.2, w: 4.0, h: 0.45, fill: { color: C.infoBg }, line: { color: "A5F3FC", width: 0.5 } });
s8.addText("ℹ 4/15 정기예금 만기(20.0억) — 재예치/해지 결정 필요", {
  x: 0.95, y: 4.22, w: 3.8, h: 0.4, fontSize: 9, fontFace: "Pretendard", color: "155E75", margin: 0,
});
s8.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.72, w: 4.0, h: 0.35, fill: { color: C.successBg }, line: { color: "BBF7D0", width: 0.5 } });
s8.addText("✓ 대출잔액 전월비 -3.5% — 상환계획 부합", {
  x: 0.95, y: 4.74, w: 3.8, h: 0.3, fontSize: 9, fontFace: "Pretendard", color: "065F46", margin: 0,
});

// Right column - Chart + Table
s8.addShape(pres.shapes.RECTANGLE, {
  x: 5.3, y: 1.15, w: 4.1, h: 4.2, fill: { color: C.white },
  line: { color: C.gray200, width: 1 }, shadow: mkShadow(),
});

s8.addChart(pres.charts.BAR, [{
  name: "잔액(억)", labels: ["수시입출금", "정기예금", "정기적금", "외화예금"],
  values: [198.5, 65.0, 24.8, 114.0]
}], {
  x: 5.5, y: 1.25, w: 3.7, h: 2.0, barDir: "col",
  chartColors: ["3B82F6", "8B5CF6", "06B6D4", "10B981"],
  showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.gray600, dataLabelFontSize: 8,
  catAxisLabelColor: C.gray500, catAxisLabelFontSize: 8,
  valAxisLabelColor: C.gray500, valAxisLabelFontSize: 8,
  valGridLine: { color: C.gray200, size: 0.5 }, catGridLine: { style: "none" },
});

// Mini table
const rTH = [
  { text: "유형", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard" } },
  { text: "잔액", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard", align: "right" } },
  { text: "비중", options: { fill: { color: C.gray100 }, color: C.gray700, bold: true, fontSize: 9, fontFace: "Pretendard", align: "right" } },
];
const ro = { fontSize: 9, fontFace: "Pretendard", color: C.gray700 };
const rTRows = [
  rTH,
  [{ text: "수시입출금", options: ro }, { text: "198.5억", options: { ...ro, align: "right", bold: true } }, { text: "40.7%", options: { ...ro, align: "right" } }],
  [{ text: "정기예금", options: ro }, { text: "65.0억", options: { ...ro, align: "right", bold: true } }, { text: "13.3%", options: { ...ro, align: "right" } }],
  [{ text: "외화예금", options: ro }, { text: "114.0억", options: { ...ro, align: "right", bold: true } }, { text: "23.4%", options: { ...ro, align: "right" } }],
  [{ text: "대출", options: ro }, { text: "-85.0억", options: { ...ro, align: "right", bold: true, color: C.error } }, { text: "17.4%", options: { ...ro, align: "right" } }],
];
s8.addTable(rTRows, { x: 5.5, y: 3.4, w: 3.7, colW: [1.3, 1.2, 1.0], border: { pt: 0.5, color: C.gray200 } });

s8.addText("💾 저장    📄 PDF    📊 엑셀    📤 공유    ⚠ 신고", {
  x: 0.6, y: 5.15, w: 8.8, h: 0.25, fontSize: 10, fontFace: "Pretendard", color: C.gray400, align: "right", margin: 0,
});

// ========================================
// WRITE FILE
// ========================================
pres.writeFile({ fileName: "C:/Users/김광현/Desktop/클로드작업물/AI_챗봇_응답블록_샘플_케이스.pptx" })
  .then(() => console.log("PPTX created successfully!"))
  .catch(err => console.error("Error:", err));
