import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import 'katex/dist/katex.min.css';
import './ui/theme.css';
import { App } from './app/App';
import { usePresentation } from './state/store';
import { sceneIndexById } from './content/sceneRegistry';
import { detectWebGL } from './app/webgl';

// Estado inicial desde la URL (antes de montar la escena 3D): ?scene=<id>  ?mode=2d
function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const s = usePresentation.getState();
  const id = params.get('scene');
  if (id) {
    const i = sceneIndexById(id);
    if (i >= 0) s.goTo(i);
  }
  if (params.get('mode') === '2d') s.setView('2d');
  else if (!detectWebGL()) {
    s.setView('2d', 'Este navegador o equipo no admite WebGL. Se muestra el modo 2D con todo el contenido académico.');
  }
}

const root = createRoot(document.getElementById('root')!);

if (new URLSearchParams(window.location.search).get('mode') === 'print') {
  // Vista de impresión de diapositivas (sin escena 3D). Los bloques sincronizados con demos muestran su estado estático.
  usePresentation.getState().setView('2d');
  document.title = 'Manejo de materiales — Diapositivas · Ingeniería de Métodos 2';
  void import('./app/PrintDeck').then(({ PrintDeck }) =>
    root.render(
      <StrictMode>
        <PrintDeck />
      </StrictMode>,
    ),
  );
} else {
  initFromUrl();

  // Acceso de depuración al estado en desarrollo.
  if (import.meta.env.DEV) (window as unknown as { __novatek: typeof usePresentation }).__novatek = usePresentation;

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
