import React, { useMemo, useState } from 'react';
import type { LecturaResultado } from '../types/oracle';

interface JournalDrawerProps {
  isOpen: boolean;
  entries: LecturaResultado[];
  onClose: () => void;
  onSelectEntry: (entry: LecturaResultado) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onExportAll: () => void;
}

export const JournalDrawer: React.FC<JournalDrawerProps> = ({
  isOpen,
  entries,
  onClose,
  onSelectEntry,
  onDeleteEntry,
  onClearAll,
  onExportAll,
}) => {
  const [query, setQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.pregunta.toLowerCase().includes(q) ||
        e.cartas.some((c) => c.nombre.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  if (!isOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Diario de Lecturas Privado"
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-obsidianBorder bg-obsidianLight shadow-2xl">
        <div className="flex items-center justify-between border-b border-obsidianBorder p-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-gold-bright">
              📖 Diario de Lecturas
            </h2>
            <p className="text-xs text-muted">Guardado solo en este navegador (localStorage)</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar diario"
            className="rounded-lg border border-obsidianBorder px-2.5 py-1 text-sm text-muted hover:border-gold hover:text-parchment"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-obsidianBorder p-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por pregunta o arcano..."
            className="w-full rounded-lg border border-obsidianBorder bg-obsidian px-3 py-2 text-sm text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              {entries.length === 0
                ? 'Aún no hay lecturas guardadas en tu diario.'
                : 'Ninguna lectura coincide con tu búsqueda.'}
            </p>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-obsidianBorder bg-obsidian p-3.5 transition hover:border-gold/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEntry(entry);
                      onClose();
                    }}
                    className="text-left"
                  >
                    <p className="text-xs font-mono text-gold">
                      {new Date(entry.fechaIso).toLocaleDateString('es-ES', {
                        dateStyle: 'medium',
                      })}{' '}
                      · {entry.enfoque === 'junguiano' ? 'Junguiano' : 'Místico'}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-parchment hover:text-gold-bright">
                      &ldquo;{entry.pregunta}&rdquo;
                    </h3>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label="Eliminar lectura"
                    className="shrink-0 rounded px-2 py-1 text-xs text-muted hover:bg-red-950/40 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.cartas.map((c, idx) => (
                    <span
                      key={`${entry.id}-${c.id}-${idx}`}
                      className="rounded border border-gold/25 bg-obsidianLight px-2 py-0.5 text-[11px] text-parchment/85"
                    >
                      {c.nombre} {c.invertida ? '(Inv.)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="border-t border-obsidianBorder p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={onExportAll}
                className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold-bright hover:bg-gold/10"
              >
                ⬇️ Exportar todo (.md)
              </button>

              {!confirmClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/40"
                >
                  Borrar historial
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                    }}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Confirmar borrado
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="text-xs text-muted hover:text-parchment"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
