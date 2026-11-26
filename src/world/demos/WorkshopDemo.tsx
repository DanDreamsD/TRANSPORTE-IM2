// Escena 12.1–12.3 · Taller del ejemplo integrado de la guía (§12.5, HIPOTÉTICO): tableros pesados apilados en el
// piso y trasladados a mano a una sierra. Muestra cuatro síntomas de la Tabla 25. Escenario ilustrativo.
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, Group, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Machine } from '../equipment/Machines';
import { Worker, type WorkerPose } from '../equipment/Worker';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';
import { sampleKeys, type PoseKey } from './keyframes';

const STACK = { x: -56.2, z: 21.0 };
const SAW = { x: -49.0, z: 26.2 };
const BOARD = { l: 2.44, t: 0.04, w: 1.22 };
const CYCLE = 10;

const KEYS: PoseKey[] = [
  { t: 0, x: STACK.x + 1.0, z: STACK.z + 0.9, yaw: Math.PI / 2, lift: 0.9, flag: false },
  { t: 1.0, x: STACK.x + 1.0, z: STACK.z + 0.9, yaw: Math.PI / 2, lift: 0.9, flag: true },
  { t: 1.8, x: STACK.x + 1.0, z: STACK.z + 0.9, yaw: -0.6, lift: 0.15, flag: true },
  { t: 6.0, x: SAW.x - 2.4, z: SAW.z - 0.4, yaw: -0.2, lift: 0.15, flag: true },
  { t: 6.8, x: SAW.x - 2.4, z: SAW.z - 0.4, yaw: 0, lift: 0.3, flag: false },
  { t: 7.4, x: SAW.x - 2.4, z: SAW.z - 0.4, yaw: Math.PI - 0.5, lift: 0, flag: false },
  { t: CYCLE, x: STACK.x + 1.0, z: STACK.z + 0.9, yaw: Math.PI / 2, lift: 0.9, flag: false },
];

function pathGeometry(): BufferGeometry {
  // franja discontinua del acarreo largo entre la pila y la sierra
  const pos: number[] = [];
  const idx: number[] = [];
  const ax = STACK.x + 1.0, az = STACK.z + 0.9, bx = SAW.x - 2.4, bz = SAW.z - 0.4;
  const len = Math.hypot(bx - ax, bz - az);
  const dx = (bx - ax) / len, dz = (bz - az) / len;
  const nx = -dz * 0.07, nz = dx * 0.07;
  let k = 0;
  for (let s = 0; s < len - 0.3; s += 0.6) {
    const e = Math.min(len, s + 0.35);
    const p = [ax + dx * s, az + dz * s, ax + dx * e, az + dz * e];
    pos.push(p[0] - nx, 0.014, p[1] - nz, p[0] + nx, 0.014, p[1] + nz, p[2] - nx, 0.014, p[3] - nz, p[2] + nx, 0.014, p[3] + nz);
    idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    k += 4;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx);
  return g;
}

export function WorkshopDemo() {
  const active = useAnimationActive('workshop-symptoms');
  const transitioning = usePresentation((s) => s.transitioning);
  const body = useRef<Group>(null);
  const carried = useRef<Group>(null);
  const pose = useRef<WorkerPose>({ hands: [0.45, 0.9, 0], lean: 0, squat: 0 });
  const [carrying, setCarrying] = useState(false);
  const boardMat = useMemo(() => new MeshStandardMaterial({ color: '#c8a77a', roughness: 0.8 }), []);
  const path = useMemo(() => pathGeometry(), []);
  const pathMat = useMemo(() => new MeshBasicMaterial({ color: '#e0483e', transparent: true, opacity: 0.85, toneMapped: false }), []);

  useFrame(() => {
    const t = isAnimationActive('workshop-symptoms') ? demoElapsed() : 0;
    const p = sampleKeys(KEYS, t, CYCLE);
    if (body.current) {
      body.current.position.set(p.x, 0, p.z);
      body.current.rotation.y = p.yaw;
    }
    const handY = 0.95 - p.lift * 0.5;
    pose.current.hands = [0.42, handY, 0];
    pose.current.lean = p.lift * 0.8;
    pose.current.squat = p.lift * 0.5;
    if (carried.current) {
      carried.current.visible = p.flag;
      carried.current.position.set(0.5, handY, 0);
    }
    if (p.flag !== carrying) setCarrying(p.flag);
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* tableros apilados en el piso (sin rack) */}
      <group position={[STACK.x, 0, STACK.z]}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} geometry={GEO.box} material={boardMat} position={[Math.sin(i * 1.7) * 0.06, BOARD.t / 2 + i * BOARD.t, Math.cos(i * 2.3) * 0.05]} rotation={[0, Math.sin(i) * 0.05, 0]} scale={[BOARD.l, BOARD.t * 0.96, BOARD.w]} castShadow receiveShadow />
        ))}
      </group>
      <group position={[STACK.x + 0.3, 0, STACK.z - 1.9]} rotation={[0, 0.4, 0]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} geometry={GEO.box} material={boardMat} position={[0, BOARD.t / 2 + i * BOARD.t, 0]} rotation={[0, i * 0.07, 0]} scale={[BOARD.l, BOARD.t * 0.96, BOARD.w]} castShadow />
        ))}
      </group>
      {/* sierra */}
      <Machine position={[SAW.x, 0, SAW.z]} size={[3.2, 1.0, 1.6]} accent={false} />
      <mesh geometry={GEO.cylinder} material={mat('galvanized')} position={[SAW.x, 1.05, SAW.z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.7, 0.02, 0.7]} />
      {/* tablero con cantos dañados junto a la sierra */}
      <group position={[SAW.x - 1.0, 0.62, SAW.z - 1.5]} rotation={[0, 0, 1.25]}>
        <mesh geometry={GEO.box} material={boardMat} scale={[BOARD.l * 0.55, BOARD.t, BOARD.w]} castShadow />
        {[-0.5, 0.45].map((z) => (
          <mesh key={z} geometry={GEO.box} material={mat('pipeRed')} position={[0.66, 0, z]} scale={[0.08, 0.05, 0.16]} />
        ))}
      </group>
      <mesh geometry={path} material={pathMat} />
      <group ref={body} position={[STACK.x + 1.0, 0, STACK.z + 0.9]}>
        <Worker pose={pose} vest="#9b8ec4" />
        <group ref={carried} visible={false}>
          <mesh geometry={GEO.box} material={boardMat} scale={[BOARD.w * 0.9, BOARD.t, BOARD.l * 0.9]} castShadow />
        </group>
      </group>

      <Tag3D position={[STACK.x, 0.6, STACK.z]} title="Material apilado en el piso" detail="sin racks ni contenedores" tone="danger" visible={show} lead={30} />
      <Tag3D position={[(STACK.x + SAW.x) / 2 - 0.4, 0.05, (STACK.z + SAW.z) / 2 + 0.2]} title="Acarreo largo" detail="recepción → almacén → sierra" tone="danger" visible={show} lead={46} />
      <Tag3D position={[SAW.x - 1.0, 0.9, SAW.z - 1.5]} title="Daño en los cantos" detail="manejo sin protección" tone="danger" visible={show} lead={6} />
      <Tag3D position={[SAW.x - 2.4, 1.2, SAW.z - 0.4]} title="Esfuerzo manual excesivo" detail={carrying ? 'tablero pesado a mano' : 'cargas repetitivas'} tone="danger" visible={show} lead={6} />
    </group>
  );
}
