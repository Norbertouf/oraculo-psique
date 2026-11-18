import type { Arcano, CartaExtraida, PosicionTirada, TipoTirada } from '../types/oracle';

const UINT32_RANGE = 0x100000000; // 2^32

/**
 * Genera un entero uniforme en [0, maxExclusive) utilizando
 * crypto.getRandomValues + rejection sampling para eliminar el sesgo de módulo.
 */
export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive debe ser un entero positivo.');
  }
  if (maxExclusive === 1) return 0;

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Web Crypto API (crypto.getRandomValues) no está disponible.');
  }

  const limit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);

  while (true) {
    cryptoObj.getRandomValues(buffer);
    const value = buffer[0];
    if (value < limit) {
      return value % maxExclusive;
    }
  }
}

const POSICIONES_TRES: readonly PosicionTirada[] = [
  'Origen / Bloqueo',
  'Realidad Presente',
  'Desenlace Potencial',
];

/**
 * Extrae 1 o 3 arcanos sin repetición usando barajado criptográfico.
 * Cuando permitirInvertidas es true, cada carta tiene un 25% de probabilidad de salir invertida.
 */
export function drawArcanos(
  mazo: readonly Arcano[],
  tipoTirada: TipoTirada,
  permitirInvertidas: boolean,
): CartaExtraida[] {
  const count = tipoTirada === '1-carta' ? 1 : 3;
  if (mazo.length < count) {
    throw new RangeError('El mazo no contiene suficientes cartas para la tirada.');
  }

  const disponibles = [...mazo];
  const resultado: CartaExtraida[] = [];

  for (let i = 0; i < count; i++) {
    const idx = secureRandomInt(disponibles.length);
    const [elegido] = disponibles.splice(idx, 1);
    const invertida = permitirInvertidas ? secureRandomInt(100) < 25 : false;
    const posicion: PosicionTirada = count === 1 ? 'Eje Central' : POSICIONES_TRES[i];

    resultado.push({
      arcano: elegido,
      invertida,
      posicion,
      revelada: false,
    });
  }

  return resultado;
}
