// Demo 6 · Grúas y polipastos en el área de procesamiento: grúa puente con polipasto (ciclo de izaje y traslado
// de una bobina), grúa pluma giratoria en una estación y monorriel con polipasto en ruta fija.
// Fuera de su escena las grúas quedan estacionadas. Demostración didáctica.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';

// ---- grúa puente ----
const RAIL_Y = 8;
const RUNWAY_Z: [number, number] = [-31, -7];
const SPAN_Z = RUNWAY_Z[1] - RUNWAY_Z[0];
const BRIDGE_Y = RAIL_Y + 0.55;
const HOOK_TOP = RAIL_Y - 0.9;
const PICK = { x: -19.5, z: -19 };
const DROP = { x: -11, z: -19.5 };
const PARK = { x: -9, z: -20 };
const COIL_R = 0.55;
const COIL_LIFT_Y = COIL_R + 0.05; // altura del gancho cuando la bobina toca el piso

export const BRIDGE_CYCLE = 24;

function smooth(x: number) {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
}
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export interface BridgeState {
  x: number;
  z: number;
  hookY: number;
  /** 0 = bobina en el punto de recogida, 1 = colgando del gancho, 2 = depositada en destino. */
  coil: 0 | 1 | 2;
}

/** Estado de la grúa puente en el instante t del ciclo (función pura, testeable). */
export function bridgeStateAt(t: number): BridgeState {
  const tt = ((t % BRIDGE_CYCLE) + BRIDGE_CYCLE) % BRIDGE_CYCLE;
  const low = COIL_LIFT_Y + COIL_R + 0.25;
  const seg = (a: number, b: number) => smooth((tt - a) / (b - a));
  // 0–3 desplazarse a recogida · 3–5 bajar · 5–7 izar · 7–12 trasladar · 12–14 bajar · 14–16 subir · 16–21 volver · 21–24 espera
  if (tt < 3) return { x: lerp(PARK.x, PICK.x, seg(0, 3)), z: lerp(PARK.z, PICK.z, seg(0, 3)), hookY: HOOK_TOP, coil: 0 };
  if (tt < 5) return { x: PICK.x, z: PICK.z, hookY: lerp(HOOK_TOP, low, seg(3, 5)), coil: 0 };
  if (tt < 7) return { x: PICK.x, z: PICK.z, hookY: lerp(low, HOOK_TOP - 1.2, seg(5, 7)), coil: 1 };
  if (tt < 12) return { x: lerp(PICK.x, DROP.x, seg(7, 12)), z: lerp(PICK.z, DROP.z, seg(7, 12)), hookY: HOOK_TOP - 1.2, coil: 1 };
  if (tt < 14) return { x: DROP.x, z: DROP.z, hookY: lerp(HOOK_TOP - 1.2, low, seg(12, 14)), coil: 1 };
  if (tt < 16) return { x: DROP.x, z: DROP.z, hookY: lerp(low, HOOK_TOP, seg(14, 16)), coil: 2 };
  if (tt < 21) return { x: lerp(DROP.x, PARK.x, seg(16, 21)), z: lerp(DROP.z, PARK.z, seg(16, 21)), hookY: HOOK_TOP, coil: 2 };
  return { x: PARK.x, z: PARK.z, hookY: HOOK_TOP, coil: 2 };
}

function Coil() {
  return (
    <group>
      <mesh geometry={GEO.cylinder} material={mat('galvanized')} rotation={[Math.PI / 2, 0, 0]} scale={[COIL_R * 2, 0.9, COIL_R * 2]} castShadow />
      <mesh geometry={GEO.cylinder} material={mat('machineDark')} rotation={[Math.PI / 2, 0, 0]} scale={[COIL_R * 0.8, 0.92, COIL_R * 0.8]} />
    </group>
  );
}

export function CranesDemo() {
  const active = useAnimationActive('cranes');
  const transitioning = usePresentation((s) => s.transitioning);
  const bridge = useRef<Group>(null);
  const trolley = useRef<Group>(null);
  const hook = useRef<Group>(null);
  const cable = useRef<Mesh>(null);
  const coilOnHook = useRef<Group>(null);
  const coilFloor = useRef<Group>(null);
  const jibArm = useRef<Group>(null);
  const jibHook = useRef<Group>(null);
  const jibCable = useRef<Mesh>(null);
  const monoHoist = useRef<Group>(null);

  const brackets = useMemo(() => [-24, -12, 0], []);

  useFrame(({ clock }) => {
    const on = isAnimationActive('cranes');
    const s = on ? bridgeStateAt(demoElapsed()) : { x: PARK.x, z: PARK.z, hookY: HOOK_TOP, coil: 2 as const };
    if (bridge.current) bridge.current.position.x = s.x;
    if (trolley.current) trolley.current.position.z = s.z;
    if (hook.current) hook.current.position.y = s.hookY - RAIL_Y;
    if (cable.current) {
      const len = BRIDGE_Y - 0.3 - s.hookY;
      cable.current.scale.y = Math.max(0.05, len);
      cable.current.position.y = (BRIDGE_Y - 0.3 + s.hookY) / 2 - RAIL_Y;
    }
    if (coilOnHook.current) coilOnHook.current.visible = s.coil === 1;
    if (coilFloor.current) {
      coilFloor.current.visible = s.coil !== 1;
      const at = s.coil === 0 ? PICK : DROP;
      coilFloor.current.position.set(at.x, COIL_R, at.z);
    }

    const t = clock.getElapsedTime();
    // grúa pluma: giro lento y polipasto que sube y baja
    if (jibArm.current) jibArm.current.rotation.y = on ? Math.sin(t * 0.35) * 1.1 : 0.4;
    const jh = on ? 2.6 + Math.sin(t * 0.7) * 1.0 : 3.4;
    if (jibHook.current) jibHook.current.position.y = jh;
    if (jibCable.current) {
      jibCable.current.scale.y = 4.3 - jh;
      jibCable.current.position.y = (4.3 + jh) / 2;
    }
    // monorriel: el polipasto recorre la ruta fija
    if (monoHoist.current) monoHoist.current.position.x = on ? -12 + Math.sin(t * 0.25) * 8.5 : -16;
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* ---------- grúa puente ---------- */}
      {RUNWAY_Z.map((z) => (
        <mesh key={z} geometry={GEO.box} material={mat('yellow')} position={[-11, RAIL_Y, z]} scale={[22, 0.5, 0.35]} castShadow />
      ))}
      {brackets.map((x) =>
        RUNWAY_Z.map((z) => (
          <mesh key={`${x}:${z}`} geometry={GEO.box} material={mat('steel')} position={[x, RAIL_Y / 2, z]} scale={[0.3, RAIL_Y, 0.3]} castShadow />
        )),
      )}
      <group ref={bridge} position={[PARK.x, RAIL_Y, 0]}>
        <mesh geometry={GEO.box} material={mat('yellow')} position={[0, 0.55, (RUNWAY_Z[0] + RUNWAY_Z[1]) / 2]} scale={[0.8, 0.7, SPAN_Z + 0.6]} castShadow />
        {RUNWAY_Z.map((z) => (
          <mesh key={z} geometry={GEO.box} material={mat('machineDark')} position={[0, 0.35, z]} scale={[1.6, 0.35, 0.6]} castShadow />
        ))}
        <group ref={trolley} position={[0, 0, PARK.z]}>
          <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.05, 0]} scale={[1.1, 0.7, 1.2]} castShadow />
          <mesh geometry={GEO.cylinder} material={mat('steelLight')} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 1.0, 0.5]} />
          <mesh ref={cable} geometry={GEO.box} material={mat('steel')} scale={[0.04, 1, 0.04]} />
          <group ref={hook} position={[0, HOOK_TOP - RAIL_Y, 0]}>
            <mesh geometry={GEO.box} material={mat('yellow')} position={[0, 0.1, 0]} scale={[0.36, 0.3, 0.24]} castShadow />
            <mesh geometry={GEO.box} material={mat('steel')} position={[0, -0.12, 0]} scale={[0.06, 0.2, 0.06]} />
            <group ref={coilOnHook} position={[0, -0.25 - COIL_R, 0]} visible={false}>
              <Coil />
            </group>
          </group>
          <Tag3D position={[0.6, -0.4, 0]} title="Polipasto" detail="iza y baja la carga" visible={show} lead={14} />
        </group>
        <Tag3D position={[0, -0.1, -27]} title="Grúa puente" detail="cubre toda el área rectangular" tone="accent" visible={show} lead={28} />
      </group>
      <group ref={coilFloor} position={[PICK.x, COIL_R, PICK.z]}>
        <Coil />
      </group>
      {/* zonas de recogida y depósito */}
      {[PICK, DROP].map((p) => (
        <mesh key={p.x} geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[p.x, 0.012, p.z]} scale={[2.2, 1.8, 1]} />
      ))}

      {/* ---------- grúa pluma (jib) ---------- */}
      <group position={[-1.6, 0, -18.4]}>
        <mesh geometry={GEO.cylinder} material={mat('machineDark')} position={[0, 0.1, 0]} scale={[1.0, 0.2, 1.0]} />
        <mesh geometry={GEO.cylinder} material={mat('yellow')} position={[0, 2.4, 0]} scale={[0.32, 4.8, 0.32]} castShadow />
        <group ref={jibArm} position={[0, 4.5, 0]}>
          <mesh geometry={GEO.box} material={mat('yellow')} position={[-1.6, 0, 0]} scale={[3.3, 0.3, 0.25]} castShadow />
          <mesh geometry={GEO.box} material={mat('yellow')} position={[-0.6, -0.55, 0]} rotation={[0, 0, -0.55]} scale={[1.3, 0.1, 0.1]} />
          <group position={[-2.6, -4.5, 0]}>
            <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 4.3, 0]} scale={[0.35, 0.3, 0.32]} />
            <mesh ref={jibCable} geometry={GEO.box} material={mat('steel')} scale={[0.03, 1, 0.03]} />
            <group ref={jibHook} position={[0, 3, 0]}>
              <mesh geometry={GEO.box} material={mat('yellow')} scale={[0.22, 0.18, 0.16]} />
              <mesh geometry={GEO.box} material={mat('carton')} position={[0, -0.32, 0]} scale={[0.4, 0.36, 0.4]} castShadow />
            </group>
          </group>
        </group>
        <Tag3D position={[0, 5.0, 0]} title="Grúa pluma" detail="zona circular en una estación" visible={show} lead={24} />
      </group>

      {/* ---------- monorriel ---------- */}
      <group position={[0, 5.6, -9.4]}>
        <mesh geometry={GEO.box} material={mat('steel')} scale={[19, 0.22, 0.14]} position={[-11.5, 0, 0]} castShadow />
        {[-20, -14, -8, -3].map((x) => (
          <mesh key={x} geometry={GEO.box} material={mat('steel')} position={[x, (10.4 - 5.6) / 2, 0]} scale={[0.05, 10.4 - 5.6, 0.05]} />
        ))}
        <group ref={monoHoist} position={[-16, 0, 0]}>
          <mesh geometry={GEO.box} material={mat('machineAccent')} position={[0, -0.3, 0]} scale={[0.5, 0.4, 0.3]} castShadow />
          <mesh geometry={GEO.box} material={mat('steel')} position={[0, -1.0, 0]} scale={[0.03, 1.1, 0.03]} />
          <mesh geometry={GEO.box} material={mat('machine')} position={[0, -1.75, 0]} scale={[0.7, 0.4, 0.5]} castShadow />
          <Tag3D position={[0, 0.2, 0]} title="Monorriel" detail="ruta fija entre puntos" visible={show} lead={22} />
        </group>
      </group>
    </group>
  );
}
