import React, { useCallback, useEffect, useState } from 'react';
import arcanosData from './data/arcanos.json';
import { drawArcanos } from './core/cryptoShuffle';
import { generateLocalReading } from './core/localEngine';
import { buildMasterPrompt } from './core/promptBuilder';
import { getLLMAdapter } from './services/llm/llmFactory';
import { LLMError } from './services/llm/types';
import {
  clearJournal,
  deleteJournalEntry,
  getRememberKeyFlag,
  loadApiKey,
  loadJournal,
  saveApiKey,
  saveJournalEntry,
} from './services/storageService';
import {
  downloadJournalMarkdown,
  downloadReadingMarkdown,
  printReadingPdf,
} from './services/exportService';
import type {
  Arcano,
  CartaExtraida,
  ConfiguracionOraculo,
  LecturaResultado,
} from './types/oracle';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { ApiKeyGuideModal } from './components/ApiKeyGuideModal';
import { ReadingRitual } from './components/ReadingRitual';
import { ReadingResult } from './components/ReadingResult';
import { JournalDrawer } from './components/JournalDrawer';
import { PrintableReading } from './components/PrintableReading';

const ARCANOS = arcanosData as Arcano[];

function createReadingId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `lectura-${Date.now()}`;
}

export function App(): React.ReactElement {
  const [config, setConfig] = useState<ConfiguracionOraculo>(() => ({
    motor: 'local',
    enfoque: 'junguiano',
    tipoTirada: '3-cartas',
    permitirInvertidas: true,
    proveedor: 'gemini',
    apiKey: loadApiKey('gemini'),
    recordarClave: getRememberKeyFlag(),
  }));

  const [pregunta, setPregunta] = useState('');
  const [cartas, setCartas] = useState<CartaExtraida[]>([]);
  const [fase, setFase] = useState<'idle' | 'revelando' | 'generando' | 'resultado'>('idle');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lecturaActual, setLecturaActual] = useState<LecturaResultado | null>(null);

  const [journal, setJournal] = useState<LecturaResultado[]>(() => loadJournal());
  const [isSaved, setIsSaved] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleConfigChange = useCallback((next: ConfiguracionOraculo) => {
    setConfig((prev) => {
      if (prev.proveedor !== next.proveedor) {
        const storedKey = loadApiKey(next.proveedor);
        return { ...next, apiKey: storedKey };
      }
      saveApiKey(next.proveedor, next.apiKey, next.recordarClave);
      return next;
    });
  }, []);

  const buildLecturaObject = useCallback(
    (
      cartasList: readonly CartaExtraida[],
      markdown: string,
      motorUsado: LecturaResultado['motorUsado'],
    ): LecturaResultado => ({
      id: createReadingId(),
      fechaIso: new Date().toISOString(),
      pregunta: pregunta.trim(),
      enfoque: config.enfoque,
      tipoTirada: config.tipoTirada,
      motorUsado,
      cartas: cartasList.map((c) => ({
        id: c.arcano.id,
        nombre: c.arcano.nombre,
        numeroRomano: c.arcano.numeroRomano,
        arquetipo: c.arcano.arquetipo,
        invertida: c.invertida,
        posicion: c.posicion,
        simboloSvg: c.arcano.simboloSvg,
      })),
      markdown,
    }),
    [config.enfoque, config.tipoTirada, pregunta],
  );

  const ejecutarLectura = useCallback(
    async (cartasList: readonly CartaExtraida[], forceLocal = false) => {
      setApiError(null);

      if (forceLocal || config.motor === 'local') {
        const md = generateLocalReading(pregunta, config.enfoque, cartasList);
        const res = buildLecturaObject(cartasList, md, 'local');
        setLecturaActual(res);
        setIsSaved(false);
        setFase('resultado');
        return;
      }

      setFase('generando');
      try {
        const prompt = buildMasterPrompt(pregunta, config.enfoque, cartasList);
        const adapter = getLLMAdapter(config.proveedor);
        const md = await adapter.generate(prompt, config.apiKey);
        const res = buildLecturaObject(cartasList, md, config.proveedor);
        setLecturaActual(res);
        setIsSaved(false);
        setFase('resultado');
      } catch (err) {
        const msg =
          err instanceof LLMError
            ? err.message
            : 'Error inesperado al conectar con el proveedor de IA.';
        setApiError(msg);
        setFase('resultado');
      }
    },
    [buildLecturaObject, config.apiKey, config.enfoque, config.motor, config.proveedor, pregunta],
  );

  const handleBarajar = () => {
    setValidationMsg(null);
    setApiError(null);
    setLecturaActual(null);
    setIsSaved(false);

    if (!pregunta.trim()) {
      setValidationMsg('Por favor, introduce una consulta para activar el mecanismo de sincronía.');
      return;
    }

    if (config.motor === 'byok' && !config.apiKey.trim()) {
      setValidationMsg(
        'Introduce tu API Key o cambia a "Local Gratuito" para consultar sin clave.',
      );
      return;
    }

    const extraidas = drawArcanos(ARCANOS, config.tipoTirada, config.permitirInvertidas);
    setCartas(extraidas);
    setFase('revelando');
  };

  const handleRevelarCarta = (index: number) => {
    if (fase !== 'revelando') return;
    setCartas((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, revelada: true } : c)),
    );
  };

  const handleRevelarTodas = () => {
    if (fase !== 'revelando') return;
    setCartas((prev) => prev.map((c) => ({ ...c, revelada: true })));
  };

  // Dispara la lectura automáticamente en cuanto todas las cartas son reveladas
  useEffect(() => {
    if (fase === 'revelando' && cartas.length > 0 && cartas.every((c) => c.revelada)) {
      void ejecutarLectura(cartas, false);
    }
  }, [cartas, ejecutarLectura, fase]);

  const handleNewReading = () => {
    setCartas([]);
    setLecturaActual(null);
    setApiError(null);
    setValidationMsg(null);
    setIsSaved(false);
    setFase('idle');
  };

  const handleSaveToJournal = () => {
    if (!lecturaActual) return;
    const updated = saveJournalEntry(lecturaActual);
    setJournal(updated);
    setIsSaved(true);
  };

  const handleSelectJournalEntry = (entry: LecturaResultado) => {
    const reconstructed: CartaExtraida[] = entry.cartas.map((c) => {
      const found = ARCANOS.find((a) => a.id === c.id) ?? ARCANOS[0];
      return {
        arcano: found,
        invertida: c.invertida,
        posicion: c.posicion,
        revelada: true,
      };
    });
    setPregunta(entry.pregunta);
    setCartas(reconstructed);
    setLecturaActual(entry);
    setApiError(null);
    setIsSaved(true);
    setFase('resultado');
  };

  return (
    <div className="min-h-screen bg-obsidian text-parchment">
      <Header journalCount={journal.length} onOpenJournal={() => setIsJournalOpen(true)} />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
        {fase !== 'resultado' && (
          <ConfigPanel
            config={config}
            onChange={handleConfigChange}
            onOpenGuide={() => setIsGuideOpen(true)}
            disabled={fase === 'revelando' || fase === 'generando'}
          />
        )}

        {fase !== 'resultado' && (
          <ReadingRitual
            pregunta={pregunta}
            onPreguntaChange={(v) => {
              setPregunta(v);
              if (validationMsg) setValidationMsg(null);
            }}
            cartas={cartas}
            fase={fase}
            validationMsg={validationMsg}
            onBarajar={handleBarajar}
            onRevelarCarta={handleRevelarCarta}
            onRevelarTodas={handleRevelarTodas}
          />
        )}

        {fase === 'resultado' && (
          <ReadingResult
            lectura={lecturaActual}
            cartas={cartas}
            apiError={apiError}
            isSaved={isSaved}
            onSaveToJournal={handleSaveToJournal}
            onExportPdf={printReadingPdf}
            onDownloadMarkdown={() => {
              if (lecturaActual) downloadReadingMarkdown(lecturaActual);
            }}
            onNewReading={handleNewReading}
            onFallbackLocal={() => {
              void ejecutarLectura(cartas, true);
            }}
          />
        )}

        <PrintableReading lectura={lecturaActual} />
      </main>

      <footer className="no-print border-t border-obsidianBorder/60 py-5 text-center text-xs text-muted">
        <p>
          <span className="font-mono text-gold">Noruf_Labs</span> · Oráculo de la Psique v2.0 ·
          Procesamiento local en tu navegador
        </p>
      </footer>

      <JournalDrawer
        isOpen={isJournalOpen}
        entries={journal}
        onClose={() => setIsJournalOpen(false)}
        onSelectEntry={handleSelectJournalEntry}
        onDeleteEntry={(id) => setJournal(deleteJournalEntry(id))}
        onClearAll={() => {
          clearJournal();
          setJournal([]);
        }}
        onExportAll={() => downloadJournalMarkdown(journal)}
      />

      <ApiKeyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

export default App;
