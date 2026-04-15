import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import type { FinancialTodo, FinancialTodoSchedule, FinancialTodoType } from '../types';

interface FinancialTodoModalProps {
  isOpen: boolean;
  todo?: FinancialTodo;
  onClose: () => void;
  onSave: (todo: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function FinancialTodoModal({ isOpen, todo, onClose, onSave }: FinancialTodoModalProps) {
  // Step state
  const [step, setStep] = useState<1 | 2>(1);
  const [todoType, setTodoType] = useState<FinancialTodoType>('task');

  // Common fields
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  // Task fields
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [repeat, setRepeat] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [repeatEndDate, setRepeatEndDate] = useState('');

  // Question fields
  const [question, setQuestion] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [generateTime, setGenerateTime] = useState('09:00');
  const [generateRepeat, setGenerateRepeat] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [generateRepeatEndDate, setGenerateRepeatEndDate] = useState('');

  // Initialize from existing todo or defaults
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (todo) {
      setTodoType(todo.type);
      setCategory(todo.category);
      setDueDate(todo.dueDate);
      setDescription(todo.description || '');

      if (todo.type === 'task') {
        setTitle(todo.title || '');
        setPriority(todo.priority);
        if (todo.schedule) {
          setHasReminder(todo.schedule.hasReminder);
          setReminderTime(todo.schedule.reminderTime || '09:00');
          setRepeat(todo.schedule.repeat);
          setRepeatEndDate(todo.schedule.repeatEndDate || '');
        }
      } else {
        setQuestion(todo.question || '');
        setAutoGenerate(todo.autoGenerate || false);
        if (todo.schedule) {
          setGenerateTime(todo.schedule.reminderTime || '09:00');
          setGenerateRepeat(todo.schedule.repeat);
          setGenerateRepeatEndDate(todo.schedule.repeatEndDate || '');
        }
      }
    } else {
      // Reset to defaults
      setTodoType('task');
      setCategory('');
      setDueDate(today);
      setDescription('');
      setTitle('');
      setPriority('medium');
      setHasReminder(false);
      setReminderTime('09:00');
      setRepeat('once');
      setRepeatEndDate('');
      setQuestion('');
      setAutoGenerate(false);
      setGenerateTime('09:00');
      setGenerateRepeat('once');
      setGenerateRepeatEndDate('');
    }

    setStep(1);
  }, [todo, isOpen]);

  const handleTypeSelect = (type: FinancialTodoType) => {
    setTodoType(type);
    setStep(2);
  };

  const handleSave = () => {
    if (todoType === 'task') {
      if (!title.trim() || !dueDate) {
        alert('제목과 마감일은 필수입니다.');
        return;
      }

      const schedule: FinancialTodoSchedule | undefined = hasReminder
        ? {
            hasReminder: true,
            reminderTime,
            repeat,
            repeatEndDate: repeatEndDate || undefined,
          }
        : undefined;

      const newTodo: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'task',
        title: title.trim(),
        category: category.trim(),
        dueDate,
        priority,
        description: description.trim(),
        completed: todo?.completed || false,
        schedule,
      };

      onSave(newTodo);
    } else {
      // Question type
      if (!question.trim() || !dueDate) {
        alert('질문과 실행예정일은 필수입니다.');
        return;
      }

      const schedule: FinancialTodoSchedule | undefined = autoGenerate
        ? {
            hasReminder: true,
            reminderTime: generateTime,
            repeat: generateRepeat,
            repeatEndDate: generateRepeatEndDate || undefined,
          }
        : undefined;

      const newTodo: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'question',
        question: question.trim(),
        category: category.trim(),
        dueDate,
        completed: false,
        priority: 'medium',
        description: description.trim(),
        autoGenerate,
        schedule,
      };

      onSave(newTodo);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-brq-border-light">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronLeft size={20} className="text-brq-text-secondary" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-brq-text-primary">
              {step === 1
                ? 'To-Do 추가'
                : todoType === 'task'
                  ? '작업 추가'
                  : '질문 추가'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={20} className="text-brq-text-secondary" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Type Selection
            <div className="space-y-4">
              <p className="text-sm text-brq-text-secondary mb-6">
                To-Do 유형을 선택해주세요
              </p>

              {/* Task Option */}
              <button
                onClick={() => handleTypeSelect('task')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  todoType === 'task'
                    ? 'border-brq-accent bg-blue-50'
                    : 'border-brq-border-light hover:border-brq-accent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📋</div>
                  <div>
                    <h3 className="font-semibold text-brq-text-primary">
                      일반 작업
                    </h3>
                    <p className="text-xs text-brq-text-secondary mt-1">
                      예: 예금 만기 확인, 송금 처리
                    </p>
                  </div>
                </div>
              </button>

              {/* Question Option */}
              <button
                onClick={() => handleTypeSelect('question')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  todoType === 'question'
                    ? 'border-brq-accent bg-amber-50'
                    : 'border-brq-border-light hover:border-brq-accent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">❓</div>
                  <div>
                    <h3 className="font-semibold text-brq-text-primary">
                      질문/분석
                    </h3>
                    <p className="text-xs text-brq-text-secondary mt-1">
                      예: 매달 실적 분석, 환율 변동 조사
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect(todoType)}
                className="w-full mt-6 h-9 rounded-full bg-brq-accent text-white font-medium text-sm hover:bg-brq-accent-dark transition"
              >
                다음
              </button>
            </div>
          ) : todoType === 'task' ? (
            // Step 2: Task Form
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 예금 만기 확인"
                  className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  카테고리
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예: 예금, 송금, 신용카드"
                  className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                />
              </div>

              {/* 마감일 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  마감일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                />
              </div>

              {/* 우선순위 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  우선순위
                </label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={priority === level}
                        onChange={() => setPriority(level)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        {level === 'low'
                          ? '낮음'
                          : level === 'medium'
                            ? '중간'
                            : '높음'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="추가 메모..."
                  rows={2}
                  className="w-full px-3 py-2 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm resize-none"
                />
              </div>

              {/* 알림 설정 */}
              <div className="pt-2 border-t border-brq-border-light">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={hasReminder}
                    onChange={(e) => setHasReminder(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-brq-text-primary">
                    알림 설정
                  </span>
                </label>

                {hasReminder && (
                  <div className="space-y-3 ml-6">
                    <div>
                      <label className="text-sm font-medium text-brq-text-primary block mb-2">
                        알림 시간
                      </label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-brq-text-primary block mb-2">
                        반복
                      </label>
                      <div className="flex gap-3 flex-wrap">
                        {(['once', 'daily', 'weekly', 'monthly'] as const).map((r) => (
                          <label
                            key={r}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="repeat"
                              value={r}
                              checked={repeat === r}
                              onChange={() => setRepeat(r)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {r === 'once'
                                ? '1회'
                                : r === 'daily'
                                  ? '매일'
                                  : r === 'weekly'
                                    ? '매주'
                                    : '매월'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {repeat !== 'once' && (
                      <div>
                        <label className="text-sm font-medium text-brq-text-primary block mb-2">
                          반복 종료일 (선택)
                        </label>
                        <input
                          type="date"
                          value={repeatEndDate}
                          onChange={(e) => setRepeatEndDate(e.target.value)}
                          className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4 border-t border-brq-border-light">
                <button
                  onClick={onClose}
                  className="flex-1 h-9 rounded-full border border-brq-border-light text-brq-text-primary font-medium text-sm hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-9 rounded-full bg-brq-accent text-white font-medium text-sm hover:bg-brq-accent-dark transition"
                >
                  추가
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Question Form
            <div className="space-y-4">
              {/* 질문 내용 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  질문 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="예: 지난달 매출 현황을 분석해주세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm resize-none"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  카테고리 (선택)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예: 매출 분석, 환율, 뉴스"
                  className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                />
              </div>

              {/* 실행 예정일 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  실행 예정일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="text-sm font-medium text-brq-text-primary block mb-2">
                  추가 정보 (선택)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="분석에 필요한 추가 정보..."
                  rows={2}
                  className="w-full px-3 py-2 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm resize-none"
                />
              </div>

              {/* 자동 생성 */}
              <div className="pt-2 border-t border-brq-border-light">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-brq-text-primary">
                    자동 생성 활성화
                  </span>
                </label>

                {autoGenerate && (
                  <div className="space-y-3 ml-6">
                    <div>
                      <label className="text-sm font-medium text-brq-text-primary block mb-2">
                        자동 실행 시간
                      </label>
                      <input
                        type="time"
                        value={generateTime}
                        onChange={(e) => setGenerateTime(e.target.value)}
                        className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-brq-text-primary block mb-2">
                        반복 주기
                      </label>
                      <div className="flex gap-3 flex-wrap">
                        {(['once', 'daily', 'weekly', 'monthly'] as const).map((r) => (
                          <label
                            key={r}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="generateRepeat"
                              value={r}
                              checked={generateRepeat === r}
                              onChange={() => setGenerateRepeat(r)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {r === 'once'
                                ? '1회'
                                : r === 'daily'
                                  ? '매일'
                                  : r === 'weekly'
                                    ? '매주'
                                    : '매월'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {generateRepeat !== 'once' && (
                      <div>
                        <label className="text-sm font-medium text-brq-text-primary block mb-2">
                          반복 종료일 (선택)
                        </label>
                        <input
                          type="date"
                          value={generateRepeatEndDate}
                          onChange={(e) =>
                            setGenerateRepeatEndDate(e.target.value)
                          }
                          className="w-full h-10 px-3 border border-brq-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brq-accent/20 focus:border-brq-accent text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}

                {!autoGenerate && (
                  <p className="text-xs text-brq-text-secondary ml-6">
                    대시보드에서 [생성하기] 버튼으로 수동 생성
                  </p>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4 border-t border-brq-border-light">
                <button
                  onClick={onClose}
                  className="flex-1 h-9 rounded-full border border-brq-border-light text-brq-text-primary font-medium text-sm hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-9 rounded-full bg-brq-accent text-white font-medium text-sm hover:bg-brq-accent-dark transition"
                >
                  추가
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialTodoModal;
