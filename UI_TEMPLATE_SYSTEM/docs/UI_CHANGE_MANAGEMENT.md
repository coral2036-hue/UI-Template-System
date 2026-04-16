# UI 변경 관리 및 배포 프로세스

## 📋 개요

UI 템플릿 시스템에서의 모든 변경사항은 체계적으로 관리되고, 승인 프로세스를 거쳐 단계적으로 배포됩니다.

---

## 🔄 변경 프로세스 흐름

```
┌─────────────────┐
│  변경사항 발생   │
│ (Figma 디자인)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  변경 제안 작성  │
│ (CHANGELOG 기록)│
└────────┬────────┘
         ↓
┌─────────────────┐
│  리뷰 요청       │
│ (Design + Dev)  │
└────────┬────────┘
         ↓
    ┌────────────┐
    │   승인?     │
    └─┬──────┬──┘
      │      │
   YES│      │NO
      │      └──→ [피드백 반영]
      │           ↓
      ↓      ┌─────────────────┐
┌─────────────────┐   │  변경사항 수정  │
│ Code Connect    │   └────────┬────────┘
│ 자동 업데이트   │            │
└────────┬────────┘            │
         ↓                      │
┌─────────────────┐            │
│ 영향도 분석      ├───────────┘
│ (몇개 화면 영향)│
└────────┬────────┘
         ↓
┌─────────────────┐
│ 배포 일정 계획   │
│ (25% → 50%...%) │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 배포 실행        │
│ (Phase 1, 2, 3) │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 모니터링         │
│ (에러, 성능)    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ ✅ 배포 완료     │
└─────────────────┘
```

---

## 📝 변경사항 기록 (CHANGELOG)

### 변경 타입 분류

| 타입 | 설명 | 버전 업데이트 | Breaking |
|------|------|--------------|----------|
| **feature** | 새로운 기능/컴포넌트 | Minor | ✅ No |
| **enhancement** | 기존 기능 개선 | Minor | ✅ No |
| **bugfix** | 버그 수정 | Patch | ✅ No |
| **breaking** | 호환성 깨지는 변경 | Major | ⚠️ Yes |
| **deprecation** | 곧 제거될 기능 표시 | Minor | ⚠️ Yes* |
| **docs** | 문서 업데이트 | Patch | ✅ No |

*: Migration guide 제공 시

### 변경 로그 포맷

```yaml
# CHANGELOG.md

## [2.1.0] - 2026-04-16

### Added
- 신용카드 필터 옵션 추가: "만료 예정" 필터
- DataTable 컴포넌트에 선택 기능(Checkbox) 추가
- 환율 정보에 "현금 환율" 필드 추가

### Changed
- 목록 조회 API 응답 형식 개선 (요약 지표 추가)
- Button 컴포넌트 호버 상태 색상 변경 (#2196F3 → #1976D2)
- 리포트 차트 범례 위치 변경 (오른쪽 → 하단)

### Fixed
- 모달 닫기 버튼 정렬 버그 수정 (#234)
- 다크 모드에서 텍스트 색상 대비 문제 해결

### Deprecated
- `ListViewContainer` Props의 `oldProp` 필드 (v2.2.0에서 제거 예정)
  → 마이그레이션: `newProp` 사용하기

### Breaking Changes
- ❌ 없음

---

## [2.0.0] - 2026-03-01

### Added
- 완전히 새로운 디자인 시스템 (컬러, 타이포그래피, 스페이싱)
- 어두운 모드(Dark Mode) 지원
- 신규 컴포넌트: InsightPanel, AnalysisPanel

### Changed
- 모든 색상 토큰 재정의 (Figma 업데이트)
- Typography 시스템 변경 (폰트, 크기, 행간 수정)
- 레이아웃 그리드 변경 (12 → 24 컬럼)

### Breaking Changes
- ⚠️ 기존 색상 변수 이름 변경
  - `color.primary` → `color.brand.primary`
  - `color.secondary` → `color.brand.secondary`
  
- ⚠️ Button 컴포넌트 Props 변경
  - `primary` → `variant="primary"`
  - `secondary` → `variant="secondary"`

마이그레이션 가이드: [MIGRATION_v1_to_v2.md](./MIGRATION_v1_to_v2.md)
```

---

## 👥 리뷰 및 승인 프로세스

### 리뷰 요청 체크리스트

변경사항을 리뷰 요청할 때 다음을 확인하세요:

- [ ] **변경 설명**
  - 무엇이 변경되었는가?
  - 왜 변경되었는가?
  - 어떤 화면이 영향을 받는가?

- [ ] **Figma 디자인**
  - 최신 상태인가?
  - 모든 컴포넌트가 적용되었는가?
  - 모바일/태블릿 반응형이 고려되었는가?

- [ ] **Code Connect**
  - Figma 노드가 React 파일과 연결되었는가?
  - 자동 생성 코드가 올바른가?

- [ ] **테스트**
  - 영향받는 화면들에 대한 테스트가 작성되었는가?
  - 시각적 회귀 테스트를 실행했는가?

- [ ] **문서**
  - README/가이드가 업데이트되었는가?
  - API 변경사항이 문서화되었는가?

### 리뷰 담당자

| 역할 | 담당자 | 검토 내용 |
|------|--------|---------|
| **Design Lead** | @designer | Figma 디자인, 일관성, 접근성 |
| **Frontend Lead** | @frontend | 코드 품질, 성능, 테스트 |
| **Product Manager** | @pm | 비즈니스 요구사항 충족 여부 |
| **QA Lead** | @qa | 테스트 케이스, 품질 확인 |

### 승인 기준

변경사항은 다음 모두를 만족할 때 승인됩니다:

```yaml
approval_criteria:
  design_lead:
    required: true
    status: "approved"
    comments: "이상 없음 또는 구체적인 피드백"
  
  frontend_lead:
    required: true
    status: "approved"
    criteria:
      - code_quality: "A-" # A+, A, A-, B+, ...
      - test_coverage: ">80%"
      - performance: "no regression"
  
  product_manager:
    required: false
    status: "approved"
    comment: "상품 요구사항 충족"
  
  qa_lead:
    required: true
    status: "approved"
    criteria:
      - all_tests_passed: true
      - visual_regression: "no issues"
      - accessibility: "WCAG AA compliant"
```

---

## 📊 영향도 분석

### 변경 영향도 평가

```yaml
ImpactAnalysis:
  change: "Button 호버 색상 변경"
  severity: "medium"
  
  affected_components:
    - Button (primary, secondary, danger, warning)
  
  affected_screens:
    - ListViewContainer (12개 화면)
    - DetailViewContainer (8개 화면)
    - FormModal (15개 화면)
    - ReportSection (6개 화면)
    - 기타 (5개 화면)
  
  total_affected_screens: 46
  estimated_impact: "높음"
  
  migration_effort:
    automatic: 100%  # 자동 마이그레이션 가능
    manual: 0%
  
  risk_level: "low"  # 색상 변경만으로 기능 영향 없음
  
  recommendation: "25% → 50% → 100% 단계적 배포"
```

### 영향도 분류

| 심각도 | 영향 화면 수 | 배포 방식 | 모니터링 |
|--------|-----------|---------|---------|
| **Critical** | > 50개 | 25% → 50% → 75% → 100% | 24시간 |
| **High** | 20-50개 | 50% → 100% | 8시간 |
| **Medium** | 5-20개 | 100% | 4시간 |
| **Low** | < 5개 | 100% | 2시간 |

---

## 🚀 배포 프로세스

### Phase 1: 개발 환경 배포 (D-day)

```bash
# 1. 개발 브랜치에 머지
git checkout develop
git merge feature/button-color-change

# 2. 버전 업데이트
npm run version:patch  # 또는 minor/major

# 3. CHANGELOG 생성
npm run changelog:generate

# 4. 개발 환경 배포
npm run deploy:dev

# 5. 테스트
npm run test:integration
npm run test:e2e
```

### Phase 2: 스테이징 환경 배포 (D+1)

```bash
# 카나리 배포 (25%)
npm run deploy:staging --canary 0.25

# 모니터링 (1시간)
npm run monitor:metrics
npm run monitor:errors

# 이상 없으면 50%로 확대
npm run deploy:staging --canary 0.50
```

### Phase 3: 운영 환경 배포 (D+2)

```bash
# 카나리 배포 (25%)
npm run deploy:prod --canary 0.25

# 모니터링 (4시간)
npm run monitor:prod

# 50% 배포
npm run deploy:prod --canary 0.50

# 모니터링 (4시간)

# 100% 배포
npm run deploy:prod --canary 1.0

# 최종 모니터링 (24시간)
```

### 배포 체크리스트

```markdown
## 배포 전 체크리스트

### 코드 준비
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] CHANGELOG 업데이트
- [ ] 버전 넘버 업데이트

### 문서
- [ ] API 문서 업데이트
- [ ] 마이그레이션 가이드 (Breaking Change인 경우)
- [ ] 개발자 가이드 업데이트

### 모니터링 준비
- [ ] 대시보드 설정
- [ ] 알림 규칙 설정
- [ ] 롤백 계획 수립

### 커뮤니케이션
- [ ] 팀 공지
- [ ] 고객 공지 (필요시)
- [ ] 릴리스 노트 작성

## 배포 중 체크리스트

### Phase 1 (개발)
- [ ] 개발 환경 배포 확인
- [ ] 기본 기능 테스트
- [ ] 통합 테스트 실행

### Phase 2 (스테이징)
- [ ] 카나리 배포 (25%) 확인
- [ ] 에러율 모니터링 (임계값: < 0.1%)
- [ ] 성능 메트릭 확인
- [ ] 50% 배포 확인

### Phase 3 (운영)
- [ ] 카나리 배포 (25%) 확인
- [ ] 에러 로그 검토
- [ ] 사용자 피드백 모니터링
- [ ] 50% 배포 확인
- [ ] 100% 배포 확인
- [ ] 24시간 모니터링

## 배포 후 체크리스트

- [ ] 모든 메트릭 정상 범위 확인
- [ ] 사용자 피드백 검토
- [ ] 배포 완료 공지
- [ ] 문제 사항 기록 (있으면)
- [ ] 회고 회의 (Breaking Change인 경우)
```

---

## 🔙 롤백 계획

### 자동 롤백 조건

다음 조건 중 하나에 해당하면 **자동 롤백**이 실행됩니다:

```yaml
auto_rollback_triggers:
  
  error_rate:
    threshold: "0.5%"  # 에러율 0.5% 초과
    duration: "5분"
    action: "immediate_rollback"
  
  performance:
    p95_latency: "500ms"  # 95%ile 응답시간 초과
    duration: "10분"
    action: "immediate_rollback"
  
  availability:
    success_rate: "99.0%"  # 성공률 99% 미만
    duration: "5분"
    action: "immediate_rollback"
  
  custom_alerts:
    - alert_name: "CriticalException"
      threshold: "10건/분"
      action: "immediate_rollback"
```

### 수동 롤백

필요시 수동으로 롤백할 수 있습니다:

```bash
# 현재 배포 확인
npm run deploy:status

# 이전 버전으로 롤백
npm run rollback --to "2.0.5"

# 특정 화면만 롤백 (부분 롤백)
npm run rollback:partial --screens "ListView,DetailView"

# 롤백 확인
npm run smoke-test
```

### 롤백 후 조치

```markdown
## 롤백 후 절차

1. **원인 분석**
   - 무엇이 문제였는가?
   - 테스트에서 왜 발견되지 않았나?
   - 재발 방지 방안?

2. **사후 처리**
   - 영향받은 사용자에게 공지
   - 버그 리포트 작성
   - 파일럿 테스트 강화

3. **재배포 계획**
   - 버그 수정
   - 테스트 추가
   - 재배포 일정 계획

4. **회고**
   - 팀 회의 실시
   - 배포 프로세스 개선
   - 문서 업데이트
```

---

## 📈 모니터링 대시보드

### 주요 메트릭

배포 중 모니터링해야 할 주요 메트릭:

```yaml
monitoring_metrics:
  
  # 에러 지표
  error_rate:
    target: "< 0.1%"
    critical: "> 0.5%"
    unit: "%"
    
  # 성능 지표
  response_time:
    p50:
      target: "< 100ms"
      critical: "> 200ms"
    p95:
      target: "< 300ms"
      critical: "> 500ms"
    p99:
      target: "< 500ms"
      critical: "> 1000ms"
  
  # 가용성
  availability:
    target: "> 99.5%"
    critical: "< 99.0%"
  
  # 비즈니스 메트릭
  user_actions:
    list_view_loads: "기준선 대비 ±20%"
    detail_view_loads: "기준선 대비 ±20%"
    form_submissions: "기준선 대비 ±30%"
  
  # 사용자 영향
  affected_users:
    - 접속 불가 사용자
    - 오류 메시지 본 사용자
    - 성능 저하 경험 사용자
```

### 대시보드 대상

| 대상 | 접근 | 갱신 주기 | 주요 메트릭 |
|------|------|---------|-----------|
| **배포 담당자** | Real-time | 1분 | 에러율, 응답시간, 가용성 |
| **온콜 엔지니어** | 24/7 | 5분 | 전체 메트릭 |
| **팀 리더** | 업무 시간 | 30분 | 요약 및 주요 지표 |
| **경영진** | 일간 | 1시간 | 영향도, 문제 여부 |

---

## 📞 에스컬레이션 절차

### 레벨 1: 개발자 (자동 롤백 미실행)

```
조건: 에러율 0.1-0.5%, 응답시간 약간 증가
절차:
1. 담당 개발자에게 즉시 알림
2. 로그 분석
3. 자동 롤백 고려
시간: 5분 이내 판단
```

### 레벨 2: 팀 리더 (에러 증가 추세)

```
조건: 에러율 상승 추세, 성능 저하 지속
절차:
1. 팀 리더에게 보고
2. 원인 분석
3. 수동 롤백 검토
연락: @team-lead (슬랙 + 전화)
시간: 10분 이내 대응
```

### 레벨 3: 온콜 엔지니어 (심각한 장애)

```
조건: 가용성 99% 미만, 에러율 0.5% 초과
절차:
1. 온콜 엔지니어 호출
2. 즉시 대응 회의
3. 긴급 롤백 실행
연락: @oncall-engineer (전화 호출)
시간: 즉시
```

---

## 📋 문서 및 가이드

### 제공되는 문서

| 문서 | 내용 | 대상 |
|------|------|------|
| **CHANGELOG.md** | 모든 변경사항 기록 | 모두 |
| **MIGRATION_GUIDE.md** | Breaking Change 마이그레이션 | 개발자 |
| **DEPLOYMENT_GUIDE.md** | 배포 절차 상세 | DevOps/배포담당자 |
| **ROLLBACK_GUIDE.md** | 롤백 절차 상세 | OnCall/DevOps |
| **MONITORING_GUIDE.md** | 모니터링 방법 | OnCall/팀리더 |

### 배포 전 확인 사항

```markdown
## 배포 전 최종 확인

### 기술 검증
- [ ] 모든 자동 테스트 통과 (100%)
- [ ] 수동 테스트 완료 (회귀 테스트 포함)
- [ ] 성능 테스트 통과 (기준선 대비 ±5%)
- [ ] 보안 검수 완료

### 문서 검증
- [ ] README/가이드 최신화
- [ ] API 문서 최신화
- [ ] CHANGELOG 작성 완료
- [ ] 마이그레이션 가이드 (Breaking Change인 경우)

### 커뮤니케이션
- [ ] 팀 공지 발송
- [ ] 스테이크홀더 알림
- [ ] 온콜 엔지니어 대기
- [ ] 롤백 계획 검토

### 준비 상태
- [ ] 모니터링 대시보드 활성화
- [ ] 알림 규칙 설정
- [ ] 롤백 절차 확인
- [ ] 비상 연락처 확인

**배포 책임자 서명:** _____________ (날짜: _______)
```

---

**마지막 업데이트:** 2026-04-16  
**버전:** 1.0.0
