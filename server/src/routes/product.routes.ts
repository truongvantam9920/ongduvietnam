import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

export const productRouter = Router();

// GET /api/products/featured - Public featured products for Homepage
productRouter.get('/featured', (_req, res) => {
  const products = store.getFeaturedProducts(6);

  res.json({
    success: true,
    data: products,
  });
});

// GET /api/admin/stats - Admin Dashboard statistics
productRouter.get('/admin/stats', requireAuth, (_req, res) => {
  const stats = store.getStats();

  res.json({
    success: true,
    data: stats,
  });
});

// GET /api/products - Public & Admin Product List
productRouter.get('/', (req, res) => {
  const { category, search, featured, sort, limit, offset, all } = req.query;

  const result = store.getProducts({
    category: category ? String(category) : undefined,
    search: search ? String(search) : undefined,
    featured: featured === 'true' || featured === '1',
    all: all === 'true',
    sort: sort ? String(sort) : undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  res.json({
    success: true,
    data: result.products,
    pagination: {
      total: result.total,
      limit: limit ? Number(limit) : result.products.length,
      offset: offset ? Number(offset) : 0,
      hasMore: (offset ? Number(offset) : 0) + result.products.length < result.total,
    },
  });
});

// GET /api/products/:idOrSlug - Single Product Details
productRouter.get('/:idOrSlug', (req, res) => {
  const idOrSlug = String(req.params.idOrSlug);

  let product = undefined;
  if (/^\d+$/.test(idOrSlug)) {
    product = store.getProductById(Number.parseInt(idOrSlug, 10));
  } else {
    product = store.getProductBySlug(idOrSlug);
  }

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
    is_featured,
    is_active,
    in_stock,
    origin,
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

  const createdProduct = store.createProduct({
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
  });

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

  const updatedProduct = store.updateProduct(productId, req.body);

  if (!updatedProduct) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    return;
  }

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

  const updatedProduct = store.toggleProduct(productId, field);
  if (!updatedProduct) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    return;
  }

  const value = updatedProduct[field as 'is_active' | 'is_featured' | 'in_stock'];

  let friendlyMessage = `Đã cập nhật trạng thái sản phẩm '${updatedProduct.name}'.`;
  if (field === 'in_stock') {
    friendlyMessage = value
      ? `Đã chuyển '${updatedProduct.name}' sang: Còn hàng`
      : `Đã chuyển '${updatedProduct.name}' sang: Hết hàng`;
  } else if (field === 'is_featured') {
    friendlyMessage = value
      ? `Đã đánh dấu Nổi bật cho '${updatedProduct.name}'`
      : `Đã bỏ đánh dấu Nổi bật cho '${updatedProduct.name}'`;
  } else if (field === 'is_active') {
    friendlyMessage = value
      ? `Đã hiển thị sản phẩm '${updatedProduct.name}' trên website`
      : `Đã ẩn sản phẩm '${updatedProduct.name}' khỏi website`;
  }

  res.json({
    success: true,
    message: friendlyMessage,
    data: { [field]: value },
  });
});

// DELETE /api/products/:id - Admin: Delete product
productRouter.delete('/:id', requireAuth, (req, res) => {
  const productId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(productId)) {
    res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ.' });
    return;
  }

  const deleted = store.deleteProduct(productId);

  if (!deleted) {
    res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm cần xóa.' });
    return;
  }

  res.json({
    success: true,
    message: `Đã xóa sản phẩm '${deleted.name}' thành công.`,
  });
});

// GET /api/products/admin/export-data - Export entire database catalog as JSON
productRouter.get('/admin/export-data', requireAuth, (_req, res) => {
  try {
    const data = store.exportData();

    res.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi xuất dữ liệu JSON.',
    });
  }
});

// POST /api/products/admin/import-data - Import entire database catalog from JSON
productRouter.post('/admin/import-data', requireAuth, (req, res) => {
  try {
    store.importData(req.body);

    const stats = store.getStats();

    res.json({
      success: true,
      message: `Đã nạp thành công ${stats.totalCategories} danh mục và ${stats.totalProducts} sản phẩm từ file JSON!`,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi nạp dữ liệu JSON.',
    });
  }
});
