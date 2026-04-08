const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require("docx");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "발표_대본.txt"), "utf8");
const lines = src.split("\n");

const children = [];
let inTips = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // ================================================================ 구분선 → 건너뜀
  if (trimmed.startsWith("===")) continue;

  // 발표 팁 섹션 헤더
  if (trimmed === "발표 팁") {
    inTips = true;
    children.push(new Paragraph({
      text: "발표 팁",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }));
    continue;
  }

  // ────────── 구분선 → 슬라이드 구분 공백
  if (trimmed.startsWith("────")) {
    children.push(new Paragraph({ text: "", spacing: { before: 300 } }));
    continue;
  }

  // S숫자. 슬라이드 제목 → Heading
  if (/^S\d+\./.test(trimmed)) {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: trimmed,
          bold: true,
          size: 26,
          color: "1E2761",
        }),
      ],
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 100, after: 100 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "2563EB", space: 4 },
      },
    }));
    continue;
  }

  // 괄호 지문 → 이탤릭 회색
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    children.push(new Paragraph({
      children: [
        new TextRun({
          text: trimmed,
          italics: true,
          color: "888888",
          size: 20,
        }),
      ],
      spacing: { before: 60, after: 60 },
    }));
    continue;
  }

  // 팁 항목 (• 로 시작)
  if (trimmed.startsWith("•")) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: trimmed, size: 20, color: "444444" }),
      ],
      bullet: { level: 0 },
      spacing: { before: 60, after: 60 },
    }));
    continue;
  }

  // 빈 줄
  if (trimmed === "") {
    children.push(new Paragraph({ text: "", spacing: { before: 60 } }));
    continue;
  }

  // 따옴표 강조 대사
  if (trimmed.startsWith('"') || trimmed.startsWith('"')) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: trimmed, bold: true, size: 22, color: "2563EB" }),
      ],
      spacing: { before: 80, after: 80 },
    }));
    continue;
  }

  // 일반 본문
  children.push(new Paragraph({
    children: [
      new TextRun({ text: trimmed, size: 22, color: "222222" }),
    ],
    spacing: { before: 60, after: 60 },
  }));
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "맑은 고딕", size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children,
    },
  ],
});

const outPath = path.join(__dirname, "발표_대본.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log("✅ 완료:", outPath);
}).catch(console.error);
