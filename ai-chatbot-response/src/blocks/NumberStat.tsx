import type { NumberStatData } from '../types';

export default function NumberStat({ items }: NumberStatData) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-brq-white border border-brq-border rounded-md p-4 min-w-0"
        >
          <p className="text-[12px] text-brq-gray-500 mb-1 truncate">{item.label}</p>
          <p className="text-[28px] font-bold text-brq-gray-900 font-number leading-tight">
            {item.value}
          </p>
          {item.diff && (
            <span
              className={`text-[12px] font-bold font-number ${
                item.trend === 'up' ? 'text-brq-success' : 'text-brq-error'
              }`}
            >
              {item.trend === 'up' ? '▲' : '▼'} {item.diff}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
