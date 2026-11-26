// Línea de tiempo de la demo de carga unitaria (compartida entre 3D y la pizarra). Valores didácticos.
export const UNIT_LOAD = {
  boxes: 18, // 3 capas × (3 × 2) cajas sobre un pallet europeo 1200 × 800 mm
  firstStart: 0.9,
  interval: 0.3,
  flight: 0.55,
  wrapStart: 7.0,
  wrapDuration: 1.8,
} as const;

export function boxStart(i: number): number {
  return UNIT_LOAD.firstStart + i * UNIT_LOAD.interval;
}

export function landedCount(t: number): number {
  let n = 0;
  for (let i = 0; i < UNIT_LOAD.boxes; i++) if (t >= boxStart(i) + UNIT_LOAD.flight) n++;
  return n;
}

export function wrapProgress(t: number): number {
  return Math.min(1, Math.max(0, (t - UNIT_LOAD.wrapStart) / UNIT_LOAD.wrapDuration));
}

export function unitLoadDone(t: number): boolean {
  return t >= UNIT_LOAD.wrapStart + UNIT_LOAD.wrapDuration + 0.2;
}
