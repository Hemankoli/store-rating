import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../../components/Layout';
import SortableTable from '../../components/SortableTable';
import client from '../../api/client';

const createSchema = z.object({
  name: z.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8).max(16).regex(/[A-Z]/, 'Needs uppercase').regex(/[^A-Za-z0-9]/, 'Needs special char'),
  address: z.string().max(400),
  role: z.enum(['admin', 'user', 'store_owner']),
});

const ROLE_COLORS = { admin: 'badge-amber', user: 'badge-zinc', store_owner: 'badge-green' };
const ROLE_LABELS = { admin: 'Admin', user: 'User', store_owner: 'Owner' };

function ViewBtn({ id }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/admin/users/${id}`)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--accent)', fontSize: 13, fontWeight: 500, padding: 0,
      }}
    >
      View →
    </button>
  );
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'role', label: 'Role', render: row => <span className={`badge ${ROLE_COLORS[row.role]}`}>{ROLE_LABELS[row.role]}</span> },
  { key: 'actions', label: '', sortable: false, render: row => <ViewBtn id={row.id} /> },
];

const FORM_FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Full name (Min 20 characters)' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 chars with one special char and one uppercase letter' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'Street address' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(createSchema) });

  async function fetchUsers() {
    try {
      const res = await client('users', { params: { ...filters, role: roleFilter, sortBy, sortOrder } });
      setUsers(res.data);
    } catch {}
  }

  useEffect(() => { fetchUsers(); }, [filters, roleFilter, sortBy, sortOrder]);

  async function onSubmit(data) {
    try {
      setServerError('');
      await client('users', { body: data });
      reset(); setShowForm(false); fetchUsers();
    } catch (err) { setServerError(err.message || 'Failed to create user'); }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: '-0.5px' }}>Users</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>{users.length} total</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 28, marginBottom: 24, animation: 'fadeUp 0.3s ease' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 400, margin: '0 0 20px' }}>New User</h2>
          {serverError && (
            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--error)' }}>
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FORM_FIELDS.map(f => (
              <div key={f.name}>
                <label className="form-label">{f.label}</label>
                <input {...register(f.name)} type={f.type} placeholder={f.placeholder} />
                {errors[f.name] && <p className="form-error">{errors[f.name].message}</p>}
              </div>
            ))}
            <div>
              <label className="form-label">Role</label>
              <select {...register('role')}>
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Creating…' : 'Create User'}
              </button>
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <SortableTable
        columns={COLUMNS}
        data={users}
        filters={[
          { key: 'name', label: 'Name', value: filters.name },
          { key: 'email', label: 'Email', value: filters.email },
          { key: 'address', label: 'Address', value: filters.address },
        ]}
        onFilterChange={(key, value) => setFilters(f => ({ ...f, [key]: value }))}
        onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
      />
    </Layout>
  );
}
