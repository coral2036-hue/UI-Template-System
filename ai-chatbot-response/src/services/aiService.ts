// AI Service Interface and Implementations

// Configuration types
export interface AIServiceConfig {
  provider: 'structured' | 'claude' | 'openai' | 'gemini';
  apiKey?: string;
  model?: string;
}

// Response types
export interface AIResponse {
  answer: string;
  model: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
  };
}

// AI Service Interface
export interface IAIService {
  generateAnswer(
    question: string,
    context?: string,
    config?: AIServiceConfig
  ): Promise<AIResponse>;

  validateConfig(config: AIServiceConfig): boolean;
  getAvailableModels(): string[];
}

// ─── Structured AI Service (Default)
// 초기: 간단한 템플릿 기반 응답
// 향후: Claude/OpenAI API로 교체 가능한 구조
class StructuredAIService implements IAIService {
  async generateAnswer(
    question: string,
    context?: string
  ): Promise<AIResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate structured response
    const timestamp = new Date().toLocaleString('ko-KR');
    const answer =
      `[생성 시간: ${timestamp}]\n\n` +
      `질문: ${question}\n\n` +
      `답변: 현재 구조화된 응답 모드로 동작 중입니다.\n` +
      `실제 AI API(Claude, OpenAI 등)가 연동되면 더 상세한 분석 결과를 제공받을 수 있습니다.\n\n` +
      (context ? `참조 정보: ${context}` : '');

    return {
      answer,
      model: 'structured',
    };
  }

  validateConfig(config: AIServiceConfig): boolean {
    // Structured service doesn't require API key
    return config.provider === 'structured';
  }

  getAvailableModels(): string[] {
    return ['structured'];
  }
}

// ─── Claude AI Service (Future)
class ClaudeAIService implements IAIService {
  private apiKey: string;

  constructor(config?: AIServiceConfig) {
    this.apiKey = config?.apiKey || '';
  }

  async generateAnswer(): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('Claude API key is required');
    }

    // TODO: Implement actual Claude API call
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': this.apiKey,
    //     'anthropic-version': '2023-06-01',
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: this.model,
    //     max_tokens: 1024,
    //     messages: [{ role: 'user', content: question }],
    //   }),
    // });

    throw new Error('Claude API integration not yet implemented');
  }

  validateConfig(config: AIServiceConfig): boolean {
    return config.provider === 'claude' && !!config.apiKey;
  }

  getAvailableModels(): string[] {
    return [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }
}

// ─── OpenAI Service (Future)
class OpenAIService implements IAIService {
  private apiKey: string;

  constructor(config?: AIServiceConfig) {
    this.apiKey = config?.apiKey || '';
  }

  async generateAnswer(): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    // TODO: Implement actual OpenAI API call

    throw new Error('OpenAI API integration not yet implemented');
  }

  validateConfig(config: AIServiceConfig): boolean {
    return config.provider === 'openai' && !!config.apiKey;
  }

  getAvailableModels(): string[] {
    return ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];
  }
}

// ─── Service Factory
export function createAIService(config?: AIServiceConfig): IAIService {
  const provider = config?.provider || 'structured';

  switch (provider) {
    case 'claude':
      return new ClaudeAIService(config);
    case 'openai':
      return new OpenAIService(config);
    case 'structured':
    default:
      return new StructuredAIService();
  }
}

// Export service classes for testing
export { StructuredAIService, ClaudeAIService, OpenAIService };
