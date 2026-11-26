# ASSET_LIST — Inventario de recursos

Política: **todo local**, sin descargas en tiempo de ejecución. Versión 1 = geometría procedural (three.js).
Cada equipo procedural vive en `src/world/equipment/` y acepta reemplazo por GLB/GLTF en `public/models/`
(convención: `public/models/<equipo>.glb`, cargado con `useGLTF` de drei y *preload* opcional). Antes de incorporar
un modelo externo se debe verificar y registrar su licencia en la tabla §5.

## 1. Modelos 3D (procedurales)

| Equipo | Componente | Zona | Escena(s) | Técnica | Estado |
|---|---|---|---|---|---|
| Nave: piso, muros, cerchas, columnas | `world/Building.tsx` | Toda | Todas | Mallas + instanciación (columnas, cerchas) | ✅ MVP |
| Señalización horizontal (franjas, flechas, pasos) | `world/FloorMarkings.tsx` | Toda | Todas | Planos instanciados | ✅ MVP |
| Letreros de zona colgantes | `world/ZoneSigns.tsx` | Toda | Todas | Mallas + HTML ligero | ✅ MVP |
| Tuberías aéreas y luminarias | `world/Building.tsx` | Toda | Todas | Cilindros instanciados | ✅ MVP |
| Pallet (EUR / ISO configurable) | `equipment/Pallet.tsx` | MP, PT | 10, 11, 13 | Cajas (tablas + tacos) | ✅ MVP |
| Rack selectivo | `equipment/Rack.tsx` | MP, PT | 10, 13, 19 | Instanciado (puntales, largueros) | ✅ MVP |
| Caja de cartón | `equipment/CartonBox` (en demos) | Varias | 10, 14 | Instanciado | ✅ MVP |
| Transportador de rodillos motorizado | `equipment/RollerConveyor.tsx` | Línea | 14, 15 | Rodillos instanciados, bastidor, motor-reductor | ✅ MVP |
| Transportador de rodillos por gravedad | `equipment/RollerConveyor.tsx` (variant) | Línea | 14 | Igual, con inclinación | ✅ MVP |
| Sensor fotoeléctrico | en demo transportador | Línea | 14 | Mallas + haz emisivo | ✅ MVP |
| Montacargas contrabalanceado | `equipment/Forklift.tsx` | REC, MP | 3, 19 | Mallas compuestas; refs para posición y altura de horquillas | ✅ (animado en escena 3) |
| Camión con remolque | `equipment/Machines.tsx` (`Trailer`) | REC, DESP | 3, 23 | Mallas; muelles abiertos en z = 6 (oeste) y z = 26 (este) | ✅ |
| Transpaleta / carretilla de mano | `equipment/Vehicles.tsx` (`PalletJack`, `HandCart`) | PREP | 8 | Mallas | ✅ |
| Grúa puente + polipasto | `demos/CranesDemo.tsx` | PROC | 16, 17 | Rieles, puente, carro y gancho animados; bobina | ✅ |
| Grúa pluma / monorriel | `demos/CranesDemo.tsx` | PROC | 16, 17 | Brazo giratorio y polipasto en riel, animados (pórtico solo en Figura 9) | ✅ |
| AGV (cinta magnética) | `equipment/Vehicles.tsx` (`AgvModel`) | PREP, línea, pasillo | 8, 18, 20 | Mallas; ref para mover | ✅ modelo (usado en escena 8) |
| AMR (plataforma, LiDAR) | `demos/AgvAmrDemo.tsx` | Pasillo | 20 | Mallas + LiDAR giratorio y ruta planificada | ✅ |
| Tren de arrastre (tugger) | `demos/TuggerDemo.tsx` | Pasillo | 7 | Tractor + 4 carros sobre curva cerrada, paradas con señal | ✅ |
| Brazo robótico + EOAT | `equipment/RobotArm.tsx` | PREP, MAN | 8, 22 | Jerarquía de articulaciones; ciclo pick-and-place; ventosa o pinza | ✅ modelo (usado en escena 8) |
| Compensador (balanceador) | `demos/RobotStationDemo.tsx` | MAN | 22 | Poste, brazo, cable y carga animados | ✅ |
| Operario estilizado (maniquí) | `equipment/Worker.tsx` | MAN, DESP | 21, 22, 23 | Primitivas; brazos dirigidos a un punto, inclinación y flexión | ✅ |
| Banco de trabajo | `equipment/Workbench.tsx` | MAN | 21 | Mallas | ⏳ |
| AS/RS: racks altos + SRM | `demos/AsrsDemo.tsx` + `RackField` | AS/RS | 25 | Mástil, carro y dispositivo de carga animados; estación E/S | ✅ |
| Prensa / CNC | `equipment/Press.tsx` | PROC | 16 | Mallas | ⏳ (volúmenes en MVP) |
| Oficina acristalada / sala | `equipment/Machines.tsx` (`GlassOffice`) | ENG, MEET | 4, 5, 6, 12, 27–31 | Vidrio simple, techo, escritorios, pantallas murales | ✅ básico |
| Pizarra industrial / pantalla | `world/boards/Board.tsx` | Varias | Todas | Marco 3D + `<Html transform>` | ✅ MVP |

## 2. Texturas y materiales

| Recurso | Origen | Estado |
|---|---|---|
| Concreto pulido del piso | `CanvasTexture` procedural generada en ejecución (ruido) | ✅ MVP |
| Franjas de peligro amarillo/negro | `CanvasTexture` procedural | ✅ MVP |
| Cartón, madera de pallet, acero pintado, acero galvanizado | `MeshStandardMaterial` (color/rugosidad/metalicidad), sin imágenes | ✅ MVP |
| Iluminación de ambiente (reflejos) | drei `<Environment>` con `<Lightformer>` (procedural, sin HDR remoto) | ✅ MVP |

## 3. Figuras de la guía (2D)

Extraídas del .docx (`docs/extracted/media`) y copiadas a `public/figures/figNN.png`. Autoría: «Elaboración propia»
de los autores de la guía; se muestran con su nota y fuente.

| Fig. | Tema | Escena | Fig. | Tema | Escena |
|---|---|---|---|---|---|
| 1 | Alcance del manejo | 2 | 11 | Multiplicadores NIOSH | 21 |
| 2 | Rangos de costo/tiempo | 4 | 12 | Esquema AS/RS | 25 |
| 3 | 10 principios | 5 | 13 | Distribución ↔ manejo | 26 |
| 4 | Principio del trabajo | 6 | 14 | Síntomas | 29 |
| 5 | Grados de mecanización | 8 | 15 | Procedimiento de diseño | 29 |
| 6 | Pallets ISO 6780 | 10, 11 | 16 | Flujo de caja | 30 |
| 7 | Clasificación del curso | 12 | 17 | Dynea antes/después | 13 |
| 8 | Comparación de familias | 12 | 18 | FILI Schrock | 23 |
| 9 | Grúas aéreas | 16 | 19 | Recuperación AGV | 18 |
| 10 | Línea de tiempo | 20 | | | |

Se usan como imagen las figuras 1 y 3 (escenas de Felipe); las figuras 2, 3 y 4 además se recrean en HTML/KaTeX; el resto se recrearán como gráficos interactivos
(Recharts/SVG) cuando aporten legibilidad, conservando la imagen original en el modo complementario.

## 4. Fuentes tipográficas y librerías de UI

| Recurso | Licencia | Origen |
|---|---|---|
| Inter Variable (`@fontsource-variable/inter`) | SIL OFL 1.1 | npm, empaquetada por Vite |
| Fuentes KaTeX | MIT | npm `katex`, empaquetadas por Vite |
| Iconos | SVG inline propios | — |

## 5. Registro de licencias de recursos externos

| Recurso | Fuente | Licencia | Verificado |
|---|---|---|---|
| (ninguno en la versión 1) | | | |
