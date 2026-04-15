import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * BlockFullView — 블록(표·차트 등) 풀스크린 뷰어.
 * → 브랜치Q 피그마 MD _ branchq-docs/103_mobile_interaction_v1.md#BlockFullView
 *
 * - V02 Main-Chat / V07 Report-Detail 내부 블록 탭 시 진입
 * - 핀치 줌(1.0~3.0), 더블탭 원복, 아래로 강하게 드래그 시 닫기
 * - 블록의 렌더는 children으로 위임 (기존 Block 컴포넌트 props 변경 없이 감싼다)
 */

interface BlockFullViewProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** 차트 가로모드 권장 여부 — 상단 바에 안내 표시 */
  suggestLandscape?: boolean;
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const DOUBLE_TAP_MS = 300;
const DRAG_CLOSE_THRESHOLD = 120;

export default function BlockFullView({
  open,
  onClose,
  title,
  children,
  suggestLandscape = false,
}: BlockFullViewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [dragY, setDragY] = useState(0);
  const lastTapRef = useRef<number>(0);
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<number | null>(null);

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

  // open 리셋
  useEffect(() => {
    if (open) {
      setZoom(1);
      setDragY(0);
    }
  }, [open]);

  const distanceOf = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (pointers.current.size === 2) {
      const [p1, p2] = Array.from(pointers.current.values());
      pinchStartRef.current = { distance: distanceOf(p1, p2), zoom };
      dragStartRef.current = null;
    } else if (pointers.current.size === 1) {
      // 더블탭 감지
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        setZoom((z) => (z > 1 ? 1 : 2));
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
      dragStartRef.current = e.clientY;
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStartRef.current) {
      const [p1, p2] = Array.from(pointers.current.values());
      const d = distanceOf(p1, p2);
      const ratio = d / pinchStartRef.current.distance;
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, pinchStartRef.current.zoom * ratio));
      setZoom(next);
      return;
    }

    if (pointers.current.size === 1 && zoom === 1 && dragStartRef.current !== null) {
      const dy = e.clientY - dragStartRef.current;
      setDragY(Math.max(0, dy));
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStartRef.current = null;

    if (dragStartRef.current !== null && zoom === 1) {
      if (dragY > DRAG_CLOSE_THRESHOLD) {
        onClose();
      } else {
        setDragY(0);
      }
      dragStartRef.current = null;
    }
  };

  const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  if (!open || !modalRoot) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-brq-surface flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? '블록 전체 보기'}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: `translateY(${dragY}px)`,
        transition: dragStartRef.current === null ? 'transform 200ms ease-out' : 'none',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 border-b border-brq-border"
        style={{ height: 52, minHeight: 52 }}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-2 -m-2 rounded-md hover:bg-brq-gray-100 transition-colors"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <X size={20} className="text-brq-gray-700" aria-hidden="true" />
        </button>
        <h2 className="text-[14px] font-semibold text-brq-gray-900 truncate px-2">
          {title ?? '전체 보기'}
        </h2>
        <div style={{ minWidth: 44 }} />
      </div>

      {suggestLandscape && (
        <div className="px-4 py-2 text-[12px] text-brq-text-secondary bg-brq-gray-50">
          기기를 가로로 돌리면 더 크게 볼 수 있어요.
        </div>
      )}

      {/* Content */}
      <div
        className="flex-1 overflow-auto touch-pan-x touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: pinchStartRef.current ? 'none' : 'transform 150ms ease-out',
            padding: 16,
            minWidth: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
