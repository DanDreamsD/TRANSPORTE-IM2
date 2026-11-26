// Bloques visuales específicos (diagramas e indicadores sincronizados con las demos).
import type { CustomBlockId } from '../../content/types';
import { usePresentation } from '../../state/store';
import { SCENES } from '../../content/sceneRegistry';
import { useDemoTimeDom } from '../../world/demos/demoClock';
import { landedCount, UNIT_LOAD, unitLoadDone } from '../../world/demos/unitLoadTimeline';
import { activeMechLevel, MECH_LEVELS } from '../../world/demos/mechanizationTimeline';
import type { BlockVariant } from './BlockRenderer';
import { AgvPaybackChart } from './Charts';

function DemoBadge() {
  return <span className="demo-badge">Demostración didáctica</span>;
}

/** Contador sincronizado con la demo de carga unitaria: cajas sueltas → una sola carga. */
function UnitLoadCounter() {
  const active = usePresentation((s) => s.view === '3d' && (SCENES[s.index]?.animations.includes('unit-load') ?? false));
  const t = useDemoTimeDom(active);
  const n = active ? landedCount(t) : UNIT_LOAD.boxes;
  const done = active ? unitLoadDone(t) : true;
  return (
    <div className="blk ul-counter">
      <div className="ul-counter__grid" aria-hidden>
        {Array.from({ length: UNIT_LOAD.boxes }, (_, i) => (
          <span key={i} className={i < n ? 'is-on' : ''} />
        ))}
      </div>
      <div className="ul-counter__text">
        {done ? (
          <>
            <strong>
              {UNIT_LOAD.boxes} cajas → <em>1 carga unitaria</em>
            </strong>
            <span>un solo objeto para el montacargas</span>
          </>
        ) : (
          <>
            <strong>
              {n} / {UNIT_LOAD.boxes} cajas
            </strong>
            <span>cada caja suelta es una manipulación</span>
          </>
        )}
      </div>
      <DemoBadge />
    </div>
  );
}

/** Esquema del transportador de la demo, con estado en vivo (velocidad y motor). */
function ConveyorAnatomy() {
  const speed = usePresentation((s) => s.demo.conveyorSpeed);
  const running = usePresentation((s) => s.demo.conveyorRunning);
  const parts = [
    { name: 'Motor-reductor', sub: running ? 'en marcha' : 'detenido', tone: running ? 'ok' : 'danger' },
    { name: 'Rodillos motorizados', sub: running ? `${speed.toLocaleString('es-PE', { maximumFractionDigits: 1 })} m/s` : '0 m/s', tone: 'base' },
    { name: 'Sensor fotoeléctrico', sub: 'detecta la carga', tone: 'base' },
    { name: 'Rodillos por gravedad', sub: 'acumulación', tone: 'accent' },
  ];
  return (
    <div className="blk conveyor-anatomy">
      <div className="conveyor-anatomy__row">
        {parts.map((p, i) => (
          <div className="ca-part-wrap" key={p.name}>
            <div className={`ca-part ca-part--${p.tone}`}>
              <strong>{p.name}</strong>
              <span>{p.sub}</span>
            </div>
            {i < parts.length - 1 && <div className="ca-arrow">→</div>}
          </div>
        ))}
      </div>
      <DemoBadge />
    </div>
  );
}

/** Seis dimensiones principales de ISO 6780:2003 dibujadas a la misma escala (ver Figura 6 de la guía). */
const ISO_PALLETS = [
  { w: 1200, d: 800, label: '1200 × 800', sub: 'Europea' },
  { w: 1200, d: 1000, label: '1200 × 1000', sub: '' },
  { w: 1219, d: 1016, label: '1219 × 1016', sub: '48″ × 40″, EE. UU.' },
  { w: 1140, d: 1140, label: '1140 × 1140', sub: '' },
  { w: 1100, d: 1100, label: '1100 × 1100', sub: '' },
  { w: 1067, d: 1067, label: '1067 × 1067', sub: '42″ × 42″' },
];

function PalletSizes() {
  const s = 0.1;
  let x = 10;
  return (
    <div className="blk pallet-sizes">
      <svg viewBox="0 0 800 190" role="img" aria-label="Dimensiones de pallets ISO 6780 a escala">
        {ISO_PALLETS.map((p) => {
          const w = p.w * s;
          const h = p.d * s;
          const g = (
            <g key={p.label} transform={`translate(${x},${180 - h})`}>
              <rect width={w} height={h} rx="3" className="ps-rect" />
              <text x={w / 2} y={-22} textAnchor="middle" className="ps-label">
                {p.label}
              </text>
              {p.sub && (
                <text x={w / 2} y={-6} textAnchor="middle" className="ps-sub">
                  {p.sub}
                </text>
              )}
            </g>
          );
          x += w + 12;
          return g;
        })}
      </svg>
      <p className="blk-note">Dimensiones en mm, a la misma escala (ISO 6780:2003).</p>
    </div>
  );
}

/** Recreación de la Figura 2: cada fila usa una base distinta y no son comparables entre sí. */
const COST_RANGES = [
  { label: 'Costo de manejo / costo total del producto', src: 'Tompkins et al. (2010); Castañeda (2026)', min: 20, max: 50, text: '20–50 %', color: '#4f86c6' },
  { label: 'Manejo / costo de mano de obra de manufactura, EE. UU.', src: 'Groover (2008)', min: 20, max: 25, text: '20–25 %', color: '#1fa392' },
  { label: 'Manejo / costo total de fábrica, caso de estudio', src: 'Datar et al. (1991)', min: 10, max: 10, text: '≈10 %', color: '#f0a35e' },
  { label: 'Tiempo de manejo / tiempo global de las órdenes', src: 'Castañeda (2026)', min: 80, max: 95, text: '80–95 %', color: '#e5704f' },
];

function CostRanges() {
  return (
    <div className="blk cost-ranges">
      <h3 className="blk-title">
        <span className="blk-label">Figura 2</span> Rangos de costo y de tiempo según la fuente
      </h3>
      <div className="cr-rows">
        {COST_RANGES.map((r) => (
          <div className="cr-row" key={r.label}>
            <div className="cr-label">
              {r.label}
              <small>{r.src}</small>
            </div>
            <div className="cr-track">
              {[20, 40, 60, 80].map((g) => (
                <span key={g} className="cr-grid" style={{ left: `${g}%` }} />
              ))}
              {r.min === r.max ? (
                <span className="cr-dot" style={{ left: `${r.min}%`, background: r.color }} />
              ) : (
                <span className="cr-bar" style={{ left: `${r.min}%`, width: `${r.max - r.min}%`, background: r.color }} />
              )}
              <span className={`cr-value ${r.max > 70 ? 'cr-value--inside' : ''}`} style={{ left: `${r.max > 70 ? r.min : r.max}%`, color: r.color }}>
                {r.text}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="blk-note">Cada fila usa una base distinta (costo del producto, mano de obra, fábrica, tiempo): no se comparan entre sí.</p>
    </div>
  );
}

/** Los diez principios MHIA/CICMHE (resumen de la Figura 3, a partir de Heragu y Ekren, s. f.). */
const PRINCIPLES: [string, string][] = [
  ['Planeación', 'Qué, cuándo, dónde y quién'],
  ['Estandarización', 'Menos variedad, sin perder flexibilidad'],
  ['Trabajo', 'Minimizar flujo × distancia'],
  ['Ergonomía', 'Respetar las capacidades humanas'],
  ['Carga unitaria', 'Cargas del tamaño adecuado'],
  ['Uso del espacio', 'Densidad frente a accesibilidad'],
  ['Sistema', 'Movimiento, almacén e información'],
  ['Automatización', 'Mecanizar donde sea viable'],
  ['Ambiente', 'Energía, reuso, materiales peligrosos'],
  ['Ciclo de vida', 'Todos los costos hasta el reemplazo'],
];
const PRINCIPLE_COLORS = ['#1f3a5f', '#3b84c6', '#1a9a8a', '#2a9a88', '#6c5a7a', '#d98a45', '#e2704f', '#1f3a5f', '#1a9a8a', '#3b84c6'];

function PrinciplesGrid() {
  return (
    <div className="blk principles-grid">
      {PRINCIPLES.map(([name, idea], i) => (
        <div className={`pg-card ${name === 'Trabajo' ? 'is-key' : ''}`} key={name} style={{ ['--pc' as string]: PRINCIPLE_COLORS[i] }}>
          <div className="pg-head">
            <span>{i + 1}</span>
            {name}
          </div>
          <div className="pg-idea">{idea}</div>
        </div>
      ))}
      <p className="blk-note pg-note">Síntesis de la Figura 3 a partir de Heragu y Ekren (s. f.). Destacado: el principio más cuantificable.</p>
    </div>
  );
}

/** Dos familias de flujo según la naturaleza del material (Kay, s. f.). */
function MaterialFlowTypes() {
  return (
    <div className="blk flow-types">
      <div className="ft-card">
        <div className="ft-icon ft-icon--discrete" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>Flujo discreto</strong>
          <span>ítems individuales y contenedorizados → cargas unitarias → equipo de manejo unitario</span>
        </div>
      </div>
      <div className="ft-card">
        <div className="ft-icon ft-icon--bulk" aria-hidden />
        <div>
          <strong>Flujo continuo</strong>
          <span>materiales a granel → equipo de manejo a granel</span>
        </div>
      </div>
      <span className="data-tag-row">
        <span className="data-tag data-tag--literature">Literatura</span>
        <span className="data-source">Kay (s. f.)</span>
      </span>
    </div>
  );
}

/** Escalera de la Figura 5, sincronizada con la demo: resalta el grado que se ilumina en la planta. */
function MechanizationLevels() {
  const active = usePresentation((s) => s.view === '3d' && (SCENES[s.index]?.animations.includes('mechanization-levels') ?? false));
  const t = useDemoTimeDom(active);
  const current = active ? activeMechLevel(t) : -1;
  return (
    <div className="blk mech-levels">
      <div className="ml-arrow">Más inversión · más velocidad · más control · menos flexibilidad →</div>
      <div className="ml-steps">
        {MECH_LEVELS.map((l, i) => (
          <div
            key={l.name}
            className={`ml-step ${current === i ? 'is-active' : ''}`}
            style={{ ['--lc' as string]: l.color, ['--lt' as string]: l.text, ['--h' as string]: `${46 + i * 13}%` }}
          >
            <div className="ml-name">
              {i + 1} · {l.name}
            </div>
            <div className="ml-bar">
              <span>{l.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <span className="data-tag-row">
        <span className="data-tag data-tag--course">Curso</span>
        <span className="data-source">Figura 5 · Castañeda (2026)</span>
      </span>
    </div>
  );
}

/** Recreación de la Figura 8 (valoración cualitativa de los autores de la guía). */
const FAMILY_ROWS: [string, string, string, string][] = [
  ['Flexibilidad de ruta', 'Baja', 'Baja', 'Alta'],
  ['Capacidad por viaje', 'Alta', 'Media', 'Baja'],
  ['Cargas pesadas', 'Media', 'Alta', 'Baja'],
  ['Ahorro de piso', 'Media', 'Alta', 'Baja'],
  ['Combina manejo y proceso', 'Sí', 'No', 'No'],
  ['Requiere operario', 'Bajo', 'Alto', 'Alto'],
  ['Inversión inicial', 'Media', 'Alta', 'Media'],
];
const GOOD: Record<string, string[]> = {
  'Requiere operario': ['Bajo'],
  'Inversión inicial': [],
};
function tone(row: string, value: string): 'good' | 'mid' | 'bad' {
  if (value === 'Media') return 'mid';
  if (row in GOOD) return GOOD[row].includes(value) ? 'good' : 'bad';
  return value === 'Alta' || value === 'Sí' ? 'good' : 'bad';
}

function FamilyComparison() {
  return (
    <div className="blk family-cmp">
      <h3 className="blk-title">
        <span className="blk-label">Figura 8</span> Comparación cualitativa
      </h3>
      <table>
        <thead>
          <tr>
            <th />
            <th>Transportadores</th>
            <th>Grúas</th>
            <th>Transportes</th>
          </tr>
        </thead>
        <tbody>
          {FAMILY_ROWS.map(([row, ...vals]) => (
            <tr key={row}>
              <td>{row}</td>
              {vals.map((v, i) => (
                <td key={i} className={`fc-${tone(row, v)}`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="data-tag-row">
        <span className="data-tag data-tag--synthesis">Síntesis de los autores</span>
        <span className="data-source">a partir de Castañeda (2026) y Heragu y Ekren (s. f.)</span>
      </span>
    </div>
  );
}

function AgvPayback({ compact }: { compact: boolean }) {
  return (
    <div className="blk">
      <h3 className="blk-title">
        <span className="blk-label">Figura 19</span> Recuperación de la inversión en AGV
      </h3>
      <AgvPaybackChart compact={compact} />
      <p className="blk-note">Cálculo simple: 49 000 ÷ 79 200 = 0,62 años ≈ 7,4 meses; los autores reportan cerca de 8. No incluye otros costos de operación de los AGV.</p>
      <span className="data-tag-row">
        <span className="data-tag data-tag--case">Caso real</span>
        <span className="data-source">Kubasáková et al. (2024), Tabla 30</span>
      </span>
    </div>
  );
}

export function CustomBlockView({ id, variant }: { id: CustomBlockId; variant: BlockVariant }) {
  switch (id) {
    case 'unit-load-counter':
      return <UnitLoadCounter />;
    case 'conveyor-anatomy':
      return <ConveyorAnatomy />;
    case 'pallet-sizes':
      return <PalletSizes />;
    case 'cost-ranges':
      return <CostRanges />;
    case 'principles-grid':
      return <PrinciplesGrid />;
    case 'material-flow-types':
      return <MaterialFlowTypes />;
    case 'mechanization-levels':
      return <MechanizationLevels />;
    case 'family-comparison':
      return <FamilyComparison />;
    case 'agv-payback':
      return <AgvPayback compact={variant === 'board'} />;
  }
}
