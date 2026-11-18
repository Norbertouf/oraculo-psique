import React from 'react';

interface ApiKeyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyGuideModal: React.FC<ApiKeyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/40 bg-obsidianLight p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-obsidianBorder pb-3">
          <div>
            <h2 id="guide-modal-title" className="font-serif text-xl font-bold text-gold-bright">
              Guía Rápida: API Key Gratuita (100% Opcional)
            </h2>
            <p className="mt-1 text-xs text-muted">
              No necesitas clave para usar el Oráculo. El Motor Local funciona siempre gratis y sin conexión.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía"
            className="rounded-lg border border-obsidianBorder px-2.5 py-1 text-sm text-muted hover:border-gold hover:text-parchment"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-parchment/90">
          <div className="rounded-lg border border-gold/25 bg-obsidian/70 p-3 text-xs text-gold/90">
            🔒 <strong>Privacidad absoluta:</strong> Tu clave viaja directamente desde tu navegador al
            proveedor elegido. Noruf_Labs no tiene servidores ni almacena tus consultas.
          </div>

          <ol className="list-decimal space-y-2.5 pl-5">
            <li>
              Entra en{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold underline hover:text-gold-bright"
              >
                Google AI Studio (aistudio.google.com/apikey)
              </a>{' '}
              e inicia sesión con tu cuenta de Google.
            </li>
            <li>
              Pulsa el botón <strong>&ldquo;Create API key&rdquo;</strong> (Crear clave de API). Tiene
              una capa gratuita generosa sin necesidad de tarjeta de crédito en la mayoría de regiones.
            </li>
            <li>Copia la clave generada (empieza por <code className="font-mono text-gold">AIza...</code>).</li>
            <li>
              Pégala en el campo <strong>API Key</strong> de esta aplicación. Por defecto se guardará solo
              en esta pestaña (<code className="font-mono">sessionStorage</code>) y desaparecerá al cerrarla.
            </li>
          </ol>

          <p className="text-xs text-muted">
            También puedes usar claves propias de <strong>OpenAI</strong> (<code className="font-mono">gpt-4o-mini</code>)
            o <strong>Groq</strong> (<code className="font-mono">llama-3.3-70b-versatile</code>).
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-obsidian transition hover:bg-gold-bright"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
