import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  onQuestionClick?: (q: string) => void;
  onShareAction?: (action: string) => void;
}

export default function ChatArea({
  messages,
  loading,
  onQuestionClick,
  onShareAction,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 sm:py-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-[800px] mx-auto flex flex-col gap-3 sm:gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ animation: 'brq-slide-up 300ms ease-out' }}
          >
            <MessageBubble
              message={msg}
              onQuestionClick={onQuestionClick}
              onShareAction={onShareAction}
            />
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
