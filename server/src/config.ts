import dotenv from 'dotenv';
import path from 'node:path';

// Load .env file with override
dotenv.config({ override: true });

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
  uploadDir: process.env.VERCEL
    ? '/tmp/uploads'
    : path.resolve(process.cwd(), 'client/public/images/uploads'),
};

