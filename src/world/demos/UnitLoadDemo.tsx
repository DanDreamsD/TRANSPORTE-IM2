// Demo 3 · Formación de una carga unitaria: 18 cajas sueltas → 3 capas sobre un pallet → film estirable.
// Demostración didáctica (no es una simulación industrial validada).
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Euler, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { Vec3 } from '../../content/types';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { cartonTexture } from '../textures';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';
import { boxStart, landedCount, UNIT_LOAD, unitLoadDone, wrapProgress } from './unitLoadTimeline';

export const UNIT_LOAD_ORIGIN: Vec3 = [-31.5, 0, 9.6];
const BOX: Vec3 = [0.39, 0.3, 0.39];
const LAYER_H = 0.3;
const LOAD_H = 3 * LAYER_H;

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export function UnitLoadDemo() {
  const active = useAnimationActive('unit-load');
  const transitioning = usePresentation((s) => s.transitioning);
  const boxes = useRef<InstancedMesh>(null);
  const wrap = useRef<Mesh>(null);
  const band = useRef<Mesh>(null);
  const [phase, setPhase] = useState<'idle' | 'stacking' | 'done'>('idle');

  const boxMat = useMemo(() => new MeshStandardMaterial({ map: cartonTexture(), roughness: 0.9 }), []);

  // posiciones destino sobre el pallet (locales) y posiciones de la pila de cajas sueltas
  const { targets, pile } = useMemo(() => {
    const targets: Vec3[] = [];
    for (let layer = 0; layer < 3; layer++)
      for (let ix = 0; ix < 3; ix++)
        for (let iz = 0; iz < 2; iz++)
          targets.push([-0.4 + ix * 0.4, PALLET_HEIGHT + LAYER_H / 2 + layer * LAYER_H, -0.2 + iz * 0.4]);
    const pile: { p: Vec3; r: number }[] = [];
    for (let lvl = 0; lvl < 2; lvl++)
      for (let k = 0; k < 9; k++) {
        const ix = k % 3;
        const iz = Math.floor(k / 3);
        const jitter = Math.sin((k + 1) * 12.9898 + lvl * 78.233) * 0.5;
        pile.push({ p: [-2.6 + ix * 0.46 + jitter * 0.06, LAYER_H / 2 + lvl * LAYER_H, -0.5 + iz * 0.46 + jitter * 0.05], r: jitter * 0.6 });
      }
    return { targets, pile };
  }, []);

  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), e: new Euler(), p: new Vector3(), s: new Vector3(...BOX) }), []);

  useFrame(() => {
    const mesh = boxes.current;
    if (!mesh) return;
    // Fuera de su escena, la demo muestra el estado final (carga unitaria terminada).
    const t = isAnimationActive('unit-load') ? demoElapsed() : 1e6;
    for (let i = 0; i < UNIT_LOAD.boxes; i++) {
      const from = pile[UNIT_LOAD.boxes - 1 - i]; // se toman primero las cajas de arriba de la pila
      const to = targets[i];
      const k = Math.min(1, Math.max(0, (t - boxStart(i)) / UNIT_LOAD.flight));
      const e = easeOutCubic(k);
      const arc = Math.sin(Math.PI * k) * 0.9;
      tmp.p.set(
        from.p[0] + (to[0] - from.p[0]) * e,
        from.p[1] + (to[1] - from.p[1]) * e + arc,
        from.p[2] + (to[2] - from.p[2]) * e,
      );
      tmp.e.set(0, from.r * (1 - e), 0);
      tmp.q.setFromEuler(tmp.e);
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
    }
    mesh.instanceMatrix.needsUpdate = true;

    const w = wrapProgress(t);
    if (wrap.current) {
      wrap.current.visible = w > 0;
      wrap.current.scale.set(1.24, Math.max(0.001, LOAD_H * w), 0.84);
      wrap.current.position.y = PALLET_HEIGHT + (LOAD_H * w) / 2;
    }
    if (band.current) {
      band.current.visible = w > 0 && w < 1;
      band.current.position.y = PALLET_HEIGHT + LOAD_H * w;
    }
    const next = unitLoadDone(t) ? 'done' : landedCount(t) > 0 || t > UNIT_LOAD.firstStart ? 'stacking' : 'idle';
    if (next !== phase) setPhase(next);
  });

  const showTags = active && !transitioning;
  const [ox, oy, oz] = UNIT_LOAD_ORIGIN;
  return (
    <group position={[ox, oy, oz]}>
      <Pallet />
      <instancedMesh ref={boxes} args={[GEO.box, boxMat, UNIT_LOAD.boxes]} castShadow receiveShadow frustumCulled={false} />
      <mesh ref={wrap} geometry={GEO.box} material={mat('wrap')} visible={false} />
      <mesh ref={band} geometry={GEO.box} material={mat('white')} scale={[1.27, 0.06, 0.87]} visible={false} />
      {/* zona de preparación delimitada en el piso */}
      <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[-1.2, 0.008, 0.85]} scale={[5.2, 0.12, 1]} />
      <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[-1.2, 0.008, -0.85]} scale={[5.2, 0.12, 1]} />
      <Tag3D position={[-2.15, 0.75, -0.05]} title="Cajas sueltas" detail="cada una = una manipulación" visible={showTags && phase !== 'done'} />
      <Tag3D
        position={[0, PALLET_HEIGHT + LOAD_H + 0.1, 0]}
        title="1 carga unitaria"
        detail="se maneja como un solo objeto"
        tone="accent"
        visible={showTags && phase === 'done'}
        lead={44}
      />
    </group>
  );
}
