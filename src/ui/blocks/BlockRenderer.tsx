// Renderizador único de bloques de contenido: se usa en las pizarras 3D, el panel ampliado y el modo 2D.
import { Fragment } from 'react';
import type { ContentBlock, DataKind } from '../../content/types';
import { Formula } from './Formula';
import { BeforeAfterChart } from './Charts';
import { CustomBlockView } from './CustomBlocks';

export type BlockVariant = 'board' | 'panel' | 'page';

const DATA_LABEL: Record<DataKind, string> = {
  course: 'Curso',
  literature: 'Literatura',
  case: 'Caso real',
  hypothetical: 'Ejemplo hipotético',
  synthesis: 'Síntesis de los autores',
};

export function DataTag({ kind, source }: { kind?: DataKind; source?: string }) {
  if (!kind && !source) return null;
  return (
    <span className="data-tag-row">
      {kind && <span className={`data-tag data-tag--${kind}`}>{DATA_LABEL[kind]}</span>}
      {source && <span className="data-source">{source}</span>}
    </span>
  );
}

function Block({ block, variant }: { block: ContentBlock; variant: BlockVariant }) {
  switch (block.kind) {
    case 'lead':
      return (
        <div className="blk blk-lead">
          <p>{block.text}</p>
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'definition':
      return (
        <div className="blk blk-def">
          <div className="blk-def__term">{block.term}</div>
          <p className="blk-def__text">{block.text}</p>
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'bullets': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <div className="blk blk-bullets">
          {block.title && <h3 className="blk-title">{block.title}</h3>}
          <List className={block.columns === 2 ? 'cols-2' : undefined}>
            {block.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </List>
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    }
    case 'table':
      return (
        <div className="blk blk-table">
          {(block.label || block.title) && (
            <h3 className="blk-title">
              {block.label && <span className="blk-label">{block.label}</span>} {block.title}
            </h3>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="blk-note">{block.note}</p>}
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'formula':
      return (
        <div className="blk blk-formula">
          <Formula tex={block.tex} />
          {block.caption && <p className="blk-note">{block.caption}</p>}
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'stats':
      return (
        <div className="blk blk-stats">
          {block.title && <h3 className="blk-title">{block.title}</h3>}
          <div className="stats-grid">
            {block.items.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__value">{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'callout':
      return (
        <div className={`blk blk-callout blk-callout--${block.variant}`}>
          {block.title && <div className="blk-callout__title">{block.title}</div>}
          <p>{block.text}</p>
        </div>
      );
    case 'figure':
      return (
        <figure className="blk blk-figure">
          <figcaption className="blk-title">
            <span className="blk-label">{block.label}</span> {block.title}
          </figcaption>
          <img src={`${import.meta.env.BASE_URL}${block.src}`} alt={`${block.label}. ${block.title}`} loading="lazy" />
          {block.note && <p className="blk-note">{block.note}</p>}
        </figure>
      );
    case 'chart':
      return (
        <div className="blk blk-chart">
          <h3 className="blk-title">{block.title}</h3>
          <BeforeAfterChart block={block} compact={variant === 'board'} />
          {block.note && <p className="blk-note">{block.note}</p>}
          <DataTag kind={block.dataKind} source={block.source} />
        </div>
      );
    case 'custom':
      return <CustomBlockView id={block.component} variant={variant} />;
    case 'columns':
      return (
        <div className="blk-columns" style={{ gridTemplateColumns: (block.ratio ?? block.columns.map(() => 1)).map((r) => `${r}fr`).join(' ') }}>
          {block.columns.map((col, i) => (
            <div className="blk-col" key={i}>
              {col.map((b, j) => (
                <Block key={j} block={b} variant={variant} />
              ))}
            </div>
          ))}
        </div>
      );
  }
}

export function BlockRenderer({ blocks, variant }: { blocks: readonly ContentBlock[]; variant: BlockVariant }) {
  return (
    <div className={`blocks blocks--${variant}`}>
      {blocks.map((b, i) => (
        <Fragment key={i}>
          <Block block={b} variant={variant} />
        </Fragment>
      ))}
    </div>
  );
}
