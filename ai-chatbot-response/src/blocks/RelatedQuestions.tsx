import type { RelatedQuestionsData } from '../types';

interface Props extends RelatedQuestionsData {
  onQuestionClick?: (q: string) => void;
}

export default function RelatedQuestions({ items, onQuestionClick }: Props) {
  return (
    <div>
      <p className="text-[14px] font-semibold text-brq-gray-900 mb-2">💬 관련 질문</p>
      <div className="flex flex-wrap gap-2">
        {items.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick?.(q)}
            className="text-[13px] text-brq-gray-700 bg-brq-white border border-brq-border rounded-[20px] px-3.5 py-2 hover:border-brq-accent hover:bg-brq-accent-light transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
