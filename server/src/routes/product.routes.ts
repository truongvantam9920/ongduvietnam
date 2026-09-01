import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';
import type { Product, AdminStats } from '../types/index.js';

export const productRouter = Router();

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

// GET /api/products/featured - Public featured products for Homepage
productRouter.get('/featured', (_req, res) => {
  const query = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = 1 AND p.is_featured = 1
    ORDER BY p.id DESC
    LIMIT 6
  `;

  const products = db.prepare(query).all() as unknown as Product[];

  res.json({
    success: true,
    data: products,
  });
});

// GET /api/admin/stats - Admin Dashboard statistics
productRouter.get('/admin/stats', requireAuth, (_req, res) => {
  const totalRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const activeRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get() as { count: number };
  const featuredRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get() as { count: number };
  const outOfStockRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 0').get() as { count: number };
  const categoriesRow = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };

  const stats: AdminStats = {
    totalProducts: totalRow.count,
    activeProducts: activeRow.count,
    featuredProducts: featuredRow.count,
    outOfStockProducts: outOfStockRow.count,
    totalCategories: categoriesRow.count,
  };

  res.json({
    success: true,
    data: stats,
  });
});

// GET /api/products - Public & Admin Product List
productRouter.get('/', (req, res) => {
  const { category, search, featured, sort, limit = '20', offset = '0', all } = req.query;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  // If 'all' is not requested, only show active products
  if (all !== 'true') {
    conditions.push('p.is_active = 1');
  }

  if (category && typeof category === 'string' && category.trim() !== '') {
    if (/^\d+$/.test(category)) {
      conditions.push('p.category_id = ?');
      params.push(Number.parseInt(category, 10));
    } else {
      conditions.push('c.slug = ?');
      params.push(category);
    }
  }

  if (featured === 'true' || featured === '1') {
    conditions.push('p.is_featured = 1');
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    conditions.push('(p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ?)');
    params.push(term, term, term);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total matching items
  const countSql = `
    SELECT COUNT(*) as total
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereClause}
  `;
  const countRow = db.prepare(countSql).get(...params) as { total: number };

  // Sorting
  let orderBy = 'p.is_featured DESC, p.id DESC';
  if (sort === 'price_asc') {
    orderBy = 'p.price ASC';
  } else if (sort === 'price_desc') {
    orderBy = 'p.price DESC';
  } else if (sort === 'newest') {
    orderBy = 'p.id DESC';
  } else if (sort === 'name') {
    orderBy = 'p.name ASC';
  }

  const parsedLimit = Math.min(Math.max(1, Number.parseInt(String(limit), 10) || 20), 100);
  const parsedOffset = Math.max(0, Number.parseInt(String(offset), 10) || 0);

  const querySql = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const products = db.prepare(querySql).all(...params, parsedLimit, parsedOffset) as unknown as Product[];

  res.json({
    success: true,
    data: products,
    pagination: {
      total: countRow.total,
      limit: parsedLimit,
      offset: parsedOffset,
      hasMore: parsedOffset + products.length < countRow.total,
    },
  });
});

// GET /api/products/:idOrSlug - Single Product Details
productRouter.get('/:idOrSlug', (req, res) => {
  const idOrSlug = String(req.params.idOrSlug);

  let query: string;
  let param: string | number;

  if (/^\d+$/.test(idOrSlug)) {
    query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `;
    param = Number.parseInt(idOrSlug, 10);
  } else {
    query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ?
    `;
    param = idOrSlug;
  }

  const product = db.prepare(query).get(param) as Product | undefined;

  if (!product) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm.',
    });
    return;
  }

  res.json({
    success: true,
    data: product,
  });
});

// POST /api/products - Admin: Create new product
productRouter.post('/', requireAuth, (req, res) => {
  const {
    name,
    slug,
    category_id,
    short_description,
    description,
    price,
    original_price,
    volume,
    image_url,
    additional_images,
    is_featured = 0,
    is_active = 1,
    in_stock = 1,
    origin = 'Việt Nam',
    ingredients,
    usage_instructions,
    preservation,
  } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ success: false, message: 'Tên sản phẩm là bắt buộc.' });
    return;
  }

  if (price === undefined || price === null || Number(price) < 0) {
    res.status(400).json({ success: false, message: 'Giá sản phẩm không hợp lệ.' });
    return;
  }

  if (!image_url || typeof image_url !== 'string') {
    res.status(400).json({ success: false, message: 'Hình ảnh đại diện sản phẩm là bắt buộc.' });
    return;
  }

  const cleanName = name.trim();
  let productSlug = slug && typeof slug === 'string' && slug.trim() !== ''
    ? slugify(slug)
    : slugify(cleanName);

  // If slug exists, append unique random number
  const existingSlug = db.prepare('SELECT id FROM products WHERE slug = ?').get(productSlug);
  if (existingSlug) {
    productSlug = `${productSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  let formattedAddImages: string | null = null;
  if (Array.isArray(additional_images)) {
    formattedAddImages = JSON.stringify(additional_images);
  } else if (typeof additional_images === 'string') {
    formattedAddImages = additional_images;
  }

  const result = db.prepare(`
    INSERT INTO products (
      name, slug, category_id, short_description, description,
      price, original_price, volume, image_url, additional_images,
      is_featured, is_active, in_stock, origin, ingredients,
      usage_instructions, preservation
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )
  `).run(
    cleanName,
    productSlug,
    category_id ? Number(category_id) : null,
    short_description?.trim() || '',
    description?.trim() || '',
    Number(price),
    original_price ? Number(original_price) : null,
    volume?.trim() || null,
    image_url.trim(),
    formattedAddImages,
    is_featured ? 1 : 0,
    is_active !== undefined ? (is_active ? 1 : 0) : 1,
    in_stock !== undefined ? (in_stock ? 1 : 0) : 1,
    origin?.trim() || 'Việt Nam',
    ingredients?.trim() || null,
    usage_instructions?.trim() || null,
    preservation?.trim() || null
  );

  const createdProduct = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(Number(result.lastInsertRowid));

  res.status(201).json({
    success: true,
    message: 'Thêm sản phẩm mới thành công.',
    data: createdProduct,
  });
});

// PUT /api/products/:id - Admin: Update product
productRouter.put('/:id', requireAuth, (req, res) => {
  const productId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(productId)) {
    res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ.' });
    return;
  }

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as Product | undefined;

  if (!existing) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    return;
  }

  const {
    name,
    slug,
    category_id,
    short_description,
    description,
    price,
    original_price,
    volume,
    image_url,
    additional_images,
    is_featured,
    is_active,
    in_stock,
    origin,
    ingredients,
    usage_instructions,
    preservation,
  } = req.body;

  const cleanName = typeof name === 'string' && name.trim() !== '' ? name.trim() : existing.name;
  let productSlug = existing.slug;

  if (slug && typeof slug === 'string' && slug.trim() !== '') {
    productSlug = slugify(slug);
    const duplicate = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(productSlug, productId);
    if (duplicate) {
      productSlug = `${productSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  let formattedAddImages = existing.additional_images;
  if (additional_images !== undefined) {
    if (Array.isArray(additional_images)) {
      formattedAddImages = JSON.stringify(additional_images);
    } else if (typeof additional_images === 'string') {
      formattedAddImages = additional_images;
    } else {
      formattedAddImages = null;
    }
  }

  db.prepare(`
    UPDATE products SET
      name = ?,
      slug = ?,
      category_id = ?,
      short_description = ?,
      description = ?,
      price = ?,
      original_price = ?,
      volume = ?,
      image_url = ?,
      additional_images = ?,
      is_featured = ?,
      is_active = ?,
      in_stock = ?,
      origin = ?,
      ingredients = ?,
      usage_instructions = ?,
      preservation = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    cleanName,
    productSlug,
    category_id !== undefined ? (category_id ? Number(category_id) : null) : existing.category_id,
    short_description !== undefined ? short_description.trim() : existing.short_description,
    description !== undefined ? description.trim() : existing.description,
    price !== undefined ? Number(price) : existing.price,
    original_price !== undefined ? (original_price ? Number(original_price) : null) : existing.original_price,
    volume !== undefined ? volume : existing.volume,
    image_url !== undefined ? image_url.trim() : existing.image_url,
    formattedAddImages,
    is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
    is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    in_stock !== undefined ? (in_stock ? 1 : 0) : existing.in_stock,
    origin !== undefined ? origin : existing.origin,
    ingredients !== undefined ? ingredients : existing.ingredients,
    usage_instructions !== undefined ? usage_instructions : existing.usage_instructions,
    preservation !== undefined ? preservation : existing.preservation,
    productId
  );

  const updatedProduct = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(productId);

  res.json({
    success: true,
    message: 'Cập nhật sản phẩm thành công.',
    data: updatedProduct,
  });
});

// PATCH /api/products/:id/toggle - Admin: Quick toggle field (is_active, is_featured, in_stock)
productRouter.patch('/:id/toggle', requireAuth, (req, res) => {
  const productId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(productId)) {
    res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ.' });
    return;
  }

  const { field } = req.body;

  if (!['is_active', 'is_featured', 'in_stock'].includes(field)) {
    res.status(400).json({ success: false, message: 'Trường thay đổi trạng thái không hợp lệ.' });
    return;
  }

  const product = db.prepare('SELECT id, is_active, is_featured, in_stock FROM products WHERE id = ?').get(productId) as Product | undefined;
  if (!product) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    return;
  }

  const currentValue = (product as unknown as Record<string, number>)[field];
  const newValue = currentValue === 1 ? 0 : 1;

  db.prepare(`UPDATE products SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .run(newValue, productId);

  res.json({
    success: true,
    message: `Đã cập nhật trạng thái ${field} thành ${newValue === 1 ? 'Bật' : 'Tắt'}.`,
    data: { [field]: newValue },
  });
});

// DELETE /api/products/:id - Admin: Delete product
productRouter.delete('/:id', requireAuth, (req, res) => {
  const productId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(productId)) {
    res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ.' });
    return;
  }

  const existing = db.prepare('SELECT id, name FROM products WHERE id = ?').get(productId) as Product | undefined;

  if (!existing) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm cần xóa.' });
    return;
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(productId);

  res.json({
    success: true,
    message: `Đã xóa sản phẩm '${existing.name}' thành công.`,
  });
});

// GET /api/products/admin/export - Export entire database catalog as JSON
productRouter.get('/admin/export-data', requireAuth, (_req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY order_index ASC, id ASC').all();
    const products = db.prepare('SELECT p.*, c.slug as category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.id ASC').all();

    const formattedProducts = products.map((p: any) => {
      let addImages = [];
      try {
        addImages = p.additional_images ? JSON.parse(p.additional_images) : [];
      } catch {
        addImages = [];
      }
      return {
        ...p,
        additional_images: addImages,
      };
    });

    res.json({
      success: true,
      data: {
        exported_at: new Date().toISOString(),
        categories,
        products: formattedProducts,
      },
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi xuất dữ liệu JSON.',
    });
  }
});

// POST /api/products/admin/import - Import entire database catalog from JSON
productRouter.post('/admin/import-data', requireAuth, (req, res) => {
  try {
    const { categories, products } = req.body;

    if (!Array.isArray(categories) || !Array.isArray(products)) {
      res.status(400).json({
        success: false,
        message: 'Dữ liệu JSON không đúng định dạng. Cần chứa mảng "categories" và "products".',
      });
      return;
    }

    db.exec('DELETE FROM products;');
    db.exec('DELETE FROM categories;');

    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, description, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    const categoryMap: Record<string, number> = {};
    for (const cat of categories) {
      const result = insertCategory.run(cat.id || null, cat.name, cat.slug, cat.description || '', cat.order_index || 0);
      const assignedId = cat.id || Number(result.lastInsertRowid);
      categoryMap[cat.slug] = assignedId;
      categoryMap[String(assignedId)] = assignedId;
    }

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, slug, category_id, short_description, description,
        price, original_price, volume, image_url, additional_images,
        is_featured, is_active, in_stock, origin, ingredients,
        usage_instructions, preservation, rating, review_count
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    for (const prod of products) {
      const categoryId = categoryMap[prod.category_slug] || categoryMap[String(prod.category_id)] || null;
      const additionalImagesStr = Array.isArray(prod.additional_images)
        ? JSON.stringify(prod.additional_images)
        : (prod.additional_images || '[]');

      insertProduct.run(
        prod.id || null,
        prod.name,
        prod.slug || slugify(prod.name),
        categoryId,
        prod.short_description || '',
        prod.description || '',
        prod.price || 0,
        prod.original_price || null,
        prod.volume || '',
        prod.image_url || '/images/product-honey-bottle.jpg',
        additionalImagesStr,
        prod.is_featured ? 1 : 0,
        prod.is_active !== undefined ? (prod.is_active ? 1 : 0) : 1,
        prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : 1,
        prod.origin || 'Việt Nam',
        prod.ingredients || '',
        prod.usage_instructions || '',
        prod.preservation || '',
        prod.rating || 5.0,
        prod.review_count || 0
      );
    }

    res.json({
      success: true,
      message: `Đã nạp thành công ${categories.length} danh mục và ${products.length} sản phẩm từ file JSON!`,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi nạp dữ liệu JSON.',
    });
  }
});
