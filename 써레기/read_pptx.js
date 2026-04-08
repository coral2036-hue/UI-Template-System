const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function extractPPTX(filePath) {
  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);

  // Collect all slide files sorted by slide number
  const slideFiles = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  console.log(`Total slides found: ${slideFiles.length}`);
  console.log('='.repeat(60));

  for (const slideFile of slideFiles) {
    const slideNum = slideFile.match(/slide(\d+)\.xml/)[1];
    const xmlContent = await zip.files[slideFile].async('string');

    // Extract all text from <a:t> tags (DrawingML text elements)
    const textMatches = xmlContent.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
    const texts = textMatches
      .map(tag => tag.replace(/<[^>]+>/g, '').trim())
      .filter(t => t.length > 0);

    console.log(`\n[Slide ${slideNum}] - ${slideFile}`);
    console.log('-'.repeat(40));
    if (texts.length === 0) {
      console.log('(no text content found)');
    } else {
      // Group consecutive texts into lines (paragraph-like grouping)
      texts.forEach(t => console.log('  ' + t));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Verification: ${slideFiles.length === 9 ? '✓ All 9 slides present' : `✗ Expected 9 slides, found ${slideFiles.length}`}`);
}

const pptxPath = path.resolve(__dirname, '브랜치Q_발표.pptx');
extractPPTX(pptxPath).catch(err => {
  console.error('Error reading PPTX:', err.message);
  process.exit(1);
});
