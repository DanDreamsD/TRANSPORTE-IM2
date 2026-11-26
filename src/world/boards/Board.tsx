// Pizarra industrial / pantalla de planta que muestra el contenido académico de una escena dentro del entorno.
// El contenido es HTML real (nítido, con KaTeX y gráficos) proyectado en 3D con <Html transform>.
// Solo la pizarra de la escena activa «se enciende»; las demás muestran la superficie apagada.
import { Html } from '@react-three/drei';
import type { SceneDef } from '../../content/types';
import { faceTowards } from '../../engine/cameraPaths';
import { usePresentation } from '../../state/store';
import { BoardSurface, boardPixelSize } from '../../ui/BoardSurface';
import { GEO, mat } from '../materials';

/** drei <Html transform> escala 1 px CSS = 1/40 unidades del mundo (distanceFactor = 10). */
const PX_PER_UNIT = 40;

interface Props {
  scene: SceneDef;
  active: boolean;
  /** Orientación fija del soporte (pizarras compartidas: la define la primera escena que la usa). */
  rotationOverride?: number;
}

export function boardRotation(scene: SceneDef): number {
  const b = scene.board;
  if (!b) return 0;
  return b.rotationY ?? faceTowards(b.position, scene.camera.position);
}

export function Board({ scene, active, rotationOverride }: Props) {
  const transitioning = usePresentation((s) => s.transitioning);
  const placement = scene.board;
  if (!placement) return null;
  // Las pantallas colgantes se despliegan solo en su escena: apagadas estorbarían las vistas de otras escenas.
  if (placement.mount === 'hanging' && !active) return null;
  const w = placement.width;
  const h = placement.height ?? (w * 9) / 16;
  const rotationY = rotationOverride ?? boardRotation(scene);
  const { pxW } = boardPixelSize(scene);
  const scale = w / (pxW / PX_PER_UNIT);
  const isScreen = placement.style === 'screen';
  const [x, y, z] = placement.position;
  const bottom = y - h / 2;

  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      {/* marco */}
      <mesh geometry={GEO.box} material={isScreen ? mat('machineDark') : mat('galvanized')} position={[0, 0, -0.04]} scale={[w + 0.16, h + 0.16, 0.06]} castShadow />
      {/* superficie */}
      <mesh geometry={GEO.plane} position={[0, 0, 0.0]} scale={[w, h, 1]}>
        <meshStandardMaterial
          color={isScreen ? (active ? '#0f1a22' : '#151b20') : '#f4f6f5'}
          roughness={isScreen ? 0.25 : 0.5}
          metalness={isScreen ? 0.2 : 0}
          emissive={isScreen ? '#0c1820' : '#ffffff'}
          emissiveIntensity={isScreen ? (active ? 0.6 : 0.1) : 0.12}
        />
      </mesh>
      {/* soporte */}
      {placement.mount !== 'hanging' && placement.mount !== 'wall' && (
        <group>
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh geometry={GEO.box} material={mat('steel')} position={[s * (w / 2 - 0.15), -h / 2 - bottom / 2, -0.05]} scale={[0.07, bottom, 0.07]} castShadow />
              <mesh geometry={GEO.box} material={mat('steel')} position={[s * (w / 2 - 0.15), -h / 2 - bottom + 0.03, -0.05]} scale={[0.08, 0.06, 0.8]} />
            </group>
          ))}
          {!isScreen && <mesh geometry={GEO.box} material={mat('galvanized')} position={[0, -h / 2 - 0.08, 0.06]} scale={[w * 0.9, 0.04, 0.12]} />}
        </group>
      )}
      {placement.mount === 'hanging' && (
        <group>
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={GEO.box} material={mat('steel')} position={[s * (w / 2 - 0.3), h / 2 + (10.4 - y - h / 2) / 2, -0.05]} scale={[0.03, 10.4 - y - h / 2, 0.03]} />
          ))}
        </group>
      )}
      {/* contenido */}
      {active && (
        <group scale={scale} position={[0, 0, 0.01]}>
          <Html transform zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <BoardSurface scene={scene} live={!transitioning} />
          </Html>
        </group>
      )}
    </group>
  );
}
