import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { Category } from '../../types/index.js';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onlyFeatured: boolean;
  onToggleFeatured: (val: boolean) => void;
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onlyFeatured,
  onToggleFeatured,
  totalResults,
}) => {
  return (
    <div className="bg-stone-900/90 rounded-3xl p-6 border border-stone-800 shadow-xl shadow-stone-950/60 space-y-6 text-stone-200">
      {/* Top row: Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-5 h-5 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm mật ong dú, keo ong Propolis, phấn hoa..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-sm text-white placeholder-stone-500 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Featured Filter Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Featured checkbox chip */}
          <button
            type="button"
            onClick={() => onToggleFeatured(!onlyFeatured)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all ${
              onlyFeatured
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${onlyFeatured ? 'text-stone-950' : 'text-amber-400'}`} />
            <span>Nổi Bật</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-xs sm:text-sm font-semibold text-stone-200 bg-stone-950 outline-hidden cursor-pointer"
            >
              <option value="">Sắp xếp: Mặc định</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="newest">Sản phẩm mới nhất</option>
              <option value="name">Tên sản phẩm A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills List */}
      <div className="border-t border-stone-800/80 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800/80'
            }`}
          >
            Tất Cả Sản Phẩm
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800/80'
              }`}
            >
              {cat.name} {cat.product_count !== undefined ? `(${cat.product_count})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter info */}
      <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-800/80 pt-3">
        <span>Hiển thị <strong className="text-amber-400">{totalResults}</strong> sản phẩm phù hợp</span>
        {(selectedCategory || searchQuery || onlyFeatured) && (
          <button
            onClick={() => {
              onSelectCategory('');
              onSearchChange('');
              onToggleFeatured(false);
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
