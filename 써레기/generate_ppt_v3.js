const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "김광현";
pptx.title = "BranchQ — 질문 하나에 36시간";

// ─── 색상 팔레트 ───
const C = {
  navy: "1E2761",
  navyLight: "CADCFC",
  blue: "2563eb",
  blueLight: "60a5fa",
  purple: "7c3aed",
  warm: "FFFFFF",          // ← 순백으로 통일 (밝고 깔끔)
  lightBlue: "F0F4FF",    // ← 카드 bg 등 연한 포인트
  white: "FFFFFF",
  black: "111111",
  gray: "555555",
  grayLight: "888888",
  grayDark: "333333",
  red: "EF4444",
  green: "16A34A",
  greenLight: "F0FDF4",
  greenBorder: "BBF7D0",
  yellow: "EAB308",
  redBg: "FEF2F2",
  redBorder: "FECACA",
};

const FONT = "맑은 고딕";

// ─────────────────────────────────────────────────
// 헬퍼: 콘텐츠 슬라이드 공통 프레임
//   - 상단 Navy 액센트 바 (0.07")
//   - 섹션 라벨 뱃지 (중앙)
//   - 우측 하단 BranchQ 브랜드 마크
// ─────────────────────────────────────────────────
const addContentFrame = (s, label) => {
  // 상단 navy 바
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.07,
    fill: { color: C.navy },
  });
  // 섹션 라벨 뱃지
  if (label) {
    const bw = 2.6;
    const bx = (13.33 - bw) / 2; // 5.365
    s.addShape(pptx.ShapeType.roundRect, {
      x: bx, y: 0.17, w: bw, h: 0.3,
      fill: { color: "E4EAFF" }, rectRadius: 0.15,
    });
    s.addText(label, {
      x: bx, y: 0.17, w: bw, h: 0.3,
      fontFace: FONT, fontSize: 9, bold: true, color: C.navy,
      align: "center", valign: "middle", letterSpacing: 2,
    });
  }
  // 우측 하단 브랜드 마크
  s.addText("BranchQ", {
    x: 11.8, y: 7.22, w: 1.3, h: 0.24,
    fontFace: FONT, fontSize: 8, color: "CCCCCC", align: "right",
  });
};

// ─────────────────────────────────────────────────
// 헬퍼: Navy 슬라이드 데코 원
//   - 우상단 + 좌하단 반투명 대형 원
// ─────────────────────────────────────────────────
const addNavyDeco = (s) => {
  // 우상단 대형 원
  s.addShape(pptx.ShapeType.ellipse, {
    x: 9.8, y: -2.4, w: 6.0, h: 6.0,
    fill: { color: "FFFFFF", transparency: 94 },
    line: { color: "4466CC", transparency: 72, width: 2 },
  });
  // 좌하단 중형 원
  s.addShape(pptx.ShapeType.ellipse, {
    x: -2.2, y: 4.8, w: 5.0, h: 5.0,
    fill: { color: "FFFFFF", transparency: 96 },
    line: { color: "3355BB", transparency: 78, width: 1 },
  });
};

// ════════════════════════════════════════
// S1: 표지
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  addNavyDeco(s);

  // 중앙 수직 강조 선
  s.addShape(pptx.ShapeType.rect, {
    x: 6.56, y: 1.6, w: 0.2, h: 0.06,
    fill: { color: C.blueLight },
  });

  s.addText("BRANCHQ PRESENTATION", {
    x: 0, y: 1.9, w: "100%", h: 0.4,
    fontFace: FONT, fontSize: 10, color: "6677AA",
    align: "center", letterSpacing: 4,
  });
  s.addText([
    { text: "질문 하나에 ", options: { color: C.white } },
    { text: "36시간", options: { color: C.blueLight } },
  ], {
    x: 0, y: 2.4, w: "100%", h: 1.2,
    fontFace: FONT, fontSize: 52, bold: true, align: "center",
  });
  s.addText("금융 AI가 정확한 답을 하기까지", {
    x: 0, y: 3.75, w: "100%", h: 0.5,
    fontFace: FONT, fontSize: 16, color: "8BAAC8", align: "center",
  });
  // 얇은 구분선
  s.addShape(pptx.ShapeType.rect, {
    x: 5.0, y: 4.45, w: 3.33, h: 0.02,
    fill: { color: "2A3A70" },
  });
  s.addText("김광현  |  브랜치Q 담당", {
    x: 0, y: 4.6, w: "100%", h: 0.4,
    fontFace: FONT, fontSize: 12, color: "556688", align: "center",
  });
}

// ════════════════════════════════════════
// S2: 오프닝
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "OPENING");

  s.addText("6개월 전,\n오래 붙잡고 있었던 질문 하나", {
    x: 1.5, y: 1.1, w: 10.3, h: 1.5,
    fontFace: FONT, fontSize: 36, bold: true, color: C.black, align: "center", lineSpacingMultiple: 1.3,
  });

  // 구분선
  s.addShape(pptx.ShapeType.rect, {
    x: 5.5, y: 2.8, w: 2.33, h: 0.03,
    fill: { color: "DDDDDD" },
  });

  s.addText(
    "오늘은 제가 약 6개월 전, 브랜치Q를 학습시키면서\n정말 오래 붙잡고 있었던 질문 하나를 말씀드리려고 합니다.\n\n지금 말씀드리는 건 현재의 이야기가 아니라,\n그때 제가 실제로 가장 많이 막혔던 순간의 이야기입니다.",
    {
      x: 2.5, y: 3.1, w: 8.3, h: 2.6,
      fontFace: FONT, fontSize: 15, color: C.gray, align: "center", lineSpacingMultiple: 1.7,
    }
  );
}

// ════════════════════════════════════════
// S3: 질문
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "QUESTION");

  s.addText('"최근 30일 동안\n거래가 없던 계좌 찾아줘"', {
    x: 1.2, y: 1.4, w: 10.9, h: 2.4,
    fontFace: FONT, fontSize: 40, bold: true, color: C.blue, align: "center", lineSpacingMultiple: 1.3,
  });

  // 이 질문 아래 메시지 카드
  s.addShape(pptx.ShapeType.roundRect, {
    x: 2.8, y: 4.15, w: 7.7, h: 1.75,
    fill: { color: "F8F9FF" }, line: { color: "E0E8FF", width: 1 }, rectRadius: 0.15,
    shadow: { type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.06 },
  });
  s.addText("처음 봤을 때는 누구나 이렇게 생각합니다.", {
    x: 2.8, y: 4.3, w: 7.7, h: 0.45,
    fontFace: FONT, fontSize: 16, color: C.grayDark, align: "center",
  });
  s.addText('"이 정도 질문은 AI가 당연히 잘하겠지."', {
    x: 2.8, y: 4.8, w: 7.7, h: 0.45,
    fontFace: FONT, fontSize: 15, color: C.grayLight, align: "center", italic: true,
  });
}

// ════════════════════════════════════════
// S4: AI 응답 — 좌측 ChatGPT 이미지 + 우측 편집 가능 텍스트 박스
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "AI RESPONSE");

  // ── 좌측: ChatGPT 이미지 영역 표시 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.35, y: 0.6, w: 7.2, h: 6.4,
    fill: { color: "F2F4F8" },
    line: { color: "C5CDE0", width: 1, dashType: "dash" },
    rectRadius: 0.12,
  });
  s.addText("📷  ChatGPT 화면 캡처", {
    x: 0.35, y: 6.55, w: 7.2, h: 0.35,
    fontFace: FONT, fontSize: 9, color: "AAAAAA", align: "center",
  });

  // ── 좌측: ChatGPT 창 이미지 ──
  s.addImage({
    path: path.join(__dirname, "mockup_s4.png"),
    x: 0.35, y: 0.6, w: 7.2, h: 6.4,
    sizing: { type: "contain", w: 7.2, h: 6.4 },
  });

  // ── 우측: "이건 정답이 아닙니다" 박스 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.9, y: 0.6, w: 5.1, h: 3.35,
    fill: { color: "FEF2F2" },
    line: { color: "EF4444", width: 2 },
    rectRadius: 0.14,
    shadow: { type: "outer", blur: 8, offset: 2, color: "EF4444", opacity: 0.08 },
  });
  // 빨간 태그
  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.12, y: 0.78, w: 1.72, h: 0.34,
    fill: { color: "EF4444" }, rectRadius: 0.08,
  });
  s.addText("이건 정답이 아닙니다", {
    x: 8.12, y: 0.78, w: 1.72, h: 0.34,
    fontFace: FONT, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle",
  });
  // 본문 제목
  s.addText("고객이 원하는 건\n\"방법 설명\"이 아닙니다", {
    x: 8.12, y: 1.25, w: 4.6, h: 1.0,
    fontFace: FONT, fontSize: 18, bold: true, color: "1A1A1A", lineSpacingMultiple: 1.3,
  });
  // 본문 설명
  s.addText([
    { text: "지금 당장 " },
    { text: "어떤 계좌가 몇 개인지", options: { color: C.red, bold: true } },
    { text: ",\n바로 판단할 수 있는 " },
    { text: "구조화된 숫자", options: { color: C.red, bold: true } },
    { text: "가 필요합니다." },
  ], {
    x: 8.12, y: 2.35, w: 4.6, h: 1.35,
    fontFace: FONT, fontSize: 14, color: "555555", lineSpacingMultiple: 1.6,
  });

  // ── 우측: "기대 vs 현실" 박스 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.9, y: 4.1, w: 5.1, h: 2.95,
    fill: { color: C.white },
    line: { color: "E5E7EB", width: 1 },
    rectRadius: 0.12,
    shadow: { type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.06 },
  });
  s.addText("기대 VS 현실", {
    x: 8.1, y: 4.25, w: 4.7, h: 0.35,
    fontFace: FONT, fontSize: 10, bold: true, color: "6B7280", letterSpacing: 1,
  });
  // 실제 답변 (빨간 박스)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.1, y: 4.7, w: 2.0, h: 2.0,
    fill: { color: "FEF2F2" }, line: { color: "FCA5A5", width: 1 }, rectRadius: 0.08,
  });
  s.addText("실제 답변", {
    x: 8.1, y: 4.77, w: 2.0, h: 0.28,
    fontFace: FONT, fontSize: 10, bold: true, color: "B91C1C", align: "center",
  });
  s.addText("SQL 쿼리를 활용하거나\n시스템 필터를 사용하면...", {
    x: 8.1, y: 5.1, w: 2.0, h: 1.4,
    fontFace: FONT, fontSize: 12, color: "B91C1C", lineSpacingMultiple: 1.5, valign: "top",
  });
  // 화살표
  s.addText("→", {
    x: 10.2, y: 5.4, w: 0.5, h: 0.5,
    fontFace: FONT, fontSize: 18, color: "9CA3AF", align: "center",
  });
  // 원하는 답변 (초록 박스)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 10.8, y: 4.7, w: 2.0, h: 2.0,
    fill: { color: "F0FDF4" }, line: { color: "86EFAC", width: 1 }, rectRadius: 0.08,
  });
  s.addText("원하는 답변", {
    x: 10.8, y: 4.77, w: 2.0, h: 0.28,
    fontFace: FONT, fontSize: 10, bold: true, color: "15803D", align: "center",
  });
  s.addText("거래 없는 계좌 12개\n계좌번호 목록 즉시 출력", {
    x: 10.8, y: 5.1, w: 2.0, h: 1.4,
    fontFace: FONT, fontSize: 12, color: "15803D", lineSpacingMultiple: 1.5, valign: "top",
  });
}

// ════════════════════════════════════════
// S5: 고객이 원하는 건
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "INSIGHT");

  s.addText([
    { text: "고객이 원하는 건\n", options: { color: C.black } },
    { text: "설명이 아니라, 바로 판단할 수 있는 데이터", options: { color: C.blue } },
  ], {
    x: 0, y: 1.0, w: "100%", h: 1.7,
    fontFace: FONT, fontSize: 30, bold: true, align: "center", lineSpacingMultiple: 1.3,
  });

  const items = [
    { num: "1", desc: "어떤 계좌가\n몇 개인지" },
    { num: "2", desc: "어느 계좌가\n멈춰 있는지" },
    { num: "3", desc: "바로 판단할 수\n있는 형태" },
  ];
  items.forEach((item, i) => {
    const x = 2.0 + i * 3.3;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.2, w: 2.9, h: 2.7,
      fill: { color: "F8F9FF" }, line: { color: "DDE4FF", width: 1 },
      rectRadius: 0.18, shadow: { type: "outer", blur: 6, offset: 3, color: "000000", opacity: 0.06 },
    });
    // 상단 navy 포인트 바
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 1.05, y: 3.2, w: 0.8, h: 0.06,
      fill: { color: C.blue }, rectRadius: 0.03,
    });
    s.addText(item.num, {
      x, y: 3.38, w: 2.9, h: 0.8,
      fontFace: FONT, fontSize: 32, bold: true, color: C.blue, align: "center",
    });
    s.addText(item.desc, {
      x, y: 4.3, w: 2.9, h: 1.2,
      fontFace: FONT, fontSize: 15, color: C.grayDark, align: "center", lineSpacingMultiple: 1.5,
    });
  });
}

// ════════════════════════════════════════
// S6: 프롬프트 길게
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "LIMITATION");

  s.addText("프롬프트를 길게 쓰면 해결될까?", {
    x: 0, y: 0.88, w: "100%", h: 0.7,
    fontFace: FONT, fontSize: 28, bold: true, color: C.black, align: "center",
  });

  // ── 좌측: 기대 + 프롬프트 예시 ──
  s.addText("기대", {
    x: 1.2, y: 1.78, w: 5.2, h: 0.38,
    fontFace: FONT, fontSize: 13, bold: true, color: C.blue,
  });
  s.addText("설명을 붙이고, 예시를 넣고,\n조건을 더 자세히 적으면 될 줄 알았습니다.", {
    x: 1.2, y: 2.2, w: 5.2, h: 0.75,
    fontFace: FONT, fontSize: 12, color: "555555", lineSpacingMultiple: 1.6,
  });

  // 프롬프트 예시 박스 (코드 에디터 스타일)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 1.2, y: 3.05, w: 5.3, h: 2.5,
    fill: { color: "1E1E2E" }, line: { color: "3A3A5C", width: 1 }, rectRadius: 0.12,
  });
  s.addShape(pptx.ShapeType.ellipse, { x: 1.38, y: 3.22, w: 0.13, h: 0.13, fill: { color: "FF5F57" } });
  s.addShape(pptx.ShapeType.ellipse, { x: 1.57, y: 3.22, w: 0.13, h: 0.13, fill: { color: "FEBC2E" } });
  s.addShape(pptx.ShapeType.ellipse, { x: 1.76, y: 3.22, w: 0.13, h: 0.13, fill: { color: "28C840" } });
  s.addText("prompt.txt", {
    x: 1.95, y: 3.16, w: 2.0, h: 0.26,
    fontFace: "Consolas", fontSize: 9, color: "9999BB",
  });
  s.addText(
    "최근 30일 동안 거래가 없는 계좌를 찾아줘.\n" +
    "여기서 30일은 오늘 기준 정확히 30일 전(캘린더 기준)이고,\n" +
    "거래는 입금·출금·자동이체 모두 포함해.\n" +
    "단, 내부 이체는 제외하고 외부 거래만 봐줘.\n" +
    "수시 입출금 계좌만 해당하고, 법인·개인 명의\n" +
    "계좌 모두 포함해서 회사명 / 계좌번호 /\n" +
    "마지막 거래일 순으로 정리해줘.",
    {
      x: 1.35, y: 3.48, w: 5.0, h: 1.9,
      fontFace: "Consolas", fontSize: 10, color: "A8B4D0", lineSpacingMultiple: 1.55, valign: "top",
    }
  );

  // ── 우측: 현실 ──
  s.addText("현실", {
    x: 7.2, y: 1.78, w: 5.0, h: 0.38,
    fontFace: FONT, fontSize: 13, bold: true, color: C.red,
  });
  s.addText(
    "LLM 모델 버전이 바뀌면 답이 흔들렸고,\n업무 영역이 확장되면 결과가 달라졌습니다.",
    {
      x: 7.2, y: 2.2, w: 5.0, h: 0.9,
      fontFace: FONT, fontSize: 13, color: "555555", lineSpacingMultiple: 1.65,
    }
  );

  // 흔들린 답변 예시 라벨
  s.addText("같은 질문, 다른 답변", {
    x: 7.2, y: 3.25, w: 5.0, h: 0.32,
    fontFace: FONT, fontSize: 11, bold: true, color: C.grayDark, letterSpacing: 1,
  });

  // 답변 예시 1
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.2, y: 3.65, w: 5.1, h: 0.9,
    fill: { color: "FFF7ED" }, line: { color: "FED7AA", width: 1 }, rectRadius: 0.1,
  });
  s.addText("3월 12일", {
    x: 7.32, y: 3.71, w: 1.2, h: 0.23,
    fontFace: FONT, fontSize: 9, color: "92400E", bold: true,
  });
  s.addText("계좌는 총 12개입니다.", {
    x: 7.32, y: 3.96, w: 4.8, h: 0.42,
    fontFace: FONT, fontSize: 13, color: "44403C",
  });

  // 답변 예시 2
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.2, y: 4.65, w: 5.1, h: 0.9,
    fill: { color: "FFF1F2" }, line: { color: "FECDD3", width: 1 }, rectRadius: 0.1,
  });
  s.addText("3월 13일 (모델 업데이트 후)", {
    x: 7.32, y: 4.71, w: 3.5, h: 0.23,
    fontFace: FONT, fontSize: 9, color: "9F1239", bold: true,
  });
  s.addText("거래 내역이 없는 계좌는 확인되지 않습니다.", {
    x: 7.32, y: 4.96, w: 4.8, h: 0.42,
    fontFace: FONT, fontSize: 13, color: "44403C",
  });

  // ── 하단 강조 박스 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 1.8, y: 5.75, w: 9.7, h: 1.15,
    fill: { color: C.black }, rectRadius: 0.14,
  });
  s.addText([
    { text: "이 질문 하나를 붙잡고 거의 ", options: { color: C.white } },
    { text: "36시간", options: { color: C.blueLight, bold: true, fontSize: 18 } },
    { text: "을 씨름한 뒤에야\n세 가지가 동시에 맞아야 한다는 걸 알게 됐습니다.", options: { color: C.white } },
  ], {
    x: 1.8, y: 5.75, w: 9.7, h: 1.15,
    fontFace: FONT, fontSize: 14, align: "center", valign: "middle", lineSpacingMultiple: 1.5,
  });
}

// ════════════════════════════════════════
// S6b: 36시간 강조
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.black };

  // 배경 블루 글로우 원
  s.addShape(pptx.ShapeType.ellipse, {
    x: 3.5, y: 0.5, w: 6.3, h: 6.3,
    fill: { color: "1a3a7e", transparency: 90 },
    line: { color: "2563eb", transparency: 88, width: 1 },
  });

  s.addText([
    { text: "36", options: { fontSize: 124, bold: true, color: C.white } },
    { text: "시간", options: { fontSize: 42, color: "888888" } },
  ], {
    x: 0, y: 1.7, w: "100%", h: 2.2,
    fontFace: FONT, align: "center",
  });
  s.addText("이 질문 하나를 해결하기 위해 붙잡고 있었던 시간", {
    x: 0, y: 4.1, w: "100%", h: 0.5,
    fontFace: FONT, fontSize: 16, color: "888888", align: "center",
  });
}

// ════════════════════════════════════════
// S7: 세 가지 원칙
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  addNavyDeco(s);

  // 상단 섹션 라벨 (navy 슬라이드용 별도 스타일)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 5.365, y: 0.2, w: 2.6, h: 0.3,
    fill: { color: "0A1440" }, rectRadius: 0.15,
    line: { color: "2A3A70", width: 1 },
  });
  s.addText("3 PRINCIPLES", {
    x: 5.365, y: 0.2, w: 2.6, h: 0.3,
    fontFace: FONT, fontSize: 9, bold: true, color: C.blueLight,
    align: "center", valign: "middle", letterSpacing: 2,
  });

  s.addText("세 가지가 동시에 맞아야 한다", {
    x: 0, y: 0.7, w: "100%", h: 0.7,
    fontFace: FONT, fontSize: 28, bold: true, color: C.white, align: "center",
  });

  const cards = [
    {
      num: "01", cat: "환경 설정", tag: "DSL",
      title: '"최근 30일" — 기준이 필요하다',
      body: "오늘? 영업일? 정산일?\nAI가 틀린 게 아니라\n우리가 기준을 정의하지 않았던 것",
      arrow: "→ 업무 규칙이 반영된 언어(DSL)로\n   변환하는 구조를 만들었다",
    },
    {
      num: "02", cat: "의도 파악", tag: "Intent",
      title: '"거래"가 뭔지 AI는 모른다',
      body: "입금만? 출금도? 자동이체까지?\n정확히 정하지 않으면\n겉으로 맞아 보이는데 실제로 틀린 답",
      arrow: "→ 가장 오래 막혔던 부분",
    },
    {
      num: "03", cat: "답변 표현", tag: "Format",
      title: "데이터를 맞게 가져와도\n문장으로 길게 나오면 쓸 수 없다",
      body: '"계좌는 총 12개이며..."\n→ 고객은 바로 판단할 수 없다',
      arrow: "→ 숫자는 숫자답게,\n   계좌는 계좌답게, 구조화",
    },
  ];

  cards.forEach((c, i) => {
    const x = 0.55 + i * 4.2;
    const cw = 3.9;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.65, w: cw, h: 5.55,
      fill: { color: "0A1440" }, line: { color: "2A3A70", width: 1 }, rectRadius: 0.16,
    });
    // 카드 상단 컬러 바
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.22, y: 1.65, w: cw - 0.44, h: 0.05,
      fill: { color: C.blueLight }, rectRadius: 0.02,
    });
    s.addText(c.num, {
      x: x + 0.22, y: 1.88, w: 1, h: 0.38,
      fontFace: FONT, fontSize: 10, color: C.blueLight, letterSpacing: 2,
    });
    s.addText(c.cat, {
      x: x + 0.22, y: 2.28, w: 2.2, h: 0.35,
      fontFace: FONT, fontSize: 12, color: "8899AA",
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.22, y: 2.65, w: 0.85, h: 0.32,
      fill: { color: "1A2E6E" }, rectRadius: 0.04,
    });
    s.addText(c.tag, {
      x: x + 0.22, y: 2.65, w: 0.85, h: 0.32,
      fontFace: FONT, fontSize: 10, color: C.blueLight, align: "center", valign: "middle",
    });
    s.addText(c.title, {
      x: x + 0.22, y: 3.12, w: cw - 0.44, h: 1.0,
      fontFace: FONT, fontSize: 15, bold: true, color: C.white, lineSpacingMultiple: 1.3,
    });
    // 구분선
    s.addShape(pptx.ShapeType.rect, {
      x: x + 0.22, y: 4.18, w: cw - 0.44, h: 0.02,
      fill: { color: "1E2D60" },
    });
    s.addText(c.body, {
      x: x + 0.22, y: 4.28, w: cw - 0.44, h: 1.45,
      fontFace: FONT, fontSize: 12, color: "9AABCC", lineSpacingMultiple: 1.6,
    });
    s.addText(c.arrow, {
      x: x + 0.22, y: 5.8, w: cw - 0.44, h: 1.0,
      fontFace: FONT, fontSize: 11, color: C.blueLight, lineSpacingMultiple: 1.4,
    });
  });
}

// ════════════════════════════════════════
// S8: 인용
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  addNavyDeco(s);

  // 대형 인용 부호 (글리프)
  s.addText("\u201C", {
    x: 0, y: 1.0, w: "100%", h: 1.2,
    fontFace: "Georgia", fontSize: 100, color: "233580", align: "center",
  });
  s.addText([
    { text: "질문을 이해하는 것과\n사용자가 바로 판단할 수 있도록\n결과를 완성하는 건\n", options: { color: C.white } },
    { text: "완전히 다른 문제", options: { color: C.blueLight } },
  ], {
    x: 1.5, y: 2.1, w: 10.3, h: 3.5,
    fontFace: FONT, fontSize: 32, bold: true, align: "center", lineSpacingMultiple: 1.4,
  });

  // 하단 소스 표시
  s.addText("— 36시간의 경험에서", {
    x: 0, y: 6.2, w: "100%", h: 0.4,
    fontFace: FONT, fontSize: 12, color: "4466AA", align: "center", italic: true,
  });
}

// ════════════════════════════════════════
// S9a: 10개 질문으로 시작했습니다
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "PROCESS");

  s.addText("10개 질문으로 시작했습니다", {
    x: 0, y: 0.78, w: "100%", h: 0.58,
    fontFace: FONT, fontSize: 26, bold: true, color: C.black, align: "center",
  });

  // 카테고리별 태그 색상
  const tagStyle = {
    "trsc":      { bg: "EFF6FF", border: "BFDBFE", text: "1D4ED8" },
    "bal":       { bg: "F0FDF4", border: "BBF7D0", text: "15803D" },
    "card":      { bg: "FFF7ED", border: "FED7AA", text: "C2410C" },
    "card_info": { bg: "FFFBEB", border: "FDE68A", text: "B45309" },
    "acct_info": { bg: "F5F3FF", border: "DDD6FE", text: "6D28D9" },
    "tax_inv":   { bg: "FEF2F2", border: "FECACA", text: "B91C1C" },
    "exchange":  { bg: "ECFEFF", border: "A5F3FC", text: "0E7490" },
    "stock":     { bg: "EEF2FF", border: "C7D2FE", text: "4338CA" },
  };

  const questions = [
    { tag: "trsc",      q: "이번달 수시입출 거래내역 보여줘" },
    { tag: "trsc",      q: "지난달 은행별 총입금액 알려줘" },
    { tag: "bal",       q: "현재 수시입출계좌 잔액 보여줘" },
    { tag: "bal",       q: "이번달 말 전체 가용자금 얼마야?" },
    { tag: "card",      q: "이번달 법인카드 사용금액 알려줘" },
    { tag: "card_info", q: "법인카드 한도 및 잔여한도 보여줘" },
    { tag: "acct_info", q: "전체 계좌 목록 보여줘" },
    { tag: "tax_inv",   q: "이번달 매입 세금계산서 목록 보여줘" },
    { tag: "exchange",  q: "오늘 달러 환율 알려줘" },
    { tag: "stock",     q: "현재 보유 증권 현황 보여줘" },
  ];

  // 2열 × 5행 카드 배치
  questions.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 0.28 + col * 3.12;
    const cy = 1.55 + row * 1.08;
    const ts = tagStyle[item.tag];

    s.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: cy, w: 2.95, h: 0.92,
      fill: { color: ts.bg }, line: { color: ts.border, width: 1 }, rectRadius: 0.1,
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: cx + 0.1, y: cy + 0.1, w: 1.05, h: 0.26,
      fill: { color: ts.border }, rectRadius: 0.04,
    });
    s.addText("[" + item.tag + "]", {
      x: cx + 0.1, y: cy + 0.1, w: 1.05, h: 0.26,
      fontFace: "Consolas", fontSize: 8, bold: true, color: ts.text,
      align: "center", valign: "middle",
    });
    s.addText(item.q, {
      x: cx + 0.1, y: cy + 0.44, w: 2.75, h: 0.4,
      fontFace: FONT, fontSize: 11, color: "2A2A2A",
    });
  });

  // 우측: 화살표 + 1,000 박스
  s.addText("→", {
    x: 6.55, y: 2.85, w: 0.75, h: 0.75,
    fontFace: FONT, fontSize: 30, color: "CCCCCC", align: "center",
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.45, y: 1.55, w: 5.55, h: 4.2,
    fill: { color: C.blue }, rectRadius: 0.2,
    shadow: { type: "outer", blur: 14, offset: 4, color: "2563eb", opacity: 0.22 },
  });
  s.addText("1,000", {
    x: 7.45, y: 1.9, w: 5.55, h: 2.0,
    fontFace: FONT, fontSize: 72, bold: true, color: C.white, align: "center",
  });
  s.addText("테스트 질문 세트", {
    x: 7.45, y: 3.95, w: 5.55, h: 0.48,
    fontFace: FONT, fontSize: 17, color: "BDD0FF", align: "center",
  });
  s.addText("실패 분석 → 업무별 분류 → 반복 추가", {
    x: 7.45, y: 4.52, w: 5.55, h: 0.38,
    fontFace: FONT, fontSize: 10, color: "8AAAE8", align: "center",
  });
  s.addText("10개에서 출발", {
    x: 7.45, y: 5.0, w: 5.55, h: 0.38,
    fontFace: FONT, fontSize: 10, color: "6688CC", align: "center",
  });
}

// ════════════════════════════════════════
// S9b: 97% 정답률 (결과)
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "RESULT");

  s.addText("1,000개 질문으로 검증한 결과", {
    x: 0, y: 0.78, w: "100%", h: 0.58,
    fontFace: FONT, fontSize: 26, bold: true, color: C.black, align: "center",
  });

  s.addText("예전: 질문 하나에 36시간  →  지금: 10분마다 질문-답변 세트 생성·검증", {
    x: 0, y: 1.45, w: "100%", h: 0.38,
    fontFace: FONT, fontSize: 12, color: C.grayDark, align: "center",
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 1.5, y: 2.0, w: 10.33, h: 0.02,
    fill: { color: "EEEEEE" },
  });

  // 97% 대형 임팩트 카드
  s.addShape(pptx.ShapeType.roundRect, {
    x: 1.8, y: 2.2, w: 9.7, h: 3.35,
    fill: { color: "FFFBEB" }, line: { color: "FDE68A", width: 1.5 }, rectRadius: 0.2,
    shadow: { type: "outer", blur: 10, offset: 3, color: "EAB308", opacity: 0.12 },
  });
  s.addText("97%", {
    x: 1.8, y: 2.3, w: 9.7, h: 2.1,
    fontFace: FONT, fontSize: 96, bold: true, color: C.yellow, align: "center",
  });
  s.addText("현재 정답률", {
    x: 1.8, y: 4.45, w: 9.7, h: 0.45,
    fontFace: FONT, fontSize: 18, bold: true, color: "92400E", align: "center",
  });

  // 100% 목표 뱃지
  s.addShape(pptx.ShapeType.roundRect, {
    x: 5.2, y: 5.75, w: 2.93, h: 0.38,
    fill: { color: "F0FDF4" }, line: { color: "86EFAC", width: 1 }, rectRadius: 0.15,
  });
  s.addText("목표 →  100%", {
    x: 5.2, y: 5.75, w: 2.93, h: 0.38,
    fontFace: FONT, fontSize: 12, bold: true, color: "166534",
    align: "center", valign: "middle",
  });

  s.addText([
    { text: "금융에서는 ", options: { color: C.grayLight } },
    { text: "99%도 불안합니다.", options: { color: C.black, bold: true } },
    { text: " 고객은 항상 100%를 기대합니다.", options: { color: C.grayLight } },
  ], {
    x: 0, y: 6.55, w: "100%", h: 0.38,
    fontFace: FONT, fontSize: 13, align: "center",
  });
}

// ════════════════════════════════════════
// S10: Before & After (구 S9 → 뒤로 이동 — 클라이맥스)
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.warm };
  addContentFrame(s, "BEFORE & AFTER");

  s.addText("같은 질문, 완전히 다른 결과", {
    x: 0, y: 0.6, w: "100%", h: 0.6,
    fontFace: FONT, fontSize: 26, bold: true, color: C.black, align: "center",
  });
  s.addText("6개월 전에는 되묻기만 했던 질문이, 지금은 즉시 구조화된 데이터로 나옵니다.", {
    x: 0, y: 1.22, w: "100%", h: 0.38,
    fontFace: FONT, fontSize: 12, color: C.grayLight, align: "center",
  });

  // Before 라벨
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.75, w: 1.15, h: 0.3,
    fill: { color: "FEE2E2" }, rectRadius: 0.06,
  });
  s.addText("6개월 전", {
    x: 0.5, y: 1.75, w: 1.15, h: 0.3,
    fontFace: FONT, fontSize: 9, bold: true, color: C.red, align: "center", valign: "middle",
  });

  // ── Before 이미지 영역 표시 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.3, y: 2.15, w: 4.8, h: 5.0,
    fill: { color: "FEF5F5" },
    line: { color: "FDB8B8", width: 1, dashType: "dash" },
    rectRadius: 0.12,
  });
  s.addText("📷  BranchQ 화면 (6개월 전)", {
    x: 0.3, y: 6.8, w: 4.8, h: 0.3,
    fontFace: FONT, fontSize: 9, color: "E08080", align: "center",
  });

  // Before 이미지
  s.addImage({
    path: path.join(__dirname, "mockup_s9_before.png"),
    x: 0.3, y: 2.15, w: 4.8, h: 5.0,
    sizing: { type: "contain", w: 4.8, h: 5.0 },
  });

  // 화살표
  s.addText("→", {
    x: 5.15, y: 4.3, w: 0.8, h: 0.6,
    fontFace: FONT, fontSize: 28, color: "CCCCCC", align: "center",
  });

  // After 라벨
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.1, y: 1.75, w: 0.95, h: 0.3,
    fill: { color: "DCFCE7" }, rectRadius: 0.06,
  });
  s.addText("현재", {
    x: 6.1, y: 1.75, w: 0.95, h: 0.3,
    fontFace: FONT, fontSize: 9, bold: true, color: C.green, align: "center", valign: "middle",
  });

  // ── After 이미지 영역 표시 ──
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.0, y: 2.1, w: 7.0, h: 5.1,
    fill: { color: "F2FCF5" },
    line: { color: "86EFAC", width: 1, dashType: "dash" },
    rectRadius: 0.12,
  });
  s.addText("📷  BranchQ 화면 (현재)", {
    x: 6.0, y: 6.83, w: 7.0, h: 0.3,
    fontFace: FONT, fontSize: 9, color: "4A9A65", align: "center",
  });

  // After 이미지
  s.addImage({
    path: path.join(__dirname, "mockup_s9_after.png"),
    x: 6.0, y: 2.1, w: 7.0, h: 5.1,
    sizing: { type: "contain", w: 7.0, h: 5.1 },
  });
}

// ════════════════════════════════════════
// S11: 마무리
// ════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: C.navy };
  addNavyDeco(s);

  // BranchQ 로고 (중앙 정렬)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 5.27, y: 0.85, w: 0.52, h: 0.52,
    fill: { color: C.blue }, rectRadius: 0.1,
  });
  s.addText("B", {
    x: 5.27, y: 0.85, w: 0.52, h: 0.52,
    fontFace: FONT, fontSize: 17, bold: true, color: C.white, align: "center", valign: "middle",
  });
  s.addText("BranchQ", {
    x: 5.88, y: 0.85, w: 2.18, h: 0.52,
    fontFace: FONT, fontSize: 21, bold: true, color: C.white, valign: "middle",
  });

  s.addText([
    { text: "1년 안에 그 기업들은\n", options: { color: "AABBD0" } },
    { text: "브랜치Q에게 오늘 할 일을 먼저 묻고", options: { color: C.blueLight, bold: true } },
    { text: "\n하루를 시작하게 될 겁니다.", options: { color: "AABBD0" } },
  ], {
    x: 1.5, y: 1.55, w: 10.3, h: 1.8,
    fontFace: FONT, fontSize: 22, bold: true, align: "center", lineSpacingMultiple: 1.4,
  });

  // 구분선
  s.addShape(pptx.ShapeType.rect, {
    x: 0.4, y: 3.45, w: 12.53, h: 0.02,
    fill: { color: "2A3A70" },
  });

  // 고객사 라벨
  s.addText("사용 기업", {
    x: 0, y: 3.55, w: "100%", h: 0.32,
    fontFace: FONT, fontSize: 9, bold: true, color: "4466AA",
    align: "center", letterSpacing: 2,
  });

  // ── 로고 그리드 4×3 = 12 플레이스홀더 ──
  const logoColors = [
    "EEF2FF", "F0FDF4", "FFF7ED", "F5F3FF",
    "ECFEFF", "FEF2F2", "FFFBEB", "EFF6FF",
    "F0FDF4", "F5F3FF", "FFF7ED", "EEF2FF",
  ];
  const logoTextColors = [
    "3730A3", "166534", "9A3412", "6D28D9",
    "0E7490", "991B1B", "92400E", "1D4ED8",
    "15803D", "5B21B6", "C2410C", "312E81",
  ];

  const tw = 2.82, th = 1.05;
  const gx = 0.245, gy = 0.12;
  const sx = 0.3, sy = 3.95;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const lx = sx + c * (tw + gx);
      const ly = sy + r * (th + gy);
      s.addShape(pptx.ShapeType.roundRect, {
        x: lx, y: ly, w: tw, h: th,
        fill: { color: logoColors[idx] },
        line: { color: "AABCDC", width: 1, dashType: "dash" },
        rectRadius: 0.1,
      });
      s.addText("로고", {
        x: lx, y: ly, w: tw, h: th,
        fontFace: FONT, fontSize: 11, color: logoTextColors[idx],
        align: "center", valign: "middle",
      });
    }
  }

  // 하단 닫는 텍스트
  s.addText('"오늘 뭐부터 확인하면 돼?"', {
    x: 0, y: 7.12, w: "100%", h: 0.3,
    fontFace: FONT, fontSize: 10, color: "334466", align: "center", italic: true,
  });
}

// ─── 저장 ───
const outPath = path.join(__dirname, "브랜치Q_발표_v3.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("✅ PPTX saved:", outPath);
}).catch(err => {
  console.error("❌ Error:", err);
});
