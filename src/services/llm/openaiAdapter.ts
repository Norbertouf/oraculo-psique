import { executeProviderFetch, LLMError, LLM_TEMPERATURE, type LLMAdapter } from './types';

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class OpenAIAdapter implements LLMAdapter {
  readonly provider = 'openai' as const;
  readonly label = 'OpenAI (gpt-4o-mini)';

  async generate(prompt: string, apiKey: string): Promise<string> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      throw new LLMError('INVALID_KEY', this.provider, 'Introduce tu API Key de OpenAI.');
    }

    const data = (await executeProviderFetch(
      this.provider,
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: LLM_TEMPERATURE,
          messages: [{ role: 'user', content: prompt }],
        }),
      },
    )) as ChatCompletionResponse;

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new LLMError('EMPTY_RESPONSE', this.provider, 'OpenAI devolvió una respuesta vacía.');
    }
    return text;
  }
}
