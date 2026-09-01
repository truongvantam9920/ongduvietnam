import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Initialize Express App
export const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for client/public images & uploads
const clientPublicImagesPath = path.resolve(process.cwd(), 'client/public/images');
if (fs.existsSync(clientPublicImagesPath)) {
  app.use('/images', express.static(clientPublicImagesPath));
}
app.use('/uploads', express.static(config.uploadDir));

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
