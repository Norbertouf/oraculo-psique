import React from 'react';

interface TarotCardSvgProps {
  simbolo: string;
  numeroRomano: string;
  nombre: string;
  arquetipo: string;
  invertida: boolean;
  revelada: boolean;
  posicion: string;
  onClick?: () => void;
}

function renderArcanaGlyph(simbolo: string): React.ReactNode {
  switch (simbolo) {
    case 'fool':
      return (
        <g>
          <circle cx="60" cy="64" r="22" strokeDasharray="3 3" />
          <path d="M40 94 L60 46 L80 94" />
          <circle cx="60" cy="36" r="5" fill="#D4AF37" />
        </g>
      );
    case 'magician':
      return (
        <g>
          <path d="M42 42 C42 32, 58 32, 60 42 C62 52, 78 52, 78 42 C78 32, 62 32, 60 42 C58 52, 42 52, 42 42 Z" />
          <line x1="60" y1="58" x2="60" y2="106" />
          <polygon points="60,64 74,82 60,100 46,82" />
        </g>
      );
    case 'priestess':
      return (
        <g>
          <path d="M44 40 A24 24 0 1 0 44 96 A18 18 0 1 1 44 40 Z" />
          <circle cx="66" cy="68" r="10" />
          <line x1="30" y1="36" x2="30" y2="104" />
          <line x1="90" y1="36" x2="90" y2="104" />
        </g>
      );
    case 'empress':
      return (
        <g>
          <circle cx="60" cy="60" r="18" />
          <line x1="60" y1="78" x2="60" y2="106" />
          <line x1="46" y1="92" x2="74" y2="92" />
          <path d="M42 36 L52 44 L60 32 L68 44 L78 36" />
        </g>
      );
    case 'emperor':
      return (
        <g>
          <rect x="38" y="44" width="44" height="44" />
          <line x1="60" y1="32" x2="60" y2="104" />
          <line x1="32" y1="66" x2="88" y2="66" />
          <circle cx="60" cy="66" r="7" fill="#D4AF37" />
        </g>
      );
    case 'hierophant':
      return (
        <g>
          <line x1="60" y1="30" x2="60" y2="108" />
          <line x1="46" y1="44" x2="74" y2="44" />
          <line x1="40" y1="58" x2="80" y2="58" />
          <line x1="48" y1="72" x2="72" y2="72" />
          <circle cx="60" cy="94" r="6" />
        </g>
      );
    case 'lovers':
      return (
        <g>
          <circle cx="48" cy="68" r="18" />
          <circle cx="72" cy="68" r="18" />
          <polygon points="60,30 68,44 52,44" fill="#D4AF37" />
        </g>
      );
    case 'chariot':
      return (
        <g>
          <polygon points="60,32 86,86 34,86" />
          <circle cx="38" cy="96" r="8" />
          <circle cx="82" cy="96" r="8" />
          <line x1="60" y1="32" x2="60" y2="96" />
        </g>
      );
    case 'strength':
      return (
        <g>
          <circle cx="60" cy="70" r="22" />
          <path d="M46 42 C46 34, 58 34, 60 42 C62 50, 74 50, 74 42 C74 34, 62 34, 60 42 C58 50, 46 50, 46 42 Z" />
          <polygon points="60,56 70,76 50,76" />
        </g>
      );
    case 'hermit':
      return (
        <g>
          <polygon points="60,34 78,66 42,66" />
          <line x1="60" y1="66" x2="60" y2="104" />
          <circle cx="60" cy="54" r="5" fill="#D4AF37" />
          <line x1="48" y1="104" x2="72" y2="104" />
        </g>
      );
    case 'wheel':
      return (
        <g>
          <circle cx="60" cy="68" r="28" />
          <circle cx="60" cy="68" r="10" />
          <line x1="60" y1="40" x2="60" y2="96" />
          <line x1="32" y1="68" x2="88" y2="68" />
          <line x1="40" y1="48" x2="80" y2="88" />
          <line x1="80" y1="48" x2="40" y2="88" />
        </g>
      );
    case 'justice':
      return (
        <g>
          <line x1="60" y1="32" x2="60" y2="102" />
          <line x1="32" y1="50" x2="88" y2="50" />
          <path d="M32 50 L24 72 L40 72 Z" />
          <path d="M88 50 L80 72 L96 72 Z" />
          <line x1="44" y1="102" x2="76" y2="102" />
        </g>
      );
    case 'hanged':
      return (
        <g>
          <line x1="34" y1="36" x2="86" y2="36" />
          <line x1="60" y1="36" x2="60" y2="74" />
          <polygon points="60,100 44,74 76,74" />
          <circle cx="60" cy="84" r="5" fill="#D4AF37" />
        </g>
      );
    case 'death':
      return (
        <g>
          <path d="M32 92 L88 42" />
          <path d="M72 38 C86 38, 92 50, 88 64" />
          <circle cx="48" cy="54" r="10" />
          <line x1="32" y1="98" x2="88" y2="98" strokeDasharray="3 3" />
        </g>
      );
    case 'temperance':
      return (
        <g>
          <polygon points="60,34 82,74 38,74" />
          <polygon points="60,102 82,62 38,62" />
          <circle cx="60" cy="68" r="5" fill="#D4AF37" />
        </g>
      );
    case 'devil':
      return (
        <g>
          <polygon points="60,96 36,46 84,46" />
          <line x1="42" y1="34" x2="50" y2="46" />
          <line x1="78" y1="34" x2="70" y2="46" />
          <circle cx="60" cy="64" r="8" />
        </g>
      );
    case 'tower':
      return (
        <g>
          <rect x="44" y="54" width="32" height="50" />
          <polyline points="78,30 56,50 68,54 46,74" />
          <line x1="38" y1="54" x2="82" y2="54" />
        </g>
      );
    case 'star':
      return (
        <g>
          <polygon points="60,32 67,56 92,56 72,70 79,94 60,80 41,94 48,70 28,56 53,56" />
          <circle cx="60" cy="66" r="4" fill="#D4AF37" />
        </g>
      );
    case 'moon':
      return (
        <g>
          <path d="M68 38 A26 26 0 1 0 68 96 A20 20 0 1 1 68 38 Z" />
          <line x1="34" y1="102" x2="86" y2="102" />
          <line x1="40" y1="94" x2="80" y2="94" strokeDasharray="2 4" />
        </g>
      );
    case 'sun':
      return (
        <g>
          <circle cx="60" cy="68" r="16" />
          <circle cx="60" cy="68" r="5" fill="#D4AF37" />
          <line x1="60" y1="34" x2="60" y2="46" />
          <line x1="60" y1="90" x2="60" y2="102" />
          <line x1="26" y1="68" x2="38" y2="68" />
          <line x1="82" y1="68" x2="94" y2="68" />
          <line x1="36" y1="44" x2="45" y2="53" />
          <line x1="75" y1="83" x2="84" y2="92" />
          <line x1="84" y1="44" x2="75" y2="53" />
          <line x1="45" y1="83" x2="36" y2="92" />
        </g>
      );
    case 'judgement':
      return (
        <g>
          <polygon points="60,34 78,64 42,64" />
          <line x1="60" y1="64" x2="60" y2="102" />
          <line x1="40" y1="82" x2="80" y2="82" />
          <path d="M36 44 Q60 28 84 44" strokeDasharray="3 3" />
        </g>
      );
    case 'world':
    default:
      return (
        <g>
          <ellipse cx="60" cy="68" rx="22" ry="30" />
          <circle cx="60" cy="68" r="10" />
          <circle cx="34" cy="38" r="3" fill="#D4AF37" />
          <circle cx="86" cy="38" r="3" fill="#D4AF37" />
          <circle cx="34" cy="98" r="3" fill="#D4AF37" />
          <circle cx="86" cy="98" r="3" fill="#D4AF37" />
        </g>
      );
  }
}

export const TarotCardSvg: React.FC<TarotCardSvgProps> = ({
  simbolo,
  numeroRomano,
  nombre,
  arquetipo,
  invertida,
  revelada,
  posicion,
  onClick,
}) => {
  if (!revelada) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Revelar carta en posición ${posicion}`}
        className="group relative flex w-full max-w-[210px] flex-col items-center rounded-xl border border-gold/40 bg-obsidianLight p-3 text-center shadow-lg transition-all duration-200 hover:border-gold hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gold"
      >
        <span className="mb-2 text-[11px] font-mono uppercase tracking-wider text-gold/80">
          {posicion}
        </span>
        <svg
          viewBox="0 0 120 170"
          className="h-48 w-36 rounded-lg border border-gold/30 bg-obsidian"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.4"
        >
          <rect x="6" y="6" width="108" height="158" rx="4" strokeOpacity="0.45" />
          <rect x="12" y="12" width="96" height="146" rx="2" strokeDasharray="2 3" strokeOpacity="0.35" />
          <circle cx="60" cy="85" r="28" strokeOpacity="0.7" />
          <polygon points="60,49 90,101 30,101" strokeOpacity="0.65" />
          <polygon points="60,121 90,69 30,69" strokeOpacity="0.65" />
          <circle cx="60" cy="85" r="5" fill="#D4AF37" fillOpacity="0.8" />
        </svg>
        <span className="mt-2.5 text-xs font-medium text-gold-bright group-hover:underline">
          Tocar para revelar
        </span>
      </button>
    );
  }

  return (
    <div className="animate-card-reveal flex w-full max-w-[210px] flex-col items-center rounded-xl border border-gold/60 bg-obsidianLight p-3 text-center shadow-xl">
      <div className="mb-1.5 flex w-full items-center justify-between gap-1 text-[10px] font-mono uppercase tracking-wider">
        <span className="truncate text-muted">{posicion}</span>
        <span
          className={`rounded px-1.5 py-0.5 font-semibold ${
            invertida
              ? 'border border-amber-500/40 bg-amber-950/50 text-amber-300'
              : 'border border-gold/30 bg-gold/10 text-gold'
          }`}
        >
          {invertida ? 'INVERTIDA' : 'DERECHO'}
        </span>
      </div>

      <svg
        viewBox="0 0 120 170"
        className="h-48 w-36 rounded-lg border border-gold/50 bg-obsidian"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="5" width="110" height="160" rx="4" strokeOpacity="0.55" />
        <rect x="10" y="10" width="100" height="150" rx="2" strokeOpacity="0.25" />
        <g transform={invertida ? 'rotate(180 60 68)' : undefined}>
          {renderArcanaGlyph(simbolo)}
        </g>
        <text
          x="60"
          y="134"
          textAnchor="middle"
          fill="#D4AF37"
          stroke="none"
          fontSize="10"
          fontFamily="Georgia, serif"
          letterSpacing="1.5"
        >
          {numeroRomano}
        </text>
        <text
          x="60"
          y="150"
          textAnchor="middle"
          fill="#e6e4dc"
          stroke="none"
          fontSize="8.5"
          fontFamily="Georgia, serif"
        >
          {nombre.toUpperCase()}
        </text>
      </svg>

      <h3 className="mt-2 font-serif text-base font-semibold text-gold-bright">{nombre}</h3>
      <p className="text-xs italic text-muted">{arquetipo}</p>
    </div>
  );
};
