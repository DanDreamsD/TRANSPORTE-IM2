// Etiqueta asociada a maquinaria: texto HTML nítido anclado a un punto 3D, con línea guía.
import { Html } from '@react-three/drei';
import type { Vec3 } from '../../content/types';

interface Props {
  position: Vec3;
  title: string;
  detail?: string;
  visible: boolean;
  tone?: 'default' | 'accent' | 'ok' | 'danger';
  /** Altura de la línea guía en píxeles. */
  lead?: number;
}

export function Tag3D({ position, title, detail, visible, tone = 'default', lead = 36 }: Props) {
  return (
    <Html position={[position[0], position[1], position[2]]} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
      <div className={`tag3d tag3d--${tone} ${visible ? 'is-visible' : ''}`} style={{ ['--lead' as string]: `${lead}px` }}>
        <div className="tag3d__box">
          <strong>{title}</strong>
          {detail && <span>{detail}</span>}
        </div>
        <div className="tag3d__line" />
        <div className="tag3d__dot" />
      </div>
    </Html>
  );
}
