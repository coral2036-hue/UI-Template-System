import ModalOverlay from './ModalOverlay';

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ title, message, onConfirm, onClose }: Props) {
  return (
    <ModalOverlay title={title} onClose={onClose}>
      <p className="text-[14px] text-brq-gray-700 mb-6 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-4 rounded-[20px] text-[13px] text-brq-gray-600 bg-brq-gray-100 hover:bg-brq-gray-200 transition-colors">
          취소
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="h-9 px-4 rounded-[20px] text-[13px] text-white bg-brq-accent hover:bg-brq-accent-dark transition-colors"
        >
          확인
        </button>
      </div>
    </ModalOverlay>
  );
}
