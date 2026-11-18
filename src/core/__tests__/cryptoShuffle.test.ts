import { describe, expect, it } from 'vitest';
import arcanosData from '../../data/arcanos.json';
import type { Arcano } from '../../types/oracle';
import { drawArcanos, secureRandomInt } from '../cryptoShuffle';

const ARCANOS = arcanosData as Arcano[];

describe('cryptoShuffle (Barajado Criptográfico Real)', () => {
  it('nunca repite cartas en una tirada de 3 arcanos', () => {
    for (let i = 0; i < 1000; i++) {
      const tirada = drawArcanos(ARCANOS, '3-cartas', true);
      expect(tirada).toHaveLength(3);
      const ids = new Set(tirada.map((c) => c.arcano.id));
      expect(ids.size).toBe(3);
      expect(tirada[0].posicion).toBe('Origen / Bloqueo');
      expect(tirada[1].posicion).toBe('Realidad Presente');
      expect(tirada[2].posicion).toBe('Desenlace Potencial');
    }
  });

  it('mantiene distribución uniforme sin sesgo de módulo en secureRandomInt', () => {
    const buckets = 22;
    const samples = 11000;
    const counts = new Array<number>(buckets).fill(0);

    for (let i = 0; i < samples; i++) {
      const n = secureRandomInt(buckets);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(buckets);
      counts[n]++;
    }

    const expected = samples / buckets; // 500
    for (const c of counts) {
      // Tolerancia amplia (380..620) para evitar falsos positivos manteniendo garantía estadística
      expect(c).toBeGreaterThan(expected * 0.76);
      expect(c).toBeLessThan(expected * 1.24);
    }
  });

  it('respeta ~25% de cartas invertidas cuando está activo y 0% cuando está desactivado', () => {
    let invertidas = 0;
    const total = 2000;
    for (let i = 0; i < total; i++) {
      const [carta] = drawArcanos(ARCANOS, '1-carta', true);
      expect(carta.posicion).toBe('Eje Central');
      if (carta.invertida) invertidas++;
    }
    const ratio = invertidas / total;
    expect(ratio).toBeGreaterThan(0.20);
    expect(ratio).toBeLessThan(0.30);

    for (let i = 0; i < 100; i++) {
      const [carta] = drawArcanos(ARCANOS, '1-carta', false);
      expect(carta.invertida).toBe(false);
    }
  });
});
