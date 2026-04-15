import { Inbox, Lightbulb } from 'lucide-react';
import type { EmptyStateData } from '../types';

export default function EmptyState({ message, description }: EmptyStateData) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-lg border border-brq-border bg-white py-10 px-8 min-h-[180px]">
      {/* 아이콘 */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-brq-gray-100">
        <Inbox size={26} className="text-brq-gray-400" strokeWidth={1.5} />
      </div>

      {/* 메시지 */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-[15px] font-semibold text-brq-gray-600">{message}</p>
      </div>

      {/* AI 제안 카드 */}
      {description && (
        <div className="flex items-start gap-2.5 bg-brq-accent-light/50 border border-brq-accent/15 rounded-lg px-4 py-3 max-w-[360px]">
          <Lightbulb size={16} className="text-brq-accent mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[13px] text-brq-accent-dark leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}
