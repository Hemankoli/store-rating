import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../../components/Layout';
import SortableTable from '../../components/SortableTable';
import RatingStars from '../../components/RatingStars';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useIsMobile from '../../hooks/useIsMobile';

const createSchema = z.object({
  name: z.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().max(400, 'Max 400 characters'),
  ownerId: z.string().uuid('Must be a valid UUID').optional().or(z.literal('')),
});

const FORM_FIELDS = [
  { name: 'name', label: 'Store Name', type: 'text', placeholder: 'Store name (Min 20 characters)' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'store@example.com' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'Street address' },
];

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [owners, setOwners] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [assignOwnerId, setAssignOwnerId] = useState('');
  const [assignError, setAssignError] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(createSchema) });

  async function fetchStores() {
    try {
      const res = await client('stores', { params: { ...filters, sortBy, sortOrder } });
      setStores(res.data);
    } catch {}
  }

  async function fetchOwners() {
    try {
      const res = await client('users', { params: { role: 'store_owner' } });
      setOwners(res.data);
    } catch {}
  }

  async function assignOwner(storeId) {
    try {
      setAssignError('');
      await client(`stores/${storeId}`, { method: 'PATCH', body: { ownerId: assignOwnerId || null } });
      setAssigningId(null);
      fetchStores();
      toast.success('Owner assigned', 'Store owner updated successfully.');
    } catch (err) {
      setAssignError(err.message || 'Failed to assign owner');
    }
  }

  useEffect(() => { fetchStores(); }, [filters, sortBy, sortOrder]);

  async function onSubmit(data) {
    try {
      setServerError('');
      const payload = { ...data, ownerId: data.ownerId || undefined };
      await client('stores', { body: payload });
      reset(); setShowForm(false); fetchStores();
      toast.success('Store created', 'The new store has been added.');
    } catch (err) { setServerError(err.message || 'Failed to create store'); }
  }

  const COLUMNS = [
    { key: 'name', label: 'Store Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'ownerName',
      label: 'Owner',
      render: row => row.ownerName
        ? <span style={{ fontWeight: 500 }}>{row.ownerName}</span>
        : <span style={{ color: 'var(--subtle)' }}>—</span>,
    },
    {
      key: 'avgRating',
      label: 'Rating',
      render: row => row.avgRating != null ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--accent)', fontSize: 14 }}>★</span>
          <span style={{ fontWeight: 500 }}>{row.avgRating.toFixed(2)}</span>
        </span>
      ) : <span style={{ color: 'var(--subtle)' }}>—</span>,
    },
    {
      key: 'assignOwner',
      label: '',
      sortable: false,
      render: row => assigningId === row.id ? (
        <span style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={assignOwnerId}
            onChange={e => setAssignOwnerId(e.target.value)}
            style={{ fontSize: 13 }}
          >
            <option value="">No owner</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <button className="btn-primary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => assignOwner(row.id)}>Save</button>
          <button className="btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => { setAssigningId(null); setAssignError(''); }}>Cancel</button>
          {assignError && <span style={{ color: 'var(--error)', fontSize: 12 }}>{assignError}</span>}
        </span>
      ) : (
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 500, padding: 0 }}
          onClick={() => { fetchOwners(); setAssigningId(row.id); setAssignOwnerId(row.ownerId ?? ''); setAssignError(''); }}
        >
          Assign Owner
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: '-0.5px' }}>Stores</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>{stores.length} registered</p>
        </div>
        <button
          onClick={() => {
            if (!showForm) fetchOwners();
            setShowForm(s => !s);
          }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Cancel' : '+ Add Store'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 28, marginBottom: 24, animation: 'fadeUp 0.3s ease' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 400, margin: '0 0 20px' }}>New Store</h2>
          {serverError && (
            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--error)' }}>
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {FORM_FIELDS.map(f => (
              <div key={f.name}>
                <label className="form-label">{f.label}</label>
                <input {...register(f.name)} type={f.type} placeholder={f.placeholder} />
                {errors[f.name] && <p className="form-error">{errors[f.name].message}</p>}
              </div>
            ))}
            <div>
              <label className="form-label">Owner (optional)</label>
              <select {...register('ownerId')}>
                <option value="">No owner</option>
                {owners.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              {errors.ownerId && <p className="form-error">{errors.ownerId.message}</p>}
            </div>
            <div style={{ gridColumn: '1 / -1', paddingTop: 4 }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Creating…' : 'Create Store'}
              </button>
            </div>
          </form>
        </div>
      )}

      <SortableTable
        columns={COLUMNS}
        data={stores}
        filters={[
          { key: 'name', label: 'Name', value: filters.name },
          { key: 'address', label: 'Address', value: filters.address },
        ]}
        onFilterChange={(key, value) => setFilters(f => ({ ...f, [key]: value }))}
        onSort={(field, order) => { setSortBy(field); setSortOrder(order); }}
      />
    </Layout>
  );
}
