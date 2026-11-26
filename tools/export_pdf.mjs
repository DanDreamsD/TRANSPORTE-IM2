// Exporta las diapositivas de la simulación a PDF.
// Uso: npm run pdf            (compila y genera pdf/NOVATEK_Diapositivas.pdf)
//      node tools/export_pdf.mjs [salida.pdf]   (requiere dist/ ya compilado)
// Sirve dist/ con `vite preview`, abre ?mode=print en Edge o Chrome sin interfaz y lo imprime a PDF.
// Navegador: variable de entorno BROWSER_PATH o las rutas habituales de Edge/Chrome/Chromium.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { preview } from 'vite';

const out = path.resolve(process.argv[2] ?? 'pdf/NOVATEK_Diapositivas.pdf');

function findBrowser() {
  const env = process.env.BROWSER_PATH;
  if (env && existsSync(env)) return env;
  const pf = process.env['PROGRAMFILES'] ?? 'C:\\Program Files';
  const pf86 = process.env['PROGRAMFILES(X86)'] ?? 'C:\\Program Files (x86)';
  const local = process.env.LOCALAPPDATA ?? '';
  const candidates = [
    path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
  ];
  const found = candidates.find((c) => c && existsSync(c));
  if (!found) throw new Error('No se encontró Edge ni Chrome. Defina BROWSER_PATH con la ruta del navegador.');
  return found;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`El navegador terminó con código ${code}\n${err.slice(-2000)}`))));
  });
}

if (!existsSync('dist/index.html')) throw new Error('No existe dist/. Ejecute primero `npm run build` (o use `npm run pdf`).');
mkdirSync(path.dirname(out), { recursive: true });
if (existsSync(out)) rmSync(out);

const server = await preview({ preview: { port: 4317, strictPort: false, open: false }, logLevel: 'warn' });
const base = server.resolvedUrls?.local[0];
if (!base) throw new Error('No se pudo iniciar el servidor de vista previa.');
const profile = mkdtempSync(path.join(tmpdir(), 'novatek-pdf-'));

try {
  const browser = findBrowser();
  console.log(`Imprimiendo ${base}?mode=print con ${path.basename(browser)}…`);
  await run(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=20000',
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${out}`,
    `${base}?mode=print`,
  ]);
  if (!existsSync(out)) throw new Error('El navegador no generó el PDF.');
  console.log(`PDF generado: ${path.relative(process.cwd(), out)} (${(statSync(out).size / 1048576).toFixed(1)} MB)`);
} finally {
  await server.close();
  rmSync(profile, { recursive: true, force: true });
}
