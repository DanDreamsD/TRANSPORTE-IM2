// Vista de impresión (?mode=print): diapositivas 16:9 para el aula virtual.
// Por escena: la pizarra tal como se ve en la simulación y, a continuación, su contenido complementario
// (el del panel «C»), paginado. Al final, las referencias en APA 7 y la tarjeta de cierre.
// tools/export_pdf.mjs la imprime a PDF con un navegador sin interfaz. No monta la escena 3D: las pizarras se
// dibujan con el mismo componente que usa el mundo (BoardSurface). El PDF no lleva la marca de la empresa ficticia.
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ContentBlock, SceneDef } from '../content/types';
import { SCENES } from '../content/sceneRegistry';
import { COURSE_INFO, PRESENTERS } from '../content/presenters';
import { REFERENCES, type ReferenceId } from '../content/references';
import { BoardSurface, boardPixelSize } from '../ui/BoardSurface';
import { BlockRenderer } from '../ui/blocks/BlockRenderer';
import { TeamList } from '../ui/TeamList';
import './print.css';

/** Tamaño de página en píxeles CSS (16:9, Full HD). */
const PAGE_W = 1920;
const PAGE_H = 1080;
/** Área disponible para el contenido: márgenes laterales y franja inferior del pie de página. */
const AREA_W = PAGE_W - 2 * 56;
const AREA_H = PAGE_H - 48 - 92;

/** Hoja de contenido complementario: encabezado fijo y cuerpo escalado para que se lea en pantalla completa. */
const SHEET_BORDER = 6;
const SHEET_HEAD = 118;
const SHEET_PAD_X = 36;
const SHEET_PAD_Y = 28;
const FLOW_SCALE = 1.15;
const FLOW_GAP = 18;
const FLOW_W = Math.floor((AREA_W - 2 * SHEET_PAD_X) / FLOW_SCALE);
/** Alto útil del cuerpo (sin escalar), con un pequeño margen de seguridad. */
const FLOW_H = Math.floor((AREA_H - SHEET_BORDER - SHEET_HEAD - 2 * SHEET_PAD_Y) / FLOW_SCALE) - 6;

/** Altura mínima (sin escalar) a la que se puede reducir una figura para que entre en el espacio libre. */
const MIN_FIG_IMG = 260;

const BRAND = /NOVATEK/i;
const COVER_TITLE = 'Integrantes y asignación de capítulos';

// ---------------------------------------------------------------- contenido imprimible

/** Quita las menciones a la empresa ficticia (escenario de la simulación, no contenido del curso). */
function withoutBrand(blocks: readonly ContentBlock[]): ContentBlock[] {
  return blocks.flatMap((b): ContentBlock[] => {
    if (b.kind === 'lead' && BRAND.test(b.text)) return [];
    if (b.kind === 'bullets') {
      const items = b.items.filter((it) => !BRAND.test(it));
      return items.length > 0 ? [{ ...b, items }] : [];
    }
    if (b.kind === 'columns') return [{ ...b, columns: b.columns.map((c) => withoutBrand(c)) }];
    return [b];
  });
}

function printable(scene: SceneDef): SceneDef {
  return {
    ...scene,
    title: scene.cover ? COVER_TITLE : scene.title,
    boardBlocks: withoutBrand(scene.boardBlocks),
    detailBlocks: withoutBrand(scene.detailBlocks ?? []),
  };
}

/** Identidad de una tabla o figura, para no repetir en el complementario lo que ya está en la pizarra. */
function blockKey(b: ContentBlock): string | null {
  if (b.kind === 'table' || b.kind === 'figure') return `${b.kind}|${b.label ?? ''}|${b.title ?? ''}`;
  if (b.kind === 'custom') return `custom|${b.component}`;
  return null;
}

function flatten(blocks: readonly ContentBlock[]): ContentBlock[] {
  return blocks.flatMap((b) => (b.kind === 'columns' ? flatten(b.columns.flat()) : [b]));
}

/** Recomendaciones para los expositores («Para la exposición»): no forman parte del material de estudio. */
function isPresenterTip(b: ContentBlock): boolean {
  return b.kind === 'callout' && b.variant === 'expo' && b.title === 'Para la exposición';
}

function detailFor(scene: SceneDef): ContentBlock[] {
  const onBoard = new Set(flatten(scene.boardBlocks).map(blockKey).filter((k): k is string => k !== null));
  return (scene.detailBlocks ?? []).filter((b) => {
    if (isPresenterTip(b)) return false;
    const k = blockKey(b);
    return k === null || !onBoard.has(k);
  });
}

function crumbFor(scene: SceneDef): string {
  if (scene.chapter.number === '—') return COURSE_INFO.chapter;
  const num = scene.subchapter?.number ?? scene.chapter.number;
  return `Cap. ${num} · ${scene.subchapter?.title ?? scene.chapter.title}`;
}

type FlowItem = { kind: 'block'; block: ContentBlock } | { kind: 'ref'; id: ReferenceId };
type Flow = { key: string; scene: SceneDef; crumb: string; title: string; tag: string; items: FlowItem[] };
type Entry =
  | { kind: 'cover' | 'closing' | 'board'; key: string; scene: SceneDef }
  | { kind: 'flow'; key: string; flow: Flow };

function buildEntries(): Entry[] {
  const entries: Entry[] = [];
  let closing: SceneDef | null = null;
  const usedRefs = new Set<ReferenceId>();
  for (const raw of SCENES) {
    const scene = printable(raw);
    raw.references.forEach((r) => usedRefs.add(r));
    if (scene.cover) entries.push({ kind: 'cover', key: `${scene.id}-cover`, scene });
    if (scene.closing) closing = scene;
    else if (scene.boardBlocks.length > 0) entries.push({ kind: 'board', key: scene.id, scene });
    const detail = detailFor(scene);
    if (detail.length > 0) {
      const flow: Flow = {
        key: `${scene.id}-detail`,
        scene,
        crumb: crumbFor(scene),
        title: scene.closing ? scene.chapter.title : scene.title,
        tag: 'Información complementaria',
        items: detail.map((block) => ({ kind: 'block', block })),
      };
      entries.push({ kind: 'flow', key: flow.key, flow });
    }
  }
  const refs = [...usedRefs].sort((a, b) => REFERENCES[a].apa.localeCompare(REFERENCES[b].apa, 'es'));
  if (closing && refs.length > 0) {
    const flow: Flow = {
      key: 'referencias',
      scene: closing,
      crumb: COURSE_INFO.chapter,
      title: 'Referencias',
      tag: 'APA 7.ª edición',
      items: refs.map((id) => ({ kind: 'ref', id })),
    };
    entries.push({ kind: 'flow', key: flow.key, flow });
  }
  if (closing) entries.push({ kind: 'closing', key: `${closing.id}-closing`, scene: closing });
  return entries;
}

// ---------------------------------------------------------------- medición y paginación

type TableMeasure = { head: number; rows: number[]; tail: number; cols: number[] };
type Measure = { h: number; table?: TableMeasure; img?: number };
type Unit = { item: FlowItem; rows?: [number, number]; cols?: number[]; scale?: number; imgMax?: number };

function measureItem(wrap: HTMLElement): Measure {
  const box = wrap.getBoundingClientRect();
  const h = wrap.offsetHeight;
  // Factor entre medidas en pantalla y píxeles CSS (por si la vista tiene zoom): las medidas no dependen de él.
  const k = box.height > 0 && h > 0 ? box.height / h : 1;
  const px = (v: number) => Math.ceil(v / k);
  const img = wrap.querySelector('.blk-figure img');
  if (img) return { h, img: px(img.getBoundingClientRect().height) };
  const table = wrap.querySelector('table');
  const body = table?.tBodies[0];
  const headRow = table?.tHead?.rows[0];
  if (!table || !body || !headRow || body.rows.length === 0) return { h };
  const trs = Array.from(body.rows);
  const tw = table.getBoundingClientRect().width;
  return {
    h,
    table: {
      head: px(trs[0].getBoundingClientRect().top - box.top),
      rows: trs.map((r) => px(r.getBoundingClientRect().height)),
      tail: px(box.bottom - trs[trs.length - 1].getBoundingClientRect().bottom),
      cols: Array.from(headRow.cells).map((c) => c.getBoundingClientRect().width / tw),
    },
  };
}

/**
 * Reparte los bloques en páginas. Una tabla que no cabe en el espacio libre se divide repitiendo el encabezado;
 * una figura se reduce (hasta MIN_FIG_IMG) si así entra en el espacio libre o deja lugar al cierre de la sección.
 */
type FlowPageDef = { units: Unit[]; h: number; fit?: number };

/** Una última página casi vacía se une a la anterior si basta reducir el contenido como máximo este factor. */
const MAX_SHRINK = 1.22;

function paginate(items: FlowItem[], ms: Measure[]): FlowPageDef[] {
  const pages: FlowPageDef[] = [];
  let cur: Unit[] = [];
  let used = 0;
  const gap = () => (cur.length > 0 ? FLOW_GAP : 0);
  const room = () => FLOW_H - used - gap();
  const push = (u: Unit, h: number) => {
    used += gap() + h;
    cur.push(u);
  };
  const flush = () => {
    if (cur.length > 0) pages.push({ units: cur, h: used });
    cur = [];
    used = 0;
  };
  /** Alto de lo que queda de la sección después del bloque i. */
  const rest = (i: number) => ms.slice(i + 1).reduce((acc, m) => acc + FLOW_GAP + m.h, 0);

  items.forEach((item, i) => {
    const m = ms[i] ?? { h: 0 };
    if (m.img !== undefined) {
      const fixed = m.h - m.img;
      // Si el resto de la sección es corto, se intenta dejarle lugar en la misma página.
      const tail = rest(i);
      const fitWithTail = tail <= FLOW_H / 3 ? room() - tail : -1;
      if (m.h <= room() && (fitWithTail < 0 || m.h <= fitWithTail)) return push({ item }, m.h);
      if (fitWithTail >= fixed + MIN_FIG_IMG && fitWithTail < m.h) return push({ item, imgMax: fitWithTail - fixed }, fitWithTail);
      if (m.h <= room()) return push({ item }, m.h);
      if (room() >= fixed + MIN_FIG_IMG) return push({ item, imgMax: room() - fixed }, room());
      flush();
      if (m.h <= FLOW_H) return push({ item }, m.h);
      return push({ item, imgMax: Math.max(MIN_FIG_IMG, FLOW_H - fixed) }, FLOW_H);
    }
    if (m.h <= room()) return push({ item }, m.h);
    const t = m.table;
    if (!t) {
      flush();
      if (m.h <= FLOW_H) return push({ item }, m.h);
      push({ item, scale: FLOW_H / m.h }, FLOW_H);
      return flush();
    }
    let a = 0;
    while (a < t.rows.length) {
      let h = t.head;
      let b = a;
      while (b < t.rows.length) {
        const next = h + t.rows[b] + (b + 1 === t.rows.length ? t.tail : 0);
        if (next > room()) break;
        h = next;
        b++;
      }
      // Si en lo que queda de la página caben menos de tres filas, la tabla sigue en la página siguiente.
      if (b - a < Math.min(3, t.rows.length - a) && cur.length > 0) {
        flush();
        continue;
      }
      if (b === a) {
        b = a + 1;
        h = t.head + t.rows[a];
      }
      push({ item, rows: [a, b], cols: t.cols }, h);
      a = b;
      if (a < t.rows.length) flush();
    }
  });
  flush();
  // Evita una última página con un solo párrafo: se une a la anterior con una reducción moderada.
  const last = pages[pages.length - 1];
  const prev = pages[pages.length - 2];
  if (last && prev && last.h <= FLOW_H * 0.3 && !(last.units[0].rows && last.units[0].rows[0] > 0)) {
    const h = prev.h + FLOW_GAP + last.h;
    if (h <= FLOW_H * MAX_SHRINK) {
      pages.splice(pages.length - 2, 2, { units: [...prev.units, ...last.units], h, fit: Math.min(1, FLOW_H / h) });
    }
  }
  return pages;
}

function ItemView({ unit }: { unit: Unit }) {
  const { item } = unit;
  if (item.kind === 'ref') {
    const r: { apa: string; url?: string } = REFERENCES[item.id];
    return (
      <p className="print-ref">
        {r.apa}
        {r.url && (
          <>
            {' '}
            <span className="ref-url">{r.url}</span>
          </>
        )}
      </p>
    );
  }
  let block = item.block;
  if (unit.rows && block.kind === 'table') {
    const [a, b] = unit.rows;
    const last = b === block.rows.length;
    block = {
      ...block,
      rows: block.rows.slice(a, b),
      title: a > 0 ? `${block.title ?? ''} (continuación)` : block.title,
      note: last ? block.note : undefined,
      dataKind: last ? block.dataKind : undefined,
      source: last ? block.source : undefined,
    };
  }
  const content = <BlockRenderer blocks={[block]} variant="panel" />;
  if (unit.cols) {
    const vars = Object.fromEntries(unit.cols.map((w, i) => [`--c${i + 1}`, `${(w * 100).toFixed(3)}%`]));
    return (
      <div className="print-split" style={vars as CSSProperties}>
        {content}
      </div>
    );
  }
  if (unit.imgMax !== undefined) {
    return (
      <div className="print-fig-fit" style={{ ['--img-max' as string]: `${Math.floor(unit.imgMax)}px` }}>
        {content}
      </div>
    );
  }
  if (unit.scale) {
    return (
      <div style={{ height: FLOW_H }}>
        <div style={{ width: FLOW_W, transform: `scale(${unit.scale})`, transformOrigin: 'top center' }}>{content}</div>
      </div>
    );
  }
  return content;
}

/** Contenedor invisible donde se miden los bloques al ancho de la hoja (sin escala). */
function Measurer({ flows, onMeasure }: { flows: Flow[]; onMeasure: (m: Record<string, Measure[]>) => void }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const run = () => {
      const res: Record<string, Measure[]> = {};
      el.querySelectorAll<HTMLElement>('[data-flow]').forEach((f) => {
        res[f.dataset.flow ?? ''] = Array.from(f.children).map((c) => measureItem(c as HTMLElement));
      });
      onMeasure(res);
    };
    run();
    // Las figuras, las fuentes y KaTeX cambian la altura al cargar: se vuelve a paginar.
    const ro = new ResizeObserver(run);
    el.querySelectorAll('[data-flow] > *').forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [flows, onMeasure]);
  return (
    <div ref={root} className="print-measure print-sheet" aria-hidden="true">
      {flows.map((f) => (
        <div key={f.key} data-flow={f.key} style={{ width: FLOW_W }}>
          {f.items.map((item, i) => (
            <div key={i} className="print-measure__item">
              <ItemView unit={{ item }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- páginas

function Page({ scene, n, total, note, children }: { scene: SceneDef; n: number; total: number; note?: string; children: ReactNode }) {
  return (
    <section className="print-page" style={{ width: PAGE_W, height: PAGE_H, ['--presenter' as string]: PRESENTERS[scene.presenter].color }}>
      <div className="print-page__stage">{children}</div>
      <footer className="print-page__footer">
        <span className="print-page__brand">
          <b>{COURSE_INFO.course}</b> · Capítulo VI — Manejo de materiales
        </span>
        <span className="print-page__note">{note ?? ''}</span>
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
        <BoardSurface scene={scene} live fit brand={false} />
      </div>
    </div>
  );
}

function FlowPage({ flow, page, part, parts }: { flow: Flow; page: FlowPageDef; part: number; parts: number }) {
  const fit = page.fit ?? 1;
  return (
    <article className="print-detail print-sheet" style={{ width: AREA_W, height: AREA_H }}>
      <header className="print-detail__head" style={{ height: SHEET_HEAD }}>
        <div>
          <div className="print-detail__crumb">{flow.crumb}</div>
          <h2 className="print-detail__title">{flow.title}</h2>
        </div>
        <span className="print-detail__tag">
          {flow.tag}
          {parts > 1 && ` · ${part}/${parts}`}
        </span>
      </header>
      <div className="print-detail__body" style={{ padding: `${SHEET_PAD_Y}px ${SHEET_PAD_X}px` }}>
        <div
          className="print-flow"
          style={{ width: FLOW_W, gap: FLOW_GAP, transform: `scale(${FLOW_SCALE * fit})`, marginLeft: (FLOW_W * FLOW_SCALE * (1 - fit)) / 2 }}
        >
          {page.units.map((u, i) => (
            <ItemView key={i} unit={u} />
          ))}
        </div>
      </div>
    </article>
  );
}

function CoverPage() {
  return (
    <div className="print-cover">
      <div className="print-cover__eyebrow">
        {COURSE_INFO.course} · Capítulo VI
      </div>
      <h1 className="print-cover__title print-cover__title--topic">
        Manejo de materiales <span>y equipo para el manejo de materiales</span>
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

type PageDef = { key: string; scene: SceneDef; note?: string; body: ReactNode };

export function PrintDeck() {
  const entries = useMemo(buildEntries, []);
  const flows = useMemo(() => entries.flatMap((e) => (e.kind === 'flow' ? [e.flow] : [])), [entries]);
  const [measures, setMeasures] = useState<Record<string, Measure[]> | null>(null);
  const onMeasure = useCallback((m: Record<string, Measure[]>) => {
    setMeasures((prev) => (prev && JSON.stringify(prev) === JSON.stringify(m) ? prev : m));
  }, []);

  // Las figuras usan carga diferida en la simulación; al imprimir deben cargarse todas.
  useLayoutEffect(() => {
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
  });

  const pages: PageDef[] = [];
  if (measures) {
    for (const e of entries) {
      if (e.kind === 'cover') pages.push({ key: e.key, scene: e.scene, body: <CoverPage /> });
      else if (e.kind === 'closing') pages.push({ key: e.key, scene: e.scene, body: <ClosingPage /> });
      else if (e.kind === 'board') {
        const note = e.scene.animations.length > 0 && !e.scene.cover ? 'Demostración didáctica animada disponible en la simulación 3D' : undefined;
        pages.push({ key: e.key, scene: e.scene, note, body: <BoardPage scene={e.scene} /> });
      } else if (e.kind === 'flow') {
        const split = paginate(e.flow.items, measures[e.flow.key] ?? []);
        split.forEach((page, i) =>
          pages.push({
            key: `${e.key}-${i}`,
            scene: e.flow.scene,
            body: <FlowPage flow={e.flow} page={page} part={i + 1} parts={split.length} />,
          }),
        );
      }
    }
  }

  return (
    <main className="print-deck">
      <Measurer flows={flows} onMeasure={onMeasure} />
      {pages.map((p, i) => (
        <Page key={p.key} scene={p.scene} n={i + 1} total={pages.length} note={p.note}>
          {p.body}
        </Page>
      ))}
    </main>
  );
}
