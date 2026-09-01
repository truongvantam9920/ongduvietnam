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

  const uniqueFileName = `upload-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;

  // 1. Primary target: client/public/images
  const clientPublicImagesDir = path.resolve(process.cwd(), 'client/public/images');
  try {
    if (!fs.existsSync(clientPublicImagesDir)) {
      fs.mkdirSync(clientPublicImagesDir, { recursive: true });
    }
    const publicPath = path.join(clientPublicImagesDir, uniqueFileName);
    fs.writeFileSync(publicPath, file.buffer);
  } catch (err) {
    console.warn('[Upload] Failed saving to client/public/images:', err);
  }

  // 2. Also save to dist/client/images if exists so production server serves it immediately without rebuild
  const distClientImagesDir = path.resolve(process.cwd(), 'dist/client/images');
  try {
    if (fs.existsSync(distClientImagesDir)) {
      const distPath = path.join(distClientImagesDir, uniqueFileName);
      fs.writeFileSync(distPath, file.buffer);
    }
  } catch {}

  // 3. Fallback to uploads dir if configured
  try {
    if (config.uploadDir && config.uploadDir !== clientPublicImagesDir) {
      if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(config.uploadDir, uniqueFileName), file.buffer);
    }
  } catch {}

  return `/images/${uniqueFileName}`;
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
