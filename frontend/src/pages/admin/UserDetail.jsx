import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import client from '../../api/client';

const ROLE_LABELS = { admin: 'Admin', user: 'Normal User', store_owner: 'Store Owner' };
const ROLE_BADGE = { admin: 'badge-amber', user: 'badge-zinc', store_owner: 'badge-green' };

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    client(`users/${id}`).then(res => setUser(res.data));
  }, [id]);

  return (
    <Layout>
      <button
        onClick={() => navigate('/admin/users')}
        className="btn-ghost"
        style={{ marginBottom: 24, fontSize: 14 }}
      >
        ← Back to Users
      </button>

      {!user ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--subtle)' }}>Loading…</div>
      ) : (
        <div style={{ animation: 'fadeUp 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 34, fontWeight: 400, margin: 0, letterSpacing: '-0.5px' }}>
              {user.name}
            </h1>
            <span className={`badge ${ROLE_BADGE[user.role]}`}>{ROLE_LABELS[user.role]}</span>
          </div>

          <div className="card" style={{ padding: 28, maxWidth: 520 }}>
            {[
              ['Email', user.email],
              ['Address', user.address],
              ['Role', ROLE_LABELS[user.role]],
              ['Member since', new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex',
                gap: 16,
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <dt style={{ width: 130, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--subtle)', flexShrink: 0 }}>
                  {label}
                </dt>
                <dd style={{ fontSize: 14, color: 'var(--text)', margin: 0 }}>{value}</dd>
              </div>
            ))}
            {user.role === 'store_owner' && (
              <div style={{ display: 'flex', gap: 16, padding: '14px 0' }}>
                <dt style={{ width: 130, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--subtle)', flexShrink: 0 }}>
                  Store Rating
                </dt>
                <dd style={{ margin: 0 }}>
                  {user.storeAvgRating != null ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, color: 'var(--accent)' }}>★</span>
                      <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, color: 'var(--text)' }}>
                        {user.storeAvgRating.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>/ 5</span>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--subtle)' }}>No ratings yet</span>
                  )}
                </dd>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
