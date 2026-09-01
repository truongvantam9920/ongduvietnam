import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  const contextValue = useMemo(() => ({
    showToast,
    success,
    error,
    info,
  }), [showToast, success, error, info]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Overlay - Top Centered */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-md w-[92%] sm:w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md border text-xs sm:text-sm transition-all duration-300 transform translate-y-0 opacity-100 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/50'
                : 'bg-stone-900/95 text-amber-100 border-amber-500/40 shadow-stone-950/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            <div className="flex-1 font-semibold leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white shrink-0 p-1 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
