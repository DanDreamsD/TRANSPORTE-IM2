// Racks selectivos instanciados. Todas las filas de un campo comparten pocas llamadas de dibujo.
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { GEO, mat } from '../materials';
import { StaticInstances, type InstanceTransform } from '../StaticInstances';

export interface RackRow {
  /** Extremo oeste de la fila. */
  x0: number;
  /** Línea central de la fila (Z). */
  z: number;
  bays: number;
  bayWidth?: number;
  depth?: number;
  /** Alturas de los niveles de carga (m); el primero suele ser 0 (piso). */
  levels: number[];
  /** Fracción de posiciones ocupadas (determinista). */
  fill?: number;
  /** Cargas envueltas en film (producto terminado). */
  wrapped?: boolean;
  seed?: number;
  /** Posiciones que se dejan vacías para que las ocupe una demo: [vano, índice de nivel]. */
  exclude?: [number, number][];
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export function RackField({ rows }: { rows: RackRow[] }) {
  const wrapMat = useMemo(() => new MeshStandardMaterial({ color: '#cfdde3', roughness: 0.35, metalness: 0.05 }), []);

  const parts = useMemo(() => {
    const uprights: InstanceTransform[] = [];
    const beams: InstanceTransform[] = [];
    const braces: InstanceTransform[] = [];
    const pallets: InstanceTransform[] = [];
    const loads: InstanceTransform[] = [];
    const wrapped: InstanceTransform[] = [];

    for (const row of rows) {
      const bw = row.bayWidth ?? 2.7;
      const depth = row.depth ?? 1.1;
      const top = row.levels[row.levels.length - 1] + 1.6;
      const r = rng(row.seed ?? Math.round(row.x0 * 31 + row.z * 17));
      const fill = row.fill ?? 0.8;
      for (let b = 0; b <= row.bays; b++) {
        const x = row.x0 + b * bw;
        for (const dz of [-depth / 2, depth / 2]) uprights.push({ position: [x, top / 2, row.z + dz], scale: [0.09, top, 0.08] });
        // arriostramiento del bastidor
        for (let y = 0.6; y < top - 0.4; y += 1.2) {
          braces.push({ position: [x, y, row.z], rotation: [Math.atan2(1.0, depth), 0, 0], scale: [0.03, 0.03, Math.hypot(depth, 1.0)] });
        }
      }
      for (let b = 0; b < row.bays; b++) {
        const cx = row.x0 + b * bw + bw / 2;
        row.levels.forEach((ly, li) => {
          if (li > 0 || ly > 0.01) {
            for (const dz of [-depth / 2, depth / 2]) beams.push({ position: [cx, ly - 0.06, row.z + dz], scale: [bw - 0.1, 0.12, 0.06] });
          }
          // dos pallets por vano (pallet europeo 1,2 × 0,8 con el lado de 0,8 al frente)
          const excluded = row.exclude?.some(([eb, el]) => eb === b && el === li) ?? false;
          for (const off of [-bw / 4, bw / 4]) {
            if (r() > fill || excluded) continue;
            const px = cx + off;
            const h = 0.7 + r() * 0.65;
            pallets.push({ position: [px, ly + 0.072, row.z], scale: [0.8, 0.144, 1.2] });
            const target = row.wrapped ? wrapped : loads;
            target.push({ position: [px, ly + 0.144 + h / 2, row.z], scale: [0.78, h, 1.16] });
          }
        });
      }
    }
    return { uprights, beams, braces, pallets, loads, wrapped };
  }, [rows]);

  return (
    <group>
      <StaticInstances geometry={GEO.box} material={mat('rackUpright')} items={parts.uprights} castShadow />
      <StaticInstances geometry={GEO.box} material={mat('rackBeam')} items={parts.beams} castShadow />
      <StaticInstances geometry={GEO.box} material={mat('rackUpright')} items={parts.braces} />
      <StaticInstances geometry={GEO.box} material={mat('wood')} items={parts.pallets} castShadow />
      <StaticInstances geometry={GEO.box} material={mat('carton')} items={parts.loads} castShadow receiveShadow />
      <StaticInstances geometry={GEO.box} material={wrapMat} items={parts.wrapped} castShadow receiveShadow />
    </group>
  );
}
