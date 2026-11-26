# CONTENT_MATRIX — Guía ↔ escenas ↔ recursos

Vincula cada capítulo/subcapítulo de `Guia_Manejo_de_Materiales.docx` con escenas, tablas, figuras, demos y referencias.
Tipo de dato: **C** curso (Castañeda, 2026) · **L** literatura · **R** caso real · **H** hipotético · **S** síntesis de autores.

Figuras: archivo `public/figures/figNN.png` (extraídas de `docs/extracted/media/imgNN_*.png`).

| Cap. | Subcapítulo | Escena(s) | Tablas | Figuras | Demo | Datos | Referencias (IDs) |
|---|---|---|---|---|---|---|---|
| — | Portada, reparto | `portada` | 33 | — | 1 Flujo | — | castaneda2026 |
| 1 | 1.1 Definición y alcance | **`definicion-alcance`** ✅ | 1 | 1 | 1 Flujo | C, L | castaneda2026, groover2008, white_sf |
| 1 | 1.2 Qué implica mover materiales | **`mover-materiales`** ✅ | — | — | descarga | C, L | castaneda2026, kay_sf |
| 1 | 1.3 Objetivos | **`objetivos-costos`** ✅ | 2 | — | — | C, S | castaneda2026 |
| 1 | 1.4 Manejo eficiente (costos) | **`objetivos-costos`** ✅ | — | 2 | — | C, L | castaneda2026, tompkins2010, groover2008, datar1991, saputro2015 |
| 1 | 1.5 Ventajas | **`objetivos-costos`** ✅ | — | — | — | C | castaneda2026 |
| 2 | 2.1 Veinte principios | **`principios`** ✅ | 3 | — | — | C, S | castaneda2026, meyers2006, tompkins2010 |
| 2 | 2.2 Diez principios MHIA/CICMHE | **`principios`** ✅ | 4 | 3 | — | L, S | heragu_sf, kay_sf |
| 2 | 2.3 Flujo por distancia | **`trabajo-flujo-distancia`** ✅ | 5 | 4 | 13 Flujo-distancia | L, H | heragu_sf |
| 3 | 3 Grados de mecanización | **`grados-mecanizacion`** ✅ | 6 | 5 | 2 Grados | C | castaneda2026 |
| 3 | 3.1 Ventajas/desventajas | **`mecanizacion-decision`** ✅ | 7 | — | — | C | castaneda2026 |
| 3 | 3.2 Decidir el grado | **`mecanizacion-decision`** ✅ | — | — | — | S | castaneda2026, peters1998 |
| 4 | 4 / 4.1 Objetivos y ventajas | **`carga-unitaria`** ✅ | — | — | **3 Carga unitaria** ✅ | C, L | castaneda2026, kay_sf |
| 4 | 4.2 Factores | **`carga-unitaria`** ✅ | 8 | — | — | C, S | castaneda2026 |
| 4 | 4.3 Normalización de pallets | **`pallets-normalizacion`** ✅ | — | 6 | 4 Pallets ISO | L | bsi_sf, iso2003, mecalux_sf, logcluster2022 |
| 4 | 4.4 Tamaño según distancia | **`pallets-normalizacion`** ✅ | — | — | — | L | kay_sf, heragu_sf |
| 5 | 5.1 Clasificación del curso | **`clasificacion-equipo`** ✅ | — | 7 | — | C | castaneda2026 |
| 5 | 5.2 Clasificación académica | **`clasificacion-equipo`** ✅ | 9 | — | — | L | heragu_sf, kay_sf |
| 5 | 5.3 Comparación de familias | **`clasificacion-equipo`** ✅ | — | 8 | — | S | castaneda2026, heragu_sf |
| 6 | 6 / 6.1 Tipos de transportadores | **`transportadores`** ✅ | 10 | — | **5 Transportador** ✅ | C, L | castaneda2026, cicmhe_sf |
| 6 | 6.2 Ventajas y desventajas | **`transportadores`** ✅ (compl.), **`transportadores-criterios`** ✅ | 11 | — | falla de línea | C | castaneda2026 |
| 6 | 6.3 Criterios | **`transportadores-criterios`** ✅ | — | — | — | S | — |
| 7 | 7.1 Tipos de grúas | **`gruas`** ✅ | 12 | 9 | 6 Grúas | C, L | castaneda2026, fabricator_sf, cmco_sf, mmh_sf_b |
| 7 | 7.2 Clasificación por servicio | **`gruas-servicio`** ✅ | — | — | — | L | fabricator_sf, designingbuildings_sf |
| 7 | 7.3 Ventajas y desventajas | **`gruas-servicio`** ✅ | 13 | — | — | C | castaneda2026, fabricator_sf |
| 8 | 8.1 Ventajas y desventajas | `transportes-montacargas` | 14 | — | 7 Montacargas | C | castaneda2026 |
| 8 | 8.2 Clases de camiones | `transportes-montacargas` | 15 | — | — | L | osha_sf_a |
| 8 | 8.3 AGV → AMR | `agv-amr` | 16 | 10 | 8 AGV vs AMR | L | heragu_sf, mmh_sf_a, keith2024, fragapane2021, roodbergen2009 |
| 9 | 9.1 NIOSH | `niosh` | 17, 18 | 11 | 10 NIOSH | L, H | cdc_sf, waters1993, waters2021, osha_sf_b, niosh1996 |
| 9 | 9.2 Compensadores | `estacion-robots` | — | — | — | C | castaneda2026 |
| 9 | 9.3 Robots y EOAT | `estacion-robots` | 19 | — | 9 Brazo robótico | C, S | castaneda2026 |
| 9 | 9.4 Automatización fija | `estacion-robots` | — | — | — | C | castaneda2026 |
| 10 | 10.1 Equipo por zona | `recepcion-almacenamiento` | 20 | — | — | S | hassan2010, heragu_sf, castaneda2026 |
| 10 | 10.2 Almacenamiento | `recepcion-almacenamiento` | — | — | — | L | kay_sf, peters1998 |
| 10 | 10.3 AS/RS | `asrs` | 21 | 12 | 11 AS/RS | L | roodbergen2009, mmh_sf_c, azadeh2019 |
| 11 | 11.1 Dos sistemas | `distribucion-manejo` | — | 13 | 12 Distribuciones | C, L | castaneda2026, muther1973, tompkins2010 |
| 11 | 11.2 Factores de selección | `seleccion-equipo` | 22, 23 | — | — | C, L | castaneda2026, peters1998, hassan2010, saputro2015, chakraborthy2006, chan2001, kulak2005 |
| 11 | 11.3 Puntuación ponderada | `seleccion-equipo` | 24 | — | puntuación interactiva | H | — |
| 12 | 12.1 Pasos | `analisis-diseno` | — | — | — | C | castaneda2026 |
| 12 | 12.2 Sistema existente | `analisis-diseno` | 25 | 14 | marcadores | C, S | castaneda2026 |
| 12 | 12.3 Nuevo sistema | `analisis-diseno` | — | 15 | — | C | castaneda2026 |
| 12 | 12.4 Justificación económica | `justificacion-economica` | 26 | 16 | 14 Económica | C, H | castaneda2026 |
| 12 | 12.5 Ejemplo integrado | `justificacion-economica` | — | — | — | H | — |
| 13 | Intro + Tabla 27 | `lecciones-casos` | 27 | — | — | R | (5 casos) |
| 13 | 13.1 Marcopolo | **`caso-marcopolo`** ✅ | 28 | — | tren de arrastre | R | vieira2011 |
| 13 | 13.2 Dynea Pakistan | **`caso-dynea`** ✅ (+ avance en `carga-unitaria`) | 29 | 17 | rack 35→50 | R | waseem2021 |
| 13 | 13.3 Schrock Cabinet | `caso-schrock` | — | 18 | carga manual | R | niosh1996 |
| 13 | 13.4 AGV asientos | **`caso-agv-asientos`** ✅ | 30 | 19 | 2 AGV | R | kubasakova2024 |
| 13 | 13.5 AHP-MOORA | `caso-ahp-moora` | 31 | — | — | R | satoglu2021 |
| 13 | 13.6 Lecciones | `lecciones-casos` | 32 | — | — | S | — |
| 14 | 14.1 Tendencias | `tendencias-conclusiones` | — | — | 1 Flujo | C, L | castaneda2026, keith2024, fragapane2021, azadeh2019, roodbergen2009, cdc_sf, saputro2015 |
| 14 | 14.2 Conclusiones | `tendencias-conclusiones` | — | — | — | S | — |
| 15 | Preguntas de repaso | `cierre-preguntas` | 34 | — | — | S | — |
| 16 | Glosario | `cierre-preguntas` | 35 | — | — | S | — |

## Cobertura de demostraciones solicitadas

| # | Demostración | Escena | Estado |
|---|---|---|---|
| 1 | Flujo de materiales recepción → despacho | `portada`, `definicion-alcance`, `tendencias-conclusiones` | ✅ (flecha animada en piso) |
| 2 | Grados de mecanización | **`grados-mecanizacion`** ✅ | ⏳ |
| 3 | Formación de cargas unitarias | `carga-unitaria` | ✅ |
| 4 | Dimensiones y normalización de pallets | **`pallets-normalizacion`** ✅ | ⏳ |
| 5 | Funcionamiento de transportadores | `transportadores` | ✅ |
| 6 | Grúas y polipastos | **`gruas`** ✅ | ⏳ |
| 7 | Montacargas | `transportes-montacargas` | ⏳ |
| 8 | AGV vs AMR | `agv-amr` | ⏳ |
| 9 | Brazos robóticos | `estacion-robots` | ⏳ |
| 10 | Levantamiento manual / NIOSH | `niosh` | ⏳ |
| 11 | AS/RS | `asrs` | ⏳ |
| 12 | Comparación de distribuciones | `distribucion-manejo` | ⏳ |
| 13 | Cálculo flujo × distancia | **`trabajo-flujo-distancia`** ✅ | ⏳ |
| 14 | Evaluación económica | `justificacion-economica` | ⏳ |

Demos adicionales implementadas: descarga en recepción (`mover-materiales`), tren de arrastre (`caso-marcopolo`) rack 35 → 50 sacos (`caso-dynea`), falla de línea (`transportadores-criterios`) y circuito de 2 AGV (`caso-agv-asientos`).

## Observaciones académicas detectadas en la guía

1. **Reparto de casos:** la Tabla 33 asigna el caso 4 (AGV) a Vane y el caso 3 (NIOSH) a Nicole, aunque el tema AGV
   (cap. 8) es de Nicole y NIOSH (cap. 9) también. Se respeta el reparto de la Tabla 33; confirmar con el grupo.
2. **Wilson** expone «casos aplicados (cap. 13)» y el caso 5: se le asignan la introducción (Tabla 27), el caso 5 y las
   lecciones comunes (13.6); los casos 1–4 los presenta el integrante afín (recuadro final del cap. 13).
3. **Inconsistencias de fuentes señaladas por la guía:** Dynea (15 % en resumen vs 62 → 74 % en el cuerpo);
   Kubasáková (3 vs 4 operarios; ahorro EUR 24 824 no concuerda). Se muestran como nota, sin corregir.
4. Pesos AHP del caso 5 se leen de una figura del artículo (no tabulados) — mostrarlo en la nota.
5. Las ideas centrales de la Tabla 3 son síntesis de los autores: deben contrastarse antes de citarlas textualmente.
