import React from 'react';

interface HeaderProps {
  journalCount: number;
  onOpenJournal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ journalCount, onOpenJournal }) => {
  return (
    <header className="no-print border-b border-obsidianBorder bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-wide text-gold-bright sm:text-3xl">
              🔮 Oráculo de la Psique
            </h1>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">
              Inteligencia Arquetípica y Tarot Evolutivo · 100% Privado en tu Navegador
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-obsidianLight px-3.5 py-2 text-xs font-medium text-gold-bright transition hover:border-gold hover:bg-gold/10 sm:text-sm"
          >
            <span>📖 Diario</span>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-xs text-gold-bright">
              {journalCount}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
          <span className="font-mono font-bold text-gold">🔬 Noruf_Labs</span>
          <span aria-hidden="true">|</span>
          <span>
            <strong className="text-parchment/90">Autor:</strong> Norberto Urrea Falla
          </span>
          <span aria-hidden="true">|</span>
          <span className="font-mono italic">norbertouf@gmail.com</span>
        </div>

        <div
          role="note"
          className="rounded-lg border border-amber-500/30 bg-amber-950/25 px-3 py-2 text-xs text-amber-200/90"
        >
          <strong>⚠️ Advertencia de honestidad:</strong> El tarot no es una ciencia demostrada.
          Considéralo una herramienta de entretenimiento introspectivo y reflexión simbólica.
        </div>
      </div>
    </header>
  );
};
