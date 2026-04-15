# BranchQ 배포 가이드

## 1. 정적 빌드 (서버 불필요)

```bash
# 빌드
npm run build

# 결과
dist/
├── index.html       (0.7KB)
├── assets/
│   ├── index-*.css  (31KB, gzip 6.6KB)
│   └── index-*.js   (248KB, gzip 75KB)
└── favicon.svg
```

### 배포 방법
- **파일 서버**: dist/ 폴더를 아무 HTTP 서버에 올리기
- **더블클릭**: dist/index.html을 브라우저에서 직접 열기 (base: './' 설정됨)
- **내부 서버**: `npx serve dist` (간단한 정적 서버)

---

## 2. Vercel 배포

### 방법 A: CLI
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포 (프로젝트 루트에서)
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 B: GitHub 연동
1. GitHub에 코드 push
2. vercel.com → New Project → GitHub 레포 선택
3. Framework: Vite 자동 감지
4. 자동 빌드 + 배포

**설정 파일**: `vercel.json` (SPA rewrites 포함)

---

## 3. Netlify 배포

### 방법 A: CLI
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 빌드 후 배포
npm run build
netlify deploy --prod --dir=dist
```

### 방법 B: 드래그 & 드롭
1. `npm run build`
2. app.netlify.com → Sites → dist/ 폴더 드래그

### 방법 C: GitHub 연동
1. GitHub에 코드 push
2. Netlify → New site from Git → 레포 선택
3. Build command: `npm run build`
4. Publish directory: `dist`

**설정 파일**: `netlify.toml` (SPA redirects 포함)

---

## 4. ZIP 패키지 전달

```bash
npm run handoff
# → BranchQ_Handoff.zip 생성
```

개발자가 받으면:
```bash
unzip BranchQ_Handoff.zip
cd BranchQ_Handoff
npm install
npm run dev
```

---

## 5. 환경 요구사항

| 항목 | 최소 버전 |
|------|----------|
| Node.js | 18+ |
| npm | 9+ |
| 브라우저 | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |

## 6. 빌드 최적화 참고

| 항목 | 크기 |
|------|------|
| JS (gzip) | ~76KB |
| CSS (gzip) | ~7KB |
| 총 전송 크기 | ~83KB |
| 외부 폰트 | Noto Sans KR + Inter (Google Fonts CDN) |

폰트는 CDN에서 로드하므로 오프라인 환경에서는 시스템 폰트로 폴백됩니다.
