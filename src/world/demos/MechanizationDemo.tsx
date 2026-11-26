// Demo 2 · Grados de mecanización: cinco estaciones en fila, de manual a completamente automatizado,
// que se iluminan en secuencia. Demostración didáctica.
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MeshBasicMaterial, MeshStandardMaterial, type Group, type Mesh } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { chevronTexture } from '../textures';
import { Forklift } from '../equipment/Forklift';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { AgvModel, HandCart, PalletJack } from '../equipment/Vehicles';
import { RobotArm } from '../equipment/RobotArm';
import { RollerConveyor } from '../equipment/RollerConveyor';
import { demoElapsed, useAnimationActive } from './demoClock';
import { activeMechLevel, MECH_LEVELS } from './mechanizationTimeline';

export const MECH_ROW_Z = -18;
export const MECH_XS = [-42.2, -38.6, -35.0, -31.4, -27.8];

function Load() {
  return (
    <group>
      <Pallet />
      <mesh geometry={GEO.box} material={mat('carton')} position={[0, PALLET_HEIGHT + 0.4, 0]} scale={[1.16, 0.8, 0.78]} castShadow />
    </group>
  );
}

export function MechanizationDemo() {
  const active = useAnimationActive('mechanization-levels');
  const transitioning = usePresentation((s) => s.transitioning);
  const [level, setLevel] = useState(-1);
  const agv = useRef<Group>(null);
  const plcBox = useRef<Mesh>(null);
  const conveyorSpeed = useRef(0.35);
  const pads = useMemo(
    () => MECH_LEVELS.map((l) => new MeshStandardMaterial({ color: l.color, roughness: 0.7, emissive: l.color, emissiveIntensity: 0.05, transparent: true, opacity: 0.85 })),
    [],
  );
  const arrowMat = useMemo(() => {
    const t = chevronTexture().clone();
    t.needsUpdate = true;
    t.repeat.set(6, 1);
    return new MeshBasicMaterial({ map: t, color: '#f5b301', transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false });
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    // AGV: ida y vuelta sobre la cinta
    if (agv.current) agv.current.position.z = MECH_ROW_Z + Math.sin(t * 0.6) * 1.1;
    // caja recorriendo el transportador corto (estación 3)
    if (plcBox.current) plcBox.current.position.x = MECH_XS[2] - 1.0 + ((t * 0.35) % 2.0);
    if (arrowMat.map) arrowMat.map.offset.x -= Math.min(dt, 0.05) * 0.5;
    const l = active ? activeMechLevel(demoElapsed()) : -1;
    if (l !== level) setLevel(l);
    pads.forEach((m, i) => {
      const target = l === i ? 0.75 : l === -1 && active ? 0.25 : 0.05;
      m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, dt * 6);
    });
  });

  const show = active && !transitioning;
  const z = MECH_ROW_Z;
  return (
    <group>
      {MECH_XS.map((x, i) => (
        <mesh key={i} geometry={GEO.plane} material={pads[i]} rotation-x={-Math.PI / 2} position={[x, 0.011, z]} scale={[3.2, 3.6, 1]} receiveShadow />
      ))}
      {/* flecha de la Figura 5 */}
      <mesh geometry={GEO.plane} material={arrowMat} rotation-x={-Math.PI / 2} position={[-35, 0.014, z + 2.45]} scale={[17.6, 0.7, 1]} />

      {/* 1 · Manual */}
      <HandCart position={[MECH_XS[0] - 0.9, 0, z - 1.1]} rotationY={-Math.PI / 2} />
      <PalletJack position={[MECH_XS[0] + 0.1, 0, z + 0.9]} rotationY={0}>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <Load />
        </group>
      </PalletJack>

      {/* 2 · Mecanizado */}
      <Forklift position={[MECH_XS[1], 0, z - 0.6]} rotationY={-Math.PI / 2} forkHeight={0.3}>
        <group position={[1.55, -0.07, 0]}>
          <Load />
        </group>
      </Forklift>

      {/* 3 · Mecanizado con computadora: transportador con PLC y sensor */}
      <RollerConveyor start={[MECH_XS[2] - 1.2, 0.8, z - 0.3]} length={2.4} width={0.6} speedRef={conveyorSpeed} />
      <mesh ref={plcBox} geometry={GEO.box} material={mat('carton')} position={[MECH_XS[2], 0.8 + 0.15, z - 0.3]} scale={[0.36, 0.3, 0.36]} castShadow />
      <group position={[MECH_XS[2] + 0.4, 0, z + 1.0]}>
        <mesh geometry={GEO.box} material={mat('machine')} position={[0, 0.9, 0]} scale={[0.7, 1.8, 0.4]} castShadow />
        <mesh geometry={GEO.box} material={mat('lamp')} position={[0, 1.35, 0.205]} scale={[0.46, 0.3, 0.01]} />
        <mesh geometry={GEO.cylinder} material={mat('green')} position={[-0.15, 0.9, 0.21]} rotation={[Math.PI / 2, 0, 0]} scale={[0.07, 0.02, 0.07]} />
        <mesh geometry={GEO.cylinder} material={mat('pipeRed')} position={[0.15, 0.9, 0.21]} rotation={[Math.PI / 2, 0, 0]} scale={[0.07, 0.02, 0.07]} />
      </group>

      {/* 4 · Automatizado: AGV sobre cinta magnética */}
      <mesh geometry={GEO.plane} material={mat('machineDark')} rotation-x={-Math.PI / 2} position={[MECH_XS[3], 0.013, z]} scale={[0.08, 3.2, 1]} />
      <AgvModel groupRef={agv} position={[MECH_XS[3], 0, z]} rotationY={-Math.PI / 2}>
        <mesh geometry={GEO.box} material={mat('rackUpright')} position={[0, 0.35, 0]} scale={[0.9, 0.7, 0.6]} castShadow />
      </AgvModel>

      {/* 5 · Completamente automatizado: celda robotizada */}
      <RobotArm position={[MECH_XS[4] - 0.3, 0, z]} />
      {[1, -1].map((s) => (
        <group key={s} position={[MECH_XS[4] - 0.3 + 0.57, 0, z + s * 1.12]}>
          <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0.35, 0]} scale={[0.6, 0.7, 0.6]} castShadow />
        </group>
      ))}

      {show &&
        MECH_LEVELS.map((l, i) => (
          <Html key={l.name} position={[MECH_XS[i], 3.05, z]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
            <div className={`mech-label ${level === i ? 'is-active' : ''}`} style={{ ['--lc' as string]: l.color, ['--lt' as string]: l.text }}>
              <b>{i + 1}</b> {l.short}
            </div>
          </Html>
        ))}
      {show && (
        <Html position={[-35, 0.05, z + 2.45]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
          <div className="floor-label floor-label--arrow">Más inversión · más velocidad · más control · menos flexibilidad →</div>
        </Html>
      )}
    </group>
  );
}
