// Letreros colgantes de zona (textura de canvas local; sin fuentes remotas).
import { useEffect, useMemo, useState } from 'react';
import { MeshBasicMaterial } from 'three';
import { ZONES } from '../content/zones';
import { signTexture } from './textures';
import { GEO, mat } from './materials';

const SIGN_W = 4.4;
const SIGN_H = 1.1;
const SIGN_Y = 6.6;
const TRUSS_Y = 10.4;

interface SignProps {
  x: number;
  z: number;
  rotationY: number;
  title: string;
  sub: string;
  color: string;
}

function Sign({ x, z, rotationY, title, sub, color }: SignProps) {
  const material = useMemo(
    () => new MeshBasicMaterial({ map: signTexture(title, sub, color), toneMapped: false }),
    [title, sub, color],
  );
  const rodLen = TRUSS_Y - SIGN_Y - SIGN_H / 2;
  const rodY = SIGN_H / 2 + rodLen / 2;
  return (
    <group position={[x, SIGN_Y, z]} rotation={[0, rotationY, 0]}>
      <mesh geometry={GEO.plane} material={material} scale={[SIGN_W, SIGN_H, 1]} />
      {/* cara posterior: el letrero se lee desde ambos lados */}
      <mesh geometry={GEO.plane} material={material} position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]} scale={[SIGN_W, SIGN_H, 1]} />
      <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0, -0.03]} scale={[SIGN_W + 0.12, SIGN_H + 0.12, 0.04]} />
      <mesh geometry={GEO.box} material={mat('steel')} position={[-SIGN_W / 2 + 0.2, rodY, -0.03]} scale={[0.03, rodLen, 0.03]} />
      <mesh geometry={GEO.box} material={mat('steel')} position={[SIGN_W / 2 - 0.2, rodY, -0.03]} scale={[0.03, rodLen, 0.03]} />
    </group>
  );
}

export function ZoneSigns() {
  // Espera a que la tipografía local esté cargada antes de dibujar los letreros.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    Promise.race([
      fonts ? fonts.load('700 92px "Inter Variable"').then(() => undefined) : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]).finally(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!ready) return null;

  return (
    <group>
      {ZONES.filter((z) => z.id !== 'spine').map((z) => {
        let x = (z.x[0] + z.x[1]) / 2;
        let zz: number;
        let rot: number;
        if (z.id === 'rec') {
          x = z.x[0] + 12.5;
          zz = 20;
          rot = Math.PI / 2; // mira al este (interior)
        } else if (z.id === 'desp') {
          x = z.x[1] - 8;
          zz = 22;
          rot = -Math.PI / 2; // mira al oeste
        } else if (z.z[1] <= 0) {
          zz = z.z[1] - 0.6;
          rot = 0; // zona norte → mira al pasillo (+Z)
        } else {
          zz = z.z[0] + 0.6;
          rot = Math.PI; // zona sur → mira al pasillo (−Z)
        }
        return <Sign key={z.id} x={x} z={zz} rotationY={rot} title={z.short} sub={z.name} color={z.color} />;
      })}
    </group>
  );
}
