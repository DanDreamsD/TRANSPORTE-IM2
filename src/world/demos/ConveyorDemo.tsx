// Demo 5 · Transportador de rodillos en funcionamiento: motor-reductor, rodillos motorizados, sensor fotoeléctrico
// y tramo por gravedad con acumulación. Demostración didáctica.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Euler, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { Vec3 } from '../../content/types';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { cartonTexture } from '../textures';
import { RollerConveyor } from '../equipment/RollerConveyor';
import { Tag3D } from '../boards/Tag3D';
import { demoElapsed, useAnimationActive } from './demoClock';
import { createSim, DEFAULT_CONVEYOR as CFG, PICK_TIME, sensorBlocked, stepConveyor } from './conveyorSim';

export const CONVEYOR_START: Vec3 = [6, 0.82, -12];
const SLOPE = (3 * Math.PI) / 180;
const BOX: Vec3 = [CFG.boxLength, 0.34, 0.42];
const SENSOR_S = CFG.poweredLength - 0.6;

/** Escena 6.2–6.3: el motor funciona, falla y se repara en un ciclo de 16 s (demostración didáctica). */
export const FAILURE_CYCLE = 16;
export function motorRunningAt(t: number): boolean {
  const tt = t % FAILURE_CYCLE;
  return tt < 4 || tt >= 12;
}

function positionAt(s: number, out: Vector3): { tilt: number } {
  const [x0, y0, z0] = CONVEYOR_START;
  if (s <= CFG.poweredLength) {
    out.set(x0 + s, y0 + BOX[1] / 2, z0);
    return { tilt: 0 };
  }
  const d = s - CFG.poweredLength;
  out.set(x0 + CFG.poweredLength + d * Math.cos(SLOPE), y0 - d * Math.sin(SLOPE) + BOX[1] / 2, z0);
  return { tilt: -SLOPE };
}

export function ConveyorDemo() {
  const normal = useAnimationActive('conveyor');
  const failureMode = useAnimationActive('conveyor-failure');
  const active = normal || failureMode;
  const beacon = useRef<Mesh>(null);
  const [failed, setFailed] = useState(false);
  const transitioning = usePresentation((s) => s.transitioning);
  const replayToken = usePresentation((s) => s.replayToken);
  const sim = useRef(createSim());
  const boxes = useRef<InstancedMesh>(null);
  const beam = useRef<Mesh>(null);
  const poweredSpeed = useRef(0.8);
  const gravitySpeed = useRef(CFG.gravitySpeed);
  const [blocked, setBlocked] = useState(false);

  const boxMat = useMemo(() => new MeshStandardMaterial({ map: cartonTexture(), roughness: 0.9 }), []);
  const beamMat = useMemo(() => new MeshStandardMaterial({ color: '#2fb36b', emissive: '#2fb36b', emissiveIntensity: 2.5, transparent: true, opacity: 0.8 }), []);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), e: new Euler(), p: new Vector3(), s: new Vector3() }), []);

  // Repetir la demo reinicia la línea con cajas en marcha.
  useEffect(() => {
    sim.current = createSim();
    for (let i = 0; i < 600; i++) stepConveyor(sim.current, 1 / 30, 0.8, true);
  }, [replayToken]);

  // Pre-llenado para que la línea no aparezca vacía la primera vez.
  useEffect(() => {
    for (let i = 0; i < 600; i++) stepConveyor(sim.current, 1 / 30, 0.8, true);
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { conveyorSpeed, conveyorRunning } = usePresentation.getState().demo;
    // Fuera de su escena la línea sigue funcionando a velocidad nominal (ambiente de planta).
    const inFailure = failureMode && !motorRunningAt(demoElapsed());
    const speed = normal ? conveyorSpeed : 0.8;
    const running = failureMode ? !inFailure : normal ? conveyorRunning : true;
    if (inFailure !== failed) setFailed(inFailure);
    if (beacon.current) {
      const m = beacon.current.material as MeshStandardMaterial;
      const blink = inFailure && Math.floor(performance.now() / 350) % 2 === 0;
      m.emissiveIntensity = inFailure ? (blink ? 3 : 0.3) : 1.2;
      m.color.set(inFailure ? '#e0483e' : '#2fb36b');
      m.emissive.set(inFailure ? '#e0483e' : '#2fb36b');
    }
    stepConveyor(sim.current, dt, speed, running);
    poweredSpeed.current = running ? speed : 0;

    const mesh = boxes.current;
    if (!mesh) return;
    const list = sim.current.boxes;
    list.forEach((b, i) => {
      const { tilt } = positionAt(b.s, tmp.p);
      const appear = Math.min(1, b.age / 0.25);
      if (b.pick > 0) tmp.p.y += (b.pick / PICK_TIME) * 0.9;
      const shrink = b.pick > 0 ? 1 - b.pick / PICK_TIME : 1;
      tmp.e.set(0, 0, tilt);
      tmp.q.setFromEuler(tmp.e);
      tmp.s.set(BOX[0] * shrink, BOX[1] * appear * shrink, BOX[2] * shrink);
      mesh.setMatrixAt(i, tmp.m.compose(tmp.p, tmp.q, tmp.s));
    });
    mesh.count = list.length;
    mesh.instanceMatrix.needsUpdate = true;

    const isBlocked = sensorBlocked(sim.current, SENSOR_S);
    if (isBlocked !== blocked) {
      setBlocked(isBlocked);
      beamMat.color.set(isBlocked ? '#e0483e' : '#2fb36b');
      beamMat.emissive.set(isBlocked ? '#e0483e' : '#2fb36b');
    }
  });

  const [x0, y0, z0] = CONVEYOR_START;
  const sensorX = x0 + SENSOR_S;
  const gStart: Vec3 = [x0 + CFG.poweredLength, y0, z0];
  const endX = x0 + CFG.poweredLength + CFG.gravityLength * Math.cos(SLOPE);
  const endY = y0 - CFG.gravityLength * Math.sin(SLOPE);
  const showTags = active && !transitioning;

  return (
    <group>
      <RollerConveyor start={CONVEYOR_START} length={CFG.poweredLength} speedRef={poweredSpeed} />
      <RollerConveyor start={gStart} length={CFG.gravityLength} slope={SLOPE} speedRef={gravitySpeed} />
      <instancedMesh ref={boxes} args={[GEO.box, boxMat, CFG.maxBoxes]} castShadow receiveShadow frustumCulled={false} />

      {/* motor-reductor y guarda de cadena */}
      <group position={[x0 + 0.7, y0 - 0.32, z0 - 0.62]}>
        <mesh geometry={GEO.box} material={mat('machineAccent')} scale={[0.42, 0.32, 0.36]} castShadow />
        <mesh geometry={GEO.cylinder} material={mat('machineAccent')} position={[0, 0, -0.34]} rotation={[Math.PI / 2, 0, 0]} scale={[0.28, 0.42, 0.28]} castShadow />
        <mesh geometry={GEO.box} material={mat('yellow')} position={[0, 0.2, 0.25]} scale={[0.5, 0.42, 0.06]} />
      </group>

      {/* sensor fotoeléctrico: emisor, reflector y haz */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[sensorX, y0, z0 + sd * 0.52]}>
          <mesh geometry={GEO.box} material={mat('machineDark')} position={[0, 0.0, 0]} scale={[0.04, 0.5, 0.04]} />
          <mesh geometry={GEO.box} material={sd < 0 ? mat('yellow') : mat('machineDark')} position={[0, 0.2, 0]} scale={[0.08, 0.1, 0.06]} />
        </group>
      ))}
      <mesh ref={beam} geometry={GEO.cylinder} material={beamMat} position={[sensorX, y0 + 0.2, z0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.012, 1.0, 0.012]} />

      {/* tope final */}
      <mesh geometry={GEO.box} material={mat('yellow')} position={[endX + 0.02, endY + 0.1, z0]} scale={[0.06, 0.26, 0.86]} castShadow />

      {/* tablero de control local */}
      <group position={[x0 + 12.4, 0, z0 + 0.9]}>
        <mesh geometry={GEO.box} material={mat('steel')} position={[0, 0.6, 0]} scale={[0.06, 1.2, 0.06]} />
        <mesh geometry={GEO.box} material={mat('machine')} position={[0, 1.3, 0]} scale={[0.4, 0.5, 0.2]} castShadow />
        <mesh geometry={GEO.cylinder} material={mat('pipeRed')} position={[0, 1.3, 0.11]} rotation={[Math.PI / 2, 0, 0]} scale={[0.09, 0.04, 0.09]} />
        {/* baliza de estado de la línea */}
        <mesh ref={beacon} geometry={GEO.cylinder} position={[0, 1.75, 0]} scale={[0.16, 0.26, 0.16]}>
          <meshStandardMaterial color="#2fb36b" emissive="#2fb36b" emissiveIntensity={1.2} />
        </mesh>
      </group>
      <Tag3D
        position={[x0 + 12.4, 1.95, z0 + 0.9]}
        title={failed ? 'Falla del motor' : 'Línea en marcha'}
        detail={failed ? 'el tramo motorizado se detiene' : 'baliza verde'}
        tone={failed ? 'danger' : 'ok'}
        visible={failureMode && !transitioning}
        lead={26}
      />

      <Tag3D position={[x0 + 0.7, y0 - 0.1, z0 - 0.75]} title="Motor-reductor" detail="acciona los rodillos por cadena" visible={showTags && !failureMode} lead={70} />
      <Tag3D position={[x0 + 9.8, y0 + 0.05, z0]} title="Rodillos motorizados" detail="velocidad ajustable" visible={showTags && !failureMode} lead={40} />
      <Tag3D
        position={[sensorX, y0 + 0.3, z0 - 0.52]}
        title="Sensor fotoeléctrico"
        detail={blocked ? 'caja detectada' : 'línea libre'}
        tone={blocked ? 'danger' : 'ok'}
        visible={showTags}
        lead={80}
      />
      <Tag3D position={[x0 + CFG.poweredLength + 3, y0 - 0.05, z0]} title="Rodillos por gravedad" detail="acumulación sin motor" tone="accent" visible={showTags} lead={46} />
    </group>
  );
}
