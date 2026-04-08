# BranchQ Base Docs

이 폴더는 BranchQ base layer 문서입니다.

## 읽는 순서
1. 00_master_prompt_v2.md
2. 01_design_v2.md
3. 02_react_prompt_v2.md
4. 03_design_spec_v2.md
5. 04_figma_optimize_v2.md

## 규칙
- 00~04는 고정 base layer
- 새 요청은 feature layer로 처리
- 기존 구조 재해석 금지
- append only 원칙 유지

## 작업 원칙
- state 먼저 확인
- block contract 유지
- layout contract 유지
- 기존 component 재사용 우선
- 새 기능은 최소 확장

## 코드 생성 전 점검
- DOM 존재 확인
- optional chaining 확인
- node --check 기준 문법 검증
- 클릭 flow 5개 점검
- console error 0 유지

## feature 요청 방식
예시:
- 기존 md 기준 작업
- 아래는 feature layer
- base 유지 / append only / reinterpret 금지

