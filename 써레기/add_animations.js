/**
 * add_animations.js
 * PPTX OOXML 후처리 스크립트
 * - 전체 슬라이드: 페이드 트랜지션
 */

const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

const INPUT  = path.join(__dirname, "브랜치Q_발표_v3.pptx");
const OUTPUT = path.join(__dirname, "브랜치Q_발표_v3_animated.pptx");

// 슬라이드별 트랜지션 설정
// spd: "slow" | "med" | "fast"
// type: "fade" | "push" | "wipe"
const SLIDE_CONFIG = [
  { spd: "slow", type: "fade"  },  // S1 표지 — 천천히 등장
  { spd: "med",  type: "fade"  },  // S2
  { spd: "med",  type: "fade"  },  // S3
  { spd: "med",  type: "fade"  },  // S4
  { spd: "med",  type: "fade"  },  // S5
  { spd: "med",  type: "fade"  },  // S6
  { spd: "slow", type: "fade"  },  // S7 — 36시간 (검정 슬라이드, 느리게)
  { spd: "med",  type: "fade"  },  // S8
  { spd: "med",  type: "fade"  },  // S9
  { spd: "med",  type: "fade"  },  // S10
  { spd: "med",  type: "fade"  },  // S11
  { spd: "slow", type: "fade"  },  // S12 마무리
];

function makeTransition(cfg) {
  return `<p:transition spd="${cfg.spd}" advClick="1"><p:fade thruBlk="0"/></p:transition>`;
}

(async () => {
  console.log("📂 Reading PPTX:", INPUT);
  const data = fs.readFileSync(INPUT);
  const zip  = await JSZip.loadAsync(data);

  const slideFiles = Object.keys(zip.files)
    .filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });

  console.log(`📊 Slides found: ${slideFiles.length}`);

  for (let i = 0; i < slideFiles.length; i++) {
    const file = slideFiles[i];
    const cfg  = SLIDE_CONFIG[i] || { spd: "med", type: "fade" };
    console.log(`  S${i + 1}: ${file} — transition: ${cfg.type} (${cfg.spd})`);

    let xml = await zip.file(file).async("string");

    // 기존 transition 제거 후 새로 삽입
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, "");

    // </p:cSld> 바로 뒤에 transition 삽입
    const transition = makeTransition(cfg);
    xml = xml.replace(/(<\/p:cSld>)/, `$1\n  ${transition}`);

    zip.file(file, xml);
  }

  console.log("💾 Writing...");
  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  fs.writeFileSync(OUTPUT, out);
  console.log(`✅ Done: ${OUTPUT} (${(out.length / 1024).toFixed(0)} KB)`);
})();
