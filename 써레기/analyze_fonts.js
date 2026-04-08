const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function analyze() {
  const buf = fs.readFileSync(path.join(__dirname, "브랜치Q_발표_v3_animated_r1.pptx"));
  const zip = await JSZip.loadAsync(buf);

  const slideFiles = Object.keys(zip.files)
    .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });

  for (const filePath of slideFiles) {
    const xml = await zip.file(filePath).async("string");
    const slideNum = filePath.match(/slide(\d+)/)[1];

    // sz 800/900 텍스트 추출
    const smallRe = /<a:rPr[^>]* sz="([89]\d\d)"[^>]*\/?>(?:<[^>]+>)*<a:t>([^<]+)<\/a:t>/g;
    let m;
    while ((m = smallRe.exec(xml)) !== null) {
      const pt = parseInt(m[1]) / 100;
      const txt = m[2].trim();
      if (txt) console.log(`S${slideNum} [작은글자 ${pt}pt]: ${txt}`);
    }

    // CCCCCC / 888888 / AAAAAA 색상 근처 텍스트
    // 색상 정보와 텍스트를 묶어서 찾기
    const runRe = /<a:r>(?:<a:rPr[^>]*>(?:[\s\S]*?)<\/a:rPr>)?<a:t>([^<]+)<\/a:t><\/a:r>/g;
    const colorRe = /srgbClr val="(CCCCCC|888888|AAAAAA|999999|BBBBBB|DDDDDD)"/;
    while ((m = runRe.exec(xml)) !== null) {
      const runXml = m[0];
      const colorMatch = colorRe.exec(runXml);
      if (colorMatch) {
        const txt = m[1].trim();
        if (txt) console.log(`S${slideNum} [연한색 #${colorMatch[1]}]: ${txt}`);
      }
    }
  }
}

analyze().catch(console.error);
