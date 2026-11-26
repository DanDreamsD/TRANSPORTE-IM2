// Cálculos de decisión (puros, testeables): puntuación ponderada (Tabla 24) e indicadores simples (Tabla 26).
import type { EconInput, ScoringWeights } from '../../state/store';

export const ALTERNATIVES = ['Transportador', 'Montacargas eléctrico', 'AGV'] as const;

/** Calificaciones 1–5 de la Tabla 24 (ejemplo hipotético de la guía). */
export const TABLE24: { key: keyof ScoringWeights; label: string; scores: [number, number, number] }[] = [
  { key: 'cost', label: 'Costo de inversión (5 = menor costo)', scores: [3, 4, 2] },
  { key: 'flex', label: 'Flexibilidad', scores: [2, 5, 4] },
  { key: 'capacity', label: 'Capacidad de flujo', scores: [5, 3, 4] },
  { key: 'safety', label: 'Seguridad', scores: [4, 3, 5] },
  { key: 'maintenance', label: 'Facilidad de mantenimiento', scores: [4, 4, 3] },
];

export function weightSum(w: ScoringWeights): number {
  return w.cost + w.flex + w.capacity + w.safety + w.maintenance;
}

/** Puntaje ponderado de cada alternativa. Los pesos se normalizan si no suman 100 %. */
export function weightedScores(w: ScoringWeights): [number, number, number] {
  const total = weightSum(w) || 1;
  const out: [number, number, number] = [0, 0, 0];
  TABLE24.forEach((row) => row.scores.forEach((s, i) => (out[i] += (w[row.key] / total) * s)));
  return out;
}

export function winner(scores: readonly number[]): number {
  return scores.indexOf(Math.max(...scores));
}

/** Periodo de recuperación (años) y rendimiento de la inversión (anual). */
export function payback(e: EconInput): { pri: number; roi: number } {
  return { pri: e.investment / e.saving, roi: e.saving / e.investment };
}

/** Flujo de caja acumulado por año (sin valor del dinero en el tiempo, como en la guía). */
export function cumulativeCashFlow(e: EconInput, years: number): { year: number; value: number }[] {
  return Array.from({ length: years + 1 }, (_, y) => ({ year: y, value: -e.investment + e.saving * y }));
}
