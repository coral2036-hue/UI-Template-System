import { User } from 'lucide-react';

export default function ChatBubble() {
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="bg-primary-blue rounded-[20px] px-5 py-2.5">
        <span className="text-white text-sm font-medium">
          금월 예적금 현황 및 만기도래 정보 알려줘
        </span>
      </div>
      <div className="w-9 h-9 rounded-full bg-primary-blue-light flex items-center justify-center shrink-0">
        <User size={18} className="text-primary-blue" />
      </div>
    </div>
  );
}
