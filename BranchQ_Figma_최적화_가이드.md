# Branch Q — Figma 재작업 최적화 가이드
> 이번 작업에서 발생한 토큰 낭비 패턴을 분석해 작성한 "다음에 처음부터 다시 한다면" 기준 가이드.
> 이 문서를 프롬프트 앞에 붙이거나 작업 지시서로 활용하면 된다.

---

## 핵심 원칙 3가지

```
1. 생성 즉시 검증 — 프레임 1개 생성 → 스크린샷 → 확인 → 다음
2. 높이는 읽어서 계산 — 추정 금지, 항상 node.height 읽기 후 다음 y 결정
3. 공통 유틸 먼저 — 폰트/스택/겹침감지 함수를 0번째로 작성
```

---

## Phase 0 — 사전 준비 (실제 작업 전 반드시 먼저 실행)

### 0-1. 공통 유틸 함수 선언
> 이 코드를 **가장 먼저** Figma에 실행한다. 이후 모든 작업에서 재사용.

```javascript
// ── 폰트 로드 (한글/영문 분리) ──
async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    figma.loadFontAsync({ family: "Noto Sans KR", style: "Regular" }),
    figma.loadFontAsync({ family: "Noto Sans KR", style: "Medium" }),
    figma.loadFontAsync({ family: "Noto Sans KR", style: "Bold" }),
  ]);
}

// ── 텍스트 생성 (폰트 자동 분기) ──
async function makeText(parent, chars, opts = {}) {
  await loadFonts();
  const t = figma.createText();
  parent.appendChild(t);
  const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(chars);
  t.fontName = {
    family: isKorean ? "Noto Sans KR" : "Inter",
    style: opts.style || "Regular"
  };
  t.characters = chars;
  t.fontSize = opts.size || 14;
  if (opts.color) t.fills = [{ type: "SOLID", color: opts.color }];
  if (opts.width) t.textAutoResize = "HEIGHT", t.resize(opts.width, t.height);
  return t;
}

// ── 블록 순차 스택 (y 자동 계산) ──
function stackBlocks(parent, blocks, gap = 16) {
  let curY = gap;
  for (const b of blocks) {
    b.y = curY;
    curY += b.height + gap;
  }
  parent.resize(parent.width, curY);
  return curY;
}

// ── 겹침 감지 ──
function detectOverlaps(page) {
  const frames = page.children.filter(n => n.type === "FRAME");
  const hits = [];
  for (let i = 0; i < frames.length; i++) {
    for (let j = i + 1; j < frames.length; j++) {
      const a = frames[i], b = frames[j];
      if (a.x < b.x + b.width && a.x + a.width > b.x &&
          a.y < b.y + b.height && a.y + a.height > b.y) {
        hits.push(`${a.name} ↔ ${b.name}`);
      }
    }
  }
  return hits.length ? hits : "겹침 없음";
}
```

### 0-2. 캔버스 좌표 상수 선언
> y값을 추정하지 않고 **상수로 고정** 후 작업 시작.

```javascript
const CANVAS = {
  ROW1_Y:  0,       // 웰컴 화면 (1440×900)
  ROW2_Y:  1100,    // 시나리오 S1~S3 (여유 200px)
  ROW3_Y:  8000,    // 시나리오 S4~S6 (S1 최대 높이 후 갱신)
  ROW4_Y:  10000,   // 모달 M1~M6
  ROW5_Y:  11800,   // 빌더/이벤트
  GAP_X:   1540,    // 화면 간 x 간격
  DESC_X_OFFSET: 1540, // 화면 우측 DESC 시작 x
};
// ※ ROW3_Y 이하는 실제 S1~S3 생성 후 bottom 읽어 갱신
```

### 0-3. 디자인 토큰 상수 선언
```javascript
const C = {
  primary:  { r: 0.118, g: 0.161, b: 0.231 }, // #1E293B
  accent:   { r: 0.145, g: 0.388, b: 0.922 }, // #2563EB
  success:  { r: 0.086, g: 0.639, b: 0.290 }, // #16A34A
  warning:  { r: 0.792, g: 0.541, b: 0.016 }, // #CA8A04
  error:    { r: 0.863, g: 0.149, b: 0.149 }, // #DC2626
  white:    { r: 1, g: 1, b: 1 },
  gray50:   { r: 0.976, g: 0.980, b: 0.984 },
  gray100:  { r: 0.953, g: 0.957, b: 0.961 },
  gray200:  { r: 0.898, g: 0.906, b: 0.918 },
  gray400:  { r: 0.612, g: 0.639, b: 0.686 },
  gray600:  { r: 0.294, g: 0.333, b: 0.388 },
  gray900:  { r: 0.067, g: 0.094, b: 0.153 },
};
```

---

## Phase 1 — 공통 컴포넌트 먼저 만들고 검증

### 순서: 재사용 컴포넌트 → 검증 → 복제

```
1. NS카드 1개 → 스크린샷 확인 → OK면 4개 복제
2. ShareRow 1개 → 확인 → 전 화면에 복제
3. 사이드바 1개 → 확인 → 전 화면에 복제
4. 헤더 1개 → 확인 → 전 화면에 복제
```

> **핵심:** 공통 요소를 처음 한 번만 정확하게 만들고 복제한다.
> 각각 새로 만들면 오차가 누적되고 수정도 N배가 된다.

### NS카드 표준 생성 코드
```javascript
async function makeNSCard(parent, x, y, value, label, diff, diffPositive) {
  await loadFonts();
  const card = figma.createFrame();
  card.name = `NS-${label}`;
  parent.appendChild(card);
  card.x = x; card.y = y;
  card.resize(173, 90);
  card.fills = [{ type: "SOLID", color: C.white }];
  card.cornerRadius = 8;
  card.strokes = [{ type: "SOLID", color: C.gray200 }];
  card.strokeWeight = 1;

  // 값 텍스트 (Inter Bold, 상단)
  const vt = await makeText(card, value, { size: 22, style: "Bold", color: C.accent });
  vt.x = 12; vt.y = 12;

  // 라벨 (Noto Sans KR, 값 아래)
  const lt = await makeText(card, label, { size: 13, color: C.gray600, width: 149 });
  lt.x = 12; lt.y = vt.y + vt.height + 4;

  // diff 뱃지 (라벨 아래)
  if (diff) {
    const dt = await makeText(card, diff, { size: 12, style: "Bold",
      color: diffPositive ? C.success : C.error });
    dt.x = 12; dt.y = lt.y + lt.height + 4;
    card.resize(173, dt.y + dt.height + 10);
  }
  return card;
}
```

---

## Phase 2 — 화면 생성 순서 (토큰 최소화 순)

```
① S0-Welcome (1440×900, 고정 높이) → 스크린샷
② S0 서브패널 3종 → 스크린샷 한 번에
③ S1 일반질의 → 턴 1개씩 생성·확인 → 완성
④ S2~S3 → S1 구조 재사용, 데이터만 교체
⑤ S4~S6 (비교적 단순) → 한 번에 생성 가능
⑥ M1~M6 모달 (독립 요소) → 한 번에 생성
⑦ B1 빌더, E1~E4 이벤트
⑧ DESC 11개 → 모든 화면 확정 후 일괄 작성
```

> **DESC를 마지막에 쓰는 이유:** 화면이 수정될 때마다 DESC도 재작성해야 함.
> 화면이 확정된 뒤 한 번에 작성하면 중복 작업이 없다.

---

## Phase 3 — 멀티턴 채팅 화면 생성 패턴 (S1 기준)

> 가장 토큰을 많이 잡아먹는 구간. 반드시 아래 패턴을 따른다.

```javascript
// 턴 1개 생성 후 bottom 반환 → 다음 턴이 이 값으로 y 결정
async function createTurn(chatArea, turnName, isUser, content, startY) {
  const turn = figma.createFrame();
  turn.name = turnName;
  chatArea.appendChild(turn);
  turn.x = 0;
  turn.y = startY;
  turn.resize(chatArea.width, 100); // 임시 높이

  if (isUser) {
    await buildUserBubble(turn, content);
  } else {
    await buildAIResponse(turn, content); // 블록 생성 + stackBlocks() 내부 호출
  }

  // ✅ 실제 height 읽어서 반환 (추정 금지)
  return turn.y + turn.height;
}

// 사용 예
let y = 24;
y = await createTurn(chatArea, "User-1", true, "법인카드 주간 사용내역 알려줘", y);
y += 24; // GAP
y = await createTurn(chatArea, "AI-1", false, ai1Data, y);
y += 24;
// ... 반복
```

---

## Phase 4 — 각 화면 생성 후 체크리스트

> 화면 1개 완성할 때마다 이 항목을 코드로 자동 확인한다.

```javascript
async function verifyFrame(frame) {
  const issues = [];

  // 1. 텍스트 겹침 확인
  const texts = [];
  function collectTexts(node) {
    if (node.type === "TEXT") texts.push(node);
    if ("children" in node) node.children.forEach(collectTexts);
  }
  collectTexts(frame);
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (a.x < b.x + b.width && a.x + a.width > b.x &&
          a.y < b.y + b.height && a.y + a.height > b.y) {
        issues.push(`텍스트 겹침: "${a.characters.slice(0,10)}" ↔ "${b.characters.slice(0,10)}"`);
      }
    }
  }

  // 2. 프레임 내 요소 overflow 확인
  function checkOverflow(node, parent) {
    if (node === parent) return;
    if (node.x + node.width > parent.width + 5)
      issues.push(`우측 overflow: ${node.name} (x=${node.x}, w=${node.width})`);
    if ("children" in node) node.children.forEach(c => checkOverflow(c, parent));
  }
  checkOverflow(frame, frame);

  return issues.length ? issues : `${frame.name}: OK`;
}
```

---

## Phase 5 — DESC 작성 순서 및 분량 기준

> DESC는 화면 확정 후 **한 화면당 한 번에** 작성. 수정 반복 방지.

```
각 DESC 프레임에 포함할 최소 항목 (이 순서대로 작성):
1. 화면 ID + React 라우트 (예: /chat/s1)
2. 레이아웃 구조 (Sidebar 70px | Header 56px | ChatArea flex-1)
3. 핵심 컴포넌트 목록 + 크기/색상
4. 인터랙션 이벤트 (클릭/입력/토글)
5. 상태 변화 (로딩/빈/에러)
6. API 연동 포인트 (있는 경우만)
```

---

## 토큰 절약 규칙 요약 (과금 기준)

> 아래 수치는 누적 context를 포함한 실제 과금 기준 절약 추정치.

| 규칙 | 콘텐츠 절약 | 과금 절약 | 이유 |
|---|---|---|---|
| 폰트 유틸 함수 먼저 선언 | ~8,000 | **~800,000** | 폰트 재처리 턴 전체 제거 (context 최대치 구간) |
| stackBlocks() 사용 | ~20,000 | **~1,500,000** | 겹침 재수정 루프 수십 턴 제거 |
| 공통 컴포넌트 1개 검증 후 복제 | ~15,000 | **~600,000** | 동일 코드 N회 반복 제거 |
| 턴 1개씩 생성 후 height 읽기 | ~10,000 | **~800,000** | 전체 재배치 턴 제거 |
| DESC 마지막에 일괄 작성 | ~12,000 | **~500,000** | 화면 수정 시 DESC 재작성 턴 방지 |
| 화면 1개 생성 후 즉시 스크린샷 | ~15,000 | **~1,200,000** | 누적 오류 조기 차단 → 후반 수정 턴 대폭 감소 |
| 캔버스 좌표 상수 미리 선언 | ~5,000 | **~400,000** | 전체 재계산 턴 불필요 |
| **합계** | **~85,000** | **~5,800,000** | **과금 기준 약 50% 절약** |

> 핵심: 콘텐츠 절약은 작아 보여도, 해당 턴이 context가 큰 시점에 발생하면 과금 절약은 수십 배로 커진다.

---

## 작업 지시 프롬프트 템플릿

> 새 대화를 시작할 때 아래 내용을 첫 메시지로 사용한다.

```
Figma 파일 [파일키]의 [페이지명] 페이지에 Branch Q UI를 디자인합니다.

## 필수 준수 사항
1. 작업 시작 전 반드시 loadFonts(), stackBlocks(), detectOverlaps() 유틸 함수를 먼저 선언할 것
2. 모든 텍스트는 한글 → Noto Sans KR, 영문/숫자 → Inter로 분기할 것
3. 모든 y값은 추정 금지. node.height 읽은 후 계산할 것
4. 프레임 1개 생성할 때마다 스크린샷으로 확인 후 다음 진행할 것
5. 겹침 감지 코드를 각 화면 완성 후 자동 실행할 것
6. 공통 컴포넌트(NS카드, ShareRow, 사이드바, 헤더)를 먼저 만들고 복제할 것
7. DESC 프레임은 모든 화면 확정 후 마지막에 일괄 작성할 것

## 캔버스 좌표 (수정 금지)
ROW1_Y=0, ROW2_Y=1100, GAP_X=1540

## 디자인 토큰
Primary:#1E293B Accent:#2563EB Success:#16A34A Warning:#CA8A04 Error:#DC2626
Font: Noto Sans KR(한글) + Inter(숫자/영문), Radius: 4/6/8px

## 작업 순서
Phase0(유틸함수) → Phase1(공통컴포넌트) → Phase2(화면 순차 생성) → Phase3(검증) → Phase4(DESC 일괄)

Phase0 유틸 함수 선언부터 시작하세요.
```

---

## 예상 토큰 비교

> ⚠️ **중요: 토큰 과금 구조**
> API는 매 턴마다 대화 전체 context를 input으로 전송한다.
> 따라서 실제 청구 토큰 = 누적 context × 턴 수 (콘텐츠 생성량과 무관).
> 아래 표는 **과금 기준(누적 context 포함)** 수치다.

| 구분 | 이번 작업 (과금 기준) | 최적화 후 예상 | 절약 근거 |
|---|---|---|---|
| HTML 분석 + 초기 설계 | ~2,300,000 | ~2,300,000 | 동일 (필수 구간) |
| 유틸 함수 없이 폰트 재처리 | ~800,000 | **0** | Phase 0 선언으로 제거 |
| 프레임 생성 (S0~E4) | ~6,500,000 | ~3,500,000 | 턴 수 40% 감소 (1개씩 검증) |
| 반복 수정 (겹침/재배치) | ~4,500,000 | **~800,000** | stackBlocks + 즉시 검증으로 대폭 감소 |
| DESC + 프롬프트 템플릿 | ~2,300,000 | ~1,500,000 | 화면 확정 후 1회 작성 |
| **합계** | **≈ 11,500,000** | **≈ 5,300,000** | — |
| **절약** | — | **약 6,200,000 토큰** | **54% 감소** |

### 콘텐츠 기준 vs 과금 기준 비교

| | 콘텐츠 기준 (순수 생성량) | 과금 기준 (누적 context 포함) |
|---|---|---|
| 이번 작업 | ~300,000 | ~11,500,000 |
| 최적화 후 | ~175,000 | ~5,300,000 |
| 차이 배율 | — | 콘텐츠 기준의 **38배** |

> ※ 담당자 직접 수정 작업(간격 미세조정, 방향성 피드백)은 토큰과 무관하므로 위 표에 미포함.
> ※ 과금 절약의 핵심은 **반복 수정 사이클 감소** — context가 최대치일 때 수정이 반복될수록 비용이 기하급수적으로 증가하기 때문.
