import type { LineChartData } from '../types';

const COLORS = ['#2563EB', '#16A34A', '#DC2626', '#CA8A04'];

export default function LineChart({ title, series, labels }: LineChartData) {
  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal || 1;

  const width = 600;
  const height = 200;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const getX = (i: number) => padX + (i / (labels.length - 1)) * chartW;
  const getY = (v: number) => padY + chartH - ((v - minVal) / range) * chartH;

  return (
    <div className="bg-brq-white border border-brq-border rounded-lg p-5">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-brq-gray-900">{title}</h3>
          <div className="flex gap-3">
            {series.map((s, i) => (
              <span key={i} className="flex items-center gap-1 text-[12px] text-brq-gray-500">
                <span className="w-3 h-[2px] rounded" style={{ backgroundColor: s.color || COLORS[i] }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <line
            key={r}
            x1={padX}
            y1={padY + chartH * (1 - r)}
            x2={width - padX}
            y2={padY + chartH * (1 - r)}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}
        {/* Series */}
        {series.map((s, si) => {
          const color = s.color || COLORS[si];
          const points = s.data.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
          const fillPoints = `${getX(0)},${getY(minVal)} ${points} ${getX(s.data.length - 1)},${getY(minVal)}`;
          return (
            <g key={si}>
              <polygon points={fillPoints} fill={color} opacity={0.1} />
              <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
              {s.data.map((v, i) => (
                <circle key={i} cx={getX(i)} cy={getY(v)} r={3} fill={color} />
              ))}
            </g>
          );
        })}
        {/* Labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 2}
            textAnchor="middle"
            className="text-[11px] fill-brq-gray-500"
            style={{ fontFamily: 'Noto Sans KR' }}
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}
