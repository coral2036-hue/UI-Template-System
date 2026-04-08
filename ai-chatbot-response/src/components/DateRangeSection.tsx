import { Sparkles } from 'lucide-react';

export default function DateRangeSection() {
  return (
    <div className="border border-border-light rounded-lg p-4 flex flex-col gap-2.5 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-text-primary">
          현재 조회기간은 2026-03-18 ~ 2026-03-18 입니다.
        </span>
        <button className="flex items-center justify-center gap-1.5 bg-purple-accent text-white rounded-md px-3.5 py-2 text-[11px] font-medium w-full">
          <Sparkles size={13} />
          기간 내역 재조회
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-text-secondary leading-[1.5]">
        AI아나보가 질문 속 기간 표현을 해석한 결과입니다. 필요하다면 시작일·종료일을 직접 수정하여 조회하실 수 있습니다.
      </p>

      {/* Date Inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 border border-border-light rounded-md px-3 py-2 text-center">
          <span className="text-xs text-text-primary">2026-03-18</span>
        </div>
        <span className="text-xs text-text-muted">~</span>
        <div className="flex-1 border border-border-light rounded-md px-3 py-2 text-center">
          <span className="text-xs text-text-primary">2026-03-20</span>
        </div>
      </div>
    </div>
  );
}
