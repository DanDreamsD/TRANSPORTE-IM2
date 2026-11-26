// Reloj de demostración compartido: la escena 3D y la interfaz HTML calculan el mismo instante,
// así los contadores de las pizarras quedan sincronizados con la animación.
import { useEffect, useState } from 'react';
import { SCENES } from '../../content/sceneRegistry';
import type { AnimationId } from '../../content/types';
import { usePresentation } from '../../state/store';

/** Segundos transcurridos desde que empezó (o se repitió) la demo de la escena actual. */
export function demoElapsed(): number {
  const s = usePresentation.getState();
  if (s.transitioning) return 0; // durante el viaje de cámara la demo espera en su estado inicial
  return (performance.now() - s.demoStartedAt) / 1000;
}

export function isAnimationActive(id: AnimationId): boolean {
  const s = usePresentation.getState();
  return SCENES[s.index]?.animations.includes(id) ?? false;
}

export function useAnimationActive(id: AnimationId): boolean {
  return usePresentation((s) => SCENES[s.index]?.animations.includes(id) ?? false);
}

/** Tiempo de demo para componentes DOM, actualizado a ~12 Hz (suficiente para contadores). */
export function useDemoTimeDom(active = true): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 80) {
        last = now;
        setT(demoElapsed());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return t;
}
