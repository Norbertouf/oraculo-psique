import type { LecturaResultado } from '../types/oracle';

export function formatReadingAsMarkdown(lectura: LecturaResultado): string {
  const fecha = new Date(lectura.fechaIso).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  const enfoqueLabel =
    lectura.enfoque === 'junguiano'
      ? 'Psicología Junguiana (Espejo Interno y Bloqueos)'
      : 'Tradición Mística (Pronóstico, Símbolos y Destino)';

  const cartasLista = lectura.cartas
    .map(
      (c) =>
        `- **${c.posicion}:** ${c.numeroRomano} · ${c.nombre} (*${c.arquetipo}*) — ${
          c.invertida ? 'Invertida' : 'Al Derecho'
        }`,
    )
    .join('\n');

  return [
    '# 🔮 Oráculo de la Psique — Lectura Introspectiva',
    '',
    `**Noruf_Labs** | Autor: Norberto Urrea Falla (\`norbertouf@gmail.com\`)`,
    '',
    `- **Fecha:** ${fecha}`,
    `- **Enfoque:** ${enfoqueLabel}`,
    `- **Motor:** ${lectura.motorUsado === 'local' ? 'Motor Local Gratuito (Offline)' : `BYOK (${lectura.motorUsado.toUpperCase()})`}`,
    `- **Consulta:** "${lectura.pregunta}"`,
    '',
    '## Arquetipos Convocados',
    cartasLista,
    '',
    '---',
    '',
    lectura.markdown,
    '',
    '---',
    '*Advertencia de honestidad: El tarot no es una ciencia demostrada. Considéralo un entretenimiento introspectivo.*',
  ].join('\n');
}

function triggerBlobDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadReadingMarkdown(lectura: LecturaResultado): void {
  const md = formatReadingAsMarkdown(lectura);
  const dateSlug = lectura.fechaIso.slice(0, 10);
  triggerBlobDownload(md, `oraculo-psique-${dateSlug}.md`, 'text/markdown;charset=utf-8');
}

export function downloadJournalMarkdown(entries: readonly LecturaResultado[]): void {
  const body = entries.map((e) => formatReadingAsMarkdown(e)).join('\n\n========================================\n\n');
  const dateSlug = new Date().toISOString().slice(0, 10);
  triggerBlobDownload(body, `diario-oraculo-psique-${dateSlug}.md`, 'text/markdown;charset=utf-8');
}

export function printReadingPdf(): void {
  window.print();
}
