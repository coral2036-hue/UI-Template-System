import type { PatternAnalysisData } from '../types';

const LEVEL = {
  critical: { bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500' },
  normal: { bg: 'bg-green-50', border: 'border-green-300', dot: 'bg-green-500' },
};

export default function PatternAnalysis({ title, items }: PatternAnalysisData) {
  return (
    <div className="bg-brq-white border border-brq-border rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-brq-gray-100">
          <h3 className="text-[16px] font-semibold text-brq-gray-900">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-brq-gray-100">
        {items.map((item, i) => {
          const c = LEVEL[item.level];
          return (
            <div key={i} className={`${c.bg} border-l-[3px] ${c.border} px-4 py-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="text-[14px] font-bold text-brq-gray-900">{item.title}</span>
              </div>
              <p className="text-[13px] text-brq-gray-600 ml-4">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
