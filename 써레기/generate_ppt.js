const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "김광현";
pres.title = "브랜치Q, 질문 하나에 36시간";

// === Colors ===
const NAVY = "1E2761";
const DEEP_NAVY = "151D45";
const ICE = "CADCFC";
const CORAL = "F96167";
const LIGHT_BG = "F5F6FA";
const WHITE = "FFFFFF";
const DARK_TEXT = "1E2761";
const GRAY = "8B95A5";
const BODY_TEXT = "4A5568";

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 });

// === Helper: section label ===
function addSectionLabel(slide, text) {
  slide.addText(text, {
    x: 0.8, y: 0.4, w: 4, h: 0.35,
    fontSize: 11, fontFace: "Malgun Gothic", color: CORAL, bold: true, charSpacing: 4, margin: 0
  });
}

// === Helper: slide title ===
function addSlideTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.8, y: 0.8, w: 8.4, h: 0.7,
    fontSize: opts.fontSize || 28, fontFace: "Malgun Gothic", bold: true, color: opts.color || DARK_TEXT, margin: 0
  });
}


// ============================================================
// SLIDE 1: 타이틀 (다크 네이비) ← L1
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: NAVY };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: CORAL } });

s1.addText("브랜치Q", {
  x: 0.8, y: 1.3, w: 8.4, h: 0.7,
  fontSize: 18, fontFace: "Malgun Gothic", color: ICE, charSpacing: 6, margin: 0
});
s1.addText("질문 하나에 36시간", {
  x: 0.8, y: 2.0, w: 8.4, h: 1.2,
  fontSize: 40, fontFace: "Malgun Gothic", bold: true, color: WHITE, margin: 0
});
s1.addText("금융 AI가 정확한 답을 하기까지", {
  x: 0.8, y: 3.3, w: 8.4, h: 0.6,
  fontSize: 18, fontFace: "Malgun Gothic", color: ICE, margin: 0
});
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.8, w: 10, h: 0.825, fill: { color: DEEP_NAVY } });
s1.addText("김광현  |  브랜치Q 담당", {
  x: 0.8, y: 4.85, w: 8.4, h: 0.7,
  fontSize: 14, fontFace: "Malgun Gothic", color: ICE, valign: "middle", margin: 0
});


// ============================================================
// SLIDE 2: 도입 ← L2~3
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: LIGHT_BG };
addSectionLabel(s2, "OPENING");
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.9, w: 0.5, h: 0.06, fill: { color: CORAL } });

s2.addText("6개월 전,\n오래 붙잡고 있었던 질문 하나", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.4,
  fontSize: 30, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
});

// 인용 박스
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.0, w: 8.4, h: 2.0,
  fill: { color: WHITE }, shadow: makeShadow()
});
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.0, w: 0.08, h: 2.0, fill: { color: NAVY } });

s2.addText([
  { text: "오늘은 제가 약 6개월 전, 브랜치Q를 학습시키면서\n정말 오래 붙잡고 있었던 질문 하나를 말씀드리려고 합니다.", options: { fontSize: 16, color: DARK_TEXT, breakLine: true } },
  { text: "\n", options: { fontSize: 10, breakLine: true } },
  { text: "지금 말씀드리는 건 현재의 이야기가 아니라,\n그때 제가 실제로 가장 많이 막혔던 순간의 이야기입니다.", options: { fontSize: 15, color: GRAY, italic: true } }
], {
  x: 1.2, y: 3.1, w: 7.8, h: 1.8,
  fontFace: "Malgun Gothic", valign: "middle", margin: 0
});


// ============================================================
// SLIDE 3: 질문 제시 ← L4~7
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: WHITE };
addSectionLabel(s3, "QUESTION");

s3.addText("질문은 아주 단순했습니다.", {
  x: 0.8, y: 0.9, w: 8.4, h: 0.6,
  fontSize: 20, fontFace: "Malgun Gothic", color: GRAY, margin: 0
});

// 큰 따옴표
s3.addText("\u201C", {
  x: 0.4, y: 1.2, w: 1.5, h: 1.5,
  fontSize: 120, fontFace: "Georgia", color: ICE, margin: 0
});

s3.addText("최근 30일 동안\n거래가 없던 계좌 찾아줘.", {
  x: 1.2, y: 1.7, w: 7.6, h: 1.6,
  fontSize: 34, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
});

// 하단 박스
s3.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.8, w: 8.4, h: 1.2, fill: { color: LIGHT_BG }
});
s3.addText([
  { text: "처음 봤을 때는 누구나 이렇게 생각합니다.", options: { fontSize: 16, color: BODY_TEXT, breakLine: true } },
  { text: "\n", options: { fontSize: 8, breakLine: true } },
  { text: "\u201C이 정도 질문은 AI가 당연히 잘하겠지.\u201D", options: { fontSize: 18, color: DARK_TEXT, bold: true, italic: true } }
], {
  x: 1.2, y: 3.9, w: 7.6, h: 1.0,
  fontFace: "Malgun Gothic", valign: "middle", margin: 0
});


// ============================================================
// SLIDE 4: 일반 AI의 답변 ← L8~11
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: LIGHT_BG };
addSectionLabel(s4, "AI RESPONSE");
addSlideTitle(s4, "실제로 AI에 넣어보면?");

s4.addText("실제로 GPT나 Claude에 그대로 넣어보면 꽤 자연스러운 답이 나옵니다.", {
  x: 0.8, y: 1.5, w: 8.4, h: 0.5,
  fontSize: 15, fontFace: "Malgun Gothic", color: BODY_TEXT, margin: 0
});

// 답변 예시 박스
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 2.1, w: 8.4, h: 1.6,
  fill: { color: WHITE }, shadow: makeShadow()
});
s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 8.4, h: 0.06, fill: { color: GRAY } });

s4.addText([
  { text: "AI 답변 예시", options: { fontSize: 11, color: GRAY, bold: true, breakLine: true } },
  { text: "\n", options: { fontSize: 6, breakLine: true } },
  { text: "\u201C최근 30일간 거래 내역이 없는 계좌를 확인하려면\n거래 데이터를 조회해야 합니다...\u201D", options: { fontSize: 16, color: BODY_TEXT, italic: true } }
], {
  x: 1.2, y: 2.2, w: 7.6, h: 1.3,
  fontFace: "Malgun Gothic", valign: "middle", margin: 0
});

// 평가
s4.addText("겉으로 보면 좋은 답변입니다.", {
  x: 0.8, y: 4.0, w: 8.4, h: 0.5,
  fontSize: 18, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
});
s4.addText("그런데 금융에서는 이게 정답이 아닙니다.", {
  x: 0.8, y: 4.5, w: 8.4, h: 0.5,
  fontSize: 18, fontFace: "Malgun Gothic", bold: true, color: CORAL, margin: 0
});


// ============================================================
// SLIDE 5: 금융에서 진짜 필요한 것 ← L12~14
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: NAVY };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: CORAL } });

s5.addText("고객이 원하는 건\n설명이 아니라,", {
  x: 0.8, y: 0.8, w: 8.4, h: 1.4,
  fontSize: 34, fontFace: "Malgun Gothic", bold: true, color: WHITE, margin: 0
});

s5.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.4, w: 1.5, h: 0.04, fill: { color: CORAL } });

s5.addText("바로 판단할 수 있는 데이터", {
  x: 0.8, y: 2.7, w: 8.4, h: 0.8,
  fontSize: 34, fontFace: "Malgun Gothic", bold: true, color: CORAL, margin: 0
});

// 3가지 포인트
const points = [
  "어떤 계좌가 몇 개인지",
  "어느 계좌가 멈춰 있는지",
  "바로 판단할 수 있는 형태"
];
points.forEach((p, i) => {
  const py = 3.8 + i * 0.55;
  s5.addShape(pres.shapes.OVAL, {
    x: 0.8, y: py + 0.05, w: 0.35, h: 0.35, fill: { color: CORAL }
  });
  s5.addText(String(i + 1), {
    x: 0.8, y: py + 0.05, w: 0.35, h: 0.35,
    fontSize: 12, fontFace: "Malgun Gothic", bold: true, color: WHITE, align: "center", valign: "middle", margin: 0
  });
  s5.addText(p, {
    x: 1.35, y: py, w: 7.5, h: 0.45,
    fontSize: 18, fontFace: "Malgun Gothic", color: ICE, valign: "middle", margin: 0
  });
});


// ============================================================
// SLIDE 6: 프롬프트의 한계 ← L15~19
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: WHITE };
addSectionLabel(s6, "LIMITATION");
addSlideTitle(s6, "프롬프트를 길게 쓰면 해결될까?");

// 기대
s6.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.7, w: 4.3, h: 2.2,
  fill: { color: LIGHT_BG }
});
s6.addText("기대", {
  x: 0.5, y: 1.7, w: 4.3, h: 0.45,
  fontSize: 13, fontFace: "Malgun Gothic", bold: true, color: WHITE,
  fill: { color: "3B82F6" }, align: "center", valign: "middle"
});
s6.addText([
  { text: "설명을 붙이고, 예시를 넣고,\n조건을 더 자세히 적으면\nAI가 더 정확해질 거라고 믿었습니다.", options: { fontSize: 14, color: BODY_TEXT } }
], {
  x: 0.8, y: 2.3, w: 3.7, h: 1.4,
  fontFace: "Malgun Gothic", valign: "middle", margin: 0
});

// 현실
s6.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.7, w: 4.3, h: 2.2,
  fill: { color: LIGHT_BG }
});
s6.addText("현실", {
  x: 5.2, y: 1.7, w: 4.3, h: 0.45,
  fontSize: 13, fontFace: "Malgun Gothic", bold: true, color: WHITE,
  fill: { color: CORAL }, align: "center", valign: "middle"
});
s6.addText([
  { text: "그런데 실제로는 그렇지 않았습니다.", options: { fontSize: 14, color: BODY_TEXT, breakLine: true } },
  { text: "\n", options: { fontSize: 8, breakLine: true } },
  { text: "모델이 조금만 바뀌어도 답이 흔들렸고,\n환경이 달라져도 결과가 달라졌습니다.", options: { fontSize: 14, color: CORAL, bold: true } }
], {
  x: 5.5, y: 2.3, w: 3.7, h: 1.4,
  fontFace: "Malgun Gothic", valign: "middle", margin: 0
});

// 전환 문구
s6.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.3, w: 9, h: 0.9,
  fill: { color: NAVY }
});
s6.addText("이 질문 하나를 붙잡고 거의 36시간을 씨름한 뒤에야\n세 가지가 동시에 맞아야 한다는 걸 알게 됐습니다.", {
  x: 0.8, y: 4.35, w: 8.4, h: 0.8,
  fontSize: 16, fontFace: "Malgun Gothic", bold: true, color: WHITE, valign: "middle", margin: 0
});


// ============================================================
// SLIDE 7: 세 가지가 동시에 맞아야 한다 (3카드) ← L20~36
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: WHITE };
addSectionLabel(s7, "3 PRINCIPLES");
addSlideTitle(s7, "세 가지가 동시에 맞아야 한다", { fontSize: 24 });

const cardData = [
  {
    num: "01", title: "환경 설정", sub: "DSL", accent: CORAL,
    lines: [
      "\"최근 30일\" — 기준이 필요하다",
      "오늘? 영업일? 정산일?",
      "AI가 틀린 게 아니라",
      "우리가 기준을 정의하지 않았던 것",
      "",
      "→ 업무 규칙이 반영된 언어(DSL)로",
      "   변환하는 구조를 만들었다"
    ]
  },
  {
    num: "02", title: "의도 파악", sub: "Intent", accent: "3B82F6",
    lines: [
      "\"거래\"가 뭔지 AI는 모른다",
      "입금만? 출금도? 자동이체까지?",
      "",
      "정확히 정하지 않으면",
      "겉으로는 맞아 보이는데",
      "실제로는 틀린 답이 나온다",
      "",
      "가장 오래 막혔던 부분"
    ]
  },
  {
    num: "03", title: "답변 표현", sub: "Format", accent: "10B981",
    lines: [
      "데이터를 맞게 가져와도",
      "문장으로 길게 나오면 쓸 수 없다",
      "",
      "\"계좌는 총 12개이며...\"",
      "→ 고객은 바로 판단할 수 없다",
      "",
      "숫자는 숫자답게",
      "계좌는 계좌답게, 구조화"
    ]
  }
];

cardData.forEach((c, i) => {
  const cx = 0.35 + i * 3.15;
  // Card
  s7.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: 1.65, w: 3.0, h: 3.6,
    fill: { color: LIGHT_BG }, shadow: makeShadow()
  });
  // Top accent
  s7.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.65, w: 3.0, h: 0.06, fill: { color: c.accent } });
  // Number
  s7.addText(c.num, {
    x: cx + 0.2, y: 1.85, w: 0.6, h: 0.5,
    fontSize: 24, fontFace: "Malgun Gothic", bold: true, color: c.accent, margin: 0
  });
  // Title + sub
  s7.addText(c.title, {
    x: cx + 0.8, y: 1.85, w: 2.0, h: 0.35,
    fontSize: 17, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
  });
  s7.addText(c.sub, {
    x: cx + 0.8, y: 2.2, w: 2.0, h: 0.3,
    fontSize: 11, fontFace: "Malgun Gothic", color: GRAY, margin: 0
  });
  // Content lines
  s7.addText(c.lines.join("\n"), {
    x: cx + 0.2, y: 2.55, w: 2.6, h: 2.5,
    fontSize: 12, fontFace: "Malgun Gothic", color: BODY_TEXT, margin: 0
  });
});


// ============================================================
// SLIDE 8: 핵심 깨달음 ← L37~38
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: LIGHT_BG };

s8.addText("\u201C", {
  x: 0.5, y: 0.5, w: 2, h: 2,
  fontSize: 150, fontFace: "Georgia", color: ICE, margin: 0
});

s8.addText("질문을 이해하는 것과", {
  x: 1.0, y: 1.5, w: 8, h: 0.8,
  fontSize: 28, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
});

s8.addText("사용자가 바로 판단할 수 있도록\n결과를 완성하는 건", {
  x: 1.0, y: 2.3, w: 8, h: 1.2,
  fontSize: 28, fontFace: "Malgun Gothic", bold: true, color: DARK_TEXT, margin: 0
});

s8.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.7, w: 2, h: 0.06, fill: { color: CORAL } });

s8.addText("완전히 다른 문제", {
  x: 1.0, y: 3.9, w: 8, h: 0.8,
  fontSize: 36, fontFace: "Malgun Gothic", bold: true, color: CORAL, margin: 0
});

s8.addText("\u201D", {
  x: 7.5, y: 4.0, w: 2, h: 1.5,
  fontSize: 100, fontFace: "Georgia", color: ICE, margin: 0
});


// ============================================================
// SLIDE 9: Before vs After (플레이스홀더) ← L39~40
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: WHITE };
addSectionLabel(s9, "BEFORE & AFTER");
addSlideTitle(s9, "같은 질문, 완전히 다른 결과");

s9.addText("그 이후로 같은 질문도 완전히 달라졌습니다.\n6개월 전에는 흔들렸던 질문이, 지금은 안정적으로 같은 형태로 나옵니다.", {
  x: 0.8, y: 1.5, w: 8.4, h: 0.7,
  fontSize: 14, fontFace: "Malgun Gothic", color: BODY_TEXT, margin: 0
});

// Before
s9.addText("6개월 전", {
  x: 0.5, y: 2.3, w: 4.3, h: 0.45,
  fontSize: 15, fontFace: "Malgun Gothic", bold: true, color: GRAY, align: "center", margin: 0
});
s9.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.8, w: 4.3, h: 2.5,
  fill: { color: "EBEBEB" }, line: { color: "CCCCCC", width: 1 }
});
s9.addText("실제 화면 삽입\n(Before)", {
  x: 0.5, y: 2.8, w: 4.3, h: 2.5,
  fontSize: 16, fontFace: "Malgun Gothic", color: "999999", align: "center", valign: "middle"
});

// Arrow
s9.addText("\u27A1", {
  x: 4.55, y: 3.6, w: 0.9, h: 0.6,
  fontSize: 28, fontFace: "Malgun Gothic", color: CORAL, align: "center", valign: "middle"
});

// After
s9.addText("현재", {
  x: 5.2, y: 2.3, w: 4.3, h: 0.45,
  fontSize: 15, fontFace: "Malgun Gothic", bold: true, color: CORAL, align: "center", margin: 0
});
s9.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.8, w: 4.3, h: 2.5,
  fill: { color: "EBEBEB" }, line: { color: CORAL, width: 2 }
});
s9.addText("실제 화면 삽입\n(After)", {
  x: 5.2, y: 2.8, w: 4.3, h: 2.5,
  fontSize: 16, fontFace: "Malgun Gothic", color: "999999", align: "center", valign: "middle"
});


// ============================================================
// SLIDE 10: 1,000개 질문 세트 ← L41~51
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: WHITE };
addSectionLabel(s10, "RESULT");
addSlideTitle(s10, "1,000개 질문으로 검증하다");

s10.addText("이 경험이 쌓이면서 저희 팀은 질문을 하나씩 관리하기 시작했습니다.", {
  x: 0.8, y: 1.5, w: 8.4, h: 0.4,
  fontSize: 14, fontFace: "Malgun Gothic", color: BODY_TEXT, margin: 0
});

// 타임라인 — 3컬럼 균등 배치
const tlY = 2.05;
const tlH = 1.2;
s10.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: tlY, w: 9, h: tlH, fill: { color: LIGHT_BG }
});

// 컬럼 1: 10개
s10.addText("10개", {
  x: 0.7, y: tlY + 0.15, w: 2.2, h: 0.45,
  fontSize: 22, fontFace: "Malgun Gothic", bold: true, color: GRAY, margin: 0
});
s10.addText("처음 시작", {
  x: 0.7, y: tlY + 0.65, w: 2.2, h: 0.35,
  fontSize: 12, fontFace: "Malgun Gothic", color: GRAY, margin: 0
});

// 화살표 1
s10.addText("\u2192", {
  x: 2.7, y: tlY + 0.25, w: 0.6, h: 0.4,
  fontSize: 22, fontFace: "Malgun Gothic", color: "CCCCCC", align: "center", valign: "middle", margin: 0
});

// 컬럼 2: 중간 과정
s10.addText("실패 → 추가", {
  x: 3.5, y: tlY + 0.15, w: 2.5, h: 0.45,
  fontSize: 15, fontFace: "Malgun Gothic", bold: true, color: GRAY, margin: 0
});
s10.addText("업무별 · 오류별 분류", {
  x: 3.5, y: tlY + 0.65, w: 2.5, h: 0.35,
  fontSize: 12, fontFace: "Malgun Gothic", color: GRAY, margin: 0
});

// 화살표 2
s10.addText("\u2192", {
  x: 6.0, y: tlY + 0.25, w: 0.6, h: 0.4,
  fontSize: 22, fontFace: "Malgun Gothic", color: "CCCCCC", align: "center", valign: "middle", margin: 0
});

// 컬럼 3: 1,000개
s10.addText("1,000개", {
  x: 6.8, y: tlY + 0.15, w: 2.5, h: 0.45,
  fontSize: 24, fontFace: "Malgun Gothic", bold: true, color: CORAL, margin: 0
});
s10.addText("테스트 질문 세트 운영", {
  x: 6.8, y: tlY + 0.65, w: 2.5, h: 0.35,
  fontSize: 12, fontFace: "Malgun Gothic", color: CORAL, margin: 0
});

// 속도 비교 바
s10.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.5, w: 9, h: 0.55, fill: { color: LIGHT_BG } });
s10.addText("예전: 질문 하나에 36시간   \u2192   지금: 10분마다 하나씩 질문-답변 세트 생성 · 검증", {
  x: 0.8, y: 3.5, w: 8.4, h: 0.55,
  fontSize: 14, fontFace: "Malgun Gothic", color: DARK_TEXT, bold: true, valign: "middle", margin: 0
});

// 큰 숫자: 97% → 100%
const boxY = 4.15;
const boxH = 0.95;
const boxGap = 0.3;
const boxW = (9 - boxGap) / 2;
const boxX1 = 0.5;
const boxX2 = boxX1 + boxW + boxGap;

s10.addShape(pres.shapes.RECTANGLE, {
  x: boxX1, y: boxY, w: boxW, h: boxH, fill: { color: NAVY }
});
s10.addText("97%", {
  x: boxX1, y: boxY + 0.03, w: boxW, h: 0.55,
  fontSize: 44, fontFace: "Malgun Gothic", bold: true, color: WHITE, align: "center", valign: "bottom", margin: 0
});
s10.addText("현재 정답률", {
  x: boxX1, y: boxY + 0.6, w: boxW, h: 0.3,
  fontSize: 13, fontFace: "Malgun Gothic", color: ICE, align: "center", valign: "top", margin: 0
});

s10.addShape(pres.shapes.RECTANGLE, {
  x: boxX2, y: boxY, w: boxW, h: boxH, fill: { color: CORAL }
});
s10.addText("100%", {
  x: boxX2, y: boxY + 0.03, w: boxW, h: 0.55,
  fontSize: 44, fontFace: "Malgun Gothic", bold: true, color: WHITE, align: "center", valign: "bottom", margin: 0
});
s10.addText("이번 주 목표", {
  x: boxX2, y: boxY + 0.6, w: boxW, h: 0.3,
  fontSize: 13, fontFace: "Malgun Gothic", color: WHITE, align: "center", valign: "top", margin: 0
});

// 하단 인용
s10.addText("왜 100%냐고요? 금융에서는 99%도 불안합니다. 고객은 항상 100%를 기대하기 때문입니다.", {
  x: 0.5, y: 5.15, w: 9, h: 0.35,
  fontSize: 12, fontFace: "Malgun Gothic", italic: true, color: GRAY, align: "center", margin: 0
});


// ============================================================
// SLIDE 11: 비전 + 마무리 (다크 네이비) ← L52~55
// ============================================================
let s11 = pres.addSlide();
s11.background = { color: NAVY };
s11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: CORAL } });

s11.addText("지금 만 개 기업이\n매일 아침 브랜치를 켜고 하루를 시작합니다.", {
  x: 0.8, y: 0.5, w: 8.4, h: 1.0,
  fontSize: 22, fontFace: "Malgun Gothic", color: ICE, margin: 0
});

s11.addText("저는 확신합니다.", {
  x: 0.8, y: 1.6, w: 8.4, h: 0.5,
  fontSize: 20, fontFace: "Malgun Gothic", bold: true, color: WHITE, margin: 0
});

s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.2, w: 2, h: 0.04, fill: { color: CORAL } });

s11.addText("1년 안에 그 기업들은\n브랜치를 켜는 것에서 끝나는 게 아니라,", {
  x: 0.8, y: 2.45, w: 8.4, h: 0.9,
  fontSize: 22, fontFace: "Malgun Gothic", color: ICE, margin: 0
});

s11.addText("브랜치Q에게\n오늘 해야 할 일을 먼저 묻고\n하루를 시작하게 될 겁니다.", {
  x: 0.8, y: 3.45, w: 8.4, h: 1.3,
  fontSize: 24, fontFace: "Malgun Gothic", bold: true, color: WHITE, margin: 0
});

s11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.2, w: 10, h: 0.425, fill: { color: DEEP_NAVY } });
s11.addText("Thank you.", {
  x: 0.8, y: 5.2, w: 8.4, h: 0.425,
  fontSize: 14, fontFace: "Malgun Gothic", color: ICE, valign: "middle", margin: 0
});


// ============================================================
// SAVE
// ============================================================
const outPath = "C:/Users/김광현/Desktop/클로드작업물/브랜치Q_발표_v2.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
  console.log("Total slides: " + pres.slides.length);
}).catch(err => {
  console.error("Error:", err);
});
