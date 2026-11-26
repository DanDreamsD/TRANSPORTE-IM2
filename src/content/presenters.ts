import type { PresenterId } from './types';

export interface Presenter {
  id: PresenterId;
  name: string;
  /** Capítulos asignados según la Tabla 33 de la guía. */
  chapters: string;
  color: string;
}

// Reparto oficial (Tabla 33 de la guía).
export const PRESENTERS: Record<PresenterId, Presenter> = {
  equipo: { id: 'equipo', name: 'Equipo', chapters: 'Portada y cierre', color: '#9aa7b1' },
  felipe: { id: 'felipe', name: 'Felipe', chapters: 'Cap. 1 y 2 · Caso 1', color: '#4fa3e0' },
  carlos: { id: 'carlos', name: 'Carlos', chapters: 'Cap. 3, 4 y 5 · Caso 2', color: '#f5b301' },
  vane: { id: 'vane', name: 'Vane', chapters: 'Cap. 6 y 7 · Caso 4', color: '#e0607e' },
  nicole: { id: 'nicole', name: 'Nicole', chapters: 'Cap. 8, 9 y 10 · Caso 3', color: '#3ec7a0' },
  wilson: { id: 'wilson', name: 'Wilson', chapters: 'Cap. 11 a 14 · Caso 5', color: '#a98bf0' },
};

export const COURSE_INFO = {
  title: 'Fundamentos y equipos de manejo de materiales',
  chapter: 'Capítulo VI: Manejo de materiales y equipo para el manejo de materiales',
  course: 'Ingeniería de Métodos 2',
  teacher: 'Dra. Elisa Castañeda Huamán',
  institution: 'Universidad Nacional de San Agustín de Arequipa — Ingeniería Industrial',
  term: '2026-B · 25 de noviembre de 2026',
  members: ['Felipe', 'Carlos', 'Wilson', 'Vane', 'Nicole'],
} as const;
