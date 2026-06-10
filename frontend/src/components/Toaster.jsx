import { useToast } from '../context/ToastContext';

const ICONS = { success: '✓', error: '✕', info: 'i' };

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}${t.exiting ? ' exiting' : ''}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
