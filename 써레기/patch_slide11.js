// 브랜치Q_발표_v3.pptx의 슬라이드 11만 교체 (다른 슬라이드 보존)
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function patch() {
  const mainPath = path.join(__dirname, "브랜치Q_발표_v3.pptx");
  const tempPath = path.join(__dirname, "slide11_temp.pptx");

  const mainBuf = fs.readFileSync(mainPath);
  const tempBuf = fs.readFileSync(tempPath);

  const mainZip = await JSZip.loadAsync(mainBuf);
  const tempZip = await JSZip.loadAsync(tempBuf);

  // 원본 slide11.xml 읽기 (구조/네임스페이스/레이아웃 참조 보존)
  const origXml = await mainZip.file("ppt/slides/slide11.xml").async("string");

  // 새 슬라이드(temp)에서 spTree와 배경만 추출
  const newSlideXml = await tempZip.file("ppt/slides/slide1.xml").async("string");

  const newSpTreeMatch = newSlideXml.match(/<p:spTree>[\s\S]*<\/p:spTree>/);
  if (!newSpTreeMatch) throw new Error("spTree를 찾을 수 없습니다");
  const newSpTree = newSpTreeMatch[0];

  const newBgMatch = newSlideXml.match(/<p:bg>[\s\S]*?<\/p:bg>/);

  // 원본 slide11에서 spTree만 교체 (나머지 구조 유지)
  let patchedXml = origXml.replace(/<p:spTree>[\s\S]*<\/p:spTree>/, newSpTree);

  // 배경색 교체 (있는 경우)
  if (newBgMatch) {
    patchedXml = patchedXml.replace(/<p:bg>[\s\S]*?<\/p:bg>/, newBgMatch[0]);
  }

  // 트랜지션이 없으면 추가, 있으면 교체
  const fadeTag = '<p:transition spd="med" advClick="1"><p:fade thruBlk="0"/></p:transition>';
  if (patchedXml.includes("<p:transition")) {
    patchedXml = patchedXml.replace(/<p:transition[\s\S]*?<\/p:transition>/, fadeTag);
  } else {
    patchedXml = patchedXml.replace("</p:cSld>", `</p:cSld>${fadeTag}`);
  }

  mainZip.file("ppt/slides/slide11.xml", patchedXml);
  // _rels, 네임스페이스, 레이아웃 참조 — 모두 원본 유지

  // 압축 설정 강제 없이 원본 구조 그대로 재생성
  const output = await mainZip.generateAsync({ type: "nodebuffer" });

  fs.writeFileSync(mainPath, output);
  console.log("✅ 슬라이드 11 패치 완료:", mainPath);
}

patch().catch(console.error);
