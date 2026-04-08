// 슬라이드 11 — 100% 완전 강조 버전
const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

const C = {
  navy:  "1E2761",
  blue:  "2563EB",
  white: "FFFFFF",
  black: "111111",
  gray:  "555555",
  grayL: "888888",
};
const FONT = "맑은 고딕";

const s = pptx.addSlide();
s.background = { color: C.white };

// ── 상단 네이비 바
s.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: 13.33, h: 0.07,
  fill: { color: C.navy },
});

// ── 섹션 뱃지
const bw = 2.0, bx = (13.33 - bw) / 2;
s.addShape(pptx.ShapeType.roundRect, {
  x: bx, y: 0.17, w: bw, h: 0.3,
  fill: { color: "E4EAFF" }, rectRadius: 0.15,
});
s.addText("RESULT", {
  x: bx, y: 0.17, w: bw, h: 0.3,
  fontFace: FONT, fontSize: 11, bold: true, color: C.navy,
  align: "center", valign: "middle", letterSpacing: 2,
});

// ── BranchQ 브랜드마크
s.addText("BranchQ", {
  x: 11.8, y: 7.22, w: 1.3, h: 0.24,
  fontFace: FONT, fontSize: 8, color: "CCCCCC", align: "right",
});

// ────────────────────────────────────────────────────
// 메인: 100% 히어로 섹션 (전체 중앙)
// ────────────────────────────────────────────────────

// 파란 배경 카드 (전체 슬라이드 너비의 80%)
const cardX = 0.8, cardW = 11.73, cardH = 5.2;
s.addShape(pptx.ShapeType.roundRect, {
  x: cardX, y: 0.65, w: cardW, h: cardH,
  fill: { color: C.blue }, rectRadius: 0.25,
});

// 100% 대형 숫자
s.addText("100%", {
  x: cardX, y: 0.85, w: cardW, h: 3.2,
  fontFace: FONT, fontSize: 130, bold: true, color: C.white,
  align: "center", valign: "middle",
});

// "완벽한 정답" 부제목
s.addText("완벽한 정답", {
  x: cardX, y: 3.85, w: cardW, h: 0.6,
  fontFace: FONT, fontSize: 20, bold: true, color: "BDD0FF",
  align: "center",
});

// "금융 AI가 나아가야 할 기준" 설명
s.addText("금융 AI가 나아가야 할 기준", {
  x: cardX, y: 4.5, w: cardW, h: 0.45,
  fontFace: FONT, fontSize: 14, color: "8AAAE8",
  align: "center",
});

// ────────────────────────────────────────────────────
// 하단: 97% 현재 상태 (작게, 참고용)
// ────────────────────────────────────────────────────

// 구분선
s.addShape(pptx.ShapeType.rect, {
  x: 1.5, y: 6.05, w: 10.33, h: 0.015,
  fill: { color: "EEEEEE" },
});

// 왼쪽: 현재 97%
s.addText("현재 정답률", {
  x: 1.5, y: 6.2, w: 3.5, h: 0.32,
  fontFace: FONT, fontSize: 12, color: C.grayL, align: "left",
});
s.addText("97%", {
  x: 4.8, y: 6.18, w: 1.5, h: 0.36,
  fontFace: FONT, fontSize: 18, bold: true, color: "D97706", align: "left",
});

// 화살표
s.addText("→", {
  x: 6.2, y: 6.2, w: 0.5, h: 0.32,
  fontFace: FONT, fontSize: 14, color: "BBBBBB", align: "center",
});

// 오른쪽: 목표 100%
s.addText("목표", {
  x: 6.8, y: 6.2, w: 1.5, h: 0.32,
  fontFace: FONT, fontSize: 12, color: C.grayL, align: "left",
});
s.addText("100%", {
  x: 8.1, y: 6.18, w: 1.8, h: 0.36,
  fontFace: FONT, fontSize: 18, bold: true, color: C.blue, align: "left",
});

// 오른쪽 끝: 한 줄 메시지
s.addText("금융에서는 99%도 불안합니다.", {
  x: 9.8, y: 6.22, w: 3.3, h: 0.28,
  fontFace: FONT, fontSize: 11, color: C.grayL, align: "right",
});

const outPath = path.join(__dirname, "slide11_temp.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("✅ slide11_temp.pptx 생성 완료 (100% 강조 버전)");
}).catch(console.error);
