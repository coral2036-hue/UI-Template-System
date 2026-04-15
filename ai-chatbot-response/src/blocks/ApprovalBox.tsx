import type { ApprovalBoxData } from '../types';

export default function ApprovalBox({ lines }: ApprovalBoxData) {
  return (
    <div className="flex border border-brq-border rounded-lg overflow-hidden w-fit">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`px-5 py-3 text-center ${i < lines.length - 1 ? 'border-r border-brq-border' : ''}`}
        >
          <p className="text-[13px] text-brq-gray-500">{line.role}</p>
          <p className="text-[15px] font-semibold text-brq-gray-900 mt-0.5">{line.name}</p>
        </div>
      ))}
    </div>
  );
}
