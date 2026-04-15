import type { FinancialTodo } from '../types';
import { getHolidayInfo, isHoliday, getDayBackgroundColor, getDayTextColor } from '../utils/holidays';

interface FinancialTodoTimelineProps {
  todos: FinancialTodo[];
  year: number;
  month: number;
}

interface Week {
  start: Date;
  end: Date;
}

const CELL_WIDTH = 80; // pixels per day

export function FinancialTodoTimeline({ todos, year, month }: FinancialTodoTimelineProps) {
  // 월별 To-Do 필터링
  const monthTodos = todos.filter((todo) => {
    const dueDate = new Date(todo.dueDate);
    return dueDate.getFullYear() === year && dueDate.getMonth() + 1 === month;
  });

  // 월의 첫 주 계산 (주의 시작: 일요일)
  const monthStart = new Date(year, month - 1, 1);
  const firstWeekStart = new Date(monthStart);
  firstWeekStart.setDate(monthStart.getDate() - monthStart.getDay());

  // 주 배열 생성
  const weeks: Week[] = [];
  for (let i = 0; i < 6; i++) {
    const weekStart = new Date(firstWeekStart);
    weekStart.setDate(weekStart.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // 현재 달에 속하지 않으면 스킵
    if (weekStart.getMonth() > month - 1) break;

    weeks.push({ start: weekStart, end: weekEnd });
  }

  // Gantt 바 위치 계산
  const calculateBarPosition = (
    todo: FinancialTodo,
    weekStart: Date,
    weekEnd: Date
  ) => {
    const todoDueDate = new Date(todo.dueDate);

    // 마감일이 이번 주에 있는지 확인
    if (todoDueDate < weekStart || todoDueDate > weekEnd) {
      return null;
    }

    // 상대적 위치 (주의 시작일로부터)
    const daysIntoWeek = Math.floor(
      (todoDueDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      left: daysIntoWeek * CELL_WIDTH,
      width: CELL_WIDTH,
    };
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100'; // 좌측 동그라미
      case 'medium':
        return 'bg-amber-100';
      case 'low':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityBarColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'; // Gantt 바
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '중간';
      case 'low':
        return '낮음';
      default:
        return '-';
    }
  };

  if (monthTodos.length === 0) {
    return (
      <div className="text-center py-12 text-brq-text-secondary">
        <p className="text-sm">이번 달에 등록된 To-Do가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* 좌측 사이드바 */}
      <div className="w-[200px] border-r border-brq-border-light overflow-y-auto flex-shrink-0 bg-brq-bg-light">
        {monthTodos.map((todo) => (
          <div
            key={todo.id}
            className="p-3 border-b border-brq-border-light bg-white hover:bg-gray-50 transition"
          >
            {/* 우선순위 색상 동그라미 */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(
                  todo.priority
                )}`}
              />
              <span className="text-xs font-semibold text-gray-600">
                {getPriorityLabel(todo.priority)}
              </span>
            </div>

            {/* 제목/질문 */}
            <p className="text-xs font-medium text-gray-900 truncate mb-1">
              {todo.type === 'question' ? 'Q: ' : ''}{todo.title || todo.question}
            </p>

            {/* 상태 표시 (질문 답변의 경우) */}
            {todo.type === 'question' && (
              <p className="text-xs text-gray-500">
                {todo.answer ? '✓ 답변완료' : '⏳ 대기중'}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 우측 Gantt 영역 */}
      <div className="flex-1 overflow-x-auto">
        {/* 날짜 헤더 (sticky) */}
        <div className="sticky top-0 bg-brq-bg-light border-b border-brq-border-light z-10">
          <div className="flex">
            {weeks.map((week, idx) => (
              <div key={idx} className="flex border-l border-brq-border-light">
                <div
                  className="text-center text-xs font-semibold text-gray-600 px-1 py-2 border-r border-brq-border-light flex items-center justify-center"
                  style={{ width: `${CELL_WIDTH}px` }}
                >
                  {week.start.getDate()}-{week.end.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요일 헤더 (sticky) */}
        <div className="sticky top-8 border-b border-brq-border-light z-10">
          <div className="flex">
            {weeks.map((week, widx) => (
              <div key={widx} className="flex border-l border-brq-border-light first:border-l-0">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, dayIdx) => {
                  const cellDate = new Date(week.start);
                  cellDate.setDate(cellDate.getDate() + dayIdx);
                  const dateStr = cellDate.toISOString().split('T')[0];
                  const holiday = getHolidayInfo(dateStr);
                  const isHol = isHoliday(dateStr);
                  const bgColor = getDayBackgroundColor(dayIdx, isHol);
                  const textColor = getDayTextColor(dayIdx, isHol);

                  return (
                    <div
                      key={`${widx}-${day}`}
                      className={`text-center text-xs font-medium px-0.5 py-2 border-r border-gray-100 flex flex-col items-center justify-center transition
                        ${bgColor} ${textColor}`}
                      style={{ width: `${CELL_WIDTH}px`, minHeight: '60px' }}
                      title={holiday ? `${holiday.name}` : ''}
                    >
                      <div className="font-semibold">{day}</div>
                      {holiday && (
                        <>
                          <div className="text-lg">{holiday.icon}</div>
                          <div className="text-[10px] font-bold leading-tight max-w-full px-0.5 truncate">
                            {holiday.name}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt 바 영역 */}
        <div className="p-0">
          {monthTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center h-10 border-b border-gray-100 px-2 hover:bg-gray-50 transition"
            >
              <div className="relative flex-1" style={{ minWidth: `${weeks.length * 7 * CELL_WIDTH}px` }}>
                {/* 주별로 Gantt 바 렌더링 */}
                {weeks.map((week, weekIdx) => {
                  const barPos = calculateBarPosition(todo, week.start, week.end);

                  return (
                    <div
                      key={weekIdx}
                      className="relative inline-flex border-l border-gray-100"
                      style={{ width: `${7 * CELL_WIDTH}px` }}
                    >
                      {/* 요일별 배경 (공휴일/주말 강조) */}
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const cellDate = new Date(week.start);
                        cellDate.setDate(cellDate.getDate() + dayIdx);
                        const dateStr = cellDate.toISOString().split('T')[0];
                        const isHol = isHoliday(dateStr);
                        const bgColor = getDayBackgroundColor(dayIdx, isHol);

                        return (
                          <div
                            key={`bg-${dayIdx}`}
                            className={`absolute top-0 bottom-0 border-r border-gray-50 ${bgColor}`}
                            style={{ left: `${dayIdx * CELL_WIDTH}px`, width: `${CELL_WIDTH}px` }}
                          />
                        );
                      })}

                      {/* 일자 구분선 */}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={`divider-${i}`}
                          className="absolute top-0 bottom-0 w-px bg-gray-200 z-10"
                          style={{ left: `${(i + 1) * CELL_WIDTH}px` }}
                        />
                      ))}

                      {/* Gantt 바 */}
                      {barPos && (
                        <div
                          className={`absolute h-6 rounded px-2 flex items-center text-xs font-medium text-white overflow-hidden whitespace-nowrap z-20
                            ${getPriorityBarColor(todo.priority)}`}
                          style={{
                            left: `${barPos.left}px`,
                            width: `${barPos.width}px`,
                            top: '2px',
                          }}
                          title={todo.type === 'question' ? todo.question : todo.title}
                        >
                          {todo.type === 'question' ? todo.question : todo.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
