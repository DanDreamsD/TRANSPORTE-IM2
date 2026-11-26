// Demo 4 · Dimensiones y normalización de pallets: los seis tamaños principales de ISO 6780:2003 a escala real,
// con el módulo de 600 × 400 mm de BS 6884 marcado sobre el pallet europeo.
import { Html } from '@react-three/drei';
import { usePresentation } from '../../state/store';
import { GEO, mat } from '../materials';
import { Pallet, PALLET_HEIGHT } from '../equipment/Pallet';
import { useAnimationActive } from './demoClock';

export const ISO_6780 = [
  { l: 1200, w: 800, label: '1200 × 800', sub: 'Europea' },
  { l: 1200, w: 1000, label: '1200 × 1000', sub: 'ISO preferido (BS 6884)' },
  { l: 1219, w: 1016, label: '1219 × 1016', sub: '48″ × 40″, EE. UU.' },
  { l: 1140, w: 1140, label: '1140 × 1140', sub: '' },
  { l: 1100, w: 1100, label: '1100 × 1100', sub: '' },
  { l: 1067, w: 1067, label: '1067 × 1067', sub: '42″ × 42″' },
];

const ROW_Z = 12.0;
/** Se ordenan de este a oeste: vistos desde el pasillo (mirando al sur) se leen de izquierda a derecha. */
const X_START = -34.3;
const GAP = 0.45;

export function palletRowLayout() {
  let x = X_START;
  return ISO_6780.map((p) => {
    const l = p.l / 1000;
    const cx = x - l / 2;
    x -= l + GAP;
    return { ...p, cx, lm: l, wm: p.w / 1000 };
  });
}

export function PalletSizesDemo() {
  const active = useAnimationActive('pallet-sizes');
  const transitioning = usePresentation((s) => s.transitioning);
  const layout = palletRowLayout();
  const eur = layout[0];
  const show = active && !transitioning;
  return (
    <group>
      {layout.map((p) => (
        <Pallet key={p.label} position={[p.cx, 0, ROW_Z]} length={p.lm} width={p.wm} />
      ))}
      {/* módulo 600 × 400 mm (BS 6884) sobre el pallet europeo */}
      <group position={[eur.cx, PALLET_HEIGHT + 0.004, ROW_Z]}>
        <mesh geometry={GEO.box} material={mat('machineAccent')} scale={[0.6, 0.006, 0.4]} position={[-0.3, 0, -0.2]} />
        <mesh geometry={GEO.box} material={mat('black')} scale={[1.2, 0.008, 0.02]} />
        <mesh geometry={GEO.box} material={mat('black')} scale={[0.02, 0.008, 0.8]} />
      </group>
      {show &&
        layout.map((p, i) => (
          <Html key={p.label} position={[p.cx, 0.02, ROW_Z - p.wm / 2 - 0.45]} center zIndexRange={[25, 10]} style={{ pointerEvents: 'none' }}>
            <div className={`floor-label floor-label--pallet ${i === 0 ? 'is-eur' : ''}`}>
              <b>{p.label}</b>
              {p.sub && <span>{p.sub}</span>}
            </div>
          </Html>
        ))}
      {show && (
        <Html position={[eur.cx, 0.32, ROW_Z + 0.15]} center zIndexRange={[26, 10]} style={{ pointerEvents: 'none' }}>
          <div className="floor-label floor-label--module">módulo 600 × 400</div>
        </Html>
      )}
    </group>
  );
}
