// Montacargas contrabalanceado. Estático por defecto; las demos lo animan mediante refs
// (`groupRef` para la posición/orientación y `carriageRef` para la altura de las horquillas).
import type { ReactNode, Ref } from 'react';
import type { Group } from 'three';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';

interface Props {
  position?: Vec3;
  rotationY?: number;
  forkHeight?: number;
  groupRef?: Ref<Group>;
  carriageRef?: Ref<Group>;
  /** Carga transportada (se dibuja sobre las horquillas y sube con ellas). */
  children?: ReactNode;
}

/** Distancia desde el centro del montacargas hasta el centro de la carga sobre las horquillas. */
export const FORK_REACH = 1.55;

/** El frente (horquillas) apunta a +X local. */
export function Forklift({ position = [0, 0, 0], rotationY = 0, forkHeight = 0.15, groupRef, carriageRef, children }: Props) {
  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]} rotation={[0, rotationY, 0]}>
      {/* chasis y contrapeso */}
      <mesh geometry={GEO.box} material={mat('yellow')} position={[-0.2, 0.62, 0]} scale={[1.9, 0.75, 1.1]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-1.05, 0.75, 0]} scale={[0.4, 0.95, 1.1]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-0.3, 1.1, 0]} scale={[0.6, 0.25, 0.6]} />
      {/* techo de protección */}
      {[
        [0.35, 0.48],
        [0.35, -0.48],
        [-0.75, 0.48],
        [-0.75, -0.48],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.box} material={mat('machineDark')} position={[x, 1.6, z]} scale={[0.06, 1.25, 0.06]} />
      ))}
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-0.2, 2.24, 0]} scale={[1.2, 0.06, 1.04]} />
      {/* mástil */}
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} geometry={GEO.box} material={mat('steel')} position={[0.85, 1.25, z]} scale={[0.1, 2.5, 0.1]} castShadow />
      ))}
      {/* carro, horquillas y carga */}
      <group ref={carriageRef} position={[0, forkHeight, 0]}>
        <mesh geometry={GEO.box} material={mat('steel')} position={[0.95, 0.35, 0]} scale={[0.06, 0.7, 0.9]} />
        {[-0.25, 0.25].map((z) => (
          <mesh key={z} geometry={GEO.box} material={mat('steel')} position={[FORK_REACH, 0, z]} scale={[1.15, 0.05, 0.12]} castShadow />
        ))}
        {children}
      </group>
      {/* ruedas */}
      {[
        [0.45, 0.5],
        [0.45, -0.5],
        [-0.85, 0.5],
        [-0.85, -0.5],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.cylinder} material={mat('black')} position={[x, 0.3, z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.6, 0.22, 0.6]} castShadow />
      ))}
    </group>
  );
}
