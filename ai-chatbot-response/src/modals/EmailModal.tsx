import { useState } from 'react';
import ModalOverlay from './ModalOverlay';

interface Props {
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function EmailModal({ onClose, onToast }: Props) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    if (!to.trim()) return;
    onToast('이메일이 전송되었습니다.');
    onClose();
  };

  return (
    <ModalOverlay title="이메일 전송" onClose={onClose} mobilePresentation="fullscreen">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-[13px] text-brq-gray-500 mb-1 block">받는 사람</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="이메일 주소 입력"
            className="w-full h-10 rounded-md border border-brq-border px-3 text-[14px] focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent outline-none"
          />
        </div>
        <div>
          <label className="text-[13px] text-brq-gray-500 mb-1 block">제목</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="이메일 제목"
            className="w-full h-10 rounded-md border border-brq-border px-3 text-[14px] focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent outline-none"
          />
        </div>
        <div>
          <label className="text-[13px] text-brq-gray-500 mb-1 block">내용</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="이메일 내용을 입력하세요"
            rows={5}
            className="w-full rounded-md border border-brq-border px-3 py-2 text-[14px] focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent outline-none resize-none"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-4 rounded-[20px] text-[13px] text-brq-gray-600 bg-brq-gray-100 hover:bg-brq-gray-200 transition-colors">
          취소
        </button>
        <button
          onClick={handleSend}
          disabled={!to.trim()}
          className="h-9 px-4 rounded-[20px] text-[13px] text-white bg-brq-accent hover:bg-brq-accent-dark transition-colors disabled:bg-brq-gray-300 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </div>
    </ModalOverlay>
  );
}
