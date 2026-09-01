import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { initDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();

// Initialize Database & Seed if empty
initDatabase();
seedDatabase(false);

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images (local fallback)
app.use('/uploads', express.static(config.uploadDir));

// API Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Ong Dú Việt Nam API',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    r2Configured: config.r2.isConfigured,
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
} else {
  // Development notice if client not built yet
  app.get('/', (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Ong Dú Việt Nam - API Server</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #d97706;">🐝 Ong Dú Việt Nam Server</h1>
          <p>Máy chủ Backend đang hoạt động tại cổng ${config.port}.</p>
          <p>Frontend phát triển đang chạy tại Vite dev server (thường là http://localhost:3000).</p>
          <p><a href="/api/products" style="color: #b45309;">Xem danh sách sản phẩm API: /api/products</a></p>
        </body>
      </html>
    `);
  });
}

// Global Error Handler
app.use(errorHandler);

// Prevent Node event loop from exiting prematurely
const keepAliveTimer = setInterval(() => {}, 1000 * 60 * 60);

// Start server on dual-stack
const server = app.listen(config.port, () => {
  console.log(`=================================================`);
  console.log(`🐝 Ong Dú Việt Nam - Monolith Server`);
  console.log(`🚀 API Server running at: http://localhost:${config.port}`);
  console.log(`📦 Database path: ${config.dbPath}`);
  console.log(`☁️  Cloudflare R2: ${config.r2.isConfigured ? `Configured (Bucket: ${config.r2.bucketName})` : 'Local Fallback'}`);
  console.log(`🌐 Mode: ${config.nodeEnv}`);
  console.log(`=================================================`);
  fs.writeFileSync('server-status.log', `Started at ${new Date().toISOString()} on port ${config.port}\n`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  const errMsg = `[Server Error] Code: ${err.code}, Msg: ${err.message}\nStack: ${err.stack}\n`;
  fs.appendFileSync('server-status.log', errMsg);
  console.error(errMsg);
  clearInterval(keepAliveTimer);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  const errMsg = `[Uncaught] ${err.message}\nStack: ${err.stack}\n`;
  fs.appendFileSync('server-status.log', errMsg);
  console.error(errMsg);
});

process.on('unhandledRejection', (reason) => {
  const errMsg = `[Unhandled] ${String(reason)}\n`;
  fs.appendFileSync('server-status.log', errMsg);
  console.error(errMsg);
});

process.on('exit', (code) => {
  fs.appendFileSync('server-status.log', `[Exit] Code: ${code} at ${new Date().toISOString()}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  clearInterval(keepAliveTimer);
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  clearInterval(keepAliveTimer);
  server.close(() => process.exit(0));
});
