import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { CartaExtraida, LecturaResultado } from '../types/oracle';
import { TarotCardSvg } from './TarotCardSvg';

interface ReadingResultProps {
  lectura: LecturaResultado | null;
  cartas: CartaExtraida[];
  apiError: string | null;
  isSaved: boolean;
  onSaveToJournal: () => void;
  onExportPdf: () => void;
  onDownloadMarkdown: () => void;
  onNewReading: () => void;
  onFallbackLocal: () => void;
}

type VerdictBadge =
  | { kind: 'yes'; label: 'SÍ · CAMINO ABIERTO' }
  | { kind: 'no'; label: 'NO · FRENO ACTIVO' }
  | { kind: 'cond'; label: 'SÍ, CON ESTA CONDICIÓN' };

interface ParsedVerdict {
  badge: VerdictBadge;
  sentence: string;
  bodyMarkdown: string;
}

function classifyBadge(raw: string): { badge: VerdictBadge; cleanSentence: string } {
  const trimmed = raw.trim();
  const condMatch = trimmed.match(/^S[IÍ]\s*,?\s*CON\s+(UNA|ESTA)\s+CONDICI[OÓ]N\s*[:.\-–—]?\s*(.*)$/i);
  if (condMatch) {
    return {
      badge: { kind: 'cond', label: 'SÍ, CON ESTA CONDICIÓN' },
      cleanSentence: (condMatch[2] || trimmed).trim(),
    };
  }

  const noMatch = trimmed.match(/^NO\s*[:.\-–—]\s*(.*)$/i);
  if (noMatch) {
    return {
      badge: { kind: 'no', label: 'NO · FRENO ACTIVO' },
      cleanSentence: (noMatch[1] || trimmed).trim(),
    };
  }

  const yesMatch = trimmed.match(/^S[IÍ]\s*[:.\-–—]\s*(.*)$/i);
  if (yesMatch) {
    return {
      badge: { kind: 'yes', label: 'SÍ · CAMINO ABIERTO' },
      cleanSentence: (yesMatch[1] || trimmed).trim(),
    };
  }

  return {
    badge: { kind: 'cond', label: 'SÍ, CON ESTA CONDICIÓN' },
    cleanSentence: trimmed,
  };
}

function parseHeroVerdict(markdown: string): ParsedVerdict | null {
  const regex = /###\s*🧭[^\n]*\n+>\s*([^\n]+)(?:\n+---)?\s*/;
  const match = markdown.match(regex);
  if (!match) return null;

  const { badge, cleanSentence } = classifyBadge(match[1]);
  const bodyMarkdown = markdown.replace(match[0], '').trim();
  return { badge, sentence: cleanSentence, bodyMarkdown };
}

export const ReadingResult: React.FC<ReadingResultProps> = ({
  lectura,
  cartas,
  apiError,
  isSaved,
  onSaveToJournal,
  onExportPdf,
  onDownloadMarkdown,
  onNewReading,
  onFallbackLocal,
}) => {
  if (!lectura && !apiError) return null;

  const hero = lectura ? parseHeroVerdict(lectura.markdown) : null;

  const badgeStyles: Record<VerdictBadge['kind'], string> = {
    yes: 'border-emerald-400/50 bg-emerald-950/60 text-emerald-300',
    no: 'border-rose-400/50 bg-rose-950/60 text-rose-200',
    cond: 'border-gold/70 bg-gold/15 text-gold-bright',
  };

  return (
    <section aria-label="Resultado de la Lectura" className="no-print space-y-6">
      {/* 1. BLOQUE PROTAGONISTA NORUF_LABS: ARRIBA DEL TODO */}
      {lectura && hero && (
        <div className="animate-card-reveal rounded-2xl border-2 border-gold bg-gradient-to-b from-[#171a24] to-obsidianLight p-5 shadow-[0_0_32px_rgba(212,175,55,0.14)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3.5 py-1 font-mono text-xs font-bold tracking-wider ${
                badgeStyles[hero.badge.kind]
              }`}
            >
              {hero.badge.label}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Veredicto del Oráculo
            </span>
          </div>

          <p className="mt-4 font-serif text-xl font-bold leading-snug text-parchment sm:text-2xl">
            &ldquo;{hero.sentence}&rdquo;
          </p>

          <p className="mt-3 text-xs text-muted">
            Consulta: <span className="italic text-parchment/80">&ldquo;{lectura.pregunta}&rdquo;</span>
          </p>
        </div>
      )}

      {/* Error BYOK + Fallback automático al Motor Local */}
      {apiError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200 sm:p-5"
        >
          <p className="font-semibold text-red-100">No se pudo completar la lectura con IA externa</p>
          <p className="mt-1 text-xs leading-relaxed text-red-200/90">{apiError}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onFallbackLocal}
              className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-obsidian transition hover:bg-gold-bright sm:text-sm"
            >
              ⚡ Generar ahora con Motor Local Gratuito
            </button>
            <button
              type="button"
              onClick={onNewReading}
              className="rounded-xl border border-obsidianBorder bg-obsidian px-4 py-2 text-xs font-medium text-parchment hover:border-gold"
            >
              Nueva Consulta
            </button>
          </div>
        </div>
      )}

      {/* 2. CARTAS SVG REVELADAS (DEBAJO DEL VEREDICTO PROTAGONISTA) */}
      {cartas.length > 0 && (
        <div className="rounded-2xl border border-gold/30 bg-obsidianLight/70 p-4 sm:p-6">
          <div
            className={`grid place-items-center gap-4 ${
              cartas.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'
            }`}
          >
            {cartas.map((carta, idx) => (
              <TarotCardSvg
                key={`${carta.arcano.id}-${idx}`}
                simbolo={carta.arcano.simboloSvg}
                numeroRomano={carta.arcano.numeroRomano}
                nombre={carta.arcano.nombre}
                arquetipo={carta.arcano.arquetipo}
                invertida={carta.invertida}
                revelada={true}
                posicion={carta.posicion}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. LECTURA LITERARIA + BOTONES DE ACCIÓN */}
      {lectura && (
        <article className="rounded-2xl border border-gold/40 bg-obsidianLight p-5 shadow-xl sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-obsidianBorder pb-3 text-xs text-muted">
            <span>
              Motor:{' '}
              <strong className="font-mono text-gold">
                {lectura.motorUsado === 'local'
                  ? 'Motor Local Gratuito (Offline)'
                  : `BYOK · ${lectura.motorUsado.toUpperCase()}`}
              </strong>
            </span>
            <span>
              {new Date(lectura.fechaIso).toLocaleString('es-ES', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-parchment/95 sm:text-base">
            <ReactMarkdown
              components={{
                h3: ({ children }) => (
                  <h3 className="mt-5 font-serif text-lg font-bold text-gold-bright sm:text-xl">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="rounded-r-xl border-l-4 border-gold bg-obsidian/70 px-4 py-3 font-serif text-base italic text-gold-bright">
                    {children}
                  </blockquote>
                ),
                p: ({ children }) => <p className="leading-7 text-parchment/90">{children}</p>,
                hr: () => <hr className="my-4 border-obsidianBorder" />,
                strong: ({ children }) => (
                  <strong className="font-semibold text-gold-bright">{children}</strong>
                ),
              }}
            >
              {hero ? hero.bodyMarkdown : lectura.markdown}
            </ReactMarkdown>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5 border-t border-obsidianBorder pt-4">
            <button
              type="button"
              onClick={onSaveToJournal}
              disabled={isSaved}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                isSaved
                  ? 'border border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'bg-gold text-obsidian hover:bg-gold-bright'
              }`}
            >
              {isSaved ? '✓ Guardado en Diario' : '💾 Guardar en Diario'}
            </button>

            <button
              type="button"
              onClick={onExportPdf}
              className="rounded-xl border border-gold/40 bg-obsidian px-4 py-2.5 text-xs font-medium text-gold-bright transition hover:bg-gold/10 sm:text-sm"
            >
              🖨️ Exportar PDF / Imprimir
            </button>

            <button
              type="button"
              onClick={onDownloadMarkdown}
              className="rounded-xl border border-gold/40 bg-obsidian px-4 py-2.5 text-xs font-medium text-gold-bright transition hover:bg-gold/10 sm:text-sm"
            >
              ⬇️ Descargar .md
            </button>

            <button
              type="button"
              onClick={onNewReading}
              className="ml-auto rounded-xl border border-obsidianBorder bg-obsidian px-4 py-2.5 text-xs font-medium text-parchment transition hover:border-gold sm:text-sm"
            >
              🔄 Nueva Consulta
            </button>
          </div>
        </article>
      )}
    </section>
  );
};
