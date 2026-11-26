// Control de cámara: transiciones cinematográficas interrumpibles (GSAP) entre escenas y modo de exploración libre.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PerspectiveCamera, Vector3 } from 'three';
import gsap from 'gsap';
import { SCENES } from '../content/sceneRegistry';
import type { CameraShot, Vec3 } from '../content/types';
import { usePresentation } from '../state/store';
import { buildControlPoints, buildCurve, lerpVec3, transitionDuration } from './cameraPaths';
import { cameraPose } from './cameraPose';

// Sin «lag smoothing»: si el equipo va lento, la transición salta fotogramas pero termina a tiempo
// (con el valor por defecto de GSAP, una caída de fps alargaría la transición indefinidamente).
gsap.ticker.lagSmoothing(0);

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const index = usePresentation((s) => s.index);
  const mode = usePresentation((s) => s.mode);
  const setTransitioning = usePresentation((s) => s.setTransitioning);

  const target = useRef(new Vector3());
  const tween = useRef<gsap.core.Tween | null>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const lastNav = useRef(0);
  const started = useRef(false);

  const flyTo = (shot: CameraShot) => {
    tween.current?.kill();
    const from = camera.position.toArray() as unknown as Vec3;
    const fromTarget = target.current.toArray() as unknown as Vec3;
    const fromFov = camera.fov;
    const dist = camera.position.distanceTo(new Vector3(...shot.position));

    if (dist < 0.01 && target.current.distanceTo(new Vector3(...shot.target)) < 0.01) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
      setTransitioning(false);
      return;
    }

    const curve = buildCurve(buildControlPoints(from, shot.position, { waypoints: shot.waypoints, direct: shot.direct }));
    const t = performance.now();
    const fast = t - lastNav.current < 1200; // pulsaciones seguidas → transiciones cortas
    lastNav.current = t;
    const duration = transitionDuration(shot.duration, curve.getLength(), { fast, reducedMotion: prefersReducedMotion() });

    const state = { k: 0 };
    setTransitioning(true);
    tween.current = gsap.to(state, {
      k: 1,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.copy(curve.getPointAt(state.k));
        const tg = lerpVec3(fromTarget, shot.target, state.k);
        target.current.set(tg[0], tg[1], tg[2]);
        camera.fov = fromFov + (shot.fov - fromFov) * state.k;
        camera.updateProjectionMatrix();
      },
      onComplete: () => setTransitioning(false),
    });
  };

  // Pose inicial: toma aérea alejada, seguida de una entrada cinematográfica hacia la primera escena.
  useLayoutEffect(() => {
    const shot = SCENES[usePresentation.getState().index].camera;
    const [x, y, z] = shot.position;
    camera.position.set(x * 1.35, y * 1.5, z * 1.35);
    target.current.set(...shot.target);
    camera.fov = shot.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(target.current);
  }, [camera]);

  useLayoutEffect(() => {
    if (mode === 'free') {
      tween.current?.kill();
      setTransitioning(false);
      if (controls.current) {
        controls.current.target.copy(target.current);
        controls.current.update();
      }
      return;
    }
    if (controls.current && started.current) target.current.copy(controls.current.target);
    started.current = true;
    flyTo(SCENES[index].camera);
    // flyTo depende solo de refs y de la cámara
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, mode]);

  useEffect(() => () => void tween.current?.kill(), []);

  useFrame(() => {
    if (mode === 'guided') camera.lookAt(target.current);
    cameraPose.position.copy(camera.position);
    cameraPose.target.copy(mode === 'free' && controls.current ? controls.current.target : target.current);
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={mode === 'free'}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI * 0.49}
      minDistance={1.5}
      maxDistance={160}
    />
  );
}
