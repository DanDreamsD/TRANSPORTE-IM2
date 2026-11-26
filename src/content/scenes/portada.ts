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
    { kind: 'custom', component: 'team-roster' },
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
