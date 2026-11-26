// Brazo robótico articulado (base giratoria, hombro, codo, muñeca) con herramental de extremo de brazo (EOAT).
// Con `animate`, ejecuta un ciclo de tomar y dejar (pick-and-place) entre dos puntos.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';

interface Props {
  position?: Vec3;
  rotationY?: number;
  animate?: boolean;
  /** Duración del ciclo completo (s). */
  cycle?: number;
  /** Tipo de herramental: ventosa o pinza. */
  tool?: 'suction' | 'gripper';
}

const UPPER = 1.0;
const FORE = 0.85;

function ease(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function RobotArm({ position = [0, 0, 0], rotationY = 0, animate = true, cycle = 6, tool = 'suction' }: Props) {
  const turret = useRef<Group>(null);
  const shoulder = useRef<Group>(null);
  const elbow = useRef<Group>(null);
  const wrist = useRef<Group>(null);
  const part = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = (clock.getElapsedTime() % cycle) / cycle;
    // fases: bajar a tomar (0–0.15), subir y girar (0.15–0.5), bajar a dejar (0.5–0.65), volver (0.65–1)
    let yaw: number;
    let reach: number; // 0 = arriba, 1 = abajo
    let holding: boolean;
    if (t < 0.15) {
      yaw = -1.1;
      reach = ease(t / 0.15);
      holding = t > 0.12;
    } else if (t < 0.5) {
      const k = ease((t - 0.15) / 0.35);
      yaw = -1.1 + 2.2 * k;
      reach = 1 - Math.sin(Math.PI * k) * 0.9 - (k < 0.5 ? k : 1 - k) * 0.2;
      holding = true;
    } else if (t < 0.65) {
      yaw = 1.1;
      reach = 1 - ease((t - 0.5) / 0.15) * 0.0;
      holding = t < 0.62;
    } else {
      const k = ease((t - 0.65) / 0.35);
      yaw = 1.1 - 2.2 * k;
      reach = 1 - Math.sin(Math.PI * k) * 0.9;
      holding = false;
    }
    const r = Math.min(1, Math.max(0, reach));
    if (turret.current) turret.current.rotation.y = yaw;
    if (shoulder.current) shoulder.current.rotation.z = -0.35 - 0.5 * r;
    if (elbow.current) elbow.current.rotation.z = -1.0 - 0.45 * r;
    if (wrist.current) wrist.current.rotation.z = 1.35 + 0.95 * r - 0.0;
    if (part.current) part.current.visible = holding;
  });

  return (
    <group position={[position[0], position[1], position[2]]} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.cylinder} material={mat('machineDark')} position={[0, 0.15, 0]} scale={[0.7, 0.3, 0.7]} castShadow />
      <group ref={turret} position={[0, 0.3, 0]}>
        <mesh geometry={GEO.cylinder} material={mat('yellow')} position={[0, 0.2, 0]} scale={[0.55, 0.4, 0.55]} castShadow />
        <group ref={shoulder} position={[0, 0.5, 0]} rotation={[0, 0, -0.6]}>
          <mesh geometry={GEO.cylinder} material={mat('machineDark')} rotation={[Math.PI / 2, 0, 0]} scale={[0.3, 0.38, 0.3]} />
          <mesh geometry={GEO.box} material={mat('yellow')} position={[0, UPPER / 2, 0]} scale={[0.22, UPPER, 0.24]} castShadow />
          <group ref={elbow} position={[0, UPPER, 0]} rotation={[0, 0, -1.2]}>
            <mesh geometry={GEO.cylinder} material={mat('machineDark')} rotation={[Math.PI / 2, 0, 0]} scale={[0.24, 0.3, 0.24]} />
            <mesh geometry={GEO.box} material={mat('yellow')} position={[0, FORE / 2, 0]} scale={[0.16, FORE, 0.18]} castShadow />
            <group ref={wrist} position={[0, FORE, 0]} rotation={[0, 0, 1.8]}>
              <mesh geometry={GEO.cylinder} material={mat('machineDark')} position={[0, 0.08, 0]} scale={[0.14, 0.16, 0.14]} />
              {tool === 'suction' ? (
                <>
                  <mesh geometry={GEO.box} material={mat('steelLight')} position={[0, 0.2, 0]} scale={[0.26, 0.04, 0.26]} />
                  {[-0.08, 0.08].map((x) => [-0.08, 0.08].map((z) => (
                    <mesh key={`${x}${z}`} geometry={GEO.cylinder} material={mat('black')} position={[x, 0.25, z]} scale={[0.06, 0.05, 0.06]} />
                  )))}
                </>
              ) : (
                [-0.08, 0.08].map((z) => <mesh key={z} geometry={GEO.box} material={mat('steelLight')} position={[0, 0.24, z]} scale={[0.05, 0.14, 0.03]} />)
              )}
              <group ref={part} position={[0, 0.42, 0]} visible={false}>
                <mesh geometry={GEO.box} material={mat('carton')} scale={[0.34, 0.3, 0.34]} castShadow />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
