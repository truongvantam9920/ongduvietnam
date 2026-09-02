import type { Product, Category, User, AdminStats, ProductFormData } from '../types/index.js';

const API_BASE = '/api';

const TOKEN_KEY = 'ongdu_admin_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};

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
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.featured) query.set('featured', 'true');
    if (params.sort) query.set('sort', params.sort);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.all) query.set('all', 'true');

    const qs = query.toString();
    return fetchJson(`/products${qs ? `?${qs}` : ''}`);
  },

  async getFeaturedProducts(): Promise<{ success: boolean; data: Product[] }> {
    return fetchJson('/products/featured');
  },

  async getProduct(idOrSlug: string | number): Promise<{ success: boolean; data: Product }> {
    return fetchJson(`/products/${idOrSlug}`);
  },

  // Categories
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return fetchJson('/categories');
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
    return fetchJson('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: number, product: Partial<ProductFormData>): Promise<{ success: boolean; data: Product; message: string }> {
    return fetchJson(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async toggleProductStatus(id: number, field: 'is_active' | 'is_featured' | 'in_stock'): Promise<{
    success: boolean;
    message: string;
    data: Record<string, number>;
  }> {
    return fetchJson(`/products/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ field }),
    });
  },

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    return fetchJson(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Category Operations
  async createCategory(category: { name: string; slug?: string; description?: string; order_index?: number }): Promise<{
    success: boolean;
    data: Category;
    message: string;
  }> {
    return fetchJson('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateCategory(id: number, category: { name: string; slug?: string; description?: string; order_index?: number }): Promise<{
    success: boolean;
    data: Category;
    message: string;
  }> {
    return fetchJson(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    return fetchJson(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Stats
  async getAdminStats(): Promise<{ success: boolean; data: AdminStats }> {
    return fetchJson('/products/admin/stats');
  },

  // Admin Upload
  async uploadImage(file: File): Promise<{ success: boolean; url: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return fetchJson('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadMultipleImages(files: File[]): Promise<{ success: boolean; urls: string[]; message: string }> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    return fetchJson('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  },

  // JSON Catalog Export & Import
  async exportData(): Promise<{ success: boolean; data: { exported_at: string; categories: Category[]; products: Product[] } }> {
    return fetchJson('/products/admin/export-data');
  },

  async importData(data: { categories: any[]; products: any[] }): Promise<{ success: boolean; message: string }> {
    return fetchJson('/products/admin/import-data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Partnership Programs Operations
  async getPartnerships(includeInactive = false): Promise<{ success: boolean; data: PartnershipProgram[]; total: number }> {
    const query = includeInactive ? '?all=true' : '';
    return fetchJson(`/partnerships${query}`);
  },

  async getPartnershipById(id: number): Promise<{ success: boolean; data: PartnershipProgram }> {
    return fetchJson(`/partnerships/${id}`);
  },

  async createPartnership(data: PartnershipFormData): Promise<{ success: boolean; data: PartnershipProgram; message: string }> {
    return fetchJson('/partnerships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePartnership(id: number, data: Partial<PartnershipFormData>): Promise<{ success: boolean; data: PartnershipProgram; message: string }> {
    return fetchJson(`/partnerships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePartnership(id: number): Promise<{ success: boolean; message: string }> {
    return fetchJson(`/partnerships/${id}`, {
      method: 'DELETE',
    });
  },

  async togglePartnershipStatus(id: number): Promise<{ success: boolean; message: string; data: PartnershipProgram }> {
    return fetchJson(`/partnerships/${id}/toggle`, {
      method: 'PATCH',
    });
  },
};


