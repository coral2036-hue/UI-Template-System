# Branch Q — AI 금융 업무 지원 시스템 디자인 명세

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Branch Q (AI 금융 업무 지원 시스템) |
| 목적 | 금융 업무 자동화를 위한 AI 채팅 기반 웹 애플리케이션 |
| 대상 사용자 | 금융/회계 담당자, 자금 관리자 |
| 개발 프레임워크 | React (전체) |
| 피그마 링크 | https://www.figma.com/design/moHy3BaQLmzoGcXTgbJeI1/claude-code |

---

## 🎨 디자인 토큰

### 색상
| 용도 | HEX | 사용처 |
|------|-----|--------|
| Primary | #1E293B | 텍스트 기본, 다크 배경 |
| Accent | #2563EB | 버튼, 링크, 활성 상태 |
| Success | #16A34A | 성공 상태, 양수 표시 |
| Warning | #CA8A04 | 경고, 주의 상태 |
| Error | #DC2626 | 에러, 위험, 음수 표시 |
| Info | #0891B2 | 정보 안내 |
| Gray-50 | #F9FAFB | 배경 (가장 밝음) |
| Gray-100 | #F3F4F6 | 카드 배경, 입력 배경 |
| Gray-200 | #E5E7EB | 보더, 구분선 |
| Gray-400 | #9CA3AF | 비활성 텍스트, 플레이스홀더 |
| Gray-500 | #6B7280 | 서브 텍스트, 라벨 |
| Gray-600 | #4B5563 | 본문 텍스트 |
| Gray-700 | #374151 | 강조 본문 |
| Gray-800 | #1F2937 | 제목, 헤더 |
| Gray-900 | #111827 | 최상위 제목 |

### 폰트
| 용도 | 폰트 | 스타일 |
|------|------|--------|
| 한글 전체 | Noto Sans KR | Regular / Medium / Bold |
| 영문/숫자 | Inter | Regular / Medium / Bold |
| 코드/에디터 | Consolas, Monaco, monospace | Regular |

### 크기
| 용도 | 크기 |
|------|------|
| 대제목 | 32px Bold |
| 보고서 제목 | 18-20px Bold |
| 섹션 제목 | 15-16px Bold |
| 본문 | 14-15px Regular |
| 작은 텍스트 | 12-13px |
| 뱃지/태그 | 11-12px Bold |
| number-stat 값 | 28px Bold |

### Border Radius
| 용도 | 값 |
|------|-----|
| 소 (뱃지, 입력) | 4px |
| 중 (카드) | 6px |
| 대 (모달) | 8px |
| 인풋박스 | 16px |
| Pill 버튼 | 20px |
| 카테고리 버튼 | 24px |

---

## 🏗️ 전체 화면 구성 (40개 프레임)

### Row 1: 초기 진입 (4개)
| ID | 화면명 | 크기 | 설명 |
|----|--------|------|------|
| S0 | Welcome 홈 | 1440x900 | 인사메시지 + 2-Row 입력박스 + 카테고리 6개 |
| S0-Sub1 | 최근질문 서브패널 | 1440x900 | 사이드바 232px 패널 열린 상태 |
| S0-Sub2 | 맞춤보고서 서브패널 | 1440x900 | 빈 상태 표시 |
| S0-Sub3 | 사용설정 서브패널 | 1440x900 | 보고서빌더/LLM설정 메뉴 |

### Row 2-3: 채팅 시나리오 (6개)
| ID | 시나리오 | 블록 수 | 핵심 블록 |
|----|----------|---------|-----------|
| S1 | 일반질의 - 법인카드 주간 | 14종 | 5턴 멀티턴, report-header, number-stat, data-table, bar-chart, callout, query-detail, steps |
| S2 | 분석질의 - 2월 사용현황 | 12종 | number-stat(4), pattern-analysis(4단계), alert-box(error), bar-chart |
| S3 | 예측질의 - 자금흐름 예상 | 8종 | data-table(실적+예측), callout(2), bar-chart(12개월), query-detail(계좌) |
| S4 | 이상거래 - 감지 알림 | 특수 | score/badge 테이블, 47건 상세조회 |
| S5 | 상담 - 계좌 등록 안내 | 5종 | steps(5단계), callout(tip), 매뉴얼 다운로드 |
| S6 | 보고서 - 자금현황 | 6종 | number-stat(3), 결재란(우측상단), approval-box, bar-chart |

### Row 4: 모달/팝업 (8개)
| ID | 화면명 | 크기 | 설명 |
|----|--------|------|------|
| M1 | 모델선택 드롭다운 | 320x516 | 11개 LLM 모델, 무료/고급/프리미엄 뱃지 |
| M2a | API설정 - 미설정 | 680x500 | 4개 프로바이더 탭 + API키 입력 |
| M2b | API설정 - 등록완료 | 680x500 | 연결됨 뱃지 + 삭제/변경 + 테스트 결과 |
| M3 | 전송방법 선택 | 380x296 | MMS / 카카오톡 선택 카드 |
| M4 | 카카오톡 미리보기 | 520x610 | 스마트폰 프레임 + 알림톡 + 전화번호 입력 |
| M5 | 이메일 전송 | 640x560 | 이메일 미리보기 + 받는사람/제목 |
| M6 | 모바일 보고서뷰 | 440x700 | 스마트폰형 보고서 뷰어 |
| A4 | 카카오톡 수신 | 420x500 | 수신된 알림톡 + 상세확인 버튼 |

### Row 5: 빌더 + 이벤트 (10개)
| ID | 화면명 | 설명 |
|----|--------|------|
| B1a | 보고서빌더 빈 상태 | MD편집 프리뷰(빈) + 에디터(빈) |
| B1b | 보고서빌더 입력상태 | 프리뷰(렌더링) + 에디터(마크다운 입력) |
| B2 | 보고서 저장 모달 | 제목 입력 + 저장/취소 |
| E1 | 전송완료 오버레이 | ✓ 체크 + "전송 완료" + 확인 버튼 |
| E2 | 삭제확인 모달 | ⚠️ 경고 + 취소/삭제 |
| E3 | 저장완료 토스트 | ✓ + "저장 완료" (3초 자동닫힘) |
| E4 | 파일업로드 완료 | 프로그레스바 100% + 파일명 |
| C1 | Progress Pills | 로딩 상태 필 + 타이핑 인디케이터 |
| C2 | Toast/파일미리보기 | 토스트 알림 + PDF 미리보기 모달 |
| A3 | 공유하기 드롭다운 | 이메일/모바일 옵션 (위로 열림) |

### 부가 산출물
| ID | 명칭 | 설명 |
|----|------|------|
| NAV | 화면전환 흐름도 | 전체 네비게이션 맵 + 공통 디자인 규칙 |
| DESC x11 | 디스크립션 | 화면별 Layout/Component/Block/Interaction/State/React |

---

## 🧩 AI 응답 블록 타입 (14종)

### 블록 렌더러 목록
| # | type | 용도 | 핵심 스펙 |
|---|------|------|-----------|
| 1 | report-header | 보고서 헤더 | icon + title 20px Bold + subtitle 13px |
| 2 | number-stat | 숫자 통계 카드 | 값 28px Bold + 라벨 13px + diff 뱃지(▲▼) |
| 3 | summary-cards | 요약 카드 그리드 | auto-fit minmax(150px, 1fr) |
| 4 | data-table | 데이터 테이블 | 금액 우측정렬, badge/score 커스텀 렌더러 |
| 5 | bar-chart | 막대 차트 | Y축 눈금 + 범례 우상단 + 값 바 중앙 |
| 6 | line-chart | 라인 차트 | tension 0.3, pointRadius 4 |
| 7 | alert-box | 경고 알림 | warning/error/info/success 4단계 |
| 8 | callout | 콜아웃 | tip/note/important/danger + left-border 3px |
| 9 | pattern-analysis | 패턴 분석 | critical(빨)/warning(노)/normal(초) |
| 10 | steps | 단계별 안내 | counter-reset + 24px 원형 번호 + 연결선 |
| 11 | key-value | 키-값 리스트 | key 140px + value flex:1 |
| 12 | query-detail | 상세조회 | 접기/펼치기 + 필터 + Excel 다운로드 |
| 13 | source-box | 출처 표시 | bg gray-50 + 링크 (downloadable 옵션) |
| 14 | related-questions | 관련 질문 | pill 버튼 리스트, 클릭 시 자동입력 |

### 공통 컴포넌트
| 컴포넌트 | 스펙 |
|----------|------|
| ShareRow | 우측정렬, h=36px, radius=20px, min-w=90px |
| UserMsg | 파란 배경(#2563EB), 우측정렬, radius=20px, padding 12px 24px |
| ProgressPills | pill 순차 표시 → done 전환, 1-2초 간격 |
| Toast | 상단 중앙, radius=12px, 3초 자동닫힘 |
| ModelBadge | pill 형태, 클릭 시 드롭다운 위로 열림 |

---

## 🔄 공통 디자인 규칙

### number-stat 카드
```
값: Inter Bold 28px (accent/red/gray)
라벨: Noto Sans KR Medium 13px gray-500
diff: "▲ +6.2%" 12px Bold (green=up, red=down)
카드: bg white, border 1px #E5E7EB, radius 6px, h=90px
비교 뱃지: "약 7배 많음 ▲" (카드 사이 표시)
```

### data-table 금액 정렬
```
금액 컬럼: text-align RIGHT, Inter Bold 14px
점수(score): CENTER, Inter Bold 24px
  ≥90 빨강(#DC2626) / ≥80 주황(#EA580C) / <80 파랑(#2563EB)
badge: 가운데 정렬, radius 4px
```

### 차트 스타일
```
수직 바: Y축 좌측 눈금 + 그리드 라인
범례: 우측 상단 (■ 색상 + 라벨)
값 텍스트: 바>30px → 내부 흰색 / <30px → 상단 외부
X축 라벨: 바 하단 중앙 정렬
```

### ShareRow 버튼
```
우측 정렬, h=36px, min-w=90px, radius=20px
"신고하기": border #FECACA, color #DC2626
나머지: border #E5E7EB, color gray-600
순서: 보고서저장 | PDF | Excel | 공유하기 | 신고하기
```

### 결재란 (S6)
```
위치: 보고서 카드 내부 우측 상단
3열(작성/검토/승인), header bg #F3F4F6
border 1px #D1D5DB, min-width 130px
```

---

## 🗺️ 화면 전환 흐름

```
[S0-Welcome] 홈
  ├─ 카테고리 클릭 → 자동타이핑 → Enter → S1~S6
  ├─ 직접 입력 → Enter → S1~S6
  └─ 사이드바:
      ├─ "새 채팅" → S0 (초기화)
      ├─ "최근 질문 ▸" → SubPanel → 항목 클릭 → S1~S6
      ├─ "맞춤보고서 ▸" → SubPanel → 항목 클릭 → B1
      └─ "사용 설정 ▸" → SubPanel
           ├─ "보고서 빌더" → B1
           └─ "LLM 설정" → M2 팝업

[Chat Mode] S1~S6 공통
  ├─ 입력바: fixed bottom, 카테고리탭 + 2-Row 입력
  ├─ 모델배지 → M1 드롭다운 (위로 열림)
  └─ ShareRow:
       ├─ 보고서저장 → B2 → E3 토스트
       ├─ PDF/Excel → 다운로드
       ├─ 공유하기 → A3 → M5(이메일) 또는 M3→M4(카카오)→E1→A4
       └─ 신고하기 → alert

[B1-빌더]
  ├─ 파일가져오기 → E4
  ├─ 프리뷰적용 → 좌측 렌더링
  └─ 저장 → B2

[M2-API설정]
  ├─ 미설정 → 저장 → 등록완료
  ├─ 삭제 → E2 확인 → 미설정
  └─ 키변경 → 입력모드
```

---

## ✅ 품질 검증 결과

| 항목 | 결과 |
|------|------|
| 프레임 겹침 | 0건 ✅ |
| 텍스트 겹침 | 0건 ✅ |
| 버튼 센터링 | 0건 ✅ |
| 한글 폰트 누락 | 0건 ✅ |
| 텍스트 클리핑 | 0건 ✅ |
| DESC 오버플로우 | 0건 ✅ |
| 오탈자 | 0건 ✅ |

---

## 🔄 최신 업데이트 반영사항 (v2)

### S4 이상거래 테이블 재구축
| 컬럼 | 정렬 | 스타일 |
|------|------|--------|
| 유형 | 가운데 | badge (계좌이체=파랑bg, 법인카드=주황bg) |
| 거래일시/사용자 | 좌측 | 2줄 표시 (12px Regular) |
| 거래처 | 좌측 | 2줄 표시 (12px Regular) |
| 금액(KRW) | **우측** | **Inter Bold 14px** gray-800 |
| 위험 근거 | 좌측 | 12px Regular gray-600 |
| 점수 | **가운데** | **Inter Bold 24px** (≥90 빨강 / ≥80 주황 / <80 파랑) |
| 액션 | 가운데 | badge (상세보기=파랑, 소명요청=주황) |
- 행 높이: 70px 균일
- 좌측 컬러 바: width 3px (계좌이체=파랑, 법인카드=주황)
- 짝수 행: bg #F9FAFB

### S6 결재란 위치 변경
- **기존**: 보고서 하단
- **변경**: 보고서 카드 내부 **우측 상단** (보고서 제목 옆)
- 보고서 제목 width: 350px (결재란과 겹치지 않도록)

### 차트 바 비율 규칙
- 데이터 비율을 정확하게 반영 (예: 757만 vs 107만 = 7:1)
- Y축 좌측 눈금 필수 (800만/600만/400만/200만/0)
- 바 위 또는 내부에 값 텍스트 표시
  - 바 높이 > 30px: 내부 흰색 텍스트 가운데
  - 바 높이 < 30px: 상단 외부 색상 텍스트
- 범례: 우측 상단 (■ 색상 + 라벨명)
- X축 라벨: 바 하단 가운데 정렬

### ShareRow 버튼 통일
- **우측 정렬**, gap 10px
- 균일 사이즈: h=36px, min-w=90px, radius=20px
- "신고하기": border #FECACA, color #DC2626
- 나머지: border #E5E7EB, color gray-600

### number-stat 카드 통일
- 값: **Inter Bold 28px** (accent/red/gray)
- 라벨: Noto Sans KR Medium 13px gray-500
- diff 뱃지: "▲ +6.2%" / "▼ -3.1%" 12px Bold
- 카드: h=90px, radius=6px
- 비교 뱃지: "약 7배 많음 ▲" (카드 사이 표시)

### B1 프리뷰 테이블 데이터
- 빈 상태 → 입력 상태 전환 시 테이블 데이터 행 표시
- 프리뷰 영역: 마크다운 → 블록 렌더링 (number-stat + data-table + chart)

### M6 모바일뷰 NS카드
- 3개 카드 모두 표시 (총자산 + 이번달지출 + **이번달수입**)
- 모바일 레이아웃: 2열 + 1열 배치

### 사이드바 공통
- "맞춤보고서" 아래 **"Beta"** 태그 (8px accent 색상)
- "최근질문/맞춤보고서/사용설정": **▸ 화살표** 표시
- 이모지 아이콘: 💬🕐📋⚙️🚪 (18px, 가운데 정렬)
