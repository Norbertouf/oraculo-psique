import { executeProviderFetch, LLMError, LLM_TEMPERATURE, type LLMAdapter } from './types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export class GeminiAdapter implements LLMAdapter {
  readonly provider = 'gemini' as const;
  readonly label = 'Google Gemini (gemini-2.5-flash)';

  async generate(prompt: string, apiKey: string): Promise<string> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      throw new LLMError('INVALID_KEY', this.provider, 'Introduce tu API Key de Google AI Studio.');
    }

    const endpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const data = (await executeProviderFetch(this.provider, endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: LLM_TEMPERATURE,
        },
      }),
    })) as GeminiResponse;

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new LLMError('EMPTY_RESPONSE', this.provider, 'Gemini devolvió una respuesta vacía.');
    }
    return text;
  }
}
