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

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  if (user) return <Navigate to={ROLE_HOME[user.role] ?? '/stores'} replace />;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setServerError('');
      const user = await login(data.email, data.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'user') navigate('/stores');
      else navigate('/owner/dashboard');
    } catch (err) {
      setServerError(err.message || 'Login failed');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        animation: 'fadeUp 0.4s ease forwards',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 8 }}>★</div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 32,
            fontWeight: 400,
            margin: 0,
            color: 'var(--text)',
            letterSpacing: '-0.5px',
          }}>Ratify</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          {serverError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--error)',
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" />
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
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--subtle)' }}>
          No account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
