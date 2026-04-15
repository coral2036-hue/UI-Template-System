# BranchQ Mobile Notification Deeplink v1

> → 100_mobile_master_prompt — 총론
> → 102_mobile_screen_spec — 뷰 V01~V13
> → 00_master_prompt_v2 — Message Contract, Modal Contract

## 목적
푸시 알림 수신 시 앱을 열어 **2 탭 이내**로 해당 상세로 이동하는 라우팅 규칙을 정의한다. 인증은 기존 앱 흐름 사용(→ 100 범위 선언).

---

## 알림 유형 [Core]

| type | 설명 | 발생 트리거(예시) |
|---|---|---|
| `anomaly` | 이상거래 탐지 | 이상 거래 스코어 임계치 초과 |
| `approval` | 리포트 승인 요청 | 결재 라인에 본인 할당 |
| `system` | 시스템 공지 | 점검·정책 변경 등 |

---

## Payload 스키마 [Core]
기존 `→ 00_master_prompt#Message Contract`를 해치지 않는 append-only 방식.

```ts
interface NotificationPayload {
  type: 'anomaly' | 'approval' | 'system';
  id: string;              // 대상 리소스 식별자 (대화 id, 리포트 id 등)
  title: string;           // 알림 목록 표시용
  body: string;            // 1줄 프리뷰
  sentAt: string;          // ISO8601
  deeplink?: string;       // 내부 라우팅 경로 (아래 규칙)
  meta?: {
    score?: number;        // anomaly: 이상거래 점수
    approver?: string;     // approval: 승인 요청자
  };
}
```

---

## Deeplink 경로 규칙 [Core]
앱 내부 라우팅용 URI 스킴. 기존 앱 shell(웹/네이티브)과 무관하게 단일 형식 유지.

```
branchq://
  chat/:id?scene=anomaly       → V02 Main-Chat (AnomalyDetail 상태)
  report/:id                   → V07 Report-Detail
  report/:id?action=approve    → V07 + 하단 액션바 포커스
  notifications                → V13 Notifications 목록
```

---

## 라우팅 매트릭스 [Core]

| 알림 type | 앱 콜드 스타트 | 앱 백그라운드 | Deeplink 경로 |
|---|---|---|---|
| `anomaly` | 스플래시(기존 앱) → V02 (scene=anomaly) | V02 직행 | `branchq://chat/:id?scene=anomaly` |
| `approval` | 스플래시 → V07 (action=approve) | V07 직행 | `branchq://report/:id?action=approve` |
| `system` | 스플래시 → V13 | V13 직행 | `branchq://notifications` |

### 공통 규칙
- 세션 만료 시: **기존 앱의 재인증 화면으로 위임**, 인증 완료 후 원래 Deeplink 재실행
- 대상 리소스 없음(404): Toast error → V13 목록으로 폴백
- 알림 권한 미허용: 앱 내 배지만 업데이트(푸시 없음), 동작 외부 변경 없음

---

## 시나리오 2: 알림 즉시 대응 (2 탭) [Core]
→ 102#시나리오 2 를 본 문서 규칙으로 구체화.

```
푸시 수신(anomaly)
  → [시스템] Deeplink 실행 → 앱 포그라운드
  → 세션 유효 → V02 Main-Chat 자동 진입(scene=anomaly, id=X)
  → [1] ShareRow [담당자 연락] 탭 → 연락 액션시트
  → [2] 액션 선택(호출·메시지) → 완료 Toast
```

```
푸시 수신(approval)
  → Deeplink → V07 Report-Detail (하단 액션바 '승인' 포커스)
  → [1] 액션바 '승인' 탭 → V10 확인 시트 (혹은 M6 confirm BottomSheet)
  → [2] 확정 → Toast success → 이전 상태로 복귀
```

---

## 배지·읽음 처리 [Core]
- Header 🔔 아이콘: 미확인 수 표시(99+ 상한)
- V13에서 항목 탭 시 읽음 처리
- 스와이프로 일괄 읽음 처리 허용 (→ 103#Gesture)
- 시스템 푸시 배지: OS 규약에 위임(iOS `UIApplication.applicationIconBadgeNumber`)

---

## 보안·프라이버시 [Core]
- 알림 본문에 **민감정보 미포함**: 금액·계좌번호·고객명 등은 배지 표시가 아닌 상세 화면에서 렌더
- Deeplink 파라미터에 개인정보 URL 인코딩 금지(→ 03_design_spec 및 → CLAUDE.md 보안 원칙 계승)
- 외부 도메인 Deeplink 거부 (branchq:// 외는 무시)

---

## QA [Core]
- [ ] 알림 3 type × 2 상태(콜드/백그라운드) = 6가지 라우팅이 V02/V07/V13에 정확히 매핑
- [ ] Payload 스키마가 기존 Message Contract를 수정하지 않음
- [ ] 세션 만료 폴백이 기존 앱 인증으로 위임됨
- [ ] 민감정보 알림 본문 포함 금지 규칙 명시
