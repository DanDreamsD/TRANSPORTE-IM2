// Iluminación industrial: cielo + sol cenital (sombras suaves según calidad) y reflejos procedurales (sin HDR remoto).
import { Environment, Lightformer } from '@react-three/drei';
import type { Quality } from '../state/store';

const SHADOW_MAP: Record<Quality, number> = { low: 0, medium: 2048, high: 4096 };

export function Lighting({ quality }: { quality: Quality }) {
  const shadows = quality !== 'low';
  return (
    <>
      <color attach="background" args={['#a9b5bd']} />
      <fog attach="fog" args={['#a9b5bd', 220, 520]} />
      <hemisphereLight args={['#e6eef4', '#5d625e', 1.15]} />
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[-38, 70, 34]}
        intensity={2.3}
        color="#fff5e6"
        castShadow={shadows}
        shadow-mapSize-width={SHADOW_MAP[quality] || 1024}
        shadow-mapSize-height={SHADOW_MAP[quality] || 1024}
        shadow-camera-left={-72}
        shadow-camera-right={72}
        shadow-camera-top={52}
        shadow-camera-bottom={-52}
        shadow-camera-near={10}
        shadow-camera-far={200}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      {/* luz de relleno fría desde el norte */}
      <directionalLight position={[30, 40, -50]} intensity={0.45} color="#cfe0ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} color="#ffffff" />
        <Lightformer intensity={0.9} position={[-20, 4, 10]} rotation-y={Math.PI / 2} scale={[30, 6, 1]} color="#ffe9c9" />
        <Lightformer intensity={0.7} position={[20, 4, -10]} rotation-y={-Math.PI / 2} scale={[30, 6, 1]} color="#d6e6ff" />
      </Environment>
    </>
  );
}
