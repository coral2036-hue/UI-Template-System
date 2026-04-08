export default function WarningBox() {
  return (
    <div className="flex gap-2 bg-warning-bg rounded-lg px-4 py-3">
      <span className="text-sm text-warning-text shrink-0">⚠</span>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-warning-text">⚠ 만기도래 계좌 주의</span>
        <p className="text-[11px] text-text-primary leading-[1.5]">
          현재 예적금 계좌 5개 중 3개가 만기도래 상태입니다.
          가장 최근 만기일은 2026-03-10이며, 나머지 만기도래 계좌는 2026-02-01, 2026-01-15에 만기가 도래했습니다. 만기 후에는 약정 이율 적용이 종료되었을 가능성이 있어 제예치, 재계약 또는 해지 여부를 검토하는 것이 바람직합니다
        </p>
      </div>
    </div>
  );
}
