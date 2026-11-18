import React from 'react';
import type { CartaExtraida } from '../types/oracle';
import { TarotCardSvg } from './TarotCardSvg';

interface ReadingRitualProps {
  pregunta: string;
  onPreguntaChange: (value: string) => void;
  cartas: CartaExtraida[];
  fase: 'idle' | 'revelando' | 'generando' | 'resultado';
  validationMsg: string | null;
  onBarajar: () => void;
  onRevelarCarta: (index: number) => void;
  onRevelarTodas: () => void;
}

export const ReadingRitual: React.FC<ReadingRitualProps> = ({
  pregunta,
  onPreguntaChange,
  cartas,
  fase,
  validationMsg,
  onBarajar,
  onRevelarCarta,
  onRevelarTodas,
}) => {
  const todasReveladas = cartas.length > 0 && cartas.every((c) => c.revelada);

  return (
    <section aria-label="Ritual de Consulta" className="no-print space-y-5">
      <div className="rounded-2xl border border-obsidianBorder bg-obsidianLight p-4 shadow-lg sm:p-5">
        <label htmlFor="pregunta-input" className="mb-2 block font-serif text-base font-semibold text-gold-bright">
          Formula tu consulta con honestidad (el espejo no miente):
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="pregunta-input"
            type="text"
            value={pregunta}
            disabled={fase === 'revelando' || fase === 'generando'}
            onChange={(e) => onPreguntaChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && fase === 'idle') {
                onBarajar();
              }
            }}
            placeholder="Ej. ¿Qué bloqueo me impide dar el siguiente paso profesional?"
            className="w-full rounded-xl border border-obsidianBorder bg-obsidian px-4 py-3 text-sm text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none disabled:opacity-60"
          />
          {fase === 'idle' && (
            <button
              type="button"
              onClick={onBarajar}
              className="shrink-0 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-obsidian shadow-md transition hover:bg-gold-bright active:scale-[0.98]"
            >
              🔮 Barajar y Convocar
            </button>
          )}
        </div>

        {validationMsg && (
          <p role="alert" className="mt-2.5 text-xs font-medium text-amber-300">
            {validationMsg}
          </p>
        )}
      </div>

      {cartas.length > 0 && fase !== 'resultado' && (
        <div className="rounded-2xl border border-gold/30 bg-obsidianLight/70 p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-lg font-semibold text-gold-bright">
                Arquetipos Convocados
              </h2>
              <p className="text-xs text-muted">
                {todasReveladas
                  ? 'Procesando la síntesis del oráculo...'
                  : 'Toca cada carta boca abajo para revelarla.'}
              </p>
            </div>
            {!todasReveladas && (
              <button
                type="button"
                onClick={onRevelarTodas}
                className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/10"
              >
                Revelar todas
              </button>
            )}
          </div>

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
                revelada={carta.revelada}
                posicion={carta.posicion}
                onClick={() => onRevelarCarta(idx)}
              />
            ))}
          </div>

          {fase === 'generando' && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gold-bright">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <span>El espejo está procesando tu lectura...</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
