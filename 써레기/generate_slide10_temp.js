// PROCESS 슬라이드 — 10개 → 1,000개 리스트 비주얼
const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

const C = { navy:"1E2761", blue:"2563EB", white:"FFFFFF", black:"111111" };
const FONT = "맑은 고딕";

const s = pptx.addSlide();
s.background = { color: C.white };

// ── 상단 바 + 뱃지
s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:13.33, h:0.07, fill:{color:C.navy} });
const bw=2.0, bx=(13.33-bw)/2;
s.addShape(pptx.ShapeType.roundRect, { x:bx, y:0.17, w:bw, h:0.3, fill:{color:"E4EAFF"}, rectRadius:0.15 });
s.addText("PROCESS", { x:bx, y:0.17, w:bw, h:0.3, fontFace:FONT, fontSize:11, bold:true, color:C.navy, align:"center", valign:"middle", letterSpacing:2 });
s.addText("BranchQ", { x:11.8, y:7.22, w:1.3, h:0.24, fontFace:FONT, fontSize:8, color:"CCCCCC", align:"right" });

// ── 제목
s.addText("10개 질문으로 시작했습니다", {
  x:0, y:0.6, w:"100%", h:0.52,
  fontFace:FONT, fontSize:22, bold:true, color:C.black, align:"center",
});

// ══════════════════════════════
// 왼쪽: 10개 질문 카드 (2열 × 5행)
// ══════════════════════════════
const tagStyle = {
  "trsc":      { bg:"EFF6FF", border:"BFDBFE", text:"1D4ED8" },
  "bal":       { bg:"F0FDF4", border:"BBF7D0", text:"15803D" },
  "card":      { bg:"FFF7ED", border:"FED7AA", text:"C2410C" },
  "card_info": { bg:"FFFBEB", border:"FDE68A", text:"B45309" },
  "acct_info": { bg:"F5F3FF", border:"DDD6FE", text:"6D28D9" },
  "tax_inv":   { bg:"FEF2F2", border:"FECACA", text:"B91C1C" },
  "exchange":  { bg:"ECFEFF", border:"A5F3FC", text:"0E7490" },
  "stock":     { bg:"EEF2FF", border:"C7D2FE", text:"4338CA" },
};
const questions10 = [
  { tag:"trsc", q:"이번달 수시입출\n거래내역 보여줘" },
  { tag:"bal",  q:"지난달 은행별\n총입금액 알려줘" },
  { tag:"bal",  q:"현재 수시입출계좌\n잔액 보여줘" },
  { tag:"bal",  q:"이번달 말 전체\n가용자금 얼마야?" },
  { tag:"card", q:"이번달 법인카드\n사용금액 알려줘" },
  { tag:"card_info", q:"법인카드 한도 및\n잔여한도 보여줘" },
  { tag:"acct_info", q:"전체 계좌 목록\n보여줘" },
  { tag:"tax_inv",   q:"이번달 매입\n세금계산서 목록 보여줘" },
  { tag:"exchange",  q:"오늘 달러 환율\n알려줘" },
  { tag:"stock",     q:"현재 보유 증권\n현황 보여줘" },
];

const cardW=2.6, cardH=0.98, colGap=0.12, rowGap=0.1;
const leftX=0.3, startY=1.28;
questions10.forEach((item, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = leftX + col * (cardW + colGap);
  const y = startY + row * (cardH + rowGap);
  const st = tagStyle[item.tag];
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w:cardW, h:cardH,
    fill:{color:st.bg}, line:{color:st.border, width:1}, rectRadius:0.1,
  });
  s.addText(item.q, {
    x:x+0.15, y:y+0.08, w:cardW-0.3, h:cardH-0.16,
    fontFace:FONT, fontSize:12, color:"111111", valign:"middle",
  });
});

// ── 화살표
s.addText("→", {
  x:5.75, y:3.2, w:0.7, h:0.7,
  fontFace:FONT, fontSize:22, color:"777777", align:"center", valign:"middle",
});

// ══════════════════════════════
// 오른쪽: 1,000개 질문 리스트
// ══════════════════════════════
const rX=6.55, rY=1.18, rW=6.55, rH=6.1;

// 배경 카드
s.addShape(pptx.ShapeType.roundRect, {
  x:rX, y:rY, w:rW, h:rH,
  fill:{color:"EFF6FF"}, line:{color:"BFDBFE", width:1.5}, rectRadius:0.18,
});

// 헤더
s.addShape(pptx.ShapeType.roundRect, {
  x:rX+0.2, y:rY+0.12, w:2.1, h:0.38,
  fill:{color:C.blue}, rectRadius:0.12,
});
s.addText("1,000개 질문", {
  x:rX+0.2, y:rY+0.12, w:2.1, h:0.38,
  fontFace:FONT, fontSize:12, bold:true, color:C.white,
  align:"center", valign:"middle",
});
s.addText("실제 검증 질문 일부", {
  x:rX+2.45, y:rY+0.16, w:3.5, h:0.3,
  fontFace:FONT, fontSize:10, color:"6B7280", valign:"middle",
});

// 질문 리스트 (25개 표시, 빽빽하게)
const listQ = [
  "지난달 수시입출 거래내역 보여줘",           "10만원 이상 출금 거래만 보여줘",
  "최근 30일 동안 거래가 없던 계좌 찾아줘",   "월별로 수시입출 총입금액 추이 보여줘",
  "급여 관련 거래내역만 보여줘",              "은행별 순수익을 큰 순서로 정렬해줘",
  "이번달 법인카드 사용내역 보여줘",          "오늘 달러 환율 보여줘",
  "수시입출계좌 잔액은?",                    "이번달 매출 세금계산서 목록 보여줘",
  "지난달 예적금 거래내역 보여줘",            "이번달 카드 미결제 금액 알려줘",
  "대출 계좌 이자납부액 합계를 월별로 보여줘", "오늘 엔화 환율은?",
  "신한은행 수시입출 거래내역 보여줘",        "올해 만기되는 예적금 계좌를 조회해줘",
  "이번달 법인카드 승인내역 보여줘",          "가맹점 업종이 식음료인 카드 거래내역",
  "지난달 매출세금계산서 합계 알려줘",        "어제 수시입출계좌 잔액은?",
  "달러 수시입출계좌 잔액은?",               "씨앤에스 거래내역만 따로 보여줘",
  "이번달 매입 세금계산서 목록 보여줘",       "수시입출에서 거래건수 가장 많은 날은?",
  "은행별 외화 거래금액 보여줘",             "올해 USD 평균 환율은?",
];

// 2열 레이아웃: 짝수 인덱스=왼쪽열, 홀수 인덱스=오른쪽열 (배열이 쌍으로 구성됨)
const rowH=0.355, listX=rX+0.15, listW=rW-0.3, listStartY=rY+0.62;
const colW = (listW - 0.1) / 2; // 두 열의 너비 (0.1 = 열간 간격)

listQ.forEach((q, i) => {
  const col = i % 2;           // 0=왼쪽, 1=오른쪽
  const row = Math.floor(i / 2);
  const y = listStartY + row * rowH;
  if (y + rowH > rY + rH - 0.55) return;

  const x = listX + col * (colW + 0.1);

  // 줄 배경 (행 기준 교번 — 같은 row의 두 열이 동일 색)
  s.addShape(pptx.ShapeType.rect, {
    x, y, w:colW, h:rowH,
    fill:{color: row%2===0 ? "DBEAFE" : "EFF6FF"},
  });

  // 번호
  s.addText(String(i+1).padStart(2,"0"), {
    x:x+0.05, y, w:0.3, h:rowH,
    fontFace:FONT, fontSize:8.5, color:"93C5FD", bold:true, valign:"middle",
  });

  // 질문 텍스트
  s.addText(q, {
    x:x+0.36, y, w:colW-0.41, h:rowH,
    fontFace:FONT, fontSize:9.5, color:"1E3A5F", valign:"middle",
  });
});

// 하단 페이드 + "···" 표시
s.addShape(pptx.ShapeType.rect, {
  x:rX+0.05, y:rY+rH-0.6, w:rW-0.1, h:0.55,
  fill:{color:"EFF6FF"},
});
s.addText("· · · · ·  974개 더", {
  x:rX, y:rY+rH-0.52, w:rW, h:0.4,
  fontFace:FONT, fontSize:11, color:"93C5FD", align:"center", valign:"middle",
});

const outPath = require("path").join(__dirname, "slide10_temp.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("✅ slide10_temp.pptx 생성 완료");
}).catch(console.error);
