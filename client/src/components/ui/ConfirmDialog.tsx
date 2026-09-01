import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal.js';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  isDangerous = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div
            className={`p-3 rounded-2xl ${
              isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isDangerous ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            <p className="text-sm text-stone-500 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-medium text-white rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2 ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
