import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { SqlQueryData } from '../types';

export default function SqlQuery({ label = 'SQL Query', query }: SqlQueryData) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-brq-border rounded-md overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white hover:bg-brq-gray-50 transition-colors text-left"
      >
        <span className="text-[13px] font-medium text-brq-gray-600">{label}</span>
        {open ? (
          <ChevronUp size={16} className="text-brq-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-brq-gray-400" />
        )}
      </button>

      {/* Code block */}
      {open && (
        <div className="relative bg-[#1e293b]" style={{ animation: 'brq-fade-in 150ms ease' }}>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white/70 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? '복사됨' : '복사'}
          </button>

          <pre className="px-4 py-4 pr-20 text-[12px] leading-[1.7] text-[#93c5fd] font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {query}
          </pre>
        </div>
      )}
    </div>
  );
}
