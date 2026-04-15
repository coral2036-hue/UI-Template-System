import { useState } from 'react';
import { ArrowLeft, Bell, ShieldAlert, FileCheck, Settings } from 'lucide-react';

/**
 * V13 Notifications — 모바일 전용 알림 목록
 * → 102_mobile_screen_spec#V13
 * → 104_mobile_notification_deeplink#라우팅 매트릭스
 */

type NotificationTab = 'anomaly' | 'approval' | 'system';

interface NotificationItem {
  id: string;
  tab: NotificationTab;
  title: string;
  summary: string;
  time: string;
  read: boolean;
}

interface MobileNotificationsProps {
  onBack: () => void;
  onNotificationClick?: (item: NotificationItem) => void;
}

const TABS: { id: NotificationTab; label: string; icon: typeof Bell }[] = [
  { id: 'anomaly', label: '이상거래', icon: ShieldAlert },
  { id: 'approval', label: '승인요청', icon: FileCheck },
  { id: 'system', label: '시스템', icon: Settings },
];

// 더미 알림 데이터
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', tab: 'anomaly', title: '이상거래 감지', summary: '법인카드 해외결제 ₩2,350,000 — 패턴 이상 감지됨', time: '5분 전', read: false },
  { id: 'n2', tab: 'anomaly', title: '대량 인출 경고', summary: '본사 계좌에서 ₩50,000,000 이체 시도', time: '12분 전', read: false },
  { id: 'n3', tab: 'anomaly', title: '야간 거래 감지', summary: '새벽 3시 법인카드 온라인 결제 ₩890,000', time: '2시간 전', read: true },
  { id: 'n4', tab: 'approval', title: '보고서 승인 요청', summary: '1분기 자금현황 보고서 — 김과장 작성', time: '30분 전', read: false },
  { id: 'n5', tab: 'approval', title: '이체 승인 요청', summary: '부산지점 → 본사 ₩15,000,000', time: '1시간 전', read: true },
  { id: 'n6', tab: 'system', title: '시스템 점검 안내', summary: '4/15(화) 02:00~04:00 정기 점검', time: '3시간 전', read: true },
  { id: 'n7', tab: 'system', title: '모델 업데이트', summary: 'BranchQ Plus v2.1 적용 완료', time: '어제', read: true },
];

export default function MobileNotifications({ onBack, onNotificationClick }: MobileNotificationsProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>('anomaly');

  const filtered = MOCK_NOTIFICATIONS.filter((n) => n.tab === activeTab);
  const unreadCounts: Record<NotificationTab, number> = {
    anomaly: MOCK_NOTIFICATIONS.filter((n) => n.tab === 'anomaly' && !n.read).length,
    approval: MOCK_NOTIFICATIONS.filter((n) => n.tab === 'approval' && !n.read).length,
    system: MOCK_NOTIFICATIONS.filter((n) => n.tab === 'system' && !n.read).length,
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6]">
      {/* Header — 52px (→ 101 mobile-header-height) */}
      <header
        className="flex items-center gap-3 px-4 bg-white border-b border-[#e5e7eb] shrink-0"
        style={{ height: 'var(--brq-mobile-header-height, 52px)', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] transition-colors"
          style={{ minWidth: 'var(--brq-mobile-tap-target-min, 44px)', minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} className="text-[#374151]" />
        </button>
        <h1 className="text-[16px] font-bold text-[#1f2937]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          알림
        </h1>
      </header>

      {/* Tab bar */}
      <div className="flex bg-white border-b border-[#e5e7eb] shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold border-b-2 transition-colors relative
              ${activeTab === id
                ? 'text-[#2563eb] border-[#2563eb]'
                : 'text-[#6b7280] border-transparent hover:text-[#374151]'
              }`}
            style={{ minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
          >
            <Icon size={16} />
            {label}
            {unreadCounts[id] > 0 && (
              <span className="absolute top-2 right-[calc(50%-28px)] min-w-[18px] h-[18px] px-1 rounded-full bg-[#dc2626] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCounts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#9ca3af]">
            <Bell size={40} strokeWidth={1} />
            <p className="mt-3 text-[14px]">알림이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e7eb]">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onNotificationClick?.(item)}
                className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors hover:bg-white
                  ${!item.read ? 'bg-[#eff6ff]' : 'bg-transparent'}`}
                style={{ minHeight: 'var(--brq-mobile-tap-target-min, 44px)' }}
              >
                {/* Unread dot */}
                <div className="pt-1.5 shrink-0">
                  {!item.read ? (
                    <span className="block w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  ) : (
                    <span className="block w-2.5 h-2.5" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] leading-snug truncate ${!item.read ? 'font-bold text-[#1f2937]' : 'font-medium text-[#374151]'}`}>
                    {item.title}
                  </p>
                  <p className="text-[13px] text-[#6b7280] mt-0.5 line-clamp-2 leading-snug">
                    {item.summary}
                  </p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">{item.time}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
