import type { ToastState } from '../types';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  toast: ToastState;
  onDismiss: () => void;
}

const CONFIG = {
  info: { Icon: Info, bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' },
  success: { Icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' },
  warning: { Icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  error: { Icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  const c = CONFIG[toast.type];

  return (
    <div
      className={`fixed top-4 right-4 z-[60] flex items-center gap-2 ${c.bg} border ${c.border} rounded-lg px-4 py-3 shadow-lg min-w-[280px] max-w-[400px]`}
      style={{ animation: 'brq-slide-in-right 300ms ease-out' }}
    >
      <c.Icon size={18} className={c.text} />
      <p className={`text-[14px] ${c.text} flex-1`}>{toast.message}</p>
      <button onClick={onDismiss} className="p-0.5 rounded hover:bg-black/5 transition-colors">
        <X size={14} className={c.text} />
      </button>
    </div>
  );
}
