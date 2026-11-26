// Registro ordenado de escenas. Para agregar, quitar o reordenar escenas basta con editar este arreglo:
// el motor de presentación, la navegación, el menú y el minimapa se adaptan automáticamente.
import type { SceneDef } from './types';
import { portada } from './scenes/portada';
import { cargaUnitaria } from './scenes/cargaUnitaria';
import { transportadores } from './scenes/transportadores';
import { casoDynea, clasificacionEquipo, gradosMecanizacion, mecanizacionDecision, palletsNormalizacion } from './scenes/carlos';
import { casoAgvAsientos, gruas, gruasServicio, transportadoresCriterios } from './scenes/vane';
import { agvAmr, asrs, casoSchrock, estacionRobots, niosh, recepcionAlmacenamiento, transportesMontacargas } from './scenes/nicole';
import { casoMarcopolo, definicionAlcance, moverMateriales, objetivosCostos, principios, trabajoFlujoDistancia } from './scenes/felipe';

export const SCENES: readonly SceneDef[] = [
  portada,
  // Felipe · cap. 1 y 2 + caso 1
  definicionAlcance,
  moverMateriales,
  objetivosCostos,
  principios,
  trabajoFlujoDistancia,
  casoMarcopolo,
  // Carlos · cap. 3, 4 y 5 + caso 2
  gradosMecanizacion,
  mecanizacionDecision,
  cargaUnitaria,
  palletsNormalizacion,
  clasificacionEquipo,
  casoDynea,
  // Vane · cap. 6 y 7 + caso 4
  transportadores,
  transportadoresCriterios,
  gruas,
  gruasServicio,
  casoAgvAsientos,
  // Nicole · cap. 8, 9 y 10 + caso 3
  transportesMontacargas,
  agvAmr,
  niosh,
  estacionRobots,
  casoSchrock,
  recepcionAlmacenamiento,
  asrs,
];

export function sceneIndexById(id: string): number {
  return SCENES.findIndex((s) => s.id === id);
}
