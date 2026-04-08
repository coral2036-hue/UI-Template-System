// r1.pptx 가독성 개선: 작은 글자 키우기 + 연한 색 진하게
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function fix() {
  const srcPath = path.join(__dirname, "브랜치Q_발표_v3_animated_r1.pptx");
  const outPath = path.join(__dirname, "브랜치Q_발표_v3_r2.pptx");
  const buf = fs.readFileSync(srcPath);
  const zip = await JSZip.loadAsync(buf);

  const slideFiles = Object.keys(zip.files)
    .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  // 어두운 배경 슬라이드 (여기선 색상 수정 안 함)
  const darkBgSlides = new Set(["1", "7", "9"]);

  for (const filePath of slideFiles) {
    let xml = await zip.file(filePath).async("string");
    const slideNum = filePath.match(/slide(\d+)/)[1];
    const isDark = darkBgSlides.has(slideNum);

    // ── 1. 섹션 뱃지 9pt → 11pt (OPENING, QUESTION 등 letterSpacing 있는 레이블)
    // addContentFrame의 badge label: sz="900" bold letterSpc 포함
    xml = xml.replace(/ sz="900"/g, ' sz="1100"');

    // ── 2. BranchQ 브랜드마크 8pt 는 유지 (sz="800" → 그대로)
    // 이미 변경 안 함

    // ── 3. 밝은 배경 슬라이드에서 연한 텍스트 색상 진하게
    if (!isDark) {
      // #888888 → #444444 (중간 회색 → 진한 회색)
      xml = xml.replace(/val="888888"/g, 'val="444444"');
      // #AAAAAA → #555555
      xml = xml.replace(/val="AAAAAA"/g, 'val="555555"');
      // #999999 → #555555
      xml = xml.replace(/val="999999"/g, 'val="555555"');
    }

    // ── 4. 화살표 → 가 너무 연한 경우 (S10, S12 의 CCCCCC 화살표)
    // CCCCCC는 BranchQ 브랜드마크에도 쓰이므로 → 기호만 타겟
    // → 텍스트 앞의 CCCCCC만 교체 (rPr sz 작은 것 중 화살표)
    // 대신: 모든 슬라이드에서 화살표 전용 처리 (a:t 에 → 있는 run의 CCCCCC)
    // 정규식으로 → 텍스트를 가진 run의 CCCCCC 색상만 진하게
    xml = xml.replace(
      /(<a:rPr[^>]*>(?:[^<]|<(?!\/a:rPr))*)<a:solidFill><a:srgbClr val="CCCCCC"\/><\/a:solidFill>((?:[^<]|<(?!\/a:rPr))*<\/a:rPr><a:t>→<\/a:t>)/g,
      '$1<a:solidFill><a:srgbClr val="777777"/></a:solidFill>$2'
    );

    zip.file(filePath, xml);
  }

  const output = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(outPath, output);
  console.log("✅ 완료:", outPath);
}

fix().catch(console.error);
