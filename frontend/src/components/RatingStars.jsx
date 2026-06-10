import { useState } from 'react';

export default function RatingStars({ value, onSelect, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = !readonly && hovered ? hovered : (value || 0);

  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onSelect?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: readonly ? 'default' : 'pointer',
            fontSize: 18,
            lineHeight: 1,
            color: star <= display ? 'var(--accent)' : 'var(--border)',
            transform: !readonly && hovered >= star ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.1s, color 0.1s',
            filter: star <= display ? 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' : 'none',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
