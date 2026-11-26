// Mundo 3D persistente: se monta una sola vez y no se desmonta al cambiar de escena.
import { SCENES } from '../content/sceneRegistry';
import { usePresentation } from '../state/store';
import { CameraRig } from '../engine/CameraRig';
import { Lighting } from './Lighting';
import { Building } from './Building';
import { FloorMarkings } from './FloorMarkings';
import { ZoneSigns } from './ZoneSigns';
import { PlantLayout } from './PlantLayout';
import { Board, boardRotation } from './boards/Board';
import { MaterialFlowDemo } from './demos/MaterialFlowDemo';
import { UnitLoadDemo } from './demos/UnitLoadDemo';
import { ConveyorDemo } from './demos/ConveyorDemo';
import { TruckUnloadDemo } from './demos/TruckUnloadDemo';
import { FlowDistanceDemo } from './demos/FlowDistanceDemo';
import { TuggerDemo } from './demos/TuggerDemo';
import { MechanizationDemo } from './demos/MechanizationDemo';
import { PalletSizesDemo } from './demos/PalletSizesDemo';
import { DyneaDemo } from './demos/DyneaDemo';
import { CranesDemo } from './demos/CranesDemo';
import { AgvSeatsDemo } from './demos/AgvSeatsDemo';

// Varias escenas pueden compartir una misma pizarra física (misma posición): se dibuja una sola vez.
function boardKey(p: readonly number[]): string {
  return p.map((v) => v.toFixed(2)).join(',');
}
const boardGroups: number[][] = (() => {
  const map = new Map<string, number[]>();
  SCENES.forEach((s, i) => {
    if (!s.board) return;
    const k = boardKey(s.board.position);
    map.set(k, [...(map.get(k) ?? []), i]);
  });
  return [...map.values()];
})();

export function World() {
  const quality = usePresentation((s) => s.quality);
  const index = usePresentation((s) => s.index);
  return (
    <>
      <Lighting quality={quality} />
      <CameraRig />
      <Building />
      <FloorMarkings />
      <ZoneSigns />
      <PlantLayout />
      <MaterialFlowDemo />
      <UnitLoadDemo />
      <ConveyorDemo />
      <TruckUnloadDemo />
      <FlowDistanceDemo />
      <TuggerDemo />
      <MechanizationDemo />
      <PalletSizesDemo />
      <DyneaDemo />
      <CranesDemo />
      <AgvSeatsDemo />
      {boardGroups.map((g) => {
        const current = g.find((i) => i === index);
        const scene = SCENES[current ?? g[0]];
        return (
          <Board
            key={scene.board ? boardKey(scene.board.position) : scene.id}
            scene={scene}
            active={current !== undefined}
            rotationOverride={boardRotation(SCENES[g[0]])}
          />
        );
      })}
    </>
  );
}
