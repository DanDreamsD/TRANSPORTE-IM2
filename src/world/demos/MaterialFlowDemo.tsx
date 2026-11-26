// Demo 1 · Flujo de materiales de recepción a despacho: flecha animada sobre el piso y cargas que recorren la planta.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, InstancedMesh, Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from 'three';
import { MATERIAL_FLOW_PATH } from '../../content/zones';
import { GEO, mat } from '../materials';
import { chevronTexture } from '../textures';
import { useAnimationActive } from './demoClock';

const RIBBON_W = 1.1;
const Y = 0.03;
const LOADS = 9;

function ribbonGeometry(curve: CatmullRomCurve3, segments: number, width: number): BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const length = curve.getLength();
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const side = new Vector3().crossVectors(up, t).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, Y, p.z - side.z, p.x + side.x, Y, p.z + side.z);
    const v = (u * length) / 1.6;
    uv.push(v, 0, v, 1);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('uv', new BufferAttribute(new Float32Array(uv), 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function MaterialFlowDemo() {
  const active = useAnimationActive('material-flow');
  const curve = useMemo(
    () => new CatmullRomCurve3(MATERIAL_FLOW_PATH.map(([x, z]) => new Vector3(x, 0, z)), false, 'centripetal', 0.5),
    [],
  );
  const geometry = useMemo(() => ribbonGeometry(curve, 900, RIBBON_W), [curve]);
  const material = useMemo(() => {
    const tex = chevronTexture().clone();
    tex.needsUpdate = true;
    return new MeshBasicMaterial({ map: tex, color: '#f5b301', transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  }, []);
  const pallets = useRef<InstancedMesh>(null);
  const loads = useRef<InstancedMesh>(null);
  const progress = useRef(0);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3(), up: new Vector3(0, 1, 0), dir: new Vector3() }), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const target = active ? 0.95 : 0;
    material.opacity += (target - material.opacity) * Math.min(1, dt * 3);
    if (material.map) material.map.offset.x -= dt * 0.9;
    const visible = material.opacity > 0.02;
    if (pallets.current) pallets.current.visible = visible;
    if (loads.current) loads.current.visible = visible;
    if (!visible || !pallets.current || !loads.current) return;

    progress.current = (progress.current + dt * 0.018) % 1;
    for (let i = 0; i < LOADS; i++) {
      const u = (progress.current + i / LOADS) % 1;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u);
      tmp.q.setFromAxisAngle(tmp.up, Math.atan2(-t.z, t.x));
      tmp.p.set(p.x, 0.12, p.z);
      tmp.s.set(1.2, 0.14, 0.8);
      pallets.current.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
      tmp.p.set(p.x, 0.12 + 0.07 + 0.45, p.z);
      tmp.s.set(1.15, 0.9, 0.76);
      loads.current.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
    }
    pallets.current.instanceMatrix.needsUpdate = true;
    loads.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={geometry} material={material} renderOrder={2} />
      <instancedMesh ref={pallets} args={[GEO.box, mat('wood'), LOADS]} castShadow frustumCulled={false} />
      <instancedMesh ref={loads} args={[GEO.box, mat('machineAccent'), LOADS]} castShadow frustumCulled={false} />
    </group>
  );
}
