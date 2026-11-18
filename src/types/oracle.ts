export type EnfoqueOraculo = 'junguiano' | 'mistico';

export type TipoTirada = '1-carta' | '3-cartas';

export type MotorLectura = 'local' | 'byok';

export type ProveedorLLM = 'gemini' | 'openai' | 'groq';

export type PosicionTirada =
  | 'Eje Central'
  | 'Origen / Bloqueo'
  | 'Realidad Presente'
  | 'Desenlace Potencial';

export interface OrientacionContenido {
  veredictoBase: string;
  ejeCentral: string;
  origen: string;
  presente: string;
  desenlace: string;
  consejo: string;
  preguntaMesa: string;
}

export interface EnfoqueBloque {
  upright: OrientacionContenido;
  reversed: OrientacionContenido;
}

export interface Arcano {
  id: string;
  numeroRomano: string;
  nombre: string;
  arquetipo: string;
  esencia: {
    upright: string;
    reversed: string;
  };
  simboloSvg: string;
  palabrasClave: {
    upright: string[];
    reversed: string[];
  };
  junguiano: EnfoqueBloque;
  mistico: EnfoqueBloque;
}

export interface CartaExtraida {
  arcano: Arcano;
  invertida: boolean;
  posicion: PosicionTirada;
  revelada: boolean;
}

export interface LecturaResultado {
  id: string;
  fechaIso: string;
  pregunta: string;
  enfoque: EnfoqueOraculo;
  tipoTirada: TipoTirada;
  motorUsado: 'local' | ProveedorLLM;
  cartas: Array<{
    id: string;
    nombre: string;
    numeroRomano: string;
    arquetipo: string;
    invertida: boolean;
    posicion: PosicionTirada;
    simboloSvg: string;
  }>;
  markdown: string;
}

export interface ConfiguracionOraculo {
  motor: MotorLectura;
  enfoque: EnfoqueOraculo;
  tipoTirada: TipoTirada;
  permitirInvertidas: boolean;
  proveedor: ProveedorLLM;
  apiKey: string;
  recordarClave: boolean;
}
