import type { ReportHeaderData } from '../types';

export default function ReportHeader({ category, title, subtitle, date, icon }: ReportHeaderData) {
  return (
    <div className="bg-brq-white border border-brq-border rounded-lg p-5">
      <span className="inline-block text-[12px] font-bold text-white bg-brq-accent rounded px-2 py-0.5 mb-2">
        {icon ? `${icon} ` : ''}{category}
      </span>
      <h2 className="text-[20px] font-bold text-brq-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-[14px] text-brq-gray-500 mt-1">{subtitle}</p>}
      <p className="text-[12px] text-brq-gray-400 mt-1 font-number">{date}</p>
    </div>
  );
}
