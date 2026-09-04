import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Package, Plus, FolderTree, Search, Filter, RefreshCw,
  Edit2, Trash2, Eye, EyeOff, Sparkles, CheckCircle2,
  XCircle, LogOut, Key, Globe, ExternalLink, Download, Upload,
  Handshake, FileText
} from 'lucide-react';
import type { Product, Category, AdminStats as AdminStatsType, PageRoute, PartnershipProgram } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { AdminStats } from '../components/admin/AdminStats.js';
import { ProductFormModal } from '../components/admin/ProductFormModal.js';
import { CategoryManagerModal } from '../components/admin/CategoryManagerModal.js';
import { PartnershipFormModal } from '../components/admin/PartnershipFormModal.js';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal.js';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.js';
import { formatVND } from '../utils/formatters.js';
import { CONTACT_INFO } from '../constants/contact.js';

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const importFileRef = useRef<HTMLInputElement>(null);

  // Tab State: 'products' or 'partnerships'
  const [activeTab, setActiveTab] = useState<'products' | 'partnerships'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipProgram[]>([]);
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
  const [isPartnershipFormOpen, setIsPartnershipFormOpen] = useState(false);
  const [partnershipToEdit, setPartnershipToEdit] = useState<PartnershipProgram | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Delete product / partnership confirm
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [partnershipToDelete, setPartnershipToDelete] = useState<PartnershipProgram | null>(null);
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
      const [productsRes, categoriesRes, statsRes, partnershipsRes] = await Promise.all([
        api.getProducts({ all: true, limit: 100 }),
        api.getCategories(),
        api.getAdminStats(),
        api.getPartnerships(true),
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
      if (partnershipsRes.success && partnershipsRes.data) {
        setPartnerships(partnershipsRes.data);
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

  // Quick Toggle Handler for Products
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

  // Quick Toggle Handler for Partnerships
  const handleTogglePartnership = async (id: number) => {
    try {
      const res = await api.togglePartnershipStatus(id);
      if (res.success) {
        setPartnerships((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: res.data.is_active } : p))
        );
        success(res.message);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái.');
    }
  };

  // Delete Action for Products
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

  // Delete Action for Partnerships
  const handleDeletePartnership = async () => {
    if (!partnershipToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.deletePartnership(partnershipToDelete.id);
      success(res.message);
      setPartnershipToDelete(null);
      loadData();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể xóa chương trình hợp tác.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export JSON catalog
  const handleExportJSON = async () => {
    try {
      const res = await api.exportData();
      if (res.success && res.data) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ongdu_products_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        success('Đã xuất file dữ liệu JSON thành công!');
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Không thể xuất dữ liệu JSON.');
    }
  };

  // Import JSON catalog
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const res = await api.importData(parsed);
        if (res.success) {
          success(res.message);
          loadData();
        }
      } catch (err: unknown) {
        error(err instanceof Error ? err.message : 'File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={importFileRef}
        accept=".json,application/json"
        onChange={handleImportJSON}
        className="hidden"
      />

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
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-6">
        {/* Top Tab Switcher - High Contrast Responsive Grid */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Tab 1: Sản Phẩm */}
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-3 sm:px-6 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-500 scale-[1.02]'
                : 'bg-white text-stone-700 hover:text-stone-950 hover:bg-amber-50/50 border-2 border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'products' ? 'text-white' : 'text-amber-600'}`} />
              <span className="truncate">Quản Lý Sản Phẩm</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'products'
                  ? 'bg-amber-950/60 text-amber-200 border border-amber-400/40'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {products.length} SP
            </span>
          </button>

          {/* Tab 2: Hợp Tác */}
          <button
            type="button"
            onClick={() => setActiveTab('partnerships')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-3 sm:px-6 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'partnerships'
                ? 'bg-[#0e2c20] text-amber-300 shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-500 scale-[1.02]'
                : 'bg-white text-stone-700 hover:text-stone-950 hover:bg-emerald-50/50 border-2 border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <Handshake className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'partnerships' ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span className="truncate">Hợp Tác Trại Ong</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'partnerships'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {partnerships.length} Bài
            </span>
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Statistics Cards */}
            <AdminStats stats={stats} isLoading={isLoading} />

            {/* 2. Management Toolbar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3.5">
              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="truncate">Thêm Sản Phẩm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FolderTree className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="truncate">Quản Lý Danh Mục</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Xuất file JSON sao lưu toàn bộ sản phẩm & danh mục"
                >
                  <Download className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="hidden sm:inline">Xuất JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => importFileRef.current?.click()}
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Nạp dữ liệu từ file JSON"
                >
                  <Upload className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="hidden sm:inline">Nhập JSON</span>
                </button>

                <button
                  type="button"
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
                    placeholder="Tìm theo tên sản phẩm, công dụng, thành phần..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Categories and Status Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === ''
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Tất cả danh mục ({products.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedCategory === cat.slug
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat.name} ({products.filter((p) => p.category_slug === cat.slug).length})
                      </button>
                    ))}
                  </div>

                  {/* Status Dropdown */}
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-stone-500">
                    <Filter className="w-3.5 h-3.5" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs outline-hidden cursor-pointer"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hiển thị</option>
                      <option value="inactive">Đang ẩn</option>
                      <option value="featured">Nổi bật</option>
                      <option value="outofstock">Hết hàng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Products Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="py-3 px-4 w-16">Ảnh</th>
                      <th className="py-3 px-4">Tên Sản Phẩm</th>
                      <th className="py-3 px-4">Danh Mục</th>
                      <th className="py-3 px-4">Giá Bán</th>
                      <th className="py-3 px-3 text-center">Hiển Thị</th>
                      <th className="py-3 px-3 text-center">Nổi Bật</th>
                      <th className="py-3 px-3 text-center">Kho Hàng</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-amber-50/30 transition-colors">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 bg-stone-50 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/product-honey-bottle.jpg';
                            }}
                          />
                        </td>

                        {/* Title */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-stone-900 text-sm line-clamp-2 font-serif">
                            {product.name}
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
                            type="button"
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
                            type="button"
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
                            type="button"
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
                              type="button"
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
                              type="button"
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
          </div>
        )}

        {/* TAB 2: PARTNERSHIP PROGRAMS MANAGEMENT */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner & Action Bar */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#14412f] text-amber-300 flex items-center justify-center font-bold shadow-md shadow-emerald-950/20 shrink-0">
                  <Handshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                    Mạng Lưới & Chương Trình Hợp Tác Trại Ong Toàn Quốc
                  </h3>
                  <p className="text-xs text-stone-500">
                    Đăng tải bài viết, chính sách bao tiêu, cung ứng giống và chuyển giao kỹ thuật hiển thị trực tiếp ở Trang Chủ.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={loadData}
                  className="p-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                  title="Tải lại dữ liệu"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPartnershipToEdit(null);
                    setIsPartnershipFormOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đăng Tải Chương Trình Mới</span>
                </button>
              </div>
            </div>

            {/* Partnerships Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="py-3 px-4 w-20">Ảnh</th>
                      <th className="py-3 px-4">Tiêu Đề Chương Trình</th>
                      <th className="py-3 px-4">Phụ Đề / Tóm Tắt</th>
                      <th className="py-3 px-4">Liên Hệ Tiếp Nhận</th>
                      <th className="py-3 px-3 text-center">Hiển Thị</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {partnerships.map((prog) => (
                      <tr key={prog.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                            <img
                              src={prog.image_url || '/images/product-hive-box.jpg'}
                              alt={prog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/product-hive-box.jpg';
                              }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-stone-900 text-sm font-serif line-clamp-2">
                            {prog.title}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-sm">
                          {prog.subtitle && (
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                              {prog.subtitle}
                            </span>
                          )}
                          <div className="text-stone-600 line-clamp-2">
                            {prog.summary}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                          <div>Zalo: <strong>{prog.contact_zalo || CONTACT_INFO.zaloNumber}</strong></div>
                          <div className="text-stone-400 text-[11px]">Hotline: {prog.contact_phone || CONTACT_INFO.hotline}</div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePartnership(prog.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                              prog.is_active
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            }`}
                            title={prog.is_active ? 'Bấm để ẩn khỏi Trang Chủ' : 'Bấm để hiển thị trên Trang Chủ'}
                          >
                            {prog.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{prog.is_active ? 'Đang hiện' : 'Đang ẩn'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setPartnershipToEdit(prog);
                                setIsPartnershipFormOpen(true);
                              }}
                              className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setPartnershipToDelete(prog)}
                              className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {partnerships.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          Chưa có bài viết hợp tác nào. Nhấn "Đăng Tải Chương Trình Mới" để thêm bài đầu tiên.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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

      {/* Partnership Program Form Modal */}
      <PartnershipFormModal
        isOpen={isPartnershipFormOpen}
        onClose={() => {
          setIsPartnershipFormOpen(false);
          setPartnershipToEdit(null);
        }}
        onSuccess={loadData}
        programToEdit={partnershipToEdit}
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

      {/* Confirm Delete Partnership Dialog */}
      <ConfirmDialog
        isOpen={Boolean(partnershipToDelete)}
        onClose={() => setPartnershipToDelete(null)}
        onConfirm={handleDeletePartnership}
        title="Xác Nhận Xóa Chương Trình Hợp Tác"
        message={`Bạn có chắc chắn muốn xóa bài viết "${partnershipToDelete?.title}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa Bài Viết"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
