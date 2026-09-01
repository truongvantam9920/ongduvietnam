export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSanitized {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  created_at?: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  short_description: string;
  description: string;
  price: number;
  original_price: number | null;
  volume: string | null;
  image_url: string;
  additional_images: string[] | string | null;
  is_featured: number; // 0 or 1
  is_active: number; // 0 or 1
  in_stock: number; // 0 or 1
  origin: string | null;
  ingredients: string | null;
  usage_instructions: string | null;
  preservation: string | null;
  rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCreateInput {
  name: string;
  slug?: string;
  category_id?: number | null;
  short_description: string;
  description: string;
  price: number;
  original_price?: number | null;
  volume?: string | null;
  image_url: string;
  additional_images?: string[] | string | null;
  is_featured?: boolean | number;
  is_active?: boolean | number;
  in_stock?: boolean | number;
  origin?: string | null;
  ingredients?: string | null;
  usage_instructions?: string | null;
  preservation?: string | null;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  featured?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}

export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
}
