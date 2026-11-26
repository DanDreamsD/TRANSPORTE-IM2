import type { PresenterId } from './types';

export interface Presenter {
  id: PresenterId;
  /** Nombre corto de uso interno (código y documentación). En pantalla cada integrante se identifica solo por su color. */
  name: string;
  /** Nombre completo y código universitario: solo se muestran en la carátula. */
  fullName?: string;
  code?: string;
  /** Capítulos asignados según la Tabla 33 de la guía. */
  chapters: string;
  /** Contenido a exponer (Tabla 33 de la guía). */
  topics?: string;
  color: string;
}

// Reparto oficial (Tabla 33 de la guía).
export const PRESENTERS: Record<PresenterId, Presenter> = {
  equipo: { id: 'equipo', name: 'Equipo', chapters: 'Portada y cierre', color: '#9aa7b1' },
  felipe: {
    id: 'felipe',
    name: 'Felipe',
    fullName: 'Maica Mamani, José Felipe',
    code: '20240427',
    chapters: 'Cap. 1 y 2 · Caso 1',
    topics: 'Fundamentos, alcance, objetivos, costos; principios del manejo de materiales; caso 1 (Marcopolo)',
    color: '#4fa3e0',
  },
  carlos: {
    id: 'carlos',
    name: 'Carlos',
    fullName: 'Chaquilla Alvarez, Carlos Daniel',
    code: '20240402',
    chapters: 'Cap. 3, 4 y 5 · Caso 2',
    topics: 'Grados de mecanización; carga unitaria y pallets; clasificación general del equipo; caso 2 (Dynea)',
    color: '#f5b301',
  },
  vane: {
    id: 'vane',
    name: 'Vanessa',
    fullName: 'Maza Florez, Vanessa Avril',
    code: '20242177',
    chapters: 'Cap. 6 y 7 · Caso 4',
    topics: 'Transportadores; grúas, polipastos y montacargas fijos; caso 4 (AGV en planta de asientos)',
    color: '#e0607e',
  },
  nicole: {
    id: 'nicole',
    name: 'Nicole',
    fullName: 'Paco Loayza, Nicole',
    code: '20243230',
    chapters: 'Cap. 8, 9 y 10 · Caso 3',
    topics: 'Transportes y AGV/AMR; manejo en la estación de trabajo y NIOSH; recepción, envío y almacenamiento (AS/RS); caso 3 (Schrock Cabinet)',
    color: '#3ec7a0',
  },
  wilson: {
    id: 'wilson',
    name: 'Wilson',
    fullName: 'Arcata Arias, Wilson Jonathan',
    code: '20240454',
    chapters: 'Cap. 11 a 14 · Caso 5',
    topics: 'Relación con la distribución y selección del equipo; análisis y diseño del sistema; casos aplicados (cap. 13) y caso 5 (AHP-MOORA); tendencias y conclusiones',
    color: '#a98bf0',
  },
};

/** Integrantes en orden alfabético de apellidos (carátula). */
export const TEAM_ALPHABETICAL: readonly PresenterId[] = ['wilson', 'carlos', 'felipe', 'vane', 'nicole'];
/** Integrantes en orden de exposición (reparto de capítulos). */
export const TEAM_BY_CHAPTER: readonly PresenterId[] = ['felipe', 'carlos', 'vane', 'nicole', 'wilson'];

export const COURSE_INFO = {
  title: 'Fundamentos y equipos de manejo de materiales',
  chapter: 'Capítulo VI: Manejo de materiales y equipo para el manejo de materiales',
  course: 'Ingeniería de Métodos 2',
  teacher: 'Dra. Elisa Castañeda Huamán',
  institution: 'Universidad Nacional de San Agustín de Arequipa — Ingeniería Industrial',
  term: '2026-B · 25 de noviembre de 2026',
} as const;
