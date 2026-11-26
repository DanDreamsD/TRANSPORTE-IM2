import type { SceneDef } from '../types';

// Capítulo 4 · Carga unitaria (Carlos). Datos verificados contra docs/extracted/guia_texto.md §4 y §13.2.
export const cargaUnitaria: SceneDef = {
  id: 'carga-unitaria',
  chapter: { number: '4', title: 'Carga unitaria' },
  subchapter: { number: '4.1–4.2', title: 'Objetivos, ventajas y factores' },
  presenter: 'carlos',
  title: 'La carga unitaria',
  zone: 'mp',
  camera: {
    position: [-29.0, 3.0, 0.4],
    target: [-29.6, 1.5, 9.6],
    fov: 42,
    duration: 3.6,
  },
  board: {
    position: [-27.4, 2.25, 9.6],
    width: 4.0,
    height: 3.0,
    style: 'whiteboard',
    mount: 'stand',
  },
  boardBlocks: [
    {
      kind: 'definition',
      term: 'Carga unitaria',
      text: 'Número de objetos dispuestos de forma que puedan ser manejados como un solo objeto: tarimas, contenedores y sacos.',
      dataKind: 'course',
      source: 'Castañeda (2026)',
    },
    {
      kind: 'columns',
      ratio: [5, 4],
      columns: [
        [
          {
            kind: 'bullets',
            title: 'Objetivos y ventajas',
            items: [
              'Reducir al mínimo el costo del manejo',
              'Usar contenedores estandarizados',
              'Uso eficiente del espacio cúbico',
              'Mínimo material de embalaje',
              'Proteger el producto contra daños',
            ],
            dataKind: 'course',
            source: 'Castañeda (2026)',
          },
        ],
        [
          { kind: 'custom', component: 'unit-load-counter' },
          {
            kind: 'lead',
            text: 'Para ser unitaria, la carga debe mantener su integridad durante el manejo.',
            dataKind: 'literature',
            source: 'Kay (s. f.)',
          },
        ],
      ],
    },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 8',
      title: 'Factores que determinan el tipo de carga unitaria',
      columns: ['Factor', 'Qué se debe verificar', 'Consecuencia de ignorarlo'],
      rows: [
        ['Peso', 'Capacidad del contenedor, del equipo y de los pisos.', 'Colapso de pallets, sobrecarga del equipo, accidentes.'],
        ['Tamaño del material', 'Dimensiones frente a las del contenedor y al ancho de pasillo.', 'Pérdida de espacio, esquinas dañadas.'],
        ['Forma del material', 'Capacidad de apilarse o necesidad de soportes.', 'Cargas inestables, daños por aplastamiento.'],
        ['Compatibilidad con el equipo de manejo', 'Horquillas, tomas de sujeción, alturas de acceso.', 'Imposibilidad de usar el equipo disponible.'],
        ['Costo de la carga unitaria', 'Pallets, contenedores o embalaje retornable o descartable.', 'Cargas bien diseñadas pero antieconómicas.'],
        ['Apilamiento', 'Resistencia de las cajas inferiores, altura del almacén.', 'Pérdida de volumen o daño por aplastamiento.'],
        ['Protección del material', 'Humedad, golpes, polvo, contaminación.', 'Mermas y reclamos del cliente.'],
      ],
      note: 'Nota. Los factores provienen de Castañeda (2026). La columna de verificación y las consecuencias son aportes de los autores de la guía.',
      dataKind: 'synthesis',
    },
    {
      kind: 'lead',
      text: 'Las cargas unitarias permiten emplear equipo de manejo estandarizado: si todas las cargas tienen la misma base, una sola montacargas, un solo rack y un solo transportador sirven para todo el flujo.',
      dataKind: 'literature',
      source: 'Kay (s. f.)',
    },
    {
      kind: 'callout',
      variant: 'idea',
      title: 'Idea clave',
      text: 'La carga unitaria es el puente entre el producto y el equipo. Si la carga está mal definida, ningún equipo, por avanzado que sea, la manejará bien.',
    },
    {
      kind: 'stats',
      title: 'Caso 2 · Dynea Pakistan (avance de la sección 13.2)',
      items: [
        { value: '35 → 50', label: 'sacos por pallet' },
        { value: '54 % → 80 %', label: 'uso del espacio de almacén' },
        { value: '0,54 → 0,77', label: 'utilización del equipo de manejo' },
      ],
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
    {
      kind: 'chart',
      chart: 'before-after',
      title: 'Resultados del caso Dynea Pakistan (indicadores en %)',
      unit: '%',
      beforeLabel: 'Antes',
      afterLabel: 'Después',
      data: [
        { label: 'Uso del espacio de almacén', before: 54, after: 80 },
        { label: 'Uso de contenedores', before: 84, after: 92 },
        { label: 'Eficiencia del ciclo de manufactura', before: 62, after: 74 },
      ],
      note: 'Nota. Datos de la Tabla 29 (Waseem et al., 2021). El resumen del artículo habla de 15 % de mejora en la eficiencia del ciclo, pero el cuerpo reporta 62 % a 74 % (12 puntos porcentuales); se usan los valores del cuerpo.',
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
  ],
  animations: ['unit-load'],
  references: ['castaneda2026', 'kay_sf', 'waseem2021'],
  notes:
    'Mientras las cajas forman la carga: «cada caja suelta es una manipulación; al formar la carga unitaria, el montacargas hace un solo viaje». Recalcar los cinco objetivos del curso y la condición de Kay: la carga debe mantener su integridad (el film estirable cumple ese papel). Anunciar el caso Dynea: subir de 35 a 50 sacos por pallet llevó el uso del espacio de 54 % a 80 % sin comprar equipo. Pulsar R para repetir la animación.',
};
