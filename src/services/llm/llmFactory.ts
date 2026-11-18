import type { ProveedorLLM } from '../../types/oracle';
import { GeminiAdapter } from './geminiAdapter';
import { GroqAdapter } from './groqAdapter';
import { OpenAIAdapter } from './openaiAdapter';
import type { LLMAdapter } from './types';

const ADAPTERS: Record<ProveedorLLM, LLMAdapter> = {
  gemini: new GeminiAdapter(),
  openai: new OpenAIAdapter(),
  groq: new GroqAdapter(),
};

export function getLLMAdapter(provider: ProveedorLLM): LLMAdapter {
  return ADAPTERS[provider];
}
