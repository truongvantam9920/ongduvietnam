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
      {/* Toast Notification Container (Top-right on desktop, Top-centered on mobile) */}
      <div className="fixed top-4 sm:top-6 right-0 sm:right-6 left-0 sm:left-auto sm:translate-x-0 z-50 flex flex-col items-center sm:items-end gap-2.5 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl border text-xs sm:text-sm transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-2 ${
              toast.type === 'success'
                ? 'bg-white/95 text-stone-800 border-emerald-500/30 shadow-emerald-950/10'
                : toast.type === 'error'
                ? 'bg-white/95 text-stone-800 border-rose-500/30 shadow-rose-950/10'
                : 'bg-white/95 text-stone-800 border-amber-500/30 shadow-amber-950/10'
            }`}
          >
            {toast.type === 'success' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 font-medium text-stone-800 leading-snug pt-0.5">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              title="Đóng"
            >
              <X className="w-3.5 h-3.5" />
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
