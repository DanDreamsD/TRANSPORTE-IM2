// Atajos de teclado (compatibles con presentadores inalámbricos que envían RePág/AvPág).
import { useEffect } from 'react';
import { usePresentation } from '../state/store';

export function toggleFullscreen() {
  if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => undefined);
  else void document.exitFullscreen?.().catch(() => undefined);
}

export function useKeyboard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const s = usePresentation.getState();
      let handled = true;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          s.next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          s.prev();
          break;
        case 'Home':
          s.home();
          break;
        case 'End':
          s.goTo(s.sceneCount - 1);
          break;
        case 'm':
        case 'M':
          s.toggle('showMenu');
          break;
        case 'e':
        case 'E':
          s.toggle('expanded');
          break;
        case 'c':
        case 'C':
          s.toggle('supplementary');
          break;
        case 'r':
        case 'R':
          s.replay();
          break;
        case 'b':
        case 'B':
          s.toggle('showReferences');
          break;
        case 'n':
        case 'N':
          s.toggle('showNotes');
          break;
        case 'l':
        case 'L':
          s.toggleMode();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'q':
        case 'Q':
          s.cycleQuality();
          break;
        case 'v':
        case 'V':
          s.setView(s.view === '3d' ? '2d' : '3d');
          break;
        case 'h':
        case 'H':
        case '?':
          s.toggle('showHelp');
          break;
        case 'Escape':
          s.closePanels();
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export const SHORTCUTS: [string, string][] = [
  ['→ / AvPág / Espacio', 'Escena siguiente'],
  ['← / RePág', 'Escena anterior'],
  ['Inicio / Fin', 'Portada / última escena'],
  ['M', 'Menú de capítulos y escenas'],
  ['E', 'Ampliar contenido (panel de alta legibilidad)'],
  ['C', 'Contenido complementario'],
  ['R', 'Repetir animación'],
  ['B', 'Referencias'],
  ['N', 'Notas del expositor'],
  ['L', 'Exploración libre / presentación guiada'],
  ['F', 'Pantalla completa'],
  ['Q', 'Calidad gráfica'],
  ['V', 'Modo 2D alternativo'],
  ['H / ?', 'Ayuda'],
  ['Esc', 'Cerrar paneles'],
];
