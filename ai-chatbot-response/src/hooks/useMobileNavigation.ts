import { useCallback, useState } from 'react';

/**
 * useMobileNavigation — 모바일 페이지 상태 관리.
 * → 102_mobile_screen_spec#뷰 목록
 *
 * 라우터 없이 상태 기반으로 V01~V13 뷰를 전환한다.
 * isMobile=false 환경에서는 mobilePage가 무시된다.
 */

export type MobilePage =
  | 'welcome'        // V01 Main-Welcome
  | 'chat'           // V02 Main-Chat
  | 'notifications'  // V13 Notifications
  | null;            // 기본 (데스크톱 모드 또는 초기 상태)

export interface MobileNavState {
  mobilePage: MobilePage;
  goToWelcome: () => void;
  goToChat: () => void;
  goToNotifications: () => void;
  goBack: () => void;
}

export function useMobileNavigation(): MobileNavState {
  const [mobilePage, setMobilePage] = useState<MobilePage>(null);

  const goToWelcome = useCallback(() => setMobilePage('welcome'), []);
  const goToChat = useCallback(() => setMobilePage('chat'), []);
  const goToNotifications = useCallback(() => setMobilePage('notifications'), []);

  const goBack = useCallback(() => {
    setMobilePage((prev) => {
      // V13 → V01, V02 → V01, 기본 → null
      if (prev === 'notifications' || prev === 'chat') return 'welcome';
      return null;
    });
  }, []);

  return { mobilePage, goToWelcome, goToChat, goToNotifications, goBack };
}
