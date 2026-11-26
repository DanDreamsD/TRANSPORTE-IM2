import { describe, expect, it } from 'vitest';
import { sampleKeys, type PoseKey } from './keyframes';
import { handlingWork, TABLE5 } from './FlowDistanceDemo';

describe('fotogramas clave', () => {
  const keys: PoseKey[] = [
    { t: 0, x: 0, z: 0, yaw: 0, lift: 0, flag: true },
    { t: 2, x: 10, z: 0, yaw: Math.PI / 2, lift: 1, flag: false },
    { t: 4, x: 0, z: 0, yaw: 0, lift: 0, flag: true },
  ];
  it('interpola y respeta los extremos', () => {
    expect(sampleKeys(keys, 0, 4).x).toBe(0);
    expect(sampleKeys(keys, 1, 4).x).toBeCloseTo(5);
    expect(sampleKeys(keys, 2, 4).x).toBe(10);
    expect(sampleKeys(keys, 2.5, 4).flag).toBe(false);
  });
  it('repite el ciclo', () => expect(sampleKeys(keys, 5, 4).x).toBeCloseTo(sampleKeys(keys, 1, 4).x));
});

describe('Tabla 5 (ejemplo hipotético de la guía)', () => {
  it('reproduce los totales y la reducción publicados', () => {
    const a = handlingWork(TABLE5.flows, TABLE5.distA);
    const b = handlingWork(TABLE5.flows, TABLE5.distB);
    expect(a).toBe(3525);
    expect(b).toBe(1350);
    expect(Math.round((1 - b / a) * 1000) / 10).toBe(61.7);
  });
});

import { sackLayout, sacksAt, SACKS_AFTER, SACKS_BEFORE } from './DyneaDemo';
import { ISO_6780, palletRowLayout } from './PalletSizesDemo';
import { activeMechLevel, MECH_CYCLE } from './mechanizationTimeline';

describe('caso Dynea (35 → 50 sacos por pallet)', () => {
  it('el contador va de 35 a 50 en capas de 5', () => {
    expect(sacksAt(0)).toBe(SACKS_BEFORE);
    expect(sacksAt(100)).toBe(SACKS_AFTER);
    expect(sackLayout(SACKS_AFTER)).toHaveLength(50);
  });
  it('50 sacos caben bajo el larguero del nivel superior (1,58 m libres)', () => {
    const top = Math.max(...sackLayout(SACKS_AFTER).map((s) => s.p[1] + s.s[1] / 2));
    expect(top).toBeLessThan(1.58);
  });
});

describe('pallets ISO 6780', () => {
  it('seis dimensiones de la Figura 6, sin solaparse', () => {
    expect(ISO_6780.map((p) => `${p.l}x${p.w}`)).toEqual(['1200x800', '1200x1000', '1219x1016', '1140x1140', '1100x1100', '1067x1067']);
    const row = palletRowLayout();
    for (let i = 1; i < row.length; i++) expect(row[i].cx + row[i].lm / 2).toBeLessThan(row[i - 1].cx - row[i - 1].lm / 2);
  });
});

describe('grados de mecanización', () => {
  it('recorre los cinco grados en orden', () => {
    expect(activeMechLevel(0.5)).toBe(-1);
    expect([1.5, 4.5, 7.5, 10.5, 13.5].map(activeMechLevel)).toEqual([0, 1, 2, 3, 4]);
    expect(activeMechLevel(MECH_CYCLE + 1.5)).toBe(0);
  });
});

import { bridgeStateAt, BRIDGE_CYCLE } from './CranesDemo';
import { FAILURE_CYCLE, motorRunningAt } from './ConveyorDemo';
import { agvPaybackMonths } from '../../ui/blocks/Charts';

describe('grúa puente', () => {
  it('lleva la bobina del punto de recogida al de depósito y vuelve', () => {
    expect(bridgeStateAt(1).coil).toBe(0);
    expect(bridgeStateAt(9).coil).toBe(1);
    expect(bridgeStateAt(18).coil).toBe(2);
    expect(bridgeStateAt(BRIDGE_CYCLE + 9).coil).toBe(1);
  });
});

describe('falla del transportador', () => {
  it('el motor se detiene entre 4 y 12 s de cada ciclo', () => {
    expect(motorRunningAt(2)).toBe(true);
    expect(motorRunningAt(8)).toBe(false);
    expect(motorRunningAt(13)).toBe(true);
    expect(motorRunningAt(FAILURE_CYCLE + 8)).toBe(false);
  });
});

describe('caso 4 (Tabla 30)', () => {
  it('recuperación simple ≈ 7,4 meses', () => {
    expect(Math.round(agvPaybackMonths() * 10) / 10).toBe(7.4);
  });
});
