// Escenas de Carlos: capítulos 3, 4 (4.3–4.4) y 5 + caso 2 (Dynea Pakistan).
// La escena 4–4.2 (carga unitaria) está en cargaUnitaria.ts.
// Datos verificados contra docs/extracted/guia_texto.md §3, §4.3–4.4, §5 y §13.2.
import type { SceneDef } from '../types';

export const gradosMecanizacion: SceneDef = {
  id: 'grados-mecanizacion',
  chapter: { number: '3', title: 'Grados de mecanización' },
  presenter: 'carlos',
  title: 'Grados de mecanización',
  zone: 'prep',
  camera: {
    position: [-35, 7.0, -6.6],
    target: [-35, 2.6, -18.6],
    fov: 50,
    duration: 3.6,
  },
  board: {
    position: [-35, 5.25, -21],
    width: 6.8,
    height: 3.1,
    pxWidth: 1360,
    style: 'screen',
    mount: 'hanging',
  },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Cuánto del esfuerzo, de la decisión y del control recae en las personas y cuánto en las máquinas.',
      dataKind: 'course',
    },
    { kind: 'custom', component: 'mechanization-levels' },
  ],
  detailBlocks: [
    {
      kind: 'table',
      label: 'Tabla 6',
      title: 'Descripción y ejemplos de los cinco grados de mecanización',
      columns: ['Grado', 'Descripción', 'Ejemplos'],
      rows: [
        ['Manual', 'Equipo operado manualmente; depende del esfuerzo físico.', 'Carretilla de mano, transpaleta manual, carga a hombro.'],
        ['Mecanizado', 'Se usa fuerza motriz para impulsar el equipo.', 'Grúas, montacargas de horquilla, algunos transportadores.'],
        ['Mecanizado con computadora', 'Los comandos de movimiento y operación los genera una computadora.', 'Sistemas con control programable y sensores.'],
        ['Automatizado', 'Intervención humana mínima para guiar y operar.', 'Vehículos autoguiados, almacenamiento y retiro automatizados.'],
        ['Completamente automatizado', 'Sin intervención humana; las computadoras hacen el control en línea.', 'Almacenes y líneas totalmente robotizados.'],
      ],
      note: 'Nota. Descripciones adaptadas del curso. Los ejemplos del último grado son propios de los autores de la guía.',
      dataKind: 'course',
    },
    {
      kind: 'figure',
      label: 'Figura 5',
      title: 'Grados de mecanización del manejo de materiales',
      src: 'figures/fig05.png',
      note: 'Nota. Elaboración propia a partir del curso. El aumento de inversión y la pérdida de flexibilidad corresponden a las ventajas y desventajas del nivel alto señaladas en la misma fuente.',
    },
  ],
  animations: ['mechanization-levels'],
  references: [],
  notes:
    'Recorrer las cinco estaciones de izquierda a derecha mientras se iluminan: carretilla y transpaleta manual (1), montacargas (2), transportador con control programable y sensores (3), AGV sobre cinta (4) y celda robotizada (5). La flecha del piso resume la Figura 5: más inversión, velocidad y control; menos flexibilidad. Los equipos de la estación 5 son ejemplos propios de los autores.',
};

export const mecanizacionDecision: SceneDef = {
  id: 'mecanizacion-decision',
  chapter: { number: '3', title: 'Grados de mecanización' },
  subchapter: { number: '3.1–3.2', title: 'Ventajas, desventajas y cómo decidir el grado adecuado' },
  presenter: 'carlos',
  title: '¿Cuánto mecanizar?',
  zone: 'prep',
  camera: {
    position: [-32.6, 4.4, -12.2],
    target: [-34.4, 3.6, -21],
    fov: 46,
    duration: 2.2,
  },
  // misma pantalla colgante que la escena anterior (se comparte el soporte físico)
  board: {
    position: [-35, 5.25, -21],
    width: 6.8,
    height: 3.1,
    pxWidth: 1180,
    style: 'screen',
    mount: 'hanging',
  },
  boardBlocks: [
    {
      kind: 'table',
      label: 'Tabla 7',
      title: 'Alto grado de mecanización',
      columns: ['Ventajas', 'Desventajas'],
      rows: [
        ['Aumento de la velocidad de las operaciones de manejo', 'Alto costo de inversión'],
        ['Disminución del tiempo de producción', 'Capacitación del personal de mantenimiento'],
        ['Reducción de la fatiga y mayor seguridad', 'Equipo y personal especializados que reducen la flexibilidad'],
        ['Mejor control del flujo de material', ''],
        ['Menor costo de mano de obra', ''],
        ['Mejor control de registros del inventario', ''],
      ],
      dataKind: 'course',
    },
  ],
  detailBlocks: [
    {
      kind: 'bullets',
      title: 'Cómo decidir el grado adecuado',
      items: [
        'Volumen y repetitividad: a mayor volumen estable, mayor justificación para mecanizar o automatizar.',
        'Variedad de productos: a mayor variedad, más valor tiene la flexibilidad del manejo manual o semimecanizado.',
        'Peso y riesgo ergonómico: las cargas pesadas o repetitivas justifican ayudas mecánicas aun con bajos volúmenes (capítulo 9).',
        'Capital y horizonte de recuperación: una automatización total exige previsibilidad de la demanda.',
        'Capacidades de mantenimiento: sin personal capacitado, el equipo sofisticado queda inactivo.',
        'Distribución disponible: el espacio, las columnas y la altura limitan la solución (capítulo 11).',
      ],
      dataKind: 'synthesis',
      source: 'Propuesta de los autores de la guía, coherente con el curso y Peters (1998)',
    },
    {
      kind: 'callout',
      variant: 'expo',
      title: 'Para la exposición',
      text: 'Evite presentar la automatización como meta final. El criterio de ingeniería es la relación entre beneficio y costo para el volumen y la variedad de esa planta. Una planta pequeña con alta variedad puede obtener mejores resultados con transpaletas eléctricas y buena distribución que con un transportador automatizado.',
    },
  ],
  animations: ['mechanization-levels'],
  references: ['peters1998'],
  notes:
    'Leer la Tabla 7 en pares ventaja/desventaja. Con «C» mostrar los seis criterios de decisión (propuesta de los autores). Mensaje: no existe un grado «correcto» en abstracto; se decide con datos de volumen, variedad, peso, capital, mantenimiento y distribución. Anticipar el caso 5 (AHP-MOORA), donde el equipo más automatizado quedó último.',
};

export const palletsNormalizacion: SceneDef = {
  id: 'pallets-normalizacion',
  chapter: { number: '4', title: 'Carga unitaria' },
  subchapter: { number: '4.3–4.4', title: 'Normalización de pallets y tamaño según la distancia' },
  presenter: 'carlos',
  title: 'Normalización de pallets',
  zone: 'mp',
  camera: {
    position: [-38.85, 3.4, 3.6],
    target: [-38.6, 2.9, 13],
    fov: 50,
    duration: 2.6,
  },
  // pantalla colgante compartida con el caso Dynea
  board: {
    position: [-38.1, 5.3, 13.5],
    width: 5.0,
    height: 2.6,
    pxWidth: 1240,
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
            kind: 'bullets',
            title: 'Normas',
            items: [
              'ISO 6780:2003: dimensiones principales y tolerancias de pallets planos intercontinentales',
              'BS 6884: módulo base de 600 × 400 mm, que incluye el pallet ISO preferido de 1200 × 1000 mm',
              'Pallet europeo 1200 × 800 mm (EN 13698-1); en Norteamérica, 1219 × 1016 mm (48″ × 40″)',
            ],
            dataKind: 'literature',
            source: 'ISO (2003); BSI (s. f.); Mecalux (s. f.); Logistics Cluster (2022)',
          },
        ],
        [
          {
            kind: 'bullets',
            title: 'Tamaño de la carga según la distancia',
            items: [
              'Operaciones adyacentes: cargas pequeñas en distancias cortas',
              'Recorridos largos: cargas grandes que amortizan el viaje',
              'Flujo continuo: cargas pequeñas (menos inventario en proceso y espera)',
            ],
            dataKind: 'literature',
            source: 'Kay (s. f.); Heragu y Ekren (s. f.)',
          },
        ],
      ],
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'Estandarizar las dimensiones del pallet reduce los problemas en todas las etapas de la distribución, desde el manejo inicial hasta el almacenamiento final.',
      dataKind: 'literature',
      source: 'BSI (s. f.)',
    },
    { kind: 'custom', component: 'pallet-sizes' },
    {
      kind: 'figure',
      label: 'Figura 6',
      title: 'Dimensiones en planta de los pallets de ISO 6780, dibujadas a escala',
      src: 'figures/fig06.png',
      note: 'Nota. Elaboración propia a partir de ISO (2003). Las seis dimensiones corresponden a las medidas principales que la norma reconoce.',
    },
    {
      kind: 'lead',
      text: 'La elección del tamaño depende del mercado de destino y del equipo disponible. Para un productor peruano que exporta, el criterio práctico es consultar con el cliente qué base exige; para el mercado interno, el criterio es la compatibilidad con los racks y las montacargas ya instalados.',
      dataKind: 'synthesis',
      source: 'Guía, §4.3',
    },
    {
      kind: 'lead',
      text: 'El tamaño práctico de la carga queda limitado por el equipo, por el espacio de pasillos y por la seguridad.',
      dataKind: 'literature',
      source: 'Kay (s. f.)',
    },
  ],
  animations: ['pallet-sizes'],
  references: ['bsi_sf', 'iso2003', 'mecalux_sf', 'logcluster2022', 'kay_sf', 'heragu_sf'],
  notes:
    'En el piso están los seis pallets de ISO 6780 a escala real. Sobre el europeo (1200 × 800) se marca el módulo de 600 × 400 de BS 6884. Comparar el europeo con el norteamericano (1219 × 1016). Cerrar con la regla de Kay: distancias cortas, cargas pequeñas; recorridos largos, cargas grandes.',
};

export const clasificacionEquipo: SceneDef = {
  id: 'clasificacion-equipo',
  chapter: { number: '5', title: 'Clasificación general del equipo de manejo de materiales' },
  presenter: 'carlos',
  title: 'Clasificación del equipo',
  zone: 'eng',
  camera: {
    position: [40.0, 1.9, -20.6],
    target: [45.3, 1.75, -23],
    fov: 50,
    duration: 3.6,
  },
  board: {
    position: [45.3, 1.8, -23],
    width: 7.2,
    height: 2.8,
    pxWidth: 1580,
    rotationY: -Math.PI / 2,
    style: 'screen',
    mount: 'wall',
  },
  boardBlocks: [
    {
      kind: 'columns',
      ratio: [11, 9],
      columns: [
        [
          {
            kind: 'figure',
            label: 'Figura 7',
            title: 'Clasificación del equipo del curso',
            src: 'figures/fig07.png',
            dataKind: 'course',
          },
        ],
        [{ kind: 'custom', component: 'family-comparison' }],
      ],
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'El curso organiza el equipo en tres familias: transportadores (sin motor: rodillos, ruedas y tolvas; con motor: neumáticos, rodillos y bandas), grúas (fijas: malacate, pluma, puente, pescante, monorriel y montacargas; móviles: plataformas aéreas, mesas elevadoras y elevadores de mantenimiento) y transportes (carros de carga, carros con grúa, carros de mano, montacargas de horquilla, trenes de remolque y vehículos guiados automáticamente). Para el manejo en la propia estación de trabajo añade un cuarto bloque: manual, compensadores y manipuladores, y robots.',
      dataKind: 'course',
    },
    {
      kind: 'table',
      label: 'Tabla 9',
      title: 'Comparación de tres clasificaciones del equipo de manejo',
      columns: ['Función', 'Curso', 'Heragu y Ekren (s. f.)', 'Kay (s. f.)'],
      rows: [
        ['Mover cargas en ruta fija', 'Transportadores', 'Transportadores', 'Transportadores'],
        ['Elevar y trasladar', 'Grúas', 'Polipastos, grúas y plumas', 'Equipo de posicionamiento'],
        ['Mover cargas en ruta libre', 'Transportes', 'Camiones; AGV', 'Equipo de transporte'],
        ['Trabajo en la estación', 'Manual, manipuladores, robots', 'Robots', 'Equipo de posicionamiento'],
        ['Formar la carga', 'Mencionado en carga unitaria', 'Paletizadores', 'Equipo de formación de carga'],
        ['Almacenar', 'Almacenes (contenido del capítulo)', 'Dispositivos de almacén; AVS/RS', 'Equipo de almacenamiento'],
      ],
      note: 'Nota. Elaboración propia de los autores de la guía a partir de las fuentes citadas.',
      dataKind: 'literature',
    },
    {
      kind: 'lead',
      text: 'Los transportadores son dispositivos de ruta fija, más adecuados cuando el volumen de material es grande y el material es bastante uniforme en tamaño y forma. Los camiones o transportes convienen cuando el material varía en tamaño, forma o peso, cuando los volúmenes son bajos y cada pieza necesita pocos viajes.',
      dataKind: 'literature',
      source: 'Heragu y Ekren (s. f.)',
    },
    {
      kind: 'figure',
      label: 'Figura 8',
      title: 'Comparación cualitativa de transportadores, grúas y transportes',
      src: 'figures/fig08.png',
      note: 'Nota. Valoración cualitativa elaborada por los autores de la guía a partir de las ventajas y desventajas de las diapositivas 10 a 15 del curso y de las características descritas por Heragu y Ekren (s. f.). Los valores «Media» y la inversión de transportadores y transportes son interpretación de los autores, no datos medidos.',
    },
    {
      kind: 'callout',
      variant: 'idea',
      title: 'Idea clave',
      text: 'La pregunta no es cuál familia es mejor, sino cuál se ajusta al flujo: volumen alto y estable favorece al transportador; carga pesada en un área definida favorece a la grúa; variedad y rutas cambiantes favorecen al transporte.',
    },
  ],
  animations: [],
  references: ['heragu_sf', 'kay_sf'],
  notes:
    'Presentar las tres familias del curso más el bloque de estación de trabajo (Figura 7) y el semáforo de la Figura 8. Aclarar que la Figura 8 es una valoración cualitativa de los autores de la guía, no datos medidos. Cerrar con la idea clave: la familia se elige según el flujo.',
};

export const casoDynea: SceneDef = {
  id: 'caso-dynea',
  chapter: { number: '13', title: 'Casos aplicados en investigaciones' },
  subchapter: { number: '13.2', title: 'Caso 2: carga unitaria y almacenamiento en Dynea Pakistan' },
  presenter: 'carlos',
  title: 'Caso 2: Dynea Pakistan',
  zone: 'mp',
  camera: {
    position: [-38.1, 3.0, 6.4],
    target: [-38.1, 3.5, 14.4],
    fov: 50,
    duration: 2.8,
  },
  board: {
    position: [-38.1, 5.3, 13.5],
    width: 5.0,
    height: 2.6,
    pxWidth: 1240,
    style: 'screen',
    mount: 'hanging',
  },
  boardBlocks: [
    {
      kind: 'lead',
      text: 'Racks repartidos por igual aunque la demanda era distinta y mal dimensionados para los pallets. Mejora: subir la carga unitaria de 35 a 50 sacos por pallet para aprovechar la altura que sobraba en los racks.',
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
    {
      kind: 'chart',
      chart: 'before-after',
      title: 'Antes y después (Tabla 29 · Figura 17)',
      unit: '%',
      beforeLabel: 'Antes',
      afterLabel: 'Después',
      data: [
        { label: 'Uso del espacio', before: 54, after: 80 },
        { label: 'Uso de contenedores', before: 84, after: 92 },
        { label: 'Utilización del equipo', before: 54, after: 77 },
        { label: 'Eficiencia del ciclo', before: 62, after: 74 },
      ],
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
  ],
  detailBlocks: [
    {
      kind: 'lead',
      text: 'Waseem et al. (2021) analizaron la línea de polvo de moldeo de Dynea Pakistan Limited, una planta que produce formaldehído y compuestos de urea y melamina. Encontraron varios problemas: el espacio de los racks se repartía por igual entre productos aunque la demanda era distinta, los racks no estaban dimensionados para los pallets y dejaban espacio perdido, los montacargas hacían viajes innecesarios, la calidad se revisaba solo al final, gran parte del flujo de información era en papel y faltaba mantenimiento preventivo del equipo. Además, el producto se pegaba a las ruedas de las carretillas y aumentaba el esfuerzo de empuje.',
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
    {
      kind: 'bullets',
      title: 'Mejoras aplicadas',
      items: [
        'Subir la carga unitaria de 35 a 50 sacos por pallet para aprovechar la altura que sobraba en los racks.',
        'Asignar cada uno de los tres montacargas a dos plantas, con uno dedicado a carga y descarga.',
        'Ajustar la altura del producto en los contenedores para usar menos contenedores.',
        'Hacer la molienda y la trituración en paralelo para eliminar tiempos muertos.',
        'Un trabajador de pesaje asumió además el cosido; el personal de manejo pasó de cuatro a tres personas.',
        'Factores humanos: se evaluaron fuerza, posturas forzadas y repetitividad, y se recomendó una interfaz de empuje y tracción.',
      ],
      dataKind: 'case',
      source: 'Waseem et al. (2021)',
    },
    {
      kind: 'table',
      label: 'Tabla 29',
      title: 'Resultados del caso Dynea Pakistan (antes y después)',
      columns: ['Indicador', 'Antes', 'Después'],
      rows: [
        ['Uso del espacio de almacén', '54 %', '80 %'],
        ['Uso de contenedores', '84 %', '92 %'],
        ['Utilización del equipo de manejo', '0,54', '0,77'],
        ['Eficiencia del ciclo de manufactura', '62 %', '74 %'],
        ['Costo del montacargas por distancia', 'Rs 0,43/m', 'Rs 0,34/m'],
      ],
      note: 'Nota. Waseem et al. (2021). El resumen del artículo habla de 15 % de mejora en la eficiencia del ciclo, pero el cuerpo reporta 62 % a 74 % (12 puntos porcentuales); se usan los valores del cuerpo. En el gráfico, la utilización del equipo (0,54 → 0,77) se expresa en porcentaje, como en la Figura 17 de la guía.',
      dataKind: 'case',
    },
    {
      kind: 'callout',
      variant: 'case',
      title: 'Qué enseña el caso',
      text: 'La carga unitaria (35 a 50 sacos por pallet) y la utilización del espacio (54 % a 80 %) mejoraron sin comprar equipo nuevo: bastó ajustar medidas y rutas. El manejo se evalúa con indicadores simples (uso del espacio, uso del equipo, costo por distancia), como los del capítulo 12.',
    },
  ],
  animations: ['dynea-rack'],
  references: ['waseem2021'],
  notes:
    'En el rack: a la izquierda, el pallet de 35 sacos deja espacio sin usar bajo el larguero; a la derecha se completa hasta 50 sacos y aprovecha la altura. La disposición de los sacos por capa es ilustrativa: el artículo solo reporta la cantidad de sacos. Resultado real: uso del espacio de 54 % a 80 % sin comprar equipo. Mencionar la inconsistencia del artículo (15 % vs 12 p. p.).',
};
