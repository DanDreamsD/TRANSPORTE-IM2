import type { ZoneId } from './types';

// Distribución conceptual de la planta (ver docs/FACTORY_LAYOUT.md).
// X: oeste → este (flujo); Z: norte → sur. Metros.

export interface Zone {
  id: Exclude<ZoneId, 'overview'>;
  name: string;
  short: string;
  x: [number, number];
  z: [number, number];
  color: string;
}

export const PLANT = { x: [-60, 60] as const, z: [-35, 35] as const, wallHeight: 10 };

export const ZONES: Zone[] = [
  { id: 'rec', name: 'Recepción y descarga', short: 'Recepción', x: [-60, -46], z: [-12, 26], color: '#5b8fb9' },
  { id: 'mp', name: 'Almacén de materia prima', short: 'Almacén MP', x: [-44, -26], z: [6, 32], color: '#d08a3c' },
  { id: 'prep', name: 'Preparación de materiales', short: 'Preparación', x: [-44, -26], z: [-32, -6], color: '#8a9a5b' },
  { id: 'proc', name: 'Procesamiento de componentes', short: 'Procesamiento', x: [-22, 0], z: [-32, -6], color: '#b0605a' },
  { id: 'man', name: 'Estaciones de trabajo manual', short: 'Estaciones manuales', x: [-22, 0], z: [6, 32], color: '#c27ba0' },
  { id: 'line', name: 'Línea de producción y ensamble', short: 'Línea de ensamble', x: [4, 30], z: [-32, -6], color: '#4aa39b' },
  { id: 'spine', name: 'Transporte interno (pasillo central)', short: 'Pasillo central', x: [-58, 58], z: [-3, 3], color: '#e9c46a' },
  { id: 'asrs', name: 'Almacén automatizado AS/RS', short: 'AS/RS', x: [4, 30], z: [8, 32], color: '#6c7fd8' },
  { id: 'pt', name: 'Almacén de productos terminados', short: 'Almacén PT', x: [33, 47], z: [6, 32], color: '#7a9e7e' },
  { id: 'desp', name: 'Área de despacho', short: 'Despacho', x: [48, 60], z: [4, 30], color: '#5b8fb9' },
  { id: 'eng', name: 'Oficinas de ingeniería', short: 'Ingeniería', x: [33, 46], z: [-32, -14], color: '#9b8ec4' },
  { id: 'meet', name: 'Sala de reuniones y gestión', short: 'Gestión', x: [47, 60], z: [-32, -14], color: '#9b8ec4' },
];

export const ZONE_BY_ID: Record<Zone['id'], Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<
  Zone['id'],
  Zone
>;

/** Recorrido del material, de recepción a despacho (demo 1 y minimapa). Puntos sobre el piso [x, z]. */
export const MATERIAL_FLOW_PATH: [number, number][] = [
  [-57, 8], // muelle de recepción
  [-50, 2],
  [-42.5, 9.5], // almacén MP
  [-33, 1.5],
  [-36, -10], // preparación
  [-27, -1.5],
  [-12, -10], // procesamiento
  [-6, -1.5],
  [-10, 8], // estaciones manuales
  [-1, 1.5],
  [14, -10], // línea de ensamble
  [21, -1.5],
  [16, 10.5], // AS/RS
  [27, 1.5],
  [40, 9.5], // almacén PT
  [46, 2],
  [52, 8], // despacho
];
