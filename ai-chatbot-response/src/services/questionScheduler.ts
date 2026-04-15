import type { FinancialTodo } from '../types';

/**
 * 자동 답변 생성 스케줄러
 * 주기적으로 스케줄된 To-Do를 확인하고 자동 생성 조건을 만족하는 항목에 대해
 * 답변 생성을 트리거합니다.
 */

// 실행 시간 도래 여부 판단
function isTimeToExecute(todo: FinancialTodo, now: Date): boolean {
  if (!todo.autoGenerate || !todo.schedule || !todo.schedule.reminderTime) {
    return false;
  }

  const dueDate = new Date(todo.dueDate);
  const [hour, minute] = todo.schedule.reminderTime.split(':').map(Number);

  // 현재 년월일 기준으로 스케줄된 시간 생성
  const scheduled = new Date(
    now.getFullYear(),
    now.getMonth(),
    dueDate.getDate(),
    hour,
    minute
  );

  // 현재 시간이 예정 시간 ±2분 범위 내인지 확인
  const diffMs = Math.abs(now.getTime() - scheduled.getTime());
  return diffMs < 2 * 60 * 1000; // 2분 범위
}

// 스케줄된 To-Do 필터링
function getScheduledTodos(todos: FinancialTodo[], now?: Date): FinancialTodo[] {
  const currentTime = now || new Date();

  return todos.filter((todo) => {
    // 이미 답변이 생성되었으면 스킵
    if (todo.answer) {
      return false;
    }

    // 질문 타입이고 자동 생성이 활성화되어 있는지 확인
    if (todo.type !== 'question' || !todo.autoGenerate) {
      return false;
    }

    // 실행 시간 도래 여부 확인
    return isTimeToExecute(todo, currentTime);
  });
}

/**
 * 자동 답변 생성 스케줄러 시작
 * @param todos - To-Do 배열
 * @param onGenerateAnswer - 답변 생성 핸들러 (To-Do ID 전달)
 * @param interval - 체크 간격 (기본값: 60초)
 * @returns 스케줄러 정리 함수
 */
export function startQuestionScheduler(
  todos: FinancialTodo[],
  onGenerateAnswer: (id: string) => Promise<void>,
  interval: number = 60000
): () => void {
  let isRunning = true;
  let lastExecutedIds = new Set<string>();

  const timer = setInterval(async () => {
    if (!isRunning) return;

    try {
      const scheduledTodos = getScheduledTodos(todos);

      for (const todo of scheduledTodos) {
        // 같은 To-Do에 대해 중복 실행 방지 (같은 분 내에서)
        if (lastExecutedIds.has(todo.id)) {
          continue;
        }

        try {
          lastExecutedIds.add(todo.id);
          await onGenerateAnswer(todo.id);
        } catch (error) {
          console.error(`Failed to generate answer for ${todo.id}:`, error);
        }
      }

      // 1분마다 lastExecutedIds 초기화 (새로운 실행 사이클)
      if (new Date().getSeconds() < 5) {
        lastExecutedIds.clear();
      }
    } catch (error) {
      console.error('Question scheduler error:', error);
    }
  }, interval);

  // 정리 함수 반환
  return () => {
    isRunning = false;
    clearInterval(timer);
  };
}

/**
 * 특정 시간에 To-Do가 실행되는지 테스트
 * (테스트용 유틸리티)
 */
export function testScheduleExecution(
  todo: FinancialTodo,
  testTime: Date
): boolean {
  return isTimeToExecute(todo, testTime);
}
