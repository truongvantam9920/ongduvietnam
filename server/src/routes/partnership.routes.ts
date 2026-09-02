import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

export const partnershipRouter = Router();

// GET /api/partnerships - List all active partnerships (or all if admin query)
partnershipRouter.get('/', (req, res) => {
  const includeInactive = req.query.all === 'true' || req.query.includeInactive === 'true';
  const list = store.getPartnerships(includeInactive);
  res.json({
    success: true,
    data: list,
    total: list.length,
  });
});

// GET /api/partnerships/:id - Get partnership details
partnershipRouter.get('/:id', (req, res) => {
  const id = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: 'Mã bài viết hợp tác không hợp lệ.' });
    return;
  }

  const prog = store.getPartnershipById(id);
  if (!prog) {
    res.status(404).json({ success: false, message: 'Không tìm thấy bài viết chương trình hợp tác.' });
    return;
  }

  res.json({
    success: true,
    data: prog,
  });
});

// POST /api/partnerships - Admin: Create new partnership program
partnershipRouter.post('/', requireAuth, (req, res) => {
  const { title, summary, content, image_url } = req.body;

  if (!title?.trim()) {
    res.status(400).json({ success: false, message: 'Tiêu đề chương trình hợp tác không được để trống.' });
    return;
  }

  if (!summary?.trim() || !content?.trim()) {
    res.status(400).json({ success: false, message: 'Tóm tắt và nội dung chi tiết không được để trống.' });
    return;
  }

  if (!image_url?.trim()) {
    res.status(400).json({ success: false, message: 'Vui lòng tải lên hình ảnh đại diện chương trình.' });
    return;
  }

  const created = store.createPartnership(req.body);

  res.status(201).json({
    success: true,
    message: `Đã đăng tải chương trình hợp tác '${created.title}' thành công!`,
    data: created,
  });
});

// PUT /api/partnerships/:id - Admin: Update partnership program
partnershipRouter.put('/:id', requireAuth, (req, res) => {
  const id = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: 'Mã chương trình không hợp lệ.' });
    return;
  }

  const updated = store.updatePartnership(id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Không tìm thấy chương trình hợp tác.' });
    return;
  }

  res.json({
    success: true,
    message: `Đã cập nhật chương trình hợp tác '${updated.title}' thành công!`,
    data: updated,
  });
});

// DELETE /api/partnerships/:id - Admin: Delete partnership program
partnershipRouter.delete('/:id', requireAuth, (req, res) => {
  const id = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: 'Mã chương trình không hợp lệ.' });
    return;
  }

  const deleted = store.deletePartnership(id);
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Không tìm thấy chương trình hợp tác.' });
    return;
  }

  res.json({
    success: true,
    message: `Đã xóa chương trình hợp tác '${deleted.title}' thành công!`,
    data: deleted,
  });
});

// PATCH /api/partnerships/:id/toggle - Admin: Quick toggle active status
partnershipRouter.patch('/:id/toggle', requireAuth, (req, res) => {
  const id = Number.parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: 'Mã chương trình không hợp lệ.' });
    return;
  }

  const updated = store.togglePartnership(id, 'is_active');
  if (!updated) {
    res.status(404).json({ success: false, message: 'Không tìm thấy chương trình hợp tác.' });
    return;
  }

  res.json({
    success: true,
    message: updated.is_active
      ? `Đã hiển thị bài viết '${updated.title}' trên trang chủ`
      : `Đã ẩn bài viết '${updated.title}' khỏi trang chủ`,
    data: updated,
  });
});
