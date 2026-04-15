import { useState } from 'react';
import type { Category } from '../types';

const CATEGORIES = [
  { id: 'general', label: '💡 일반질의' },
  { id: 'analysis', label: '🔥 분석질의' },
  { id: 'forecast', label: '📊 예측질의' },
  { id: 'anomaly', label: '📋 이상거래' },
  { id: 'consult', label: '📋 상담' },
  { id: 'report', label: '📝 보고서' },
];

interface WelcomeScreenProps {
  selectedCategory: Category;
  onCategorySelect: (cat: Category) => void;
  onQuestionClick: (text: string) => void;
}

export default function WelcomeScreen({ onCategorySelect, onQuestionClick }: WelcomeScreenProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onQuestionClick(trimmed);
    setInput('');
  };

  const handleCategoryClick = (catId: string) => {
    const demoQ: Record<string, string> = {
      general: '이번 주 법인카드 사용 내역을 조회해줘',
      analysis: '4월 법인카드 분석 리포트를 작성해줘',
      forecast: '2분기 자금흐름 예상보고서를 만들어줘',
      anomaly: '최근 이상거래 현황을 알려줘',
      consult: '법인 계좌 등록 방법을 알려줘',
      report: '1분기 자금현황 보고서를 작성해줘',
    };
    if (catId !== 'report') onCategorySelect(catId as Category);
    onQuestionClick(demoQ[catId] || demoQ.general);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-[#f3f4f6] px-4 sm:px-7" style={{ animation: 'brq-fade-in 400ms ease' }}>
      {/* Greeting — Figma: 32px Noto Sans KR Bold #1f2937, 모바일 24px */}
      <p className="text-[24px] sm:text-[38px] font-bold text-[#1f2937] text-center sm:whitespace-nowrap" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        웹케시님, 안녕하세요! 🤙
      </p>
      {/* Sub — v15: 18px Regular #6b7280, 모바일 14px */}
      <p className="text-[14px] sm:text-[18px] font-normal text-[#6b7280] text-center mb-6 sm:mb-9 sm:whitespace-nowrap" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        오늘도 효율적인 자금 관리를 도와드리겠습니다.
      </p>

      {/* InputBox — v15: max-w-800, h=92, r=28 */}
      <div className="w-full max-w-[640px] h-[92px] bg-white border border-[#e5e7eb] rounded-[16px] overflow-hidden relative" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {/* Row 1: BizSelect + Input */}
        <div className="flex items-center h-[48px]">
          <div className="flex items-center h-[48px] min-w-[120px] px-[14px] shrink-0">
            <span className="text-[14px] text-[#4c5563] whitespace-pre" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>전체 사업장  ▾</span>
          </div>
          <div className="w-px h-[48px] bg-[#e5e7eb]" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="무엇이든 물어보세요"
            className="flex-1 h-[48px] px-4 text-[15px] border-none outline-none bg-transparent placeholder:text-[#9ca3af]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          />
        </div>
        {/* Row 2: Model Badge + Search Button */}
        <div className="absolute right-[6px] bottom-[6px] flex items-center gap-2">
          {/* Model Badge — Figma: h=28, r=14 */}
          <div className="flex items-center gap-1.5 h-[28px] px-[10px] border border-[#e5e7eb] rounded-[14px] bg-white cursor-pointer">
            <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center font-[Inter]">B</span>
            <span className="text-[12px] font-bold text-[#4c5563] whitespace-nowrap" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>브랜치Q Plus ▾</span>
          </div>
          {/* Send/Search Button — Figma: 36x36 round blue */}
          <button
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[14px] hover:bg-[#1d4ed8] transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Category Buttons — 모바일: 2×3 그리드 (V01), 데스크톱: flex row */}
      <div className="grid grid-cols-3 gap-2 mt-5 w-full max-w-[320px] sm:flex sm:gap-3 sm:mt-[28px] sm:max-w-none sm:w-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="h-[40px] sm:w-[118px] rounded-[24px] border border-[#e5e7eb] bg-white text-[13px] sm:text-[15px] font-medium text-[#4b5563] whitespace-nowrap hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-all"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
