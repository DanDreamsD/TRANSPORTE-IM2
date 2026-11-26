# NOVATEK · Material Flow

Presentación académica inmersiva sobre **manejo de materiales y equipo para el manejo de materiales**
(Capítulo VI · Ingeniería de Métodos 2 · UNSA). En lugar de diapositivas, la exposición recorre una fábrica 3D
ficticia —NOVATEK Industrial S.A.C.— donde cada tema es un lugar, una máquina o una estación de trabajo.

**En línea:** https://dandreamsd.github.io/TRANSPORTE-IM2/ (se publica automáticamente con cada push a `main`
mediante `.github/workflows/deploy.yml`).

## Ejecutar

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:5173
```

Otros comandos: `npm run typecheck`, `npm test`, `npm run build` (genera `dist/`, funciona sin internet) y
`npm run preview`.

### Diapositivas en PDF

`npm run pdf` compila y genera [`pdf/NOVATEK_Diapositivas.pdf`](pdf/NOVATEK_Diapositivas.pdf): carátula, una
página 16:9 por pizarra de la simulación y cierre. Usa la vista `?mode=print` y Edge o Chrome instalados (sin
dependencias nuevas; otra ruta de navegador con la variable `BROWSER_PATH`).

Parámetros de URL: `?scene=<id>` abre una escena concreta; `?mode=2d` fuerza el modo 2D alternativo; `?mode=print` muestra la vista de impresión de diapositivas.

## Controles

| Tecla | Acción |
|---|---|
| → / AvPág / Espacio · ← / RePág | Escena siguiente / anterior |
| M | Menú de capítulos y escenas |
| E · C | Ampliar contenido · contenido complementario |
| R | Repetir animación |
| B · N | Referencias · notas del expositor |
| L | Exploración libre |
| F · Q · V | Pantalla completa · calidad gráfica · modo 2D |

## Estado

Las 33 escenas están implementadas (los cinco integrantes, portada y cierre). Detalle en
[`docs/STORYBOARD.md`](docs/STORYBOARD.md) y cobertura por capítulo en [`docs/CONTENT_MATRIX.md`](docs/CONTENT_MATRIX.md).

## Stack

React 19 · Vite · TypeScript · three.js · React Three Fiber · Drei · GSAP · Zustand · KaTeX · Recharts.

La fuente académica es `docs/source/Guia_Manejo_de_Materiales.docx`. Las animaciones son demostraciones didácticas,
no simulaciones industriales validadas. Instrucciones de desarrollo en [`CLAUDE.md`](CLAUDE.md).
