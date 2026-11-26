# FACTORY_LAYOUT — Planta de NOVATEK Industrial S.A.C.

Empresa **ficticia** que fabrica componentes automotrices, estructuras metálicas, asientos y componentes plásticos.
La planta está diseñada para que cada tema de la guía tenga una ubicación física coherente.

## 1. Sistema de coordenadas

- Unidades: metros. Origen en el centro de la nave.
- **X**: oeste (−) → este (+). Es la dirección general del flujo de material (recepción → despacho).
- **Z**: norte (−) → sur (+).
- **Y**: altura.
- Nave: 120 m × 70 m (X ∈ [−60, 60], Z ∈ [−35, 35]). Muros de 10 m. **Sin cubierta** (estilo «cutaway»):
  solo cerchas metálicas, lo que permite vistas aéreas y rutas de cámara por encima de los muros.
- Columnas: cada 12 m en X, en las filas Z = ±4 (bordes del pasillo central) y en el perímetro.

## 2. Concepto: distribución en espina

La guía (§11.1) menciona la distribución en espina: un canal central concentra el flujo y cada departamento
tiene su entrada/salida sobre él. NOVATEK usa ese concepto:

```
          X = -60                                                                  X = +60
 Z=-35  ┌──────────┬──────────────┬──────────────┬──────────────┬────────────┬──────────┐
 (norte)│          │ PREP         │ PROC         │ LÍNEA DE     │ OFICINAS   │ SALA DE  │
        │          │ Preparación  │ Procesamiento│ ENSAMBLE     │ INGENIERÍA │ REUNIONES│
        │ REC      │ de materiales│ (prensas,    │ (transport., │            │ y GESTIÓN│
        │ Recepción│              │ grúa puente) │ robots)      ├────────────┴──────────┤
        │ y        │              │              │              │  Tablero KPI / Andon  │
 Z=-4   │ descarga ├══════════════╧══ PASILLO CENTRAL (espina) · AGV / AMR / tren ═════╡ DESP     │
 Z=+4   │ ◄ muelles│══════════════╤══════════════╤══════════════╤════════════╤════════╡ Despacho │
        │          │ MP           │ MAN          │ AS/RS        │ PT         │        │ muelles ►│
        │          │ Almacén de   │ Estaciones   │ Almacén      │ Almacén de │        │          │
        │          │ materia prima│ manuales,    │ automatizado │ producto   │        │          │
 Z=+35  │          │ (racks)      │ NIOSH, robot │ (12 m)       │ terminado  │        │          │
 (sur)  └──────────┴──────────────┴──────────────┴──────────────┴────────────┴──────────┘
```

## 3. Zonas (fuente de verdad: `src/content/zones.ts`)

| ID | Zona | X | Z | Equipos principales | Temas de la guía |
|---|---|---|---|---|---|
| `rec` | Recepción y descarga | −60 … −46 | −12 … 26 | 3 muelles con rampa niveladora, camión, transpaleta, rodillos | 1.2, 10.1 |
| `mp` | Almacén de materia prima | −44 … −26 | 6 … 32 | Racks selectivos, pallets, montacargas | 4, 4.3, Caso 2 |
| `prep` | Preparación de materiales | −44 … −26 | −32 … −6 | Mesas de corte, sierra, carros de kitting, grados de mecanización (línea de 5 estaciones) | 3, 12.5 |
| `proc` | Procesamiento de componentes | −22 … 0 | −32 … −6 | Prensas, centro CNC, grúa puente, grúa pluma, monorriel | 7 |
| `man` | Estaciones de trabajo manual | −22 … 0 | 6 … 32 | Bancos, estación NIOSH, compensador, celda robótica | 9 |
| `line` | Líneas de producción y ensamble | 4 … 30 | −32 … −6 | Transportador de rodillos motorizado + gravedad, línea de asientos, AGV | 6, Caso 4 |
| `spine` | Sistemas de transporte interno | −58 … 58 | −3 … 3 | Pasillo central: circuito AGV (cinta magnética), AMR, tren de arrastre | 8, Caso 1 |
| `asrs` | Almacén automatizado | 4 … 30 | 8 … 32 | 2 filas de rack de 12 m, SRM (mástil, carro, dispositivo de carga) | 10.3 |
| `pt` | Almacén de producto terminado | 33 … 47 | 6 … 32 | Racks de PT, pallets envueltos | 10.2 |
| `desp` | Área de despacho | 48 … 60 | 4 … 30 | Muelles, camión, zona de carga (Caso 3) | 10.1, Caso 3 |
| `eng` | Oficinas de ingeniería | 33 … 46 | −32 … −14 | Oficina acristalada, pantallas de análisis | 2, 5, 11, 12 |
| `meet` | Sala de reuniones y gestión | 47 … 60 | −32 … −14 | Mesa, pantalla grande, tablero de gestión | 1.3–1.5, 12.4, 13, 14 |

## 4. Recorrido del material (demo 1)

Recepción → Almacén MP → Preparación → Procesamiento → Estaciones manuales/Ensamble → AS/RS → Almacén PT → Despacho.
Se representa con una flecha animada sobre el piso que usa el pasillo central y entra a cada zona.

## 5. Señalización y entorno

- Pasillo central: franjas amarillas de 10 cm, paso peatonal verde a un lado, flechas de sentido.
- Zonas delimitadas con líneas amarillas; zonas de peligro (radio de grúas, celda robótica) con franjas amarillo/negro.
- Etiquetas de zona colgantes (señalética), cerchas, tuberías aéreas, luminarias de nave alta.

## 6. Reglas de cámara

- Altura de crucero para transiciones largas: **20 m** (encima de muros de 10 m y del AS/RS de 12 m).
- Las cámaras de escena se ubican en el pasillo central o en pasillos de zona, nunca dentro de equipos.
- Transiciones entre zonas no contiguas → arco automático por la altura de crucero o `waypoints` explícitos.

## 7. Equipos fuera del proceso productivo

Los equipos que NOVATEK no necesita estrictamente (p. ej., transportador neumático o de cangilones para granel,
VLM/carrusel) se presentan como **modelos de demostración técnica** en la zona de preparación o en pantallas,
señalados como tales.
