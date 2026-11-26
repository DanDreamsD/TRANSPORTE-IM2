// Operario estilizado (maniquí de primitivas, sin rasgos): torso, cabeza con casco, piernas y brazos que apuntan
// a un punto de agarre. Las demos lo controlan con `pose` mutable leído en cada fotograma.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { GEO, mat } from '../materials';

/** Pose en coordenadas locales del operario (mira hacia +X local). */
export interface WorkerPose {
  /** Punto de agarre de las manos (local). */
  hands: [number, number, number];
  /** Inclinación del tronco hacia delante (rad). */
  lean: number;
  /** Flexión de rodillas 0–1 (baja la cadera). */
  squat: number;
}

const HIP_Y = 0.95;
const SHOULDER = 0.55; // sobre la cadera
const UP = new Vector3(0, 1, 0);

interface Props {
  pose: { current: WorkerPose };
  vest?: string;
}

export function Worker({ pose, vest = '#f2b705' }: Props) {
  const hips = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const legs = useRef<Group>(null);
  const vestMat = useMemo(() => new MeshStandardMaterial({ color: vest, roughness: 0.7 }), [vest]);
  const skin = useMemo(() => new MeshStandardMaterial({ color: '#c99a7a', roughness: 0.8 }), []);
  const tmp = useMemo(() => ({ s: new Vector3(), h: new Vector3(), d: new Vector3(), q: new Quaternion() }), []);

  useFrame(() => {
    const p = pose.current;
    const hipY = HIP_Y - p.squat * 0.3;
    if (hips.current) hips.current.position.y = hipY;
    if (legs.current) legs.current.scale.y = hipY / HIP_Y;
    if (torso.current) torso.current.rotation.z = -p.lean;
    // brazos: del hombro (que se desplaza con la inclinación) a las manos
    const shX = Math.sin(p.lean) * SHOULDER;
    const shY = hipY + Math.cos(p.lean) * SHOULDER;
    [armL.current, armR.current].forEach((arm, i) => {
      if (!arm) return;
      const side = i === 0 ? -0.22 : 0.22;
      tmp.s.set(shX, shY, side);
      tmp.h.set(p.hands[0], p.hands[1], p.hands[2] + side * 0.75);
      tmp.d.subVectors(tmp.h, tmp.s);
      const len = Math.max(0.2, tmp.d.length());
      arm.position.copy(tmp.s).addScaledVector(tmp.d, 0.5);
      tmp.q.setFromUnitVectors(UP, tmp.d.normalize());
      arm.quaternion.copy(tmp.q);
      arm.scale.set(1, len, 1);
    });
  });

  return (
    <group>
      <group ref={legs}>
        {[-0.11, 0.11].map((z) => (
          <mesh key={z} geometry={GEO.box} material={mat('steel')} position={[0, HIP_Y / 2, z]} scale={[0.16, HIP_Y, 0.15]} castShadow />
        ))}
        {[-0.11, 0.11].map((z) => (
          <mesh key={`f${z}`} geometry={GEO.box} material={mat('black')} position={[0.05, 0.04, z]} scale={[0.28, 0.08, 0.14]} />
        ))}
      </group>
      <group ref={hips} position={[0, HIP_Y, 0]}>
        <group ref={torso}>
          <mesh geometry={GEO.box} material={vestMat} position={[0, SHOULDER / 2 + 0.02, 0]} scale={[0.26, SHOULDER + 0.08, 0.44]} castShadow />
          <mesh geometry={GEO.box} material={mat('white')} position={[0.135, SHOULDER / 2, 0]} scale={[0.01, 0.06, 0.44]} />
          <mesh geometry={GEO.box} material={skin} position={[0, SHOULDER + 0.2, 0]} scale={[0.2, 0.24, 0.2]} castShadow />
          <mesh geometry={GEO.cylinder} material={mat('yellow')} position={[0, SHOULDER + 0.34, 0]} scale={[0.26, 0.1, 0.26]} />
        </group>
      </group>
      {[armL, armR].map((ref, i) => (
        <group key={i} ref={ref}>
          <mesh geometry={GEO.box} material={vestMat} scale={[0.09, 1, 0.09]} castShadow />
        </group>
      ))}
    </group>
  );
}
