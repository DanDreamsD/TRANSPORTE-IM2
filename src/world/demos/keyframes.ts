// Interpolación de poses por fotogramas clave (pura, testeable). Usada por demos de vehículos.

export interface PoseKey {
  t: number;
  x: number;
  z: number;
  /** Orientación alrededor de Y (rad). */
  yaw: number;
  /** Altura de horquillas u otro parámetro escalar. */
  lift: number;
  /** Estado discreto que cambia en el instante del fotograma clave (p. ej., «lleva carga»). */
  flag: boolean;
}

export interface Pose {
  x: number;
  z: number;
  yaw: number;
  lift: number;
  flag: boolean;
}

function smoothstep(x: number): number {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
}

function lerpAngle(a: number, b: number, k: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

/** Pose en el instante `t`, recorriendo `keys` (ordenadas por t) en bucle con periodo `cycle`. */
export function sampleKeys(keys: readonly PoseKey[], t: number, cycle: number): Pose {
  const tt = ((t % cycle) + cycle) % cycle;
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= tt) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  if (a === b || b.t <= a.t) return { x: a.x, z: a.z, yaw: a.yaw, lift: a.lift, flag: a.flag };
  const k = smoothstep((tt - a.t) / (b.t - a.t));
  return {
    x: a.x + (b.x - a.x) * k,
    z: a.z + (b.z - a.z) * k,
    yaw: lerpAngle(a.yaw, b.yaw, k),
    lift: a.lift + (b.lift - a.lift) * k,
    flag: a.flag,
  };
}
