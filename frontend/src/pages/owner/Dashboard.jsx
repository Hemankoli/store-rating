import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SortableTable from '../../components/SortableTable';
import client from '../../api/client';

const COLUMNS = [
  { key: 'name', label: 'Customer' },
  { key: 'email', label: 'Email' },
  {
    key: 'value',
    label: 'Rating',
    render: row => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {'★★★★★'.split('').map((_, i) => (
          <span key={i} style={{
            color: i < row.value ? 'var(--accent)' : 'var(--border)',
            fontSize: 14,
            lineHeight: 1,
          }}>★</span>
        ))}
        <span style={{ fontSize: 13, color: 'var(--subtle)', marginLeft: 2 }}>{row.value}/5</span>
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Date',
    render: row => (
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>
        {new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </span>
    ),
  },
];

function RatingBar({ value, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ width: 8, fontSize: 13, color: 'var(--muted)', textAlign: 'right' }}>{value}</span>
      <span style={{ color: 'var(--accent)', fontSize: 12 }}>★</span>
      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--accent), #fcd34d)',
          borderRadius: 99,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <span style={{ width: 24, fontSize: 12, color: 'var(--subtle)', textAlign: 'right' }}>{count}</span>
    </div>
  );
}

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await client('owner/dashboard', { params: { sortBy, sortOrder } });
        setData(res.data);
      } catch {}
    }
    fetchDashboard();
  }, [sortBy, sortOrder]);

  // tally ratings distribution
  const dist = [5, 4, 3, 2, 1].map(v => ({
    value: v,
    count: (data?.raters || []).filter(r => r.value === v).length,
  }));
  const totalRatings = data?.raters?.length ?? 0;

  return (
    <Layout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 36,
          fontWeight: 400,
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          {data?.store?.name ?? 'My Store'}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>Store owner dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28, animation: 'fadeUp 0.35s ease' }}>
        {/* Big rating card */}
        <div className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--accent), transparent)',
          }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--subtle)', margin: '0 0 12px' }}>
            Average Rating
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 56,
              fontWeight: 400,
              color: 'var(--text)',
              lineHeight: 1,
            }}>
              {data?.avgRating != null ? data.avgRating.toFixed(1) : '—'}
            </span>
            <span style={{ color: 'var(--accent)', fontSize: 28, marginBottom: 6 }}>★</span>
            <span style={{ color: 'var(--subtle)', fontSize: 14, marginBottom: 8 }}>/5</span>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            from {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Distribution card */}
        <div className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--accent), transparent)',
          }} />
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--subtle)', margin: '0 0 16px' }}>
            Distribution
          </p>
          {dist.map(d => (
            <RatingBar key={d.value} value={d.value} count={d.count} total={totalRatings} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
          Reviews
        </h2>
      </div>

      <SortableTable
        columns={COLUMNS}
        data={data?.raters || []}
        onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
      />
    </Layout>
  );
}
