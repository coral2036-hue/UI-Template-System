# BranchQ Base Docs

이 폴더는 BranchQ base layer + feature layer 문서입니다.

## 읽는 순서

### Base Layer (항상 읽기)
1. 00_master_prompt_v2.md — state, contract, 공통 표준, Block 14종
2. 01_design_v2.md — 토큰, 폰트, 상태 스타일, 반응형
3. 02_react_prompt_v2.md — 구조, 패턴, 테마
4. 03_design_spec_v2.md — 화면 S0~S6, 메시지 버블, Modal, SubPanel
5. 04_figma_optimize_v2.md — Figma 규칙, Lessons, Pencil.dev

### Feature Layer (필요 시 읽기)
6. 05_excel_editor_v1.md — 스프레드시트 사이드 패널
7. 06_feature_template.md — 신규 기능 추가 템플릿
8. 07_changelog.md — 문서 변경 이력

## Tier 가이드 (레퍼런스 수준별)

각 섹션에 [Core] [Visual] [Context] 태그가 있음:

| 상황 | 읽을 Tier | 설명 |
|------|----------|------|
| 스크린샷 + Figma 있음 | [Core]만 | AI가 스크린샷으로 시각 파악, MD에서 규칙 참조 |
| 스크린샷만 있음 | [Core] + [Visual] | Block ASCII, 메시지 버블 등 시각 정보 포함 |
| 완전 제로 레퍼런스 | 전부 | 디자인 철학, S0 콘텐츠, 상태화면 등 모든 정보 |

## 규칙
- 00~04는 고정 base layer
- 새 요청은 feature layer로 처리 (06_feature_template 사용)
- 기존 구조 재해석 금지
- append only 원칙 유지

## 작업 원칙
- state 먼저 확인
- block contract 유지 (= Block 14종 + props 변경 금지, 확장만)
- layout contract 유지 (= Sidebar 70 + Header 56 + ChatArea 나머지)
- 기존 component 재사용 우선
- 새 기능은 최소 확장 (새 파일 1개 이하)
- 텍스트 1줄 표시 우선 (2줄 줄바꿈 최소화)

## 코드 생성 전 점검
- DOM 존재 확인
- optional chaining 확인
- node --check 기준 문법 검증
- 클릭 flow 5개 점검 (카테고리/전송/ShareRow/Modal/SubPanel)
- console error 0 유지

## feature 요청 방식
예시:
- 기존 md 기준 작업
- 아래는 feature layer
- base 유지 / append only / reinterpret 금지
