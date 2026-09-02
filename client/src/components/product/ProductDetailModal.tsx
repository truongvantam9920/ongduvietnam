import React, { useState } from 'react';
import { X, Check, ShieldCheck, Heart, Sparkles, PhoneCall, MessageSquare, Info, BookOpen, AlertCircle, MapPin, Share2 } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { Product } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { StockBadge, RatingBadge, FeaturedBadge } from '../ui/Badge.js';
import { formatVND } from '../../utils/formatters.js';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage' | 'preservation'>('desc');

  if (!product) return null;

  const allImages: string[] = [product.image_url];
  if (product.additional_images) {
    try {
      const parsed = JSON.parse(product.additional_images);
      if (Array.isArray(parsed)) {
        for (const img of parsed) {
          if (typeof img === 'string' && img.trim() && !allImages.includes(img)) {
            allImages.push(img);
          }
        }
      }
    } catch {
      // Ignore parse error
    }
  }

  const currentImage = activeImage || product.image_url;

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const { hotline, zaloNumber } = CONTACT_INFO;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 shadow-md">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {Boolean(product.is_featured) && (
              <div className="absolute top-3 left-3">
                <FeaturedBadge />
              </div>
            )}
            {discountPercent && (
              <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    currentImage === img ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees box */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2 text-xs text-stone-700">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam kết chất lượng Ong Dú Việt Nam</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Mật ong dú nguyên chất 100%, không pha đường, không qua xử lý nhiệt cô đặc. Hoàn tiền 200% nếu phát hiện hàng giả.
            </p>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category, Rating, Stock - with clearance for modal close button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-10 sm:pr-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-lg">
                {product.category_name || 'Mật Ong Dú Tự Nhiên'}
              </span>
              <div className="flex items-center gap-2">
                <RatingBadge rating={product.rating} reviewCount={product.review_count} />
                <StockBadge inStock={product.in_stock} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-tight">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <span className="text-xs text-stone-500 block mb-0.5">Giá sản phẩm:</span>
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-serif">
                    {formatVND(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatVND(product.original_price)}
                    </span>
                  )}
                </div>
              </div>

              {product.volume && (
                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60">
                  <span className="text-[11px] text-stone-500 block">Dung tích / Quy cách:</span>
                  <span className="text-sm font-bold text-stone-800">{product.volume}</span>
                </div>
              )}
            </div>

            {/* Origin */}
            {product.origin && (
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Xuất xứ: <strong>{product.origin}</strong></span>
              </div>
            )}

            {/* Tabs for details */}
            <div className="border-b border-stone-200 flex items-center gap-4 text-xs font-bold pt-2">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'desc' ? 'border-amber-600 text-amber-800' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Mô tả chi tiết
              </button>
              {product.ingredients && (
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === 'ingredients' ? 'border-amber-600 text-amber-800' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Thành phần
                </button>
              )}
              {product.usage_instructions && (
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === 'usage' ? 'border-amber-600 text-amber-800' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Cách dùng
                </button>
              )}
              {product.preservation && (
                <button
                  onClick={() => setActiveTab('preservation')}
                  className={`pb-2 border-b-2 transition-all ${
                    activeTab === 'preservation' ? 'border-amber-600 text-amber-800' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Bảo quản
                </button>
              )}
            </div>

            {/* Tab content area */}
            <div className="text-xs sm:text-sm text-stone-600 max-h-48 overflow-y-auto pr-2 leading-relaxed space-y-2">
              {activeTab === 'desc' && (
                <div className="whitespace-pre-line">{product.description || product.short_description}</div>
              )}
              {activeTab === 'ingredients' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>{product.ingredients}</p>
                </div>
              )}
              {activeTab === 'usage' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>{product.usage_instructions}</p>
                </div>
              )}
              {activeTab === 'preservation' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <p>{product.preservation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Main CTA: Chat & Order via Zalo */}
            <a
              href={`https://zalo.me/${zaloNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#0068FF] hover:bg-[#0058e0] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
            >
              <ZaloIcon className="w-5 h-5 rounded-[4px]" />
              <span>Liên hệ Zalo</span>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm border border-amber-200 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>0384575953</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
