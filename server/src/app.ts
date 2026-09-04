import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { partnershipRouter } from './routes/partnership.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Initialize Express App
export const app = express();

// Security: Ẩn dấu vết framework Express
app.disable('x-powered-by');

// Security: HTTP Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for client/public assets (images, video, uploads)
const clientPublicPath = path.resolve(process.cwd(), 'client/public');
if (fs.existsSync(clientPublicPath)) {
  app.use(express.static(clientPublicPath));
}
try {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
} catch {}

app.use('/uploads', express.static(config.uploadDir));
const fallbackUploadsDir = path.resolve(process.cwd(), 'uploads');
if (fallbackUploadsDir !== config.uploadDir && fs.existsSync(fallbackUploadsDir)) {
  app.use('/uploads', express.static(fallbackUploadsDir));
}

// Dynamic fallback for /uploads in serverless / multi-dir setups
app.get('/uploads/:filename', (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const candidatePaths = [
    path.join(config.uploadDir, filename),
    path.join(process.cwd(), 'uploads', filename),
    path.join('/tmp/uploads', filename),
    path.join(process.cwd(), 'client/public/images', filename),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

// API Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Ong Dú Việt Nam API (Pure JSON Store)',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/partnerships', partnershipRouter);

// Serve Client SPA in production or when built
const clientDistPath = path.resolve(process.cwd(), 'dist/client');

if (fs.existsSync(clientDistPath)) {
  // Serve static assets from built frontend
  app.use(express.static(clientDistPath));

  // Express 5 SPA Fallback Middleware
  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
