// Nave industrial: piso, muros con muelles, columnas, cerchas, correas, luminarias y tuberías.
// Sin cubierta (estilo «cutaway») para permitir vistas aéreas y rutas de cámara por encima de los muros.
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { PLANT } from '../content/zones';
import { PALETTE } from './palette';
import { concreteTexture } from './textures';
import { GEO, mat } from './materials';
import { StaticInstances, type InstanceTransform } from './StaticInstances';

const W = PLANT.x[1] - PLANT.x[0]; // 120
const D = PLANT.z[1] - PLANT.z[0]; // 70
const H = PLANT.wallHeight; // 10
const T = 0.3; // espesor de muro
const LOWER = 2.4; // zócalo de concreto

export const DOCKS_WEST = [-4, 6, 16];
/** Muelle con la puerta abierta (descarga del camión, escena 1.2). */
export const OPEN_DOCK_Z = 6;
export const DOCKS_EAST = [10, 18, 26];
export const COLUMN_ROWS_Z = [-5.5, 5.5];

function box(position: [number, number, number], scale: [number, number, number]): InstanceTransform {
  return { position, scale };
}

export function Building() {
  const floorMat = useMemo(() => {
    const tex = concreteTexture().clone();
    tex.needsUpdate = true;
    tex.repeat.set(W / 6, D / 6);
    return new MeshStandardMaterial({ map: tex, color: '#c9cbc8', roughness: 0.62, metalness: 0.05 });
  }, []);

  const walls = useMemo(() => {
    const lower: InstanceTransform[] = [];
    const upper: InstanceTransform[] = [];
    const x0 = PLANT.x[0], x1 = PLANT.x[1], z0 = PLANT.z[0], z1 = PLANT.z[1];
    // norte y sur
    for (const z of [z0 - T / 2, z1 + T / 2]) {
      lower.push(box([0, LOWER / 2, z], [W + 2 * T, LOWER, T]));
      upper.push(box([0, LOWER + (H - LOWER) / 2, z], [W + 2 * T, H - LOWER, T * 0.6]));
    }
    // oeste y este
    for (const x of [x0 - T / 2, x1 + T / 2]) {
      lower.push(box([x, LOWER / 2, 0], [T, LOWER, D]));
      upper.push(box([x, LOWER + (H - LOWER) / 2, 0], [T * 0.6, H - LOWER, D]));
    }
    return { lower, upper };
  }, []);

  const docks = useMemo(() => {
    const doors: InstanceTransform[] = [];
    const bumpers: InstanceTransform[] = [];
    const levelers: InstanceTransform[] = [];
    const openings: InstanceTransform[] = [];
    for (const z of DOCKS_WEST) {
      if (z === OPEN_DOCK_Z) {
        // muelle abierto: puerta enrollada arriba y vano oscuro hacia el remolque
        doors.push(box([PLANT.x[0] + 0.05, 3.95, z], [0.1, 0.5, 3.6]));
        openings.push(box([PLANT.x[0] + 0.04, 1.85, z], [0.06, 3.7, 3.4]));
      } else doors.push(box([PLANT.x[0] + 0.05, 2.1, z], [0.1, 4.2, 3.6]));
      bumpers.push(box([PLANT.x[0] + 0.15, 4.35, z], [0.2, 0.3, 3.9]));
      levelers.push(box([PLANT.x[0] + 1.3, 0.02, z], [2.6, 0.04, 2.4]));
    }
    for (const z of DOCKS_EAST) {
      doors.push(box([PLANT.x[1] - 0.05, 2.1, z], [0.1, 4.2, 3.6]));
      bumpers.push(box([PLANT.x[1] - 0.15, 4.35, z], [0.2, 0.3, 3.9]));
      levelers.push(box([PLANT.x[1] - 1.3, 0.02, z], [2.6, 0.04, 2.4]));
    }
    return { doors, bumpers, levelers, openings };
  }, []);

  const columns = useMemo(() => {
    const cols: InstanceTransform[] = [];
    const guards: InstanceTransform[] = [];
    for (let x = -48; x <= 48; x += 12) {
      for (const z of COLUMN_ROWS_Z) {
        cols.push(box([x, H / 2 + 0.25, z], [0.42, H + 0.5, 0.42]));
        guards.push(box([x, 0.5, z], [0.62, 1.0, 0.62]));
      }
      for (const z of [PLANT.z[0] + 0.3, PLANT.z[1] - 0.3]) cols.push(box([x, H / 2 + 0.25, z], [0.42, H + 0.5, 0.42]));
    }
    return { cols, guards };
  }, []);

  const trusses = useMemo(() => {
    const items: InstanceTransform[] = [];
    const yb = H + 0.4;
    const yt = H + 2.0;
    for (let x = PLANT.x[0]; x <= PLANT.x[1]; x += 12) {
      items.push(box([x, yb, 0], [0.2, 0.22, D]));
      items.push(box([x, yt, 0], [0.2, 0.22, D]));
      const step = 3.5;
      for (let z = PLANT.z[0]; z <= PLANT.z[1] + 0.01; z += step) {
        items.push(box([x, (yb + yt) / 2, z], [0.12, yt - yb, 0.12]));
        if (z + step <= PLANT.z[1] + 0.01) {
          const len = Math.hypot(step, yt - yb);
          const ang = Math.atan2(yt - yb, step);
          const flip = Math.round((z - PLANT.z[0]) / step) % 2 === 0 ? 1 : -1;
          items.push({ position: [x, (yb + yt) / 2, z + step / 2], rotation: [flip * ang, 0, 0], scale: [0.1, 0.1, len] });
        }
      }
    }
    // correas longitudinales
    for (let z = PLANT.z[0]; z <= PLANT.z[1]; z += 7) items.push(box([0, yt + 0.2, z], [W, 0.16, 0.16]));
    return items;
  }, []);

  const lamps = useMemo(() => {
    const items: InstanceTransform[] = [];
    for (let x = -54; x <= 54; x += 12) for (let z = -28; z <= 28; z += 10) items.push(box([x, H - 0.4, z], [0.7, 0.18, 0.7]));
    return items;
  }, []);

  const pipes = useMemo(() => {
    const blue: InstanceTransform[] = [];
    const red: InstanceTransform[] = [];
    const steel: InstanceTransform[] = [];
    blue.push({ position: [0, 8.2, PLANT.z[0] + 0.8], rotation: [0, 0, Math.PI / 2], scale: [0.3, W - 1, 0.3] });
    red.push({ position: [0, 8.8, PLANT.z[0] + 0.8], rotation: [0, 0, Math.PI / 2], scale: [0.22, W - 1, 0.22] });
    blue.push({ position: [0, 8.2, PLANT.z[1] - 0.8], rotation: [0, 0, Math.PI / 2], scale: [0.3, W - 1, 0.3] });
    steel.push({ position: [0, 9.3, 0], rotation: [0, 0, Math.PI / 2], scale: [0.7, W - 1, 0.7] }); // ducto principal
    // soportes de tubería
    for (let x = -56; x <= 56; x += 8) {
      steel.push({ position: [x, 8.5, PLANT.z[0] + 0.8], scale: [0.08, 1.4, 0.08] });
      steel.push({ position: [x, 8.5, PLANT.z[1] - 0.8], scale: [0.08, 1.4, 0.08] });
    }
    return { blue, red, steel };
  }, []);

  return (
    <group>
      {/* terreno exterior */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[420, 320]} />
        <meshStandardMaterial color={PALETTE.ground} roughness={1} />
      </mesh>
      {/* piso de la nave */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[W, D]} />
      </mesh>

      <StaticInstances geometry={GEO.box} material={mat('wallLower')} items={walls.lower} receiveShadow castShadow />
      <StaticInstances geometry={GEO.box} material={mat('wallCladding')} items={walls.upper} receiveShadow />
      <StaticInstances geometry={GEO.box} material={mat('door')} items={docks.doors} />
      <StaticInstances geometry={GEO.box} material={mat('black')} items={docks.bumpers} />
      <StaticInstances geometry={GEO.box} material={mat('opening')} items={docks.openings} />
      <StaticInstances geometry={GEO.box} material={mat('hazard')} items={docks.levelers} receiveShadow />
      <StaticInstances geometry={GEO.box} material={mat('steel')} items={columns.cols} castShadow />
      <StaticInstances geometry={GEO.box} material={mat('hazard')} items={columns.guards} />
      <StaticInstances geometry={GEO.box} material={mat('steelLight')} items={trusses} />
      <StaticInstances geometry={GEO.box} material={mat('lamp')} items={lamps} />
      <StaticInstances geometry={GEO.cylinderLow} material={mat('pipeBlue')} items={pipes.blue} />
      <StaticInstances geometry={GEO.cylinderLow} material={mat('pipeRed')} items={pipes.red} />
      <StaticInstances geometry={GEO.cylinderLow} material={mat('galvanized')} items={pipes.steel} />
    </group>
  );
}
