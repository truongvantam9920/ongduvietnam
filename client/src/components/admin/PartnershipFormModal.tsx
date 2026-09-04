import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Sparkles, Check, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import type { PartnershipProgram, PartnershipFormData } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { slugify } from '../../utils/formatters.js';
import { CONTACT_INFO } from '../../constants/contact.js';

interface PartnershipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  programToEdit?: PartnershipProgram | null;
}

export const PartnershipFormModal: React.FC<PartnershipFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  programToEdit,
}) => {
  const isEditing = Boolean(programToEdit);
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [requirements, setRequirements] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [contactPhone, setContactPhone] = useState(CONTACT_INFO.hotline);
  const [contactZalo, setContactZalo] = useState(CONTACT_INFO.zaloNumber);
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState(0);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (programToEdit) {
      setTitle(programToEdit.title);
      setSlug(programToEdit.slug);
      setIsSlugManual(true);
      setSubtitle(programToEdit.subtitle || '');
      setSummary(programToEdit.summary);
      setContent(programToEdit.content);
      setBenefits(Array.isArray(programToEdit.benefits) ? programToEdit.benefits : []);
      setRequirements(programToEdit.requirements || '');
      setImageUrl(programToEdit.image_url);
      setContactPhone(programToEdit.contact_phone || CONTACT_INFO.hotline);
      setContactZalo(programToEdit.contact_zalo || CONTACT_INFO.zaloNumber);
      setIsActive(Boolean(programToEdit.is_active));
      setOrderIndex(programToEdit.order_index);
    } else {
      setTitle('');
      setSlug('');
      setIsSlugManual(false);
      setSubtitle('');
      setSummary('');
      setContent('');
      setBenefits([
        'Ký hợp đồng bao tiêu đầu ra 100% sản lượng mật & keo ong',
        'Cung ứng nguồn giống thuần hóa F1 sung mãn, năng suất cao',
        'Chuyển giao kỹ thuật chia đàn và hút mật vô trùng chuẩn khoa học',
        'Hỗ trợ kỹ thuật viên đồng hành 24/7 trong suốt quá trình nuôi'
      ]);
      setRequirements('Có diện tích vườn cây ăn trái, cây lâm nghiệp hoặc khuôn viên xanh từ 100m² trở lên.');
      setImageUrl('');
      setContactPhone(CONTACT_INFO.hotline);
      setContactZalo(CONTACT_INFO.zaloNumber);
      setIsActive(true);
      setOrderIndex(0);
    }
  }, [programToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        setImageUrl(res.url);
        success('Đã tải lên hình ảnh chương trình thành công!');
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Tải lên hình ảnh thất bại.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddBenefit = () => {
    if (!newBenefitInput.trim()) return;
    setBenefits([...benefits, newBenefitInput.trim()]);
    setNewBenefitInput('');
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error('Vui lòng nhập tiêu đề chương trình hợp tác.');
      return;
    }

    if (!summary.trim() || !content.trim()) {
      error('Vui lòng nhập tóm tắt và nội dung chi tiết.');
      return;
    }

    if (!imageUrl.trim()) {
      error('Vui lòng tải lên ảnh đại diện cho chương trình.');
      return;
    }

    const payload: PartnershipFormData = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      summary: summary.trim(),
      content: content.trim(),
      benefits,
      requirements: requirements.trim() || undefined,
      image_url: imageUrl.trim(),
      contact_phone: contactPhone.trim() || undefined,
      contact_zalo: contactZalo.trim() || undefined,
      is_active: isActive,
      order_index: orderIndex,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && programToEdit) {
        const res = await api.updatePartnership(programToEdit.id, payload);
        success(res.message);
      } else {
        const res = await api.createPartnership(payload);
        success(res.message);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Lỗi khi lưu chương trình hợp tác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Chương Trình Hợp Tác Trại Ong' : 'Đăng Tải Chương Trình Hợp Tác Trại Ong Mới'}
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm text-stone-700">
        {/* Title and Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Tiêu đề chương trình hợp tác <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Chính Sách Liên Kết Mở Rộng Trại Nuôi Ong Dú & Bao Tiêu Đầu Ra 100%"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-800">Đường dẫn slug:</label>
              {title && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false);
                    setSlug(slugify(title));
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
              placeholder="Tự động tạo theo tiêu đề"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Phụ đề / Thông điệp nổi bật:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="VD: Hợp tác phát triển kinh tế sinh thái bền vững cùng Ong Dú Việt Nam"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
            />
          </div>
        </div>

        {/* Image Upload Box */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
          <label className="block text-xs font-bold text-stone-800">
            Hình ảnh đại diện chương trình <span className="text-rose-500">*</span>:
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-32 h-24 rounded-2xl bg-white border border-stone-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Ảnh chương trình"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/product-hive-box.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                    title="Xóa ảnh"
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

            <div className="flex-1 space-y-2 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs ${
                    isUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{imageUrl ? 'Đổi ảnh đại diện' : 'Tải ảnh chương trình lên'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
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

        {/* Summary & Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Tóm tắt ngắn gọn <span className="text-rose-500">*</span>:
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn quyền lợi và nội dung để hiển thị ngoài trang chủ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Nội dung chi tiết chương trình <span className="text-rose-500">*</span>:
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chi tiết các bước hợp tác, quy trình ký kết, phương thức bao tiêu và chuyển giao kỹ thuật..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Benefits List Builder */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
          <label className="block text-xs font-bold text-emerald-950">
            Danh sách quyền lợi chính cam kết cho đối tác:
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefitInput}
              onChange={(e) => setNewBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBenefit();
                }
              }}
              placeholder="VD: Ký hợp đồng bao tiêu 100% đầu ra theo giá bảo hộ..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-xs outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddBenefit}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm quyền lợi</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <span>• {b}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Xóa quyền lợi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Yêu cầu điều kiện đối với đối tác tham gia:
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="VD: Có diện tích vườn cây ăn trái từ 100m² trở lên, không phun xịt thuốc hóa học..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Hotline tư vấn:</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder={`VD: ${CONTACT_INFO.hotline}`}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Số Zalo tiếp nhận:</label>
            <input
              type="text"
              value={contactZalo}
              onChange={(e) => setContactZalo(e.target.value)}
              placeholder={`VD: ${CONTACT_INFO.zaloNumber}`}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Thứ tự hiển thị:</label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
          <input
            type="checkbox"
            id="is_active_partnership"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded-sm cursor-pointer"
          />
          <label htmlFor="is_active_partnership" className="text-xs font-bold text-stone-800 cursor-pointer">
            Hiển thị công khai chương trình này trên Trang Chủ
          </label>
        </div>

        {/* Modal Submit Actions */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#0c1a13] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isEditing ? 'Lưu Thay Đổi' : 'Đăng Tải Lên Trang Chủ'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
