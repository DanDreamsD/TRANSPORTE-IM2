// Pallet de madera detallado (tablas superiores, tacos y patines). Dimensiones nominales configurables.
// Reemplazable por GLB: pasar `model` con la ruta en public/models (pendiente de fase 4).
import { useMemo } from 'react';
import type { Vec3 } from '../../content/types';
import { GEO, mat } from '../materials';
import { StaticInstances, type InstanceTransform } from '../StaticInstances';

export const PALLET_HEIGHT = 0.144;

interface Props {
  position?: Vec3;
  rotationY?: number;
  /** Largo (X) y ancho (Z) en metros; por defecto pallet europeo 1200 × 800 mm. */
  length?: number;
  width?: number;
}

export function Pallet({ position = [0, 0, 0], rotationY = 0, length = 1.2, width = 0.8 }: Props) {
  const { top, blocks, bottom } = useMemo(() => {
    const top: InstanceTransform[] = [];
    const blocks: InstanceTransform[] = [];
    const bottom: InstanceTransform[] = [];
    const boardT = 0.022;
    const blockH = 0.078;
    const boards = 5;
    const bw = 0.1;
    for (let i = 0; i < boards; i++) {
      const z = -width / 2 + bw / 2 + (i * (width - bw)) / (boards - 1);
      top.push({ position: [0, PALLET_HEIGHT - boardT / 2, z], scale: [length, boardT, i % 2 === 0 ? 0.145 : bw] });
    }
    // largueros transversales bajo la cubierta
    for (const x of [-length / 2 + 0.05, 0, length / 2 - 0.05]) {
      top.push({ position: [x, PALLET_HEIGHT - boardT - 0.011, 0], scale: [0.1, boardT, width] });
      for (const z of [-width / 2 + 0.07, 0, width / 2 - 0.07]) {
        blocks.push({ position: [x, boardT + blockH / 2, z], scale: [0.145, blockH, 0.1] });
      }
    }
    for (const z of [-width / 2 + 0.05, 0, width / 2 - 0.05]) bottom.push({ position: [0, boardT / 2, z], scale: [length, boardT, 0.1] });
    return { top, blocks, bottom };
  }, [length, width]);

  return (
    <group position={position as unknown as [number, number, number]} rotation={[0, rotationY, 0]}>
      <StaticInstances geometry={GEO.box} material={mat('wood')} items={top} castShadow receiveShadow />
      <StaticInstances geometry={GEO.box} material={mat('woodDark')} items={blocks} castShadow />
      <StaticInstances geometry={GEO.box} material={mat('wood')} items={bottom} receiveShadow />
    </group>
  );
}
