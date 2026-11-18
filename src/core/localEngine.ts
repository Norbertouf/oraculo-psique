import type { CartaExtraida, EnfoqueOraculo, OrientacionContenido } from '../types/oracle';

/**
 * Garantiza que una frase no supere maxWords palabras.
 */
export function enforceMaxWords(text: string, maxWords = 15): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return words.join(' ');
  }
  const clipped = words.slice(0, maxWords).join(' ').replace(/[,;:\-]+$/, '');
  return clipped.endsWith('.') ? clipped : `${clipped}.`;
}

function getContenido(carta: CartaExtraida, enfoque: EnfoqueOraculo): OrientacionContenido {
  const bloque = enfoque === 'junguiano' ? carta.arcano.junguiano : carta.arcano.mistico;
  return carta.invertida ? bloque.reversed : bloque.upright;
}

function formatEtiquetaCarta(carta: CartaExtraida): string {
  const orientacion = carta.invertida ? 'Invertida' : 'Al Derecho';
  return `**${carta.arcano.nombre}** (*${carta.arcano.arquetipo}*, ${orientacion})`;
}

/**
 * Motor Heurístico Offline (100% local, 0 peticiones de red).
 * Construye una lectura literaria en 3 bloques pensada para leer en voz alta
 * más el bloque protagonista de Veredicto (<= 15 palabras).
 */
export function generateLocalReading(
  pregunta: string,
  enfoque: EnfoqueOraculo,
  cartas: readonly CartaExtraida[],
): string {
  if (cartas.length === 0) {
    throw new Error('Se requiere al menos una carta para generar la lectura local.');
  }

  const preguntaLimpia = pregunta.trim() || 'tu consulta actual';
  const esJunguiano = enfoque === 'junguiano';

  if (cartas.length === 1) {
    const carta = cartas[0];
    const contenido = getContenido(carta, enfoque);
    const esencia = carta.invertida ? carta.arcano.esencia.reversed : carta.arcano.esencia.upright;
    const veredicto = enforceMaxWords(contenido.veredictoBase, 15);

    const escena = esJunguiano
      ? `Frente a tu pregunta (*"${preguntaLimpia}"*), el espejo deja sobre la mesa a ${formatEtiquetaCarta(carta)}. ${contenido.ejeCentral}`
      : `Ante lo que pones en juego (*"${preguntaLimpia}"*), la escena se abre con ${formatEtiquetaCarta(carta)}. ${contenido.ejeCentral}`;

    const giro = esJunguiano
      ? `Aquí está el ángulo que suele pasarse por alto: ${esencia} En concreto, ${contenido.presente.charAt(0).toLowerCase()}${contenido.presente.slice(1)} Si miras más allá del primer impulso, ${contenido.desenlace.charAt(0).toLowerCase()}${contenido.desenlace.slice(1)}`
      : `El giro oculto detrás de esta carta señala un hecho concreto: ${esencia} Hoy mismo, ${contenido.presente.charAt(0).toLowerCase()}${contenido.presente.slice(1)} Y hacia delante, ${contenido.desenlace.charAt(0).toLowerCase()}${contenido.desenlace.slice(1)}`;

    const cierre = `${contenido.consejo}\n\n**Para comentar en la mesa:** ${contenido.preguntaMesa}`;

    return [
      '### 🧭 Veredicto e Inclinación del Oráculo',
      `> ${veredicto}`,
      '',
      '---',
      '',
      '### 🎬 La Escena',
      escena,
      '',
      '### 🪞 La Verdad Incómoda / El Giro',
      giro,
      '',
      '### 🔥 El Cierre y Pregunta para la Mesa',
      cierre,
    ].join('\n');
  }

  // Tirada de 3 cartas: Posición 1 (Origen / Bloqueo), Posición 2 (Realidad Presente), Posición 3 (Desenlace Potencial)
  const [c1, c2, c3] = cartas;
  const k1 = getContenido(c1, enfoque);
  const k2 = getContenido(c2, enfoque);
  const k3 = getContenido(c3, enfoque);

  const veredicto = enforceMaxWords(c3.invertida && !c2.invertida ? k2.veredictoBase : k3.veredictoBase, 15);

  const escena = esJunguiano
    ? `Cuando preguntas *"${preguntaLimpia}"*, el relato arranca en el **Origen / Bloqueo** con ${formatEtiquetaCarta(c1)}: ${k1.origen} Ese punto de partida explica por qué hoy, en la **Realidad Presente**, te planta cara ${formatEtiquetaCarta(c2)}: ${k2.presente}`
    : `Al poner sobre la mesa *"${preguntaLimpia}"*, la historia viene marcada en su **Origen / Bloqueo** por ${formatEtiquetaCarta(c1)}: ${k1.origen} Ese antecedente desemboca directo en tu **Realidad Presente**, regida por ${formatEtiquetaCarta(c2)}: ${k2.presente}`;

  const giro = esJunguiano
    ? `El verdadero giro aparece al cruzar esa tensión con el **Desenlace Potencial** que anuncia ${formatEtiquetaCarta(c3)}: ${k3.desenlace} Lo que parece un obstáculo externo en ${c2.arcano.nombre} es en realidad el peaje pendiente que arrastrabas desde ${c1.arcano.nombre}.`
    : `La verdad menos evidente de esta tirada se revela en el contraste con el **Desenlace Potencial**, donde aguarda ${formatEtiquetaCarta(c3)}: ${k3.desenlace} Entre lo que empezó en ${c1.arcano.nombre} y lo que ocurre hoy con ${c2.arcano.nombre}, el tablero ya dejó claro dónde está la grieta.`;

  const preguntaDebate = k3.preguntaMesa || k2.preguntaMesa;
  const cierre = `${k2.consejo} ${k3.consejo}\n\n**Para comentar en la mesa:** ${preguntaDebate}`;

  return [
    '### 🧭 Veredicto e Inclinación del Oráculo',
    `> ${veredicto}`,
    '',
    '---',
    '',
    '### 🎬 La Escena',
    escena,
    '',
    '### 🪞 La Verdad Incómoda / El Giro',
    giro,
    '',
    '### 🔥 El Cierre y Pregunta para la Mesa',
    cierre,
  ].join('\n');
}
