import ModalOverlay from './ModalOverlay';
import { Link, MessageCircle, Mail, Download } from 'lucide-react';
import type { ModalType } from '../types';

interface Props {
  onClose: () => void;
  onOpenModal: (type: ModalType) => void;
  onToast: (msg: string) => void;
}

const ACTIONS = [
  { label: '링크 복사', Icon: Link, action: 'copy-link' },
  { label: '카카오톡', Icon: MessageCircle, action: 'kakao-preview' },
  { label: '이메일', Icon: Mail, action: 'email' },
  { label: '다운로드', Icon: Download, action: 'download' },
] as const;

export default function ShareModal({ onClose, onOpenModal, onToast }: Props) {
  const handleAction = (action: string) => {
    if (action === 'copy-link') {
      onToast('링크가 복사되었습니다.');
      onClose();
    } else if (action === 'kakao-preview') {
      onClose();
      onOpenModal('kakao-preview');
    } else if (action === 'email') {
      onClose();
      onOpenModal('email');
    } else if (action === 'download') {
      onToast('다운로드를 시작합니다.');
      onClose();
    }
  };

  return (
    <ModalOverlay title="공유" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => (
          <button
            key={a.action}
            onClick={() => handleAction(a.action)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-brq-border hover:bg-brq-gray-50 transition-colors"
          >
            <a.Icon size={24} className="text-brq-gray-600" />
            <span className="text-[13px] text-brq-gray-700">{a.label}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  );
}
