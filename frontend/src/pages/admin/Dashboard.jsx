import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import client from '../../api/client';

function StatCard({ label, value, icon, to, loading }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => to && navigate(to)}
      style={{
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
        cursor: to ? 'pointer' : 'default',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        if (!to) return;
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--accent), transparent)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <p style={{
          fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: 'var(--subtle)', margin: 0,
        }}>{label}</p>
        <span style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'var(--accent-dim)', border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>{icon}</span>
      </div>

      {loading ? (
        <span className="skeleton" style={{ width: 80, height: 44, display: 'block' }} />
      ) : (
        <p style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 48, fontWeight: 400,
          margin: 0, color: 'var(--text)', lineHeight: 1,
        }}>
          {value ?? <span style={{ color: 'var(--border)', fontSize: 32 }}>—</span>}
        </p>
      )}

      {to && !loading && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--subtle)', display: 'flex', alignItems: 'center', gap: 4 }}>
          View all <span style={{ color: 'var(--accent)' }}>→</span>
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await client('admin/stats');
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: '-0.5px',
        }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>Platform overview at a glance</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        animation: 'fadeUp 0.4s ease both',
      }}>
        <StatCard label="Total Users"   value={stats?.totalUsers}   icon="👤" to="/admin/users"  loading={loading} />
        <StatCard label="Total Stores"  value={stats?.totalStores}  icon="🏪" to="/admin/stores" loading={loading} />
        <StatCard label="Total Ratings" value={stats?.totalRatings} icon="★"  loading={loading} />
      </div>
    </Layout>
  );
}
