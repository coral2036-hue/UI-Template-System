import { Menu } from 'lucide-react';

interface HeaderProps {
  onModelClick: () => void;
  onMenuToggle?: () => void;
  onNotificationClick?: () => void;
}

export default function Header({ onModelClick: _m, onMenuToggle, onNotificationClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-[56px] px-[28px] bg-white border-b border-[#e5e7eb] shrink-0 overflow-hidden">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button className="sm:hidden p-1.5 rounded hover:bg-[#f3f4f6]" onClick={onMenuToggle} aria-label="메뉴">
          <Menu size={20} className="text-[#374151]" />
        </button>
        <span className="text-[17px] font-bold text-[#2563eb] font-[Inter] whitespace-nowrap">Branch Q</span>
      </div>
      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded border border-[#e5e7eb] bg-white flex items-center justify-center text-[16px] font-bold text-[#6b7280] hover:border-[#9ca3af] transition-colors" aria-label="도움말">?</button>
        <button
          onClick={onNotificationClick}
          className="w-8 h-8 rounded border border-[#e5e7eb] bg-white flex items-center justify-center text-[14px] relative hover:border-[#9ca3af] transition-colors"
          aria-label="알림"
        >
          🔔
          <span className="absolute top-[3px] right-[3px] w-2 h-2 bg-[#dc2626] rounded-full" />
        </button>
      </div>
    </header>
  );
}
