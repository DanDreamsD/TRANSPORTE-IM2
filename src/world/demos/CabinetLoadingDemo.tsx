// Caso 3 · Schrock Cabinet (NIOSH, 1996): un operario carga gabinetes a mano desde el almacenamiento temporal
// hasta el remolque, sin ayudas mecánicas. Representación didáctica; no reproduce la planta real.
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Worker, type WorkerPose } from '../equipment/Worker';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';
import { sampleKeys, type PoseKey } from './keyframes';

/** Muelle este con la puerta abierta. */
export const LOADING_DOCK_Z = 26;
const PILE = { x: 54.8, z: 21.2 };
const DOOR = { x: 59.2, z: LOADING_DOCK_Z };
const CYCLE = 7;
const CAB = { w: 0.6, h: 0.85, d: 0.55 };

// t, x, z, yaw (mira hacia +X local), lift = flexión (0 de pie · 1 agachado), flag = lleva gabinete
const KEYS: PoseKey[] = [
  { t: 0, x: PILE.x + 0.75, z: PILE.z, yaw: Math.PI, lift: 0, flag: false },
  { t: 0.8, x: PILE.x + 0.75, z: PILE.z, yaw: Math.PI, lift: 1, flag: false },
  { t: 1.4, x: PILE.x + 0.75, z: PILE.z, yaw: Math.PI, lift: 1, flag: true },
  { t: 2.0, x: PILE.x + 0.75, z: PILE.z, yaw: 0.2, lift: 0.1, flag: true },
  { t: 4.2, x: DOOR.x - 1.2, z: DOOR.z - 0.3, yaw: 0, lift: 0.1, flag: true },
  { t: 4.8, x: DOOR.x - 1.2, z: DOOR.z - 0.3, yaw: 0, lift: 0.6, flag: true },
  { t: 5.1, x: DOOR.x - 1.2, z: DOOR.z - 0.3, yaw: 0, lift: 0.6, flag: false },
  { t: 5.4, x: DOOR.x - 1.2, z: DOOR.z - 0.3, yaw: Math.PI, lift: 0, flag: false },
  { t: CYCLE, x: PILE.x + 0.75, z: PILE.z, yaw: Math.PI, lift: 0, flag: false },
];

export function CabinetLoadingDemo() {
  const active = useAnimationActive('cabinet-loading');
  const transitioning = usePresentation((s) => s.transitioning);
  const body = useRef<Group>(null);
  const carried = useRef<Group>(null);
  const placed = useRef<Group>(null);
  const pose = useRef<WorkerPose>({ hands: [0.35, 1.0, 0], lean: 0, squat: 0 });
  const [carrying, setCarrying] = useState(false);

  useFrame(() => {
    const t = isAnimationActive('cabinet-loading') ? demoElapsed() : 0;
    const p = sampleKeys(KEYS, t, CYCLE);
    if (body.current) {
      body.current.position.set(p.x, 0, p.z);
      body.current.rotation.y = p.yaw;
    }
    const handY = p.flag ? 1.0 - p.lift * 0.55 : 1.0 - p.lift * 0.75;
    pose.current.hands = [0.42, handY, 0];
    pose.current.lean = p.lift * 0.9;
    pose.current.squat = p.lift * 0.6;
    if (carried.current) {
      carried.current.visible = p.flag;
      carried.current.position.set(0.5, handY, 0);
    }
    const tt = t % CYCLE;
    if (placed.current) placed.current.visible = tt > 5.1 && tt < 6.6;
    if (p.flag !== carrying) setCarrying(p.flag);
  });

  const show = active && !transitioning;
  return (
    <group>
      {/* almacenamiento temporal de gabinetes */}
      <group position={[PILE.x, 0, PILE.z]}>
        {[0, 1].map((lvl) =>
          [-0.65, 0, 0.65].map((z) => (
            <mesh key={`${lvl}${z}`} geometry={GEO.box} material={mat('carton')} position={[-0.2, CAB.h / 2 + lvl * CAB.h, z]} scale={[CAB.w, CAB.h * 0.98, CAB.d]} castShadow receiveShadow />
          )),
        )}
      </group>
      <group ref={body} position={[PILE.x + 0.75, 0, PILE.z]}>
        <Worker pose={pose} vest="#e5704f" />
        <group ref={carried} visible={false}>
          <mesh geometry={GEO.box} material={mat('carton')} scale={[CAB.d, CAB.h, CAB.w]} castShadow />
        </group>
      </group>
      <group ref={placed} position={[DOOR.x + 0.3, CAB.h / 2, DOOR.z - 0.3]} visible={false}>
        <mesh geometry={GEO.box} material={mat('carton')} scale={[CAB.d, CAB.h, CAB.w]} />
      </group>
      <Tag3D position={[PILE.x - 0.2, 1.9, PILE.z]} title="Almacenamiento temporal" detail="solo el 30 % iba directo a los muelles" visible={show} lead={20} />
      <Tag3D
        position={[DOOR.x - 1.6, 2.1, DOOR.z - 0.3]}
        title="Levantamiento manual"
        detail={carrying ? 'sin ayudas mecánicas' : '2 a 3 levantamientos por minuto'}
        tone="danger"
        visible={show}
        lead={18}
      />
    </group>
  );
}
