// Ecuación revisada de levantamiento de NIOSH (unidades métricas), tal como la presenta la guía (Tabla 17).
// FM y CM se fijan en 1,00 (frecuencia ocasional y buen agarre), como en el ejemplo de la Tabla 18.
import type { NioshInput } from '../../state/store';

export const LC = 23;
/** Rangos de validez usados por la calculadora (fuera de ellos la ecuación no aplica). */
export const NIOSH_RANGES = {
  H: [25, 63],
  V: [0, 175],
  D: [25, 175],
  A: [0, 135],
  weight: [1, 40],
} as const;

export interface NioshResult {
  HM: number;
  VM: number;
  DM: number;
  AM: number;
  FM: number;
  CM: number;
  RWL: number;
  LI: number;
}

export function niosh(input: NioshInput): NioshResult {
  const HM = Math.min(1, 25 / input.H);
  const VM = 1 - 0.003 * Math.abs(input.V - 75);
  const DM = Math.min(1, 0.82 + 4.5 / input.D);
  const AM = 1 - 0.0032 * input.A;
  const FM = 1;
  const CM = 1;
  const RWL = LC * HM * VM * DM * AM * FM * CM;
  return { HM, VM, DM, AM, FM, CM, RWL, LI: input.weight / RWL };
}

/** Interpretación del índice según la guía: > 1 puede suponer riesgo; > 3 alto riesgo. */
export function liLevel(li: number): 'ok' | 'risk' | 'high' {
  if (li <= 1) return 'ok';
  return li > 3 ? 'high' : 'risk';
}

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('es-ES', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
