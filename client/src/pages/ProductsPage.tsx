import React, { useState, useEffect, useCallback } from 'react';
import type { Product, Category, PageRoute } from '../types/index.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/product/ProductCard.js';
import { ProductFilters } from '../components/product/ProductFilters.js';
import { ProductDetailModal } from '../components/product/ProductDetailModal.js';
import { OrderContactModal } from '../components/product/OrderContactModal.js';
import { Sparkles, PackageOpen } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch filtered products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategory || undefined,
        search: searchQuery.trim() || undefined,
        featured: onlyFeatured || undefined,
        sort: sortBy || undefined,
        limit: 50,
      });

      if (res.success && res.data) {
        setProducts(res.data);
        setTotalResults(res.pagination?.total || res.data.length);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, onlyFeatured, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Danh Mục Sản Phẩm Chính Hãng
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white">
            Các Sản Phẩm Từ <span className="text-gold-gradient">Ong Dú Việt Nam</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            100% mật ong dú đa hoa rừng nguyên chất, keo ong Propolis và phấn hoa sấy lạnh. Đảm bảo giữ trọn vẹn hương vị tự nhiên và hoạt tính sinh học cao nhất.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyFeatured={onlyFeatured}
          onToggleFeatured={setOnlyFeatured}
          totalResults={totalResults}
        />

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-stone-900/80 rounded-3xl p-5 border border-stone-800 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-stone-800 rounded-2xl" />
                <div className="h-4 bg-stone-800 rounded-md w-1/3" />
                <div className="h-6 bg-stone-800 rounded-md w-3/4" />
                <div className="h-4 bg-stone-800 rounded-md w-full" />
                <div className="h-10 bg-stone-800 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setSelectedProduct(prod)}
                onOrder={(prod) => setOrderProduct(prod)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-stone-900/80 rounded-3xl p-12 text-center border border-stone-800 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-700/40">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Không tìm thấy sản phẩm</h3>
            <p className="text-xs text-stone-400">
              Không có sản phẩm nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử đổi từ khóa hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setOnlyFeatured(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold rounded-xl text-xs hover:brightness-110 transition-colors shadow-xs"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOrder={(prod) => {
          setSelectedProduct(null);
          setOrderProduct(prod);
        }}
      />

      {/* Order / Contact Modal */}
      <OrderContactModal
        product={orderProduct}
        isOpen={Boolean(orderProduct)}
        onClose={() => setOrderProduct(null)}
      />
    </div>
  );
};
