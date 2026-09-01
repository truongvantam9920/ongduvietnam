import fs from 'node:fs';
import { app } from './app.js';
import { config } from './config.js';

// Prevent Node event loop from exiting prematurely
const keepAliveTimer = setInterval(() => {}, 1000 * 60 * 60);

// Start server on dual-stack
const server = app.listen(config.port, () => {
  console.log(`=================================================`);
  console.log(`🐝 Ong Dú Việt Nam - Monolith Server`);
  console.log(`🚀 API Server running at: http://localhost:${config.port}`);
  console.log(`📦 Data Store: Pure JSON Catalog (/server/src/data/products.json)`);
  console.log(`📁 Uploads: Local Storage (/client/public/images/uploads)`);
  console.log(`🌐 Mode: ${config.nodeEnv}`);
  console.log(`=================================================`);
  try {
    fs.writeFileSync('server-status.log', `Started at ${new Date().toISOString()} on port ${config.port}\n`);
  } catch {
    // Ignore log write error in read-only environments
  }
});

server.on('error', (err: NodeJS.ErrnoException) => {
  const errMsg = `[Server Error] Code: ${err.code}, Msg: ${err.message}\nStack: ${err.stack}\n`;
  try {
    fs.appendFileSync('server-status.log', errMsg);
  } catch {}
  console.error(errMsg);
  clearInterval(keepAliveTimer);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  const errMsg = `[Uncaught] ${err.message}\nStack: ${err.stack}\n`;
  try {
    fs.appendFileSync('server-status.log', errMsg);
  } catch {}
  console.error(errMsg);
});

process.on('unhandledRejection', (reason) => {
  const errMsg = `[Unhandled] ${String(reason)}\n`;
  try {
    fs.appendFileSync('server-status.log', errMsg);
  } catch {}
  console.error(errMsg);
});

process.on('exit', (code) => {
  try {
    fs.appendFileSync('server-status.log', `[Exit] Code: ${code} at ${new Date().toISOString()}\n`);
  } catch {}
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
