// Modelo cinemático didáctico del transportador: tramo motorizado + tramo por gravedad con acumulación.
// No es una simulación industrial validada; solo reproduce el comportamiento cualitativo descrito en la guía
// (velocidad ajustable, acumulación, una falla del motor detiene la entrada a la línea).

export interface ConveyorConfig {
  poweredLength: number;
  gravityLength: number;
  boxLength: number;
  /** Separación mínima entre centros de cajas acumuladas. */
  spacingMin: number;
  /** Separación con la que entran las cajas a la línea. */
  spawnGap: number;
  /** Velocidad aproximada de las cajas en el tramo por gravedad (no depende del motor). */
  gravitySpeed: number;
  /** Tiempo que la caja espera en el tope antes de que se retire. */
  dwell: number;
  maxBoxes: number;
}

export interface SimBox {
  id: number;
  /** Posición a lo largo del recorrido (m). */
  s: number;
  age: number;
  atEnd: number;
  /** > 0 mientras la caja se retira del tope. */
  pick: number;
}

export interface SimState {
  boxes: SimBox[];
  nextId: number;
}

export const DEFAULT_CONVEYOR: ConveyorConfig = {
  poweredLength: 17,
  gravityLength: 5.5,
  boxLength: 0.5,
  spacingMin: 0.56,
  spawnGap: 1.7,
  gravitySpeed: 0.6,
  dwell: 2.2,
  maxBoxes: 40,
};

export const PICK_TIME = 0.7;

export function createSim(): SimState {
  return { boxes: [], nextId: 1 };
}

export function endStop(cfg: ConveyorConfig): number {
  return cfg.poweredLength + cfg.gravityLength - cfg.boxLength / 2 - 0.04;
}

export function stepConveyor(state: SimState, dt: number, speed: number, running: boolean, cfg: ConveyorConfig = DEFAULT_CONVEYOR): SimState {
  const sMax = endStop(cfg);
  const boxes = state.boxes.sort((a, b) => b.s - a.s);
  let aheadS: number | null = null;
  for (const b of boxes) {
    b.age += dt;
    if (b.pick > 0) {
      b.pick += dt;
      continue;
    }
    const limit = aheadS === null ? sMax : aheadS - cfg.spacingMin;
    const v = b.s < cfg.poweredLength ? (running ? speed : 0) : cfg.gravitySpeed;
    const next = Math.min(b.s + v * dt, limit);
    if (next > b.s) b.s = next;
    if (b.s >= sMax - 1e-3) {
      b.atEnd += dt;
      if (b.atEnd >= cfg.dwell) b.pick = 1e-6;
    }
    aheadS = b.s;
  }
  state.boxes = boxes.filter((b) => b.pick < PICK_TIME);

  const tail = state.boxes.length ? Math.min(...state.boxes.map((b) => b.s)) : Infinity;
  if (running && speed > 0 && tail >= cfg.spawnGap && state.boxes.length < cfg.maxBoxes) {
    state.boxes.push({ id: state.nextId++, s: 0, age: 0, atEnd: 0, pick: 0 });
  }
  return state;
}

/** ¿Hay una caja sobre el sensor ubicado en la posición `sensorS`? */
export function sensorBlocked(state: SimState, sensorS: number, cfg: ConveyorConfig = DEFAULT_CONVEYOR): boolean {
  return state.boxes.some((b) => b.pick === 0 && Math.abs(b.s - sensorS) < cfg.boxLength / 2);
}

/** Cajas detenidas en el tramo de acumulación. */
export function accumulatedCount(state: SimState, cfg: ConveyorConfig = DEFAULT_CONVEYOR): number {
  return state.boxes.filter((b) => b.pick === 0 && b.s >= cfg.poweredLength).length;
}
