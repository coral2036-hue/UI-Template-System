import type { Model } from '../types';

export const DEFAULT_MODELS: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'claude-3.5', name: 'Claude 3.5', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

export const DEFAULT_MODEL = DEFAULT_MODELS[0];
