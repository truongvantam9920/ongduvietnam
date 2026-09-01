import React, { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      error('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      success('Đổi mật khẩu quản trị viên thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đổi Mật Khẩu Quản Trị Viên" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-stone-700">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Mật khẩu hiện tại:
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Mật khẩu mới (Tối thiểu 6 ký tự):
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Xác nhận mật khẩu mới:
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <span>Đang xử lý...</span> : (
              <>
                <Check className="w-4 h-4" />
                <span>Lưu Mật Khẩu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
