# CLAUDE.md — NOVATEK · Material Flow Interactive Factory Experience

Instrucciones permanentes del proyecto. Léelas antes de cualquier cambio.

## Qué es

Presentación académica inmersiva que reemplaza a las diapositivas: una **fábrica 3D persistente**
(NOVATEK Industrial S.A.C., empresa ficticia) donde cada escena de la exposición es una ubicación
física. Al avanzar/retroceder, la cámara viaja de forma cinematográfica al punto correspondiente.

- Curso: Ingeniería de Métodos 2 — UNSA, Ingeniería Industrial. Docente: Dra. Elisa Castañeda Huamán.
- Tema: Capítulo VI — Manejo de materiales y equipo para el manejo de materiales.
- Integrantes: Felipe (cap. 1–2), Carlos (cap. 3–5), Vanessa (cap. 6–7), Nicole (cap. 8–10), Wilson (cap. 11–14).
  Nombres completos y códigos en `src/content/presenters.ts`. **En pantalla los integrantes se identifican solo por su
  color**; los nombres completos aparecen únicamente en la carátula (y en la tarjeta de cierre).

## Fuente académica (obligatoria)

- Original: `docs/source/Guia_Manejo_de_Materiales.docx`.
- Texto extraído (con tablas en Markdown y marcadores de figura): `docs/extracted/guia_texto.md`.
- Figuras extraídas: `docs/extracted/media/imgNN_*.png` (NN = número de figura 1–19).
- Para volver a extraer: `python -I tools/extract_docx.py docs/source/Guia_Manejo_de_Materiales.docx docs/extracted`
  (detalles en `docs/PROJECT_PLAN.md` §2).

### Reglas académicas (no negociables)

1. **No inventar ni alterar datos.** Toda cifra mostrada debe existir en la guía. Copiar valores literalmente
   (con coma decimal, como en la guía: `3,88`, `61,7 %`).
2. **Distinguir siempre el tipo de dato** con el campo `dataKind` de cada bloque:
   `course` (diapositivas del curso), `literature` (fuente publicada), `case` (investigación real),
   `hypothetical` (ejemplo didáctico inventado por la guía) y `synthesis` (interpretación de los autores).
   Los datos hipotéticos llevan la etiqueta visible «Ejemplo hipotético».
3. **Citar en APA 7** usando los IDs de `src/content/references.ts`. Cada escena declara `references`.
   Las diapositivas del curso **no se citan** (no son una fuente publicada): su contenido solo lleva la etiqueta
   «Curso» (`dataKind: 'course'`) y nunca aparece como «Castañeda (2026)» ni en la lista de referencias.
4. Las animaciones son **demostraciones didácticas**: nunca presentarlas como simulación industrial validada.
   Las escenas con demo muestran el aviso «Demostración didáctica».
5. Respetar las notas de inconsistencias que la guía señala (Dynea: 12 p. p. vs 15 %; Kubasáková: 3 vs 4 operarios).

## Stack

React 19 · Vite 8 · TypeScript 5.9 (strict) · three 0.187 · @react-three/fiber 9 · @react-three/drei 10 ·
GSAP 3 · Zustand 5 · KaTeX · Recharts 3 · Vitest. Sin backend ni base de datos.

## Comandos

```
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run typecheck  # tsc -b --noEmit
npm test           # vitest run (validación de escenas, rutas de cámara, store)
npm run build      # tsc -b && vite build → dist/
npm run preview    # sirve dist/
npm run pdf        # build + pdf/IM2_Cap6_Manejo_de_Materiales.pdf (aula virtual; vista ?mode=print, Edge/Chrome sin interfaz)
```

Antes de dar por terminada una fase: `npm run typecheck && npm test && npm run build` y revisión visual en el navegador.

## Arquitectura (resumen)

```
src/
  app/            App, ErrorBoundary, detección de WebGL, modo 2D alternativo
  state/          store Zustand (navegación, modos, calidad, replay)
  engine/         motor de presentación: CameraRig (GSAP + rutas), cameraPaths (puro, testeable)
  world/          entorno persistente: edificio, piso, señalización, iluminación, zonas
    equipment/    equipos procedurales reutilizables (rack, pallet, transportador, ...)
    demos/        demostraciones animadas ligadas a escenas (unit-load, conveyor, ...)
    boards/       pizarras/pantallas 3D que muestran contenido (drei <Html transform>)
  content/        DATOS académicos: scenes/, references.ts, presenters.ts, zones.ts, sceneRegistry.ts
  ui/             HUD: barra de navegación, menú, minimapa, panel ampliado, referencias, notas
  ui/blocks/      renderizador de bloques de contenido (texto, tabla, fórmula, gráfico, figura, ...)
public/figures/   figuras de la guía (copiadas desde docs/extracted/media)
```

### Principios de diseño

- **Una sola escena 3D persistente** (`<Canvas>` montado una vez). Nunca desmontar el mundo al cambiar de escena.
- **Escenas = datos.** Agregar/quitar/reordenar escenas solo toca `src/content/scenes/*.ts` y
  `src/content/sceneRegistry.ts`; el motor no se modifica. Ver tipo `SceneDef` en `src/content/types.ts`.
- **Contenido = bloques tipados** (`ContentBlock`) renderizados igual en la pizarra 3D, el panel ampliado y el modo 2D.
- **Cámara:** transiciones GSAP interrumpibles sobre una curva Catmull-Rom. Si no hay `waypoints`, se genera un
  arco a altura de crucero (por encima de muros y equipos) para no atravesar sólidos. Lógica pura en
  `engine/cameraPaths.ts` (con tests).
- **Pizarras compartidas:** si dos escenas declaran un `board` con la misma `position`, se dibuja un solo soporte
  físico y cada escena muestra su propio contenido (y su `pxWidth`) cuando está activa.
- **Demos:** componentes en `world/demos/` que se activan si su id está en `scene.animations` de la escena activa
  y se reinician con `replayToken` del store.
- **Modelos:** geometría procedural; cada equipo expone una interfaz para reemplazarlo por GLB/GLTF local
  (`public/models/`) sin cambiar las escenas. No usar recursos remotos (las presets de drei `Environment`
  y las fuentes por defecto de `<Text>` descargan de CDN: **prohibido**; usar `Lightformer` y HTML).
- **Rendimiento:** instanciar objetos repetidos (`StaticInstances`), calidad configurable (low/medium/high),
  objetivo 60 fps en portátil a 1920×1080. Sin texturas pesadas.
- **Legibilidad en proyector:** texto mínimo 18 px en el panel ampliado a 1080p; contraste AA.

## Convenciones de código

- TypeScript estricto, sin `any`. Componentes funcionales. Identificadores en inglés, contenido y comentarios en español.
- Coordenadas del mundo en metros: X = oeste→este (flujo de material), Z = norte→sur, Y = altura.
  La distribución de zonas está en `src/content/zones.ts` y documentada en `docs/FACTORY_LAYOUT.md`.
- Colores y tokens visuales en `src/world/palette.ts` y `src/ui/theme.css`.
- No agregar dependencias sin justificarlo en `docs/PROJECT_PLAN.md`.

## Documentación de planificación

`docs/PROJECT_PLAN.md` · `docs/STORYBOARD.md` · `docs/FACTORY_LAYOUT.md` · `docs/CONTENT_MATRIX.md` · `docs/ASSET_LIST.md`.
Mantenerlos sincronizados cuando cambien escenas, zonas o recursos.
