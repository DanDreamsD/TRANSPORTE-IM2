// Escenas de Felipe: capítulos 1 y 2 + caso 1 (Marcopolo).
// Datos verificados contra docs/extracted/guia_texto.md §1, §2 y §13.1.
import type { SceneDef } from '../types';

export const definicionAlcance: SceneDef = {
  id: 'definicion-alcance',
  chapter: { number: '1', title: 'Fundamentos y alcance del manejo de materiales' },
  subchapter: { number: '1.1', title: 'Definición y alcance' },
  presenter: 'felipe',
  title: 'Definición y alcance',
  zone: 'rec',
  camera: {
    position: [-53.5, 5.0, 10.5],
    target: [-45.8, 3.6, -2.4],
    fov: 46,
    duration: 4,
  },
  board: {
    position: [-48.6, 4.7, 0.6],
    width: 6.0,
    height: 4.6,
    style: 'screen',
    mount: 'hanging',
  },
  boardBlocks: [
    {
      kind: 'columns',
      ratio: [1, 1],
      columns: [
        [
          {
            kind: 'definition',
            term: 'Curso',
            text: 'Operaciones básicas de movimiento de productos a granel, empacados y unitarios, con maquinaria, dentro de los límites de la planta.',
            dataKind: 'course',
          },
        ],
        [
          {
            kind: 'definition',
            term: 'MHIA',
            text: 'Movimiento, almacenamiento, protección y control de los materiales en manufactura y distribución, incluidos su consumo y disposición.',
            dataKind: 'literature',
            source: 'MHIA, citada en Groover (2008)',
          },
        ],
      ],
    },
    {
      kind: 'figure',
      label: 'Figura 1',
      title: 'Alcance del manejo de materiales a lo largo de la planta',
      src: 'figures/fig01.png',
    },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 1',
      title: 'Enfoques sobre el concepto de manejo de materiales',
      columns: ['Fuente', 'Enfoque', 'Qué enfatiza'],
      rows: [
        ['Curso', 'Operaciones básicas de movimiento de productos a granel, empacados y unitarios, con maquinaria, dentro de la planta.', 'El movimiento físico y la elección del equipo.'],
        ['MHIA, citada en Groover (2008)', 'Movimiento, almacenamiento, protección y control de materiales durante manufactura y distribución, incluyendo consumo y disposición.', 'Cuatro funciones y todo el ciclo de vida del material.'],
        ['Groover (2008)', 'El manejo debe hacerse de forma segura, eficiente, a bajo costo y a tiempo.', 'Criterios de desempeño del sistema.'],
        ['White (s. f.)', 'Punto de partida de diseño: el mejor manejo de materiales es el que no hace falta.', 'Eliminar movimientos antes de mecanizarlos.'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía a partir de las fuentes citadas. La definición de la MHIA se toma de las diapositivas de Groover (2008) sobre transporte de materiales.',
      dataKind: 'literature',
    },
    {
      kind: 'lead',
      text: 'La definición del curso se centra en el movimiento; la de la MHIA incorpora el almacenamiento, la protección y el control. La primera delimita el objeto de estudio del capítulo y la segunda recuerda que un pallet detenido en un rack también forma parte del sistema de manejo.',
      dataKind: 'synthesis',
      source: 'Guía, §1.1',
    },
    {
      kind: 'figure',
      label: 'Figura 1',
      title: 'Alcance del manejo de materiales a lo largo de la planta',
      src: 'figures/fig01.png',
      note: 'Nota. Elaboración propia. Las categorías de dirección, tipo de carga y equipo provienen de las diapositivas del curso.',
    },
  ],
  animations: ['material-flow'],
  references: ['groover2008', 'white_sf'],
  notes:
    'Contrastar las dos definiciones: el curso habla de movimiento; la MHIA añade almacenamiento, protección y control. Señalar la flecha del piso: el manejo acompaña al material desde el muelle de recepción hasta el despacho. Cerrar con White: «el mejor manejo de materiales es el que no hace falta».',
};

export const moverMateriales: SceneDef = {
  id: 'mover-materiales',
  chapter: { number: '1', title: 'Fundamentos y alcance del manejo de materiales' },
  subchapter: { number: '1.2', title: 'Qué implica mover materiales' },
  presenter: 'felipe',
  title: 'Qué implica mover materiales',
  zone: 'rec',
  camera: {
    position: [-47.5, 4.2, 15.5],
    target: [-57, 2.0, 7.5],
    fov: 44,
    duration: 3.2,
  },
  board: {
    position: [-59.75, 2.6, 11],
    width: 5.4,
    height: 3.3,
    rotationY: Math.PI / 2,
    style: 'whiteboard',
    mount: 'wall',
  },
  boardBlocks: [
    {
      kind: 'bullets',
      title: 'El movimiento de materiales involucra',
      items: [
        'Dirección: horizontal, vertical, carga y descarga',
        'Recorrido: de la recepción hasta la entrega al cliente',
        'Equipo: transportadores, grúas, transportes u operarios',
        'Estado: a granel, desempacado, empacado o unitario',
        'Mano de obra: el manejo mecanizado reduce operarios de traslado',
      ],
      dataKind: 'course',
    },
    { kind: 'custom', component: 'material-flow-types' },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'Kay (s. f.) agrupa esta variedad en dos grandes familias según la naturaleza del material. Los ítems individuales y los contenedorizados generan un flujo discreto, se manejan como cargas unitarias y requieren equipo de manejo unitario. Los materiales a granel generan un flujo continuo y requieren equipo de manejo a granel.',
      dataKind: 'literature',
      source: 'Kay (s. f.)',
    },
    {
      kind: 'callout',
      variant: 'idea',
      title: 'Ejemplo de la guía',
      text: 'Un mismo producto puede pasar de una familia a otra: el cemento puede moverse en sacos sobre pallets con una montacargas o a granel con un transportador neumático.',
    },
  ],
  animations: ['truck-unload'],
  references: ['kay_sf'],
  notes:
    'Mientras el montacargas descarga: señalar las tres direcciones del movimiento (descarga del camión, traslado horizontal, elevación vertical de las horquillas). Explicar los dos flujos de Kay: discreto (cargas unitarias, como este pallet) y continuo (granel). Usar el ejemplo del cemento.',
};

export const objetivosCostos: SceneDef = {
  id: 'objetivos-costos',
  chapter: { number: '1', title: 'Fundamentos y alcance del manejo de materiales' },
  subchapter: { number: '1.3–1.5', title: 'Objetivos, costo y ventajas' },
  presenter: 'felipe',
  title: 'Objetivos y costo del manejo',
  zone: 'meet',
  camera: {
    position: [53.5, 1.85, -24.2],
    target: [53.5, 1.75, -31],
    fov: 46,
    duration: 3.8,
  },
  board: {
    position: [53.5, 1.8, -31.2],
    width: 7.2,
    height: 2.8,
    pxWidth: 1480,
    rotationY: 0,
    style: 'screen',
    mount: 'wall',
  },
  boardBlocks: [
    {
      kind: 'columns',
      ratio: [9, 11],
      columns: [
        [
          {
            kind: 'bullets',
            title: 'Seis objetivos del curso',
            items: [
              'Aumentar la eficiencia del flujo',
              'Reducir el costo del manejo',
              'Mejorar la utilización de las instalaciones',
              'Mejorar la seguridad y las condiciones de trabajo',
              'Facilitar el proceso de manufactura',
              'Incrementar la productividad',
            ],
            dataKind: 'course',
          },
        ],
        [{ kind: 'custom', component: 'cost-ranges' }],
      ],
    },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 2',
      title: 'Objetivos del manejo de materiales e indicadores asociados',
      columns: ['Objetivo (curso)', 'Cómo se manifiesta en planta', 'Indicador sugerido'],
      rows: [
        ['Aumentar la eficiencia del flujo', 'El material llega donde y cuando se necesita.', 'Entregas a tiempo a cada estación; tiempo de espera de material.'],
        ['Reducir el costo del manejo', 'Menos movimientos, menos distancia, menos personal dedicado.', 'Costo de manejo por unidad producida; metros-pallet por día.'],
        ['Mejorar la utilización de las instalaciones', 'Pasillos libres, almacenamiento en altura, menos área ocupada por WIP.', 'Porcentaje de área de piso ocupada por inventario en proceso.'],
        ['Mejorar la seguridad y las condiciones de trabajo', 'Menos cargas manuales pesadas y menos cruces de personas y equipos.', 'Accidentes por manipulación; índice de levantamiento (NIOSH).'],
        ['Facilitar el proceso de manufactura', 'El manejo se integra con la operación y no la interrumpe.', 'Tiempo de ciclo; paradas por falta de material.'],
        ['Incrementar la productividad', 'Más producto por hora-hombre y por metro cuadrado.', 'Unidades por operario-turno.'],
      ],
      note: 'Nota. Los objetivos provienen del curso. Los indicadores son una propuesta de los autores de la guía.',
      dataKind: 'synthesis',
    },
    {
      kind: 'lead',
      text: 'El manejo de materiales incrementa el costo del producto sin aportarle valor agregado, retrasa las entregas y consume área de planta y de almacén: entre 20 % y 50 % del costo total del producto y entre 80 % y 95 % del tiempo global de las órdenes.',
      dataKind: 'course',
      source: 'Tompkins et al. (2010)',
    },
    {
      kind: 'bullets',
      title: 'No todas las cifras miden lo mismo',
      items: [
        'Groover (2008): entre 20 % y 25 % del costo de mano de obra de manufactura en Estados Unidos.',
        'Datar et al. (1991): en un estudio de caso con costeo basado en actividades, más de cinco millones de dólares anuales, cerca del 10 % de los costos totales de la fábrica.',
        'Saputro et al. (2015) recogen una afirmación frecuente: el manejo ocupa 25 % de los empleados, 55 % del espacio de la fábrica y 87 % del tiempo de producción.',
      ],
      dataKind: 'literature',
    },
    {
      kind: 'callout',
      variant: 'expo',
      title: 'Para la exposición',
      text: 'No presente una sola cifra como si fuera universal. Diga siempre sobre qué base se calcula el porcentaje (costo del producto, mano de obra, fábrica o tiempo). El valor exacto depende de la industria, del grado de automatización y de la metodología de costeo.',
    },
    {
      kind: 'bullets',
      title: '1.5 Ventajas de un buen sistema',
      items: [
        'Oportunidades importantes de ahorro en costos y gran potencial para mejorar el servicio al cliente.',
        'Las empresas, más conscientes de los problemas ambientales, usan equipos con emisiones reducidas.',
        'Se diseñan sistemas computarizados que permiten seguir todo el proceso.',
        'Se emplean métodos más complejos, como la teoría de líneas de espera y las técnicas de planificación de flujos.',
      ],
      dataKind: 'course',
    },
  ],
  animations: [],
  references: ['tompkins2010', 'groover2008', 'datar1991', 'saputro2015'],
  notes:
    'Recorrer los seis objetivos y, en el gráfico, insistir en que cada barra usa una base distinta: 20–50 % del costo del producto, 20–25 % del costo de mano de obra (EE. UU.), ≈10 % del costo de fábrica en un caso, 80–95 % del tiempo de las órdenes. No se comparan entre sí. Con «C» se muestran los indicadores de la Tabla 2 y las ventajas (§1.5).',
};

export const principios: SceneDef = {
  id: 'principios',
  chapter: { number: '2', title: 'Principios del manejo de materiales' },
  subchapter: { number: '2.1–2.2', title: 'Los veinte principios del curso y los diez de MHIA/CICMHE' },
  presenter: 'felipe',
  title: 'Los principios del manejo',
  zone: 'eng',
  camera: {
    position: [39.5, 1.85, -24.0],
    target: [39.5, 1.75, -31],
    fov: 46,
    duration: 3.6,
  },
  board: {
    position: [39.5, 1.8, -31.2],
    width: 7.2,
    height: 2.8,
    pxWidth: 1540,
    rotationY: 0,
    style: 'whiteboard',
    mount: 'wall',
  },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Reglas de diseño que condensan décadas de experiencia: sirven para evaluar un sistema existente y para guiar uno nuevo. El curso presenta 20; la MHIA y el CICMHE difunden una versión sintética de 10.',
      dataKind: 'literature',
      source: 'Heragu y Ekren (s. f.)',
    },
    { kind: 'custom', component: 'principles-grid' },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 3',
      title: 'Los veinte principios del manejo de materiales agrupados por familia',
      columns: ['Familia', 'Principio', 'Idea central'],
      rows: [
        ['Planeación y sistema', 'Planeación', 'Todo manejo debe resultar de un plan deliberado.'],
        ['', 'Flujo de sistemas', 'Integrar las actividades de manejo en un solo sistema, desde la recepción hasta el despacho.'],
        ['', 'Flujo de material', 'Ordenar la secuencia de operaciones y la distribución para lograr un flujo óptimo.'],
        ['', 'Simplificación', 'Eliminar, combinar o reducir movimientos y equipos innecesarios.'],
        ['Aprovechar recursos físicos', 'Uso de la gravedad', 'Emplear la gravedad para mover materiales siempre que sea posible.'],
        ['', 'Utilización del espacio', 'Usar el espacio cúbico de forma efectiva.'],
        ['', 'Tamaño unitario', 'Aumentar la cantidad, el tamaño o el peso de las cargas unitarias.'],
        ['Mecanización y control', 'Mecanización', 'Mecanizar las operaciones de manejo para aumentar eficiencia.'],
        ['', 'Automatización', 'Automatizar donde el volumen y la repetición lo justifiquen.'],
        ['', 'Control', 'Usar el manejo para mejorar el control de la producción y del inventario.'],
        ['Equipo', 'Selección de equipo', 'Considerar todos los aspectos del material, el movimiento y el método.'],
        ['', 'Estandarización', 'Estandarizar métodos, tipos y tamaños del equipo.'],
        ['', 'Adaptabilidad', 'Elegir métodos y equipos que sirvan para distintas tareas.'],
        ['', 'Peso muerto', 'Reducir la relación entre el peso del equipo móvil y la carga útil.'],
        ['', 'Utilización', 'Lograr la máxima utilización del equipo y del personal.'],
        ['Ciclo de vida y desempeño', 'Mantenimiento', 'Planificar el mantenimiento preventivo y programado.'],
        ['', 'Obsolescencia', 'Definir una política de reemplazo que considere el costo de ciclo de vida.'],
        ['', 'Capacidad', 'Usar el equipo para ayudar a lograr la capacidad de producción prevista.'],
        ['', 'Desempeño', 'Evaluar el manejo por el costo por unidad movida.'],
        ['', 'Seguridad', 'Proveer métodos y equipo seguros para el manejo.'],
      ],
      note: 'Nota. Los nombres de los principios provienen del curso. Las ideas centrales son una síntesis de los autores de la guía; deben contrastarse con Meyers y Stephens (2006) y Tompkins et al. (2010) antes de citarlas textualmente.',
      dataKind: 'synthesis',
    },
    {
      kind: 'table',
      label: 'Tabla 4',
      title: 'Equivalencia entre los diez principios MHIA/CICMHE y los veinte del curso',
      columns: ['Principio MHIA/CICMHE', 'Principios del curso relacionados'],
      rows: [
        ['Planeación', 'Planeación; flujo de sistemas; selección de equipo'],
        ['Estandarización', 'Estandarización; adaptabilidad'],
        ['Trabajo', 'Simplificación; flujo de material; uso de la gravedad; peso muerto'],
        ['Ergonomía', 'Seguridad'],
        ['Carga unitaria', 'Tamaño unitario'],
        ['Uso del espacio', 'Utilización del espacio'],
        ['Sistema', 'Flujo de sistemas; control'],
        ['Automatización', 'Mecanización; automatización'],
        ['Ambiente', 'Sin equivalente directo en la lista clásica'],
        ['Ciclo de vida', 'Mantenimiento; obsolescencia; utilización; capacidad; desempeño'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía. La correspondencia es interpretativa y no figura en ninguna de las fuentes.',
      dataKind: 'synthesis',
    },
    {
      kind: 'lead',
      text: 'Casi todos los principios del curso encuentran un equivalente; el aporte nuevo de la versión de diez principios es la inclusión explícita de la dimensión ambiental y de los costos de ciclo de vida.',
      dataKind: 'synthesis',
      source: 'Guía, §2.2',
    },
    {
      kind: 'figure',
      label: 'Figura 3',
      title: 'Los diez principios del manejo de materiales de MHIA/CICMHE',
      src: 'figures/fig03.png',
      note: 'Nota. Elaboración propia a partir de la descripción de los principios en Heragu y Ekren (s. f.).',
    },
  ],
  animations: [],
  references: ['heragu_sf', 'kay_sf', 'meyers2006', 'tompkins2010'],
  notes:
    'Presentar los diez principios de la pizarra y anunciar que el del «trabajo» es el más cuantificable (siguiente escena). Con «C» se ve la tabla de los 20 principios del curso y su equivalencia. Aclarar que las ideas centrales y la correspondencia son síntesis de los autores de la guía.',
};

export const trabajoFlujoDistancia: SceneDef = {
  id: 'trabajo-flujo-distancia',
  chapter: { number: '2', title: 'Principios del manejo de materiales' },
  subchapter: { number: '2.3', title: 'El principio del trabajo: flujo por distancia' },
  presenter: 'felipe',
  title: 'Principio del trabajo: flujo × distancia',
  zone: 'eng',
  camera: {
    position: [41.6, 8.6, -0.6],
    target: [41.6, 0.6, -10.4],
    fov: 46,
    duration: 3.4,
  },
  board: {
    position: [41.6, 2.35, -14.2],
    width: 5.6,
    height: 2.75,
    rotationY: 0,
    style: 'screen',
    mount: 'wall',
  },
  boardBlocks: [
    {
      kind: 'formula',
      tex: '\\text{Trabajo de manejo} = \\sum_i \\left(\\text{flujo}_i \\times \\text{distancia}_i\\right)',
      caption: 'Flujo: volumen, peso o cantidad por unidad de tiempo · distancia: metros recorridos.',
      dataKind: 'literature',
      source: 'Heragu y Ekren (s. f.)',
    },
    {
      kind: 'stats',
      items: [
        { value: '3525', label: 'pallet·m/día · distribución A' },
        { value: '1350', label: 'pallet·m/día · distribución B' },
        { value: '−61,7 %', label: 'trabajo de manejo con B' },
      ],
      dataKind: 'hypothetical',
      source: 'Tabla 5 (datos inventados con fines didácticos)',
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'De los diez principios, el del trabajo es el más cuantificable. Se define como el producto del flujo de materiales por la distancia recorrida. Mover el doble de material o recorrer el doble de distancia duplica el trabajo de manejo.',
      dataKind: 'literature',
      source: 'Heragu y Ekren (s. f.)',
    },
    {
      kind: 'table',
      label: 'Tabla 5',
      title: 'Ejemplo hipotético de cálculo del trabajo de manejo en dos distribuciones',
      columns: ['Movimiento', 'Pallets por día', 'Distancia en A (m)', 'Trabajo en A (pallet·m)', 'Distancia en B (m)', 'Trabajo en B (pallet·m)'],
      rows: [
        ['Recepción → Almacén MP', '30', '20', '600', '20', '600'],
        ['Almacén MP → Corte', '30', '60', '1800', '15', '450'],
        ['Corte → Ensamble', '25', '45', '1125', '12', '300'],
        ['Total', '', '', '3525', '', '1350'],
      ],
      note: 'Nota. Datos inventados para fines didácticos. La distribución B reduce el trabajo de manejo en 61,7 % porque acerca las áreas con mayor flujo.',
      dataKind: 'hypothetical',
    },
    {
      kind: 'callout',
      variant: 'idea',
      title: 'Idea clave',
      text: 'Un principio no se memoriza: se aplica. Pida a la audiencia que identifique cuáles principios incumple un taller conocido (pasillos invadidos, retrocesos, material en el piso). Eso conecta con el capítulo 12.',
    },
  ],
  animations: ['flow-distance'],
  references: ['heragu_sf'],
  notes:
    'En el piso se ven las dos distribuciones del ejemplo hipotético de la Tabla 5, en línea y a escala (1 : 10,5). Los mismos pallets por día recorren menos metros en B. Calcular en voz alta un tramo: 30 pallets × 60 m = 1800 pallet·m en A frente a 30 × 15 = 450 en B. Total: 3525 frente a 1350 (−61,7 %). Subrayar que el ejemplo es inventado.',
};

export const casoMarcopolo: SceneDef = {
  id: 'caso-marcopolo',
  chapter: { number: '13', title: 'Casos aplicados en investigaciones' },
  subchapter: { number: '13.1', title: 'Caso 1: gestión del manejo interno en Marcopolo (Brasil)' },
  presenter: 'felipe',
  title: 'Caso 1: Marcopolo (Brasil)',
  zone: 'spine',
  camera: {
    position: [1.5, 4.4, 9.2],
    target: [9.5, 1.6, -1.5],
    fov: 46,
    duration: 3.6,
  },
  board: {
    position: [9.5, 4.5, -4.8],
    width: 6.4,
    height: 3.6,
    pxWidth: 1180,
    style: 'screen',
    mount: 'hanging',
  },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Montacargas saturados, colisiones y esperas en las máquinas. Alquilar dos montacargas más alivió el problema solo en parte. La solución: un tren de arrastre por una ruta que sigue la secuencia de producción, con contenedores nuevos y paradas por estación.',
      dataKind: 'case',
      source: 'Vieira et al. (2011)',
    },
    {
      kind: 'stats',
      title: 'Percepción de 26 clientes internos (escala 1 a 5)',
      items: [
        { value: '3,88', label: 'Seguridad del servicio' },
        { value: '3,58', label: 'Costo' },
        { value: '3,54', label: 'Satisfacción general' },
        { value: '3,50', label: 'Agilidad' },
        { value: '3,35', label: 'Confiabilidad' },
      ],
      dataKind: 'case',
      source: 'Vieira et al. (2011), Tabla 28',
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'Vieira et al. (2011) estudiaron la unidad de Caxias do Sul de Marcopolo S/A, fabricante de carrocerías de buses con más de 2 000 empleados. La empresa separó los flujos en movimientos verticales (cortos y de mucha mano de obra) y horizontales (distancias largas, incluso entre edificios). Para estos últimos, un tractor arrastra una fila de carros pequeños por una ruta que sigue la secuencia de producción. En cada estación se marcó una parada: una señal verde indica que el contenedor está listo y el conductor lo cambia por uno vacío. Se probó un horario fijo, pero faltaba flexibilidad para las urgencias, por lo que el operador del tren lleva un teléfono móvil para los pedidos urgentes.',
      dataKind: 'case',
      source: 'Vieira et al. (2011)',
    },
    {
      kind: 'table',
      label: 'Tabla 28',
      title: 'Percepción de los clientes internos sobre el nuevo sistema (escala 1 a 5, n = 26)',
      columns: ['Dimensión', 'Media', 'Desviación estándar', 'Calificaron 4 o más'],
      rows: [
        ['Seguridad del servicio', '3,88', '0,65', '80,8 %'],
        ['Costo', '3,58', '0,69', '69,2 %'],
        ['Satisfacción general', '3,54', '0,58', '50,0 %'],
        ['Agilidad', '3,50', '0,58', '46,2 %'],
        ['Confiabilidad del servicio', '3,35', '0,75', '38,5 %'],
      ],
      note: 'Nota. Vieira et al. (2011). Orden por media descendente. La muestra es pequeña y los propios autores tratan los valores p del modelo como exploratorios.',
      dataKind: 'case',
    },
    {
      kind: 'stats',
      title: 'Modelo de regresión de la satisfacción general (R² = 0,89)',
      items: [
        { value: '57 %', label: 'peso relativo de la agilidad' },
        { value: '33 %', label: 'peso relativo de la confiabilidad' },
        { value: '10 %', label: 'peso relativo del costo' },
      ],
      dataKind: 'case',
      source: 'Vieira et al. (2011)',
    },
    {
      kind: 'callout',
      variant: 'case',
      title: 'Qué enseña el caso',
      text: 'Se aplican varios principios del curso: flujo de material (ruta según la secuencia de producción), adaptabilidad (teléfono para urgencias) y tamaño unitario (contenedores y carros estandarizados). Más montacargas no resolvió el problema; rediseñar el flujo sí mejoró el servicio.',
    },
  ],
  animations: ['tugger'],
  references: ['vieira2011'],
  notes:
    'El tren de arrastre recorre el pasillo y se detiene en las paradas: la luz verde indica «contenedor listo»; al pasar el tren se apaga (contenedor cambiado). Datos reales: n = 26 clientes internos; la agilidad pesa 57 % en la satisfacción. Mensaje: más montacargas no resolvió el problema; rediseñar el flujo sí. La animación es una representación didáctica, no reproduce la planta real.',
};
