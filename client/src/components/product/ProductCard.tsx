import React from 'react';
import { Eye, PhoneCall, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Product } from '../../types/index.js';
import { RatingBadge, StockBadge, FeaturedBadge } from '../ui/Badge.js';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onOrder,
}) => {
  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="bg-[#0e2c20]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#206147]/50 hover:border-[#d49a2a]/50 shadow-xl shadow-[#040e0a]/80 hover:shadow-2xl hover:shadow-[#d49a2a]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
      {/* Image Container with Luxury Glow */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#071911] cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#06160f]/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {Boolean(product.is_featured) && <FeaturedBadge />}
          {discountPercent && (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-rose-400/30">
              Giảm {discountPercent}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <StockBadge inStock={product.in_stock} />
        </div>

        {/* Volume tag overlay */}
        {product.volume && (
          <div className="absolute bottom-3 left-3 z-10 bg-[#0a2318]/90 backdrop-blur-md text-[#f0cf7e] text-xs font-semibold px-3 py-1 rounded-xl shadow-md border border-[#d49a2a]/30">
            {product.volume}
          </div>
        )}

        {/* Quick hover overlay button */}
        <div className="absolute inset-0 bg-[#071810]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-[#0b2419]/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-[#d49a2a]/40 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4 text-[#d49a2a]" />
            <span>Xem chi tiết</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-300" />
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d1fae5] bg-[#14412f] px-3 py-1 rounded-lg border border-[#276e50]/60">
              {product.category_name || 'Mật Ong Dú'}
            </span>
            <RatingBadge rating={product.rating} reviewCount={product.review_count} />
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 hover:text-[#f0cf7e] cursor-pointer transition-colors pt-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-emerald-100/70 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="space-y-4 pt-3 border-t border-[#1c553e]/60">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#e2b34d] tracking-tight">
              {formatVND(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatVND(product.original_price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onSelect(product)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-200 bg-[#12392a] hover:bg-[#1a4e3a] hover:text-white border border-[#246b4e]/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Chi tiết</span>
            </button>

            <button
              onClick={() => onOrder(product)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0c1a13] bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] shadow-md shadow-[#c6891e]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-[#0c1a13]" />
              <span>Đặt hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
