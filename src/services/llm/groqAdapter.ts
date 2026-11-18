import { executeProviderFetch, LLMError, LLM_TEMPERATURE, type LLMAdapter } from './types';

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class GroqAdapter implements LLMAdapter {
  readonly provider = 'groq' as const;
  readonly label = 'Groq (llama-3.3-70b-versatile)';

  async generate(prompt: string, apiKey: string): Promise<string> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      throw new LLMError('INVALID_KEY', this.provider, 'Introduce tu API Key de Groq.');
    }

    const data = (await executeProviderFetch(
      this.provider,
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: LLM_TEMPERATURE,
          messages: [{ role: 'user', content: prompt }],
        }),
      },
    )) as ChatCompletionResponse;

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new LLMError('EMPTY_RESPONSE', this.provider, 'Groq devolvió una respuesta vacía.');
    }
    return text;
  }
}
