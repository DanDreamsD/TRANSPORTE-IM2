// Contenido estático de cada zona de la planta (versión 1: volúmenes reconocibles).
// Las zonas sin escena implementada usan equipos genéricos; se detallarán en la fase 4.
import { useMemo } from 'react';
import { PLANT } from '../content/zones';
import { DOCKS_EAST, DOCKS_WEST } from './Building';
import { GEO, mat } from './materials';
import { RackField, type RackRow } from './equipment/RackField';
import { Desk, GlassOffice, Machine, Press, Trailer, Workbench } from './equipment/Machines';
import { Forklift } from './equipment/Forklift';
import { Pallet } from './equipment/Pallet';
import { StaticInstances, type InstanceTransform } from './StaticInstances';

/** Filas de racks del almacén de materia prima (la demo de carga unitaria se ubica frente a la primera fila). */
export const MP_RACKS: RackRow[] = [
  // vanos 1 y 2 del nivel 1 reservados para la demo del caso Dynea
  { x0: -43.5, z: 15.0, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.75, seed: 11, exclude: [[1, 1], [2, 1]] },
  { x0: -43.5, z: 16.2, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.8, seed: 12 },
  { x0: -43.5, z: 21.4, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.85, seed: 13 },
  { x0: -43.5, z: 22.6, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.7, seed: 14 },
  { x0: -43.5, z: 27.8, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.8, seed: 15 },
  { x0: -43.5, z: 29.0, bays: 6, levels: [0, 1.7, 3.4, 5.1], fill: 0.9, seed: 16 },
];

const ASRS_LEVELS = [0, 1.8, 3.6, 5.4, 7.2, 9.0, 10.8];
const ASRS_RACKS: RackRow[] = [
  // vano 4, nivel 3 reservado para la demo del AS/RS
  { x0: 6, z: 13.6, bays: 8, levels: ASRS_LEVELS, fill: 0.85, seed: 21, exclude: [[4, 3]] },
  { x0: 6, z: 17.6, bays: 8, levels: ASRS_LEVELS, fill: 0.8, seed: 22 },
  { x0: 6, z: 23.6, bays: 8, levels: ASRS_LEVELS, fill: 0.9, seed: 23 },
  { x0: 6, z: 27.6, bays: 8, levels: ASRS_LEVELS, fill: 0.75, seed: 24 },
];

const PT_RACKS: RackRow[] = [12, 13.2, 19, 20.2, 26, 27.2].map((z, i) => ({
  x0: 34.5,
  z,
  bays: 4,
  levels: [0, 1.7, 3.4],
  fill: 0.85,
  wrapped: true,
  seed: 31 + i,
  // vano 3, nivel 1 de la primera fila reservado para la demo del montacargas
  exclude: i === 0 ? ([[3, 1]] as [number, number][]) : undefined,
}));

function StagedLoads({ items }: { items: [number, number][] }) {
  const loads = useMemo<InstanceTransform[]>(
    () => items.map(([x, z], i) => ({ position: [x, 0.144 + 0.55, z], scale: [1.18, 1.1 - (i % 3) * 0.2, 0.78] })),
    [items],
  );
  return (
    <group>
      {items.map(([x, z]) => (
        <Pallet key={`${x}:${z}`} position={[x, 0, z]} />
      ))}
      <StaticInstances geometry={GEO.box} material={mat('carton')} items={loads} castShadow receiveShadow />
    </group>
  );
}



export function PlantLayout() {
  return (
    <group>
      {/* Recepción y despacho: remolques en los muelles */}
      {DOCKS_WEST.map((z) => (
        <Trailer key={`w${z}`} position={[PLANT.x[0] - 6.6, 0, z]} />
      ))}
      {DOCKS_EAST.filter((z) => z !== 18).map((z) => (
        <Trailer key={`e${z}`} position={[PLANT.x[1] + 6.6, 0, z]} />
      ))}
      <StagedLoads items={[[-55, -1], [-55, 1], [-53, -1]]} />
      <StagedLoads items={[[56, 12], [56, 14], [54, 12]]} />

      {/* Almacén de materia prima */}
      <RackField rows={MP_RACKS} />
      <Forklift position={[-30.5, 0, 18.8]} rotationY={Math.PI} forkHeight={1.8} />

      {/* Preparación de materiales */}
      <Machine position={[-40, 0, -13]} size={[4.2, 1.6, 1.6]} />
      <Workbench position={[-34, 0, -11]} length={3} rotationY={Math.PI} />
      <Workbench position={[-30, 0, -11]} length={3} rotationY={Math.PI} />
      <Machine position={[-36, 0, -24]} size={[5, 2.2, 3]} />
      <Machine position={[-29.5, 0, -25]} size={[2.4, 2.8, 2.4]} />

      {/* Procesamiento: prensas, CNC y grúa puente */}
      <Press position={[-18, 0, -13]} />
      <Press position={[-13, 0, -13]} />
      <Press position={[-8, 0, -13]} />
      <Machine position={[-17, 0, -25]} size={[4.5, 2.8, 3.2]} />
      <Machine position={[-5, 0, -25]} size={[4.5, 2.8, 3.2]} />

      {/* Estaciones de trabajo manual y celda robótica */}
      {[-19, -15.5, -12, -8.5, -5].map((x) => (
        <Workbench key={x} position={[x, 0, 11]} length={2.6} rotationY={Math.PI} />
      ))}
      <Machine position={[-17, 0, 25]} size={[3, 2, 2]} />

      {/* Línea de ensamble secundaria (la principal es la demo del transportador) */}
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[17, 0.4, -25]} scale={[22, 0.8, 1.1]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={mat('galvanized')} position={[17, 0.82, -25]} scale={[22, 0.05, 0.95]} />
      {[8, 12, 16, 20, 24].map((x) => (
        <Workbench key={x} position={[x, 0, -27.6]} length={2.2} />
      ))}
      <Machine position={[10, 0, -21]} size={[2.6, 2.4, 1.6]} />
      <Machine position={[24, 0, -21]} size={[2.6, 2.4, 1.6]} />

      {/* Almacén automatizado AS/RS */}
      <RackField rows={ASRS_RACKS} />

      {/* Almacén de producto terminado */}
      <RackField rows={PT_RACKS} />

      {/* Oficinas de ingeniería y sala de reuniones */}
      <GlassOffice position={[39.5, 0, -23]} size={[12, 17]}>
        {[-3, 3].map((x) => [-4, 0, 4].map((z) => <Desk key={`${x}:${z}`} position={[x, 0.12, z]} />))}
      </GlassOffice>
      <GlassOffice position={[53.5, 0, -23]} size={[12, 17]}>
        <mesh geometry={GEO.box} material={mat('woodDark')} position={[0, 0.85, 0]} scale={[3, 0.08, 8]} castShadow />
      </GlassOffice>
    </group>
  );
}
