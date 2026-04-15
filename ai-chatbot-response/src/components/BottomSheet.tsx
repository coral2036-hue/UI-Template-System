import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * BottomSheet — 모바일 전용 시트 래퍼.
 * → 브랜치Q 피그마 MD _ branchq-docs/103_mobile_interaction_v1.md
 * → 스냅 3단(peek 40% / half 75% / full 100% - safe-area-top)
 *
 * 기존 Modal(ModalOverlay)은 데스크톱 경로를 유지. 모바일(sm 이하)에서는
 * 동일한 children을 BottomSheet로 감싸 사용한다. props 변경 금지 원칙에
 * 따라 기존 모달의 JSX는 그대로 재사용한다.
 */

export type BottomSheetSnap = 'peek' | 'half' | 'full';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** 초기 스냅 위치. 미지정 시 'half' */
  initialSnap?: BottomSheetSnap;
  /** 허용 스냅 리스트(순서 유지). 미지정 시 ['peek','half','full'] */
  snaps?: BottomSheetSnap[];
  /** 스택 상 뒤에 있는 시트 여부 — scale/opacity 보정 */
  stacked?: boolean;
  children: ReactNode;
  /** 닫기 버튼 표시. 기본 true */
  showClose?: boolean;
  /** 드래그 핸들 표시. 기본 true */
  showHandle?: boolean;
}

const SNAP_TO_PCT: Record<BottomSheetSnap, number> = {
  peek: 40,
  half: 75,
  full: 100,
};

const DRAG_CLOSE_THRESHOLD_PX = 80;
const DRAG_SNAP_THRESHOLD_PX = 60;

export default function BottomSheet({
  open,
  onClose,
  title,
  initialSnap = 'half',
  snaps = ['peek', 'half', 'full'],
  stacked = false,
  children,
  showClose = true,
  showHandle = true,
}: BottomSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [snap, setSnap] = useState<BottomSheetSnap>(initialSnap);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);

  // ESC 닫기 + 포커스 복원
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  // open 토글마다 스냅 초기화
  useEffect(() => {
    if (open) setSnap(initialSnap);
  }, [open, initialSnap]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  // 스냅 이동 로직
  const moveSnap = useCallback(
    (direction: 1 | -1) => {
      const idx = snaps.indexOf(snap);
      const nextIdx = idx + direction;
      if (nextIdx < 0) {
        onClose();
        return;
      }
      if (nextIdx >= snaps.length) return;
      setSnap(snaps[nextIdx]);
    },
    [snap, snaps, onClose],
  );

  // Pointer 드래그 (핸들 영역에서만)
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartY.current = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const dy = e.clientY - dragStartY.current;
    // 아래로만 끌리는 시각 피드백 (위로 당길 때는 스냅 업으로만 처리)
    setDragOffset(Math.max(0, dy));
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const dy = e.clientY - dragStartY.current;
    dragStartY.current = null;
    setDragOffset(0);

    if (dy > DRAG_CLOSE_THRESHOLD_PX) {
      // peek에서 더 내리면 닫기, 그 외는 한 단계 다운
      moveSnap(-1);
    } else if (dy > DRAG_SNAP_THRESHOLD_PX) {
      moveSnap(-1);
    } else if (dy < -DRAG_SNAP_THRESHOLD_PX) {
      moveSnap(1);
    }
  };

  const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  if (!open || !modalRoot) return null;

  const heightPct = SNAP_TO_PCT[snap];
  const sheetStyle: React.CSSProperties = {
    height: `${heightPct}%`,
    maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px))',
    transform: `translateY(${dragOffset}px)${stacked ? ' scale(0.96)' : ''}`,
    opacity: stacked ? 0.8 : 1,
    transition: dragStartY.current === null ? 'transform 200ms ease-out, height 200ms ease-out, opacity 150ms ease-out' : 'none',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      role="presentation"
      style={{ animation: 'brq-fade-in 200ms ease-out' }}
    >
      <div
        ref={sheetRef}
        className="w-full bg-brq-surface shadow-brq-modal"
        style={{
          ...sheetStyle,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? '바텀시트'}
      >
        {/* Handle */}
        {showHandle && (
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex items-center justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing touch-none"
            style={{ minHeight: 24 }}
            aria-label="시트 핸들 (위/아래로 드래그)"
            role="separator"
          >
            <div className="w-9 h-1 rounded-full bg-brq-gray-300" />
          </div>
        )}

        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-4 pb-3">
            {title ? (
              <h2 className="text-[16px] font-bold text-brq-gray-900">{title}</h2>
            ) : (
              <span />
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="닫기"
                className="p-2 -m-2 rounded-md hover:bg-brq-gray-100 transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <X size={18} className="text-brq-gray-400" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 72px)' }}>
          {children}
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
