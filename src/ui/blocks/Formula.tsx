import { useMemo } from 'react';
import katex from 'katex';

/** Fórmula matemática con KaTeX (fuentes empaquetadas localmente). */
export function Formula({ tex, inline = false }: { tex: string; inline?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: !inline, throwOnError: false, output: 'html' }), [tex, inline]);
  return <span className={inline ? 'formula formula--inline' : 'formula'} dangerouslySetInnerHTML={{ __html: html }} />;
}
