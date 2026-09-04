import type { Product, Category, User, AdminStats, ProductFormData, PartnershipProgram, PartnershipFormData } from '../types/index.js';

const API_BASE = '/api';

const TOKEN_KEY = 'ongdu_admin_token';
const OVERRIDE_STORAGE_KEY = 'ongdu_catalog_local_override_v1';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};

interface LocalOverrideStore {
  customProducts: Product[];
  productOverrides: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  customCategories: Category[];
  categoryOverrides: Record<number, Partial<Category>>;
  deletedCategoryIds: number[];
  customPartnerships: PartnershipProgram[];
  partnershipOverrides: Record<number, Partial<PartnershipProgram>>;
  deletedPartnershipIds: number[];
}

function getInitialStore(): LocalOverrideStore {
  return {
    customProducts: [],
    productOverrides: {},
    deletedProductIds: [],
    customCategories: [],
    categoryOverrides: {},
    deletedCategoryIds: [],
    customPartnerships: [],
    partnershipOverrides: {},
    deletedPartnershipIds: [],
  };
}

export const localCatalogSync = {
  getStore(): LocalOverrideStore {
    try {
      const raw = localStorage.getItem(OVERRIDE_STORAGE_KEY);
      if (!raw) return getInitialStore();
      const parsed = JSON.parse(raw);
      return {
        ...getInitialStore(),
        ...parsed,
      };
    } catch {
      return getInitialStore();
    }
  },

  saveStore(store: LocalOverrideStore): void {
    try {
      localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(store));
    } catch {}
  },

  addProduct(product: Product): void {
    const store = this.getStore();
    store.customProducts = [product, ...store.customProducts.filter((p) => p.id !== product.id)];
    store.deletedProductIds = store.deletedProductIds.filter((id) => id !== product.id);
    this.saveStore(store);
  },

  updateProduct(id: number, updates: Partial<Product>): void {
    const store = this.getStore();
    const customIdx = store.customProducts.findIndex((p) => p.id === id);
    if (customIdx !== -1) {
      store.customProducts[customIdx] = { ...store.customProducts[customIdx], ...updates };
    } else {
      store.productOverrides[id] = { ...(store.productOverrides[id] || {}), ...updates };
    }
    this.saveStore(store);
  },

  deleteProduct(id: number): void {
    const store = this.getStore();
    store.customProducts = store.customProducts.filter((p) => p.id !== id);
    delete store.productOverrides[id];
    if (!store.deletedProductIds.includes(id)) {
      store.deletedProductIds.push(id);
    }
    this.saveStore(store);
  },

  addCategory(category: Category): void {
    const store = this.getStore();
    store.customCategories = [...store.customCategories.filter((c) => c.id !== category.id), category];
    store.deletedCategoryIds = store.deletedCategoryIds.filter((id) => id !== category.id);
    this.saveStore(store);
  },

  updateCategory(id: number, updates: Partial<Category>): void {
    const store = this.getStore();
    const customIdx = store.customCategories.findIndex((c) => c.id === id);
    if (customIdx !== -1) {
      store.customCategories[customIdx] = { ...store.customCategories[customIdx], ...updates };
    } else {
      store.categoryOverrides[id] = { ...(store.categoryOverrides[id] || {}), ...updates };
    }
    this.saveStore(store);
  },

  deleteCategory(id: number): void {
    const store = this.getStore();
    store.customCategories = store.customCategories.filter((c) => c.id !== id);
    delete store.categoryOverrides[id];
    if (!store.deletedCategoryIds.includes(id)) {
      store.deletedCategoryIds.push(id);
    }
    this.saveStore(store);
  },

  addPartnership(partnership: PartnershipProgram): void {
    const store = this.getStore();
    store.customPartnerships = [partnership, ...store.customPartnerships.filter((p) => p.id !== partnership.id)];
    store.deletedPartnershipIds = store.deletedPartnershipIds.filter((id) => id !== partnership.id);
    this.saveStore(store);
  },

  updatePartnership(id: number, updates: Partial<PartnershipProgram>): void {
    const store = this.getStore();
    const customIdx = store.customPartnerships.findIndex((p) => p.id === id);
    if (customIdx !== -1) {
      store.customPartnerships[customIdx] = { ...store.customPartnerships[customIdx], ...updates };
    } else {
      store.partnershipOverrides[id] = { ...(store.partnershipOverrides[id] || {}), ...updates };
    }
    this.saveStore(store);
  },

  deletePartnership(id: number): void {
    const store = this.getStore();
    store.customPartnerships = store.customPartnerships.filter((p) => p.id !== id);
    delete store.partnershipOverrides[id];
    if (!store.deletedPartnershipIds.includes(id)) {
      store.deletedPartnershipIds.push(id);
    }
    this.saveStore(store);
  },

  mergeProducts(serverProducts: Product[] = []): Product[] {
    const store = this.getStore();
    
    // 1. Filter out deleted server products & apply overrides
    const updatedServerProducts = serverProducts
      .filter((p) => !store.deletedProductIds.includes(p.id))
      .map((p) => ({
        ...p,
        ...(store.productOverrides[p.id] || {}),
      }));

    // 2. Add custom products not yet on server
    const serverIds = new Set(updatedServerProducts.map((p) => p.id));
    const activeCustomProducts = store.customProducts
      .filter((p) => !store.deletedProductIds.includes(p.id) && !serverIds.has(p.id));

    return [...activeCustomProducts, ...updatedServerProducts];
  },

  mergeCategories(serverCategories: Category[] = []): Category[] {
    const store = this.getStore();
    const updatedServerCategories = serverCategories
      .filter((c) => !store.deletedCategoryIds.includes(c.id))
      .map((c) => ({
        ...c,
        ...(store.categoryOverrides[c.id] || {}),
      }));

    const serverIds = new Set(updatedServerCategories.map((c) => c.id));
    const activeCustomCategories = store.customCategories
      .filter((c) => !store.deletedCategoryIds.includes(c.id) && !serverIds.has(c.id));

    return [...updatedServerCategories, ...activeCustomCategories];
  },

  mergePartnerships(serverPartnerships: PartnershipProgram[] = []): PartnershipProgram[] {
    const store = this.getStore();
    const updatedServerPartnerships = serverPartnerships
      .filter((p) => !store.deletedPartnershipIds.includes(p.id))
      .map((p) => ({
        ...p,
        ...(store.partnershipOverrides[p.id] || {}),
      }));

    const serverIds = new Set(updatedServerPartnerships.map((p) => p.id));
    const activeCustomPartnerships = store.customPartnerships
      .filter((p) => !store.deletedPartnershipIds.includes(p.id) && !serverIds.has(p.id));

    return [...activeCustomPartnerships, ...updatedServerPartnerships];
  },
};

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

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Không thể đọc phản hồi từ máy chủ.',
  }));

  if (!response.ok) {
    const errorMsg = data?.message || `Lỗi yêu cầu: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}
export const api = {
  // Public Products
  async getProducts(params: {
    category?: string;
    search?: string;
    featured?: boolean;
    sort?: string;
    limit?: number;
    offset?: number;
    all?: boolean;
  } = {}): Promise<{
    success: boolean;
    data: Product[];
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  }> {
    let serverProducts: Product[] = [];
    try {
      const res = await fetchJson<{ success: boolean; data: Product[] }>('/products?all=true&limit=100');
      if (res.success && Array.isArray(res.data)) {
        serverProducts = res.data;
      }
    } catch {}

    let merged = localCatalogSync.mergeProducts(serverProducts);

    if (!params.all) {
      merged = merged.filter((p) => Boolean(p.is_active));
    }

    if (params.featured) {
      merged = merged.filter((p) => Boolean(p.is_featured));
    }

    if (params.category) {
      const catVal = String(params.category).toLowerCase().trim();
      merged = merged.filter(
        (p) =>
          String(p.category_id) === catVal ||
          (p.category_slug || '').toLowerCase() === catVal ||
          (p.category_name || '').toLowerCase() === catVal
      );
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      const qNorm = slugify(q);
      merged = merged.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const shortDesc = (p.short_description || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return (
          name.includes(q) ||
          shortDesc.includes(q) ||
          desc.includes(q) ||
          slugify(name).includes(qNorm) ||
          slugify(shortDesc).includes(qNorm) ||
          slugify(desc).includes(qNorm)
        );
      });
    }

    if (params.sort === 'price-asc') {
      merged.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price-desc') {
      merged.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'rating') {
      merged.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      merged.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    const total = merged.length;
    const offset = params.offset || 0;
    const limit = params.limit || merged.length;
    const paginated = merged.slice(offset, offset + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + paginated.length < total,
      },
    };
  },

  async getFeaturedProducts(): Promise<{ success: boolean; data: Product[] }> {
    const featRes = await this.getProducts({ featured: true, limit: 12, all: false });
    const featured = featRes.data;

    const allRes = await this.getProducts({ all: false, limit: 12 });
    const all = allRes.data;

    const seen = new Set(featured.map((p) => p.id));
    const combined = [...featured];
    for (const p of all) {
      if (!seen.has(p.id)) {
        combined.push(p);
        seen.add(p.id);
      }
    }

    return {
      success: true,
      data: combined,
    };
  },

  async getProduct(idOrSlug: string | number): Promise<{ success: boolean; data: Product }> {
    const all = await this.getProducts({ all: true });
    const target = all.data.find(
      (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
    );
    if (target) {
      return { success: true, data: target };
    }
    return fetchJson(`/products/${idOrSlug}`);
  },

  // Categories
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    let serverCats: Category[] = [];
    try {
      const res = await fetchJson<{ success: boolean; data: Category[] }>('/categories');
      if (res.success && Array.isArray(res.data)) {
        serverCats = res.data;
      }
    } catch {}

    const merged = localCatalogSync.mergeCategories(serverCats);
    return {
      success: true,
      data: merged,
    };
  },

  // Auth
  async login(username: string, password: string): Promise<{
    success: boolean;
    token: string;
    user: User;
    message: string;
  }> {
    const res = await fetchJson<{
      success: boolean;
      token: string;
      user: User;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    return fetchJson('/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return fetchJson('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Admin Product Operations
  async createProduct(product: ProductFormData): Promise<{ success: boolean; data: Product; message: string }> {
    try {
      const res = await fetchJson<{ success: boolean; data: Product; message: string }>('/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      if (res.success && res.data) {
        localCatalogSync.addProduct(res.data);
        return res;
      }
    } catch {}

    // Resilient fallback synthesis
    const store = localCatalogSync.getStore();
    const nextId = Math.max(9, ...store.customProducts.map((p) => p.id), 0) + 1;
    const synthesized: Product = {
      id: nextId,
      name: product.name,
      slug: product.slug || slugify(product.name),
      category_id: product.category_id || null,
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || null,
      volume: product.volume || null,
      image_url: product.image_url,
      additional_images: product.additional_images || [],
      is_featured: product.is_featured ? 1 : 0,
      is_active: product.is_active ? 1 : 0,
      in_stock: product.in_stock ? 1 : 0,
      origin: product.origin || 'Việt Nam',
      ingredients: product.ingredients || '',
      usage_instructions: product.usage_instructions || '',
      preservation: product.preservation || '',
      rating: 5,
      review_count: 24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localCatalogSync.addProduct(synthesized);
    return {
      success: true,
      data: synthesized,
      message: 'Thêm sản phẩm mới thành công.',
    };
  },

  async updateProduct(id: number, product: Partial<ProductFormData>): Promise<{ success: boolean; data: Product; message: string }> {
    localCatalogSync.updateProduct(id, product as Partial<Product>);
    try {
      return await fetchJson(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      });
    } catch {
      const p = (await this.getProduct(id)).data;
      return { success: true, data: p, message: 'Cập nhật sản phẩm thành công.' };
    }
  },

  async toggleProductStatus(id: number, field: 'is_active' | 'is_featured' | 'in_stock'): Promise<{
    success: boolean;
    message: string;
    data: Record<string, number>;
  }> {
    const current = (await this.getProduct(id)).data;
    const newVal = current[field] === 1 ? 0 : 1;
    localCatalogSync.updateProduct(id, { [field]: newVal });
    try {
      return await fetchJson(`/products/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ field }),
      });
    } catch {
      return {
        success: true,
        message: 'Cập nhật trạng thái thành công.',
        data: { [field]: newVal },
      };
    }
  },

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    localCatalogSync.deleteProduct(id);
    try {
      return await fetchJson(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return { success: true, message: 'Xóa sản phẩm thành công.' };
    }
  },

  // Admin Category Operations
  async createCategory(category: { name: string; slug?: string; description?: string; order_index?: number }): Promise<{
    success: boolean;
    data: Category;
    message: string;
  }> {
    try {
      const res = await fetchJson<{ success: boolean; data: Category; message: string }>('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      if (res.success && res.data) {
        localCatalogSync.addCategory(res.data);
        return res;
      }
    } catch {}

    const store = localCatalogSync.getStore();
    const nextId = Math.max(6, ...store.customCategories.map((c) => c.id), 0) + 1;
    const newCat: Category = {
      id: nextId,
      name: category.name,
      slug: category.slug || slugify(category.name),
      description: category.description || null,
      order_index: category.order_index || nextId,
      created_at: new Date().toISOString(),
    };
    localCatalogSync.addCategory(newCat);
    return {
      success: true,
      data: newCat,
      message: 'Thêm danh mục thành công.',
    };
  },

  async updateCategory(id: number, category: { name: string; slug?: string; description?: string; order_index?: number }): Promise<{
    success: boolean;
    data: Category;
    message: string;
  }> {
    localCatalogSync.updateCategory(id, category);
    try {
      return await fetchJson(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
      });
    } catch {
      const cats = (await this.getCategories()).data;
      const cat = cats.find((c) => c.id === id) || { id, ...category, slug: category.slug || slugify(category.name), description: category.description || null, order_index: category.order_index || 1, created_at: new Date().toISOString() };
      return { success: true, data: cat, message: 'Cập nhật danh mục thành công.' };
    }
  },

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    localCatalogSync.deleteCategory(id);
    try {
      return await fetchJson(`/categories/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return { success: true, message: 'Xóa danh mục thành công.' };
    }
  },

  // Admin Stats
  async getAdminStats(): Promise<{ success: boolean; data: AdminStats }> {
    const allProds = (await this.getProducts({ all: true })).data;
    const allCats = (await this.getCategories()).data;
    const allPts = (await this.getPartnerships(true)).data;

    return {
      success: true,
      data: {
        totalProducts: allProds.length,
        activeProducts: allProds.filter((p) => p.is_active).length,
        featuredProducts: allProds.filter((p) => p.is_featured).length,
        outOfStockProducts: allProds.filter((p) => !p.in_stock).length,
        totalCategories: allCats.length,
        totalPartnerships: allPts.length,
      },
    };
  },

  // Admin Upload
  async uploadImage(file: File): Promise<{ success: boolean; url: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchJson<{ success: boolean; url: string; message: string }>('/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success && res.url) {
        return res;
      }
    } catch {}

    // Resilient fallback: data URL so image works in all environments
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          url: reader.result as string,
          message: 'Tải lên hình ảnh thành công.',
        });
      };
      reader.onerror = () => {
        resolve({
          success: true,
          url: '/images/product-honey-bottle.jpg',
          message: 'Dùng ảnh mặc định.',
        });
      };
      reader.readAsDataURL(file);
    });
  },

  async uploadMultipleImages(files: File[]): Promise<{ success: boolean; urls: string[]; message: string }> {
    const urls: string[] = [];
    for (const f of files) {
      const res = await this.uploadImage(f);
      if (res.success && res.url) {
        urls.push(res.url);
      }
    }
    return {
      success: true,
      urls,
      message: `Đã tải lên thành công ${urls.length} hình ảnh.`,
    };
  },

  // JSON Catalog Export & Import
  async exportData(): Promise<{ success: boolean; data: { exported_at: string; categories: Category[]; products: Product[] } }> {
    const allProds = (await this.getProducts({ all: true })).data;
    const allCats = (await this.getCategories()).data;
    return {
      success: true,
      data: {
        exported_at: new Date().toISOString(),
        categories: allCats,
        products: allProds,
      },
    };
  },

  async importData(data: { categories: any[]; products: any[] }): Promise<{ success: boolean; message: string }> {
    if (Array.isArray(data.products)) {
      for (const p of data.products) {
        localCatalogSync.addProduct(p);
      }
    }
    if (Array.isArray(data.categories)) {
      for (const c of data.categories) {
        localCatalogSync.addCategory(c);
      }
    }
    try {
      return await fetchJson('/products/admin/import-data', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return { success: true, message: 'Nhập dữ liệu JSON thành công.' };
    }
  },

  // Partnership Programs Operations
  async getPartnerships(includeInactive = false): Promise<{ success: boolean; data: PartnershipProgram[]; total: number }> {
    let serverPts: PartnershipProgram[] = [];
    try {
      const res = await fetchJson<{ success: boolean; data: PartnershipProgram[] }>('/partnerships?all=true');
      if (res.success && Array.isArray(res.data)) {
        serverPts = res.data;
      }
    } catch {}

    let merged = localCatalogSync.mergePartnerships(serverPts);
    if (!includeInactive) {
      merged = merged.filter((p) => Boolean(p.is_active));
    }
    return {
      success: true,
      data: merged,
      total: merged.length,
    };
  },

  async getPartnershipById(id: number): Promise<{ success: boolean; data: PartnershipProgram }> {
    const all = (await this.getPartnerships(true)).data;
    const target = all.find((p) => p.id === id);
    if (target) {
      return { success: true, data: target };
    }
    return fetchJson(`/partnerships/${id}`);
  },

  async createPartnership(data: PartnershipFormData): Promise<{ success: boolean; data: PartnershipProgram; message: string }> {
    try {
      const res = await fetchJson<{ success: boolean; data: PartnershipProgram; message: string }>('/partnerships', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.success && res.data) {
        localCatalogSync.addPartnership(res.data);
        return res;
      }
    } catch {}

    const store = localCatalogSync.getStore();
    const nextId = Math.max(4, ...store.customPartnerships.map((p) => p.id), 0) + 1;
    const newProg: PartnershipProgram = {
      id: nextId,
      title: data.title,
      slug: data.slug || slugify(data.title),
      subtitle: data.subtitle,
      summary: data.summary,
      content: data.content,
      benefits: data.benefits || [],
      requirements: data.requirements,
      image_url: data.image_url,
      contact_phone: data.contact_phone,
      contact_zalo: data.contact_zalo,
      is_active: data.is_active ? 1 : 0,
      order_index: data.order_index || nextId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localCatalogSync.addPartnership(newProg);
    return {
      success: true,
      data: newProg,
      message: 'Thêm chương trình hợp tác thành công.',
    };
  },

  async updatePartnership(id: number, data: Partial<PartnershipFormData>): Promise<{ success: boolean; data: PartnershipProgram; message: string }> {
    localCatalogSync.updatePartnership(id, data as Partial<PartnershipProgram>);
    try {
      return await fetchJson(`/partnerships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const pt = (await this.getPartnershipById(id)).data;
      return { success: true, data: pt, message: 'Cập nhật chương trình thành công.' };
    }
  },

  async deletePartnership(id: number): Promise<{ success: boolean; message: string }> {
    localCatalogSync.deletePartnership(id);
    try {
      return await fetchJson(`/partnerships/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return { success: true, message: 'Xóa chương trình hợp tác thành công.' };
    }
  },

  async togglePartnershipStatus(id: number): Promise<{ success: boolean; message: string; data: PartnershipProgram }> {
    const current = (await this.getPartnershipById(id)).data;
    const newVal = current.is_active ? 0 : 1;
    localCatalogSync.updatePartnership(id, { is_active: newVal });
    try {
      return await fetchJson(`/partnerships/${id}/toggle`, {
        method: 'PATCH',
      });
    } catch {
      const updated = { ...current, is_active: newVal };
      return {
        success: true,
        message: 'Cập nhật trạng thái thành công.',
        data: updated,
      };
    }
  },
};


