import type { CalloutData } from '../types';

const CONFIG = {
  tip: { bg: 'bg-blue-50', border: 'border-blue-300', icon: '💡' },
  note: { bg: 'bg-brq-gray-50', border: 'border-brq-gray-300', icon: '📝' },
  important: { bg: 'bg-amber-50', border: 'border-amber-300', icon: '⚠️' },
  danger: { bg: 'bg-red-50', border: 'border-red-300', icon: '🚨' },
};

export default function Callout({ type, title, text }: CalloutData) {
  const c = CONFIG[type];
  return (
    <div className={`${c.bg} border-l-[3px] ${c.border} rounded-md px-4 py-3`}>
      <div className="flex items-start gap-2">
        <span className="text-[16px] shrink-0">{c.icon}</span>
        <div>
          {title && <p className="text-[14px] font-bold text-brq-gray-900 mb-1">{title}</p>}
          <p className="text-[14px] text-brq-gray-700 whitespace-pre-line leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
