import ModalOverlay from './ModalOverlay';

interface Props {
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function SendMethodModal({ onClose, onToast }: Props) {
  const handleSelect = (method: string) => {
    if (method === 'mms') {
      onToast('문자 메시지(MMS)로 전송되었습니다.');
    } else if (method === 'kakao') {
      onToast('카카오톡으로 전송되었습니다.');
    }
    onClose();
  };

  return (
    <ModalOverlay title="📱 전송 방법 선택" onClose={onClose}>
      <p className="text-[14px] text-brq-gray-500 mb-5">아래 방법을 선택해주세요</p>
      <div className="flex flex-col gap-3">
        {/* MMS */}
        <button
          onClick={() => handleSelect('mms')}
          className="flex items-center gap-4 p-5 border border-brq-border rounded-xl bg-white hover:border-brq-accent hover:bg-brq-accent-light hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-full bg-green-100 flex items-center justify-center text-[24px] shrink-0">
            💬
          </div>
          <div>
            <p className="text-[16px] font-semibold text-brq-gray-800">문자 메시지 (MMS)</p>
            <p className="text-[14px] text-brq-gray-400 mt-0.5">이미지 문자로 전송합니다</p>
          </div>
          <span className="ml-auto text-brq-gray-300 text-[18px]">›</span>
        </button>

        {/* KakaoTalk */}
        <button
          onClick={() => handleSelect('kakao')}
          className="flex items-center gap-4 p-5 border border-brq-border rounded-xl bg-white hover:border-brq-accent hover:bg-brq-accent-light hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-full bg-yellow-100 flex items-center justify-center text-[24px] shrink-0">
            💛
          </div>
          <div>
            <p className="text-[16px] font-semibold text-brq-gray-800">카카오톡</p>
            <p className="text-[14px] text-brq-gray-400 mt-0.5">카카오톡으로 확인합니다</p>
          </div>
          <span className="ml-auto text-brq-gray-300 text-[18px]">›</span>
        </button>
      </div>
    </ModalOverlay>
  );
}
