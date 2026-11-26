// Texturas procedurales generadas en ejecución (sin archivos ni descargas).
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

const cache = new Map<string, Texture>();

function make(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true): Texture {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  if (srgb) tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** Ruido determinista (no depende de Math.random para que la textura sea estable entre recargas). */
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Concreto pulido con manchas suaves y juntas de dilatación. */
export function concreteTexture(): Texture {
  return make('concrete', 512, 512, (ctx) => {
    const r = rand(7);
    ctx.fillStyle = '#a3a5a2';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) {
      const g = 140 + Math.floor(r() * 40);
      ctx.fillStyle = `rgba(${g},${g},${g - 4},${0.05 + r() * 0.08})`;
      const s = 2 + r() * 26;
      ctx.beginPath();
      ctx.arc(r() * 512, r() * 512, s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(60,60,60,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 510, 510);
  });
}

/** Franjas de peligro amarillo/negro a 45°. */
export function hazardTexture(): Texture {
  return make('hazard', 128, 128, (ctx) => {
    ctx.fillStyle = '#f2b705';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#1d1f21';
    for (let i = -128; i < 256; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 32, 0);
      ctx.lineTo(i + 32 + 128, 128);
      ctx.lineTo(i + 128, 128);
      ctx.closePath();
      ctx.fill();
    }
  });
}

/** Cheurones para la flecha de flujo de material (se desplaza con offset). */
export function chevronTexture(): Texture {
  return make('chevron', 256, 64, (ctx) => {
    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    for (let x = 0; x < 256; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x + 8, 8);
      ctx.lineTo(x + 34, 8);
      ctx.lineTo(x + 58, 32);
      ctx.lineTo(x + 34, 56);
      ctx.lineTo(x + 8, 56);
      ctx.lineTo(x + 32, 32);
      ctx.closePath();
      ctx.fill();
    }
  });
}

/** Rodillo galvanizado con una banda oscura para que su giro sea visible. */
export function rollerTexture(): Texture {
  return make('roller', 64, 64, (ctx) => {
    const grd = ctx.createLinearGradient(0, 0, 64, 0);
    grd.addColorStop(0, '#9aa1a7');
    grd.addColorStop(0.5, '#e1e5e8');
    grd.addColorStop(1, '#9aa1a7');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = 'rgba(40,46,52,0.55)';
    ctx.fillRect(0, 0, 64, 8);
    ctx.fillRect(0, 32, 64, 4);
  });
}

/** Cartón corrugado con cinta de embalaje y bordes sombreados. */
export function cartonTexture(): Texture {
  return make('carton', 128, 128, (ctx) => {
    ctx.fillStyle = '#c69c63';
    ctx.fillRect(0, 0, 128, 128);
    const r = rand(3);
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = `rgba(90,60,30,${r() * 0.06})`;
      ctx.fillRect(r() * 128, r() * 128, 1 + r() * 3, 1 + r() * 3);
    }
    ctx.fillStyle = 'rgba(232,214,176,0.85)';
    ctx.fillRect(54, 0, 20, 128);
    ctx.strokeStyle = 'rgba(80,55,25,0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 124, 124);
  });
}

/** Letrero con texto (fuentes del sistema/Inter ya cargada). */
export function signTexture(text: string, sub: string, color: string): Texture {
  return make(`sign:${text}:${sub}:${color}`, 1024, 256, (ctx) => {
    ctx.fillStyle = '#14191d';
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 24, 256);
    ctx.fillStyle = '#f4f6f7';
    ctx.font = '700 92px "Inter Variable", "Segoe UI", Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, sub ? 104 : 128, 920);
    if (sub) {
      ctx.fillStyle = '#9fb0bc';
      ctx.font = '500 48px "Inter Variable", "Segoe UI", Arial, sans-serif';
      ctx.fillText(sub, 66, 190, 920);
    }
  });
}
