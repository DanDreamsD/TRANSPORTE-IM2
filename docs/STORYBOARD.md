# STORYBOARD — Recorrido de la presentación

33 escenas principales (configurables en `src/content/sceneRegistry.ts`). Duración objetivo de la exposición:
≈ 45–55 min (≈ 9–11 min por integrante). Estado: ✅ implementada en el MVP · ⏳ planificada.

Leyenda de datos: **[C]** curso (Castañeda, 2026) · **[L]** literatura · **[R]** caso real de investigación ·
**[H]** ejemplo hipotético · **[S]** síntesis de los autores de la guía.

## Mapa de escenas

| # | ID | Cap. | Integrante | Título | Zona | Demo | Estado |
|---|---|---|---|---|---|---|---|
| 1 | `portada` | — | Equipo | NOVATEK · Material Flow | Vista aérea | flujo (1) | ✅ |
| 2 | `definicion-alcance` | 1.1 | Felipe | Definición y alcance | Vista aérea baja | flujo (1) | ✅ |
| 3 | `mover-materiales` | 1.2 | Felipe | Qué implica mover materiales | Recepción | descarga camión | ✅ |
| 4 | `objetivos-costos` | 1.3–1.5 | Felipe | Objetivos y costo del manejo | Sala de gestión | — | ✅ |
| 5 | `principios` | 2.1–2.2 | Felipe | Los principios del manejo | Oficina de ingeniería | — | ✅ |
| 6 | `trabajo-flujo-distancia` | 2.3 | Felipe | Principio del trabajo: flujo × distancia | Diagrama en piso | cálculo flujo-distancia (13) | ✅ |
| 7 | `caso-marcopolo` | 13.1 | Felipe | Caso 1: Marcopolo (Brasil) | Pasillo central | tren de arrastre | ✅ |
| 8 | `grados-mecanizacion` | 3 | Carlos | Grados de mecanización | Preparación | comparación de grados (2) | ✅ |
| 9 | `mecanizacion-decision` | 3.1–3.2 | Carlos | Ventajas, desventajas y decisión | Preparación | — | ✅ |
| 10 | `carga-unitaria` | 4–4.2 | Carlos | La carga unitaria | Almacén MP | formación de carga unitaria (3) | ✅ |
| 11 | `pallets-normalizacion` | 4.3–4.4 | Carlos | Normalización de pallets | Almacén MP | pallets ISO a escala (4) | ✅ |
| 12 | `clasificacion-equipo` | 5 | Carlos | Clasificación del equipo | Oficina de ingeniería | — | ✅ |
| 13 | `caso-dynea` | 13.2 | Carlos | Caso 2: Dynea Pakistan | Almacén MP | rack 35→50 sacos | ✅ |
| 14 | `transportadores` | 6–6.1 | Vane | Transportadores | Línea de ensamble | transportador (5) | ✅ |
| 15 | `transportadores-criterios` | 6.2–6.3 | Vane | Ventajas, desventajas y criterios | Línea de ensamble | falla de línea | ✅ |
| 16 | `gruas` | 7–7.1 | Vane | Grúas, polipastos y montacargas fijos | Procesamiento | grúas y polipastos (6) | ✅ |
| 17 | `gruas-servicio` | 7.2–7.3 | Vane | Clasificación por servicio | Procesamiento | — | ✅ |
| 18 | `caso-agv-asientos` | 13.4 | Vane | Caso 4: AGV en planta de asientos | Línea de asientos | 2 AGV con cinta | ✅ |
| 19 | `transportes-montacargas` | 8–8.2 | Nicole | Transportes y montacargas | Pasillo / Almacén MP | montacargas (7) | ✅ |
| 20 | `agv-amr` | 8.3 | Nicole | Del AGV al AMR | Pasillo central | AGV vs AMR (8) | ✅ |
| 21 | `niosh` | 9.1 | Nicole | Ecuación de levantamiento NIOSH | Estación manual | levantamiento + calculadora (10) | ✅ |
| 22 | `estacion-robots` | 9.2–9.4 | Nicole | Compensadores, robots y automatización fija | Celda robótica | brazo robótico (9) | ✅ |
| 23 | `caso-schrock` | 13.3 | Nicole | Caso 3: Schrock Cabinet (EE. UU.) | Despacho | carga manual de camión | ✅ |
| 24 | `recepcion-almacenamiento` | 10.1–10.2 | Nicole | Recepción, envío y almacenamiento | Almacén PT | — | ✅ |
| 25 | `asrs` | 10.3 | Nicole | AS/RS | Almacén automatizado | SRM (11) | ✅ |
| 26 | `distribucion-manejo` | 11.1 | Wilson | Distribución y manejo: dos sistemas | Vista aérea | comparación de distribuciones (12) | ⏳ |
| 27 | `seleccion-equipo` | 11.2–11.3 | Wilson | Selección del equipo y puntuación ponderada | Oficina de ingeniería | puntuación interactiva | ⏳ |
| 28 | `caso-ahp-moora` | 13.5 | Wilson | Caso 5: AHP y MOORA (Turquía) | Oficina de ingeniería | — | ⏳ |
| 29 | `analisis-diseno` | 12.1–12.3 | Wilson | Analizar y diseñar el sistema | Recorrido de síntomas | marcadores de síntomas | ⏳ |
| 30 | `justificacion-economica` | 12.4–12.5 | Wilson | Justificación económica | Sala de gestión | evaluación económica (14) | ⏳ |
| 31 | `lecciones-casos` | 13, 13.6 | Wilson | Lecciones de los cinco casos | Sala de reuniones | — | ⏳ |
| 32 | `tendencias-conclusiones` | 14 | Wilson | Tendencias y conclusiones | Vuelo final | flujo (1) | ⏳ |
| 33 | `cierre-preguntas` | 15–16 | Equipo | Preguntas, glosario y referencias | Vista aérea | — | ⏳ |

## Detalle por escena

### 1 · `portada` — Equipo ✅
- **Cámara:** aérea suroeste, alta (≈ −62, 52, 70) → objetivo centro de planta; FOV 40.
- **En el entorno:** planta completa, flecha animada del flujo de material, letrero 3D NOVATEK.
- **Interfaz:** título, curso, docente, integrantes, institución y fecha (fuente: portada de la guía).
- **Notas:** presentar la empresa ficticia y el recorrido: «cada tema es un lugar de la planta».

### 2 · `definicion-alcance` — Felipe (1.1) ✅
- **Cámara:** desde recepción, bajo la estructura del techo, hacia la pantalla colgante; la flecha del flujo de material
  recorre el piso. **Pantalla:** definición del curso vs MHIA + Figura 1. **Complementario:** Tabla 1 completa **[C] [L]**.

### 3 · `mover-materiales` — Felipe (1.2) ✅
- **Recepción:** muelle con la puerta abierta; un montacargas saca un pallet del remolque, gira, lo deja en la zona de
  preparación y vuelve (ciclo de 15 s). Etiquetas: carga/descarga, movimiento horizontal, movimiento vertical.
  Pizarra en el muro entre muelles: los 5 elementos del movimiento + flujo discreto/continuo (Kay) **[C] [L]**.

### 4 · `objetivos-costos` — Felipe (1.3–1.5) ✅
- **Sala de gestión:** pantalla mural con los 6 objetivos y la Figura 2 recreada (20–50 % costo del producto; 20–25 %
  mano de obra; ≈10 % costo de fábrica; 80–95 % tiempo). **Complementario:** Tabla 2 (indicadores **[S]**), cifras de
  Groover, Datar y Saputro, «Para la exposición» y ventajas §1.5.

### 5 · `principios` — Felipe (2.1–2.2) ✅
- **Oficina de ingeniería:** pizarra mural con las 10 tarjetas de principios MHIA/CICMHE (síntesis de la Figura 3,
  «Trabajo» destacado). **Complementario:** Tablas 3 y 4 (correspondencia **[S]**) y Figura 3 original.

### 6 · `trabajo-flujo-distancia` — Felipe (2.3) ✅
- **Vista elevada:** diagrama en el piso frente a ingeniería con las distribuciones A y B en línea y a escala
  (1 : 10,5); franjas con ancho ∝ flujo y cargas en movimiento; trabajo por tramo y totales 3525 / 1350 pallet·m/día.
  Pantalla: fórmula KaTeX + indicadores (−61,7 %) **[H]**. La geometría lineal es esquemática.

### 7 · `caso-marcopolo` — Felipe (13.1) ✅
- **Pasillo central:** tren de arrastre (tractor + 4 carros) en circuito con 3 paradas; luz verde = contenedor listo,
  se apaga al cambiarlo. Pantalla colgante: problema/intervención + medias de la Tabla 28 (n = 26) **[R]**.
  **Complementario:** Tabla 28 completa, regresión R² = 0,89 (57/33/10 %) y «Qué enseña el caso».

### 8 · `grados-mecanizacion` — Carlos (3) ✅
- **Preparación:** cinco estaciones en fila sobre placas de color (carretilla de mano y transpaleta → montacargas →
  transportador con PLC y sensor → AGV sobre cinta magnética → celda robotizada). Se iluminan en secuencia, sincronizadas
  con la escalera de la Figura 5 en la pantalla colgante; flecha en el piso «más inversión… menos flexibilidad» **[C]**.

### 9 · `mecanizacion-decision` — Carlos (3.1–3.2) ✅
- Misma pantalla colgante (soporte compartido) con la Tabla 7 **[C]**; cámara más cercana al extremo automatizado.
  **Complementario:** seis criterios de decisión **[S]** y «Para la exposición».

### 10 · `carga-unitaria` — Carlos (4–4.2) ✅
- **Cámara:** pasillo central frente al almacén MP, mirando al sur hacia los racks; FOV 45.
- **Demo 3:** 18 cajas caen una a una sobre un pallet en 3 capas → film estirable → contador «18 manipulaciones → 1».
- **Pizarra:** definición del curso + condición de integridad (Kay), objetivos (§4.1), factores (Tabla 8).
- **Complementario:** Tabla 8 completa, idea clave, avance del caso Dynea (35 → 50 sacos; 54 % → 80 %) **[R]**.

### 11 · `pallets-normalizacion` — Carlos (4.3–4.4) ✅
- **Demo 4:** seis pallets ISO 6780 a escala real en el piso del almacén MP, de izquierda a derecha (1200×800,
  1200×1000, 1219×1016, 1140×1140, 1100×1100, 1067×1067) con el módulo 600×400 (BS 6884) marcado sobre el europeo.
  Pantalla colgante (compartida con el caso Dynea): normas y tamaño de carga según distancia **[L]**.

### 12 · `clasificacion-equipo` — Carlos (5) ✅
- **Oficina de ingeniería, muro este:** Figura 7 (imagen) + semáforo de la Figura 8 recreado **[S]**.
  **Complementario:** descripción del curso, Tabla 9, criterio de Heragu y Ekren, Figura 8 original e idea clave.

### 13 · `caso-dynea` — Carlos (13.2) ✅
- **Rack del almacén MP (nivel 1, vanos 1–2):** a la izquierda el pallet de 35 sacos con el espacio sin usar marcado;
  a la derecha se completan capas hasta 50 sacos. Pantalla: problema/mejora + Tabla 29 en gráfico (como la Figura 17) **[R]**.
  Disposición de sacos por capa ilustrativa; nota de inconsistencia (12 p. p. vs 15 %).

### 14 · `transportadores` — Vane (6–6.1) ✅
- **Cámara:** junto a la línea de ensamble, vista diagonal del transportador; FOV 42.
- **Demo 5:** transportador de rodillos motorizado (motor-reductor, cadena) que alimenta un tramo de rodillos por
  gravedad con acumulación y sensor fotoeléctrico; velocidad ajustable desde el panel.
- **Pizarra:** definición, sin motor/con motor **[C]**, taxonomía CICMHE (Tabla 10) **[L]**.
- **Complementario:** Tabla 10 completa y Tabla 11 (ventajas/desventajas) **[C]**.

### 15 · `transportadores-criterios` — Vane (6.2–6.3) ✅
- Misma línea vista desde el extremo por gravedad. Ciclo de 16 s: el motor falla de 4 a 12 s (baliza roja, el tramo
  motorizado se detiene y la gravedad termina de vaciarse). Pantalla compartida: Tabla 11 **[C]**;
  complementario: las 5 preguntas de selección **[S]**.

### 16 · `gruas` — Vane (7–7.1) ✅
- **Procesamiento, vista desde el este:** grúa puente con polipasto que iza una bobina y la traslada (ciclo de 24 s),
  grúa pluma giratoria y monorriel en ruta fija, cada una etiquetada. Pantalla colgante: definición + Figura 9;
  complementario: Tabla 12 **[C] [L]**. El pórtico solo se muestra en la Figura 9.

### 17 · `gruas-servicio` — Vane (7.2–7.3) ✅
- Misma pantalla, cámara cercana: Tabla 13 **[C]** + clasificación CMAA A–F e ISO 4301-1 A1–A8 **[L]**;
  complementario: factores de selección, grúa como recurso subutilizado e idea clave.

### 18 · `caso-agv-asientos` — Vane (13.4) ✅
- **Línea de asientos:** 2 AGV en un circuito de cinta magnética con paradas simétricas (almacén de componentes con
  carga en el piso / fin de línea). Pantalla compartida: contexto + Figura 19 recreada con la Tabla 30 (≈ 7,4 meses;
  los autores reportan ~8) **[R]**; nota de inconsistencias del artículo.

### 19 · `transportes-montacargas` — Nicole (8–8.2) ✅
- **Almacén PT:** el montacargas retira un pallet del nivel 1 del rack y lo vuelve a guardar (ciclo de 24 s), con el
  pasillo de maniobra marcado. Pizarra: definición + Tabla 14 **[C]**; complementario: Tabla 15 (7 clases OSHA) **[L]**.

### 20 · `agv-amr` — Nicole (8.3) ✅
- **Pasillo central:** el AGV sigue su cinta y se detiene ante un pallet olvidado (campo del escáner en rojo) hasta que
  despejan la ruta; el AMR replanifica y lo rodea (ruta en cian). Pantalla: comparación sincronizada con la demo;
  complementario: Tabla 16, Figura 10 **[L]**.

### 21 · `niosh` — Nicole (9.1) ✅
- **Estación manual:** el operario levanta una caja de V a V + D a la distancia H. Calculadora en el panel de la demo
  (peso, H, V, D, A; FM = CM = 1,00) sincronizada con la pizarra y la etiqueta 3D; botones «Ejemplo (Tabla 18)» →
  RWL 12,8 kg, LI 1,17 y «Rediseño H = 25» → 20,5 kg, LI 0,73 **[H]**.

### 22 · `estacion-robots` — Nicole (9.2–9.4) ✅
- **Estaciones manuales:** transferencia sincrónica de 5 estaciones, compensador con operario que guía la carga y celda
  con brazo robótico (EOAT de pinza). Pantalla colgante: Tabla 19 **[S]**; complementario: textos del curso e idea clave.

### 23 · `caso-schrock` — Nicole (13.3) ✅
- **Despacho, muelle este abierto:** un operario lleva gabinetes a mano desde el almacenamiento temporal al remolque.
  Pizarra mural: contexto + FILI 0,7–6,0, índice compuesto 3,9–8,2, 79 % con dolor (15/19) **[R]**; complementario:
  Figura 18 y recomendaciones de NIOSH.

### 24 · `recepcion-almacenamiento` — Nicole (10.1–10.2) ✅
- Pantalla colgante frente al almacén PT con la Tabla 20 **[S]**; complementario: marco de Hassan (2010) y §10.2.

### 25 · `asrs` — Nicole (10.3) ✅
- **Vista a lo largo del pasillo del AS/RS:** la SRM recorre el pasillo, sube el carro a 5,4 m, extrae el pallet, lo
  entrega en la estación de entrada/salida y lo vuelve a guardar (ciclo de 36 s). Pantalla: definición + Figura 12;
  complementario: Tabla 21 **[L]**.

### 26 · `distribucion-manejo` — Wilson (11.1)
- **Demo 12:** comparación de distribuciones (espina vs desordenada) proyectada sobre la planta; Figura 13 **[C]**; SLP (Muther).

### 27 · `seleccion-equipo` — Wilson (11.2–11.3)
- Pantalla con Tabla 22 y puntuación ponderada interactiva (Tabla 24: 3,40 / 3,90 / 3,45) con análisis de sensibilidad **[H]**.

### 28 · `caso-ahp-moora` — Wilson (13.5)
- Pesos AHP (Tabla 31) y ranking MOORA **[R]**.

### 29 · `analisis-diseno` — Wilson (12.1–12.3)
- Marcadores de síntomas sobre la planta (Figura 14, Tabla 25); procedimiento de diseño (Figura 15) **[C] [S]**.

### 30 · `justificacion-economica` — Wilson (12.4–12.5)
- **Demo 14:** flujo de caja acumulado interactivo (Tabla 26, Figura 16: S/ 120 000; S/ 40 000/año → PRI 3 años,
  ROI 33,3 %) **[H]**; limitación: sin valor del dinero en el tiempo (VAN, TIR).

### 31 · `lecciones-casos` — Wilson (13, 13.6)
- Tabla 27 y Tabla 32 en la pantalla de la sala de reuniones **[R] [S]**.

### 32 · `tendencias-conclusiones` — Wilson (14)
- Vuelo final por el recorrido del material; tendencias (§14.1) y conclusiones (§14.2).

### 33 · `cierre-preguntas` — Equipo (15–16)
- Banco de preguntas (Tabla 34), glosario (Tabla 35) y referencias APA.
