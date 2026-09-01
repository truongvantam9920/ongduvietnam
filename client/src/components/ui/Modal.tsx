import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={`relative w-full ${maxWidthClasses} transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all duration-300 border border-stone-100 my-4 sm:my-8 max-h-[92vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-stone-100 px-5 sm:px-6 py-3.5 sm:py-4 bg-amber-50/60 shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif leading-snug">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {!title && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 rounded-full p-2 bg-white/80 text-stone-500 hover:bg-white hover:text-stone-900 shadow-md backdrop-blur-sm transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
