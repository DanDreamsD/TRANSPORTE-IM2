// Materiales compartidos (se crean una sola vez y se reutilizan en todo el mundo).
import { BoxGeometry, CylinderGeometry, DoubleSide, MeshStandardMaterial, PlaneGeometry } from 'three';
import { PALETTE } from './palette';
import { hazardTexture } from './textures';

type MatKey =
  | 'steel'
  | 'steelLight'
  | 'galvanized'
  | 'yellow'
  | 'black'
  | 'rackUpright'
  | 'rackBeam'
  | 'wood'
  | 'woodDark'
  | 'carton'
  | 'machine'
  | 'machineAccent'
  | 'machineDark'
  | 'wallLower'
  | 'wallCladding'
  | 'door'
  | 'glass'
  | 'lamp'
  | 'white'
  | 'green'
  | 'hazard'
  | 'trailer'
  | 'pipeBlue'
  | 'pipeRed'
  | 'wrap'
  | 'opening';

const defs: Record<MatKey, () => MeshStandardMaterial> = {
  steel: () => new MeshStandardMaterial({ color: PALETTE.steel, metalness: 0.6, roughness: 0.45 }),
  steelLight: () => new MeshStandardMaterial({ color: PALETTE.steelLight, metalness: 0.55, roughness: 0.5 }),
  galvanized: () => new MeshStandardMaterial({ color: PALETTE.galvanized, metalness: 0.8, roughness: 0.32 }),
  yellow: () => new MeshStandardMaterial({ color: PALETTE.safetyYellow, metalness: 0.2, roughness: 0.55 }),
  black: () => new MeshStandardMaterial({ color: PALETTE.safetyBlack, metalness: 0.3, roughness: 0.6 }),
  rackUpright: () => new MeshStandardMaterial({ color: PALETTE.rackUpright, metalness: 0.4, roughness: 0.5 }),
  rackBeam: () => new MeshStandardMaterial({ color: PALETTE.rackBeam, metalness: 0.35, roughness: 0.5 }),
  wood: () => new MeshStandardMaterial({ color: PALETTE.palletWood, roughness: 0.85 }),
  woodDark: () => new MeshStandardMaterial({ color: PALETTE.palletWoodDark, roughness: 0.9 }),
  carton: () => new MeshStandardMaterial({ color: PALETTE.carton, roughness: 0.92 }),
  machine: () => new MeshStandardMaterial({ color: PALETTE.machineBody, metalness: 0.25, roughness: 0.45 }),
  machineAccent: () => new MeshStandardMaterial({ color: PALETTE.machineAccent, metalness: 0.3, roughness: 0.45 }),
  machineDark: () => new MeshStandardMaterial({ color: PALETTE.machineDark, metalness: 0.4, roughness: 0.5 }),
  wallLower: () => new MeshStandardMaterial({ color: PALETTE.wallLower, roughness: 0.9 }),
  wallCladding: () => new MeshStandardMaterial({ color: PALETTE.wallCladding, metalness: 0.35, roughness: 0.6 }),
  door: () => new MeshStandardMaterial({ color: '#46525c', metalness: 0.4, roughness: 0.55 }),
  glass: () =>
    new MeshStandardMaterial({
      color: PALETTE.glass,
      metalness: 0.1,
      roughness: 0.08,
      transparent: true,
      opacity: 0.28,
      side: DoubleSide,
      depthWrite: false,
    }),
  lamp: () => new MeshStandardMaterial({ color: '#fffbe8', emissive: '#fff4cf', emissiveIntensity: 2.2 }),
  white: () => new MeshStandardMaterial({ color: '#f1f3f2', roughness: 0.6 }),
  green: () => new MeshStandardMaterial({ color: PALETTE.pedestrianGreen, roughness: 0.8 }),
  hazard: () => new MeshStandardMaterial({ map: hazardTexture(), roughness: 0.7 }),
  trailer: () => new MeshStandardMaterial({ color: '#e7e9ea', metalness: 0.3, roughness: 0.5 }),
  pipeBlue: () => new MeshStandardMaterial({ color: '#2f6ea5', metalness: 0.4, roughness: 0.45 }),
  pipeRed: () => new MeshStandardMaterial({ color: '#b23a32', metalness: 0.4, roughness: 0.45 }),
  opening: () => new MeshStandardMaterial({ color: '#15191c', roughness: 1 }),
  wrap: () =>
    new MeshStandardMaterial({
      color: '#dfeef5',
      metalness: 0.1,
      roughness: 0.15,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    }),
};

const cache = new Map<MatKey, MeshStandardMaterial>();

export function mat(key: MatKey): MeshStandardMaterial {
  let m = cache.get(key);
  if (!m) {
    m = defs[key]();
    cache.set(key, m);
  }
  return m;
}

// Geometrías unitarias compartidas: se escalan por instancia.
export const GEO = {
  box: new BoxGeometry(1, 1, 1),
  cylinder: new CylinderGeometry(0.5, 0.5, 1, 16),
  cylinderLow: new CylinderGeometry(0.5, 0.5, 1, 8),
  plane: new PlaneGeometry(1, 1),
};
