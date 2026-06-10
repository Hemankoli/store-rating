import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SortableTable from '../../components/SortableTable';
import RatingStars from '../../components/RatingStars';
import client from '../../api/client';

export default function UserStoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pendingRatings, setPendingRatings] = useState({});

  async function fetchStores() {
    try {
      const res = await client('stores', { params: { ...filters, sortBy, sortOrder } });
      setStores(res.data);
    } catch {}
  }

  useEffect(() => { fetchStores(); }, [filters, sortBy, sortOrder]);

  async function handleRate(store, value) {
    try {
      if (store.userRating != null && store._ratingId) {
        await client(`ratings/${store._ratingId}`, { method: 'PATCH', body: { value } });
      } else {
        await client('ratings', { body: { storeId: store.id, value } });
      }
      fetchStores();
    } catch (err) {
      alert(err.message || 'Failed to submit rating');
    }
  }

  const COLUMNS = [
    { key: 'name', label: 'Store' },
    { key: 'address', label: 'Address' },
    {
      key: 'avgRating',
      label: 'Overall',
      render: row => row.avgRating != null ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--accent)' }}>★</span>
          <span style={{ fontWeight: 600 }}>{row.avgRating.toFixed(1)}</span>
          <span style={{ color: 'var(--subtle)', fontSize: 12 }}>/5</span>
        </span>
      ) : <span style={{ color: 'var(--subtle)', fontSize: 13 }}>No ratings</span>,
    },
    {
      key: 'userRating',
      label: 'Your Rating',
      sortable: false,
      render: row => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RatingStars
            value={pendingRatings[row.id] ?? row.userRating}
            onSelect={v => {
              setPendingRatings(p => ({ ...p, [row.id]: v }));
              handleRate(row, v);
            }}
          />
          {(pendingRatings[row.id] ?? row.userRating) != null && (
            <span style={{ fontSize: 12, color: 'var(--subtle)' }}>
              {pendingRatings[row.id] ?? row.userRating}/5
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: '-0.5px' }}>
          Stores
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
          Click the stars to rate any store
        </p>
      </div>
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
