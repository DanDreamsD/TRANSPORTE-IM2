// Escena 1.2 · Descarga en recepción: el montacargas saca un pallet del remolque (carga/descarga),
// lo traslada (movimiento horizontal) y lo deposita bajando las horquillas (movimiento vertical).
// Demostración didáctica.
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Forklift, FORK_REACH } from '../equipment/Forklift';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';
import { sampleKeys, type PoseKey } from './keyframes';

const PI = Math.PI;
const CYCLE = 15;
const DROP = { x: -53, z: 2.65 - FORK_REACH };

// Fotogramas clave del ciclo (posición del centro del montacargas).
const KEYS: PoseKey[] = [
  { t: 0, x: -57.2, z: 6.0, yaw: PI, lift: 0.15, flag: true }, // recoge el pallet dentro del remolque
  { t: 3, x: -53.6, z: 6.0, yaw: PI, lift: 0.15, flag: true }, // sale en reversa del muelle
  { t: 5, x: -53.0, z: 5.4, yaw: PI / 2, lift: 0.15, flag: true }, // gira hacia el área de preparación
  { t: 7, x: -53.0, z: 2.65, yaw: PI / 2, lift: 0.15, flag: true }, // avanza
  { t: 8.2, x: -53.0, z: 2.65, yaw: PI / 2, lift: 0.02, flag: false }, // baja las horquillas y suelta
  { t: 10.2, x: -53.0, z: 5.4, yaw: PI / 2, lift: 0.02, flag: false }, // retrocede
  { t: 12, x: -53.6, z: 6.0, yaw: PI, lift: 0.02, flag: false },
  { t: 14.4, x: -57.2, z: 6.0, yaw: PI, lift: 0.02, flag: false }, // vuelve al remolque
  { t: CYCLE, x: -57.2, z: 6.0, yaw: PI, lift: 0.15, flag: true },
];

function Load() {
  return (
    <group>
      <Pallet />
      <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.45, 0]} scale={[1.16, 0.9, 0.78]} castShadow />
      <mesh geometry={GEO.box} material={mat('wrap')} position={[0, PALLET_HEIGHT + 0.46, 0]} scale={[1.19, 0.93, 0.81]} />
    </group>
  );
}

export function TruckUnloadDemo() {
  const active = useAnimationActive('truck-unload');
  const transitioning = usePresentation((s) => s.transitioning);
  const body = useRef<Group>(null);
  const carriage = useRef<Group>(null);
  const carried = useRef<Group>(null);
  const dropped = useRef<Group>(null);
  const [phase, setPhase] = useState<'carry' | 'placed'>('carry');
  const keys = useMemo(() => KEYS, []);

  useFrame(() => {
    const t = isAnimationActive('truck-unload') ? demoElapsed() : 0;
    const p = sampleKeys(keys, t, CYCLE);
    if (body.current) {
      body.current.position.set(p.x, 0, p.z);
      body.current.rotation.y = p.yaw;
    }
    if (carriage.current) carriage.current.position.y = p.lift;
    if (carried.current) carried.current.visible = p.flag;
    const tt = t % CYCLE;
    if (dropped.current) dropped.current.visible = !p.flag && tt < 14.2;
    const next = p.flag ? 'carry' : 'placed';
    if (next !== phase) setPhase(next);
  });

  const show = active && !transitioning;
  return (
    <group>
      <Forklift groupRef={body} carriageRef={carriage} position={[KEYS[0].x, 0, KEYS[0].z]} rotationY={KEYS[0].yaw}>
        <group ref={carried} position={[FORK_REACH, -0.07, 0]}>
          <Load />
        </group>
        <Tag3D position={[FORK_REACH, 1.3, 0]} title="Movimiento vertical" detail="elevar y bajar la carga" visible={show && phase === 'carry'} lead={30} />
      </Forklift>
      <group ref={dropped} position={[DROP.x, 0, DROP.z]} rotation={[0, PI / 2, 0]} visible={false}>
        <Load />
      </group>
      {/* trayectoria marcada en el piso */}
      <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-PI / 2} position={[DROP.x, 0.01, DROP.z]} scale={[1.6, 1.6, 1]} />
      <Tag3D position={[-58.6, 2.6, 6]} title="Carga y descarga" detail="del remolque al muelle" visible={show} lead={30} tone="accent" />
      <Tag3D position={[-55.2, 0.2, 6.0]} title="Movimiento horizontal" detail="traslado dentro de la planta" visible={show} lead={70} />
    </group>
  );
}
