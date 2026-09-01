import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Product, PageRoute } from '../../types/index.js';
import { ProductCard } from '../product/ProductCard.js';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
  onNavigate: (route: PageRoute) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  isLoading,
  onSelectProduct,
  onOrderProduct,
  onNavigate,
}) => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#081711] via-[#0e2c20] to-[#123b2a] text-stone-100 relative overflow-hidden border-b border-[#1d523c]/40">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[#d49a2a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d49a2a]" />
              Sản Phẩm Tiêu Biểu
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Tinh Hoa Ong Dú <span className="text-gold-gradient">Tuyển Chọn</span>
            </h2>
            <p className="text-base text-emerald-100/70">
              Các dòng sản phẩm mật ong dú đa hoa rừng, keo ong Propolis và chế phẩm tự nhiên thượng hạng.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#f0cf7e] hover:text-[#faecd0] hover:gap-3 transition-all group shrink-0 cursor-pointer"
          >
            <span>Xem tất cả ({products.length}+ sản phẩm)</span>
            <ArrowRight className="w-4 h-4 text-[#d49a2a]" />
          </button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#0e2c20]/80 rounded-3xl p-6 border border-[#206147]/50 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-[#091f16] rounded-2xl" />
                <div className="h-4 bg-[#091f16] rounded-md w-1/3" />
                <div className="h-6 bg-[#091f16] rounded-md w-3/4" />
                <div className="h-4 bg-[#091f16] rounded-md w-full" />
                <div className="h-10 bg-[#091f16] rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0e2c20]/50 rounded-3xl border border-[#206147]/40">
            <p className="text-emerald-100/60">Đang cập nhật danh mục sản phẩm nổi bật...</p>
          </div>
        )}
      </div>
    </section>
  );
};
