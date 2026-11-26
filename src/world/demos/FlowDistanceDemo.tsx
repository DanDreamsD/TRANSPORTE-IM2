// Demo 13 · Principio del trabajo (flujo × distancia) con el ejemplo HIPOTÉTICO de la Tabla 5 de la guía.
// Las dos distribuciones se dibujan en línea y a escala (las distancias son las de la tabla; la geometría
// lineal es un esquema, la guía no define la forma de la planta). Demostración didáctica.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { usePresentation } from '../../state/store';
import { GEO } from '../materials';
import { StaticInstances, type InstanceTransform } from '../StaticInstances';
import { Tag3D } from '../boards/Tag3D';
import { useAnimationActive } from './demoClock';

/** Escala del esquema: metros de planta → metros del diagrama. */
export const FLOW_SCALE = 0.095;
const X0 = 35.8;
const Y = 0.012;
const BLOCK = 0.8;

const DEPTS = ['Recepción', 'Almacén MP', 'Corte', 'Ensamble'];
const DEPT_COLORS = ['#5b8fb9', '#d08a3c', '#b0605a', '#4aa39b'];

// Tabla 5 (datos inventados con fines didácticos por los autores de la guía).
export const TABLE5 = {
  flows: [30, 30, 25], // pallets por día
  distA: [20, 60, 45], // m
  distB: [20, 15, 12], // m
};

export function handlingWork(flows: number[], dists: number[]): number {
  return flows.reduce((acc, f, i) => acc + f * dists[i], 0);
}

interface Row {
  key: 'A' | 'B';
  z: number;
  xs: number[];
  dists: number[];
}

function cumulative(d: number[]): number[] {
  const out = [0];
  d.forEach((v) => out.push(out[out.length - 1] + v));
  return out;
}

const ROWS: Row[] = [
  { key: 'A', z: -11.4, xs: cumulative(TABLE5.distA).map((v) => X0 + v * FLOW_SCALE), dists: TABLE5.distA },
  { key: 'B', z: -7.9, xs: cumulative(TABLE5.distB).map((v) => X0 + v * FLOW_SCALE), dists: TABLE5.distB },
];

interface Token {
  row: number;
  seg: number;
  phase: number;
}

export function FlowDistanceDemo() {
  const active = useAnimationActive('flow-distance');
  const transitioning = usePresentation((s) => s.transitioning);
  const tokens = useRef<InstancedMesh>(null);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3(0.2, 0.16, 0.2) }), []);
  const mats = useMemo(
    () => ({
      base: new MeshStandardMaterial({ color: '#2a3138', roughness: 0.9 }),
      ribbon: new MeshStandardMaterial({ color: '#f5b301', roughness: 0.6, emissive: '#5a3f00', emissiveIntensity: 0.4 }),
      token: new MeshStandardMaterial({ color: '#c39a62', roughness: 0.8 }),
      depts: DEPT_COLORS.map((c) => new MeshStandardMaterial({ color: c, roughness: 0.6 })),
    }),
    [],
  );

  const { ribbons, blocks, tokenList } = useMemo(() => {
    const ribbons: InstanceTransform[] = [];
    const blocks: InstanceTransform[][] = DEPTS.map(() => []);
    const tokenList: Token[] = [];
    ROWS.forEach((row, ri) => {
      row.xs.forEach((x, di) => blocks[di].push({ position: [x, 0.18, row.z], scale: [BLOCK, 0.36, BLOCK] }));
      for (let s = 0; s < 3; s++) {
        const a = row.xs[s] + BLOCK / 2;
        const b = row.xs[s + 1] - BLOCK / 2;
        const w = 0.014 * TABLE5.flows[s]; // ancho ∝ flujo
        ribbons.push({ position: [(a + b) / 2, Y + 0.01, row.z], scale: [Math.max(0.05, b - a), 0.02, w] });
        // densidad de cargas ∝ flujo (misma velocidad en ambas distribuciones)
        const spacing = 0.55 * (30 / TABLE5.flows[s]);
        const n = Math.max(1, Math.round((b - a) / spacing));
        for (let k = 0; k < n; k++) tokenList.push({ row: ri, seg: s, phase: k / n });
      }
    });
    return { ribbons, blocks, tokenList };
  }, []);

  useFrame(({ clock }) => {
    const mesh = tokens.current;
    if (!mesh) return;
    mesh.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    tokenList.forEach((tk, i) => {
      const row = ROWS[tk.row];
      const a = row.xs[tk.seg] + BLOCK / 2;
      const b = row.xs[tk.seg + 1] - BLOCK / 2;
      const len = Math.max(0.05, b - a);
      const u = (tk.phase + (t * 0.45) / len) % 1;
      tmp.p.set(a + u * len, Y + 0.1, row.z);
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  const show = active && !transitioning;
  const workA = handlingWork(TABLE5.flows, TABLE5.distA);
  const workB = handlingWork(TABLE5.flows, TABLE5.distB);

  return (
    <group>
      <mesh geometry={GEO.plane} material={mats.base} rotation-x={-Math.PI / 2} position={[41.6, 0.006, -9.65]} scale={[13.4, 6.4, 1]} receiveShadow />
      <StaticInstances geometry={GEO.box} material={mats.ribbon} items={ribbons} />
      {blocks.map((items, i) => (
        <StaticInstances key={DEPTS[i]} geometry={GEO.box} material={mats.depts[i]} items={items} castShadow />
      ))}
      <instancedMesh ref={tokens} args={[GEO.box, mats.token, tokenList.length]} castShadow frustumCulled={false} />

      {show &&
        ROWS.map((row) => (
          <group key={row.key}>
            <Html position={[X0 - 0.75, 0.05, row.z]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
              <div className="floor-label floor-label--row">{row.key}</div>
            </Html>
            {row.dists.map((d, s) => (
              <Html
                key={`w${s}`}
                position={[(row.xs[s] + row.xs[s + 1]) / 2, 0.05, row.z + (row.key === 'A' ? -0.6 : 0.6)]}
                center
                zIndexRange={[25, 10]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="floor-label floor-label--work" title={`${TABLE5.flows[s]} pallets/día × ${d} m`}>
                  {TABLE5.flows[s] * d}
                </div>
              </Html>
            ))}
          </group>
        ))}
      {show && (
        <Html position={[44.0, 0.05, -7.4]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
          <div className="floor-legend">
            {DEPTS.map((d, i) => (
              <span key={d}>
                <i style={{ background: DEPT_COLORS[i] }} />
                {d}
              </span>
            ))}
            <em>pallet·m/día por tramo · ejemplo hipotético</em>
          </div>
        </Html>
      )}
      <Tag3D
        position={[ROWS[0].xs[3], 0.4, ROWS[0].z]}
        title={`A · ${workA} pallet·m/día`}
        detail="áreas de mayor flujo alejadas"
        tone="danger"
        visible={show}
        lead={34}
      />
      <Tag3D
        position={[ROWS[1].xs[3], 0.4, ROWS[1].z]}
        title={`B · ${workB} pallet·m/día`}
        detail="áreas de mayor flujo cercanas"
        tone="ok"
        visible={show}
        lead={34}
      />
    </group>
  );
}
