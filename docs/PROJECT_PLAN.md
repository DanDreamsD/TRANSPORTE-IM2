# PROJECT_PLAN — NOVATEK · Material Flow Interactive Factory Experience

## 1. Objetivo

Aplicación web (sin backend) que sustituye las diapositivas por una fábrica 3D persistente. Cada escena de la
exposición = ubicación + encuadre de cámara + contenido académico integrado + demostración opcional.

## 2. Análisis documental (Fase 1 — completada)

- Fuente: `docs/source/Guia_Manejo_de_Materiales.docx` (UNSA, Ingeniería de Métodos 2, 2026-B, 25/11/2026).
- Extracción con `tools/extract_docx.py` (Python estándar, sin dependencias): recorre `word/document.xml`, convierte
  títulos a Markdown, tablas a tablas Markdown, ecuaciones OMML a texto `$…$`, e inserta marcadores
  `[[IMAGE n: media/…]]` en el lugar exacto de cada figura, que se exporta a `docs/extracted/media/`.
- Resultado: 577 párrafos, **35 tablas** (todas legibles como texto), **19 figuras** (PNG, legibles; se verificó la
  Figura 6). La ecuación NIOSH está como texto plano en la guía, no como OMML.
- **Limitación:** las figuras son imágenes rasterizadas (gráficos generados por los autores). Sus datos solo se pueden
  reconstruir cuando la guía también los publica en tabla (p. ej., Fig. 16 ↔ Tabla 26, Fig. 17 ↔ Tabla 29,
  Fig. 19 ↔ Tabla 30, Fig. 11 ↔ Tabla 18). Para Fig. 18 (FILI de 15 gabinetes) los valores individuales solo están en la
  imagen: se leerán de la figura y se marcarán como «valores leídos de la Figura 18», o se mostrará la imagen original.
- Estructura: Presentación + 14 capítulos temáticos + preguntas de repaso (15) + glosario (16) + 36 referencias APA (la presentación no cita las diapositivas del curso, por no ser una fuente publicada).
- Reparto (Tabla 33): Felipe 1–2 (+caso 1) · Carlos 3–5 (+caso 2) · Vane 6–7 (+caso 4) · Nicole 8–10 (+caso 3) ·
  Wilson 11–14 (+caso 5, cap. 13).

## 3. Arquitectura definitiva

```
┌──────────────────────────── App ────────────────────────────┐
│  WebGL OK?  ──no──►  Presentation2D (mismo contenido)       │
│     │yes                                                     │
│  <ErrorBoundary fallback=Presentation2D>                     │
│   ┌────────────── <Canvas> (persistente) ──────────────┐     │
│   │ World: Building, FloorMarkings, Zones, Lighting     │     │
│   │ Equipment (procedural / GLB)                        │     │
│   │ Demos (activas por scene.animations + replayToken)  │     │
│   │ Boards (<Html transform> con ContentBlocks)         │     │
│   │ CameraRig (GSAP + Catmull-Rom) | OrbitControls(free)│     │
│   └─────────────────────────────────────────────────────┘     │
│  HUD: TopBar · SceneMenu · NavBar(prev/next/progress) ·      │
│       Minimap · ExpandedPanel · ReferencesPanel · Notes      │
└──────────────────────────────────────────────────────────────┘
          ▲ todos leen/escriben ▼
     Zustand store (index, mode, panels, quality, replayToken)
          ▲
     content/sceneRegistry.ts  ←  content/scenes/*.ts (datos)
```

### 3.1 Modelo de datos (resumen de `src/content/types.ts`)

```ts
interface SceneDef {
  id: string; order?: number;
  chapter: { number: string; title: string }; subchapter?: { number: string; title: string };
  presenter: PresenterId; title: string; zone: ZoneId;
  camera: { position: Vec3; target: Vec3; fov: number; duration: number; waypoints?: Vec3[] };
  board?: { position: Vec3; width: number; height: number; rotationY?: number; style?: 'whiteboard'|'screen' };
  boardBlocks: ContentBlock[];   // lo que se ve en la pizarra 3D
  detailBlocks?: ContentBlock[]; // modo complementario / panel ampliado
  animations: AnimationId[]; references: ReferenceId[]; notes?: string;
}
type ContentBlock = lead | bullets | table | formula | stats | callout | figure | chart | definition | custom
// cada bloque admite dataKind: 'course'|'literature'|'case'|'hypothetical'|'synthesis' y source
```

### 3.2 Motor de cámara

- `engine/cameraPaths.ts` (puro): construye la ruta desde la pose actual hasta la pose destino. Si la distancia > 14 m
  y no hay `waypoints`, inserta un punto a la altura de crucero (20 m) para pasar por encima de muros/equipos.
  Duración adaptada a la distancia y limitada (`clampDuration`).
- `engine/CameraRig.tsx`: un único tween GSAP sobre un parámetro `t ∈ [0,1]`; posición = `curve.getPointAt(ease(t))`,
  objetivo y FOV interpolados. **Interrumpible:** una nueva navegación mata el tween y parte de la pose actual.
  `prefers-reduced-motion` → transiciones cortas.
- Modo exploración libre: `OrbitControls` habilitado, sincronizado con el objetivo actual; al volver al modo guiado
  la cámara viaja a la escena actual.

### 3.3 Contenido integrado

- `<Board>`: marco 3D (pizarra blanca o pantalla) + `<Html transform>` con el renderizador de bloques; se «enciende»
  solo en la escena activa (rendimiento y legibilidad).
- Panel ampliado (tecla `E`): mismo contenido en un panel frontal de alta legibilidad, con `detailBlocks` en modo
  complementario (tecla `C`).
- KaTeX para fórmulas; Recharts para gráficos; figuras originales en `public/figures`.

## 4. Fases

| Fase | Contenido | Criterio de salida | Estado |
|---|---|---|---|
| 1 | Análisis documental, planificación, documentación | 6 documentos + extracción verificada | ✅ |
| 2 | Motor de presentación y navegación | Store, CameraRig, HUD completo, tests de rutas y store | ✅ MVP |
| 3 | Entorno industrial | Nave, zonas, señalización, iluminación, calidad configurable | ✅ base MVP |
| 4 | Modelado y animación de equipos | 20+ equipos procedurales (ver ASSET_LIST) | ⏳ (3 en MVP) |
| 5 | Integración del contenido | 33 escenas con datos verificados contra la guía | ⏳ (3 en MVP) |
| 6 | Interacciones y demos | 14 demos, calculadoras NIOSH/ponderación/PRI | ⏳ (3 en MVP) |
| 7 | Pulido visual/cinematográfico | Rutas con waypoints, postproceso ligero opcional, sonido opcional | ⏳ |
| 8 | Pruebas, optimización, despliegue | 60 fps a 1080p en portátil, build estático offline, ensayo en proyector | ⏳ |

Orden propuesto tras el MVP: completar Fase 3 (todas las zonas en volumen) → escenas de Felipe y Carlos → Vane →
Nicole → Wilson, verificando cada bloque de escenas antes del siguiente.

## 5. Dependencias y justificación

| Paquete | Uso |
|---|---|
| react, react-dom 19 | UI |
| three 0.187, @react-three/fiber 9, @react-three/drei 10 | Escena 3D declarativa; drei aporta `Html`, `OrbitControls`, `Environment/Lightformer` |
| gsap 3 | Transiciones de cámara interrumpibles con *easing* cinematográfico |
| zustand 5 | Estado global mínimo compartido entre 3D y HUD |
| katex | Fórmulas (NIOSH, flujo × distancia, PRI/ROI), fuentes locales |
| recharts 3 | Gráficos 2D (casos, costos, flujo de caja) |
| @fontsource-variable/inter | Tipografía local (offline) |
| vitest | Pruebas unitarias |

## 6. Riesgos y dificultades

### Técnicos
| Riesgo | Mitigación |
|---|---|
| Texto 3D ilegible en proyector | Pizarras con HTML nítido + panel ampliado; tamaños mínimos; contraste alto |
| `<Html transform>` siempre se dibuja sobre el canvas (no se ocluye) | Solo la pizarra de la escena activa muestra contenido; las demás muestran pantalla apagada |
| Cámara atravesando sólidos | Arco automático a 20 m, `waypoints`, nave sin cubierta, test de rutas |
| Rendimiento en portátiles con GPU integrada | Instanciación, sombras opcionales, DPR por calidad, sin postproceso por defecto |
| Pérdida de contexto WebGL / sin WebGL | Detección previa, `ErrorBoundary`, evento `webglcontextlost` → modo 2D |
| Recursos remotos implícitos (drei presets, fuentes de `<Text>`) | Prohibidos: Lightformer y HTML; todo empaquetado |
| Navegación rápida durante transiciones | Tween único interrumpible; el contenido sigue al índice, no al tween |
| Versiones recientes (React 19 / R3F 9 / Vite 8) | Versiones exactas fijadas en `package.json`; build y tests en cada fase |

### Académicos
| Riesgo | Mitigación |
|---|---|
| Mezclar datos reales con hipotéticos | `dataKind` obligatorio en bloques con cifras + etiqueta visible |
| Simulaciones vistas como validadas | Aviso «Demostración didáctica» en cada demo |
| Exceso de texto en pantalla | Pizarra = ideas clave y visual; el detalle en modo complementario |
| Inconsistencias de las fuentes (Dynea, Kubasáková) | Mostrar la nota de la guía tal cual |
| Valores de figuras no tabulados (Fig. 18) | Usar imagen original o declarar lectura aproximada |
| Reparto de casos poco intuitivo (caso 4 → Vane) | Confirmar con el grupo; configurable en datos |

## 7. Pruebas

- `vitest`: validación del registro de escenas (IDs únicos, referencias existentes, presentadores válidos, cámara
  finita, FOV en rango, bloques con `dataKind` cuando contienen cifras), rutas de cámara (arco sobre altura de
  crucero, extremos exactos, duración acotada) y reducer de navegación del store.
- Manual: recorrido completo con teclado, menú, minimapa, pantalla completa, modo libre, modo 2D forzado (`?mode=2d`).
