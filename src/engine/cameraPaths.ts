// Lógica pura de rutas de cámara (sin React), cubierta por pruebas unitarias.
import { CatmullRomCurve3, Vector3 } from 'three';
import type { Vec3 } from '../content/types';

/** Altura de crucero: por encima de los muros (10 m) y del AS/RS (12 m). */
export const CRUISE_ALTITUDE = 20;
/** Distancia horizontal a partir de la cual se usa un arco por la altura de crucero. */
export const ARC_THRESHOLD = 14;

export interface PathOptions {
  waypoints?: readonly Vec3[];
  direct?: boolean;
}

function horizontalDistance(a: Vec3, b: Vec3): number {
  return Math.hypot(b[0] - a[0], b[2] - a[2]);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Puntos de control de la ruta desde `from` hasta `to`.
 * - Con waypoints explícitos: from → waypoints → to.
 * - Ruta larga sin waypoints: dos puntos intermedios a la altura de crucero (o más alto si los extremos lo están),
 *   de modo que la cámara pasa por encima de muros y equipos en lugar de atravesarlos.
 * - Ruta corta o `direct`: from → to.
 */
export function buildControlPoints(from: Vec3, to: Vec3, opts: PathOptions = {}): Vec3[] {
  if (opts.waypoints && opts.waypoints.length > 0) return [from, ...opts.waypoints, to];
  const d = horizontalDistance(from, to);
  if (opts.direct || d < ARC_THRESHOLD) return [from, to];
  const mid = (t: number): Vec3 => [
    lerp(from[0], to[0], t),
    Math.max(CRUISE_ALTITUDE, lerp(from[1], to[1], t)),
    lerp(from[2], to[2], t),
  ];
  return [from, mid(0.22), mid(0.78), to];
}

export function buildCurve(points: readonly Vec3[]): CatmullRomCurve3 {
  const pts = points.map((p) => new Vector3(p[0], p[1], p[2]));
  if (pts.length === 1) pts.push(pts[0].clone());
  // centrípeta: evita bucles y sobreoscilaciones entre puntos desigualmente espaciados
  return new CatmullRomCurve3(pts, false, 'centripetal');
}

export interface DurationOptions {
  reducedMotion?: boolean;
  /** Navegación rápida (p. ej., salto desde el menú o varias pulsaciones seguidas). */
  fast?: boolean;
}

/** Duración efectiva: la base de la escena ajustada a la distancia del recorrido y acotada. */
export function transitionDuration(base: number, pathLength: number, opts: DurationOptions = {}): number {
  if (opts.reducedMotion) return Math.min(0.6, Math.max(0.2, base * 0.2));
  const byDistance = 1.2 + pathLength / 32; // ~32 m/s de velocidad media en recorridos largos
  let d = Math.min(Math.max(base, 1.0), byDistance + base * 0.35);
  d = Math.max(1.0, Math.min(d, 6));
  return opts.fast ? Math.min(d, 1.4) : d;
}

/** Interpolación con easing sin dependencias (útil para pruebas y para el objetivo de la cámara). */
export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Rotación Y para que un plano con normal +Z mire hacia `viewer`. */
export function faceTowards(position: Vec3, viewer: Vec3): number {
  return Math.atan2(viewer[0] - position[0], viewer[2] - position[2]);
}
