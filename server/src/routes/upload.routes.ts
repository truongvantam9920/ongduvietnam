import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImageFile } from '../services/r2.service.js';

export const uploadRouter = Router();

// POST /api/upload - Single image upload to Cloudflare R2 (Admin only)
uploadRouter.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng chọn tệp hình ảnh để tải lên.',
    });
    return;
  }

  try {
    const fileUrl = await uploadImageFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: 'Tải lên hình ảnh thành công.',
      url: fileUrl,
      file: {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err: unknown) {
    console.error('[Upload Error]:', err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi tải ảnh lên Cloudflare R2.',
    });
  }
});

// POST /api/upload/multiple - Multiple images upload to Cloudflare R2 (Admin only)
uploadRouter.post('/multiple', requireAuth, upload.array('images', 8), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  
  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng chọn ít nhất một hình ảnh để tải lên.',
    });
    return;
  }

  try {
    const uploadPromises = files.map((file) =>
      uploadImageFile(file.buffer, file.originalname, file.mimetype)
    );
    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `Đã tải lên thành công ${files.length} hình ảnh.`,
      urls,
    });
  } catch (err: unknown) {
    console.error('[Upload Multiple Error]:', err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi tải nhiều ảnh lên Cloudflare R2.',
    });
  }
});
