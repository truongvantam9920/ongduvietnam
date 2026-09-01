import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Sparkles, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { Product, Category, ProductFormData } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
  categories: Category[];
}

export function formatWithDots(val: number | string | undefined | null): string {
  if (val === '' || val === undefined || val === null) return '';
  const numStr = String(val).replace(/\D/g, '');
  if (!numStr) return '';
  return Number(numStr).toLocaleString('vi-VN');
}

export function parseFromDots(val: string): number | '' {
  const raw = val.replace(/\D/g, '');
  return raw === '' ? '' : Number(raw);
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  categories,
}) => {
  const isEditing = Boolean(productToEdit);
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [volume, setVolume] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [origin, setOrigin] = useState('Vườn ong dú Suối Cát, Cam Lâm, Khánh Hòa');
  const [ingredients, setIngredients] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [preservation, setPreservation] = useState('');
  
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setCategoryId(productToEdit.category_id || '');
      setShortDescription(productToEdit.short_description || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.original_price || '');
      setVolume(productToEdit.volume || '');
      setImageUrl(productToEdit.image_url || '');
      setIsFeatured(Boolean(productToEdit.is_featured));
      setIsActive(Boolean(productToEdit.is_active));
      setInStock(Boolean(productToEdit.in_stock));
      setOrigin(productToEdit.origin || 'Vườn ong dú Suối Cát, Cam Lâm, Khánh Hòa');
      setIngredients(productToEdit.ingredients || '');
      setUsageInstructions(productToEdit.usage_instructions || '');
      setPreservation(productToEdit.preservation || '');

      if (productToEdit.additional_images) {
        try {
          const parsed = JSON.parse(productToEdit.additional_images);
          setAdditionalImages(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
        } catch {
          setAdditionalImages([]);
        }
      } else {
        setAdditionalImages([]);
      }
    } else {
      // Reset defaults for new product
      setName('');
      setSlug('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setShortDescription('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setVolume('250ml');
      setImageUrl('');
      setAdditionalImages([]);
      setIsFeatured(false);
      setIsActive(true);
      setInStock(true);
      setOrigin('Vườn ong dú Suối Cát, Cam Lâm, Khánh Hòa');
      setIngredients('100% Mật ong dú tự nhiên nguyên chất');
      setUsageInstructions('Dùng 1-2 thìa cà phê mỗi sáng trước ăn hoặc pha nước ấm');
      setPreservation('Nơi khô ráo thoáng mát hoặc ngăn mát tủ lạnh');
    }
  }, [productToEdit, categories, isOpen]);

  const handleMainFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploadingMain(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        setImageUrl(res.url);
        success('Đã tải lên hình ảnh đại diện thành công!');
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Tải lên hình ảnh thất bại.');
    } finally {
      setIsUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleExtraFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - additionalImages.length;
    if (remainingSlots <= 0) {
      error('Đã đạt giới hạn tối đa 3 ảnh bổ sung.');
      e.target.value = '';
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      error(`Chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa (tối đa 3 ảnh bổ sung).`);
    }

    setIsUploadingExtra(true);
    try {
      const res = await api.uploadMultipleImages(filesToUpload);
      if (res.success && res.urls) {
        setAdditionalImages((prev) => [...prev, ...res.urls].slice(0, 3));
        success(`Đã tải lên ${res.urls.length} ảnh bổ sung thành công!`);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Tải lên hình ảnh bổ sung thất bại.');
    } finally {
      setIsUploadingExtra(false);
      e.target.value = '';
    }
  };

  const handleRemoveExtraImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      error('Vui lòng nhập tên sản phẩm.');
      return;
    }

    if (price === '' || Number(price) < 0) {
      error('Vui lòng nhập giá hợp lệ.');
      return;
    }

    if (!imageUrl.trim()) {
      error('Vui lòng cung cấp hình ảnh đại diện sản phẩm.');
      return;
    }

    const payload: ProductFormData = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      category_id: categoryId === '' ? null : Number(categoryId),
      short_description: shortDescription.trim(),
      description: description.trim(),
      price: Number(price),
      original_price: originalPrice === '' ? null : Number(originalPrice),
      volume: volume.trim() || undefined,
      image_url: imageUrl.trim(),
      additional_images: additionalImages,
      is_featured: isFeatured,
      is_active: isActive,
      in_stock: inStock,
      origin: origin.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      usage_instructions: usageInstructions.trim() || undefined,
      preservation: preservation.trim() || undefined,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && productToEdit) {
        await api.updateProduct(productToEdit.id, payload);
        success(`Đã cập nhật sản phẩm '${name}' thành công!`);
      } else {
        await api.createProduct(payload);
        success(`Đã thêm sản phẩm '${name}' thành công!`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi lưu sản phẩm.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm text-stone-700">
        {/* Basic Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Tên sản phẩm <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Mật Ong Dú Rừng Nguyên Chất Chai 250ml"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Danh mục sản phẩm:
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden bg-white cursor-pointer"
            >
              <option value="">-- Chưa phân loại --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Volume */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Giá bán (VND) <span className="text-rose-500">*</span>:
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                required
                value={formatWithDots(price)}
                onChange={(e) => setPrice(parseFromDots(e.target.value))}
                placeholder="VD: 520.000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-bold text-amber-800"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">
                đ
              </span>
            </div>
            {price !== '' && (
              <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                = {Number(price).toLocaleString('vi-VN')} VND
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Giá gốc / Giá niêm yết (VND):
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatWithDots(originalPrice)}
                onChange={(e) => setOriginalPrice(parseFromDots(e.target.value))}
                placeholder="VD: 590.000 (Nếu giảm giá)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">
                đ
              </span>
            </div>
            {originalPrice !== '' && (
              <span className="text-[11px] text-stone-500 mt-1 block">
                = {Number(originalPrice).toLocaleString('vi-VN')} VND
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Quy cách / Dung tích:
            </label>
            <input
              type="text"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="VD: 250ml, 500ml, 30ml, Hộp 200g"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden"
            />
          </div>
        </div>

        {/* Image Management */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
          {/* Section 1: Main Product Image (Max 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span>Hình ảnh đại diện sản phẩm</span>
                <span className="text-rose-500">*</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  (Tối đa 1 ảnh)
                </span>
              </label>
              {isUploadingMain && (
                <span className="text-xs text-amber-600 font-semibold animate-pulse">
                  Đang tải ảnh đại diện lên...
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Live Image Preview */}
              <div className="relative w-24 h-24 rounded-2xl bg-white border border-stone-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Ảnh đại diện" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Xoá ảnh đại diện"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                    <ImageIcon className="w-8 h-8 mb-1 text-stone-300" />
                    <span className="text-[10px]">Chưa chọn ảnh</span>
                  </div>
                )}
              </div>

              {/* Upload for Main Image */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs ${
                      isUploadingMain ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{imageUrl ? 'Đổi ảnh đại diện' : 'Tải ảnh đại diện lên'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainFileUpload}
                      disabled={isUploadingMain}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-stone-500">JPG, PNG, WebP (Tối đa 10MB)</span>
                </div>
                {imageUrl && (
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{imageUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Additional Images (Max 3) */}
          <div className="border-t border-stone-200 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <span>Ảnh bổ sung (Album phụ)</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  ({additionalImages.length}/3 ảnh)
                </span>
              </label>
              {isUploadingExtra && (
                <span className="text-xs text-amber-600 font-semibold animate-pulse">
                  Đang tải ảnh...
                </span>
              )}
            </div>

            {/* Direct Device Upload for Extra Images */}
            {additionalImages.length < 3 ? (
              <div className="flex flex-wrap items-center gap-2">
                <label
                  className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs transition-colors shadow-xs ${
                    isUploadingExtra ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Thêm ảnh phụ (còn {3 - additionalImages.length})
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraFilesUpload}
                    disabled={isUploadingExtra}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-stone-500">Tối đa 3 ảnh phụ</span>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã tải đủ tối đa 3 ảnh bổ sung cho sản phẩm này.</span>
              </div>
            )}

            {/* Uploaded Extra Images Thumbnails */}
            {additionalImages.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {additionalImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-200 bg-white shadow-xs"
                  >
                    <img src={img} alt={`Ảnh phụ ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded-md">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md cursor-pointer"
                      title="Xoá ảnh này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Mô tả ngắn (Hiển thị ngoài danh sách) <span className="text-rose-500">*</span>:
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="VD: Mật ong dú rừng nguyên chất 100%, vị ngọt thanh hậu chua dịu tự nhiên..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Mô tả chi tiết & công dụng:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thông tin công dụng, đặc điểm hương vị, chứng nhận..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs"
            />
          </div>
        </div>

        {/* Origin & Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Xuất xứ nguồn gốc:
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="VD: Vườn ong dú Suối Cát, Cam Lâm, Khánh Hòa"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Thành phần:
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="VD: 100% Mật ong dú tự nhiên nguyên chất"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Hướng dẫn sử dụng:
            </label>
            <input
              type="text"
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              placeholder="VD: Uống 1-2 thìa mỗi sáng cùng nước ấm..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Hướng dẫn bảo quản:
            </label>
            <input
              type="text"
              value={preservation}
              onChange={(e) => setPreservation(e.target.value)}
              placeholder="VD: Nơi khô ráo thoáng mát hoặc ngăn mát tủ lạnh..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>
        </div>

        {/* Toggles Status Checkboxes */}
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
            />
            <span className="font-bold text-stone-800 text-xs">Hiển thị công khai (Active)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
            />
            <span className="font-bold text-stone-800 text-xs">Ghim nổi bật trang chủ</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
            />
            <span className="font-bold text-stone-800 text-xs">Trạng thái còn hàng</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition-colors text-xs"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm Mới'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
