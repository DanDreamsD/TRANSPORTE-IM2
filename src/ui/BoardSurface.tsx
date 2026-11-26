// Superficie de contenido de una pizarra/pantalla: la misma que se proyecta en el mundo 3D (Board.tsx)
// y la que se imprime en el PDF de diapositivas (PrintDeck.tsx).
import type { BoardStyle, SceneDef } from '../content/types';
import { PRESENTERS } from '../content/presenters';
import { BlockRenderer } from './blocks/BlockRenderer';

/** Ancho del contenido HTML en píxeles CSS (la altura se deriva de la proporción de la pizarra). */
export const DEFAULT_BOARD_PX_W = 1040;

/** Tamaño en píxeles CSS del contenido de la pizarra de una escena (proporción 16:9 si no tiene pizarra física). */
export function boardPixelSize(scene: SceneDef): { pxW: number; pxH: number; style: BoardStyle } {
  const b = scene.board;
  if (!b) return { pxW: 1280, pxH: 720, style: 'screen' };
  const h = b.height ?? (b.width * 9) / 16;
  const pxW = b.pxWidth ?? DEFAULT_BOARD_PX_W;
  return { pxW, pxH: Math.round((pxW * h) / b.width), style: b.style };
}

/** `fit`: la altura crece con el contenido (PDF) en vez de recortarse al tamaño físico de la pizarra. */
export function BoardSurface({ scene, live, fit = false }: { scene: SceneDef; live: boolean; fit?: boolean }) {
  const { pxW, pxH, style } = boardPixelSize(scene);
  return (
    <div
      className={`board board--${style} ${live ? 'is-live' : ''} ${fit ? 'board--fit' : ''}`}
      style={{ width: pxW, ...(fit ? { minHeight: pxH } : { height: pxH }), ['--presenter' as string]: PRESENTERS[scene.presenter].color }}
    >
      <header className="board__header">
        <span className="board__chapter">
          {scene.chapter.number !== '—' ? `Cap. ${scene.subchapter?.number ?? scene.chapter.number}` : ''}
        </span>
        <h2 className="board__title">{scene.title}</h2>
        <span className="board__brand">NOVATEK</span>
      </header>
      <div className="board__body">
        <BlockRenderer blocks={scene.boardBlocks} variant="board" />
      </div>
    </div>
  );
}
