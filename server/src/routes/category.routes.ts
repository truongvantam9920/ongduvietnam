import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

export const categoryRouter = Router();

// GET /api/categories - Public
categoryRouter.get('/', (_req, res) => {
  const categories = store.getCategories();

  res.json({
    success: true,
    data: categories,
  });
});

// POST /api/categories - Admin only
categoryRouter.post('/', requireAuth, (req, res) => {
  const { name, slug, description, order_index } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'Tên danh mục không được để trống.',
    });
    return;
  }

  // Check unique slug if provided
  if (slug) {
    const existing = store.getCategoryBySlug(slug);
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Đường dẫn (slug) của danh mục đã tồn tại.',
      });
      return;
    }
  }

  const newCategory = store.createCategory({
    name,
    slug,
    description,
    order_index: typeof order_index === 'number' ? order_index : undefined,
  });

  res.status(201).json({
    success: true,
    message: 'Thêm danh mục mới thành công.',
    data: newCategory,
  });
});

// PUT /api/categories/:id - Admin only
categoryRouter.put('/:id', requireAuth, (req, res) => {
  const categoryId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(categoryId)) {
    res.status(400).json({ success: false, message: 'Mã danh mục không hợp lệ.' });
    return;
  }

  const { name, slug, description, order_index } = req.body;

  const category = store.getCategoryById(categoryId);
  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục.',
    });
    return;
  }

  const updatedCategory = store.updateCategory(categoryId, {
    name,
    slug,
    description,
    order_index,
  });

  res.json({
    success: true,
    message: 'Cập nhật danh mục thành công.',
    data: updatedCategory,
  });
});

// DELETE /api/categories/:id - Admin only
categoryRouter.delete('/:id', requireAuth, (req, res) => {
  const categoryId = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(categoryId)) {
    res.status(400).json({ success: false, message: 'Mã danh mục không hợp lệ.' });
    return;
  }

  const category = store.getCategoryById(categoryId);
  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục cần xóa.',
    });
    return;
  }

  store.deleteCategory(categoryId);

  res.json({
    success: true,
    message: 'Xóa danh mục thành công.',
  });
});

