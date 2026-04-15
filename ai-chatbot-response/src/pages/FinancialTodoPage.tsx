import { ArrowLeft } from 'lucide-react';
import type { FinancialTodo } from '../types';
import { FinancialTodoDashboard } from '../components/FinancialTodoDashboard';

interface FinancialTodoPageProps {
  todos: FinancialTodo[];
  onBack: () => void;
  onAddTodo: () => void;
  onEditTodo: (todo: FinancialTodo) => void;
  onDeleteTodo: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onViewAnswer?: (todo: FinancialTodo) => void;
  onGenerateAnswer?: (id: string) => Promise<void>;
}

export default function FinancialTodoPage({
  todos,
  onBack,
  onAddTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleComplete,
  onViewAnswer,
  onGenerateAnswer,
}: FinancialTodoPageProps) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-[56px] flex items-center justify-between px-6 border-b border-brq-border shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="뒤로가기"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-[20px] font-bold text-gray-900">💰 자금 To-Do</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <FinancialTodoDashboard
          todos={todos}
          onAddTodo={onAddTodo}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleComplete={onToggleComplete}
          onViewAnswer={onViewAnswer}
          onGenerateAnswer={onGenerateAnswer}
        />
      </div>
    </div>
  );
}
