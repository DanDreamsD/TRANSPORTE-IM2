// Vista de impresión (?mode=print): una página 16:9 por escena con la pizarra tal como se ve en la simulación,
// más la carátula y la tarjeta de cierre. tools/export_pdf.mjs la imprime a PDF con un navegador sin interfaz.
// No monta la escena 3D: las pizarras se dibujan con el mismo componente que usa el mundo (BoardSurface).
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { SceneDef } from '../content/types';
import { SCENES } from '../content/sceneRegistry';
import { COURSE_INFO, PRESENTERS } from '../content/presenters';
import { BoardSurface, boardPixelSize } from '../ui/BoardSurface';
import { TeamList } from '../ui/TeamList';
import './print.css';

/** Tamaño de página en píxeles CSS (16:9, Full HD). */
const PAGE_W = 1920;
const PAGE_H = 1080;
/** Área disponible para la pizarra: márgenes laterales y franja inferior del pie de página. */
const AREA_W = PAGE_W - 2 * 56;
const AREA_H = PAGE_H - 48 - 92;

type PageDef = { key: string; scene: SceneDef; kind: 'cover' | 'board' | 'closing' };

function buildPages(): PageDef[] {
  const pages: PageDef[] = [];
  for (const scene of SCENES) {
    if (scene.cover) pages.push({ key: `${scene.id}-cover`, scene, kind: 'cover' });
    if (scene.closing) pages.push({ key: `${scene.id}-closing`, scene, kind: 'closing' });
    else if (scene.boardBlocks.length > 0) pages.push({ key: scene.id, scene, kind: 'board' });
  }
  return pages;
}

function Page({ scene, n, total, children }: { scene: SceneDef; n: number; total: number; children: ReactNode }) {
  const hasDemo = scene.animations.length > 0 && !scene.cover && !scene.closing;
  return (
    <section className="print-page" style={{ width: PAGE_W, height: PAGE_H, ['--presenter' as string]: PRESENTERS[scene.presenter].color }}>
      <div className="print-page__stage">{children}</div>
      <footer className="print-page__footer">
        <span className="print-page__brand">
          <b>NOVATEK</b> · Material Flow — {COURSE_INFO.course}
        </span>
        <span className="print-page__note">{hasDemo ? 'Demostración didáctica animada disponible en la simulación 3D' : ''}</span>
        <span className="print-page__num">
          <i className="print-page__dot" aria-hidden="true" />
          {n} / {total}
        </span>
      </footer>
    </section>
  );
}

function BoardPage({ scene }: { scene: SceneDef }) {
  const { pxW, pxH } = boardPixelSize(scene);
  // La pizarra conserva su ancho (misma diagramación que en la simulación) y crece en alto si el contenido
  // no cabe; luego se escala para entrar completa en la página.
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(pxH);
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setH(Math.max(pxH, el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pxH]);
  const scale = Math.min(AREA_W / pxW, AREA_H / h);
  return (
    <div className="print-board" style={{ width: pxW * scale, height: h * scale }}>
      <div ref={inner} style={{ width: pxW, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <BoardSurface scene={scene} live fit />
      </div>
    </div>
  );
}

function CoverPage() {
  return (
    <div className="print-cover">
      <div className="print-cover__eyebrow">
        {COURSE_INFO.course} · {COURSE_INFO.chapter}
      </div>
      <h1 className="print-cover__title">
        NOVATEK <span>Material Flow</span>
      </h1>
      <p className="print-cover__subtitle">{COURSE_INFO.title}</p>
      <dl className="print-cover__meta">
        <div>
          <dt>Integrantes</dt>
          <dd>
            <TeamList withCodes />
          </dd>
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
    </div>
  );
}

function ClosingPage() {
  return (
    <div className="print-cover print-cover--closing">
      <div className="print-cover__eyebrow">
        {COURSE_INFO.course} · {COURSE_INFO.chapter}
      </div>
      <h1 className="print-cover__title">
        ¿Preguntas? <span>Gracias por su atención</span>
      </h1>
      <p className="print-cover__subtitle">{COURSE_INFO.title}</p>
      <dl className="print-cover__meta">
        <div>
          <dt>Integrantes</dt>
          <dd>
            <TeamList />
          </dd>
        </div>
        <div>
          <dt>Docente</dt>
          <dd>{COURSE_INFO.teacher}</dd>
        </div>
      </dl>
    </div>
  );
}

export function PrintDeck() {
  const pages = buildPages();
  // Las figuras usan carga diferida en la simulación; al imprimir deben cargarse todas.
  useLayoutEffect(() => {
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
  }, []);
  return (
    <main className="print-deck">
      {pages.map((p, i) => (
        <Page key={p.key} scene={p.scene} n={i + 1} total={pages.length}>
          {p.kind === 'cover' ? <CoverPage /> : p.kind === 'closing' ? <ClosingPage /> : <BoardPage scene={p.scene} />}
        </Page>
      ))}
    </main>
  );
}
