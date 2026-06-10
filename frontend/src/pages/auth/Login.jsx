import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const ROLE_HOME = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' };

const FEATURES = [
  { icon: '★', text: 'Rate stores 1–5 stars' },
  { icon: '⊞', text: 'Admin panel with live stats' },
  { icon: '◎', text: 'Owner dashboard with analytics' },
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  if (user) return <Navigate to={ROLE_HOME[user.role] ?? '/stores'} replace />;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setServerError('');
      const u = await login(data.email, data.password);
      navigate(ROLE_HOME[u.role] ?? '/stores');
    } catch (err) {
      setServerError(err.message || 'Login failed');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: '0 0 42%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 56px',
        borderRight: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          top: '30%', left: '-10%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', animation: 'fadeUp 0.5s ease both' }}>
          {/* Logo mark */}
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'var(--accent)', marginBottom: 28,
            boxShadow: '0 0 32px rgba(245,158,11,0.15)',
          }}>★</div>

          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 40, fontWeight: 400,
            margin: '0 0 12px', letterSpacing: '-1px',
            color: 'var(--text)', lineHeight: 1.1,
          }}>
            Store ratings,<br />
            <span style={{ color: 'var(--accent)' }}>simplified.</span>
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, margin: '0 0 40px', maxWidth: 320 }}>
            Ratify gives customers a voice and store owners the insight they need.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'var(--card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: 'var(--accent)', flexShrink: 0,
                }}>{f.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.45s 0.1s ease both' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 28, fontWeight: 400, margin: '0 0 6px', letterSpacing: '-0.5px',
            }}>Welcome back</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>Sign in to your account</p>
          </div>

          {serverError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--error)',
            }}>{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--subtle)', fontSize: 14, padding: 0, lineHeight: 1,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--subtle)'}
                >
                  {showPwd ? '○' : '●'}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ marginTop: 4, width: '100%', padding: '12px 20px', fontSize: 15 }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--subtle)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
