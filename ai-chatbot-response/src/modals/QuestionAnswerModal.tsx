import { X, Copy, RotateCcw } from 'lucide-react';
import type { FinancialTodo } from '../types';

interface QuestionAnswerModalProps {
  isOpen: boolean;
  todo: FinancialTodo | null;
  onClose: () => void;
  onRetry?: (id: string) => Promise<void>;
}

export function QuestionAnswerModal({
  isOpen,
  todo,
  onClose,
  onRetry,
}: QuestionAnswerModalProps) {
  if (!isOpen || !todo || !todo.answer) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(todo.answer?.answer || '');
    alert('답변이 복사되었습니다.');
  };

  const handleRetry = async () => {
    if (onRetry) {
      await onRetry(todo.id);
    }
  };

  const generatedAt = todo.answer?.generatedAt
    ? new Date(todo.answer.generatedAt).toLocaleString('ko-KR')
    : '-';

  const isError = todo.answer?.aiModel === 'error';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-brq-border-light">
          <div>
            <h2 className="text-lg font-semibold text-brq-text-primary flex items-center gap-2">
              <span>❓</span> 질문 상세보기
            </h2>
            <p className="text-xs text-brq-text-secondary mt-1">
              실행: {todo.schedule?.repeat === 'once' ? '1회' : todo.schedule?.repeat === 'weekly' ? '매주' : '매월'}{' '}
              {todo.dueDate} {todo.schedule?.reminderTime || '자동 미설정'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={20} className="text-brq-text-secondary" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 질문 */}
          <div>
            <h3 className="text-sm font-semibold text-brq-text-primary mb-2">
              질문
            </h3>
            <p className="text-sm text-brq-text-secondary bg-brq-bg-light p-4 rounded-lg whitespace-pre-wrap">
              {todo.question}
            </p>
          </div>

          {/* 답변 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-brq-text-primary">
                답변
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isError
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {isError ? '❌ 오류 발생' : '✅ 완료'}
              </span>
            </div>
            <div className="text-sm text-brq-text-secondary bg-brq-bg-light p-4 rounded-lg whitespace-pre-wrap max-h-64 overflow-y-auto">
              {todo.answer.answer}
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="border-t border-brq-border-light pt-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-brq-text-secondary">생성 모델</p>
                <p className="text-brq-text-primary font-medium mt-1">
                  {todo.answer.aiModel === 'structured'
                    ? 'Structured (기본)'
                    : todo.answer.aiModel === 'error'
                      ? '오류'
                      : todo.answer.aiModel}
                </p>
              </div>
              <div>
                <p className="text-brq-text-secondary">생성 시간</p>
                <p className="text-brq-text-primary font-medium mt-1">
                  {generatedAt}
                </p>
              </div>
              {todo.answer.executionLog.length > 0 && (
                <div className="col-span-2">
                  <p className="text-brq-text-secondary mb-2">실행 이력</p>
                  <div className="bg-brq-bg-light p-2 rounded text-xs space-y-1 max-h-32 overflow-y-auto">
                    {todo.answer.executionLog.map((log, idx) => (
                      <div key={idx} className="text-brq-text-secondary">
                        <span className="font-medium">[{log.status}]</span>{' '}
                        {new Date(log.timestamp).toLocaleTimeString('ko-KR')}
                        {log.message && ` - ${log.message}`}
                        {log.duration && ` (${log.duration}ms)`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4 border-t border-brq-border-light">
            <button
              onClick={handleCopy}
              className="flex-1 h-9 rounded-lg border border-brq-border-light text-brq-text-primary font-medium text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              복사
            </button>
            {onRetry && (
              <button
                onClick={handleRetry}
                className="flex-1 h-9 rounded-lg border border-brq-border-light text-brq-text-primary font-medium text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                재생성
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded-lg bg-brq-accent text-white font-medium text-sm hover:bg-brq-accent-dark transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionAnswerModal;
