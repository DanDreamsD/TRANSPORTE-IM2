// Tramo de transportador de rodillos (motorizado o por gravedad). Los rodillos giran según la velocidad del tramo.
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Euler, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';
import { rollerTexture } from '../textures';
import { StaticInstances, type InstanceTransform } from '../StaticInstances';

export const ROLLER_RADIUS = 0.03;

interface Props {
  /** Punto inicial, al nivel superior de los rodillos, sobre el eje del transportador. */
  start: Vec3;
  length: number;
  width?: number;
  /** Pendiente descendente en radianes (tramo por gravedad). */
  slope?: number;
  pitch?: number;
  /** Velocidad lineal de la superficie (m/s), leída cada fotograma. */
  speedRef: { current: number };
  legs?: boolean;
}

export function RollerConveyor({ start, length, width = 0.8, slope = 0, pitch = 0.14, speedRef, legs = true }: Props) {
  const rollers = useRef<InstancedMesh>(null);
  const angle = useRef(0);
  const count = Math.floor(length / pitch);
  const rollerMat = useMemo(() => new MeshStandardMaterial({ map: rollerTexture(), metalness: 0.7, roughness: 0.35 }), []);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), e: new Euler(0, 0, 0, 'XYZ'), p: new Vector3(), s: new Vector3(ROLLER_RADIUS * 2, width - 0.04, ROLLER_RADIUS * 2) }), [width]);

  const writeRollers = (phi: number) => {
    const mesh = rollers.current;
    if (!mesh) return;
    tmp.e.set(Math.PI / 2, phi, 0);
    tmp.q.setFromEuler(tmp.e);
    for (let i = 0; i < count; i++) {
      tmp.p.set(pitch / 2 + i * pitch, -ROLLER_RADIUS, 0);
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => writeRollers(0));

  useFrame((_, dt) => {
    const v = speedRef.current;
    if (v === 0) return;
    angle.current -= (v * Math.min(dt, 0.05)) / ROLLER_RADIUS;
    writeRollers(angle.current);
  });

  const frame = useMemo(() => {
    const rails: InstanceTransform[] = [];
    const legItems: InstanceTransform[] = [];
    for (const s of [-1, 1]) {
      rails.push({ position: [length / 2, -0.05, (s * (width + 0.06)) / 2], scale: [length, 0.14, 0.05] });
      rails.push({ position: [length / 2, 0.05, (s * (width + 0.1)) / 2], scale: [length, 0.04, 0.02] }); // guía lateral
    }
    if (legs) {
      const n = Math.max(2, Math.ceil(length / 2.4) + 1);
      for (let i = 0; i < n; i++) {
        const along = (i * length) / (n - 1);
        const x = along * Math.cos(slope);
        const top = -0.1 - Math.sin(slope) * along;
        const legH = start[1] + top;
        for (const s of [-1, 1]) legItems.push({ position: [x, top - legH / 2, (s * width) / 2], scale: [0.06, legH, 0.06] });
        legItems.push({ position: [x, top - legH * 0.7, 0], scale: [0.05, 0.05, width] });
      }
    }
    return { rails, legItems };
  }, [length, width, legs, slope, start]);

  return (
    <group position={[start[0], start[1], start[2]]}>
      <group rotation={[0, 0, -slope]}>
        <instancedMesh ref={rollers} args={[GEO.cylinder, rollerMat, count]} castShadow receiveShadow />
        <StaticInstances geometry={GEO.box} material={mat('steel')} items={frame.rails} castShadow />
      </group>
      {/* las patas no rotan con la pendiente */}
      <StaticInstances geometry={GEO.box} material={mat('steelLight')} items={frame.legItems} castShadow />
    </group>
  );
}
