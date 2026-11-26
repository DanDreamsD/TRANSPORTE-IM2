import { describe, expect, it } from 'vitest';
import { buildControlPoints, CRUISE_ALTITUDE, transitionDuration } from './cameraPaths';
import { SCENES } from '../content/sceneRegistry';
import { REFERENCES } from '../content/references';
import { PRESENTERS } from '../content/presenters';
import { clampIndex } from '../state/store';
import { createSim, stepConveyor, endStop, DEFAULT_CONVEYOR } from '../world/demos/conveyorSim';

describe('rutas de cámara', () => {
  it('ruta larga sube a la altura de crucero y conserva extremos', () => {
    const pts = buildControlPoints([-40, 3, 2], [16, 3, -4]);
    expect(pts[0]).toEqual([-40, 3, 2]);
    expect(pts[pts.length - 1]).toEqual([16, 3, -4]);
    expect(Math.min(pts[1][1], pts[2][1])).toBeGreaterThanOrEqual(CRUISE_ALTITUDE);
  });
  it('ruta corta es directa', () => expect(buildControlPoints([0, 3, 0], [4, 3, 0])).toHaveLength(2));
  it('duración acotada', () => {
    expect(transitionDuration(3, 500)).toBeLessThanOrEqual(6);
    expect(transitionDuration(3, 500, { fast: true })).toBeLessThanOrEqual(1.4);
  });
});

describe('registro de escenas', () => {
  it('ids únicos, referencias y presentadores válidos, cámara finita', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
    for (const s of SCENES) {
      expect(PRESENTERS[s.presenter]).toBeDefined();
      for (const r of s.references) expect(REFERENCES[r]).toBeDefined();
      expect([...s.camera.position, ...s.camera.target].every(Number.isFinite)).toBe(true);
      expect(s.camera.fov).toBeGreaterThan(10);
      expect(s.camera.fov).toBeLessThan(90);
    }
  });
});

describe('navegación y demo', () => {
  it('clampIndex', () => {
    expect(clampIndex(-1, 3)).toBe(0);
    expect(clampIndex(9, 3)).toBe(2);
  });
  it('el transportador acumula sin superar el tope', () => {
    const sim = createSim();
    for (let i = 0; i < 3000; i++) stepConveyor(sim, 1 / 30, 1.6, true);
    expect(Math.max(...sim.boxes.map((b) => b.s))).toBeLessThanOrEqual(endStop(DEFAULT_CONVEYOR) + 1e-9);
  });
});
