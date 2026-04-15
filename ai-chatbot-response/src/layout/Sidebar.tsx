import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { X } from 'lucide-react';
import type { Category, SubPanelType, PageView } from '../types';

interface SidebarProps {
  selectedCategory: Category;
  activePanel: SubPanelType | null;
  currentPage: PageView;
  onCategorySelect: (cat: Category) => void;
  onPanelToggle: (panel: SubPanelType) => void;
  onNavigatePage: (page: PageView) => void;
  onNewChat: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { id: 'new-chat', label: '새 채팅', emoji: '💬' },
  { id: 'recent', label: '최근 질문', emoji: '🕐', panel: 'recent' as SubPanelType, hasExpand: true },
  { id: 'report', label: '맞춤보고서', emoji: '📋', panel: 'report' as SubPanelType, hasExpand: true, badge: 'Beta' },
  { id: 'financial-todo', label: '자금 To-Do', emoji: '💰', panel: 'financial-todo' as SubPanelType, hasExpand: true },
  { id: 'settings', label: '사용 설정', emoji: '⚙️', panel: 'settings' as SubPanelType, hasExpand: true },
];

// V04 Drawer 카테고리 (→ 102_mobile_screen_spec#V04)
const DRAWER_CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'general', label: '일반질의', emoji: '💡' },
  { id: 'analysis', label: '분석질의', emoji: '🔥' },
  { id: 'forecast', label: '예측질의', emoji: '📊' },
  { id: 'anomaly', label: '이상거래', emoji: '📋' },
  { id: 'consult', label: '상담', emoji: '📋' },
];

function SidebarInner({ activePanel, currentPage, onPanelToggle, onNavigatePage, onNewChat }: SidebarProps) {
  return (
    <>
      {/* Logo */}
      <p className="text-[13px] font-bold text-brq-accent text-center mb-4 mt-3 font-[Inter]">
        BranchQ
      </p>

      {/* Navigation */}
      <div className="flex flex-col items-center gap-1 flex-1 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === 'financial-todo' ? currentPage === 'financial-todo' : item.panel ? activePanel === item.panel : false;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'new-chat') onNewChat();
                else if (item.id === 'financial-todo') onNavigatePage('financial-todo');
                else if (item.panel) onPanelToggle(item.panel);
              }}
              className={`relative flex flex-col items-center justify-center gap-[3px] w-[62px] h-[54px] rounded-[6px] text-center transition-all
                ${isActive ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#374151]'}`}
            >
              <span className="text-[20px] leading-none font-bold">{item.emoji}</span>
              <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
              {item.badge && (
                <span className="text-[8px] font-bold text-brq-accent">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer - Logout */}
      <div className="text-center text-[10px] font-bold text-[#9ca3af] mb-3 leading-none">
        <p className="text-[20px] mb-0.5">🚪</p>
        <p>로그아웃</p>
      </div>
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  const { mobileOpen, onMobileClose, selectedCategory, onCategorySelect, onNewChat, activePanel, onPanelToggle, currentPage, onNavigatePage } = props;

  // ESC 닫기 (→ 103_mobile_interaction#Drawer)
  useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen, onMobileClose]);

  // 좌측 스와이프 닫기
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    // 좌측으로 40% 이상 이동 (280 * 0.4 = 112)
    if (dx < -112 && onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col items-center w-[70px] shrink-0 bg-white border-r border-[#e5e7eb] h-dvh sticky top-0 z-20 overflow-hidden whitespace-nowrap py-3">
        <SidebarInner {...props} />
      </aside>

      {/* Mobile Drawer (→ 102 V04 Drawer, 101#Sidebar 변환) */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label="메뉴">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
            style={{ animation: 'brq-fade-in 200ms ease-out' }}
          />
          <div
            className="relative flex flex-col items-center bg-white h-full shadow-lg"
            style={{
              width: 'var(--brq-mobile-drawer-width, 280px)',
              animation: 'brq-slide-right 200ms ease-out',
              paddingTop: 'env(safe-area-inset-top, 0px)',
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {/* Drawer Header — V04 */}
            <div className="flex items-center justify-between w-full px-4 py-3 border-b border-[#e5e7eb]">
              <span className="text-[14px] font-bold text-brq-accent font-[Inter]">BranchQ</span>
              <button
                onClick={onMobileClose}
                className="p-2 -m-2 rounded hover:bg-[#f3f4f6]"
                aria-label="메뉴 닫기"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <X size={18} className="text-[#9ca3af]" aria-hidden="true" />
              </button>
            </div>

            {/* Profile & Scenario badge (V04 상단) */}
            <div className="w-full px-4 py-3 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white text-[14px] font-bold flex items-center justify-center shrink-0">W</div>
                <div>
                  <p className="text-[14px] font-bold text-[#1f2937]">웹케시 담당자</p>
                  <p className="text-[12px] text-[#6b7280]">기업자금관리 시나리오</p>
                </div>
              </div>
            </div>

            {/* 새 채팅 */}
            <div className="w-full px-3 pt-3">
              <button
                onClick={() => { onNewChat(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-semibold text-[#2563eb] hover:bg-[#eff6ff] transition-colors"
                style={{ minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
              >
                <span className="text-[18px]">💬</span> 새 채팅
              </button>
            </div>

            {/* 카테고리 5개 (V04 중단) */}
            <div className="w-full px-3 py-1">
              <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider px-3 mb-1">카테고리</p>
              {DRAWER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onCategorySelect(cat.id); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                    ${selectedCategory === cat.id ? 'bg-[#eff6ff] text-[#2563eb] font-semibold' : 'text-[#4b5563] hover:bg-[#f3f4f6]'}`}
                  style={{ minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
                >
                  <span className="text-[16px]">{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* 하단 메뉴 (V04 하단) */}
            <div className="w-full px-3 mt-auto border-t border-[#f3f4f6] pt-2 pb-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}>
              {NAV_ITEMS.filter((i) => i.panel).map((item) => {
                const isActive = item.id === 'financial-todo' ? currentPage === 'financial-todo' : item.panel ? activePanel === item.panel : false;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'financial-todo') onNavigatePage('financial-todo');
                      else if (item.panel) onPanelToggle(item.panel);
                      onMobileClose?.();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                      ${isActive ? 'bg-[#eff6ff] text-[#2563eb] font-semibold' : 'text-[#4b5563] hover:bg-[#f3f4f6]'}`}
                    style={{ minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
                  >
                    <span className="text-[16px]">{item.emoji}</span> {item.label}
                    {item.badge && <span className="ml-auto text-[10px] font-bold text-[#2563eb]">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
