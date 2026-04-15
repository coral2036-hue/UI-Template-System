import type { SummaryCardsData } from '../types';

export default function SummaryCards({ cards }: SummaryCardsData) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <div key={i} className="bg-brq-white border border-brq-border rounded-md p-4">
          <p className="text-[13px] text-brq-gray-500 mb-1">{card.label}</p>
          <p className="text-[24px] font-bold text-brq-gray-900 font-number">{card.value}</p>
          {card.sub && <p className="text-[12px] text-brq-gray-400 mt-1">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}
