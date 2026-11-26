// Equipos genéricos de volumen (versión 1): máquinas, bancos, remolques y oficinas.
// Sirven para dar coherencia a la planta mientras se modelan los equipos detallados (ver docs/ASSET_LIST.md).
import type { ReactNode } from 'react';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';

type P3 = [number, number, number];
const v = (p: Vec3): P3 => [p[0], p[1], p[2]];

interface Placed {
  position: Vec3;
  rotationY?: number;
}

/** Máquina industrial genérica: base, cuerpo, puerta con visor, tablero de control y franja de acento. */
export function Machine({ position, rotationY = 0, size = [3, 2.4, 2], accent = true }: Placed & { size?: Vec3; accent?: boolean }) {
  const [w, h, d] = size;
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.12, 0]} scale={[w + 0.1, 0.24, d + 0.1]} receiveShadow />
      <mesh geometry={GEO.box} material={mat('machine')} position={[0, 0.24 + (h - 0.24) / 2, 0]} scale={[w, h - 0.24, d]} castShadow receiveShadow />
      {accent && <mesh geometry={GEO.box} material={mat('machineAccent')} position={[0, h - 0.18, 0]} scale={[w + 0.02, 0.22, d + 0.02]} />}
      <mesh geometry={GEO.box} material={mat('glass')} position={[-w * 0.12, h * 0.55, d / 2 + 0.01]} scale={[w * 0.45, h * 0.35, 0.02]} />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[w / 2 - 0.35, h * 0.6, d / 2 + 0.12]} scale={[0.45, 0.6, 0.2]} castShadow />
      <mesh geometry={GEO.box} material={mat('hazard')} position={[0, 0.3, d / 2 + 0.02]} scale={[w, 0.12, 0.02]} />
    </group>
  );
}

/** Prensa tipo C / bastidor recto. */
export function Press({ position, rotationY = 0 }: Placed) {
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.25, 0]} scale={[2.6, 0.5, 2]} receiveShadow />
      <mesh geometry={GEO.box} material={mat('machineAccent')} position={[-1.05, 2.3, 0]} scale={[0.5, 3.6, 1.6]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineAccent')} position={[1.05, 2.3, 0]} scale={[0.5, 3.6, 1.6]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineAccent')} position={[0, 4.4, 0]} scale={[2.6, 0.9, 1.8]} castShadow />
      <mesh geometry={GEO.box} material={mat('galvanized')} position={[0, 3.2, 0]} scale={[1.5, 0.5, 1.2]} castShadow />
      <mesh geometry={GEO.box} material={mat('machine')} position={[0, 0.9, 0]} scale={[1.6, 0.3, 1.3]} />
      <mesh geometry={GEO.cylinder} material={mat('steelLight')} position={[0, 5.2, 0]} scale={[0.9, 0.7, 0.9]} castShadow />
    </group>
  );
}

/** Banco de trabajo con tablero perforado. */
export function Workbench({ position, rotationY = 0, length = 2 }: Placed & { length?: number }) {
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={mat('woodDark')} position={[0, 0.9, 0]} scale={[length, 0.06, 0.8]} castShadow receiveShadow />
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={GEO.box} material={mat('steel')} position={[(s * (length - 0.1)) / 2, 0.45, 0]} scale={[0.06, 0.9, 0.7]} />
      ))}
      <mesh geometry={GEO.box} material={mat('steelLight')} position={[0, 1.55, -0.38]} scale={[length, 1.2, 0.04]} />
      <mesh geometry={GEO.box} material={mat('lamp')} position={[0, 2.2, -0.2]} scale={[length * 0.8, 0.04, 0.1]} />
    </group>
  );
}

/** Remolque de camión estacionado en un muelle (exterior). */
export function Trailer({ position, rotationY = 0 }: Placed) {
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={mat('trailer')} position={[0, 2.55, 0]} scale={[12.5, 2.9, 2.55]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.9, 0]} scale={[12.3, 0.35, 1.2]} />
      {[-4.8, -3.6, 4.6].map((x) => (
        <group key={x}>
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={GEO.cylinder} material={mat('black')} position={[x, 0.5, s * 1.0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.35, 1]} />
          ))}
        </group>
      ))}
      <mesh geometry={GEO.box} material={mat('machineAccent')} position={[0, 2.55, 1.29]} scale={[12.3, 0.5, 0.02]} />
    </group>
  );
}

/** Oficina acristalada de planta baja con escritorios y pantallas. */
export function GlassOffice({ position, size, children }: { position: Vec3; size: [number, number]; children?: ReactNode }) {
  const [w, d] = size;
  const h = 3.2;
  return (
    <group position={v(position)}>
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.06, 0]} scale={[w, 0.12, d]} receiveShadow />
      {[
        [0, h / 2, d / 2, w, 0.05],
        [0, h / 2, -d / 2, w, 0.05],
      ].map(([x, y, z, sx, sz], i) => (
        <mesh key={i} geometry={GEO.box} material={mat('glass')} position={[x, y, z]} scale={[sx, h, sz]} />
      ))}
      {[-w / 2, w / 2].map((x) => (
        <mesh key={x} geometry={GEO.box} material={mat('glass')} position={[x, h / 2, 0]} scale={[0.05, h, d]} />
      ))}
      {/* perfilería */}
      {[
        [-w / 2, -d / 2],
        [w / 2, -d / 2],
        [-w / 2, d / 2],
        [w / 2, d / 2],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.box} material={mat('steel')} position={[x, h / 2, z]} scale={[0.1, h, 0.1]} />
      ))}
      <mesh geometry={GEO.box} material={mat('white')} position={[0, h, 0]} scale={[w + 0.1, 0.12, d + 0.1]} />
      {children}
    </group>
  );
}

export function Desk({ position, rotationY = 0 }: Placed) {
  return (
    <group position={v(position)} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.box} material={mat('white')} position={[0, 0.75, 0]} scale={[1.6, 0.05, 0.8]} castShadow />
      <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0.37, 0]} scale={[1.5, 0.74, 0.05]} />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 1.1, -0.25]} scale={[0.7, 0.42, 0.04]} />
    </group>
  );
}
