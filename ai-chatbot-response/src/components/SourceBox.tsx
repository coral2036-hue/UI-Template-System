export default function SourceBox() {
  return (
    <div className="border border-border-light rounded-lg bg-bg-surface px-4 py-3.5 flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-text-primary">◎ 출처 정보</span>
      <span className="text-xs text-text-secondary">지표: 총잔고</span>
      <span className="text-xs text-text-secondary">조건 : 계좌분류 = '예적금'</span>
    </div>
  );
}
