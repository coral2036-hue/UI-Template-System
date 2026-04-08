const stats = [
  { label: '예적금 계좌 수', value: '5개' },
  { label: '총 예적금 잔액', value: '43억 2,500만원' },
  { label: '평균 계좌 잔액', value: '8억 6,500만원' },
];

export default function StatsRow() {
  return (
    <div className="flex w-full">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`flex-1 flex flex-col gap-1 px-3 py-2.5 ${
            i < stats.length - 1 ? 'border-r border-border-light' : ''
          }`}
        >
          <span className="text-[10px] text-text-muted">{s.label}</span>
          <span className="text-[17px] font-bold text-text-primary leading-tight">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
