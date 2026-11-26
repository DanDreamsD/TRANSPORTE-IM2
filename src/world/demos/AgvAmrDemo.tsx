// Demo 8 · AGV frente a AMR (Tabla 16): ambos encuentran un pallet olvidado en el pasillo. El AGV sigue su cinta
// y se detiene hasta que despejan la ruta; el AMR detecta el obstáculo y planifica un desvío. Demostración didáctica.
import { useMemo, useRef, useState, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { AgvModel } from '../equipment/Vehicles';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';

export const AGV_AMR_CYCLE = 22;
const AGV_Z = -1.4;
const AMR_Z = 1.6;
const OBST_X = -17;
const X_START = -28;
const X_END = -8;
const AGV_STOP_X = OBST_X - 2.2;
const OBSTACLE_CLEARED = 11.5;
const RESUME = 12.5;

export type AgvPhase = 'moving' | 'stopped' | 'resumed';

/** Estado del AGV en el instante t (función pura, compartida con la pantalla). */
export function agvAt(t: number): { x: number; phase: AgvPhase; obstacle: boolean } {
  const tt = ((t % AGV_AMR_CYCLE) + AGV_AMR_CYCLE) % AGV_AMR_CYCLE;
  const reach = AGV_STOP_X - X_START; // a 1 m/s
  if (tt < reach) return { x: X_START + tt, phase: 'moving', obstacle: true };
  if (tt < RESUME) return { x: AGV_STOP_X, phase: 'stopped', obstacle: tt < OBSTACLE_CLEARED };
  return { x: Math.min(X_END, AGV_STOP_X + (tt - RESUME) * 1.2), phase: 'resumed', obstacle: false };
}

const AMR_POINTS: [number, number][] = [
  [X_START, AMR_Z],
  [-20.6, AMR_Z],
  [-18.7, 0.25],
  [-17, -0.05],
  [-15.3, 0.25],
  [-13.4, AMR_Z],
  [X_END, AMR_Z],
];

function ribbon(curve: CatmullRomCurve3, width: number, y: number): BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const n = 200;
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const side = new Vector3().crossVectors(up, t).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, y, p.z - side.z, p.x + side.x, y, p.z + side.z);
    if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx);
  return g;
}

function AmrModel({ groupRef, ringRef }: { groupRef: Ref<Group>; ringRef: Ref<Mesh> }) {
  const body = useMemo(() => new MeshStandardMaterial({ color: '#2b3a46', roughness: 0.4, metalness: 0.3 }), []);
  const glow = useMemo(() => new MeshStandardMaterial({ color: '#2fd0d9', emissive: '#2fd0d9', emissiveIntensity: 2 }), []);
  return (
    <group ref={groupRef}>
      <mesh geometry={GEO.box} material={body} position={[0, 0.22, 0]} scale={[1.1, 0.3, 0.8]} castShadow />
      <mesh geometry={GEO.box} material={glow} position={[0, 0.1, 0]} scale={[1.14, 0.03, 0.84]} />
      <mesh geometry={GEO.box} material={mat('machine')} position={[0, 0.4, 0]} scale={[0.95, 0.06, 0.7]} />
      {/* LiDAR giratorio */}
      <mesh geometry={GEO.cylinder} material={mat('machineDark')} position={[0.35, 0.5, 0]} scale={[0.16, 0.14, 0.16]} />
      <mesh ref={ringRef} geometry={GEO.box} material={glow} position={[0.35, 0.52, 0]} scale={[0.22, 0.02, 0.03]} />
      <mesh geometry={GEO.box} material={mat('carton')} position={[-0.1, 0.62, 0]} scale={[0.6, 0.38, 0.5]} castShadow />
    </group>
  );
}

export function AgvAmrDemo() {
  const active = useAnimationActive('agv-amr');
  const transitioning = usePresentation((s) => s.transitioning);
  const agv = useRef<Group>(null);
  const amr = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const field = useRef<Mesh>(null);
  const obstacle = useRef<Group>(null);
  const [phase, setPhase] = useState<AgvPhase>('moving');
  const curve = useMemo(() => new CatmullRomCurve3(AMR_POINTS.map(([x, z]) => new Vector3(x, 0, z)), false, 'centripetal'), []);
  const length = useMemo(() => curve.getLength(), [curve]);
  const planned = useMemo(() => ribbon(curve, 0.08, 0.016), [curve]);
  const plannedMat = useMemo(() => new MeshBasicMaterial({ color: '#2fd0d9', transparent: true, opacity: 0.8, toneMapped: false }), []);
  const fieldMat = useMemo(() => new MeshBasicMaterial({ color: '#2fb36b', transparent: true, opacity: 0.25, depthWrite: false, toneMapped: false }), []);
  const tmp = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    const on = isAnimationActive('agv-amr');
    const t = on ? demoElapsed() : 0;
    const a = agvAt(t);
    if (agv.current) agv.current.position.set(on ? a.x : X_START + 3, 0, AGV_Z);
    if (obstacle.current) obstacle.current.visible = !on || a.obstacle;
    const stopped = on && a.phase === 'stopped';
    fieldMat.color.set(stopped ? '#e0483e' : '#2fb36b');
    if (field.current) field.current.position.x = (on ? a.x : X_START + 3) + 1.3;
    if (on && a.phase !== phase) setPhase(a.phase);
    // AMR: recorre su ruta planificada a velocidad constante
    const tt = on ? t % AGV_AMR_CYCLE : 3;
    const u = Math.min(1, tt / (length / 1.0));
    const p = curve.getPointAt(u);
    const tg = curve.getTangentAt(u, tmp);
    if (amr.current) {
      amr.current.position.set(p.x, 0, p.z);
      amr.current.rotation.y = Math.atan2(-tg.z, tg.x);
    }
    if (ring.current) ring.current.rotation.y = clock.getElapsedTime() * 8;
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* cinta magnética del AGV */}
      <mesh geometry={GEO.plane} material={mat('machineDark')} rotation-x={-Math.PI / 2} position={[(X_START + X_END) / 2, 0.014, AGV_Z]} scale={[X_END - X_START, 0.07, 1]} />
      {/* ruta planificada por el AMR */}
      <mesh geometry={planned} material={plannedMat} visible={active} />
      {/* obstáculos: pallets olvidados en el pasillo */}
      <group ref={obstacle} position={[OBST_X, 0, AGV_Z]}>
        <Pallet />
        <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.35, 0]} scale={[1.1, 0.7, 0.7]} castShadow />
      </group>
      <group position={[OBST_X, 0, AMR_Z]}>
        <Pallet />
        <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.35, 0]} scale={[1.1, 0.7, 0.7]} castShadow />
      </group>
      <AgvModel groupRef={agv} position={[X_START + 3, 0, AGV_Z]}>
        <mesh geometry={GEO.box} material={mat('rackUpright')} position={[0, 0.3, 0]} scale={[0.9, 0.6, 0.6]} castShadow />
      </AgvModel>
      {/* campo del escáner de seguridad del AGV */}
      <mesh ref={field} geometry={GEO.plane} material={fieldMat} rotation-x={-Math.PI / 2} position={[X_START + 4.3, 0.02, AGV_Z]} scale={[1.4, 0.9, 1]} visible={active} />
      <AmrModel groupRef={amr} ringRef={ring} />
      <Tag3D
        position={[AGV_STOP_X, 1.1, AGV_Z]}
        title="AGV"
        detail={phase === 'stopped' ? 'detenido: espera que despejen la ruta' : 'sigue la cinta magnética'}
        tone={phase === 'stopped' ? 'danger' : 'default'}
        visible={show}
        lead={24}
      />
      <Tag3D position={[OBST_X + 2.6, 1.2, 0.6]} title="AMR" detail="detecta el obstáculo y replanifica" tone="accent" visible={show} lead={30} />
    </group>
  );
}
