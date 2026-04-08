// 브랜치Q_발표_v3_animated.pptx 의 모든 애니메이션 제거
// → 브랜치Q_발표_v3_animated.pptx 덮어쓰기
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function removeAnimations() {
  const srcPath = path.join(__dirname, "브랜치Q_발표_v3_animated.pptx");
  const buf = fs.readFileSync(srcPath);
  const zip = await JSZip.loadAsync(buf);

  let count = 0;

  // 모든 slide XML 순회
  const slideFiles = Object.keys(zip.files).filter(
    (f) => f.match(/^ppt\/slides\/slide\d+\.xml$/)
  );

  for (const filePath of slideFiles) {
    let xml = await zip.file(filePath).async("string");

    // 애니메이션/트랜지션 제거
    const before = xml.length;
    xml = xml.replace(/<p:timing>[\s\S]*?<\/p:timing>/g, "");
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, "");
    xml = xml.replace(/<p:transition[^>]*\/>/g, "");

    if (xml.length !== before) {
      count++;
      zip.file(filePath, xml);
      console.log(`  ✓ ${filePath} — 애니메이션 제거`);
    }
  }

  const output = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(srcPath, output);
  console.log(`\n✅ 완료: ${count}개 슬라이드 애니메이션 제거 → ${srcPath}`);
}

removeAnimations().catch(console.error);
