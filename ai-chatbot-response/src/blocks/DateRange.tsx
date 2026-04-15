import type { DateRangeData } from '../types';

export default function DateRange({ description, note, startDate, endDate, reQueryLabel }: DateRangeData) {
  return (
    <div className="bg-brq-gray-50 border border-brq-border rounded-lg p-4">
      {description && (
        <p className="text-[14px] font-bold text-brq-gray-900 mb-2">{description}</p>
      )}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[14px] font-number text-brq-gray-700">{startDate}</span>
        <span className="text-brq-gray-400">~</span>
        <span className="text-[14px] font-number text-brq-gray-700">{endDate}</span>
      </div>
      {note && <p className="text-[12px] text-brq-gray-500 mb-3">{note}</p>}
      {reQueryLabel && (
        <button className="text-[13px] text-white bg-brq-accent rounded-[20px] px-6 py-2 hover:bg-brq-accent-dark transition-colors">
          {reQueryLabel}
        </button>
      )}
    </div>
  );
}
