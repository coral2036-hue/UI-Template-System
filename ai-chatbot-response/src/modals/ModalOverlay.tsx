import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMobileUI } from '../hooks/useMobileUI';
import BottomSheet, { type BottomSheetSnap } from '../components/BottomSheet';

interface ModalOverlayProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  /**
   * 모바일(sm 이하)에서의 표시 방식. 기본 'bottomsheet'.
   * 'fullscreen'은 스냅 full 고정 + 드래그 핸들 비노출 (M5 이메일 등)
   * → 102_mobile_screen_spec#V11 Modal-Email / 101#Modal 변환표
   */
  mobilePresentation?: 'bottomsheet' | 'fullscreen';
  /** mobilePresentation이 'bottomsheet'일 때 초기 스냅. 기본 'half' */
  mobileInitialSnap?: BottomSheetSnap;
}

export default function ModalOverlay({
  title,
  onClose,
  children,
  maxWidth = '480px',
  mobilePresentation = 'bottomsheet',
  mobileInitialSnap = 'half',
}: ModalOverlayProps) {
  const { isMobile } = useMobileUI();

  // 모바일에서는 BottomSheet로 위임 (→ 105_mobile_component_mapping)
  if (isMobile) {
    const snaps: BottomSheetSnap[] =
      mobilePresentation === 'fullscreen' ? ['full'] : ['peek', 'half', 'full'];
    return (
      <BottomSheet
        open
        onClose={onClose}
        title={title}
        initialSnap={mobilePresentation === 'fullscreen' ? 'full' : mobileInitialSnap}
        snaps={snaps}
        showHandle={mobilePresentation !== 'fullscreen'}
      >
        {children}
      </BottomSheet>
    );
  }

  return <DesktopModal title={title} onClose={onClose} maxWidth={maxWidth}>{children}</DesktopModal>;
}

function DesktopModal({
  title,
  onClose,
  children,
  maxWidth,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[4px]"
      style={{ animation: 'brq-fade-in 200ms ease-in-out' }}
      role="presentation"
    >
      <div
        className="bg-brq-white rounded-lg p-6 w-full mx-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          maxWidth,
          boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
          animation: 'brq-slide-up 200ms ease-in-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-[16px] font-bold text-brq-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded-md hover:bg-brq-gray-100 transition-colors"
          >
            <X size={18} className="text-brq-gray-400" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}
