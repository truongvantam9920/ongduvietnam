import React, { useState, useEffect, useCallback } from 'react';
import {
  Package, Plus, FolderTree, Search, Filter, RefreshCw,
  Edit2, Trash2, Eye, EyeOff, Sparkles, CheckCircle2,
  XCircle, LogOut, Key, Globe, ExternalLink
} from 'lucide-react';
import type { Product, Category, AdminStats as AdminStatsType, PageRoute } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { AdminStats } from '../components/admin/AdminStats.js';
import { ProductFormModal } from '../components/admin/ProductFormModal.js';
import { CategoryManagerModal } from '../components/admin/CategoryManagerModal.js';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal.js';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.js';
import { formatVND } from '../components/product/ProductCard.js';

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'featured' | 'outofstock'>('all');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Delete product confirm
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('admin-login');
    }
  }, [isAuthenticated, onNavigate]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, statsRes] = await Promise.all([
        api.getProducts({ all: true, limit: 100 }),
        api.getCategories(),
        api.getAdminStats(),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể tải dữ liệu quản trị.');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Quick Toggle Handler
  const handleToggle = async (id: number, field: 'is_active' | 'is_featured' | 'in_stock') => {
    try {
      const res = await api.toggleProductStatus(id, field);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, [field]: res.data[field] } : p))
        );
        success(res.message);
        // Refresh stats
        const statsRes = await api.getAdminStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái.');
    }
  };

  // Delete Action
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteProduct(productToDelete.id);
      success(res.message);
      setProductToDelete(null);
      loadData();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể xóa sản phẩm.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products on client side
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && String(product.category_id) !== selectedCategory && product.category_slug !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = (product.short_description || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    if (statusFilter === 'active' && !product.is_active) return false;
    if (statusFilter === 'inactive' && product.is_active) return false;
    if (statusFilter === 'featured' && !product.is_featured) return false;
    if (statusFilter === 'outofstock' && product.in_stock) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 pb-20">
      {/* Top Admin Navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Title & Brand */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 flex items-center justify-center text-base sm:text-lg shadow-xs shrink-0">
                🐝
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold font-serif text-amber-400 leading-tight truncate">
                  Quản Trị Ong Dú
                </h1>
                <span className="text-[10px] sm:text-[11px] text-stone-400 block truncate">
                  Admin: <strong className="text-stone-300 font-mono">{user?.username || 'admin'}</strong>
                </span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Xem trang chủ ngoài website"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Website</span>
              </button>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Đổi mật khẩu"
              >
                <Key className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden md:inline">Đổi mật khẩu</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onNavigate('admin-login');
                }}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-800/60 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-5 sm:space-y-8">
        {/* 1. Statistics Cards */}
        <AdminStats stats={stats} isLoading={isLoading} />

        {/* 2. Management Toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3.5">
          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              className="flex-1 px-3 sm:px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Thêm Sản Phẩm</span>
            </button>

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 px-3 sm:px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FolderTree className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="truncate">Danh Mục</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="space-y-2.5">
            {/* Search Box */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-hidden bg-stone-50"
              />
            </div>

            {/* Select Dropdowns Grid */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 font-medium outline-hidden cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'all' || val === 'active' || val === 'inactive' || val === 'featured' || val === 'outofstock') {
                    setStatusFilter(val);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 font-medium outline-hidden cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hiển thị</option>
                <option value="inactive">Đang ẩn</option>
                <option value="featured">Ghim nổi bật</option>
                <option value="outofstock">Tạm hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Products List */}
        {/* Mobile View: Responsive Product Cards (Block on Mobile, Hidden on Desktop) */}
        <div className="block lg:hidden space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3.5"
            >
              {/* Product Header Row */}
              <div className="flex gap-3 items-start">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-200 bg-stone-50 shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 bg-amber-100/80 text-amber-900 font-bold rounded-md text-[10px]">
                      {product.category_name || 'Chưa phân loại'}
                    </span>
                    {product.volume && (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-600 font-semibold rounded-md text-[10px]">
                        {product.volume}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug font-serif">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-extrabold text-amber-700 font-serif text-base">
                      {formatVND(product.price)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-[11px] text-stone-400 line-through">
                        {formatVND(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Status Toggles Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggle(product.id, 'is_active')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    product.is_active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {product.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{product.is_active ? 'Hiển thị' : 'Đang ẩn'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(product.id, 'is_featured')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    product.is_featured
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{product.is_featured ? 'Nổi bật' : 'Thường'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(product.id, 'in_stock')}
                  className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    product.in_stock
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {product.in_stock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{product.in_stock ? 'Còn hàng' : 'Hết hàng'}</span>
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProductToEdit(product);
                    setIsProductModalOpen(true);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Chỉnh Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductToDelete(product)}
                  className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-400 text-xs">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}
        </div>

        {/* Desktop View: Full Table (Hidden on Mobile, Block on Desktop) */}
        <div className="hidden lg:block bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4">Ảnh</th>
                  <th className="py-4 px-4">Tên Sản Phẩm / Mã</th>
                  <th className="py-4 px-4">Danh Mục & Quy Cách</th>
                  <th className="py-4 px-4">Giá Bán (VND)</th>
                  <th className="py-4 px-3 text-center">Hiển Thị</th>
                  <th className="py-4 px-3 text-center">Nổi Bật</th>
                  <th className="py-4 px-3 text-center">Còn Hàng</th>
                  <th className="py-4 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-amber-50/40 transition-colors">
                    {/* Image Thumbnail */}
                    <td className="py-3 px-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 bg-stone-50 shadow-2xs"
                      />
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-stone-900 text-sm line-clamp-1 font-serif">
                        {product.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-400 truncate mt-0.5">
                        /{product.slug}
                      </div>
                    </td>

                    {/* Category & Volume */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 bg-amber-100/80 text-amber-900 font-semibold rounded-md text-[11px]">
                        {product.category_name || 'Chưa phân loại'}
                      </span>
                      {product.volume && (
                        <div className="text-[11px] text-stone-500 font-medium mt-1">
                          {product.volume}
                        </div>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-amber-800 font-serif text-sm">
                        {formatVND(product.price)}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-[11px] text-stone-400 line-through">
                          {formatVND(product.original_price)}
                        </div>
                      )}
                    </td>

                    {/* Toggle: Active */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggle(product.id, 'is_active')}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          product.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                        }`}
                        title={product.is_active ? 'Đang hiển thị công khai (Bấm để ẩn)' : 'Đang ẩn (Bấm để hiện)'}
                      >
                        {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Toggle: Featured */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggle(product.id, 'is_featured')}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          product.is_featured
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                        }`}
                        title={product.is_featured ? 'Đang ghim nổi bật (Bấm để bỏ ghim)' : 'Chưa ghim nổi bật (Bấm để ghim)'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Toggle: Stock */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggle(product.id, 'in_stock')}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          product.in_stock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title={product.in_stock ? 'Đang còn hàng (Bấm để chuyển hết hàng)' : 'Hết hàng (Bấm để chuyển còn hàng)'}
                      >
                        {product.in_stock ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setProductToEdit(product);
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      Không tìm thấy sản phẩm nào trong danh sách.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={loadData}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefresh={loadData}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Confirm Delete Product Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
        title="Xác Nhận Xóa Sản Phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa Sản Phẩm"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
