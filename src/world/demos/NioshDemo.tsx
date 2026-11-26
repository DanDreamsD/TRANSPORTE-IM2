// Demo 10 · Levantamiento manual y ecuación NIOSH: un operario levanta una caja desde la altura V, a la distancia
// horizontal H, con un recorrido vertical D. Las variables vienen de la calculadora del HUD (ejemplo hipotético de
// la Tabla 18 por defecto). Demostración didáctica.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Worker, type WorkerPose } from '../equipment/Worker';
import { useAnimationActive } from './demoClock';
import { fmt, liLevel, niosh } from './nioshCalc';

/** Posición del operario (mira hacia +X). */
export const NIOSH_STATION = { x: -16.2, z: 14.4 };
const BOX = { w: 0.4, h: 0.3, d: 0.36 };
/** La repisa de destino está a un costado del origen (el recorrido vertical D se mide igual). */
const SHELF_Z = 0.6;

export function NioshDemo() {
  const active = useAnimationActive('niosh-lift');
  const transitioning = usePresentation((s) => s.transitioning);
  const input = usePresentation((s) => s.demo.niosh);
  const pose = useRef<WorkerPose>({ hands: [0.4, 0.6, 0], lean: 0.3, squat: 0.2 });
  const box = useRef<Group>(null);
  const startTable = useRef<Mesh>(null);
  const endShelf = useRef<Mesh>(null);
  const hLine = useRef<Mesh>(null);
  const shelfPost = useRef<Mesh>(null);
  const r = useMemo(() => niosh(input), [input]);

  useFrame(({ clock }) => {
    const H = input.H / 100;
    const V = input.V / 100;
    const D = input.D / 100;
    // ciclo de 5 s: tomar en V, subir a V + D, volver
    const t = (clock.getElapsedTime() % 5) / 5;
    const k = active ? (t < 0.15 ? 0 : t < 0.5 ? (t - 0.15) / 0.35 : t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35) : 0;
    const e = k * k * (3 - 2 * k);
    const handY = V + D * e;
    const lean = Math.max(0, Math.min(1.1, (1.0 - handY) * 0.9 + (H - 0.25) * 0.8));
    const side = SHELF_Z * e;
    pose.current.hands = [H, handY, side];
    pose.current.lean = lean;
    pose.current.squat = Math.max(0, Math.min(1, (0.7 - handY) * 1.4));
    if (box.current) box.current.position.set(H + 0.05, handY, side);
    if (startTable.current) {
      const top = Math.max(0.02, V - BOX.h / 2);
      startTable.current.scale.set(0.6, top, 0.6);
      startTable.current.position.set(H + 0.1, top / 2, 0);
    }
    const shelfTop = V + D - BOX.h / 2 - 0.02;
    if (endShelf.current) endShelf.current.position.set(H + 0.1, shelfTop, SHELF_Z);
    if (shelfPost.current) {
      shelfPost.current.scale.set(0.06, shelfTop, 0.06);
      shelfPost.current.position.set(H + 0.1, shelfTop / 2, SHELF_Z + 0.25);
    }
    if (hLine.current) {
      hLine.current.scale.set(H, 0.04, 1);
      hLine.current.position.set(H / 2, 0.015, 0.35);
    }
  });

  const show = active && !transitioning;
  const level = liLevel(r.LI);
  return (
    <group position={[NIOSH_STATION.x, 0, NIOSH_STATION.z]}>
      <Worker pose={pose} />
      <group ref={box}>
        <mesh geometry={GEO.box} material={mat('carton')} scale={[BOX.w, BOX.h, BOX.d]} castShadow />
      </group>
      {/* plataforma de origen (altura V) y repisa de destino (V + D) */}
      <mesh ref={startTable} geometry={GEO.box} material={mat('steelLight')} castShadow receiveShadow />
      <mesh ref={endShelf} geometry={GEO.box} material={mat('machineAccent')} scale={[0.6, 0.04, 0.6]} position={[0.5, 1, SHELF_Z]} />
      <mesh ref={shelfPost} geometry={GEO.box} material={mat('steel')} />
      {/* distancia horizontal H medida desde el punto medio entre los tobillos */}
      <mesh ref={hLine} geometry={GEO.plane} material={mat('yellow')} rotation-x={-Math.PI / 2} />
      <mesh geometry={GEO.plane} material={mat('hazard')} rotation-x={-Math.PI / 2} position={[0.3, 0.008, 0]} scale={[2.0, 1.6, 1]} />
      {show && (
        <>
          <Html position={[input.H / 200, 0.05, 0.55]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
            <div className="floor-label">H = {input.H} cm</div>
          </Html>
          <Html position={[input.H / 100 + 0.55, input.V / 100, 0]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
            <div className="floor-label">V = {input.V} cm · D = {input.D} cm</div>
          </Html>
          <Html position={[0, 2.25, 0]} center zIndexRange={[26, 10]} style={{ pointerEvents: 'none' }}>
            <div className={`niosh-tag niosh-tag--${level}`}>
              RWL {fmt(r.RWL, 1)} kg · LI {fmt(r.LI, 2)}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
