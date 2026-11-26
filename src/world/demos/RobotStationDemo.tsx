// Demo 9 · Estación de trabajo: transferencia sincrónica (automatización fija), compensador que sostiene la carga
// mientras el operario la guía, y celda con brazo robótico y su EOAT. Demostración didáctica.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Matrix4, Quaternion, Vector3, type Group, type Mesh } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { RobotArm } from '../equipment/RobotArm';
import { Worker, type WorkerPose } from '../equipment/Worker';
import { Tag3D } from '../boards/Tag3D';
import { useAnimationActive } from './demoClock';

const CELL = { x: -8, z: 24 };
const TRANSFER = { x0: -20.5, x1: -12.5, z: 18.2, y: 0.95 };
const STATIONS = 5;
const STEP = 2.6; // s por avance sincrónico
const BAL = { x: -3.4, z: 17.4 };

export function RobotStationDemo() {
  const active = useAnimationActive('robot-arm');
  const transitioning = usePresentation((s) => s.transitioning);
  const parts = useRef<InstancedMesh>(null);
  const balLoad = useRef<Group>(null);
  const balCable = useRef<Mesh>(null);
  const pose = useRef<WorkerPose>({ hands: [0.45, 1.1, 0], lean: 0.1, squat: 0 });
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3(0.38, 0.28, 0.38) }), []);
  const pitch = (TRANSFER.x1 - TRANSFER.x0) / (STATIONS - 1);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // transferencia sincrónica: todas las piezas avanzan a la vez una estación y se detienen
    const cycle = t / STEP;
    const k = cycle % 1;
    const move = k < 0.35 ? k / 0.35 : 1;
    const e = move * move * (3 - 2 * move);
    if (parts.current) {
      for (let i = 0; i < STATIONS; i++) {
        let x = TRANSFER.x0 + (i + e) * pitch;
        let s = 1;
        if (i === STATIONS - 1) s = 1 - e; // la última sale de la línea
        if (i === 0 && move < 1) x = TRANSFER.x0 + e * pitch;
        tmp.p.set(Math.min(x, TRANSFER.x1 + pitch), TRANSFER.y + 0.14, TRANSFER.z);
        tmp.s.set(0.38 * s, 0.28 * s, 0.38 * s);
        parts.current.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
      }
      parts.current.instanceMatrix.needsUpdate = true;
    }
    // compensador: la carga sube y baja; el operario solo la guía
    const y = 0.95 + Math.sin(t * 0.8) * 0.35;
    if (balLoad.current) balLoad.current.position.y = y;
    if (balCable.current) {
      balCable.current.scale.y = 3.0 - y;
      balCable.current.position.y = (3.0 + y) / 2;
    }
    pose.current.hands = [0.55, y + 0.05, 0];
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* ---------- transferencia sincrónica ---------- */}
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[(TRANSFER.x0 + TRANSFER.x1) / 2, TRANSFER.y / 2, TRANSFER.z]} scale={[TRANSFER.x1 - TRANSFER.x0 + 1.6, TRANSFER.y, 0.9]} castShadow />
      {Array.from({ length: STATIONS }, (_, i) => (
        <mesh key={i} geometry={GEO.box} material={mat('machineAccent')} position={[TRANSFER.x0 + i * pitch, TRANSFER.y + 0.02, TRANSFER.z]} scale={[0.6, 0.04, 0.7]} />
      ))}
      <instancedMesh ref={parts} args={[GEO.box, mat('galvanized'), STATIONS]} castShadow frustumCulled={false} />
      <Tag3D position={[(TRANSFER.x0 + TRANSFER.x1) / 2, TRANSFER.y + 0.5, TRANSFER.z]} title="Transferencia sincrónica" detail="todas las piezas avanzan a la vez" visible={show} lead={26} />

      {/* ---------- compensador (balanceador) ---------- */}
      <group position={[BAL.x, 0, BAL.z]}>
        <mesh geometry={GEO.cylinder} material={mat('machineAccent')} position={[0, 1.6, 0]} scale={[0.16, 3.2, 0.16]} castShadow />
        <mesh geometry={GEO.box} material={mat('machineAccent')} position={[-0.7, 3.1, 0]} scale={[1.6, 0.14, 0.14]} />
        <mesh geometry={GEO.box} material={mat('machineDark')} position={[-1.3, 3.0, 0]} scale={[0.26, 0.22, 0.22]} />
        <group position={[-1.3, 0, 0]}>
          <mesh ref={balCable} geometry={GEO.box} material={mat('steel')} scale={[0.03, 1, 0.03]} />
          <group ref={balLoad}>
            <mesh geometry={GEO.box} material={mat('yellow')} position={[0, 0.2, 0]} scale={[0.14, 0.1, 0.14]} />
            <mesh geometry={GEO.cylinder} material={mat('galvanized')} rotation={[Math.PI / 2, 0, 0]} scale={[0.44, 0.4, 0.44]} castShadow />
          </group>
        </group>
        <group position={[-1.95, 0, 0]}>
          <Worker pose={pose} vest="#3f9a5a" />
        </group>
        <Tag3D position={[-1.3, 1.9, 0]} title="Compensador" detail="sostiene el peso; el operario solo guía" visible={show} lead={22} />
      </group>

      {/* ---------- celda robótica ---------- */}
      <group position={[CELL.x, 0, CELL.z]}>
        <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[0, 0.006, 0]} scale={[7, 6, 1]} receiveShadow />
        {[
          [0, -3, 7, 0.04],
          [0, 3, 7, 0.04],
          [-3.5, 0, 0.04, 6],
          [3.5, 0, 0.04, 6],
        ].map(([x, z, sx, sz], i) => (
          <mesh key={i} geometry={GEO.box} material={mat('glass')} position={[x, 1.1, z]} scale={[sx, 2.2, sz]} />
        ))}
        <RobotArm position={[0, 0, 0]} tool="gripper" animate cycle={6} />
        {[1, -1].map((s) => (
          <mesh key={s} geometry={GEO.box} material={mat('steel')} position={[0.57, 0.35, s * 1.12]} scale={[0.6, 0.7, 0.6]} castShadow />
        ))}
        <Tag3D position={[0, 2.6, 0]} title="Robot + EOAT" detail="pinza en el extremo del brazo" tone="accent" visible={show} lead={24} />
      </group>
    </group>
  );
}
