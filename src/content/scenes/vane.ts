// Escenas de Vane: capítulos 6 (6.2–6.3) y 7 + caso 4 (AGV en planta de asientos).
// La escena 6–6.1 (transportadores) está en transportadores.ts.
// Datos verificados contra docs/extracted/guia_texto.md §6.2–6.3, §7 y §13.4.
import type { SceneDef } from '../types';

/** Pantalla de la línea de ensamble (compartida con la escena 6.1 y el caso 4). */
const LINE_SCREEN = {
  position: [18.8, 2.25, -15.6] as const,
  width: 4.4,
  height: 3.15,
  style: 'screen' as const,
  mount: 'stand' as const,
};

/** Pantalla colgante del área de procesamiento (compartida por las dos escenas de grúas). */
const PROC_SCREEN = {
  position: [-7.5, 4.6, -24.0] as const,
  width: 5.6,
  height: 3.0,
  style: 'screen' as const,
  mount: 'hanging' as const,
};

export const transportadoresCriterios: SceneDef = {
  id: 'transportadores-criterios',
  chapter: { number: '6', title: 'Transportadores' },
  subchapter: { number: '6.2–6.3', title: 'Ventajas, desventajas y criterios de elección' },
  presenter: 'vane',
  title: 'Ventajas, desventajas y criterios',
  zone: 'line',
  camera: {
    position: [26.6, 3.6, -6.0],
    target: [20.6, 1.7, -14.4],
    fov: 46,
    duration: 2.4,
  },
  board: { ...LINE_SCREEN, pxWidth: 1120 },
  boardBlocks: [
    {
      kind: 'columns',
      ratio: [1, 1],
      columns: [
        [
          {
            kind: 'bullets',
            title: 'Ventajas',
            items: [
              'Mueven gran número de objetos',
              'Velocidad ajustable',
              'Combinan procesamiento e inspección',
              'Son versátiles',
              'Permiten almacenamiento temporal',
              'Traslado automático de la carga',
              'No requieren rutas en línea recta',
              'Aprovechan el espacio cúbico',
            ],
          },
        ],
        [
          {
            kind: 'bullets',
            title: 'Desventajas',
            items: [
              'Ruta fija y áreas limitadas',
              'Pueden crear cuellos de botella',
              'Una falla puede detener toda la línea',
              'Obstaculizan el movimiento del equipo móvil en el piso',
            ],
          },
        ],
      ],
    },
    {
      kind: 'lead',
      text: 'Tabla 11 · Ventajas y desventajas de los transportadores.',
      dataKind: 'course',
      source: 'Castañeda (2026)',
    },
  ],
  detailBlocks: [
    {
      kind: 'bullets',
      title: '6.3 Criterios para elegir un transportador',
      ordered: true,
      items: [
        '¿Qué se mueve? Carga unitaria o granel; peso, tamaño y forma; si el material es ferroso, frágil o debe mantener su orientación.',
        '¿Qué operación se requiere? Solo transporte, o también acumulación, clasificación o inspección en línea.',
        '¿Cuál es el trayecto? Distancia, pendientes, giros y cruces con pasillos de equipo móvil.',
        '¿Cuál es el volumen? Un flujo alto y estable justifica una ruta fija; un flujo bajo y variable no.',
        '¿Qué ocurre si falla? Si el proceso depende de un solo transportador, evalúe redundancia o rutas alternas.',
      ],
      dataKind: 'synthesis',
      source: 'Guía, §6.3',
    },
    {
      kind: 'callout',
      variant: 'expo',
      title: 'Para la exposición',
      text: 'Muestre el transportador como un arreglo de compromiso: ofrece continuidad y control, pero compromete el espacio de piso y deja a la planta dependiente de una sola ruta. Ese compromiso es lo que debe pesarse en el análisis del capítulo 11.',
    },
  ],
  animations: ['conveyor-failure'],
  references: ['castaneda2026'],
  notes:
    'La línea simula una falla del motor: el tramo motorizado se detiene, la baliza se pone en rojo y las cajas dejan de entrar; el tramo por gravedad termina de vaciarse. Ilustra «una falla puede detener toda la línea» y «pueden crear cuellos de botella». Con «C» se ven las cinco preguntas para elegir un transportador (síntesis de los autores). Demostración didáctica.',
};

export const gruas: SceneDef = {
  id: 'gruas',
  chapter: { number: '7', title: 'Grúas, polipastos y montacargas fijos' },
  subchapter: { number: '7.1', title: 'Tipos de grúas' },
  presenter: 'vane',
  title: 'Grúas, polipastos y montacargas fijos',
  zone: 'proc',
  camera: {
    position: [2.8, 8.2, -13.5],
    target: [-12.5, 3.3, -21.0],
    fov: 50,
    duration: 3.6,
  },
  board: { ...PROC_SCREEN, pxWidth: 1180 },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Izan y trasladan cargas dentro de un área limitada, generalmente por encima del nivel del piso: ahorran espacio y minimizan la interferencia con el tránsito de personas y vehículos.',
      dataKind: 'course',
      source: 'Castañeda (2026)',
    },
    {
      kind: 'figure',
      label: 'Figura 9',
      title: 'Cuatro configuraciones básicas de grúas aéreas',
      src: 'figures/fig09.png',
      dataKind: 'literature',
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'El curso distingue grúas fijas (malacate, pluma, puente, pescante, monorriel y montacargas) y móviles (plataformas aéreas, mesas elevadoras y elevadores de mantenimiento). Entre las grúas aéreas, la más usada en entornos de manufactura es la grúa puente.',
      dataKind: 'course',
      source: 'Castañeda (2026); The Fabricator (s. f.)',
    },
    {
      kind: 'table',
      label: 'Tabla 12',
      title: 'Características de las principales grúas aéreas',
      columns: ['Tipo', 'Cómo funciona', 'Uso típico'],
      rows: [
        ['Puente (bridge)', 'Dos rieles paralelos sostienen un puente móvil; el polipasto se desplaza a lo largo del puente.', 'Cargas pesadas en distancias largas; cubre toda el área rectangular.'],
        ['Pórtico (gantry)', 'Similar a la grúa puente, pero el puente se apoya en patas que corren sobre rieles o ruedas en el piso.', 'Patios y zonas sin estructura de soporte elevada.'],
        ['Pluma (jib)', 'Un brazo giratorio cubre una zona circular; el polipasto cuelga del brazo.', 'Manejo puntual en una estación; mejora la ergonomía en áreas pequeñas.'],
        ['Monorriel', 'El polipasto o el trolley corre por un único riel elevado.', 'Rutas fijas de transferencia entre puntos.'],
        ['De estación de trabajo', 'Grúa ligera con estructura propia para una zona pequeña.', 'Piezas ligeras junto a máquinas como un centro de mecanizado o una sierra.'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía a partir de CMCO (s. f.), The Fabricator (s. f.) y Modern Materials Handling (s. f.-b).',
      dataKind: 'literature',
    },
    {
      kind: 'figure',
      label: 'Figura 9',
      title: 'Cuatro configuraciones básicas de grúas aéreas',
      src: 'figures/fig09.png',
      note: 'Nota. Esquemas simplificados de los autores. Descripción de las configuraciones basada en The Fabricator (s. f.), CMCO (s. f.) y Modern Materials Handling (s. f.-b).',
    },
  ],
  animations: ['cranes'],
  references: ['castaneda2026', 'fabricator_sf', 'cmco_sf', 'mmh_sf_b'],
  notes:
    'En el área de procesamiento: la grúa puente recorre sus rieles, el polipasto baja, iza una bobina y la traslada; la grúa pluma gira en su estación y el monorriel lleva piezas por una ruta fija. El pórtico se explica con la Figura 9 (no tiene sentido dentro de esta nave cubierta). Demostración didáctica.',
};

export const gruasServicio: SceneDef = {
  id: 'gruas-servicio',
  chapter: { number: '7', title: 'Grúas, polipastos y montacargas fijos' },
  subchapter: { number: '7.2–7.3', title: 'Clasificación por servicio, ventajas y desventajas' },
  presenter: 'vane',
  title: 'Clasificación por servicio',
  zone: 'proc',
  camera: {
    position: [-2.6, 5.4, -16.4],
    target: [-7.5, 4.4, -24.0],
    fov: 46,
    duration: 2.2,
  },
  board: { ...PROC_SCREEN, pxWidth: 1220 },
  boardBlocks: [
    {
      kind: 'columns',
      ratio: [11, 9],
      columns: [
        [
          {
            kind: 'table',
            label: 'Tabla 13',
            title: 'Ventajas y desventajas',
            columns: ['Ventajas', 'Desventajas'],
            rows: [
              ['Permiten izar y trasladar', 'Requieren fuerte inversión'],
              ['Minimizan la interferencia', 'Sirven a un área limitada'],
              ['Ahorran espacio en el piso', 'Algunas solo se mueven en línea recta'],
              ['Pueden manejar cargas pesadas', 'Se usan solo un corto tiempo'],
              ['Sirven para carga y descarga', 'Es necesario un operario'],
            ],
            dataKind: 'course',
            source: 'Castañeda (2026)',
          },
        ],
        [
          {
            kind: 'bullets',
            title: 'Clasificación por servicio',
            items: [
              'CMAA: clase A (reserva o poco frecuente) a clase F (continuo y severo), según arranques por hora y % medio de la capacidad levantada',
              'ISO 4301-1 y normas europeas: A1 (ligero, poco frecuente) a A8 (pesado y continuo)',
            ],
            dataKind: 'literature',
            source: 'The Fabricator (s. f.); Designing Buildings (s. f.)',
          },
        ],
      ],
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'La selección de una grúa puente depende de su capacidad nominal, luz, altura de izaje, clase de servicio, velocidades, método de control y entorno de operación. Una grúa sobredimensionada encarece la inversión; una subdimensionada se desgasta de forma prematura.',
      dataKind: 'literature',
      source: 'Designing Buildings (s. f.)',
    },
    {
      kind: 'lead',
      text: 'La desventaja «se usan solo un corto tiempo» merece un comentario: una grúa puente puede quedar inactiva entre izajes. Por eso se recomienda considerar las grúas como un recurso subutilizado y evaluar su uso en más tareas antes de comprar otra.',
      dataKind: 'literature',
      source: 'The Fabricator (s. f.)',
    },
    {
      kind: 'callout',
      variant: 'idea',
      title: 'Idea clave',
      text: 'La grúa es el equipo del volumen alto de carga pesada en un área definida. Si el trabajo es liviano y disperso, el costo y la dependencia de un operario hacen que otro equipo sea mejor opción.',
    },
  ],
  animations: ['cranes'],
  references: ['castaneda2026', 'fabricator_sf', 'designingbuildings_sf'],
  notes:
    'Leer la Tabla 13 en pares. Explicar las dos escalas de clasificación por servicio (CMAA A–F; ISO 4301-1 A1–A8). Con «C»: factores de selección y el comentario sobre la grúa como recurso subutilizado. Mientras tanto, la grúa puente del fondo sigue con su ciclo.',
};

export const casoAgvAsientos: SceneDef = {
  id: 'caso-agv-asientos',
  chapter: { number: '13', title: 'Casos aplicados en investigaciones' },
  subchapter: { number: '13.4', title: 'Caso 4: AGV en una planta de asientos de automóvil (Eslovaquia)' },
  presenter: 'vane',
  title: 'Caso 4: AGV en planta de asientos',
  zone: 'line',
  camera: {
    position: [18.6, 7.2, -9.0],
    target: [17.8, 1.1, -23],
    fov: 50,
    duration: 3.0,
  },
  board: { ...LINE_SCREEN, pxWidth: 1000 },
  boardBlocks: [
    {
      kind: 'lead',
      text: '510 asientos por día en tres turnos; transporte manual lento, con riesgo de colisión entre equipos y personas. Se instalaron dos AGV guiados por cinta magnética.',
      dataKind: 'case',
      source: 'Kubasáková et al. (2024)',
    },
    { kind: 'custom', component: 'agv-payback' },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'Kubasáková et al. (2024) estudiaron una nave de producción de asientos de automóvil que trabaja en tres turnos y fabrica 510 asientos por día (170 por turno). El material lo movían cuatro operarios en turnos, con tres tipos de carros jalados a mano y un AGV. La empresa instaló dos AGV guiados por cinta magnética, con un circuito de carga integrado en el piso. Los autores evaluaron además un AMR de tipo plataforma elevadora con navegación láser (SLAM), y proponen que una sola de esas unidades podría reemplazar a los dos AGV, aunque a un costo más alto.',
      dataKind: 'case',
      source: 'Kubasáková et al. (2024)',
    },
    {
      kind: 'table',
      label: 'Tabla 30',
      title: 'Datos económicos del caso de los AGV',
      columns: ['Concepto', 'Valor'],
      rows: [
        ['Inversión en dos AGV', 'EUR 49 000 (pago único de EUR 38 200 más alquiler de EUR 450 al mes durante 24 meses)'],
        ['Costo anual anterior', 'EUR 79 200 (tres operarios a EUR 26 400 al año cada uno)'],
        ['Periodo de recuperación reportado', 'Cerca de 8 meses'],
        ['Cálculo simple (inversión ÷ costo anual)', '49 000 ÷ 79 200 = 0,62 años, es decir unos 7,4 meses'],
      ],
      note: 'Nota. Kubasáková et al. (2024). El artículo es inconsistente en el número de operarios reemplazados (tres en una sección y cuatro en la conclusión) y la conclusión cita un ahorro anual de EUR 24 824 que no coincide con las tablas.',
      dataKind: 'case',
    },
    {
      kind: 'callout',
      variant: 'case',
      title: 'Qué enseña el caso',
      text: 'Es una aplicación directa del periodo de recuperación del capítulo 12, con un resultado muy corto porque reemplaza tres turnos de trabajo manual. Antes de copiarlo hay que mirar las condiciones: tres turnos, rutas repetitivas y un salario alto; con un solo turno o rutas variables el resultado sería otro.',
    },
  ],
  animations: ['agv-seats'],
  references: ['kubasakova2024'],
  notes:
    'Dos AGV recorren un circuito de cinta magnética entre el almacén de componentes y el final de la línea de asientos, con paradas fijas. Datos reales: inversión EUR 49 000 frente a EUR 79 200 de costo laboral anual → ≈ 7,4 meses (los autores reportan cerca de 8). Mencionar las inconsistencias del artículo. La animación es didáctica y no reproduce la planta real.',
};
