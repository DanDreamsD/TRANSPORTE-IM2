// Bloques visuales específicos (diagramas e indicadores sincronizados con las demos).
import type { CustomBlockId } from '../../content/types';
import { usePresentation } from '../../state/store';
import { SCENES } from '../../content/sceneRegistry';
import { useDemoTimeDom } from '../../world/demos/demoClock';
import { landedCount, UNIT_LOAD, unitLoadDone } from '../../world/demos/unitLoadTimeline';
import { activeMechLevel, MECH_LEVELS } from '../../world/demos/mechanizationTimeline';
import { fmt, liLevel, niosh } from '../../world/demos/nioshCalc';
import { agvAt } from '../../world/demos/AgvAmrDemo';
import { ALTERNATIVES, payback, TABLE24, weightedScores, weightSum, winner } from '../../world/demos/decisionCalc';
import { CashFlowChart } from './Charts';
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
    { name: 'Rodillos motorizados', sub: running ? `${speed.toLocaleString('es-ES', { maximumFractionDigits: 1 })} m/s` : '0 m/s', tone: 'base' },
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

/** Calculadora NIOSH en vivo (los valores se ajustan desde el panel de la demo). */
function NioshCalc() {
  const input = usePresentation((s) => s.demo.niosh);
  const r = niosh(input);
  const level = liLevel(r.LI);
  const isExample = input.weight === 15 && input.H === 40 && input.V === 60 && input.D === 40 && input.A === 0;
  const rows: [string, string, string][] = [
    ['HM', `25 ÷ ${input.H}`, fmt(r.HM, 3)],
    ['VM', `1 − 0,003 × |${input.V} − 75|`, fmt(r.VM, 3)],
    ['DM', `0,82 + 4,5 ÷ ${input.D}`, fmt(r.DM, 3)],
    ['AM', `1 − 0,0032 × ${input.A}`, fmt(r.AM, 3)],
    ['FM · CM', 'ocasional · buen agarre', '1,00'],
  ];
  return (
    <div className="blk niosh-calc">
      <div className="nc-grid">
        <table>
          <tbody>
            {rows.map(([k, f, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{f}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`nc-result nc-result--${level}`}>
          <div>
            <span>RWL</span>
            <strong>{fmt(r.RWL, 1)} kg</strong>
          </div>
          <div>
            <span>LI = {input.weight} ÷ RWL</span>
            <strong>{fmt(r.LI, 2)}</strong>
          </div>
          <em>{level === 'ok' ? 'LI ≤ 1: dentro del límite' : level === 'risk' ? 'LI > 1: puede suponer riesgo' : 'LI > 3: alto riesgo'}</em>
        </div>
      </div>
      <span className="data-tag-row">
        <span className={`data-tag data-tag--${isExample ? 'hypothetical' : 'synthesis'}`}>{isExample ? 'Ejemplo hipotético' : 'Cálculo con valores ajustados'}</span>
        <span className="data-source">{isExample ? 'Tabla 18 de la guía' : 'ecuación de la Tabla 17'}</span>
      </span>
    </div>
  );
}

/** Comparación AGV/AMR (Tabla 16) con el estado de la demo. */
function AgvAmrCompare() {
  const active = usePresentation((s) => s.view === '3d' && (SCENES[s.index]?.animations.includes('agv-amr') ?? false));
  const t = useDemoTimeDom(active);
  const phase = active ? agvAt(t).phase : 'moving';
  return (
    <div className="blk agv-amr">
      <div className={`aa-card ${phase === 'stopped' ? 'is-stopped' : ''}`}>
        <h3>AGV</h3>
        <ul>
          <li>Sigue rutas definidas con infraestructura instalada</li>
          <li>Decisiones centralizadas</li>
          <li>Cambiar la ruta exige modificar la infraestructura</li>
        </ul>
        <span className="aa-status">{phase === 'stopped' ? '● Detenido ante el obstáculo' : '● Siguiendo la cinta'}</span>
      </div>
      <div className="aa-card aa-card--amr">
        <h3>AMR</h3>
        <ul>
          <li>Navega sin infraestructura previa</li>
          <li>Decisiones descentralizadas</li>
          <li>Reacciona al entorno dinámico</li>
        </ul>
        <span className="aa-status">● Replanifica la ruta</span>
      </div>
      <span className="data-tag-row">
        <span className="data-tag data-tag--literature">Literatura</span>
        <span className="data-source">Tabla 16 · Keith y La (2024); Fragapane et al. (2021)</span>
        <span className="demo-badge">Demostración didáctica</span>
      </span>
    </div>
  );
}

/** Esquema ilustrativo: distribución en espina frente a una sin canal central (sin cifras). */
function LayoutCompare() {
  const deps = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <div className="blk layout-cmp">
      <figure>
        <svg viewBox="0 0 300 170" role="img" aria-label="Distribución en espina">
          <rect x="10" y="74" width="280" height="22" rx="4" className="lc-spine" />
          {deps.map((d, i) => {
            const x = 22 + (i % 3) * 92;
            const top = i < 3;
            const y = top ? 14 : 112;
            return (
              <g key={d}>
                <rect x={x} y={y} width="72" height="44" rx="6" className="lc-dep" />
                <text x={x + 36} y={y + 27} textAnchor="middle" className="lc-txt">{d}</text>
                <line x1={x + 36} y1={top ? y + 44 : y} x2={x + 36} y2={top ? 74 : 96} className="lc-flow" />
              </g>
            );
          })}
          <line x1="16" y1="85" x2="284" y2="85" className="lc-flow lc-flow--main" />
        </svg>
        <figcaption>
          <b>En espina</b> · un canal central concentra el flujo; cada área entra y sale por él
        </figcaption>
      </figure>
      <figure>
        <svg viewBox="0 0 300 170" role="img" aria-label="Distribución sin canal central">
          {[
            [20, 14], [210, 112], [116, 112], [210, 14], [20, 112], [116, 14],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="72" height="44" rx="6" className="lc-dep" />
              <text x={x + 36} y={y + 27} textAnchor="middle" className="lc-txt">{deps[i]}</text>
            </g>
          ))}
          <polyline points="56,58 246,112 152,112 246,58 56,112 152,58" className="lc-flow lc-flow--bad" />
        </svg>
        <figcaption>
          <b>Sin canal central</b> · recorridos que se cruzan y retroceden
        </figcaption>
      </figure>
      <span className="data-tag-row">
        <span className="data-tag data-tag--synthesis">Esquema ilustrativo</span>
        <span className="data-source">a partir de Muther (1973) y Tompkins et al. (2010), citados en la guía</span>
      </span>
    </div>
  );
}

/** Puntuación ponderada en vivo (Tabla 24); los pesos se ajustan desde el panel de la demo. */
function WeightedScoring() {
  const w = usePresentation((s) => s.demo.weights);
  const scores = weightedScores(w);
  const best = winner(scores);
  const total = weightSum(w);
  const isTable24 = w.cost === 30 && w.flex === 25 && w.capacity === 20 && w.safety === 15 && w.maintenance === 10;
  const f = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="blk wscore">
      <table>
        <thead>
          <tr>
            <th>Criterio</th>
            <th>Peso</th>
            {ALTERNATIVES.map((a, i) => (
              <th key={a} className={i === best ? 'is-best' : ''}>{a}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE24.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              <td>{Math.round((w[row.key] / (total || 1)) * 100)} %</td>
              {row.scores.map((s, i) => (
                <td key={i} className={i === best ? 'is-best' : ''}>{s}</td>
              ))}
            </tr>
          ))}
          <tr className="wscore-total">
            <td>Puntaje ponderado</td>
            <td>100 %</td>
            {scores.map((s, i) => (
              <td key={i} className={i === best ? 'is-best' : ''}>
                {f(s)}
                <span className="wscore-bar" style={{ width: `${(s / 5) * 100}%` }} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <span className="data-tag-row">
        <span className={`data-tag data-tag--${isTable24 ? 'hypothetical' : 'synthesis'}`}>{isTable24 ? 'Ejemplo hipotético' : 'Pesos ajustados (sensibilidad)'}</span>
        <span className="data-source">Tabla 24 de la guía{isTable24 ? '' : ' · cálculo con las calificaciones de la tabla'}</span>
      </span>
    </div>
  );
}

/** Pesos AHP (Tabla 31) y ranking MOORA del caso 5. */
const AHP: [string, string, number][] = [
  ['Costo', 'Costo', 0.272],
  ['Facilidad de operación', 'Beneficio', 0.2],
  ['Riesgo', 'Costo', 0.137],
  ['Aplicación', 'Beneficio', 0.095],
  ['Capacidad de carga', 'Beneficio', 0.082],
];
const MOORA = ['Transpaleta manual', 'Transpaleta hidráulica', 'Semieléctrica', 'Hidráulica manual', 'Eléctrica (no recomendada)'];

function AhpWeights() {
  return (
    <div className="blk ahp">
      <div>
        <h3 className="blk-title">
          <span className="blk-label">Tabla 31</span> Pesos AHP (5 de 11 criterios)
        </h3>
        {AHP.map(([name, type, wgt]) => (
          <div className="ahp-row" key={name}>
            <span className="ahp-name">
              {name} <small>{type}</small>
            </span>
            <span className="ahp-track">
              <span className={`ahp-bar ${type === 'Costo' ? 'is-cost' : ''}`} style={{ width: `${(wgt / 0.3) * 100}%` }} />
            </span>
            <b>{wgt.toLocaleString('es-ES', { minimumFractionDigits: 3 })}</b>
          </div>
        ))}
      </div>
      <div>
        <h3 className="blk-title">Ranking MOORA</h3>
        <ol className="ahp-rank">
          {MOORA.map((m, i) => (
            <li key={m} className={i === 0 ? 'is-first' : i === MOORA.length - 1 ? 'is-last' : ''}>{m}</li>
          ))}
        </ol>
      </div>
      <span className="data-tag-row">
        <span className="data-tag data-tag--case">Caso real</span>
        <span className="data-source">Satoglu y Türkekul (2021) · pesos leídos de una figura del artículo</span>
      </span>
    </div>
  );
}

/** Flujo de caja acumulado (Figura 16) con PRI y ROI en vivo. */
function CashFlow({ compact }: { compact: boolean }) {
  const e = usePresentation((s) => s.demo.econ);
  const { pri, roi } = payback(e);
  const isTable26 = e.investment === 120000 && e.saving === 40000;
  return (
    <div className="blk cashflow">
      <div className="cf-kpis">
        <div>
          <span>PRI</span>
          <strong>{pri.toLocaleString('es-ES', { maximumFractionDigits: 1 })} años</strong>
        </div>
        <div>
          <span>ROI</span>
          <strong>{(roi * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })} % anual</strong>
        </div>
      </div>
      <CashFlowChart econ={e} compact={compact} />
      <span className="data-tag-row">
        <span className={`data-tag data-tag--${isTable26 ? 'hypothetical' : 'synthesis'}`}>{isTable26 ? 'Ejemplo hipotético' : 'Valores ajustados'}</span>
        <span className="data-source">Tabla 26 · Figura 16 de la guía</span>
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
    case 'niosh-calc':
      return <NioshCalc />;
    case 'agv-amr-compare':
      return <AgvAmrCompare />;
    case 'layout-compare':
      return <LayoutCompare />;
    case 'weighted-scoring':
      return <WeightedScoring />;
    case 'ahp-weights':
      return <AhpWeights />;
    case 'cash-flow':
      return <CashFlow compact={variant === 'board'} />;
  }
}
