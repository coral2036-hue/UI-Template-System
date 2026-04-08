const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        BorderStyle, PageBreak } = require("docx");
const fs = require("fs");

const FONT = "맑은 고딕";

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: "1E2761" })],
  });
}

function slideLabel(num, title) {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
    children: [
      new TextRun({ text: `[슬라이드 ${num}] `, font: FONT, size: 20, bold: true, color: "2563EB" }),
      new TextRun({ text: title, font: FONT, size: 20, bold: true, color: "333333" }),
    ],
  });
}

function script(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: FONT, size: 22, color: "333333" })],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 400 },
    children: [new TextRun({ text: `* ${text}`, font: FONT, size: 18, italic: true, color: "888888" })],
  });
}

function blank() {
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: "1E2761" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // ─── 타이틀 ───
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "BranchQ 발표 대본", font: FONT, size: 36, bold: true, color: "1E2761" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "김광현  |  브랜치Q 담당  |  12슬라이드 기준  |  r6", font: FONT, size: 20, color: "888888" })],
      }),

      // ─── S1 ───
      slideLabel("1", "표지 — 질문 하나에 36시간"),
      note("화면: 네이비 배경, 큰 타이틀"),
      script("안녕하세요. 브랜치Q 담당 김광현입니다."),
      script("오늘은 \"질문 하나에 36시간\"이라는 제목으로 간단하게 제 사례를 발표하겠습니다."),
      blank(),

      // ─── S2 ───
      slideLabel("2", "오프닝 — 6개월 전 이야기"),
      script("오늘은 제가 약 6개월 전, 브랜치Q를 학습시키면서 정말 오래 붙잡고 있었던 질문 하나를 말씀드리려고 합니다."),
      script("지금 말씀드리는 건 현재의 이야기가 아니라, 그때 제가 실제로 가장 많이 막혔던 순간의 이야기입니다."),
      blank(),

      // ─── S3 ───
      slideLabel("3", "질문 제시"),
      script("질문은 아주 단순했습니다."),
      script("\"최근 30일 동안 거래가 없던 계좌 찾아줘.\""),
      script("처음 봤을 때는 누구나 이렇게 생각합니다."),
      script("\"이 정도 질문은 AI가 당연히 잘하겠지.\""),
      blank(),

      // ─── S4 ───
      slideLabel("4", "AI 응답 — 이건 정답이 아닙니다"),
      script("실제로 GPT나 Claude에 그대로 넣어보면 꽤 자연스러운 답이 나옵니다."),
      script("예를 들면, \"최근 30일간 거래 내역이 없는 계좌를 확인하려면 거래 데이터를 조회해야 합니다...\""),
      script("겉으로 보면 좋은 답변입니다."),
      script("그런데 금융에서는 이게 정답이 아닙니다."),
      blank(),

      // ─── S5 ───
      slideLabel("5", "고객이 원하는 건"),
      script("고객이 원하는 건 설명이 아니라,"),
      script("지금 당장 어떤 계좌가 몇 개인지, 어느 계좌가 멈춰 있는지, 바로 판단할 수 있는 데이터입니다."),
      blank(),

      // ─── S6 ───
      slideLabel("6", "프롬프트 한계 — 기대 vs 현실"),
      script("저도 처음엔 프롬프트를 길게 쓰면 해결될 거라고 생각했습니다."),
      script("설명을 붙이고, 예시를 넣고, 조건을 더 자세히 적으면 AI가 더 정확해질 거라고 믿었습니다."),
      script("그런데 실제로는 그렇지 않았습니다."),
      script("LLM 모델 버전이 바뀌면 답이 흔들렸고, 업무 영역이 확장되면 결과가 달라졌습니다."),
      blank(),

      // ─── S7 ───
      slideLabel("7", "36시간"),
      note("화면: 검정 배경, 36시간 큰 숫자, 야근 묘사"),
      script("이 질문 하나를 붙잡고 거의 36시간을 씨름한 뒤에야"),
      script("저는 세 가지가 동시에 맞아야 한다는 걸 알게 됐습니다."),
      note("잠시 멈춤 — 숫자가 주는 무게감을 느끼게"),
      blank(),

      // ─── S8 ───
      slideLabel("8", "세 가지 원칙 — DSL / Intent / Format"),
      script("첫 번째는 환경 설정입니다."),
      script("\"최근 30일\"이라는 표현도 사실 기준이 필요합니다. 오늘 기준인지, 마지막 영업일 기준인지, 시스템 마지막 정산일 기준인지."),
      script("AI가 틀린 게 아니라, 우리가 기준을 정의하지 않았던 겁니다."),
      script("그래서 업무 기준을 DSL로 다시 정리했습니다. 즉, 자연어를 그대로 해석하는 게 아니라 업무 규칙이 반영된 언어로 한 번 변환하는 구조를 만든 겁니다."),
      blank(),
      script("두 번째는 의도 파악입니다."),
      script("\"거래 없는 계좌\"에서 거래가 뭔지 AI는 모릅니다. 입금만 없는 건지, 출금도 없는 건지, 자동이체까지 포함할 건지."),
      script("이걸 정확히 정하지 않으면 겉으로는 맞아 보이는데 실제로는 틀린 답이 나옵니다."),
      script("제가 가장 오래 막혔던 부분도 바로 여기였습니다."),
      blank(),
      script("세 번째는 답변 표현 방식입니다."),
      script("데이터를 맞게 가져와도 결과가 문장으로 길게 나오면 금융에서는 쓸 수 없습니다."),
      script("\"최근 30일간 거래 없는 계좌는 총 12개이며...\" 이렇게 길게 나오면 고객은 바로 판단할 수 없습니다."),
      script("숫자는 숫자답게, 계좌는 계좌답게, 한눈에 구조화돼야 합니다."),
      blank(),

      // ─── S9 ───
      slideLabel("9", "인용 — 완전히 다른 문제"),
      script("결국 깨달은 건, 질문을 이해하는 것과 사용자가 바로 판단할 수 있도록 결과를 완성하는 건 완전히 다른 문제라는 점이었습니다."),
      blank(),

      // ─── S10 ───
      slideLabel("10", "Before & After"),
      script("그 이후로 같은 질문도 완전히 달라졌습니다."),
      script("6개월 전에는 흔들렸던 질문이, 지금은 안정적으로 같은 형태로 나옵니다."),
      blank(),

      // ─── S11 ───
      slideLabel("11", "1,000개 질문으로 검증하다"),
      script("그리고 이 경험이 쌓이면서 저희 팀은 질문을 하나씩 관리하기 시작했습니다."),
      script("처음엔 10개였습니다. 실패할 때마다 질문을 추가했고, 업무별로 나누고, 오류 유형별로 다시 분류했습니다."),
      script("지금은 1,000개의 테스트 질문 세트를 운영하고 있습니다."),
      script("예전에는 질문 하나 잡는 데 36시간이 걸렸다면, 지금은 10분마다 하나씩 질문-답변 세트를 만들고 검증합니다."),
      blank(),
      script("현재 브랜치Q 정답률은 97%입니다. 그리고 이번 주 안에 100%까지 올릴 예정입니다."),
      script("왜 100%냐고요? 금융에서는 99%도 불안합니다. 고객은 항상 100%를 기대하기 때문입니다."),
      blank(),

      // ─── S12 ───
      slideLabel("12", "마무리 — 에이전트 비전"),
      script("지금 만 개 기업이 매일 아침 브랜치를 켜고 하루를 시작합니다."),
      script("저는 확신합니다."),
      script("1년 안에 그 기업들은 브랜치를 켜는 것에서 끝나는 게 아니라, 브랜치Q에게 오늘 해야 할 일을 먼저 묻고 하루를 시작하게 될 겁니다."),
      blank(),
      script("다음 이야기는 그 과정을 함께 만들어온 김다빈 프로가 이어서 말씀드리겠습니다."),
    ],
  }],
});

const outPath = "C:/Users/김광현/Desktop/브랜치혁신부/4월23일 발표자료/발표 자료 초안_김광현_r6.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Saved:", outPath);
});
