// Equipos móviles de manejo: carretilla de mano, transpaleta manual y AGV.
// Reutilizables en varias escenas (grados de mecanización, transportes, AGV vs AMR).
import { useMemo, type ReactNode, type Ref } from 'react';
import { MeshStandardMaterial, type Group } from 'three';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';

type P3 = [number, number, number];
const v = (p: Vec3): P3 => [p[0], p[1], p[2]];

interface Placed {
  position?: Vec3;
  rotationY?: number;
}

/** Carretilla de mano de dos ruedas (diablito) con cajas. El frente (pala) apunta a +X local. */
export function HandCart({ position = [0, 0, 0], rotationY = 0, boxes = 2 }: Placed & { boxes?: number }) {
  const tilt = -0.32;
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <group position={[0, 0.2, 0]} rotation={[0, 0, tilt]}>
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} geometry={GEO.box} material={mat('pipeRed')} position={[-0.05, 0.6, z]} scale={[0.04, 1.25, 0.04]} castShadow />
        ))}
        <mesh geometry={GEO.box} material={mat('pipeRed')} position={[-0.05, 1.2, 0]} scale={[0.04, 0.04, 0.44]} />
        <mesh geometry={GEO.box} material={mat('steel')} position={[0.12, 0.0, 0]} scale={[0.3, 0.03, 0.42]} castShadow />
        {Array.from({ length: boxes }, (_, i) => (
          <mesh key={i} geometry={GEO.box} material={mat('carton')} position={[0.16, 0.2 + i * 0.36, 0]} scale={[0.32, 0.34, 0.38]} castShadow />
        ))}
      </group>
      {[-0.26, 0.26].map((z) => (
        <mesh key={z} geometry={GEO.cylinder} material={mat('black')} position={[0, 0.13, z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.26, 0.07, 0.26]} castShadow />
      ))}
    </group>
  );
}

/** Transpaleta manual. Las horquillas apuntan a +X local. `children` = carga sobre las horquillas. */
export function PalletJack({ position = [0, 0, 0], rotationY = 0, children }: Placed & { children?: ReactNode }) {
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      {[-0.27, 0.27].map((z) => (
        <mesh key={z} geometry={GEO.box} material={mat('steel')} position={[0.6, 0.06, z]} scale={[1.15, 0.06, 0.16]} castShadow />
      ))}
      <mesh geometry={GEO.box} material={mat('yellow')} position={[-0.05, 0.22, 0]} scale={[0.25, 0.32, 0.62]} castShadow />
      <mesh geometry={GEO.cylinder} material={mat('steel')} position={[-0.05, 0.42, 0]} scale={[0.1, 0.25, 0.1]} />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-0.32, 0.8, 0]} rotation={[0, 0, 0.45]} scale={[0.04, 0.95, 0.04]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-0.52, 1.22, 0]} scale={[0.05, 0.05, 0.32]} />
      <mesh geometry={GEO.cylinder} material={mat('black')} position={[-0.05, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.18, 0.12, 0.18]} />
      <group position={[0.6, 0.09, 0]}>{children}</group>
    </group>
  );
}

/** AGV de carga baja con escáner de seguridad, baliza y bandas de advertencia. Frente en +X local. */
export function AgvModel({ position = [0, 0, 0], rotationY = 0, groupRef, color = '#f2f2ef', children }: Placed & { groupRef?: Ref<Group>; color?: string; children?: ReactNode }) {
  const body = useMemo(() => new MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.2 }), [color]);
  return (
    <group ref={groupRef} position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={body} position={[0, 0.2, 0]} scale={[1.3, 0.28, 0.85]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.06, 0]} scale={[1.22, 0.08, 0.78]} />
      <mesh geometry={GEO.box} material={mat('hazard')} position={[0, 0.2, 0.43]} scale={[1.3, 0.06, 0.01]} />
      <mesh geometry={GEO.box} material={mat('hazard')} position={[0, 0.2, -0.43]} scale={[1.3, 0.06, 0.01]} />
      {/* escáner láser de seguridad y baliza */}
      <mesh geometry={GEO.cylinder} material={mat('machineDark')} position={[0.58, 0.4, 0]} scale={[0.12, 0.1, 0.12]} />
      <mesh geometry={GEO.cylinder} material={mat('yellow')} position={[-0.5, 0.42, 0.3]} scale={[0.06, 0.1, 0.06]} />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.355, 0]} scale={[0.9, 0.03, 0.6]} />
      <group position={[0, 0.37, 0]}>{children}</group>
    </group>
  );
}
