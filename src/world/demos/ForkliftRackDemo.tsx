// Demo 7 · Operación de montacargas: retira un pallet del segundo nivel del rack de producto terminado y lo vuelve
// a guardar (cargar, descargar y levantar; requiere pasillo). Demostración didáctica.
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Forklift, FORK_REACH } from '../equipment/Forklift';
import { PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';
import { sampleKeys, type PoseKey } from './keyframes';

/** Posición del pallet en el rack (vano 3, nivel 1 de la primera fila del almacén PT). */
export const PT_SLOT = { x: 43.95, y: 1.7, z: 12.0 };
const YAW = -Math.PI / 2; // horquillas hacia +Z (hacia el rack)
const ZIN = PT_SLOT.z - FORK_REACH;
const UP = PT_SLOT.y + 0.06; // horquillas bajo el pallet
const LIFT = PT_SLOT.y + 0.2; // pallet levantado del larguero
const CYCLE = 24;

const KEYS: PoseKey[] = [
  { t: 0, x: PT_SLOT.x, z: 6.0, yaw: YAW, lift: 0.15, flag: false },
  { t: 2.5, x: PT_SLOT.x, z: 8.6, yaw: YAW, lift: UP, flag: false },
  { t: 4, x: PT_SLOT.x, z: ZIN, yaw: YAW, lift: UP, flag: false },
  { t: 5, x: PT_SLOT.x, z: ZIN, yaw: YAW, lift: LIFT, flag: true },
  { t: 7, x: PT_SLOT.x, z: 8.2, yaw: YAW, lift: LIFT, flag: true },
  { t: 9, x: PT_SLOT.x, z: 8.2, yaw: YAW, lift: 0.3, flag: true },
  { t: 11, x: PT_SLOT.x, z: 6.4, yaw: YAW, lift: 0.3, flag: true },
  { t: 13, x: PT_SLOT.x, z: 6.4, yaw: YAW, lift: 0.3, flag: true },
  { t: 15, x: PT_SLOT.x, z: 8.2, yaw: YAW, lift: LIFT, flag: true },
  { t: 16.5, x: PT_SLOT.x, z: ZIN, yaw: YAW, lift: LIFT, flag: true },
  { t: 17.5, x: PT_SLOT.x, z: ZIN, yaw: YAW, lift: UP, flag: false },
  { t: 19.5, x: PT_SLOT.x, z: 8.6, yaw: YAW, lift: UP, flag: false },
  { t: 21.5, x: PT_SLOT.x, z: 6.0, yaw: YAW, lift: 0.15, flag: false },
  { t: CYCLE, x: PT_SLOT.x, z: 6.0, yaw: YAW, lift: 0.15, flag: false },
];

function WrappedLoad() {
  return (
    <group>
      <mesh geometry={GEO.box} material={mat('wood')} position={[0, PALLET_HEIGHT / 2, 0]} scale={[1.2, PALLET_HEIGHT, 0.8]} castShadow />
      <mesh geometry={GEO.box} material={mat('wrap')} position={[0, PALLET_HEIGHT + 0.5, 0]} scale={[1.16, 1.0, 0.78]} />
      <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.48, 0]} scale={[1.1, 0.96, 0.72]} castShadow />
    </group>
  );
}

export function ForkliftRackDemo() {
  const active = useAnimationActive('forklift');
  const transitioning = usePresentation((s) => s.transitioning);
  const body = useRef<Group>(null);
  const carriage = useRef<Group>(null);
  const carried = useRef<Group>(null);
  const inRack = useRef<Group>(null);
  const [carrying, setCarrying] = useState(false);

  useFrame(() => {
    const t = isAnimationActive('forklift') ? demoElapsed() : 0;
    const p = sampleKeys(KEYS, t, CYCLE);
    if (body.current) {
      body.current.position.set(p.x, 0, p.z);
      body.current.rotation.y = p.yaw;
    }
    if (carriage.current) carriage.current.position.y = p.lift;
    if (carried.current) carried.current.visible = p.flag;
    if (inRack.current) inRack.current.visible = !p.flag;
    if (p.flag !== carrying) setCarrying(p.flag);
  });

  const show = active && !transitioning;
  return (
    <group>
      <Forklift groupRef={body} carriageRef={carriage} position={[PT_SLOT.x, 0, 6]} rotationY={YAW}>
        {/* el pallet del rack tiene su lado de 1,2 m en profundidad: a lo largo de las horquillas */}
        <group ref={carried} position={[FORK_REACH, -0.07, 0]} visible={false}>
          <WrappedLoad />
        </group>
        <Tag3D position={[FORK_REACH, 1.4, 0]} title="Elevación" detail="carga, descarga y levanta" visible={show && carrying} lead={22} />
      </Forklift>
      <group ref={inRack} position={[PT_SLOT.x, PT_SLOT.y, PT_SLOT.z]} rotation={[0, Math.PI / 2, 0]}>
        <WrappedLoad />
      </group>
      {/* pasillo de maniobra */}
      <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[PT_SLOT.x, 0.012, 7.4]} scale={[0.12, 4.6, 1]} />
      <Tag3D position={[PT_SLOT.x - 1.6, 0.05, 7.6]} title="Pasillo de maniobra" detail="los transportes requieren pasillos" visible={show} lead={40} />
    </group>
  );
}
