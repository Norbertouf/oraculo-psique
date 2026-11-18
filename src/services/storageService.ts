import type { LecturaResultado, ProveedorLLM } from '../types/oracle';

const JOURNAL_KEY = 'oraculo_psique_journal_v2';
const SESSION_API_KEY_PREFIX = 'oraculo_psique_key_';
const LOCAL_API_KEY_PREFIX = 'oraculo_psique_persisted_key_';
const REMEMBER_FLAG_KEY = 'oraculo_psique_remember_key';

export function loadJournal(): LecturaResultado[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LecturaResultado[]) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: LecturaResultado): LecturaResultado[] {
  const current = loadJournal();
  const filtered = current.filter((item) => item.id !== entry.id);
  const updated = [entry, ...filtered];
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteJournalEntry(id: string): LecturaResultado[] {
  const updated = loadJournal().filter((item) => item.id !== id);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  return updated;
}

export function clearJournal(): void {
  localStorage.removeItem(JOURNAL_KEY);
}

export function getRememberKeyFlag(): boolean {
  try {
    return localStorage.getItem(REMEMBER_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loadApiKey(provider: ProveedorLLM): string {
  try {
    const sessionVal = sessionStorage.getItem(`${SESSION_API_KEY_PREFIX}${provider}`);
    if (sessionVal) return sessionVal;
    if (getRememberKeyFlag()) {
      return localStorage.getItem(`${LOCAL_API_KEY_PREFIX}${provider}`) ?? '';
    }
    return '';
  } catch {
    return '';
  }
}

export function saveApiKey(provider: ProveedorLLM, key: string, rememberOnDevice: boolean): void {
  try {
    const clean = key.trim();
    if (clean) {
      sessionStorage.setItem(`${SESSION_API_KEY_PREFIX}${provider}`, clean);
    } else {
      sessionStorage.removeItem(`${SESSION_API_KEY_PREFIX}${provider}`);
    }

    if (rememberOnDevice) {
      localStorage.setItem(REMEMBER_FLAG_KEY, 'true');
      if (clean) {
        localStorage.setItem(`${LOCAL_API_KEY_PREFIX}${provider}`, clean);
      } else {
        localStorage.removeItem(`${LOCAL_API_KEY_PREFIX}${provider}`);
      }
    } else {
      localStorage.removeItem(REMEMBER_FLAG_KEY);
      localStorage.removeItem(`${LOCAL_API_KEY_PREFIX}${provider}`);
    }
  } catch {
    // Ignorar errores de almacenamiento en navegación privada estricta
  }
}
