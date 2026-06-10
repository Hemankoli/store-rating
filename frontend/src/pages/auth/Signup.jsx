import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import client from '../../api/client';
import useAuth from '../../hooks/useAuth';

const schema = z.object({
  name:     z.string().min(20, 'At least 20 characters').max(60, 'At most 60 characters'),
  email:    z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters').max(16, 'At most 16 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Needs a special character'),
  address:  z.string().max(400, 'Too long'),
});

const ROLE_HOME = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' };

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  if (user) return <Navigate to={ROLE_HOME[user.role] ?? '/stores'} replace />;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setServerError('');
      await client('auth/signup', { body: data });
      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Signup failed');
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
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 480, animation: 'fadeUp 0.4s ease forwards' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--accent-dim)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: 'var(--accent)', marginBottom: 12,
          }}>★</div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 30, fontWeight: 400, margin: '0 0 6px', letterSpacing: '-0.5px',
          }}>Create account</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Join Ratify to discover and review stores
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {serverError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--error)',
            }}>{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Full Name</label>
              <input {...register('name')} type="text" placeholder="Your full name (min 20 characters)" />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

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
                  placeholder="Min 8 chars, 1 uppercase, 1 special"
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
                >{showPwd ? '○' : '●'}</button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Address</label>
              <input {...register('address')} type="text" placeholder="Your address" />
              {errors.address && <p className="form-error">{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ marginTop: 8, width: '100%', padding: '12px 20px', fontSize: 15 }}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--subtle)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
