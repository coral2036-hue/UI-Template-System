import { useState } from 'react';
import { Send } from 'lucide-react';
import type { Category } from '../types';
import { CATEGORIES_FULL } from '../constants/categories';

const CAT_ICONS: Record<string, string> = {
  general: '💡',
  analysis: '🔥',
  forecast: '📊',
  anomaly: '📋',
  consult: '📋',
  report: '📝',
};

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  selectedCategory: Category;
  onCategorySelect: (cat: Category) => void;
}

export default function InputBar({ onSend, disabled, selectedCategory, onCategorySelect }: InputBarProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="shrink-0 bg-white border-t border-brq-border relative z-[250]">
      {/* Category tabs */}
      <div className="flex gap-2 px-7 pt-2.5 justify-center flex-wrap">
        {CATEGORIES_FULL.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id as Category)}
            className={`inline-flex items-center gap-1 px-[14px] py-[6px] border rounded-[18px] text-[13px] font-medium whitespace-nowrap transition-all
              ${selectedCategory === cat.id
                ? 'border-[#2563eb] text-[#2563eb] bg-[#eff6ff] font-semibold'
                : 'border-[#e5e7eb] text-[#6b7280] bg-white hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff]'
              }`}
          >
            <span className="text-[13px]">{CAT_ICONS[cat.id]}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex justify-center px-7 py-3">
        <div className={`flex items-center gap-0 w-full max-w-[800px] border rounded-[24px] bg-white overflow-hidden transition-colors
          ${text.trim() ? 'border-brq-accent' : 'border-brq-border'}`}>
          {/* Business select */}
          <select className="h-11 px-3.5 border-none bg-white text-[14px] text-brq-gray-600 outline-none cursor-pointer shrink-0 min-w-[110px]"
            style={{ borderRight: '1px solid var(--color-brq-border)' }}
          >
            <option>전체 사업장</option>
            <option>본사</option>
            <option>서울지점</option>
            <option>부산지점</option>
          </select>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="어떤 업무를 도와드릴까요?"
            disabled={disabled}
            className="flex-1 h-11 px-4 text-[15px] border-none outline-none bg-transparent disabled:opacity-40"
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-11 h-11 flex items-center justify-center shrink-0 transition-all
              ${canSend ? 'text-brq-accent hover:text-brq-accent-dark' : 'text-brq-gray-300'}`}
          >
            <Send size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
