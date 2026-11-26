// Paneles: menú de escenas, panel ampliado (alta legibilidad), referencias, notas y ayuda.
import { useMemo, type ReactNode } from 'react';
import { SCENES } from '../content/sceneRegistry';
import { PRESENTERS } from '../content/presenters';
import { REFERENCE_IDS, REFERENCES } from '../content/references';
import type { SceneDef } from '../content/types';
import { usePresentation, useCurrentScene } from '../state/store';
import { BlockRenderer } from './blocks/BlockRenderer';
import { Icon } from './icons';
import { SHORTCUTS } from './useKeyboard';

function Drawer({ side, open, title, onClose, children }: { side: 'left' | 'right'; open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <aside className={`drawer drawer--${side} ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label={title}>
      <div className="drawer__head">
        <h2>{title}</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
          <Icon.close />
        </button>
      </div>
      <div className="drawer__body">{open && children}</div>
    </aside>
  );
}

interface ChapterGroup {
  key: string;
  label: string;
  scenes: { scene: SceneDef; index: number }[];
}

export function groupByChapter(scenes: readonly SceneDef[]): ChapterGroup[] {
  const groups: ChapterGroup[] = [];
  scenes.forEach((scene, index) => {
    const key = scene.chapter.number;
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: key === '—' ? scene.chapter.title : `${key}. ${scene.chapter.title}`, scenes: [] };
      groups.push(g);
    }
    g.scenes.push({ scene, index });
  });
  return groups;
}

export function SceneMenu() {
  const open = usePresentation((s) => s.showMenu);
  const index = usePresentation((s) => s.index);
  const toggle = usePresentation((s) => s.toggle);
  const goTo = usePresentation((s) => s.goTo);
  const groups = useMemo(() => groupByChapter(SCENES), []);
  return (
    <Drawer side="left" open={open} title="Capítulos y escenas" onClose={() => toggle('showMenu')}>
      <ol className="scene-menu">
        {groups.map((g) => (
          <li key={g.key + g.scenes[0].index}>
            <div className="scene-menu__chapter">{g.label}</div>
            <ol>
              {g.scenes.map(({ scene, index: i }) => (
                <li key={scene.id}>
                  <button type="button" className={`scene-menu__item ${i === index ? 'is-current' : ''}`} onClick={() => goTo(i)} style={{ ['--presenter' as string]: PRESENTERS[scene.presenter].color }}>
                    <span className="scene-menu__num">{i + 1}</span>
                    <span className="scene-menu__title">
                      {scene.title}
                      <small>
                        {scene.subchapter ? `${scene.subchapter.number} · ` : ''}
                        {PRESENTERS[scene.presenter].name}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <p className="drawer__foot">Versión MVP: {SCENES.length} de 33 escenas planificadas (ver docs/STORYBOARD.md).</p>
    </Drawer>
  );
}

export function SceneContent({ scene, withDetail }: { scene: SceneDef; withDetail: boolean }) {
  return (
    <>
      <BlockRenderer blocks={scene.boardBlocks} variant="panel" />
      {withDetail && scene.detailBlocks && scene.detailBlocks.length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section__title">Contenido complementario</h3>
          <BlockRenderer blocks={scene.detailBlocks} variant="panel" />
        </section>
      )}
    </>
  );
}

export function ExpandedPanel() {
  const scene = useCurrentScene();
  const expanded = usePresentation((s) => s.expanded);
  const supplementary = usePresentation((s) => s.supplementary);
  const toggle = usePresentation((s) => s.toggle);
  const open = expanded || supplementary;
  if (!open) return null;
  const presenter = PRESENTERS[scene.presenter];
  const close = () => {
    if (expanded) toggle('expanded');
    if (supplementary) toggle('supplementary');
  };
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Contenido: ${scene.title}`} onClick={close}>
      <article className="modal__card" onClick={(e) => e.stopPropagation()} style={{ ['--presenter' as string]: presenter.color }}>
        <header className="modal__head">
          <div>
            <div className="modal__crumb">
              {scene.chapter.number !== '—' && `Cap. ${scene.chapter.number} · `}
              {scene.chapter.title}
              {scene.subchapter && ` › ${scene.subchapter.number} ${scene.subchapter.title}`} · {presenter.name}
            </div>
            <h2>{scene.title}</h2>
          </div>
          <div className="modal__actions">
            <button type="button" className={`chip-btn ${supplementary ? 'is-active' : ''}`} onClick={() => toggle('supplementary')}>
              <Icon.layers /> Complementario
            </button>
            <button type="button" className="icon-btn" onClick={close} aria-label="Cerrar">
              <Icon.close />
            </button>
          </div>
        </header>
        <div className="modal__body">
          <SceneContent scene={scene} withDetail={supplementary} />
        </div>
      </article>
    </div>
  );
}

export function ReferenceList({ ids }: { ids: readonly (keyof typeof REFERENCES)[] }) {
  return (
    <ol className="ref-list">
      {ids.map((id) => {
        const r: { apa: string; url?: string } = REFERENCES[id];
        return (
          <li key={id}>
            {r.apa}
            {r.url && (
              <>
                {' '}
                <span className="ref-url">{r.url}</span>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ReferencesPanel() {
  const open = usePresentation((s) => s.showReferences);
  const toggle = usePresentation((s) => s.toggle);
  const scene = useCurrentScene();
  return (
    <Drawer side="right" open={open} title="Referencias" onClose={() => toggle('showReferences')}>
      <h3 className="drawer__sub">De esta escena</h3>
      <ReferenceList ids={scene.references} />
      <details className="ref-all">
        <summary>Todas las referencias de la guía ({REFERENCE_IDS.length})</summary>
        <ReferenceList ids={REFERENCE_IDS} />
      </details>
    </Drawer>
  );
}

export function NotesPanel() {
  const open = usePresentation((s) => s.showNotes);
  const toggle = usePresentation((s) => s.toggle);
  const scene = useCurrentScene();
  return (
    <Drawer side="right" open={open} title="Notas del expositor" onClose={() => toggle('showNotes')}>
      <div className="notes">
        <div className="notes__who" style={{ ['--presenter' as string]: PRESENTERS[scene.presenter].color }}>
          {PRESENTERS[scene.presenter].name} · {scene.title}
        </div>
        <p>{scene.notes ?? 'Sin notas para esta escena.'}</p>
      </div>
    </Drawer>
  );
}

export function HelpOverlay() {
  const open = usePresentation((s) => s.showHelp);
  const toggle = usePresentation((s) => s.toggle);
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Ayuda" onClick={() => toggle('showHelp')}>
      <article className="modal__card modal__card--narrow" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2>Atajos de teclado</h2>
          <button type="button" className="icon-btn" onClick={() => toggle('showHelp')} aria-label="Cerrar">
            <Icon.close />
          </button>
        </header>
        <div className="modal__body">
          <table className="shortcuts">
            <tbody>
              {SHORTCUTS.map(([k, d]) => (
                <tr key={k}>
                  <td>
                    <kbd>{k}</kbd>
                  </td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="blk-note">
            Parámetros de URL: <code>?scene=carga-unitaria</code> abre una escena; <code>?mode=2d</code> fuerza el modo 2D.
          </p>
        </div>
      </article>
    </div>
  );
}
