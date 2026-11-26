import type { SceneDef } from '../types';

export const portada: SceneDef = {
  id: 'portada',
  chapter: { number: '—', title: 'Portada' },
  presenter: 'equipo',
  title: 'NOVATEK · Material Flow',
  zone: 'overview',
  cover: true,
  camera: {
    position: [-56, 104, 136],
    target: [-48, 0, 2],
    fov: 38,
    duration: 3.2,
  },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Una planta ficticia —NOVATEK Industrial S.A.C.— sirve de escenario: cada tema del Capítulo VI es un lugar, una máquina o una estación de trabajo. El material entra por recepción y sale por despacho; la exposición sigue ese mismo recorrido.',
    },
    {
      kind: 'table',
      label: 'Tabla 33',
      title: 'Asignación de capítulos entre los cinco integrantes',
      columns: ['Integrante', 'Capítulos', 'Contenido a exponer'],
      rows: [
        ['Felipe', '1 y 2', 'Fundamentos, alcance, objetivos, costos; principios del manejo de materiales; caso 1 (Marcopolo)'],
        ['Carlos', '3, 4 y 5', 'Grados de mecanización; carga unitaria y pallets; clasificación general del equipo; caso 2 (Dynea)'],
        ['Vane', '6 y 7', 'Transportadores; grúas, polipastos y montacargas fijos; caso 4 (AGV en planta de asientos)'],
        ['Nicole', '8, 9 y 10', 'Transportes y AGV/AMR; manejo en la estación de trabajo y NIOSH; recepción, envío y almacenamiento (AS/RS); caso 3 (Schrock Cabinet)'],
        ['Wilson', '11 a 14', 'Relación con la distribución y selección del equipo; análisis y diseño del sistema; casos aplicados (cap. 13) y caso 5 (AHP-MOORA); tendencias y conclusiones'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía. El reparto mantiene entre dos y tres capítulos consecutivos por persona.',
    },
  ],
  detailBlocks: [
    {
      kind: 'callout',
      variant: 'expo',
      title: 'Convenciones de la guía',
      text: 'Los contenidos tomados de las diapositivas del curso llevan la etiqueta «Curso». Los ejemplos numéricos marcados como hipotéticos son inventados con fines didácticos y no describen ninguna empresa real.',
    },
    {
      kind: 'bullets',
      title: 'Cómo leer esta presentación',
      items: [
        'Las etiquetas de color indican el tipo de dato: curso, literatura, caso real, ejemplo hipotético o síntesis de los autores.',
        'Las animaciones son demostraciones didácticas, no simulaciones industriales validadas.',
        'NOVATEK Industrial S.A.C. es una empresa ficticia creada para ubicar los temas.',
      ],
    },
  ],
  animations: ['material-flow'],
  references: [],
  notes:
    'Presentar al equipo y la empresa ficticia. Explicar que el recorrido de la cámara sigue el flujo del material: recepción → almacén → procesamiento → ensamble → almacén automatizado → despacho. La flecha animada del piso es ese recorrido.',
};
