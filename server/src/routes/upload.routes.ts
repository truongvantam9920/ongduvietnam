import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import { config } from '../config.js';

export const uploadRouter = Router();

function saveLocalFile(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const baseName = path.basename(file.originalname, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);

  const uniqueFileName = `ongdu-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;

  // Ensure upload directories exist
  const clientUploadsDir = path.resolve(process.cwd(), 'client/public/images/uploads');
  const fallbackDir = config.uploadDir;

  for (const dir of [clientUploadsDir, fallbackDir]) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch {}
  }

  try {
    const clientPath = path.join(clientUploadsDir, uniqueFileName);
    fs.writeFileSync(clientPath, file.buffer);
    return `/images/uploads/${uniqueFileName}`;
  } catch {
    const fallbackPath = path.join(fallbackDir, uniqueFileName);
    fs.writeFileSync(fallbackPath, file.buffer);
    return `/uploads/${uniqueFileName}`;
  }
}

// POST /api/upload - Single image local upload
uploadRouter.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng chọn tệp hình ảnh để tải lên.',
    });
    return;
  }

  try {
    const fileUrl = saveLocalFile(req.file);

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
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi lưu ảnh lên máy chủ.',
    });
  }
});

// POST /api/upload/multiple - Multiple images local upload
uploadRouter.post('/multiple', requireAuth, upload.array('images', 8), (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Vui lòng chọn ít nhất một hình ảnh để tải lên.',
    });
    return;
  }

  try {
    const urls = files.map((file) => saveLocalFile(file));

    res.json({
      success: true,
      message: `Đã tải lên thành công ${files.length} hình ảnh.`,
      urls,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Lỗi khi lưu nhiều ảnh lên máy chủ.',
    });
  }
});
