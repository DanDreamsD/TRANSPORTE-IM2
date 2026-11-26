import type { SceneDef } from '../types';

// Capítulo 6 · Transportadores (Vane). Datos verificados contra docs/extracted/guia_texto.md §6 y §5.3.
export const transportadores: SceneDef = {
  id: 'transportadores',
  chapter: { number: '6', title: 'Transportadores' },
  subchapter: { number: '6.1', title: 'Tipos de transportadores' },
  presenter: 'vane',
  title: 'Transportadores en funcionamiento',
  zone: 'line',
  camera: {
    position: [20, 4.2, -3.4],
    target: [20.4, 1.8, -12.6],
    fov: 44,
    duration: 4.2,
  },
  board: {
    position: [18.8, 2.25, -15.6],
    width: 4.4,
    height: 3.15,
    style: 'screen',
    mount: 'stand',
  },
  boardBlocks: [
    {
      kind: 'definition',
      term: 'Transportador',
      text: 'Equipo de manejo de ruta fija que traslada materiales de un punto a otro de forma continua. Especialmente útil para cargas pesadas o voluminosas.',
      dataKind: 'course',
    },
    {
      kind: 'columns',
      ratio: [1, 1],
      columns: [
        [
          {
            kind: 'bullets',
            title: 'Sin motor',
            items: ['Rodillos', 'Ruedas', 'Tolvas'],
            dataKind: 'course',
          },
        ],
        [
          {
            kind: 'bullets',
            title: 'Con motor',
            items: ['Neumáticos', 'Rodillos', 'Bandas'],
            dataKind: 'course',
          },
        ],
      ],
    },
    { kind: 'custom', component: 'conveyor-anatomy' },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 10',
      title: 'Principales tipos de transportadores según la taxonomía del CICMHE',
      columns: ['Tipo', 'Carga', 'Características principales'],
      rows: [
        ['Rodillos por gravedad', 'Unitaria', 'Inclinación según el peso de la carga; para acumulación; alternativa para servicio pesado frente al de ruedas.'],
        ['Rodillos motorizados', 'Unitaria', 'Accionados por correa o cadena; permiten desacoplar rodillos para acumular.'],
        ['Ruedas', 'Unitaria', 'Servicio ligero y más económico que el de rodillos; existen versiones flexibles y expandibles.'],
        ['Cadena', 'Unitaria', 'Una o varias cadenas sin fin sostienen la carga; la configuración paralela mueve pallets; hay versión vertical.'],
        ['Tablillas (slat)', 'Unitaria', 'Tablillas unidas a una cadena; la carga conserva su posición; para cargas pesadas o que dañarían una banda; usado en embotelladoras.'],
        ['Banda plana', 'Unitaria', 'Control de la orientación y ubicación de la carga; no permite acumular, fusionar ni clasificar con suavidad sobre la banda.'],
        ['Banda magnética', 'Unitaria', 'Para materiales ferrosos; puede mover la carga en vertical, invertida y alrededor de esquinas.'],
        ['Banda en artesa', 'Granel', 'La banda adopta la forma de los rodillos en artesa al cargarse.'],
        ['Cangilones (bucket)', 'Granel', 'Eleva material en vertical o con fuerte inclinación.'],
        ['Tornillo (screw)', 'Granel', 'Un helicoide giratorio mueve polvos, granos y sólidos a granel.'],
        ['Neumático', 'Granel', 'Transporta material pulverulento o granular por tuberías mediante aire.'],
        ['Vibratorio', 'Granel', 'Emplea vibración controlada para avanzar el material.'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía a partir de CICMHE (s. f.). Se omiten el transportador de rampa (chute) y otros tipos que la taxonomía también documenta.',
      dataKind: 'literature',
    },
    {
      kind: 'table',
      label: 'Tabla 11',
      title: 'Ventajas y desventajas de los transportadores',
      columns: ['Ventajas', 'Desventajas'],
      rows: [
        ['Mueven gran número de objetos', 'Ruta fija y áreas limitadas'],
        ['Velocidad ajustable', 'Pueden crear cuellos de botella'],
        ['Permiten combinar procesamiento e inspección', 'Una falla puede detener toda la línea'],
        ['Son versátiles', 'Obstaculizan el movimiento del equipo móvil en el piso'],
        ['Permiten almacenamiento temporal', ''],
        ['Traslado automático de la carga', ''],
        ['No requieren rutas en línea recta', ''],
        ['Aprovechan el espacio cúbico', ''],
      ],
      note: 'Nota. Contenido de las diapositivas del curso.',
      dataKind: 'course',
    },
    {
      kind: 'lead',
      text: 'Los transportadores son dispositivos de ruta fija, más adecuados cuando el volumen de material es grande y el material es bastante uniforme en tamaño y forma.',
      dataKind: 'literature',
      source: 'Heragu y Ekren (s. f.)',
    },
    {
      kind: 'callout',
      variant: 'expo',
      title: 'Para la exposición',
      text: 'Muestre el transportador como un arreglo de compromiso: ofrece continuidad y control, pero compromete el espacio de piso y deja a la planta dependiente de una sola ruta.',
    },
  ],
  animations: ['conveyor'],
  references: ['cicmhe_sf', 'heragu_sf'],
  notes:
    'Señalar las partes: motor-reductor, rodillos motorizados, sensor fotoeléctrico y tramo de rodillos por gravedad donde las cajas se acumulan. Usar el control de velocidad (abajo a la derecha) para mostrar la «velocidad ajustable» y el botón «Detener motor» para mostrar que una falla detiene toda la línea (Tabla 11). Aclarar que es una demostración didáctica.',
};
