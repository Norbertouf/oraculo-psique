import React, { useState } from 'react';
import type { ConfiguracionOraculo, EnfoqueOraculo, MotorLectura, ProveedorLLM, TipoTirada } from '../types/oracle';

interface ConfigPanelProps {
  config: ConfiguracionOraculo;
  onChange: (next: ConfiguracionOraculo) => void;
  onOpenGuide: () => void;
  disabled?: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChange,
  onOpenGuide,
  disabled = false,
}) => {
  const [showKey, setShowKey] = useState(false);

  const update = <K extends keyof ConfiguracionOraculo>(
    key: K,
    value: ConfiguracionOraculo[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <section
      aria-label="Configuración del Oráculo"
      className="no-print rounded-2xl border border-obsidianBorder bg-obsidianLight p-4 shadow-lg sm:p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Selector de Motor */}
        <div>
          <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-gold">
            Motor de Lectura
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'local', label: 'Local Gratuito', sub: 'Offline · 0 €' },
                { id: 'byok', label: 'IA (BYOK)', sub: 'Tu propia clave' },
              ] as Array<{ id: MotorLectura; label: string; sub: string }>
            ).map((opt) => {
              const active = config.motor === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => update('motor', opt.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? 'border-gold bg-gold/15 text-gold-bright'
                      : 'border-obsidianBorder bg-obsidian text-muted hover:border-gold/40 hover:text-parchment'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs font-semibold sm:text-sm">{opt.label}</div>
                  <div className="text-[11px] opacity-80">{opt.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Tirada */}
        <div>
          <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-gold">
            Disposición de la Tirada
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: '1-carta', label: 'Espejo Directo', sub: '1 Carta · Eje Central' },
                { id: '3-cartas', label: 'Evolución Cruda', sub: '3 Cartas · Proceso' },
              ] as Array<{ id: TipoTirada; label: string; sub: string }>
            ).map((opt) => {
              const active = config.tipoTirada === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => update('tipoTirada', opt.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? 'border-gold bg-gold/15 text-gold-bright'
                      : 'border-obsidianBorder bg-obsidian text-muted hover:border-gold/40 hover:text-parchment'
                  } disabled:opacity-50`}
                >
                  <div className="text-xs font-semibold sm:text-sm">{opt.label}</div>
                  <div className="text-[11px] opacity-80">{opt.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Enfoque */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-gold">
            Enfoque del Tarotista
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(
              [
                {
                  id: 'junguiano',
                  label: '🧠 Psicología Junguiana',
                  desc: 'Espejo interno, análisis directo de bloqueos, sin complacencia.',
                },
                {
                  id: 'mistico',
                  label: '✨ Tradición Mística',
                  desc: 'Lectura simbólica clásica, tendencias y augurio tradicional.',
                },
              ] as Array<{ id: EnfoqueOraculo; label: string; desc: string }>
            ).map((opt) => {
              const active = config.enfoque === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => update('enfoque', opt.id)}
                  className={`rounded-xl border px-3.5 py-2.5 text-left transition ${
                    active
                      ? 'border-gold bg-gold/15 text-gold-bright'
                      : 'border-obsidianBorder bg-obsidian text-muted hover:border-gold/40 hover:text-parchment'
                  } disabled:opacity-50`}
                >
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="mt-0.5 text-xs opacity-80">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toggle de invertidas */}
      <div className="mt-4 flex items-center justify-between border-t border-obsidianBorder pt-3.5">
        <label htmlFor="toggle-invertidas" className="cursor-pointer pr-3 text-xs sm:text-sm">
          <span className="font-medium text-parchment">Permitir cartas invertidas</span>
          <span className="block text-xs text-muted">
            25% de probabilidad de inversión simbólica cuando está activo.
          </span>
        </label>
        <input
          id="toggle-invertidas"
          type="checkbox"
          disabled={disabled}
          checked={config.permitirInvertidas}
          onChange={(e) => update('permitirInvertidas', e.target.checked)}
          className="h-5 w-5 cursor-pointer accent-gold"
        />
      </div>

      {/* Panel BYOK */}
      {config.motor === 'byok' && (
        <div className="mt-4 space-y-3 rounded-xl border border-gold/30 bg-obsidian/80 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gold">
              Configuración BYOK (Tu Navegador → Proveedor)
            </span>
            <button
              type="button"
              onClick={onOpenGuide}
              className="text-xs font-medium text-gold underline hover:text-gold-bright"
            >
              ¿Cómo conseguir clave gratis?
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="llm-provider" className="mb-1 block text-xs text-muted">
                Proveedor
              </label>
              <select
                id="llm-provider"
                disabled={disabled}
                value={config.proveedor}
                onChange={(e) => update('proveedor', e.target.value as ProveedorLLM)}
                className="w-full rounded-lg border border-obsidianBorder bg-obsidianLight px-3 py-2 text-sm text-parchment focus:border-gold focus:outline-none"
              >
                <option value="gemini">Google Gemini (Gratis)</option>
                <option value="openai">OpenAI (gpt-4o-mini)</option>
                <option value="groq">Groq (Llama 3.3 70B)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="llm-apikey" className="mb-1 block text-xs text-muted">
                API Key ({config.proveedor.toUpperCase()})
              </label>
              <div className="flex gap-2">
                <input
                  id="llm-apikey"
                  type={showKey ? 'text' : 'password'}
                  disabled={disabled}
                  value={config.apiKey}
                  onChange={(e) => update('apiKey', e.target.value)}
                  placeholder={
                    config.proveedor === 'gemini'
                      ? 'AIza...'
                      : config.proveedor === 'groq'
                        ? 'gsk_...'
                        : 'sk-...'
                  }
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-lg border border-obsidianBorder bg-obsidianLight px-3 py-2 font-mono text-sm text-parchment placeholder:text-muted/50 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  className="rounded-lg border border-obsidianBorder bg-obsidianLight px-3 py-2 text-xs text-muted hover:border-gold hover:text-parchment"
                >
                  {showKey ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted">
            <input
              type="checkbox"
              checked={config.recordarClave}
              onChange={(e) => update('recordarClave', e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-gold"
            />
            <span>
              Recordar clave en este dispositivo bajo mi responsabilidad (por defecto se borra al cerrar
              la pestaña).
            </span>
          </label>
        </div>
      )}
    </section>
  );
};
