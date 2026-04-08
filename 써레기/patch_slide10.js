// slide10_temp.pptx의 spTree를 r2.pptx slide10에 패치
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function patch() {
  // 1. slide10_temp.pptx에서 새 spTree 추출
  const tempBuf = fs.readFileSync(path.join(__dirname, "slide10_temp.pptx"));
  const tempZip = await JSZip.loadAsync(tempBuf);

  // slide10_temp는 slide1만 있음
  const tempXml = await tempZip.file("ppt/slides/slide1.xml").async("string");

  // spTree 추출
  const spTreeMatch = tempXml.match(/<p:spTree>[\s\S]*?<\/p:spTree>/);
  if (!spTreeMatch) { console.error("spTree not found in temp"); return; }
  const newSpTree = spTreeMatch[0];
  console.log("✅ 새 spTree 추출 완료 (길이:", newSpTree.length, ")");

  // 2. r2.pptx 읽기
  const r2Path = path.join(__dirname, "브랜치Q_발표_v3_r2.pptx");
  const r2Buf = fs.readFileSync(r2Path);
  const r2Zip = await JSZip.loadAsync(r2Buf);

  // slide10.xml 읽기
  const slide10Xml = await r2Zip.file("ppt/slides/slide10.xml").async("string");
  console.log("✅ r2.pptx slide10.xml 읽기 완료 (길이:", slide10Xml.length, ")");

  // spTree 교체
  const patchedXml = slide10Xml.replace(/<p:spTree>[\s\S]*?<\/p:spTree>/, newSpTree);
  if (patchedXml === slide10Xml) {
    console.error("❌ spTree 교체 실패");
    return;
  }
  console.log("✅ spTree 교체 완료");

  // 3. r2.pptx 업데이트 및 저장
  r2Zip.file("ppt/slides/slide10.xml", patchedXml);

  const outBuf = await r2Zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const outPath = path.join(__dirname, "브랜치Q_발표_v3_r3.pptx");
  fs.writeFileSync(outPath, outBuf);
  console.log("✅ 저장 완료:", outPath);
}

patch().catch(console.error);
