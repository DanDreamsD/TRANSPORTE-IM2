// Gráficos 2D (Recharts). Colores alineados con el tema de la interfaz.
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { BarChartBlock } from '../../content/types';

const fmt = (v: unknown) => (typeof v === 'number' ? v.toLocaleString('es-PE') : String(v ?? ''));

export function BeforeAfterChart({ block, compact = false }: { block: BarChartBlock; compact?: boolean }) {
  const data = block.data.map((d) => ({ name: d.label, before: d.before, after: d.after }));
  const chart = (
    <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 0 }} barGap={6}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
      <XAxis dataKey="name" tick={{ fill: 'var(--chart-text)', fontSize: compact ? 16 : 13 }} interval={0} tickLine={false} axisLine={{ stroke: 'var(--chart-grid)' }} />
      <YAxis unit={block.unit} tick={{ fill: 'var(--chart-text)', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} width={52} />
      {!compact && <Tooltip formatter={(v) => `${fmt(v)} ${block.unit}`} contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text)' }} />}
      <Legend wrapperStyle={{ color: 'var(--chart-text)', fontSize: 13 }} />
      <Bar dataKey="before" name={block.beforeLabel} fill="var(--chart-before)" radius={[4, 4, 0, 0]} isAnimationActive={false}>
        <LabelList dataKey="before" position="top" formatter={(v: unknown) => `${fmt(v)} ${block.unit}`} fill="var(--chart-text)" fontSize={13} />
      </Bar>
      <Bar dataKey="after" name={block.afterLabel} fill="var(--chart-after)" radius={[4, 4, 0, 0]} isAnimationActive={false}>
        <LabelList dataKey="after" position="top" formatter={(v: unknown) => `${fmt(v)} ${block.unit}`} fill="var(--chart-text)" fontSize={13} />
      </Bar>
    </BarChart>
  );
  return (
    <div className="chart-box" style={{ height: compact ? 300 : 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        {chart}
      </ResponsiveContainer>
    </div>
  );
}

/** Recreación de la Figura 19 con los datos de la Tabla 30 (Kubasáková et al., 2024). */
export const AGV_CASE = { investment: 49000, annualCost: 79200 } as const;

export function agvPaybackMonths(): number {
  return (AGV_CASE.investment / AGV_CASE.annualCost) * 12;
}

export function AgvPaybackChart({ compact = false }: { compact?: boolean }) {
  const monthly = AGV_CASE.annualCost / 12;
  const data = Array.from({ length: 13 }, (_, m) => ({ m, saved: Math.round(monthly * m), inv: AGV_CASE.investment }));
  const pb = agvPaybackMonths();
  const fmtEur = (v: unknown) => (typeof v === 'number' ? `${(v / 1000).toLocaleString('es-PE')} mil` : String(v ?? ''));
  return (
    <div className="chart-box" style={{ height: compact ? 270 : 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 18, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="m" type="number" domain={[0, 12]} ticks={[0, 2, 4, 6, 8, 10, 12]} tick={{ fill: 'var(--chart-text)', fontSize: compact ? 15 : 12 }} label={{ value: 'Meses', position: 'insideBottom', offset: -10, fill: 'var(--chart-text)', fontSize: 13 }} />
          <YAxis tickFormatter={fmtEur} tick={{ fill: 'var(--chart-text)', fontSize: compact ? 14 : 12 }} width={70} />
          <Legend verticalAlign="top" height={28} wrapperStyle={{ color: 'var(--chart-text)', fontSize: compact ? 15 : 12 }} />
          <Line type="linear" dataKey="saved" name="Costo evitado acumulado (EUR 79 200/año)" stroke="var(--chart-after)" strokeWidth={3} dot={false} isAnimationActive={false} />
          <Line type="linear" dataKey="inv" name="Inversión en 2 AGV (EUR 49 000)" stroke="#e5704f" strokeDasharray="7 5" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <ReferenceDot x={Math.round(pb * 10) / 10} y={AGV_CASE.investment} r={6} fill="#f5b301" stroke="none" ifOverflow="extendDomain" label={{ value: `≈ ${pb.toFixed(1).replace('.', ',')} meses`, position: 'top', fill: 'var(--chart-text)', fontSize: compact ? 16 : 13 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
