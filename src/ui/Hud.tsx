// Interfaz minimalista superpuesta al entorno 3D.
import type { ReactNode } from 'react';
import { SCENES } from '../content/sceneRegistry';
import { COURSE_INFO, PRESENTERS } from '../content/presenters';
import { usePresentation, useCurrentScene } from '../state/store';
import { Icon } from './icons';
import { Minimap } from './Minimap';
import { toggleFullscreen } from './useKeyboard';
import { ExpandedPanel, HelpOverlay, NotesPanel, ReferencesPanel, SceneMenu } from './Panels';

const QUALITY_LABEL = { low: 'Baja', medium: 'Media', high: 'Alta' } as const;

function ToolButton({ label, kbd, onClick, active = false, children }: { label: string; kbd?: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button type="button" className={`tool-btn ${active ? 'is-active' : ''}`} onClick={onClick} title={kbd ? `${label} (${kbd})` : label} aria-label={label} aria-pressed={active}>
      {children}
    </button>
  );
}

function TopBar() {
  const scene = useCurrentScene();
  const s = usePresentation();
  const presenter = PRESENTERS[scene.presenter];
  const hasDetail = (scene.detailBlocks?.length ?? 0) > 0;
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="brand" onClick={s.home} title="Volver a la portada (Inicio)">
          <span className="brand__mark">N</span>
          <span className="brand__text">
            NOVATEK <em>Material Flow</em>
          </span>
        </button>
        {!scene.cover && (
          <div className="scene-heading" key={scene.id}>
            <div className="scene-heading__crumb">
              Cap. {scene.chapter.number} · {scene.chapter.title}
              {scene.subchapter && <span> › {scene.subchapter.number} {scene.subchapter.title}</span>}
            </div>
            <h1 className="scene-heading__title">{scene.title}</h1>
          </div>
        )}
      </div>
      <div className="topbar__right">
        <div className="presenter-chip" style={{ ['--presenter' as string]: presenter.color }} title={presenter.chapters}>
          <span className="presenter-chip__dot" />
          <span className="presenter-chip__name">{presenter.name}</span>
          <span className="presenter-chip__role">{presenter.chapters}</span>
        </div>
        <nav className="toolbar" aria-label="Herramientas">
          <ToolButton label="Menú de escenas" kbd="M" onClick={() => s.toggle('showMenu')} active={s.showMenu}><Icon.menu /></ToolButton>
          <ToolButton label="Ampliar contenido" kbd="E" onClick={() => s.toggle('expanded')} active={s.expanded}><Icon.expand /></ToolButton>
          <ToolButton label={hasDetail ? 'Contenido complementario' : 'Contenido complementario (sin detalle en esta escena)'} kbd="C" onClick={() => s.toggle('supplementary')} active={s.supplementary}><Icon.layers /></ToolButton>
          <ToolButton label="Repetir animación" kbd="R" onClick={s.replay}><Icon.replay /></ToolButton>
          <ToolButton label="Referencias" kbd="B" onClick={() => s.toggle('showReferences')} active={s.showReferences}><Icon.book /></ToolButton>
          <ToolButton label="Notas del expositor" kbd="N" onClick={() => s.toggle('showNotes')} active={s.showNotes}><Icon.notes /></ToolButton>
          <ToolButton label={s.mode === 'free' ? 'Volver a presentación guiada' : 'Exploración libre'} kbd="L" onClick={s.toggleMode} active={s.mode === 'free'}><Icon.orbit /></ToolButton>
          <ToolButton label="Minimapa" onClick={() => s.toggle('showMinimap')} active={s.showMinimap}><Icon.map /></ToolButton>
          <ToolButton label={`Calidad gráfica: ${QUALITY_LABEL[s.quality]}`} kbd="Q" onClick={s.cycleQuality}>
            <Icon.gauge />
            <span className="tool-btn__badge">{QUALITY_LABEL[s.quality][0]}</span>
          </ToolButton>
          <ToolButton label="Modo 2D alternativo" kbd="V" onClick={() => s.setView('2d')}><Icon.flat /></ToolButton>
          <ToolButton label="Pantalla completa" kbd="F" onClick={toggleFullscreen}><Icon.fullscreen /></ToolButton>
          <ToolButton label="Ayuda y atajos" kbd="H" onClick={() => s.toggle('showHelp')} active={s.showHelp}><Icon.help /></ToolButton>
        </nav>
      </div>
    </header>
  );
}

export function ProgressNav() {
  const { index, sceneCount, next, prev, goTo } = usePresentation();
  return (
    <nav className="navbar" aria-label="Navegación de escenas">
      <button type="button" className="nav-btn" onClick={prev} disabled={index === 0} aria-label="Escena anterior">
        <Icon.prev /> <span>Anterior</span>
      </button>
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={sceneCount} aria-valuenow={index + 1}>
        <div className="progress__segments">
          {SCENES.map((sc, i) => (
            <button
              type="button"
              key={sc.id}
              className={`progress__seg ${i === index ? 'is-current' : ''} ${i < index ? 'is-done' : ''}`}
              style={{ ['--presenter' as string]: PRESENTERS[sc.presenter].color }}
              onClick={() => goTo(i)}
              title={`${i + 1}. ${sc.title} — ${PRESENTERS[sc.presenter].name}`}
              aria-label={`Ir a ${sc.title}`}
            />
          ))}
        </div>
        <div className="progress__count">
          {index + 1} / {sceneCount}
        </div>
      </div>
      <button type="button" className="nav-btn nav-btn--primary" onClick={next} disabled={index === sceneCount - 1} aria-label="Escena siguiente">
        <span>Siguiente</span> <Icon.next />
      </button>
    </nav>
  );
}

function CoverCard() {
  const scene = useCurrentScene();
  const transitioning = usePresentation((s) => s.transitioning);
  if (!scene.cover) return null;
  return (
    <section className={`cover ${transitioning ? '' : 'is-live'}`} aria-label="Portada">
      <div className="cover__eyebrow">{COURSE_INFO.course} · {COURSE_INFO.chapter}</div>
      <h1 className="cover__title">
        NOVATEK <span>Material Flow</span>
      </h1>
      <p className="cover__subtitle">{COURSE_INFO.title}</p>
      <dl className="cover__meta">
        <div>
          <dt>Integrantes</dt>
          <dd>{COURSE_INFO.members.join(' · ')}</dd>
        </div>
        <div>
          <dt>Docente</dt>
          <dd>{COURSE_INFO.teacher}</dd>
        </div>
        <div>
          <dt>Institución</dt>
          <dd>{COURSE_INFO.institution}</dd>
        </div>
        <div>
          <dt>Ciclo</dt>
          <dd>{COURSE_INFO.term}</dd>
        </div>
      </dl>
      <p className="cover__hint">
        NOVATEK Industrial S.A.C. es una empresa ficticia. Pulse <kbd>→</kbd> para iniciar el recorrido.
      </p>
    </section>
  );
}

function DemoControls() {
  const scene = useCurrentScene();
  const demo = usePresentation((s) => s.demo);
  const setDemo = usePresentation((s) => s.setDemo);
  if (scene.animations.length === 0) return null;
  return (
    <aside className="demo-dock" aria-label="Controles de la demostración">
      <div className="demo-dock__notice">
        <strong>Demostración didáctica</strong>
        <span>No es una simulación industrial validada.</span>
      </div>
      {scene.animations.includes('conveyor') && (
        <div className="demo-dock__controls">
          <label className="slider">
            <span>
              Velocidad <b>{demo.conveyorSpeed.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m/s</b>
            </span>
            <input
              type="range"
              min={0.2}
              max={1.6}
              step={0.1}
              value={demo.conveyorSpeed}
              onChange={(e) => setDemo({ conveyorSpeed: Number(e.target.value) })}
              aria-label="Velocidad del transportador"
            />
          </label>
          <button type="button" className={`chip-btn ${demo.conveyorRunning ? 'chip-btn--danger' : 'chip-btn--ok'}`} onClick={() => setDemo({ conveyorRunning: !demo.conveyorRunning })}>
            {demo.conveyorRunning ? <Icon.stop /> : <Icon.play />}
            {demo.conveyorRunning ? 'Detener motor' : 'Arrancar motor'}
          </button>
        </div>
      )}
    </aside>
  );
}

function FreeModeBanner() {
  const mode = usePresentation((s) => s.mode);
  const setMode = usePresentation((s) => s.setMode);
  if (mode !== 'free') return null;
  return (
    <div className="free-banner">
      Exploración libre · arrastre para orbitar, rueda para acercar, clic derecho para desplazar
      <button type="button" onClick={() => setMode('guided')}>Volver a la escena</button>
    </div>
  );
}

export function Hud() {
  const showMinimap = usePresentation((s) => s.showMinimap);
  const scene = useCurrentScene();
  return (
    <div className="hud">
      <TopBar />
      <CoverCard />
      <FreeModeBanner />
      {showMinimap && !scene.cover && <Minimap />}
      <DemoControls />
      <ProgressNav />
      <SceneMenu />
      <ReferencesPanel />
      <NotesPanel />
      <ExpandedPanel />
      <HelpOverlay />
    </div>
  );
}
