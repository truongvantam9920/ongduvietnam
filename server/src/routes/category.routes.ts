import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';
import type { Category } from '../types/index.js';

export const categoryRouter = Router();

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

// GET /api/categories - Public
categoryRouter.get('/', (_req, res) => {
  const query = `
    SELECT 
      c.id, 
      c.name, 
      c.slug, 
      c.description, 
      c.order_index, 
      c.created_at,
      COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.order_index ASC, c.name ASC
  `;

  const categories = db.prepare(query).all() as unknown as (Category & { product_count: number })[];

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

  const cleanName = name.trim();
  const categorySlug = slug && typeof slug === 'string' && slug.trim().length > 0
    ? slugify(slug)
    : slugify(cleanName);

  // Check unique slug
  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);
  if (existing) {
    res.status(400).json({
      success: false,
      message: 'Đường dẫn (slug) của danh mục đã tồn tại.',
    });
    return;
  }

  const orderIndex = typeof order_index === 'number' ? order_index : 0;
  const desc = typeof description === 'string' ? description.trim() : null;

  const result = db.prepare(`
    INSERT INTO categories (name, slug, description, order_index)
    VALUES (?, ?, ?, ?)
  `).run(cleanName, categorySlug, desc, orderIndex);

  const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(Number(result.lastInsertRowid));

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

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as Category | undefined;
  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục.',
    });
    return;
  }

  const cleanName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : category.name;
  const categorySlug = typeof slug === 'string' && slug.trim().length > 0
    ? slugify(slug)
    : slugify(cleanName);

  // Check duplicate slug with other categories
  const duplicate = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(categorySlug, categoryId);
  if (duplicate) {
    res.status(400).json({
      success: false,
      message: 'Đường dẫn (slug) danh mục bị trùng lặp với danh mục khác.',
    });
    return;
  }

  const orderIndex = typeof order_index === 'number' ? order_index : category.order_index;
  const desc = typeof description === 'string' ? description.trim() : category.description;

  db.prepare(`
    UPDATE categories 
    SET name = ?, slug = ?, description = ?, order_index = ?
    WHERE id = ?
  `).run(cleanName, categorySlug, desc, orderIndex, categoryId);

  const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

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

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as Category | undefined;
  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục cần xóa.',
    });
    return;
  }

  // Set category_id = NULL for products in this category
  db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(categoryId);

  // Delete category
  db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);

  res.json({
    success: true,
    message: 'Xóa danh mục thành công.',
  });
});
