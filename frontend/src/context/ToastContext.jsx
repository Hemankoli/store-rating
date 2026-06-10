import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(ts => ts.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 220);
  }, []);

  const add = useCallback((type, title, message, duration = 4000) => {
    const id = ++counter.current;
    setToasts(ts => [...ts, { id, type, title, message, exiting: false }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = {
    success: (title, message) => add('success', title, message),
    error:   (title, message) => add('error', title, message),
    info:    (title, message) => add('info', title, message),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
