import type { ProveedorLLM } from '../../types/oracle';

export type LLMErrorCode =
  | 'INVALID_KEY'
  | 'RATE_LIMIT'
  | 'CORS_OR_NETWORK'
  | 'PROVIDER_ERROR'
  | 'EMPTY_RESPONSE';

export class LLMError extends Error {
  readonly code: LLMErrorCode;
  readonly provider: ProveedorLLM;
  readonly status?: number;

  constructor(code: LLMErrorCode, provider: ProveedorLLM, message: string, status?: number) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
    this.provider = provider;
    this.status = status;
  }
}

export interface LLMAdapter {
  readonly provider: ProveedorLLM;
  readonly label: string;
  generate(prompt: string, apiKey: string): Promise<string>;
}

const REQUEST_TIMEOUT_MS = 25000;
export const LLM_TEMPERATURE = 0.35;

/**
 * Helper compartido para ejecutar fetch con timeout y mapeo uniforme de errores HTTP/CORS/red.
 */
export async function executeProviderFetch(
  provider: ProveedorLLM,
  url: string,
  init: RequestInit,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new LLMError(
        'CORS_OR_NETWORK',
        provider,
        'Tiempo de espera agotado (25 s) al conectar con el proveedor.',
      );
    }
    throw new LLMError(
      'CORS_OR_NETWORK',
      provider,
      'No se pudo conectar (sin red, extensión bloqueadora o política CORS del navegador).',
    );
  } finally {
    globalThis.clearTimeout(timer);
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errJson = (await response.json()) as { error?: { message?: string } };
      detail = errJson?.error?.message ? ` (${errJson.error.message})` : '';
    } catch {
      // Ignorar si la respuesta de error no es JSON
    }

    if (response.status === 401 || response.status === 403) {
      throw new LLMError(
        'INVALID_KEY',
        provider,
        `Clave API inválida, expirada o sin permisos${detail}.`,
        response.status,
      );
    }
    if (response.status === 429) {
      throw new LLMError(
        'RATE_LIMIT',
        provider,
        `Límite de cuota o peticiones por minuto excedido${detail}.`,
        response.status,
      );
    }
    throw new LLMError(
      'PROVIDER_ERROR',
      provider,
      `El proveedor respondió con error HTTP ${response.status}${detail}.`,
      response.status,
    );
  }

  return response.json();
}
