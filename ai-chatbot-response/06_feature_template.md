# BranchQ Feature Layer Template

새 기능 추가 시 이 템플릿을 복사하여 사용한다.

## [Feature 이름]

### 기본 정보
- 영향 base 문서: ___
- AppState 변경: ___

### 추가 요소
- [ ] 신규 Block: ___ (있으면 ASCII + props 정의)
- [ ] 신규 Modal: ___ (있으면 M번호 + 내부 레이아웃)
- [ ] 신규 Screen: ___ (있으면 S번호 + 블록 조합)

### 디자인 체크
- [ ] 폰트 확인 (한글→Noto Sans KR, 숫자→Inter)
- [ ] 텍스트 1줄 표시 (2줄 줄바꿈 최소화)
- [ ] 높이 가변 요소 유무 (있으면 2-pass 필요)
- [ ] 수평 공존 요소 width 지정 완료

### 재사용
- 기존 컴포넌트 재사용: ___
- 기존 토큰 사용 확인: ___

### QA
- [ ] DOM 존재 확인
- [ ] optional chaining
- [ ] node --check 문법 검증
- [ ] 클릭 flow 5개 정상
- [ ] console error 0
- [ ] 오버랩/오버플로우/클리핑 없음
