// Iconos SVG en línea (sin dependencias ni recursos remotos).
import type { ReactNode } from 'react';

function I({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const Icon = {
  prev: () => <I><path d="M15 18l-6-6 6-6" /></I>,
  next: () => <I><path d="M9 18l6-6-6-6" /></I>,
  menu: () => <I><path d="M4 6h16M4 12h16M4 18h10" /></I>,
  home: () => <I><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></I>,
  replay: () => <I><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></I>,
  expand: () => <I><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></I>,
  book: () => <I><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h7" /></I>,
  layers: () => <I><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></I>,
  orbit: () => <I><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="10" ry="4.5" /></I>,
  fullscreen: () => <I><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></I>,
  notes: () => <I><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></I>,
  gauge: () => <I><path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-6" /></I>,
  map: () => <I><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></I>,
  flat: () => <I><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8" /></I>,
  help: () => <I><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" /></I>,
  close: () => <I><path d="M6 6l12 12M18 6L6 18" /></I>,
  play: () => <I><path d="M7 5l12 7-12 7z" /></I>,
  stop: () => <I><rect x="6" y="6" width="12" height="12" rx="1" /></I>,
};
