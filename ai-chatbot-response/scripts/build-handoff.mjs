/**
 * BranchQ 개발자 전달용 ZIP 패키지 빌더
 * 실행: npm run handoff
 */
import { execSync } from 'child_process';
import { cpSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PARENT = resolve(ROOT, '..');

const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const HANDOFF_NAME = `BranchQ_Handoff_${today}`;
const OUT_DIR = resolve(PARENT, HANDOFF_NAME);
const ZIP_PATH = resolve(PARENT, `${HANDOFF_NAME}.zip`);

console.log(`\n📦 BranchQ Handoff Package Builder`);
console.log(`   Output: ${HANDOFF_NAME}.zip\n`);

// Clean previous
if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
if (existsSync(ZIP_PATH)) rmSync(ZIP_PATH, { force: true });

mkdirSync(OUT_DIR, { recursive: true });

// ─── 1. Copy source files ───
console.log('1. Copying source files...');
const FILES_TO_COPY = [
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'eslint.config.js',
];

for (const f of FILES_TO_COPY) {
  const src = join(ROOT, f);
  if (existsSync(src)) {
    cpSync(src, join(OUT_DIR, f));
    console.log(`   ✓ ${f}`);
  }
}

// Copy src/
cpSync(join(ROOT, 'src'), join(OUT_DIR, 'src'), {
  recursive: true,
  filter: (s) => !s.includes('node_modules'),
});
console.log('   ✓ src/');

// Copy public/
if (existsSync(join(ROOT, 'public'))) {
  cpSync(join(ROOT, 'public'), join(OUT_DIR, 'public'), { recursive: true });
  console.log('   ✓ public/');
}

// ─── 2. Copy spec documents ───
console.log('2. Copying spec documents...');
const DOCS_SPECS = join(OUT_DIR, 'docs', 'specs');
mkdirSync(DOCS_SPECS, { recursive: true });

// Find specs dir (handle Korean path)
let specsDir = null;
try {
  const parentItems = readdirSync(PARENT);
  const specsDirName = parentItems.find((d) => d.includes('branchq-docs') || d.includes('피그마'));
  if (specsDirName) {
    specsDir = join(PARENT, specsDirName);
    console.log(`   Found specs: ${specsDirName}`);
  }
} catch (e) {
  console.warn('   ⚠ Could not scan parent directory');
}

if (specsDir && existsSync(specsDir)) {
  const SPEC_FILES = [
    '00_master_prompt_v2.md',
    '01_design_v2.md',
    '02_react_prompt_v2.md',
    '03_design_spec_v2.md',
  ];

  // Also look for Korean-named files
  try {
    const allFiles = readdirSync(specsDir);
    const aiGuide = allFiles.find((f) => f.includes('응답블록') || f.includes('AI_'));
    if (aiGuide) SPEC_FILES.push(aiGuide);

    for (const f of SPEC_FILES) {
      const src = join(specsDir, f);
      if (existsSync(src)) {
        cpSync(src, join(DOCS_SPECS, f));
        console.log(`   ✓ ${f}`);
      }
    }
  } catch (e) {
    console.warn(`   ⚠ Error copying specs: ${e.message}`);
  }
} else {
  console.warn('   ⚠ Specs directory not found, skipping');
}

// Copy workflow guide
const wfSrc = join(ROOT, 'docs', 'WORKFLOW_GUIDE.md');
if (existsSync(wfSrc)) {
  cpSync(wfSrc, join(OUT_DIR, 'docs', 'WORKFLOW_GUIDE.md'));
  console.log('   ✓ WORKFLOW_GUIDE.md');
}

// ─── 3. Generate README ───
console.log('3. Generating README...');

let pkg;
try {
  pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
} catch {
  pkg = { dependencies: {}, devDependencies: {} };
}

const README = `# BranchQ AI Chatbot Frontend

K-Branch Corporate Fund Management AI Chatbot UI Prototype

## Quick Start

\`\`\`bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
\`\`\`

## Tech Stack
- React ${pkg.dependencies?.react || '^19'}
- TypeScript ${pkg.devDependencies?.typescript || '~5.9'}
- Vite ${pkg.devDependencies?.vite || '^8'}
- Tailwind CSS ${pkg.devDependencies?.tailwindcss || '^4'}

## Structure
\`\`\`
src/
  types/       - Type definitions
  constants/   - Categories, models, tokens
  data/        - Mock scene data (6 scenarios)
  utils/       - Format utilities
  layout/      - Sidebar, Header, InputBar
  chat/        - ChatArea, MessageBubble, WelcomeScreen
  blocks/      - BlockRenderer + 15 block components
  modals/      - Modal system (M1-M6)
  hooks/       - Custom hooks
  components/  - SubPanel, Toast
  App.tsx      - Main app
\`\`\`

## Screens: S0(Welcome), S1(General), S2(Analysis), S3(Forecast), S4(Anomaly), S5(Consult), S6(Report)
## Blocks: text-content, report-header, number-stat, summary-cards, data-table, bar-chart, line-chart, alert-box, callout, pattern-analysis, steps, key-value, approval-box, source-box, related-questions, date-range

## Design Rules
- Korean text: Noto Sans KR / Numbers: Inter
- Colors: CSS variables --color-brq-*
- Layout: Sidebar(70px) + Header(56px) + ChatArea + InputBar(56px)

See docs/ for full specifications.

Generated: ${new Date().toISOString().slice(0, 10)}
`;

writeFileSync(join(OUT_DIR, 'README.md'), README, 'utf-8');
console.log('   ✓ README.md');

// ─── 4. Create ZIP ───
console.log('4. Creating ZIP...');

try {
  // PowerShell Compress-Archive with escaped paths
  const psCmd = `Compress-Archive -Path '${OUT_DIR.replace(/'/g, "''")}' -DestinationPath '${ZIP_PATH.replace(/'/g, "''")}' -Force`;
  execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'pipe', timeout: 30000 });
  console.log(`\n✅ Package created: ${HANDOFF_NAME}.zip`);

  // Clean temp dir after successful ZIP
  rmSync(OUT_DIR, { recursive: true, force: true });
  console.log('   Temp folder cleaned.');
} catch (e) {
  console.log(`\n⚠ ZIP creation via PowerShell failed.`);
  console.log(`   Handoff folder available at: ${OUT_DIR}`);
  console.log(`   You can manually zip it or run:`);
  console.log(`   powershell Compress-Archive -Path "${OUT_DIR}" -DestinationPath "${ZIP_PATH}"`);
}

console.log('\nDone! 🎉\n');
