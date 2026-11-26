// Minimapa de la planta: zonas, recorrido del material, posición y dirección de la cámara en tiempo real.
import { useEffect, useRef } from 'react';
import { SCENES } from '../content/sceneRegistry';
import { MATERIAL_FLOW_PATH, PLANT, ZONES } from '../content/zones';
import { cameraPose } from '../engine/cameraPose';
import { usePresentation } from '../state/store';

const PAD = 2;
const VB_W = PLANT.x[1] - PLANT.x[0] + PAD * 2;
const VB_H = PLANT.z[1] - PLANT.z[0] + PAD * 2;
const sx = (x: number) => x - PLANT.x[0] + PAD;
const sz = (z: number) => z - PLANT.z[0] + PAD;

export function Minimap({ live = true, className = '' }: { live?: boolean; className?: string }) {
  const index = usePresentation((s) => s.index);
  const goTo = usePresentation((s) => s.goTo);
  const scene = SCENES[index];
  const cam = useRef<SVGGElement>(null);

  useEffect(() => {
    const draw = () => {
      const g = cam.current;
      if (!g) return;
      const p = live ? cameraPose.position : { x: scene.camera.position[0], z: scene.camera.position[2] };
      const t = live ? cameraPose.target : { x: scene.camera.target[0], z: scene.camera.target[2] };
      const x = Math.min(PLANT.x[1] + 8, Math.max(PLANT.x[0] - 8, p.x));
      const z = Math.min(PLANT.z[1] + 8, Math.max(PLANT.z[0] - 8, p.z));
      const ang = (Math.atan2(t.z - p.z, t.x - p.x) * 180) / Math.PI;
      g.setAttribute('transform', `translate(${sx(x)},${sz(z)}) rotate(${ang})`);
    };
    draw();
    if (!live) return;
    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, scene]);

  const firstSceneOf = (zoneId: string) => SCENES.findIndex((s) => s.zone === zoneId);
  const flow = MATERIAL_FLOW_PATH.map(([x, z]) => `${sx(x)},${sz(z)}`).join(' ');

  return (
    <div className={`minimap ${className}`}>
      <div className="minimap__title">Planta NOVATEK</div>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Minimapa de la planta">
        <rect x={PAD} y={PAD} width={VB_W - PAD * 2} height={VB_H - PAD * 2} className="mm-plant" />
        {ZONES.map((z) => {
          const target = firstSceneOf(z.id);
          const current = scene.zone === z.id;
          return (
            <g
              key={z.id}
              className={`mm-zone ${current ? 'is-current' : ''} ${target >= 0 ? 'has-scene' : ''}`}
              onClick={() => target >= 0 && goTo(target)}
            >
              <title>{target >= 0 ? `${z.name} — ir a «${SCENES[target].title}»` : `${z.name} (escenas en preparación)`}</title>
              <rect x={sx(z.x[0])} y={sz(z.z[0])} width={z.x[1] - z.x[0]} height={z.z[1] - z.z[0]} rx={0.8} style={{ ['--zone' as string]: z.color }} />
            </g>
          );
        })}
        <polyline points={flow} className="mm-flow" />
        <g ref={cam} className="mm-cam">
          <path d="M0 0 L9 -4.5 L9 4.5 Z" className="mm-cone" />
          <circle r="2" className="mm-dot" />
        </g>
      </svg>
      <div className="minimap__zone">{scene.zone === 'overview' ? 'Vista general' : ZONES.find((z) => z.id === scene.zone)?.name}</div>
    </div>
  );
}
