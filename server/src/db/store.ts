import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import type { Product, Category, AdminStats, User, PartnershipProgram, PartnershipCreateInput, PartnershipUpdateInput } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CatalogData {
  admin?: {
    username: string;
    password_hash: string;
    email: string;
  };
  categories: Category[];
  products: Product[];
  partnerships?: PartnershipProgram[];
}

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

class JsonStore {
  private filePath: string;
  private data: CatalogData = { categories: [], products: [] };
  private initialized = false;

  constructor() {
    const candidates = [
      path.resolve(process.cwd(), 'server/src/data/products.json'),
      path.resolve(process.cwd(), 'data/products.json'),
      path.resolve(__dirname, '../data/products.json'),
      path.resolve(__dirname, '../../data/products.json'),
    ];

    let found = '';
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        found = p;
        break;
      }
    }

    this.filePath = found || path.resolve(process.cwd(), 'server/src/data/products.json');
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          categories: parsed.categories || [],
          products: (parsed.products || []).map((p: any) => ({
            ...p,
            additional_images: Array.isArray(p.additional_images)
              ? p.additional_images
              : (typeof p.additional_images === 'string' ? JSON.parse(p.additional_images || '[]') : []),
          })),
          partnerships: (parsed.partnerships || []).map((pt: any) => ({
            ...pt,
            benefits: Array.isArray(pt.benefits)
              ? pt.benefits
              : (typeof pt.benefits === 'string' ? JSON.parse(pt.benefits || '[]') : []),
            is_active: pt.is_active !== undefined ? (pt.is_active ? 1 : 0) : 1,
            order_index: pt.order_index || 0,
          })),
          admin: parsed.admin,
        };
      }
    } catch (err) {
      console.warn('[JsonStore] Error reading JSON file, using in-memory state:', err);
    }

    // Ensure admin user hash exists
    if (!this.data.admin || !this.data.admin.password_hash) {
      let hash = config.admin.passwordHash;
      if (!hash) {
        if (config.admin.password.startsWith('$2a$') || config.admin.password.startsWith('$2b$') || config.admin.password.startsWith('$2y$')) {
          hash = config.admin.password;
        } else {
          const salt = bcrypt.genSaltSync(10);
          hash = bcrypt.hashSync(config.admin.password, salt);
        }
      }
      this.data.admin = {
        username: config.admin.username,
        password_hash: hash,
        email: config.admin.email,
      };
    }

    this.initialized = true;
  }

  private save(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Never persist sensitive admin credentials to the version-controlled JSON catalog
      const { admin: _, ...publicCatalog } = this.data;
      fs.writeFileSync(this.filePath, JSON.stringify(publicCatalog, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[JsonStore] Warning: Could not write file (e.g. read-only filesystem), keeping in-memory:', err);
    }
  }

  // Admin User Auth
  getAdminUser(): User {
    if (!this.initialized) this.load();
    return {
      id: 1,
      username: this.data.admin?.username || config.admin.username,
      password_hash: this.data.admin?.password_hash || '',
      email: this.data.admin?.email || config.admin.email,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  updateAdminPassword(newPasswordHash: string): void {
    if (!this.data.admin) {
      this.data.admin = {
        username: config.admin.username,
        password_hash: newPasswordHash,
        email: config.admin.email,
      };
    } else {
      this.data.admin.password_hash = newPasswordHash;
    }
    this.save();
  }

  // Categories
  getCategories(): (Category & { product_count: number })[] {
    if (!this.initialized) this.load();
    return this.data.categories
      .slice()
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map((cat) => {
        const productCount = this.data.products.filter(
          (p) => (p.category_id === cat.id || p.category_slug === cat.slug) && p.is_active
        ).length;
        return {
          ...cat,
          product_count: productCount,
        };
      });
  }

  getCategoryById(id: number): Category | undefined {
    if (!this.initialized) this.load();
    return this.data.categories.find((c) => c.id === id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    if (!this.initialized) this.load();
    return this.data.categories.find((c) => c.slug === slug);
  }

  createCategory(categoryData: Partial<Category>): Category {
    if (!this.initialized) this.load();
    const maxId = this.data.categories.reduce((m, c) => Math.max(m, c.id || 0), 0);
    const newId = maxId + 1;
    const name = (categoryData.name || '').trim();
    const slug = categoryData.slug ? slugify(categoryData.slug) : slugify(name);

    const newCat: Category = {
      id: newId,
      name,
      slug,
      description: categoryData.description || '',
      order_index: categoryData.order_index || (this.data.categories.length + 1),
      created_at: new Date().toISOString(),
    };

    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: number, updates: Partial<Category>): Category | undefined {
    if (!this.initialized) this.load();
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;

    const current = this.data.categories[idx];
    const name = updates.name !== undefined ? updates.name.trim() : current.name;
    const slug = updates.slug ? slugify(updates.slug) : (updates.name ? slugify(updates.name) : current.slug);

    const updated: Category = {
      ...current,
      name,
      slug,
      description: updates.description !== undefined ? updates.description : current.description,
      order_index: updates.order_index !== undefined ? updates.order_index : current.order_index,
    };

    this.data.categories[idx] = updated;
    this.save();
    return updated;
  }

  deleteCategory(id: number): boolean {
    if (!this.initialized) this.load();
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);

    // Detach category from products
    this.data.products.forEach((p) => {
      if (p.category_id === id) {
        p.category_id = null;
      }
    });

    this.save();
    return this.data.categories.length < initialLen;
  }

  // Products
  getProducts(options: {
    category?: string;
    search?: string;
    featured?: boolean;
    all?: boolean;
    limit?: number;
    offset?: number;
    sort?: string;
  } = {}): { products: Product[]; total: number } {
    if (!this.initialized) this.load();
    let list: Product[] = this.data.products.map((p) => {
      const cat = this.data.categories.find((c) => c.id === p.category_id || c.slug === p.category_slug);
      return {
        ...p,
        category_name: cat?.name || p.category_name,
        category_slug: cat?.slug || p.category_slug,
        additional_images: Array.isArray(p.additional_images) ? p.additional_images : [],
      };
    });

    if (!options.all) {
      list = list.filter((p) => Boolean(p.is_active));
    }

    if (options.featured) {
      list = list.filter((p) => Boolean(p.is_featured));
    }

    if (options.category) {
      const catVal = String(options.category).toLowerCase();
      list = list.filter(
        (p) =>
          String(p.category_id) === catVal ||
          p.category_slug?.toLowerCase() === catVal ||
          p.category_name?.toLowerCase() === catVal
      );
    }

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      const qNorm = slugify(q);
      list = list.filter((p) => {
        const name = p.name.toLowerCase();
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

    // Sort
    if (options.sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (options.sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (options.sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default newest / featured first
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || list.length;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  getProductById(id: number): Product | undefined {
    if (!this.initialized) this.load();
    const p = this.data.products.find((prod) => prod.id === id);
    if (!p) return undefined;
    const cat = this.data.categories.find((c) => c.id === p.category_id || c.slug === p.category_slug);
    return {
      ...p,
      category_name: cat?.name || p.category_name,
      category_slug: cat?.slug || p.category_slug,
      additional_images: Array.isArray(p.additional_images) ? p.additional_images : [],
    };
  }

  getProductBySlug(slug: string): Product | undefined {
    if (!this.initialized) this.load();
    const p = this.data.products.find((prod) => prod.slug === slug);
    if (!p) return undefined;
    const cat = this.data.categories.find((c) => c.id === p.category_id || c.slug === p.category_slug);
    return {
      ...p,
      category_name: cat?.name || p.category_name,
      category_slug: cat?.slug || p.category_slug,
      additional_images: Array.isArray(p.additional_images) ? p.additional_images : [],
    };
  }

  getFeaturedProducts(limit = 6): Product[] {
    const { products } = this.getProducts({ featured: true, limit, all: false });
    return products;
  }

  createProduct(productData: any): Product {
    if (!this.initialized) this.load();
    const maxId = this.data.products.reduce((m, p) => Math.max(m, p.id || 0), 0);
    const newId = maxId + 1;
    const name = (productData.name || '').trim();
    const slug = productData.slug ? slugify(productData.slug) : slugify(name);

    let categoryId: number | null = productData.category_id ? Number(productData.category_id) : null;
    let categorySlug = productData.category_slug;
    if (categoryId) {
      const cat = this.getCategoryById(categoryId);
      if (cat) categorySlug = cat.slug;
    }

    const newProd: Product = {
      id: newId,
      name,
      slug,
      category_id: categoryId,
      category_slug: categorySlug,
      category_name: categoryId ? this.getCategoryById(categoryId)?.name : undefined,
      short_description: productData.short_description || '',
      description: productData.description || '',
      price: Number(productData.price) || 0,
      original_price: productData.original_price ? Number(productData.original_price) : null,
      volume: productData.volume || '',
      image_url: productData.image_url || '/images/product-honey-bottle.jpg',
      additional_images: Array.isArray(productData.additional_images) ? productData.additional_images : [],
      is_featured: productData.is_featured ? 1 : 0,
      is_active: productData.is_active !== undefined ? (productData.is_active ? 1 : 0) : 1,
      in_stock: productData.in_stock !== undefined ? (productData.in_stock ? 1 : 0) : 1,
      origin: productData.origin || 'Việt Nam',
      ingredients: productData.ingredients || '',
      usage_instructions: productData.usage_instructions || '',
      preservation: productData.preservation || '',
      rating: Number(productData.rating) || 5.0,
      review_count: Number(productData.review_count) || 24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.products.unshift(newProd);
    this.save();
    return newProd;
  }

  updateProduct(id: number, updates: any): Product | undefined {
    if (!this.initialized) this.load();
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const current = this.data.products[idx];
    const name = updates.name !== undefined ? updates.name.trim() : current.name;
    const slug = updates.slug ? slugify(updates.slug) : (updates.name ? slugify(updates.name) : current.slug);

    let categoryId = updates.category_id !== undefined ? (updates.category_id ? Number(updates.category_id) : null) : current.category_id;
    let categorySlug = updates.category_slug !== undefined ? updates.category_slug : current.category_slug;
    if (categoryId) {
      const cat = this.getCategoryById(categoryId);
      if (cat) categorySlug = cat.slug;
    }

    const updated: Product = {
      ...current,
      ...updates,
      name,
      slug,
      category_id: categoryId,
      category_slug: categorySlug,
      category_name: categoryId ? this.getCategoryById(categoryId)?.name : undefined,
      price: updates.price !== undefined ? Number(updates.price) : current.price,
      original_price: updates.original_price !== undefined ? (updates.original_price ? Number(updates.original_price) : null) : current.original_price,
      additional_images: Array.isArray(updates.additional_images) ? updates.additional_images : current.additional_images,
      is_featured: updates.is_featured !== undefined ? (updates.is_featured ? 1 : 0) : current.is_featured,
      is_active: updates.is_active !== undefined ? (updates.is_active ? 1 : 0) : current.is_active,
      in_stock: updates.in_stock !== undefined ? (updates.in_stock ? 1 : 0) : current.in_stock,
      updated_at: new Date().toISOString(),
    };

    this.data.products[idx] = updated;
    this.save();
    return updated;
  }

  toggleProduct(id: number, field: 'is_active' | 'is_featured' | 'in_stock'): Product | undefined {
    if (!this.initialized) this.load();
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const currentVal = this.data.products[idx][field];
    const newVal = currentVal === 1 ? 0 : 1;
    this.data.products[idx][field] = newVal as any;
    this.data.products[idx].updated_at = new Date().toISOString();
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: number): Product | undefined {
    if (!this.initialized) this.load();
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const [deleted] = this.data.products.splice(idx, 1);
    this.save();
    return deleted;
  }

  // ==========================================
  // PARTNERSHIP PROGRAMS
  // ==========================================

  getPartnerships(includeInactive = false): PartnershipProgram[] {
    if (!this.initialized) this.load();
    const list = this.data.partnerships || [];
    const filtered = includeInactive ? list : list.filter((p) => p.is_active);
    return filtered.sort((a, b) => a.order_index - b.order_index);
  }

  getPartnershipById(id: number): PartnershipProgram | undefined {
    if (!this.initialized) this.load();
    return (this.data.partnerships || []).find((p) => p.id === id);
  }

  createPartnership(input: PartnershipCreateInput): PartnershipProgram {
    if (!this.initialized) this.load();
    if (!this.data.partnerships) this.data.partnerships = [];

    const nextId = this.data.partnerships.length > 0
      ? Math.max(...this.data.partnerships.map((p) => p.id)) + 1
      : 1;

    let baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (this.data.partnerships.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    let parsedBenefits: string[] = [];
    if (Array.isArray(input.benefits)) {
      parsedBenefits = input.benefits;
    } else if (typeof input.benefits === 'string' && input.benefits.trim()) {
      try {
        parsedBenefits = JSON.parse(input.benefits);
      } catch {
        parsedBenefits = input.benefits.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    const newProg: PartnershipProgram = {
      id: nextId,
      title: input.title.trim(),
      slug: finalSlug,
      subtitle: input.subtitle?.trim() || undefined,
      summary: input.summary.trim(),
      content: input.content.trim(),
      benefits: parsedBenefits,
      requirements: input.requirements?.trim() || undefined,
      image_url: input.image_url.trim(),
      contact_phone: input.contact_phone?.trim() || undefined,
      contact_zalo: input.contact_zalo?.trim() || undefined,
      is_active: input.is_active !== undefined ? (input.is_active ? 1 : 0) : 1,
      order_index: input.order_index !== undefined ? Number(input.order_index) : this.data.partnerships.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.partnerships.push(newProg);
    this.save();
    return newProg;
  }

  updatePartnership(id: number, input: PartnershipUpdateInput): PartnershipProgram | undefined {
    if (!this.initialized) this.load();
    if (!this.data.partnerships) this.data.partnerships = [];

    const prog = this.data.partnerships.find((p) => p.id === id);
    if (!prog) return undefined;

    if (input.title !== undefined) prog.title = input.title.trim();
    if (input.slug !== undefined && input.slug.trim()) {
      prog.slug = slugify(input.slug);
    } else if (input.title !== undefined) {
      prog.slug = slugify(input.title);
    }
    if (input.subtitle !== undefined) prog.subtitle = input.subtitle?.trim() || undefined;
    if (input.summary !== undefined) prog.summary = input.summary.trim();
    if (input.content !== undefined) prog.content = input.content.trim();
    if (input.benefits !== undefined) {
      if (Array.isArray(input.benefits)) {
        prog.benefits = input.benefits;
      } else if (typeof input.benefits === 'string') {
        try {
          prog.benefits = JSON.parse(input.benefits);
        } catch {
          prog.benefits = input.benefits.split('\n').map((s) => s.trim()).filter(Boolean);
        }
      }
    }
    if (input.requirements !== undefined) prog.requirements = input.requirements?.trim() || undefined;
    if (input.image_url !== undefined) prog.image_url = input.image_url.trim();
    if (input.contact_phone !== undefined) prog.contact_phone = input.contact_phone?.trim() || undefined;
    if (input.contact_zalo !== undefined) prog.contact_zalo = input.contact_zalo?.trim() || undefined;
    if (input.is_active !== undefined) prog.is_active = input.is_active ? 1 : 0;
    if (input.order_index !== undefined) prog.order_index = Number(input.order_index);
    prog.updated_at = new Date().toISOString();

    this.save();
    return prog;
  }

  deletePartnership(id: number): PartnershipProgram | undefined {
    if (!this.initialized) this.load();
    if (!this.data.partnerships) return undefined;

    const idx = this.data.partnerships.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const [deleted] = this.data.partnerships.splice(idx, 1);
    this.save();
    return deleted;
  }

  togglePartnership(id: number, field: string): PartnershipProgram | undefined {
    if (!this.initialized) this.load();
    if (!this.data.partnerships) return undefined;

    const prog = this.data.partnerships.find((p) => p.id === id);
    if (!prog) return undefined;

    if (field === 'is_active') {
      prog.is_active = prog.is_active ? 0 : 1;
      prog.updated_at = new Date().toISOString();
      this.save();
    }
    return prog;
  }

  getStats(): AdminStats {
    if (!this.initialized) this.load();
    return {
      totalProducts: this.data.products.length,
      activeProducts: this.data.products.filter((p) => p.is_active).length,
      featuredProducts: this.data.products.filter((p) => p.is_featured).length,
      outOfStockProducts: this.data.products.filter((p) => !p.in_stock).length,
      totalCategories: this.data.categories.length,
      totalPartnerships: (this.data.partnerships || []).length,
    };
  }

  exportData(): { exported_at: string; categories: Category[]; products: Product[] } {
    if (!this.initialized) this.load();
    return {
      exported_at: new Date().toISOString(),
      categories: this.data.categories,
      products: this.data.products,
    };
  }

  importData(data: { categories: Category[]; products: Product[] }): void {
    if (!Array.isArray(data.categories) || !Array.isArray(data.products)) {
      throw new Error('Dữ liệu JSON không hợp lệ. Phải chứa mảng "categories" và "products".');
    }
    this.data.categories = data.categories.map((c, idx) => ({
      ...c,
      id: c.id || idx + 1,
      order_index: c.order_index || idx + 1,
    }));

    this.data.products = data.products.map((p: any, idx) => ({
      ...p,
      id: p.id || idx + 1,
      category_id: p.category_id ? Number(p.category_id) : null,
      price: Number(p.price) || 0,
      original_price: p.original_price ? Number(p.original_price) : null,
      additional_images: Array.isArray(p.additional_images) ? p.additional_images : [],
      is_featured: p.is_featured ? 1 : 0,
      is_active: p.is_active !== undefined ? (p.is_active ? 1 : 0) : 1,
      in_stock: p.in_stock !== undefined ? (p.in_stock ? 1 : 0) : 1,
    }));

    this.save();
  }
}

export const store = new JsonStore();
