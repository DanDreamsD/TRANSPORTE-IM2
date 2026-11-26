// Estado global de la presentación (Zustand). Compartido entre la escena 3D y la interfaz.
import { create } from 'zustand';
import { SCENES } from '../content/sceneRegistry';

export type Quality = 'low' | 'medium' | 'high';
export type CameraMode = 'guided' | 'free';
export type ViewMode = '3d' | '2d';

export interface DemoParams {
  conveyorSpeed: number; // m/s
  conveyorRunning: boolean;
}

export interface PresentationState {
  index: number;
  sceneCount: number;
  mode: CameraMode;
  view: ViewMode;
  /** Motivo por el que se activó el modo 2D automáticamente (sin WebGL, error, contexto perdido). */
  fallbackReason: string | null;
  expanded: boolean;
  supplementary: boolean;
  showMenu: boolean;
  showReferences: boolean;
  showNotes: boolean;
  showHelp: boolean;
  showMinimap: boolean;
  quality: Quality;
  /** Se incrementa para reiniciar las animaciones de la escena actual. */
  replayToken: number;
  /** Marca de tiempo (performance.now) en que empezó el reloj de la demo actual. */
  demoStartedAt: number;
  transitioning: boolean;
  demo: DemoParams;

  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  home: () => void;
  replay: () => void;
  setMode: (mode: CameraMode) => void;
  toggleMode: () => void;
  setView: (view: ViewMode, reason?: string | null) => void;
  setQuality: (q: Quality) => void;
  cycleQuality: () => void;
  toggle: (key: PanelKey) => void;
  closePanels: () => void;
  setTransitioning: (v: boolean) => void;
  setDemo: (patch: Partial<DemoParams>) => void;
}

export type PanelKey = 'expanded' | 'supplementary' | 'showMenu' | 'showReferences' | 'showNotes' | 'showHelp' | 'showMinimap';

export function clampIndex(i: number, count: number): number {
  if (count <= 0) return 0;
  if (!Number.isFinite(i)) return 0;
  return Math.min(count - 1, Math.max(0, Math.trunc(i)));
}

const QUALITY_ORDER: Quality[] = ['low', 'medium', 'high'];

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function initialQuality(): Quality {
  try {
    const q = globalThis.localStorage?.getItem('novatek.quality');
    if (q === 'low' || q === 'medium' || q === 'high') return q;
  } catch {
    /* almacenamiento no disponible */
  }
  return 'medium';
}

export const usePresentation = create<PresentationState>()((set, get) => ({
  index: 0,
  sceneCount: SCENES.length,
  mode: 'guided',
  view: '3d',
  fallbackReason: null,
  expanded: false,
  supplementary: false,
  showMenu: false,
  showReferences: false,
  showNotes: false,
  showHelp: false,
  showMinimap: true,
  quality: initialQuality(),
  replayToken: 0,
  demoStartedAt: now(),
  transitioning: false,
  demo: { conveyorSpeed: 0.8, conveyorRunning: true },

  goTo: (index) => {
    const i = clampIndex(index, get().sceneCount);
    // Navegar devuelve el control al modo guiado: cámara, contenido, animaciones e indicadores se actualizan juntos.
    set({ index: i, mode: 'guided', demoStartedAt: now(), showMenu: false, demo: { ...get().demo, conveyorRunning: true } });
  },
  next: () => get().goTo(get().index + 1),
  prev: () => get().goTo(get().index - 1),
  home: () => get().goTo(0),
  replay: () => set((s) => ({ replayToken: s.replayToken + 1, demoStartedAt: now(), demo: { ...s.demo, conveyorRunning: true } })),
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'guided' ? 'free' : 'guided' })),
  setView: (view, reason = null) => set({ view, fallbackReason: reason }),
  setQuality: (quality) => {
    try {
      globalThis.localStorage?.setItem('novatek.quality', quality);
    } catch {
      /* ignorar */
    }
    set({ quality });
  },
  cycleQuality: () => {
    const q = get().quality;
    get().setQuality(QUALITY_ORDER[(QUALITY_ORDER.indexOf(q) + 1) % QUALITY_ORDER.length]);
  },
  toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<PresentationState>),
  closePanels: () => set({ expanded: false, showMenu: false, showReferences: false, showNotes: false, showHelp: false }),
  // El reloj de la demo arranca cuando la cámara llega a la escena.
  setTransitioning: (transitioning) => set(transitioning ? { transitioning } : { transitioning, demoStartedAt: now() }),
  setDemo: (patch) => set((s) => ({ demo: { ...s.demo, ...patch } })),
}));

export function useCurrentScene() {
  return usePresentation((s) => SCENES[s.index]);
}
