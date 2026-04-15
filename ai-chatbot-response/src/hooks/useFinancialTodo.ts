import { useState, useCallback, useEffect } from 'react';
import type { FinancialTodo, ExecutionLog, QuestionAnswer } from '../types';
import { createAIService, type AIServiceConfig } from '../services/aiService';

const STORAGE_KEY = 'financialTodos';

export interface UseFinancialTodoReturn {
  todos: FinancialTodo[];
  addTodo: (todo: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<FinancialTodo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTodosByMonth: (year: number, month: number) => FinancialTodo[];
  getTodoStats: (year: number, month: number) => { total: number; completed: number; upcoming: number };
  generateAnswer: (id: string, config?: AIServiceConfig) => Promise<void>;
  retryGeneration: (id: string, config?: AIServiceConfig) => Promise<void>;
  getQuestionTodos: () => FinancialTodo[];
  getScheduledTodos: (now?: Date) => FinancialTodo[];
}

export function useFinancialTodo(): UseFinancialTodoReturn {
  const [todos, setTodos] = useState<FinancialTodo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage에서 로드
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse financial todos from localStorage:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // localStorage에 저장 (todos 변경 시)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((todo: Omit<FinancialTodo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTodo: FinancialTodo = {
      ...todo,
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<FinancialTodo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  }, []);

  const getTodosByMonth = useCallback(
    (year: number, month: number): FinancialTodo[] => {
      return todos.filter((todo) => {
        const date = new Date(todo.dueDate);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });
    },
    [todos]
  );

  const getTodoStats = useCallback(
    (year: number, month: number) => {
      const monthTodos = getTodosByMonth(year, month);
      return {
        total: monthTodos.length,
        completed: monthTodos.filter((t) => t.completed).length,
        upcoming: monthTodos.filter((t) => !t.completed).length,
      };
    },
    [getTodosByMonth]
  );

  const generateAnswer = useCallback(
    async (id: string, config?: AIServiceConfig) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo || todo.type !== 'question' || !todo.question) {
        return;
      }

      try {
        // 생성 시작
        const startLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'generating',
          message: '답변 생성 중...',
        };

        updateTodo(id, {
          answer: {
            answer: '생성 중...',
            generatedAt: new Date().toISOString(),
            aiModel: config?.provider || 'structured',
            executionLog: [startLog],
          },
        });

        // AI 서비스 호출
        const aiService = createAIService(config);
        const startTime = Date.now();
        const response = await aiService.generateAnswer(
          todo.question,
          todo.description
        );
        const duration = Date.now() - startTime;

        // 생성 완료
        const completionLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'completed',
          duration,
        };

        const answer: QuestionAnswer = {
          answer: response.answer,
          generatedAt: new Date().toISOString(),
          aiModel: response.model,
          executionLog: [startLog, completionLog],
        };

        updateTodo(id, { answer });
      } catch (error) {
        // 오류 처리
        const errorLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'error',
          message:
            error instanceof Error ? error.message : '답변 생성 중 오류 발생',
        };

        updateTodo(id, {
          answer: {
            answer: `오류 발생: ${
              error instanceof Error
                ? error.message
                : '답변 생성에 실패했습니다'
            }`,
            generatedAt: new Date().toISOString(),
            aiModel: 'error',
            executionLog: [errorLog],
          },
        });
      }
    },
    [todos, updateTodo]
  );

  const retryGeneration = useCallback(
    async (id: string, config?: AIServiceConfig) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      // 기존 로그 유지
      const existingLogs = todo.answer?.executionLog || [];

      try {
        const retryLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'generating',
          message: '재생성 중...',
        };

        updateTodo(id, {
          answer: {
            answer: '생성 중...',
            generatedAt: new Date().toISOString(),
            aiModel: config?.provider || 'structured',
            executionLog: [...existingLogs, retryLog],
          },
        });

        const aiService = createAIService(config);
        const startTime = Date.now();
        const response = await aiService.generateAnswer(
          todo.question || todo.title || '',
          todo.description
        );
        const duration = Date.now() - startTime;

        const completionLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'completed',
          duration,
        };

        const answer: QuestionAnswer = {
          answer: response.answer,
          generatedAt: new Date().toISOString(),
          aiModel: response.model,
          executionLog: [...existingLogs, retryLog, completionLog],
        };

        updateTodo(id, { answer });
      } catch (error) {
        const errorLog: ExecutionLog = {
          timestamp: new Date().toISOString(),
          status: 'error',
          message:
            error instanceof Error ? error.message : '재생성 중 오류 발생',
        };

        updateTodo(id, {
          answer: {
            answer: `오류 발생: ${
              error instanceof Error
                ? error.message
                : '재생성에 실패했습니다'
            }`,
            generatedAt: new Date().toISOString(),
            aiModel: 'error',
            executionLog: [...existingLogs, errorLog],
          },
        });
      }
    },
    [todos, updateTodo]
  );

  const getQuestionTodos = useCallback(
    () => todos.filter((t) => t.type === 'question'),
    [todos]
  );

  const getScheduledTodos = useCallback(
    (now?: Date) => {
      const currentTime = now || new Date();

      return todos.filter((todo) => {
        // 이미 답변이 있으면 스킵
        if (todo.answer) {
          return false;
        }

        // 질문 타입이고 자동 생성 활성화
        if (todo.type !== 'question' || !todo.autoGenerate) {
          return false;
        }

        // 스케줄 정보 확인
        if (!todo.schedule || !todo.schedule.reminderTime) {
          return false;
        }

        // 실행 시간 도래 여부 확인
        const dueDate = new Date(todo.dueDate);
        const [hour, minute] = todo.schedule.reminderTime.split(':').map(Number);

        const scheduled = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          dueDate.getDate(),
          hour,
          minute
        );

        const diffMs = Math.abs(currentTime.getTime() - scheduled.getTime());
        return diffMs < 2 * 60 * 1000; // 2분 범위
      });
    },
    [todos]
  );

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getTodosByMonth,
    getTodoStats,
    generateAnswer,
    retryGeneration,
    getQuestionTodos,
    getScheduledTodos,
  };
}
