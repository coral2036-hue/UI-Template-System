# BranchQ Design System v2

## Foundation Tokens [Core]

### Color
| 토큰 | 값 | 용도 |
|------|-----|------|
| primary | #1E293B | Sidebar 배경, 중요 텍스트 |
| accent | #2563EB | 버튼, 링크, User 버블, 선택 상태 |
| success | #16A34A | 상승 지표, 정상 배지, 성공 토스트 |
| warning | #CA8A04 | 주의 배지, 경고 토스트 |
| error | #DC2626 | 하락 지표, 위험 배지, 에러, 이상거래 |

### Gray Scale [Visual]
| 토큰 | 값 | 용도 |
|------|-----|------|
| gray-50 | #F8FAFC | 페이지 배경 |
| gray-100 | #F1F5F9 | InputBar 배경, 호버 |
| gray-200 | #E2E8F0 | 테두리, 구분선 |
| gray-300 | #CBD5E1 | disabled 테두리 |
| gray-400 | #94A3B8 | placeholder, 보조 아이콘 |
| gray-500 | #64748B | 부제, 캡션 |
| gray-600 | #475569 | 보조 텍스트 |
| gray-700 | #334155 | 일반 본문 텍스트 |
| gray-800 | #1E293B | 강조 (= primary) |
| gray-900 | #0F172A | 제목 |
| white | #FFFFFF | 카드/블록 배경, AI 버블 |

### Semantic Token (Light / Dark) [Visual]
| 토큰 | Light | Dark |
|------|-------|------|
| surface | white | #1E293B |
| background | gray-50 | #0F172A |
| border | gray-200 | #334155 |
| text-primary | gray-900 | gray-50 |
| text-secondary | gray-500 | gray-400 |
| text-muted | gray-400 | gray-500 |
| divider | gray-200 | #334155 |

### Shadow [Core]
| 토큰 | 값 |
|------|-----|
| sm | 0 1px 2px rgba(0,0,0,0.05) |
| md | 0 4px 6px rgba(0,0,0,0.07) |
| lg | 0 10px 15px rgba(0,0,0,0.1) |
| modal | 0 20px 25px rgba(0,0,0,0.15) |

### Opacity [Core]
| 토큰 | 값 | 용도 |
|------|-----|------|
| overlay | 0.5 | Modal 배경 |
| disabled | 0.4 | 비활성 요소 |

### Typography [Visual]
| 용도 | 크기 | 굵기 | 폰트 |
|------|------|------|------|
| 페이지 제목 | 24 | Bold | Noto Sans KR |
| 섹션 제목 | 20 | Bold | Noto Sans KR |
| 블록 제목 | 16 | SemiBold | Noto Sans KR |
| 본문 | 14 | Regular | Noto Sans KR |
| 캡션/보조 | 12 | Regular | Noto Sans KR |
| 작은 라벨 | 10 | Bold | Noto Sans KR |
| 숫자 강조 | 28 | Bold | Inter |
| 숫자 본문 | 14 | Medium | Inter |
| 숫자 소형 | 12 | Bold | Inter |

### ⚠️ Font Rule (CRITICAL) [Core]
- 한글 텍스트: **반드시 Noto Sans KR** — Inter는 한글 미지원(빈칸 출력됨)
- 숫자/영문: Inter
- 한글+숫자 혼용: Noto Sans KR 사용 (Inter 금지)
- Figma 구현: → 04_figma_optimize#font-loading 참조

### Spacing [Core]
| 값 | 용도 |
|----|------|
| 4 | 인라인 간격 (아이콘-텍스트) |
| 8 | 요소 내부 간격 |
| 12 | 소그룹 간격 (블록 내 요소) |
| 16 | 그룹 간 간격 (블록 사이) |
| 24 | 섹션 간 간격 (영역 패딩) |
| 32 | 영역 간 간격 (대구역) |

### Radius [Core]
| 값 | 용도 |
|----|------|
| 4 | 인풋, 테이블 셀, badge |
| 6 | 카드, 칩, alert-box |
| 8 | 모달, 패널, 블록 |
| 20 | pill 버튼, 태그, InputBar |

---

## Component Specs [Core]

### Sidebar
- width: 70, bg: primary(#1E293B)
- icon: 18, label: 10 bold, color: white (opacity 0.7, active=1.0)

### Sidebar Icons [Visual]
| 순서 | 아이콘 | 라벨 | 동작 |
|------|--------|------|------|
| 1 | chat | 새 채팅 | 새 대화 시작 |
| 2 | clock | 최근 | subPanel='recent' |
| 3 | file-text | 리포트 | subPanel='report' |
| 4 | settings | 설정 | subPanel='settings' |
| — | 구분선 | — | — |
| 5 | building | 일반질의 | category='general' |
| 6 | trending-up | 분석 | category='analysis' |
| 7 | line-chart | 예측 | category='forecast' |
| 8 | shield-alert | 이상거래 | category='anomaly' |
| 9 | headphones | 상담 | category='consult' |
아이콘: Lucide Icons (20px stroke=1.5)

### Header
- height: 56, bg: white, border-bottom: gray-200
- left: [≡ BranchQ 16 Bold] [시나리오 드롭다운]
- right: [도움말 ?] [알림 🔔]

### NumberStat
- width: 173, height: 90
- value: 28 Inter Bold, diff: 12 bold
- ⚠️ label: y=12 고정, 후속=이전height+6, diff badge: label 하단

### Table
- amount: right align + Inter Bold
- score: center align
- ⚠️ 이상거래 score 색상: 90+ red, 80+ orange, <80 blue

### Modal
- blur overlay (black/50)
- radius: 8, shadow: modal
- max-w: 480, center

### Chart
- bar ratio: real data 기반
- ⚠️ label: centerX = barX + barWidth/2, textX = centerX - textWidth/2

---

## Component State Styles [Visual]

### Button
| 상태 | 배경 | 텍스트 | 기타 |
|------|------|--------|------|
| default | accent | white | — |
| hover | accent (darken 10%) | white | cursor: pointer |
| active | accent (darken 20%) | white | scale: 0.98 |
| disabled | gray-300 | gray-500 | opacity: 0.4, cursor: not-allowed |
| loading | accent | — | spinner 표시 |

### Input
| 상태 | 테두리 | 배경 | 기타 |
|------|--------|------|------|
| default | gray-200 | white | — |
| focus | accent | white | ring: accent/20 |
| error | error | red-50 | 하단 에러 메시지 |
| disabled | gray-200 | gray-100 | opacity: 0.4 |

### Table Row
| 상태 | 배경 |
|------|------|
| default | white |
| hover | gray-50 |
| selected | blue-50 |

### Toast
| 타입 | 아이콘색 | 좌측 bar |
|------|---------|---------|
| info | accent | accent |
| success | success | success |
| warning | warning | warning |
| error | error | error |

---

## Responsive [Visual]

### Breakpoint
| 이름 | 값 | 설명 |
|------|-----|------|
| sm | 640px | 모바일 |
| md | 768px | 태블릿 |
| lg | 1024px | 소형 데스크톱 |
| xl | 1280px | 대형 데스크톱 |

### 반응형 규칙
- **md 이하**: Sidebar collapse (width 70 → 48, 아이콘만, 라벨 숨김)
- **sm 이하**: Sidebar hidden (햄버거 메뉴로 toggle)
- ChatArea 최소 너비: 320px
- ⚠️ 수평 공존 요소: 반드시 명시적 width 지정 (→ 3회 반복 이슈)

---

## Animation [Visual]
| 대상 | duration | easing |
|------|----------|--------|
| 호버 피드백 | 150ms | ease-out |
| Modal open/close | 200ms | ease-in-out |
| SubPanel slide | 200ms | ease-in-out |
| Toast slide-in | 300ms | ease-out |
| Loading fade | 150ms | ease |
