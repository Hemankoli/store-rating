import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import client from '../../api/client';

function StatCard({ label, value, icon }) {
  return (
    <div className="card" style={{
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, var(--accent), transparent)',
      }} />
      <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--subtle)', margin: 0 }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 }}>
        <p style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 44,
          fontWeight: 400,
          margin: 0,
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          {value ?? <span style={{ color: 'var(--border)', fontSize: 32 }}>—</span>}
        </p>
        <span style={{ fontSize: 24, opacity: 0.25 }}>{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client('admin/stats').then(res => setStats(res.data));
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: '-0.5px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>Platform overview at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, animation: 'fadeUp 0.4s ease' }}>
        <StatCard label="Total Users" value={stats?.totalUsers} icon="👤" />
        <StatCard label="Total Stores" value={stats?.totalStores} icon="🏪" />
        <StatCard label="Total Ratings" value={stats?.totalRatings} icon="★" />
      </div>
    </Layout>
  );
}
