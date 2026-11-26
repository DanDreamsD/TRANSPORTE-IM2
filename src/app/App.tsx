import { usePresentation } from '../state/store';
import { useKeyboard } from '../ui/useKeyboard';
import { Hud } from '../ui/Hud';
import { ErrorBoundary } from './ErrorBoundary';
import { Experience } from './Experience';
import { Presentation2D } from './Presentation2D';

export function App() {
  const view = usePresentation((s) => s.view);
  const setView = usePresentation((s) => s.setView);
  useKeyboard();

  if (view === '2d') return <Presentation2D />;
  return (
    <div className="app">
      <ErrorBoundary onError={(e) => setView('2d', `El entorno 3D no pudo ejecutarse (${e.message}). Se activó el modo 2D.`)}>
        <Experience />
      </ErrorBoundary>
      <Hud />
    </div>
  );
}
