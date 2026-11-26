// Caso 4 · Kubasáková et al. (2024): dos AGV guiados por cinta magnética abastecen una línea de asientos.
// Circuito cerrado con dos paradas simétricas (almacén de componentes y fin de línea). Representación didáctica;
// no reproduce la planta real.
import { createRef, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Group, MeshStandardMaterial, Vector3 } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { AgvModel } from '../equipment/Vehicles';
import { Tag3D } from '../boards/Tag3D';
import { useAnimationActive } from './demoClock';

const LOOP: [number, number][] = [
  [6.6, -19],
  [27.4, -19],
  [28.8, -20.4],
  [28.8, -29.2],
  [27.4, -30.6],
  [6.6, -30.6],
  [5.2, -29.2],
  [5.2, -20.4],
];
const SPEED = 1.1;
const DWELL = 3;
const LINE_Z = -25;

function tapeGeometry(curve: CatmullRomCurve3, width: number): BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const n = 400;
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = curve.getPointAt(u % 1);
    const t = curve.getTangentAt(u % 1);
    const side = new Vector3().crossVectors(up, t).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, 0.013, p.z - side.z, p.x + side.x, 0.013, p.z + side.z);
    if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Seat() {
  return (
    <group>
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.08, 0]} scale={[0.5, 0.14, 0.52]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.42, -0.22]} rotation={[-0.15, 0, 0]} scale={[0.48, 0.62, 0.12]} castShadow />
      <mesh geometry={GEO.box} material={mat('steelLight')} position={[0, 0.82, -0.27]} scale={[0.26, 0.16, 0.1]} />
    </group>
  );
}

export function AgvSeatsDemo() {
  const active = useAnimationActive('agv-seats');
  const transitioning = usePresentation((s) => s.transitioning);
  const curve = useMemo(() => new CatmullRomCurve3(LOOP.map(([x, z]) => new Vector3(x, 0, z)), true, 'centripetal'), []);
  const length = useMemo(() => curve.getLength(), [curve]);
  const tape = useMemo(() => tapeGeometry(curve, 0.06), [curve]);
  const tapeMat = useMemo(() => new MeshStandardMaterial({ color: '#2c3136', roughness: 0.6 }), []);
  const binMat = useMemo(() => new MeshStandardMaterial({ color: '#2f6ea5', roughness: 0.6 }), []);
  // paradas: centro de los lados cortos (simétricas → ambos AGV se detienen a la vez)
  const stops = useMemo(() => {
    const find = (x: number, z: number) => {
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i <= 1000; i++) {
        const p = curve.getPointAt(i / 1000);
        const d = (p.x - x) ** 2 + (p.z - z) ** 2;
        if (d < bd) {
          bd = d;
          best = i / 1000;
        }
      }
      return best * length;
    };
    return [find(5.2, -24.8), find(28.8, -24.8)].sort((a, b) => a - b);
  }, [curve, length]);
  const agvs = useMemo<RefObject<Group | null>[]>(() => [createRef<Group>(), createRef<Group>()], []);
  const st = useRef({ s: stops[0] - 6, dwell: 0, next: 0 });
  const tmp = useMemo(() => new Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = st.current;
    if (s.dwell > 0) {
      s.dwell -= dt;
      if (s.dwell <= 0) s.next = (s.next + 1) % stops.length;
    } else {
      const target = stops[s.next];
      const dist = (((target - s.s) % length) + length) % length;
      const v = Math.min(SPEED, Math.max(0.25, dist * 0.8));
      if (dist < 0.04 || v * dt >= dist) {
        s.s = target;
        s.dwell = DWELL;
      } else s.s += v * dt;
    }
    agvs.forEach((ref, i) => {
      const g = ref.current;
      if (!g) return;
      const ss = (((s.s + (i * length) / 2) % length) + length) % length;
      const p = curve.getPointAt(ss / length);
      const t = curve.getTangentAt(ss / length, tmp);
      g.position.set(p.x, 0, p.z);
      g.rotation.y = Math.atan2(-t.z, t.x);
    });
  });

  const show = active && !transitioning;
  return (
    <group>
      <mesh geometry={tape} material={tapeMat} receiveShadow />
      {/* asientos sobre la línea de ensamble secundaria */}
      {[7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27].map((x) => (
        <group key={x} position={[x, 0.85, LINE_Z]} rotation={[0, Math.PI, 0]}>
          <Seat />
        </group>
      ))}
      {/* almacén de componentes (supermercado) y estación de carga en el piso */}
      <group position={[4.45, 0, -24.8]}>
        <mesh geometry={GEO.box} material={mat('rackUpright')} position={[0, 0.8, 0]} scale={[0.5, 1.6, 2.4]} castShadow />
        {[0.45, 0.95, 1.45].map((y) =>
          [-0.75, 0, 0.75].map((z) => <mesh key={`${y}${z}`} geometry={GEO.box} material={binMat} position={[0.12, y, z]} scale={[0.36, 0.3, 0.6]} />),
        )}
      </group>
      <mesh geometry={GEO.plane} material={mat('yellow')} rotation-x={-Math.PI / 2} position={[5.2, 0.012, -24.8]} scale={[1.0, 1.6, 1]} />
      {agvs.map((ref, i) => (
        <AgvModel key={i} groupRef={ref} color={i === 0 ? '#f2f2ef' : '#e9eef2'}>
          <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0.04, 0]} scale={[1.0, 0.06, 0.7]} />
          <mesh geometry={GEO.box} material={binMat} position={[-0.22, 0.24, 0]} scale={[0.42, 0.34, 0.6]} castShadow />
          <mesh geometry={GEO.box} material={binMat} position={[0.24, 0.24, 0]} scale={[0.42, 0.34, 0.6]} castShadow />
        </AgvModel>
      ))}
      <Tag3D position={[4.6, 1.75, -24.8]} title="Almacén de componentes" detail="parada fija · carga en el piso" visible={show} lead={20} />
      <Tag3D position={[29.2, 1.0, -24.8]} title="Fin de línea de asientos" detail="parada fija" tone="accent" visible={show} lead={30} />
      <Tag3D position={[17, 0.05, -30.6]} title="Cinta magnética" detail="ruta definida del AGV" visible={show} lead={30} />
    </group>
  );
}
