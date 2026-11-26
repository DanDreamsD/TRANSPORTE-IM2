// Lienzo WebGL único y persistente, con calidad configurable y detección de pérdida de contexto.
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { usePresentation, type Quality } from '../state/store';
import { World } from '../world/World';

const DPR: Record<Quality, [number, number]> = { low: [1, 1], medium: [1, 1.5], high: [1, 2] };

export function Experience() {
  const quality = usePresentation((s) => s.quality);
  const setView = usePresentation((s) => s.setView);
  return (
    <Canvas
      className="experience-canvas"
      dpr={DPR[quality]}
      shadows={{ type: PCFSoftShadowMap }}
      camera={{ fov: 38, near: 0.1, far: 600, position: [-80, 70, 90] }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
      onCreated={(state) => {
        const { gl } = state;
        gl.toneMappingExposure = 1.0;
        // Acceso de depuración a la escena en desarrollo.
        if (import.meta.env.DEV) (window as unknown as { __r3f: typeof state }).__r3f = state;
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => {
            e.preventDefault();
            // Al pasar a 2D manualmente, R3F libera el contexto: no es un fallo.
            if (usePresentation.getState().view === '2d') return;
            setView('2d', 'Se perdió el contexto WebGL (posible falta de memoria de video). Se activó el modo 2D.');
          },
          { once: true },
        );
      }}
    >
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  );
}
