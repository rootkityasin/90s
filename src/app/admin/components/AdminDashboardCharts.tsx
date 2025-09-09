"use client";
import React from 'react';
import type { Product } from '../../../lib/types';
import type { SalesSnapshot } from '../../../lib/types';
import { motion } from 'framer-motion';

type Props = {
  sales: SalesSnapshot[];
  products: Product[];
};

function useKpis(sales: SalesSnapshot[]) {
  const revenue = sales.reduce((s, d) => s + d.revenueBDT, 0);
  const orders = sales.reduce((s, d) => s + d.orders, 0);
  const avgRevenuePerDay = revenue / Math.max(1, sales.length);
  const first7 = sales.slice(0, Math.floor(sales.length / 2));
  const last7 = sales.slice(Math.floor(sales.length / 2));
  const revFirst = first7.reduce((s, d) => s + d.revenueBDT, 0);
  const revLast = last7.reduce((s, d) => s + d.revenueBDT, 0);
  const growth = revFirst === 0 ? 0 : ((revLast - revFirst) / revFirst) * 100;
  return { revenue, orders, avgRevenuePerDay, growth };
}

// Deterministic BDT formatter to avoid server/client Intl differences
function formatBDT(n: number) {
  const rounded = Math.round(n);
  const withCommas = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `BDT ${withCommas}`;
}

export default function AdminDashboardCharts({ sales, products }: Props) {
  const dates = sales.map(s => s.date);
  const revenueSeries = sales.map(s => s.revenueBDT);
  const ordersSeries = sales.map(s => s.orders);
  const { revenue, orders, avgRevenuePerDay, growth } = useKpis(sales);

  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  // Dimensions for SVG charts using viewBox for responsive sizing
  const W = 600; const H = 200; const P = 16; // padding
  const maxRev = Math.max(...revenueSeries, 1);
  const maxOrd = Math.max(...ordersSeries, 1);
  const x = (i: number, n = revenueSeries.length) => P + (i * (W - 2 * P)) / Math.max(1, n - 1);
  const yRev = (v: number) => H - P - (v / maxRev) * (H - 2 * P);
  const yOrd = (v: number) => H - P - (v / maxOrd) * (H - 2 * P);

  const revenuePath = React.useMemo(() => {
    return revenueSeries.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${yRev(v)}`).join(' ');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenueSeries.join(',')]);

  const areaPath = React.useMemo(() => {
    if (revenueSeries.length === 0) return '';
    const start = `M ${x(0)} ${yRev(revenueSeries[0])}`;
    const lines = revenueSeries.slice(1).map((v, i) => `L ${x(i + 1)} ${yRev(v)}`).join(' ');
    const close = `L ${x(revenueSeries.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
    return `${start} ${lines} ${close}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenueSeries.join(',')]);

  function handleMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const relX = e.clientX - rect.left;
    // invert x() approximately to index
    const n = revenueSeries.length;
    const i = Math.round(((relX - P) / (W - 2 * P)) * (n - 1));
    if (i >= 0 && i < n) setHoverIdx(i);
  }

  return (
    <section className="admin-dashboard">
      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Revenue (14d)</div>
          <div className="kpi-value">{formatBDT(revenue)}</div>
          <div className="kpi-sub">Avg/day {formatBDT(avgRevenuePerDay)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Orders (14d)</div>
          <div className="kpi-value">{orders}</div>
          <div className="kpi-sub">Avg/day {(orders / Math.max(1, sales.length)).toFixed(1)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Trend</div>
          <div className="kpi-value" style={{ color: growth >= 0 ? 'var(--color-accent)' : '#e53e3e' }}>
            {growth >= 0 ? '▲' : '▼'} {Math.abs(growth).toFixed(1)}%
          </div>
          <div className="kpi-sub">vs prev 7 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Catalog</div>
          <div className="kpi-value">{products.length}</div>
          <div className="kpi-sub">live products</div>
        </div>
      </div>

      {/* Revenue line chart */}
      <div className="chart-panel">
        <div className="chart-header">
          <h3>Revenue (last {sales.length} days)</h3>
          <div className="chart-legend"><span className="legend-dot legend-rev" />BDT</div>
        </div>
        <div className="chart-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHoverIdx(null)}>
            {/* grid lines */}
            {[0.25, 0.5, 0.75].map((t) => (
              <line key={t} x1={P} x2={W - P} y1={P + (H - 2 * P) * t} y2={P + (H - 2 * P) * t} stroke="#2a3557" strokeDasharray="4 4" />
            ))}
            {/* area fill */}
            <motion.path d={areaPath} fill="url(#revGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,143,125,0.35)" />
                <stop offset="100%" stopColor="rgba(0,143,125,0.02)" />
              </linearGradient>
            </defs>
            {/* animated line */}
            <motion.path d={revenuePath} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
            {/* points */}
            {revenueSeries.map((v, i) => (
              <circle key={i} cx={x(i)} cy={yRev(v)} r={hoverIdx === i ? 4 : 2.5} fill={hoverIdx === i ? 'var(--color-accent)' : '#89d6cd'} />
            ))}
            {/* hover line */}
            {hoverIdx !== null && (
              <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={P} y2={H - P} stroke="#2a3557" />
            )}
          </svg>
          {hoverIdx !== null && (
            <div className="tooltip" style={{ left: `${(x(hoverIdx) / W) * 100}%` }}>
              <div className="tooltip-inner">
                <div className="tooltip-title">{dates[hoverIdx]}</div>
                <div className="tooltip-value">{formatBDT(revenueSeries[hoverIdx])}</div>
                <div className="tooltip-sub">Orders: {ordersSeries[hoverIdx]}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders bar chart */}
      <div className="chart-panel">
        <div className="chart-header">
          <h3>Orders (last {sales.length} days)</h3>
          <div className="chart-legend"><span className="legend-dot legend-ord" />Orders</div>
        </div>
        <div className="chart-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            {[0.25, 0.5, 0.75].map((t) => (
              <line key={t} x1={P} x2={W - P} y1={P + (H - 2 * P) * t} y2={P + (H - 2 * P) * t} stroke="#2a3557" strokeDasharray="4 4" />
            ))}
            {ordersSeries.map((v, i) => {
              const bw = (W - 2 * P) / ordersSeries.length * 0.6; // 60% band width
              const cx = x(i);
              const h = (v / maxOrd) * (H - 2 * P);
              return (
                <motion.rect
                  key={i}
                  x={cx - bw / 2}
                  y={H - P - h}
                  width={bw}
                  height={h}
                  fill="#ff9643"
                  initial={{ height: 0, y: H - P }}
                  animate={{ height: h, y: H - P - h }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  rx={4}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
