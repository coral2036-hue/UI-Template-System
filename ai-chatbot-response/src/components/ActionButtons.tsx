import { Settings2, Download, TriangleAlert } from 'lucide-react';

export default function ActionButtons() {
  return (
    <div className="flex items-center justify-end gap-3 w-full">
      <button className="flex items-center gap-1.5 border border-border-light rounded-md px-4 py-2">
        <Settings2 size={14} className="text-text-secondary" />
        <span className="text-xs font-medium text-text-primary">공유하기</span>
      </button>
      <button className="flex items-center gap-1.5 border border-border-light rounded-md px-4 py-2">
        <Download size={14} className="text-text-secondary" />
        <span className="text-xs font-medium text-text-primary">다운로드</span>
      </button>
      <button className="flex items-center gap-1.5 border border-red-accent rounded-md px-4 py-2">
        <TriangleAlert size={14} className="text-red-accent" />
        <span className="text-xs font-medium text-red-accent">신고하기</span>
      </button>
    </div>
  );
}
