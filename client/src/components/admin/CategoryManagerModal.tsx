import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, FolderTree } from 'lucide-react';
import type { Category } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onRefresh: () => void;
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setIsSlugManual(false);
    setDescription('');
    setOrderIndex(0);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIsSlugManual(true);
    setDescription(cat.description || '');
    setOrderIndex(cat.order_index);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManual || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Tên danh mục không được để trống.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.updateCategory(editingId, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          order_index: orderIndex,
        });
        success(`Đã cập nhật danh mục '${name}' thành công!`);
      } else {
        await api.createCategory({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          order_index: orderIndex,
        });
        success(`Đã thêm danh mục '${name}' thành công!`);
      }
      resetForm();
      onRefresh();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Lỗi khi lưu danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục '${cat.name}'? Các sản phẩm trong danh mục này sẽ chuyển sang trạng thái chưa phân loại.`)) {
      return;
    }

    try {
      await api.deleteCategory(cat.id);
      success(`Đã xóa danh mục '${cat.name}' thành công!`);
      onRefresh();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể xóa danh mục.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quản Lý Danh Mục Sản Phẩm" maxWidth="3xl">
      <div className="space-y-6 text-sm text-stone-700">
        {/* Add/Edit Category Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
          <div className="flex items-center justify-between font-bold text-amber-900 text-xs">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-amber-700" />
              {editingId ? 'Chỉnh sửa thông tin danh mục' : 'Thêm mới danh mục sản phẩm'}
            </span>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-stone-500 hover:text-stone-800 text-[11px] underline"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tên danh mục:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Mật Ong Dú Rừng"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Đường dẫn slug:</label>
                {name && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManual(false);
                      setSlug(slugify(name));
                    }}
                    className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
                  >
                    Tạo lại tự động
                  </button>
                )}
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="Tự động tạo theo tên (VD: mat-ong-du-rung)"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Mô tả ngắn danh mục:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả về đặc điểm nhóm sản phẩm này..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục'}</span>
            </button>
          </div>
        </form>

        {/* Existing Categories Table */}
        <div className="border border-stone-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
              <tr>
                <th className="p-3">Tên Danh Mục</th>
                <th className="p-3">Slug</th>
                <th className="p-3 text-center">Số Sản Phẩm</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="p-3 font-semibold text-stone-900">{cat.name}</td>
                  <td className="p-3 font-mono text-stone-500">{cat.slug}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">
                      {cat.product_count || 0}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-stone-400">
                    Chưa có danh mục sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
