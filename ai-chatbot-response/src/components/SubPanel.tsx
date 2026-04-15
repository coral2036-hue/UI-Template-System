import { X, Clock, FileText, Settings, Wallet } from 'lucide-react';
import type { SubPanelType, FinancialTodo } from '../types';
import { FinancialTodoDashboard } from './FinancialTodoDashboard';

interface SubPanelProps {
  type: SubPanelType;
  onClose: () => void;
  financialTodoData?: {
    todos: FinancialTodo[];
    onAddTodo: () => void;
    onEditTodo: (todo: FinancialTodo) => void;
    onDeleteTodo: (id: string) => void;
    onToggleComplete: (id: string) => void;
    onViewAnswer?: (todo: FinancialTodo) => void;
    onGenerateAnswer?: (id: string) => Promise<void>;
  };
}

const PANEL_CONFIG: Record<SubPanelType, { title: string; Icon: typeof Clock }> = {
  recent: { title: '최근 대화', Icon: Clock },
  report: { title: '리포트', Icon: FileText },
  'financial-todo': { title: '자금 To-Do', Icon: Wallet },
  settings: { title: '설정', Icon: Settings },
};

export default function SubPanel({ type, onClose, financialTodoData }: SubPanelProps) {
  const config = PANEL_CONFIG[type];

  return (
    <div
      className="w-[320px] h-dvh bg-brq-white border-l border-brq-border shrink-0 flex flex-col"
      style={{ animation: 'brq-slide-in-right 200ms ease-in-out', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
    >
      {/* Header */}
      <div className="h-[56px] flex items-center justify-between px-4 border-b border-brq-border shrink-0">
        <div className="flex items-center gap-2">
          <config.Icon size={16} className="text-brq-gray-500" />
          <span className="text-[16px] font-bold text-brq-gray-900">{config.title}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-brq-gray-100 transition-colors">
          <X size={16} className="text-brq-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {type === 'recent' && (
          <div className="flex flex-col gap-2">
            {['법인카드 사용 내역 조회', '4월 분석 리포트', '이상거래 현황 확인'].map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-brq-border hover:bg-brq-gray-50 cursor-pointer transition-colors">
                <p className="text-[14px] text-brq-gray-700 truncate">{item}</p>
                <p className="text-[12px] text-brq-gray-400 mt-1 font-number">2026.04.{13 - i}</p>
              </div>
            ))}
          </div>
        )}

        {type === 'report' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText size={32} className="text-brq-gray-300 mb-2" />
            <p className="text-[14px] text-brq-gray-400">아직 저장된 리포트가 없습니다</p>
          </div>
        )}

        {type === 'financial-todo' && financialTodoData ? (
          <FinancialTodoDashboard
            todos={financialTodoData.todos}
            onAddTodo={financialTodoData.onAddTodo}
            onEditTodo={financialTodoData.onEditTodo}
            onDeleteTodo={financialTodoData.onDeleteTodo}
            onToggleComplete={financialTodoData.onToggleComplete}
            onViewAnswer={financialTodoData.onViewAnswer}
            onGenerateAnswer={financialTodoData.onGenerateAnswer}
          />
        ) : null}

        {type === 'settings' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-brq-border">
              <span className="text-[14px] text-brq-gray-700">다크 모드</span>
              <div className="w-10 h-5 bg-brq-gray-300 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-brq-border">
              <span className="text-[14px] text-brq-gray-700">알림</span>
              <div className="w-10 h-5 bg-brq-accent rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
