import { useCallback, useEffect, useState } from 'react';
import type { BottomSheetSnap } from '../components/BottomSheet';

/**
 * useMobileUI — 모바일 전용 UI 상태 훅.
 * → 브랜치Q 피그마 MD _ branchq-docs/105_mobile_component_mapping_v1.md#State 추가
 *
 * AppState(→ 00_master_prompt#AppState)는 수정하지 않는다(append-only).
 * 모바일에서만 활성화되는 Drawer / BottomSheet 스택 / BlockFullView 상태를 이곳에만 둔다.
 */

export interface BottomSheetEntry {
  id: string;
  snap: BottomSheetSnap;
}

export interface BlockFullViewState {
  blockId: string;
  title?: string;
}

interface UseMobileUIReturn {
  /** sm 브레이크포인트(640px) 이하 여부 */
  isMobile: boolean;
  /** Drawer(= 모바일 Sidebar) 열림 여부 */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  /** BottomSheet 스택 — 마지막 항목이 최상위 */
  bottomSheetStack: BottomSheetEntry[];
  openBottomSheet: (entry: BottomSheetEntry) => void;
  closeBottomSheet: () => void;
  closeAllBottomSheets: () => void;
  /** BlockFullView */
  blockFullView: BlockFullViewState | null;
  openBlockFullView: (state: BlockFullViewState) => void;
  closeBlockFullView: () => void;
}

const MOBILE_BREAKPOINT_PX = 640;

export function useMobileUI(): UseMobileUIReturn {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT_PX;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomSheetStack, setBottomSheetStack] = useState<BottomSheetEntry[]>([]);
  const [blockFullView, setBlockFullView] = useState<BlockFullViewState | null>(null);

  // 뷰포트 감지 (→ 101_mobile_layout_spec#반응형 정책)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handle(mq);

    // 최신 브라우저
    if ('addEventListener' in mq) {
      mq.addEventListener('change', handle);
      return () => mq.removeEventListener('change', handle);
    }
    // 구 Safari 대응
    (mq as unknown as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(
      handle,
    );
    return () => {
      (mq as unknown as {
        removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
      }).removeListener(handle);
    };
  }, []);

  // 데스크톱으로 바뀌면 모바일 전용 UI 초기화
  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false);
      setBottomSheetStack([]);
      setBlockFullView(null);
    }
  }, [isMobile]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((v) => !v), []);

  const openBottomSheet = useCallback((entry: BottomSheetEntry) => {
    setBottomSheetStack((prev) => {
      // 같은 id가 이미 최상위면 무시
      if (prev.length > 0 && prev[prev.length - 1].id === entry.id) return prev;
      // 스택 depth 제한 (→ 103#스택 최대 2)
      const next = [...prev, entry];
      return next.slice(-2);
    });
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetStack((prev) => prev.slice(0, -1));
  }, []);

  const closeAllBottomSheets = useCallback(() => setBottomSheetStack([]), []);

  const openBlockFullView = useCallback((state: BlockFullViewState) => setBlockFullView(state), []);
  const closeBlockFullView = useCallback(() => setBlockFullView(null), []);

  return {
    isMobile,
    drawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    bottomSheetStack,
    openBottomSheet,
    closeBottomSheet,
    closeAllBottomSheets,
    blockFullView,
    openBlockFullView,
    closeBlockFullView,
  };
}
