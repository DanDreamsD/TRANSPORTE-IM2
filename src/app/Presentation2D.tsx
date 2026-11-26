// Modo 2D alternativo: todo el contenido académico accesible sin WebGL (o si el 3D falla).
import { useMemo, useState } from 'react';
import { SCENES } from '../content/sceneRegistry';
import { PRESENTERS, COURSE_INFO } from '../content/presenters';
import { usePresentation, useCurrentScene } from '../state/store';
import { Minimap } from '../ui/Minimap';
import { ProgressNav } from '../ui/Hud';
import { groupByChapter, ReferenceList, SceneContent } from '../ui/Panels';
import { HelpOverlay } from '../ui/Panels';
import { detectWebGL } from './webgl';

export function Presentation2D() {
  const scene = useCurrentScene();
  const index = usePresentation((s) => s.index);
  const goTo = usePresentation((s) => s.goTo);
  const setView = usePresentation((s) => s.setView);
  const fallbackReason = usePresentation((s) => s.fallbackReason);
  const showNotes = usePresentation((s) => s.showNotes);
  const [webglOk] = useState(() => detectWebGL());
  const groups = useMemo(() => groupByChapter(SCENES), []);
  const presenter = PRESENTERS[scene.presenter];

  return (
    <div className="flat" style={{ ['--presenter' as string]: presenter.color }}>
      <aside className="flat__nav">
        <div className="brand brand--static">
          <span className="brand__mark">N</span>
          <span className="brand__text">
            NOVATEK <em>Material Flow</em>
          </span>
        </div>
        <ol className="scene-menu">
          {groups.map((g) => (
            <li key={g.key + g.scenes[0].index}>
              <div className="scene-menu__chapter">{g.label}</div>
              <ol>
                {g.scenes.map(({ scene: sc, index: i }) => (
                  <li key={sc.id}>
                    <button type="button" className={`scene-menu__item ${i === index ? 'is-current' : ''}`} onClick={() => goTo(i)} style={{ ['--presenter' as string]: PRESENTERS[sc.presenter].color }}>
                      <span className="scene-menu__num">{i + 1}</span>
                      <span className="scene-menu__title">
                        {sc.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
        <Minimap live={false} className="minimap--static" />
      </aside>

      <main className="flat__main">
        {fallbackReason && (
          <div className="flat__banner" role="status">
            <span>{fallbackReason}</span>
          </div>
        )}
        <div className="flat__bar">
          <span className="flat__mode">Modo 2D</span>
          {webglOk && (
            <button type="button" className="chip-btn" onClick={() => setView('3d')}>
              Volver al entorno 3D
            </button>
          )}
        </div>
        <header className="flat__head">
          <div className="modal__crumb">
            {scene.chapter.number !== '—' && `Cap. ${scene.chapter.number} · `}
            {scene.chapter.title}
            {scene.subchapter && ` › ${scene.subchapter.number} ${scene.subchapter.title}`}
          </div>
          <h1>{scene.title}</h1>
          <div className="presenter-chip presenter-chip--inline">
            <span className="presenter-chip__dot" />
            <span className="presenter-chip__role">{presenter.chapters}</span>
          </div>
        </header>
        {scene.cover && (
          <p className="flat__cover">
            {COURSE_INFO.course} · {COURSE_INFO.teacher} · {COURSE_INFO.institution} · {COURSE_INFO.term}
          </p>
        )}
        <article className="flat__content">
          <SceneContent scene={scene} withDetail />
          {scene.animations.length > 0 && (
            <p className="blk-note">Esta escena incluye una demostración animada disponible en el modo 3D (demostración didáctica).</p>
          )}
          {showNotes && scene.notes && (
            <section className="detail-section">
              <h3 className="detail-section__title">Notas del expositor</h3>
              <p>{scene.notes}</p>
            </section>
          )}
          <section className="detail-section">
            <h3 className="detail-section__title">Referencias</h3>
            <ReferenceList ids={scene.references} />
          </section>
        </article>
        <ProgressNav />
      </main>
      <HelpOverlay />
    </div>
  );
}
