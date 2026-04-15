import type { BarChartData } from '../types';

const DEFAULT_COLORS = ['#2563EB', '#DC2626', '#16A34A', '#CA8A04'];

export default function BarChart({ title, data, color = '#2563EB', datasets }: BarChartData) {
  // Multi-dataset mode (grouped bars)
  if (datasets && datasets.length > 0) {
    const labels = data.map((d) => d.label);
    const allValues = datasets.flatMap((ds) => ds.data);
    const maxVal = Math.max(...allValues, 1);
    const chartHeight = 200;

    return (
      <div className="bg-brq-white border border-brq-border rounded-lg p-5">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-brq-gray-900">{title}</h3>
            <div className="flex gap-3">
              {datasets.map((ds, i) => (
                <span key={i} className="flex items-center gap-1 text-[12px] text-brq-gray-500">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ds.color || DEFAULT_COLORS[i] }} />
                  {ds.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-end gap-4 justify-around" style={{ height: chartHeight }} role="img" aria-label={title || '막대 차트'}>
          {labels.map((label, li) => (
            <div key={li} className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-end gap-1 mb-1">
                {datasets.map((ds, di) => {
                  const val = ds.data[li] || 0;
                  const h = (val / maxVal) * (chartHeight - 40);
                  return (
                    <div key={di} className="flex flex-col items-center">
                      <span className="text-[10px] font-bold font-number text-brq-gray-500 mb-0.5">
                        {val >= 10000 ? `${(val / 10000).toFixed(0)}만` : val.toLocaleString()}
                      </span>
                      <div
                        className="w-5 rounded-t-sm"
                        style={{ height: Math.max(h, 2), backgroundColor: ds.color || DEFAULT_COLORS[di] }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-[12px] text-brq-gray-500 truncate max-w-full">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single dataset mode
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 200;

  return (
    <div className="bg-brq-white border border-brq-border rounded-lg p-5">
      {title && <h3 className="text-[15px] font-bold text-brq-gray-900 mb-4">{title}</h3>}
      <div className="flex items-end gap-3 justify-around" style={{ height: chartHeight }} role="img" aria-label={title || '막대 차트'}>
        {data.map((d, i) => {
          const h = (d.value / maxVal) * (chartHeight - 30);
          return (
            <div key={i} className="flex flex-col items-center flex-1 min-w-0">
              <span className="text-[12px] font-bold font-number text-brq-gray-600 mb-1">
                {d.value >= 10000 ? `${(d.value / 10000).toFixed(0)}만` : d.value.toLocaleString()}
              </span>
              <div
                className="w-full max-w-[48px] rounded-t-md transition-all duration-300"
                style={{ height: h, backgroundColor: color }}
              />
              <span className="text-[12px] text-brq-gray-500 mt-2 truncate max-w-full">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
