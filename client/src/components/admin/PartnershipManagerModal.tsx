import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Handshake, ExternalLink, RefreshCw } from 'lucide-react';
import type { PartnershipProgram } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { PartnershipFormModal } from './PartnershipFormModal.js';
import { ConfirmDialog } from '../ui/ConfirmDialog.js';

interface PartnershipManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnershipManagerModal: React.FC<PartnershipManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [programs, setPrograms] = useState<PartnershipProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<PartnershipProgram | null>(null);
  const [programToDelete, setProgramToDelete] = useState<PartnershipProgram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPartnerships(true);
      if (res.success) {
        setPrograms(res.data || []);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể tải danh sách hợp tác.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleToggle = async (id: number) => {
    try {
      const res = await api.togglePartnershipStatus(id);
      if (res.success) {
        setPrograms((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: res.data.is_active } : p))
        );
        success(res.message);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái.');
    }
  };

  const handleDelete = async () => {
    if (!programToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.deletePartnership(programToDelete.id);
      success(res.message);
      setProgramToDelete(null);
      loadData();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể xóa chương trình.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Quản Lý Chương Trình Hợp Tác Trại Ong Toàn Quốc" maxWidth="5xl">
        <div className="space-y-6 text-sm text-stone-700">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 font-serif">Mạng Lưới Liên Kết Trại Nuôi Ong Dú</h4>
                <p className="text-xs text-stone-500">Các bài viết và chính sách đăng tải trực tiếp lên mục Hợp Tác ở Trang Chủ.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={loadData}
                className="p-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                title="Tải lại danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setProgramToEdit(null);
                  setIsFormOpen(true);
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] text-[#0c1a13] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Chương Trình Mới</span>
              </button>
            </div>
          </div>

          {/* Programs Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Hình Ảnh</th>
                    <th className="p-3.5">Tiêu Đề Chương Trình</th>
                    <th className="p-3.5">Phụ Đề / Tóm Tắt</th>
                    <th className="p-3.5 text-center">Trạng Thái</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5 w-20">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                          <img
                            src={prog.image_url || '/images/product-hive-box.jpg'}
                            alt={prog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900 max-w-xs">
                        <div className="line-clamp-2">{prog.title}</div>
                        <div className="font-mono text-[10px] text-stone-400 font-normal mt-0.5">/{prog.slug}</div>
                      </td>
                      <td className="p-3.5 text-stone-600 max-w-sm">
                        <div className="line-clamp-2">{prog.summary}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(prog.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            prog.is_active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                          title={prog.is_active ? 'Bấm để ẩn khỏi trang chủ' : 'Bấm để hiển thị trên trang chủ'}
                        >
                          {prog.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{prog.is_active ? 'Đang hiện' : 'Đang ẩn'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setProgramToEdit(prog);
                              setIsFormOpen(true);
                            }}
                            className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
                            title="Chỉnh sửa chương trình"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProgramToDelete(prog)}
                            className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                            title="Xóa chương trình"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {programs.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-stone-400">
                        Chưa có bài viết / chương trình hợp tác nào. Nhấn "Thêm Chương Trình Mới" để đăng tải.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* Form Modal for Add / Edit */}
      <PartnershipFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setProgramToEdit(null);
        }}
        onSuccess={loadData}
        programToEdit={programToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(programToDelete)}
        onClose={() => setProgramToDelete(null)}
        onConfirm={handleDelete}
        title="Xác Nhận Xóa Chương Trình Hợp Tác"
        message={`Bạn có chắc chắn muốn xóa bài viết "${programToDelete?.title}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa Bài Viết"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </>
  );
};
