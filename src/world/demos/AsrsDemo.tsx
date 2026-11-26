// Demo 11 · AS/RS de carga unitaria: la máquina de almacenamiento y recuperación (SRM: mástil, carro y dispositivo
// de carga) retira un pallet del rack, lo entrega en la estación de entrada/salida y lo vuelve a guardar.
// La segunda SRM se mueve como ambiente. Demostración didáctica.
import { useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { RollerConveyor } from '../equipment/RollerConveyor';
import { PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';

const AISLE_Z = 15.6;
const RACK_Z = 13.6; // fila de racks servida (dirección −Z desde el pasillo)
/** Posición del mástil frente a la ubicación reservada (vano 4, nivel 3 a 5,4 m); el pallet queda 0,45 m al este. */
export const ASRS_SLOT = { x: 18.15, y: 5.4 };
const IO = { x: 5.0, y: 0.8 };
const MAST_H = 12.4;
const EXT = AISLE_Z - RACK_Z;

export type PalletAt = 'rack' | 'srm' | 'io';
interface Key {
  t: number;
  x: number;
  y: number; // altura de la plataforma del dispositivo de carga
  ext: number; // extensión hacia el rack / estación (0 a 1)
  at: PalletAt;
}

const lowR = ASRS_SLOT.y - 0.06;
const highR = ASRS_SLOT.y + 0.12;
const lowIO = IO.y - 0.06;
const highIO = IO.y + 0.12;

const KEYS: Key[] = [
  { t: 0, x: IO.x, y: lowIO, ext: 0, at: 'rack' },
  { t: 5, x: ASRS_SLOT.x, y: lowR, ext: 0, at: 'rack' },
  { t: 6.5, x: ASRS_SLOT.x, y: lowR, ext: 1, at: 'rack' },
  { t: 7.2, x: ASRS_SLOT.x, y: highR, ext: 1, at: 'srm' },
  { t: 8.7, x: ASRS_SLOT.x, y: highR, ext: 0, at: 'srm' },
  { t: 13.7, x: IO.x, y: highIO, ext: 0, at: 'srm' },
  { t: 15.2, x: IO.x, y: highIO, ext: 1, at: 'srm' },
  { t: 15.9, x: IO.x, y: lowIO, ext: 1, at: 'io' },
  { t: 17.4, x: IO.x, y: lowIO, ext: 0, at: 'io' },
  { t: 19, x: IO.x, y: lowIO, ext: 0, at: 'io' },
  { t: 20.5, x: IO.x, y: lowIO, ext: 1, at: 'io' },
  { t: 21.2, x: IO.x, y: highIO, ext: 1, at: 'srm' },
  { t: 22.7, x: IO.x, y: highIO, ext: 0, at: 'srm' },
  { t: 27.7, x: ASRS_SLOT.x, y: highR, ext: 0, at: 'srm' },
  { t: 29.2, x: ASRS_SLOT.x, y: highR, ext: 1, at: 'srm' },
  { t: 29.9, x: ASRS_SLOT.x, y: lowR, ext: 1, at: 'rack' },
  { t: 31.4, x: ASRS_SLOT.x, y: lowR, ext: 0, at: 'rack' },
  { t: 36, x: IO.x, y: lowIO, ext: 0, at: 'rack' },
];
export const ASRS_CYCLE = 36;

function smooth(x: number) {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
}

export function srmAt(t: number): Omit<Key, 't'> {
  const tt = ((t % ASRS_CYCLE) + ASRS_CYCLE) % ASRS_CYCLE;
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= tt) i++;
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? smooth((tt - a.t) / (b.t - a.t)) : 0;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ext: a.ext + (b.ext - a.ext) * k, at: a.at };
}

function Srm({ mastRef, carriageRef, forkRef, children }: { mastRef: Ref<Group>; carriageRef: Ref<Group>; forkRef: Ref<Group>; children?: ReactNode }) {
  return (
    <group ref={mastRef}>
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.2, 0]} scale={[2.2, 0.4, 0.9]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineAccent')} position={[0, MAST_H / 2, 0]} scale={[0.35, MAST_H, 0.5]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, MAST_H + 0.25, 0]} scale={[1.6, 0.3, 0.6]} />
      <group ref={carriageRef}>
        <mesh geometry={GEO.box} material={mat('galvanized')} position={[0.45, -0.12, 0]} scale={[0.95, 0.18, 1.3]} castShadow />
        <group ref={forkRef}>
          {[-0.25, 0.25].map((x) => (
            <mesh key={x} geometry={GEO.box} material={mat('steelLight')} position={[0.45 + x, -0.03, 0]} scale={[0.12, 0.04, 1.25]} />
          ))}
          {children}
        </group>
      </group>
    </group>
  );
}

function PalletLoad() {
  return (
    <group>
      <mesh geometry={GEO.box} material={mat('wood')} position={[0, PALLET_HEIGHT / 2, 0]} scale={[0.8, PALLET_HEIGHT, 1.2]} castShadow />
      <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.5, 0]} scale={[0.78, 1.0, 1.16]} castShadow />
    </group>
  );
}

export function AsrsDemo() {
  const active = useAnimationActive('asrs');
  const transitioning = usePresentation((s) => s.transitioning);
  const mast = useRef<Group>(null);
  const carriage = useRef<Group>(null);
  const fork = useRef<Group>(null);
  const onFork = useRef<Group>(null);
  const inRack = useRef<Group>(null);
  const atIO = useRef<Group>(null);
  const mast2 = useRef<Group>(null);
  const carriage2 = useRef<Group>(null);
  const fork2 = useRef<Group>(null);
  const ioSpeed = useMemo(() => ({ current: 0 }), []);
  const [palletAt, setPalletAt] = useState<PalletAt>('rack');

  useFrame(({ clock }) => {
    const on = isAnimationActive('asrs');
    const s = on ? srmAt(demoElapsed()) : { x: 10, y: 4.2, ext: 0, at: 'rack' as PalletAt };
    if (mast.current) mast.current.position.x = s.x;
    if (carriage.current) carriage.current.position.y = s.y;
    if (fork.current) fork.current.position.z = -s.ext * EXT;
    if (onFork.current) onFork.current.visible = s.at === 'srm';
    if (inRack.current) inRack.current.visible = s.at === 'rack';
    if (atIO.current) atIO.current.visible = s.at === 'io';
    if (s.at !== palletAt) setPalletAt(s.at);
    // segunda SRM (pasillo 25,6): movimiento de ambiente
    const t = clock.getElapsedTime();
    if (mast2.current) mast2.current.position.x = 16 + Math.sin(t * 0.18) * 9;
    if (carriage2.current) carriage2.current.position.y = 5.5 + Math.sin(t * 0.27) * 4.5;
    if (fork2.current) fork2.current.position.z = 0;
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* rieles de los pasillos */}
      {[AISLE_Z, 25.6].map((z) => (
        <mesh key={z} geometry={GEO.box} material={mat('steel')} position={[16.5, 0.03, z]} scale={[24, 0.06, 0.15]} />
      ))}
      {/* SRM principal (pasillo 15,6) */}
      <group position={[0, 0, AISLE_Z]}>
        <Srm mastRef={mast} carriageRef={carriage} forkRef={fork}>
          <group ref={onFork} position={[0.45, 0, 0]} visible={false}>
            <PalletLoad />
          </group>
        </Srm>
      </group>
      <group ref={inRack} position={[ASRS_SLOT.x + 0.45, ASRS_SLOT.y, RACK_Z]}>
        <PalletLoad />
      </group>
      {/* estación de entrada/salida */}
      <group position={[IO.x + 0.45, 0, RACK_Z + 1.3]} rotation={[0, Math.PI / 2, 0]}>
        <RollerConveyor start={[0, IO.y, 0]} length={2.6} width={0.9} speedRef={ioSpeed} />
      </group>
      <group ref={atIO} position={[IO.x + 0.45, IO.y, RACK_Z]} visible={false}>
        <PalletLoad />
      </group>
      {/* segunda SRM */}
      <group position={[0, 0, 25.6]}>
        <Srm mastRef={mast2} carriageRef={carriage2} forkRef={fork2} />
      </group>

      <Tag3D position={[ASRS_SLOT.x, MAST_H - 1, AISLE_Z]} title="SRM" detail="mástil · carro · dispositivo de carga" tone="accent" visible={show} lead={24} />
      <Tag3D
        position={[IO.x + 0.45, 1.0, RACK_Z + 1.3]}
        title="Estación de entrada/salida"
        detail={palletAt === 'io' ? 'pallet entregado' : 'espera la unidad'}
        visible={show}
        lead={10}
      />
    </group>
  );
}
