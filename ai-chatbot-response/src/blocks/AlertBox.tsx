import type { AlertBoxData } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const CONFIG = {
  error: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800', Icon: AlertCircle },
  warning: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', Icon: AlertTriangle },
  info: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', Icon: Info },
  success: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', Icon: CheckCircle },
};

export default function AlertBox({ level, title, message }: AlertBoxData) {
  const c = CONFIG[level];
  return (
    <div className={`${c.bg} border-l-4 ${c.border} rounded-md p-3.5`}>
      <div className="flex items-start gap-2">
        <c.Icon size={18} className={`${c.text} mt-0.5 shrink-0`} />
        <div>
          <p className={`text-[14px] font-bold ${c.text}`}>{title}</p>
          <p className={`text-[13px] ${c.text} opacity-80 mt-1 whitespace-pre-line`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
