import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../../components/Layout';
import client from '../../api/client';

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .max(16, 'Max 16 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function OwnerChangePassword() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setServerError('');
      await client('auth/password', {
        method: 'PATCH',
        body: { currentPassword: data.currentPassword, newPassword: data.newPassword },
      });
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err.message || 'Failed to update password');
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 36,
            fontWeight: 400,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Change Password
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>
            Secure your store owner account
          </p>
        </div>

        <div className="card" style={{ padding: 32, animation: 'fadeUp 0.35s ease' }}>
          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 24,
              fontSize: 14,
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>✓</span> Password updated successfully.
            </div>
          )}

          {serverError && (
            <div style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 24,
              fontSize: 14,
              color: 'var(--error)',
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="form-label">Current Password</label>
              <input {...register('currentPassword')} type="password" placeholder="Your current password" />
              {errors.currentPassword && <p className="form-error">{errors.currentPassword.message}</p>}
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            <div>
              <label className="form-label">New Password</label>
              <input {...register('newPassword')} type="password" placeholder="8–16 characters" />
              {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Repeat new password" />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <div style={{ paddingTop: 4 }}>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        <p style={{ fontSize: 12, color: 'var(--subtle)', textAlign: 'center', marginTop: 16 }}>
          8–16 characters · uppercase letter · special character required
        </p>
      </div>
    </Layout>
  );
}
