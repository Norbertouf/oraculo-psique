import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { LecturaResultado } from '../types/oracle';

interface PrintableReadingProps {
  lectura: LecturaResultado | null;
}

/**
 * Vista exclusiva para @media print: oculta formularios y navegación,
 * generando un pergamino/informe limpio en papel con los créditos de Noruf_Labs.
 */
export const PrintableReading: React.FC<PrintableReadingProps> = ({ lectura }) => {
  if (!lectura) return null;

  const fecha = new Date(lectura.fechaIso).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div className="hidden print-only text-black">
      <header className="border-b-2 border-neutral-800 pb-3">
        <h1 className="font-serif text-2xl font-bold">Oráculo de la Psique</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Noruf_Labs | Autor: Norberto Urrea Falla (norbertouf@gmail.com)
        </p>
      </header>

      <section className="mt-4 space-y-1 text-sm">
        <p>
          <strong>Fecha:</strong> {fecha}
        </p>
        <p>
          <strong>Enfoque:</strong>{' '}
          {lectura.enfoque === 'junguiano'
            ? 'Psicología Junguiana (Espejo Interno y Bloqueos)'
            : 'Tradición Mística (Pronóstico, Símbolos y Destino)'}
        </p>
        <p>
          <strong>Consulta:</strong> &ldquo;{lectura.pregunta}&rdquo;
        </p>
      </section>

      <section className="mt-4 border-y border-neutral-300 py-3">
        <h2 className="font-serif text-base font-bold">Arquetipos Convocados</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {lectura.cartas.map((c, idx) => (
            <li key={`${c.id}-${idx}`}>
              <strong>{c.posicion}:</strong> {c.numeroRomano} · {c.nombre} ({c.arquetipo}) —{' '}
              {c.invertida ? 'Invertida' : 'Al Derecho'}
            </li>
          ))}
        </ul>
      </section>

      <article className="mt-4 space-y-3 text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            h3: ({ children }) => (
              <h3 className="mt-4 font-serif text-base font-bold text-black">{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-neutral-700 pl-3 font-serif italic">
                {children}
              </blockquote>
            ),
            p: ({ children }) => <p className="leading-relaxed">{children}</p>,
            hr: () => <hr className="my-3 border-neutral-300" />,
          }}
        >
          {lectura.markdown}
        </ReactMarkdown>
      </article>

      <footer className="mt-6 border-t border-neutral-300 pt-2 text-[10pt] italic text-neutral-600">
        Advertencia de honestidad: El tarot no es una ciencia demostrada. Considéralo un
        entretenimiento introspectivo.
      </footer>
    </div>
  );
};
