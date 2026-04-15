import type { Message } from '../types';
import BlockRenderer from '../blocks/BlockRenderer';
import ShareRow from './ShareRow';

interface MessageBubbleProps {
  message: Message;
  onQuestionClick?: (q: string) => void;
  onShareAction?: (action: string) => void;
}

export default function MessageBubble({ message, onQuestionClick, onShareAction }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-brq-accent text-white rounded-[20px] px-6 py-3 text-[16px] leading-relaxed inline-block max-w-[70%]">
          {message.text}
        </div>
      </div>
    );
  }

  // AI message (v15 style: wider padding, rounded-lg)
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-brq-border rounded-lg px-8 py-7 w-full">
        {/* AI Text */}
        {message.text && (
          <p className="text-[16px] text-brq-gray-700 leading-[1.7] mb-4 whitespace-pre-line">{message.text}</p>
        )}

        {/* Blocks */}
        {message.blocks.length > 0 && (
          <div className="flex flex-col gap-3.5">
            {message.blocks.map((block, i) => (
              <div key={i} style={{ animation: `brq-slide-up ${300 + i * 50}ms ease` }}>
                <BlockRenderer block={block} onQuestionClick={onQuestionClick} />
              </div>
            ))}
          </div>
        )}

        {/* ShareRow */}
        {message.btnType !== 'none' && (
          <div className="mt-4 pt-3.5 border-t border-brq-gray-100 flex gap-2.5 justify-end">
            <ShareRow btnType={message.btnType} onAction={onShareAction} />
          </div>
        )}
      </div>
    </div>
  );
}
