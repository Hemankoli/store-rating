import { useState } from 'react';

export default function SortableTable({ columns, data, onSort, filters, onFilterChange }) {
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
              {columns.map(col => (
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
                    color: 'var(--subtle)',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { if (col.sortable !== false) e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { if (col.sortable !== false) e.currentTarget.style.color = sortField === col.key ? 'var(--accent)' : 'var(--subtle)'; }}
                >
                  <span style={{ color: sortField === col.key ? 'var(--accent)' : 'inherit' }}>
                    {col.label}
                    {sortField === col.key && (
                      <span style={{ marginLeft: 4, fontSize: 10 }}>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--subtle)', fontSize: 14 }}
                >
                  No records found
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
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface)'; }}
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
