// Caso 1 · Marcopolo: tren de arrastre (tugger) que recorre el pasillo central y se detiene en paradas por estación.
// La luz verde indica «contenedor listo»; al pasar el tren se apaga (contenedor cambiado por uno vacío).
// Representación didáctica del método descrito por Vieira et al. (2011); no reproduce la planta real.
import { createRef, useMemo, useRef, useState, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Tag3D } from '../boards/Tag3D';
import { useAnimationActive } from './demoClock';

const LOOP: [number, number][] = [
  [-8, -1.3],
  [24, -1.3],
  [26.3, 0],
  [24, 1.3],
  [-8, 1.3],
  [-10.3, 0],
];
const STATIONS = [
  { name: 'Estación 1', x: 6, z: -1.3, postZ: -3.4 },
  { name: 'Estación 2', x: 18, z: -1.3, postZ: -3.4 },
  { name: 'Estación 3', x: 22, z: 1.3, postZ: 3.0 },
];
const CARTS = 4;
const CART_GAP = 1.75;
const VMAX = 2.4;
const ACC = 1.2;
const DWELL = 2.6;
const REFILL = 7; // s hasta que el contenedor vuelve a estar listo (luz verde)

const CONTAINER_COLORS = ['#2f6ea5', '#3f9a5a', '#b23a32', '#7a6fb0'];

function Tractor() {
  return (
    <group>
      <mesh geometry={GEO.box} material={mat('yellow')} position={[0.1, 0.55, 0]} scale={[1.5, 0.6, 0.95]} castShadow />
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[-0.35, 1.0, 0]} scale={[0.45, 0.35, 0.7]} castShadow />
      {[
        [0.5, 0.42],
        [0.5, -0.42],
        [-0.55, 0.42],
        [-0.55, -0.42],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.box} material={mat('machineDark')} position={[x, 1.45, z]} scale={[0.05, 1.2, 0.05]} />
      ))}
      <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 2.06, 0]} scale={[1.2, 0.05, 0.95]} />
      <mesh geometry={GEO.box} material={mat('lamp')} position={[0.86, 0.65, 0]} scale={[0.02, 0.12, 0.6]} />
      {[
        [0.5, 0.48],
        [0.5, -0.48],
        [-0.45, 0.48],
        [-0.45, -0.48],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.cylinder} material={mat('black')} position={[x, 0.25, z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 0.2, 0.5]} castShadow />
      ))}
    </group>
  );
}

function Cart({ color }: { color: string }) {
  const m = useMemo(() => new MeshStandardMaterial({ color, roughness: 0.6 }), [color]);
  return (
    <group>
      <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0.38, 0]} scale={[1.4, 0.08, 0.86]} castShadow />
      <mesh geometry={GEO.box} material={m} position={[0, 0.75, 0]} scale={[1.2, 0.62, 0.74]} castShadow />
      <mesh geometry={GEO.box} material={mat('steel')} position={[0.9, 0.3, 0]} scale={[0.5, 0.04, 0.05]} />
      {[
        [0.5, 0.4],
        [0.5, -0.4],
        [-0.5, 0.4],
        [-0.5, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.cylinder} material={mat('black')} position={[x, 0.17, z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.3, 0.1, 0.3]} />
      ))}
    </group>
  );
}

export function TuggerDemo() {
  const active = useAnimationActive('tugger');
  const transitioning = usePresentation((s) => s.transitioning);
  const curve = useMemo(() => new CatmullRomCurve3(LOOP.map(([x, z]) => new Vector3(x, 0, z)), true, 'centripetal'), []);
  const length = useMemo(() => curve.getLength(), [curve]);
  const stops = useMemo(
    () =>
      STATIONS.map((st) => {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i <= 800; i++) {
          const p = curve.getPointAt(i / 800);
          const d = (p.x - st.x) ** 2 + (p.z - st.z) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i / 800;
          }
        }
        return best * length;
      }),
    [curve, length],
  );

  const units = useMemo<RefObject<Group | null>[]>(() => Array.from({ length: CARTS + 1 }, () => createRef<Group>()), []);
  const lights = useRef<(Mesh | null)[]>([]);
  const lightMats = useMemo(() => STATIONS.map(() => new MeshStandardMaterial({ color: '#2fb36b', emissive: '#2fb36b', emissiveIntensity: 2.2 })), []);
  const state = useRef({ s: stops[0] - 3.5, v: 0, dwell: 0, next: 0, served: STATIONS.map(() => -100), time: 0 });
  const [dwelling, setDwelling] = useState<number | null>(null);
  const tmp = useMemo(() => new Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const st = state.current;
    st.time += dt;
    const sStop = stops[st.next];
    const dist = (((sStop - st.s) % length) + length) % length;
    if (st.dwell > 0) {
      st.dwell -= dt;
      if (st.dwell <= 0) {
        st.served[st.next] = st.time;
        st.next = (st.next + 1) % stops.length;
        setDwelling(null);
      }
    } else {
      const vTarget = Math.min(VMAX, Math.sqrt(2 * ACC * Math.max(0, dist)));
      st.v = st.v < vTarget ? Math.min(vTarget, st.v + ACC * dt) : vTarget;
      st.s += st.v * dt;
      if (dist < 0.06) {
        st.s = sStop;
        st.v = 0;
        st.dwell = DWELL;
        setDwelling(st.next);
      }
    }

    units.forEach((ref, i) => {
      const g = ref.current;
      if (!g) return;
      const s = (((st.s - (i === 0 ? 0 : 1.9 + (i - 1) * CART_GAP)) % length) + length) % length;
      const u = s / length;
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u, tmp);
      g.position.set(p.x, 0, p.z);
      g.rotation.y = Math.atan2(-t.z, t.x);
    });

    STATIONS.forEach((_, i) => {
      const ready = st.time - st.served[i] > REFILL;
      const m = lightMats[i];
      const on = ready || (st.dwell > 0 && st.next === i);
      m.emissiveIntensity = on ? 2.2 : 0.05;
      m.color.set(on ? '#2fb36b' : '#2b3a33');
    });
  });

  const show = active && !transitioning;
  return (
    <group>
      {units.map((ref, i) => (
        <group key={i} ref={ref}>
          {i === 0 ? <Tractor /> : <Cart color={CONTAINER_COLORS[(i - 1) % CONTAINER_COLORS.length]} />}
        </group>
      ))}
      {STATIONS.map((stn, i) => (
        <group key={stn.name}>
          {/* parada marcada en el piso */}
          <mesh geometry={GEO.plane} material={mat('green')} rotation-x={-Math.PI / 2} position={[stn.x + (stn.z < 0 ? -3 : 3), 0.014, stn.z]} scale={[8, 0.9, 1]} />
          <group position={[stn.x, 0, stn.postZ]}>
            <mesh geometry={GEO.box} material={mat('steel')} position={[0, 1.1, 0]} scale={[0.08, 2.2, 0.08]} castShadow />
            <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 2.25, 0]} scale={[0.3, 0.3, 0.3]} />
            <mesh ref={(m) => void (lights.current[i] = m)} geometry={GEO.cylinder} material={lightMats[i]} position={[0, 2.25, 0]} scale={[0.22, 0.32, 0.22]} />
          </group>
          <Tag3D
            position={[stn.x, 2.45, stn.postZ]}
            title={stn.name}
            detail={dwelling === i ? 'cambio de contenedor' : 'señal verde = contenedor listo'}
            tone={dwelling === i ? 'accent' : 'ok'}
            visible={show}
            lead={24}
          />
        </group>
      ))}
    </group>
  );
}
