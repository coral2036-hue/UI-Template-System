import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Trash2, Edit2, Check } from 'lucide-react';
import type { FinancialTodo, ViewMode } from '../types';
import { FinancialTodoTimeline } from './FinancialTodoTimeline';

interface FinancialTodoDashboardProps {
  todos: FinancialTodo[];
  onAddTodo: () => void;
  onEditTodo: (todo: FinancialTodo) => void;
  onDeleteTodo: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onViewAnswer?: (todo: FinancialTodo) => void;
  onGenerateAnswer?: (id: string) => Promise<void>;
}

export function FinancialTodoDashboard({
  todos,
  onAddTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleComplete,
  onViewAnswer,
  onGenerateAnswer,
}: FinancialTodoDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 월별 To-Do 조회
  const monthTodos = todos.filter((todo) => {
    const dueDate = new Date(todo.dueDate);
    return dueDate.getFullYear() === year && dueDate.getMonth() + 1 === month;
  });

  // 타입별 분리
  const taskTodos = monthTodos.filter((t) => t.type !== 'question');
  const questionTodos = monthTodos.filter((t) => t.type === 'question');

  // 통계 계산
  const stats = {
    total: monthTodos.length,
    completed: monthTodos.filter((t) => t.completed).length,
    upcoming: monthTodos.filter((t) => !t.completed).length,
    questionTotal: questionTodos.length,
    questionAnswered: questionTodos.filter((t) => t.answer).length,
    questionPending: questionTodos.filter((t) => !t.answer).length,
  };

  // 월 변경
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // 달력 렌더링
  const renderCalendar = () => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    // 빈 셀 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // 날짜별 To-Do 그룹화
    const todosByDay: Record<number, FinancialTodo[]> = {};
    monthTodos.forEach((todo) => {
      const day = new Date(todo.dueDate).getDate();
      if (!todosByDay[day]) {
        todosByDay[day] = [];
      }
      todosByDay[day].push(todo);
    });

    // 날짜 셀
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTodos = todosByDay[day] || [];
      days.push(
        <div
          key={day}
          className="p-2 border border-brq-border-light rounded-lg min-h-20 bg-white hover:bg-brq-bg-light transition"
        >
          <div className="text-sm font-semibold text-brq-text-primary mb-1">{day}</div>
          <div className="space-y-1">
            {dayTodos.slice(0, 2).map((todo) => (
              <div
                key={todo.id}
                className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 truncate"
              >
                {todo.type === 'question' ? 'Q: ' : ''}{todo.title || todo.question}
              </div>
            ))}
            {dayTodos.length > 2 && (
              <div className="text-xs px-1.5 py-0.5 text-gray-500">
                +{dayTodos.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-lg border border-brq-border-light overflow-hidden"  style={{ margin: 'auto' }}>
      {/* 헤더 */}
      <div className="p-4 bg-brq-bg-light border-b border-brq-border-light">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded transition"
            >
              <ChevronLeft size={18} className="text-brq-text-secondary" />
            </button>
            <div className="text-lg font-semibold text-brq-text-primary min-w-32">
              {year}년 {month}월
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded transition"
            >
              <ChevronRight size={18} className="text-brq-text-secondary" />
            </button>
          </div>

          {/* 뷰 토글 */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded transition text-sm font-medium ${
                viewMode === 'calendar'
                  ? 'bg-white text-brq-accent border border-brq-accent'
                  : 'bg-transparent text-brq-text-secondary border border-brq-border-light'
              }`}
            >
              📅 달력
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded transition text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-white text-brq-accent border border-brq-accent'
                  : 'bg-transparent text-brq-text-secondary border border-brq-border-light'
              }`}
            >
              📋 리스트
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded transition text-sm font-medium ${
                viewMode === 'timeline'
                  ? 'bg-white text-brq-accent border border-brq-accent'
                  : 'bg-transparent text-brq-text-secondary border border-brq-border-light'
              }`}
            >
              📊 타임라인
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-brq-text-secondary">총</span>{' '}
            <span className="font-semibold text-brq-text-primary">{stats.total}</span>개
          </div>
          <div>
            <span className="text-brq-text-secondary">완료</span>{' '}
            <span className="font-semibold text-green-600">{stats.completed}</span>개
          </div>
          <div>
            <span className="text-brq-text-secondary">예정</span>{' '}
            <span className="font-semibold text-blue-600">{stats.upcoming}</span>개
          </div>
          {stats.questionTotal > 0 && (
            <>
              <div className="border-l border-brq-border-light px-4">
                <span className="text-brq-text-secondary">질문</span>{' '}
                <span className="font-semibold text-amber-600">{stats.questionTotal}</span>개
              </div>
              <div>
                <span className="text-brq-text-secondary">답변</span>{' '}
                <span className="font-semibold text-green-600">{stats.questionAnswered}</span>개
              </div>
              <div>
                <span className="text-brq-text-secondary">대기</span>{' '}
                <span className="font-semibold text-amber-600">{stats.questionPending}</span>개
              </div>
            </>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4 flex-1 overflow-hidden">
        {viewMode === 'calendar' ? (
          <div>
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-brq-text-secondary py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* 달력 */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        ) : viewMode === 'timeline' ? (
          <FinancialTodoTimeline todos={todos} year={year} month={month} />
        ) : (
          <div className="space-y-6">
            {monthTodos.length === 0 ? (
              <div className="text-center py-12 text-brq-text-secondary">
                <p className="text-sm">이번 달에 등록된 To-Do가 없습니다.</p>
              </div>
            ) : (
              <>
                {/* 작업 섹션 */}
                {taskTodos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-brq-text-primary mb-3">
                      📋 작업 ({taskTodos.length}개)
                    </h3>
                    <div className="space-y-3">
                      {taskTodos
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className={`p-3 border rounded-lg transition ${
                              todo.completed
                                ? 'bg-gray-50 border-gray-200'
                                : 'bg-white border-brq-border-light hover:border-brq-accent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* 완료 체크박스 */}
                              <button
                                onClick={() => onToggleComplete(todo.id)}
                                className={`flex-shrink-0 mt-1 w-5 h-5 rounded border transition ${
                                  todo.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-brq-border-light hover:border-brq-accent'
                                }`}
                              >
                                {todo.completed && <Check size={16} className="text-white m-auto" />}
                              </button>

                              {/* 콘텐츠 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <h3
                                    className={`font-medium text-sm ${
                                      todo.completed
                                        ? 'text-gray-400 line-through'
                                        : 'text-brq-text-primary'
                                    }`}
                                  >
                                    {todo.title}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(
                                      todo.priority
                                    )}`}
                                  >
                                    {todo.priority === 'high'
                                      ? '높음'
                                      : todo.priority === 'medium'
                                        ? '중간'
                                        : '낮음'}
                                  </span>
                                  <span className="text-xs text-brq-text-secondary">
                                    {new Date(todo.dueDate).toLocaleDateString('ko-KR', {
                                      month: 'numeric',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>

                                {todo.description && (
                                  <p className="text-xs text-brq-text-secondary mb-2">{todo.description}</p>
                                )}

                                {/* 스케줄 정보 */}
                                {todo.schedule?.hasReminder && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
                                    <Bell size={12} />
                                    <span>
                                      {todo.schedule.reminderTime} /{' '}
                                      {todo.schedule.repeat === 'once'
                                        ? '1회'
                                        : todo.schedule.repeat === 'daily'
                                          ? '매일'
                                          : todo.schedule.repeat === 'weekly'
                                            ? '매주'
                                            : '매월'}
                                    </span>
                                  </div>
                                )}

                                {/* 카테고리 */}
                                {todo.category && (
                                  <div className="text-xs text-brq-text-secondary mb-2">
                                    카테고리: {todo.category}
                                  </div>
                                )}
                              </div>

                              {/* 액션 버튼 */}
                              {!todo.completed && (
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => onEditTodo(todo)}
                                    className="p-1.5 hover:bg-blue-100 rounded transition text-blue-600"
                                    title="수정"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => onDeleteTodo(todo.id)}
                                    className="p-1.5 hover:bg-red-100 rounded transition text-red-600"
                                    title="삭제"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 질문 섹션 */}
                {questionTodos.length > 0 && (
                  <div className="pt-4 border-t border-brq-border-light">
                    <h3 className="text-sm font-semibold text-brq-text-primary mb-3">
                      ❓ 질문 ({questionTodos.length}개)
                    </h3>
                    <div className="space-y-3">
                      {questionTodos
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className="p-4 border rounded-lg bg-white border-amber-200 hover:border-brq-accent transition"
                          >
                            <div className="space-y-2">
                              {/* 질문 제목 */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-brq-text-primary">
                                    {todo.question}
                                  </h4>
                                </div>
                              </div>

                              {/* 실행 정보 */}
                              <div className="text-xs text-brq-text-secondary">
                                <p>
                                  실행예정: {todo.dueDate}{' '}
                                  {todo.schedule?.reminderTime && `${todo.schedule.reminderTime}`}
                                  {todo.schedule?.repeat && (
                                    <span>
                                      {' '}
                                      ({todo.schedule.repeat === 'once'
                                        ? '1회'
                                        : todo.schedule.repeat === 'daily'
                                          ? '매일'
                                          : todo.schedule.repeat === 'weekly'
                                            ? '매주'
                                            : '매월'})
                                    </span>
                                  )}
                                </p>
                              </div>

                              {/* 답변 상태 */}
                              {todo.answer ? (
                                <div className="space-y-2 pt-2 border-t border-amber-100">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                      ✅ 답변 완료
                                    </span>
                                  </div>
                                  <p className="text-xs text-brq-text-secondary line-clamp-2">
                                    {todo.answer.answer}
                                  </p>
                                  <button
                                    onClick={() => onViewAnswer?.(todo)}
                                    className="text-xs text-brq-accent hover:underline"
                                  >
                                    전체 보기
                                  </button>
                                </div>
                              ) : todo.autoGenerate ? (
                                <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                    ⏳ 답변 대기
                                  </span>
                                </div>
                              ) : (
                                <div className="pt-2 border-t border-amber-100">
                                  <button
                                    onClick={() => onGenerateAnswer?.(todo.id)}
                                    className="text-xs text-brq-accent hover:underline font-medium"
                                  >
                                    생성하기
                                  </button>
                                </div>
                              )}

                              {/* 액션 버튼 */}
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => onEditTodo(todo)}
                                  className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => onDeleteTodo(todo.id)}
                                  className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

        {/* 추가 버튼 */}
        <div className="p-4 border-t border-brq-border-light bg-brq-bg-light">
          <button
            onClick={onAddTodo}
            className="w-full h-9 rounded-lg bg-brq-accent text-white font-medium text-sm hover:bg-brq-accent-dark transition"
          >
            + To-Do 추가
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
