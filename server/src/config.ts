import dotenv from 'dotenv';
import path from 'node:path';

// Load .env file with override
dotenv.config({ override: true });

const r2AccountId = process.env.R2_ACCOUNT_ID || '';

export const config = {
  port: Number.parseInt(process.env.PORT || '5050', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_example',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'your_secure_password_here',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
    email: process.env.ADMIN_EMAIL || 'admin@ongduvietnam.vn',
  },
  dbPath: process.env.DATABASE_PATH || (process.env.VERCEL ? '/tmp/ongdu.sqlite' : path.resolve(process.cwd(), 'data/ongdu.sqlite')),
  uploadDir: process.env.VERCEL ? '/tmp/uploads' : path.resolve(process.cwd(), 'uploads'),

  // Cloudflare R2 Object Storage
  r2: {
    accountId: r2AccountId,
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || 'ongduvietnam',
    publicDomain: process.env.R2_PUBLIC_DOMAIN || '',
    endpoint: r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : '',
    isConfigured: Boolean(
      r2AccountId &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      (process.env.R2_BUCKET_NAME || 'ongduvietnam')
    ),
  },
};
