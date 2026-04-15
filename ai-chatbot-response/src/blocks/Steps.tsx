import type { StepsData } from '../types';

export default function Steps({ title, items }: StepsData) {
  return (
    <div className="bg-brq-white border border-brq-border rounded-lg p-5">
      {title && <h3 className="text-[16px] font-semibold text-brq-gray-900 mb-4">{title}</h3>}
      <div className="relative">
        {items.map((step, i) => (
          <div key={i} className="flex gap-4 pb-5 last:pb-0">
            {/* Number + connector */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-brq-gray-800 text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              {i < items.length - 1 && (
                <div className="w-0.5 flex-1 bg-brq-gray-200 mt-1" />
              )}
            </div>
            {/* Content */}
            <div className="pt-0.5 pb-1">
              <p className="text-[16px] font-bold text-brq-gray-900">{step.title}</p>
              <p className="text-[14px] text-brq-gray-600 mt-1 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
