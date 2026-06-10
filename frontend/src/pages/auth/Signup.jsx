import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import client from '../../api/client';

const schema = z.object({
  name: z.string().min(20, 'At least 20 characters').max(60, 'At most 60 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters').max(16, 'At most 16 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Needs a special character'),
  address: z.string().max(400, 'Too long'),
});

const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name (min 20 chars)' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '8–16 chars, uppercase + special' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'Your address' },
];

export default function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

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
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeUp 0.4s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 8 }}>★</div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 32,
            fontWeight: 400,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>Create account</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            Join Ratify to discover and review stores
          </p>
        </div>

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

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FIELDS.map(f => (
              <div key={f.name}>
                <label className="form-label">{f.label}</label>
                <input {...register(f.name)} type={f.type} placeholder={f.placeholder} />
                {errors[f.name] && <p className="form-error">{errors[f.name].message}</p>}
              </div>
            ))}
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
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
