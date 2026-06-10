import { useState } from 'react';

function SkeletonRows({ columns, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
      {columns.map(col => (
        <td key={col.key} style={{ padding: '14px 16px' }}>
          <span
            className="skeleton"
            style={{
              width: col.key === 'actions' || col.key === 'assignOwner' ? 60 : `${55 + (i * 13 + col.key.length * 7) % 35}%`,
              height: 14,
            }}
          />
        </td>
      ))}
    </tr>
  ));
}

export default function SortableTable({ columns, data, onSort, filters, onFilterChange, loading = false }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  function handleSort(field) {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    if (onSort) onSort(field, newOrder);
  }

  return (
    <div>
      {filters && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <input
              key={f.key}
              placeholder={`Search ${f.label}…`}
              value={f.value}
              onChange={e => onFilterChange(f.key, e.target.value)}
              style={{ width: 180 }}
            />
          ))}
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
              {columns.map(col => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: isSorted ? 'var(--accent)' : 'var(--subtle)',
                      cursor: col.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { if (col.sortable !== false) e.currentTarget.style.color = isSorted ? 'var(--accent)' : 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = isSorted ? 'var(--accent)' : 'var(--subtle)'; }}
                  >
                    {col.label}
                    {isSorted && (
                      <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.8 }}>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                    {col.sortable !== false && !isSorted && (
                      <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.3 }}>↕</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows columns={columns} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '60px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 32, opacity: 0.2 }}>◫</span>
                    <span style={{ color: 'var(--subtle)', fontSize: 14 }}>No records found</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  style={{
                    borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none',
                    backgroundColor: 'var(--card)',
                    transition: 'background-color 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(63,63,70,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--card)'; }}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '13px 16px', fontSize: 14, color: 'var(--text)' }}>
                      {col.render ? col.render(row) : (row[col.key] ?? <span style={{ color: 'var(--subtle)' }}>—</span>)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
