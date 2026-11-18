import { describe, expect, it } from 'vitest';
import arcanosData from '../../data/arcanos.json';
import type { Arcano, CartaExtraida, EnfoqueOraculo } from '../../types/oracle';
import { enforceMaxWords, generateLocalReading } from '../localEngine';

const ARCANOS = arcanosData as Arcano[];

function extractVerdict(markdown: string): string {
  const match = markdown.match(/### 🧭 Veredicto e Inclinación del Oráculo\s*\n>\s*(.+)/);
  return match ? match[1].trim() : '';
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const VERDICT_PREFIX_REGEX = /^(SÍ:|NO:|SÍ, CON UNA CONDICIÓN:)/;

describe('localEngine y arcanos.json (Motor Offline Literario)', () => {
  it('contiene los 22 Arcanos Mayores (0..21) con veredicto <= 15 palabras, prefijo claro y pregunta para la mesa', () => {
    expect(ARCANOS).toHaveLength(22);
    ARCANOS.forEach((arcano, idx) => {
      expect(arcano.id).toBe(String(idx));
      const bloques = [
        arcano.junguiano.upright,
        arcano.junguiano.reversed,
        arcano.mistico.upright,
        arcano.mistico.reversed,
      ];
      for (const b of bloques) {
        expect(b.veredictoBase).toMatch(VERDICT_PREFIX_REGEX);
        expect(countWords(b.veredictoBase)).toBeLessThanOrEqual(15);
        expect(b.preguntaMesa.trim().length).toBeGreaterThan(10);
      }
    });
  });

  it('enforceMaxWords recorta correctamente a <= 15 palabras', () => {
    const larga = 'uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis';
    const resultado = enforceMaxWords(larga, 15);
    expect(countWords(resultado)).toBe(15);
  });

  it('genera lectura literaria de 1 y 3 cartas en ambos enfoques con <= 15 palabras y 3 bloques para leer en voz alta', () => {
    const enfoques: EnfoqueOraculo[] = ['junguiano', 'mistico'];

    for (const enfoque of enfoques) {
      const unaCarta: CartaExtraida[] = [
        { arcano: ARCANOS[0], invertida: false, posicion: 'Eje Central', revelada: true },
      ];
      const pregunta1 = '¿Debo dejar este trabajo ahora?';
      const md1 = generateLocalReading(pregunta1, enfoque, unaCarta);
      expect(md1).toContain('### 🧭 Veredicto e Inclinación del Oráculo');
      expect(md1).toContain('### 🎬 La Escena');
      expect(md1).toContain('### 🪞 La Verdad Incómoda / El Giro');
      expect(md1).toContain('### 🔥 El Cierre y Pregunta para la Mesa');
      expect(md1).toContain('**Para comentar en la mesa:**');
      expect(md1).toContain(pregunta1);

      const v1 = extractVerdict(md1);
      expect(v1).toMatch(VERDICT_PREFIX_REGEX);
      expect(countWords(v1)).toBeGreaterThan(0);
      expect(countWords(v1)).toBeLessThanOrEqual(15);

      const tresCartas: CartaExtraida[] = [
        { arcano: ARCANOS[12], invertida: true, posicion: 'Origen / Bloqueo', revelada: true },
        { arcano: ARCANOS[16], invertida: false, posicion: 'Realidad Presente', revelada: true },
        { arcano: ARCANOS[19], invertida: false, posicion: 'Desenlace Potencial', revelada: true },
      ];
      const pregunta3 = '¿Cómo evolucionará nuestra sociedad?';
      const md3 = generateLocalReading(pregunta3, enfoque, tresCartas);
      expect(md3).toContain('### 🎬 La Escena');
      expect(md3).toContain('### 🪞 La Verdad Incómoda / El Giro');
      expect(md3).toContain('### 🔥 El Cierre y Pregunta para la Mesa');
      expect(md3).toContain('**Para comentar en la mesa:**');
      expect(md3).toContain(pregunta3);

      const v3 = extractVerdict(md3);
      expect(v3).toMatch(VERDICT_PREFIX_REGEX);
      expect(countWords(v3)).toBeGreaterThan(0);
      expect(countWords(v3)).toBeLessThanOrEqual(15);
    }
  });
});
