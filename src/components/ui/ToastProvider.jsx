import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const ToastContext = createContext(null);

const typeStyles = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const makeId = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message, type = 'info', timeout = 3500) => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timeoutId = setTimeout(() => removeToast(id), timeout);
    timeoutsRef.current.set(id, timeoutId);
  }, [removeToast]);

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutsRef.current.values()) {
        clearTimeout(timeoutId);
      }
      timeoutsRef.current.clear();
    };
  }, []);

  const value = useMemo(() => ({
    addToast,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-[2000] space-y-3 w-full max-w-sm"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border shadow-level-3 rounded-xl px-4 py-3 flex items-start space-x-3 ${typeStyles[toast.type] || typeStyles.info}`}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-atomic="true"
          >
            <Icon name={toast.type === 'error' ? 'AlertCircle' : toast.type === 'success' ? 'CheckCircle' : 'Info'} size={18} />
            <div className="flex-1 text-sm leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              type="button"
              aria-label="Dismiss notification"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
