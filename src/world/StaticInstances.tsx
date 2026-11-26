// Instanciación de objetos repetidos estáticos (columnas, puntales, rodillos, pallets…): una sola llamada de dibujo.
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3, type BufferGeometry, type Material } from 'three';
import type { Vec3 } from '../content/types';

export interface InstanceTransform {
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
}

interface Props {
  geometry: BufferGeometry;
  material: Material;
  items: readonly InstanceTransform[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function composeMatrix(t: InstanceTransform, out = new Matrix4()): Matrix4 {
  const q = new Quaternion().setFromEuler(new Euler(...(t.rotation ?? [0, 0, 0])));
  return out.compose(new Vector3(...t.position), q, new Vector3(...(t.scale ?? [1, 1, 1])));
}

export function StaticInstances({ geometry, material, items, castShadow = false, receiveShadow = false }: Props) {
  const ref = useRef<InstancedMesh>(null);
  const count = items.length;
  const args = useMemo(() => [geometry, material, count] as const, [geometry, material, count]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new Matrix4();
    items.forEach((t, i) => mesh.setMatrixAt(i, composeMatrix(t, m)));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  if (count === 0) return null;
  return <instancedMesh ref={ref} args={args} castShadow={castShadow} receiveShadow={receiveShadow} />;
}
