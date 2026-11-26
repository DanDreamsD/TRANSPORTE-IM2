// Señalización horizontal: pasillo central (espina), paso peatonal, delimitación de zonas y flechas de sentido.
import { useMemo } from 'react';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { ZONES } from '../content/zones';
import { PALETTE } from './palette';
import { chevronTexture } from './textures';
import { GEO } from './materials';
import { StaticInstances, type InstanceTransform } from './StaticInstances';

const Y = 0.012;
const LINE = 0.12;

function hLine(x0: number, x1: number, z: number, w = LINE): InstanceTransform {
  return { position: [(x0 + x1) / 2, Y, z], rotation: [-Math.PI / 2, 0, 0], scale: [Math.abs(x1 - x0), w, 1] };
}
function vLine(z0: number, z1: number, x: number, w = LINE): InstanceTransform {
  return { position: [x, Y, (z0 + z1) / 2], rotation: [-Math.PI / 2, 0, 0], scale: [w, Math.abs(z1 - z0), 1] };
}

export function FloorMarkings() {
  const yellowMat = useMemo(() => new MeshStandardMaterial({ color: PALETTE.safetyYellow, roughness: 0.6 }), []);
  const whiteMat = useMemo(() => new MeshStandardMaterial({ color: '#eef0ee', roughness: 0.6 }), []);
  const greenMat = useMemo(
    () => new MeshStandardMaterial({ color: PALETTE.pedestrianGreen, roughness: 0.8, transparent: true, opacity: 0.85 }),
    [],
  );
  const arrowMat = useMemo(
    () => new MeshBasicMaterial({ map: chevronTexture(), transparent: true, opacity: 0.55, color: '#ffffff', depthWrite: false }),
    [],
  );

  const yellow = useMemo(() => {
    const items: InstanceTransform[] = [];
    // bordes del pasillo central
    items.push(hLine(-58, 58, -3));
    items.push(hLine(-58, 58, 3));
    // delimitación de zonas (excepto el pasillo)
    for (const z of ZONES) {
      if (z.id === 'spine') continue;
      const inset = 0.4;
      const [x0, x1] = [z.x[0] + inset, z.x[1] - inset];
      const [z0, z1] = [z.z[0] + inset, z.z[1] - inset];
      items.push(hLine(x0, x1, z0), hLine(x0, x1, z1), vLine(z0, z1, x0), vLine(z0, z1, x1));
    }
    return items;
  }, []);

  const pedestrian = useMemo(() => [hLine(-58, 58, 3.9, 1.1)], []);
  const whiteDash = useMemo(() => {
    const items: InstanceTransform[] = [];
    // línea central discontinua (doble sentido)
    for (let x = -57; x < 57; x += 3) items.push(hLine(x, x + 1.5, 0, 0.1));
    // paso de cebra frente a cada zona
    for (const x of [-35, -11, 17, 40]) for (let i = 0; i < 6; i++) items.push(vLine(-2.6, 2.6, x - 1.5 + i * 0.6, 0.3));
    return items;
  }, []);

  const arrows = useMemo(() => {
    const items: InstanceTransform[] = [];
    for (let x = -50; x <= 50; x += 14) {
      items.push({ position: [x, Y + 0.002, -1.5], rotation: [-Math.PI / 2, 0, 0], scale: [2.4, 0.6, 1] });
      items.push({ position: [x + 7, Y + 0.002, 1.5], rotation: [-Math.PI / 2, 0, Math.PI], scale: [2.4, 0.6, 1] });
    }
    return items;
  }, []);

  return (
    <group>
      <StaticInstances geometry={GEO.plane} material={yellowMat} items={yellow} receiveShadow />
      <StaticInstances geometry={GEO.plane} material={greenMat} items={pedestrian} receiveShadow />
      <StaticInstances geometry={GEO.plane} material={whiteMat} items={whiteDash} receiveShadow />
      <StaticInstances geometry={GEO.plane} material={arrowMat} items={arrows} />
    </group>
  );
}
