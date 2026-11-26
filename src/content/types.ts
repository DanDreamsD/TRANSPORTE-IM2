// Tipos del modelo de datos de la presentación.
// Las escenas son DATOS: el motor no necesita cambios para agregar, quitar o reordenar escenas.
import type { ReferenceId } from './references';

export type Vec3 = readonly [number, number, number];

export type PresenterId = 'equipo' | 'felipe' | 'carlos' | 'vane' | 'nicole' | 'wilson';

export type ZoneId =
  | 'overview'
  | 'rec'
  | 'mp'
  | 'prep'
  | 'proc'
  | 'man'
  | 'line'
  | 'spine'
  | 'asrs'
  | 'pt'
  | 'desp'
  | 'eng'
  | 'meet';

/** Identificadores de demostraciones animadas (ver src/world/demos). */
export type AnimationId =
  | 'material-flow'
  | 'unit-load'
  | 'conveyor'
  | 'truck-unload'
  | 'tugger'
  | 'dynea-rack'
  | 'conveyor-failure'
  | 'agv-seats'
  | 'cabinet-loading'
  | 'weighted-scoring'
  | 'workshop-symptoms'
  // Planificadas (aún sin implementación; se ignoran si no existen):
  | 'mechanization-levels'
  | 'pallet-sizes'
  | 'cranes'
  | 'forklift'
  | 'agv-amr'
  | 'robot-arm'
  | 'niosh-lift'
  | 'asrs'
  | 'layout-compare'
  | 'flow-distance'
  | 'economics';

/**
 * Naturaleza del dato (regla académica): permite distinguir datos reales de ejemplos hipotéticos.
 * course = diapositivas del curso; literature = fuente publicada;
 * case = resultado de investigación real; hypothetical = ejemplo didáctico inventado por la guía;
 * synthesis = interpretación o síntesis de los autores de la guía.
 */
export type DataKind = 'course' | 'literature' | 'case' | 'hypothetical' | 'synthesis';

interface BlockBase {
  dataKind?: DataKind;
  /** Cita corta visible, p. ej. «Tompkins et al. (2010)». */
  source?: string;
}

export interface LeadBlock extends BlockBase {
  kind: 'lead';
  text: string;
}

export interface DefinitionBlock extends BlockBase {
  kind: 'definition';
  term: string;
  text: string;
}

export interface BulletsBlock extends BlockBase {
  kind: 'bullets';
  title?: string;
  items: string[];
  columns?: 1 | 2;
  ordered?: boolean;
}

export interface TableBlock extends BlockBase {
  kind: 'table';
  /** «Tabla 8» */
  label?: string;
  title?: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface FormulaBlock extends BlockBase {
  kind: 'formula';
  tex: string;
  caption?: string;
}

export interface StatsBlock extends BlockBase {
  kind: 'stats';
  title?: string;
  items: { value: string; label: string }[];
}

export interface CalloutBlock extends BlockBase {
  kind: 'callout';
  variant: 'idea' | 'expo' | 'case' | 'limit';
  title?: string;
  text: string;
}

export interface FigureBlock extends BlockBase {
  kind: 'figure';
  /** «Figura 6» */
  label: string;
  title: string;
  /** Ruta relativa a public/, p. ej. figures/fig06.png */
  src: string;
  note?: string;
}

export interface BarChartBlock extends BlockBase {
  kind: 'chart';
  chart: 'before-after';
  title: string;
  unit: string;
  data: { label: string; before: number; after: number }[];
  beforeLabel: string;
  afterLabel: string;
  note?: string;
}

export type CustomBlockId =
  | 'team-roster'
  | 'pallet-sizes'
  | 'unit-load-counter'
  | 'conveyor-anatomy'
  | 'cost-ranges'
  | 'principles-grid'
  | 'material-flow-types'
  | 'mechanization-levels'
  | 'family-comparison'
  | 'agv-payback'
  | 'niosh-calc'
  | 'agv-amr-compare'
  | 'layout-compare'
  | 'weighted-scoring'
  | 'ahp-weights'
  | 'cash-flow';

export interface CustomBlock extends BlockBase {
  kind: 'custom';
  component: CustomBlockId;
}

export interface ColumnsBlock {
  kind: 'columns';
  columns: ContentBlock[][];
  /** Proporciones relativas, p. ej. [3, 2] */
  ratio?: number[];
}

export type ContentBlock =
  | LeadBlock
  | DefinitionBlock
  | BulletsBlock
  | TableBlock
  | FormulaBlock
  | StatsBlock
  | CalloutBlock
  | FigureBlock
  | BarChartBlock
  | CustomBlock
  | ColumnsBlock;

export interface CameraShot {
  position: Vec3;
  target: Vec3;
  /** Campo de visión vertical en grados. */
  fov: number;
  /** Duración base de la transición hacia esta escena, en segundos. */
  duration: number;
  /** Puntos intermedios opcionales para recorridos complejos (evitan atravesar sólidos). */
  waypoints?: Vec3[];
  /** Fuerza una ruta directa (sin arco automático) cuando se sabe que no hay obstáculos. */
  direct?: boolean;
}

export interface BoardPlacement {
  position: Vec3;
  /** Ancho en metros; la altura se deriva de la relación 16:9 salvo que se indique. */
  width: number;
  height?: number;
  /** Rotación alrededor de Y en radianes. Si se omite, la pizarra mira hacia la cámara de la escena. */
  rotationY?: number;
  style: 'whiteboard' | 'screen';
  /** Ancho del contenido HTML en píxeles CSS (por defecto 1040). Mayor valor = texto relativamente más pequeño. */
  pxWidth?: number;
  /** Soporte: patas (pizarra móvil), colgada de la estructura o montada en muro. */
  mount?: 'stand' | 'hanging' | 'wall';
}

export interface SceneDef {
  id: string;
  chapter: { number: string; title: string };
  subchapter?: { number: string; title: string };
  presenter: PresenterId;
  title: string;
  /** Ubicación dentro de la fábrica. */
  zone: ZoneId;
  camera: CameraShot;
  /** Dónde aparece el contenido en el entorno. Si se omite, el contenido solo se ve en el panel frontal. */
  board?: BoardPlacement;
  /** Contenido integrado en el entorno (ideas clave, visual). */
  boardBlocks: ContentBlock[];
  /** Contenido complementario (detalle) para el panel ampliado y el modo 2D. */
  detailBlocks?: ContentBlock[];
  animations: AnimationId[];
  references: ReferenceId[];
  /** Notas del expositor. */
  notes?: string;
  /** Tarjeta de portada superpuesta (solo para escenas de portada/cierre). */
  cover?: boolean;
  /** Tarjeta de cierre superpuesta (preguntas y agradecimiento). */
  closing?: boolean;
}
