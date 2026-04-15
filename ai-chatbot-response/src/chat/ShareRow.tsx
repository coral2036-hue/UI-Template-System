import { useState, useRef, useEffect } from 'react';
import { FileText, Table, Share2, AlertTriangle, Save, Download, Mail, Smartphone } from 'lucide-react';

interface ShareRowProps {
  btnType: 'report' | 'report-save' | 'anomaly' | 'consult' | 'general' | 'no-data' | 'none';
  onAction?: (action: string) => void;
}

interface BtnDef {
  label: string;
  icon: typeof FileText;
  danger?: boolean;
  action: string;
  hasDropdown?: boolean;
}

const BUTTON_SETS: Record<string, BtnDef[]> = {
  general: [
    { label: 'PDF', icon: FileText, action: 'pdf' },
    { label: 'Excel', icon: Table, action: 'excel' },
    { label: '공유하기', icon: Share2, action: 'share', hasDropdown: true },
    { label: '신고하기', icon: AlertTriangle, danger: true, action: 'report-issue' },
  ],
  report: [
    { label: 'PDF', icon: FileText, action: 'pdf' },
    { label: 'Excel', icon: Table, action: 'excel' },
    { label: '공유하기', icon: Share2, action: 'share', hasDropdown: true },
  ],
  'report-save': [
    { label: '저장', icon: Save, action: 'save' },
    { label: 'PDF', icon: FileText, action: 'pdf' },
    { label: 'Excel', icon: Table, action: 'excel' },
    { label: '공유하기', icon: Share2, action: 'share', hasDropdown: true },
  ],
  anomaly: [
    { label: 'PDF', icon: FileText, action: 'pdf' },
    { label: 'Excel', icon: Table, action: 'excel' },
    { label: '공유하기', icon: Share2, action: 'share', hasDropdown: true },
    { label: '신고하기', icon: AlertTriangle, danger: true, action: 'report-issue' },
  ],
  consult: [
    { label: '다운로드', icon: Download, action: 'download' },
    { label: '공유하기', icon: Share2, action: 'share', hasDropdown: true },
  ],
  'no-data': [
    { label: '신고하기', icon: AlertTriangle, danger: true, action: 'report-issue' },
  ],
};

function ShareDropdown({ onAction }: { onAction?: (action: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-brq-border rounded-[20px] bg-white text-[14px] font-medium text-brq-gray-600 hover:border-brq-gray-400 hover:text-brq-gray-800 hover:bg-brq-gray-50 transition-all"
      >
        <Share2 size={14} />
        공유하기
      </button>
      {open && (
        <div className="absolute bottom-[calc(100%+6px)] right-0 bg-white border border-brq-border rounded-md shadow-lg min-w-[160px] z-20 overflow-hidden"
          style={{ animation: 'brq-fade-in 150ms ease' }}
        >
          <button
            onClick={() => { onAction?.('email'); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-[14px] text-brq-gray-700 hover:bg-brq-gray-50 transition-colors text-left"
          >
            <Mail size={16} className="text-brq-gray-400" />
            이메일 전송
          </button>
          <button
            onClick={() => { onAction?.('mobile'); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-[14px] text-brq-gray-700 hover:bg-brq-gray-50 transition-colors text-left"
          >
            <Smartphone size={16} className="text-brq-gray-400" />
            모바일 전송
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShareRow({ btnType, onAction }: ShareRowProps) {
  if (btnType === 'none') return null;
  const buttons = BUTTON_SETS[btnType] || BUTTON_SETS.general;

  return (
    <>
      {buttons.map((btn) =>
        btn.hasDropdown ? (
          <ShareDropdown key={btn.action} onAction={onAction} />
        ) : (
          <button
            key={btn.action}
            onClick={() => onAction?.(btn.action)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-[20px] bg-white text-[14px] font-medium transition-all
              ${btn.danger
                ? 'border-brq-error/30 text-brq-error hover:bg-brq-error-light'
                : 'border-brq-border text-brq-gray-600 hover:border-brq-gray-400 hover:text-brq-gray-800 hover:bg-brq-gray-50'
              }`}
          >
            <btn.icon size={14} />
            {btn.label}
          </button>
        )
      )}
    </>
  );
}
