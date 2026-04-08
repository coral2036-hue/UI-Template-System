const bars = [
  { label: '거주자외화\n정기예금', height: 80, type: 'maturity' as const },
  { label: '상호부금\n(IBK신금맞춤)', height: 113, type: 'maturity' as const },
  { label: '기업부금\n(자유적립식)', height: 130, type: 'maturity' as const },
  { label: '기업부금\n(장기적립식)', height: 123, type: 'normal' as const },
  { label: 'IBK적립식\n출금제(기업)', height: 130, type: 'normal' as const },
];

const yLabels = ['12억', '9억', '6억', '3억', '0'];

export default function BarChart() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-bar-maturity border-[0.5px] border-bar-maturity-border" />
          <span className="text-[10px] text-text-secondary">만기도래</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-bar-normal border-[0.5px] border-bar-normal-border" />
          <span className="text-[10px] text-text-secondary">정상</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0 border-t-[1.5px] border-avg-line" />
          <span className="text-[10px] text-text-secondary">평균 8.65억</span>
        </div>
      </div>

      {/* Chart Body */}
      <div className="relative w-full" style={{ height: 160 }}>
        {/* Y Axis */}
        <div className="absolute left-0 top-0 w-[28px] h-[140px] flex flex-col justify-between">
          {yLabels.map((l) => (
            <span key={l} className="text-[9px] text-text-muted">{l}</span>
          ))}
        </div>

        {/* Bars Area */}
        <div
          className="absolute left-[32px] top-0 right-0 h-[140px] flex items-end justify-around gap-2 border-b border-border-light"
        >
          {bars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full max-w-[48px] rounded-t ${
                  b.type === 'maturity'
                    ? 'bg-bar-maturity border-[0.5px] border-bar-maturity-border'
                    : 'bg-bar-normal border-[0.5px] border-bar-normal-border'
                }`}
                style={{ height: b.height * 0.85 }}
              />
            </div>
          ))}
        </div>

        {/* Average Line */}
        <div
          className="absolute left-[32px] right-0 border-t-[1.5px] border-dashed border-avg-line"
          style={{ top: 38 }}
        />
      </div>

      {/* X Labels */}
      <div className="flex justify-around gap-1 pl-[32px]">
        {bars.map((b, i) => (
          <span
            key={i}
            className="flex-1 text-[8px] text-text-muted text-center leading-[1.3] whitespace-pre-line"
          >
            {b.label}
          </span>
        ))}
      </div>

      {/* Caption */}
      <p className="text-[10px] text-text-muted text-center w-full">
        예적금 계좌별 잔액 (억원) · 기준일 2026-03-18
      </p>
    </div>
  );
}
