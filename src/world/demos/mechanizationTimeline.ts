// Línea de tiempo de la demo de grados de mecanización (compartida entre 3D y la pantalla).

export const MECH_LEVELS = [
  { name: 'Manual', short: 'Manual', desc: 'Esfuerzo físico; transportes a mano', example: 'Carretilla de mano, transpaleta manual', color: '#dfe7f1', text: '#1f3a5f' },
  { name: 'Mecanizado', short: 'Mecanizado', desc: 'Fuerza motriz: grúas, montacargas', example: 'Montacargas de horquilla', color: '#3b84c6', text: '#ffffff' },
  { name: 'Mecanizado con computadora', short: 'Mec. + computadora', desc: 'La computadora genera los comandos', example: 'Control programable y sensores', color: '#1a9a8a', text: '#ffffff' },
  { name: 'Automatizado', short: 'Automatizado', desc: 'Mínima intervención: AGV, AS/RS', example: 'Vehículo autoguiado', color: '#f2a35e', text: '#1f3a5f' },
  { name: 'Completamente automatizado', short: 'Completamente autom.', desc: 'Sin intervención humana', example: 'Celda robotizada (ejemplo de los autores)', color: '#e5704f', text: '#ffffff' },
] as const;

export const MECH_STEP = 3;
export const MECH_CYCLE = 1 + MECH_LEVELS.length * MECH_STEP + 3;

/** Índice del grado resaltado en el instante t (o -1 si ninguno). */
export function activeMechLevel(t: number): number {
  const tt = t % MECH_CYCLE;
  if (tt < 1) return -1;
  const i = Math.floor((tt - 1) / MECH_STEP);
  return i < MECH_LEVELS.length ? i : -1;
}
