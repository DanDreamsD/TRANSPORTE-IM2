// Caso 2 · Dynea Pakistan: la carga unitaria pasa de 35 a 50 sacos por pallet para aprovechar la altura
// que sobraba en los racks (Waseem et al., 2021). La disposición de sacos por capa es ILUSTRATIVA:
// el artículo solo reporta la cantidad de sacos. Demostración didáctica.
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { Vec3 } from '../../content/types';
import { usePresentation } from '../../state/store';
import { GEO } from '../materials';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, isAnimationActive, useAnimationActive } from './demoClock';

const RACK_Z = 15.0;
const LEVEL_Y = 1.7;
const NEXT_BEAM_BOTTOM = 3.4 - 0.12;
// vistos desde el pasillo (mirando al sur) el «antes» queda a la izquierda
const BAY_BEFORE_X = -36.75;
const BAY_AFTER_X = -39.45;
const LAYER_H = 0.14;
const PER_LAYER = 5;
export const SACKS_BEFORE = 35;
export const SACKS_AFTER = 50;
const DROP_START = 1.5;
const DROP_EVERY = 1.1;
const DROP_TIME = 0.6;

/** Posiciones locales de los sacos (capas de 5, alternando el sentido para trabar la carga). */
export function sackLayout(count: number): { p: Vec3; s: Vec3 }[] {
  const out: { p: Vec3; s: Vec3 }[] = [];
  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / PER_LAYER);
    const k = i % PER_LAYER;
    const flip = layer % 2 === 1 ? -1 : 1;
    const y = PALLET_HEIGHT + LAYER_H / 2 + layer * LAYER_H;
    if (k < 3) out.push({ p: [-0.4 + k * 0.4, y, -0.25 * flip], s: [0.38, LAYER_H * 0.94, 0.47] });
    else out.push({ p: [-0.3 + (k - 3) * 0.6, y, 0.25 * flip], s: [0.58, LAYER_H * 0.94, 0.47] });
  }
  return out;
}

export function sacksAt(t: number): number {
  const layers = Math.max(0, Math.min(3, Math.floor((t - DROP_START) / DROP_EVERY) + 1));
  const landed = t - DROP_START - (layers - 1) * DROP_EVERY >= DROP_TIME ? layers : Math.max(0, layers - 1);
  return SACKS_BEFORE + landed * PER_LAYER;
}

export function DyneaDemo() {
  const active = useAnimationActive('dynea-rack');
  const transitioning = usePresentation((s) => s.transitioning);
  const before = useRef<InstancedMesh>(null);
  const after = useRef<InstancedMesh>(null);
  const [count, setCount] = useState(SACKS_AFTER);
  const sackMat = useMemo(() => new MeshStandardMaterial({ color: '#e9e3d2', roughness: 0.85 }), []);
  const gapMat = useMemo(() => new MeshStandardMaterial({ color: '#e0483e', transparent: true, opacity: 0.22, depthWrite: false }), []);
  const layoutBefore = useMemo(() => sackLayout(SACKS_BEFORE), []);
  const layoutAfter = useMemo(() => sackLayout(SACKS_AFTER), []);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3() }), []);
  const ready = useRef(false);

  useFrame(() => {
    if (before.current && !ready.current) {
      layoutBefore.forEach((it, i) => before.current!.setMatrixAt(i, tmp.m.compose(tmp.p.set(...it.p), tmp.q, tmp.s.set(...it.s))));
      before.current.instanceMatrix.needsUpdate = true;
      ready.current = true;
    }
    const mesh = after.current;
    if (!mesh) return;
    const t = isAnimationActive('dynea-rack') ? demoElapsed() : 1e6;
    let shown = SACKS_BEFORE;
    layoutAfter.forEach((it, i) => {
      let dy = 0;
      if (i >= SACKS_BEFORE) {
        const layer = Math.floor((i - SACKS_BEFORE) / PER_LAYER);
        const start = DROP_START + layer * DROP_EVERY;
        if (t < start) {
          tmp.s.set(0, 0, 0);
          mesh.setMatrixAt(i, tmp.m.compose(tmp.p.set(...it.p), tmp.q, tmp.s));
          return;
        }
        const k = Math.min(1, (t - start) / DROP_TIME);
        dy = (1 - k * k) * 0.45;
        if (k >= 1) shown = Math.max(shown, i + 1);
      }
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p.set(it.p[0], it.p[1] + dy, it.p[2]), tmp.q, tmp.s.set(...it.s)));
    });
    mesh.instanceMatrix.needsUpdate = true;
    const c = Math.ceil(shown / PER_LAYER) * PER_LAYER;
    if (c !== count) setCount(c);
  });

  const topBefore = LEVEL_Y + PALLET_HEIGHT + (SACKS_BEFORE / PER_LAYER) * LAYER_H;
  const gapH = NEXT_BEAM_BOTTOM - topBefore;
  const show = active && !transitioning;
  return (
    <group>
      <group position={[BAY_BEFORE_X, LEVEL_Y, RACK_Z]}>
        <Pallet length={1.2} width={1.0} />
        <instancedMesh ref={before} args={[GEO.box, sackMat, SACKS_BEFORE]} castShadow />
      </group>
      <mesh geometry={GEO.box} material={gapMat} position={[BAY_BEFORE_X, topBefore + gapH / 2, RACK_Z]} scale={[1.2, gapH, 1.0]} visible={active} />
      <group position={[BAY_AFTER_X, LEVEL_Y, RACK_Z]}>
        <Pallet length={1.2} width={1.0} />
        <instancedMesh ref={after} args={[GEO.box, sackMat, SACKS_AFTER]} castShadow frustumCulled={false} />
      </group>
      <Tag3D position={[BAY_BEFORE_X, 0.5, RACK_Z - 0.6]} title={`Antes · ${SACKS_BEFORE} sacos/pallet`} detail="espacio sin usar bajo el larguero" tone="danger" visible={show} lead={8} />
      <Tag3D position={[BAY_AFTER_X, 0.5, RACK_Z - 0.6]} title={`Después · ${count} sacos/pallet`} detail="aprovecha la altura del rack" tone="ok" visible={show} lead={8} />
    </group>
  );
}
