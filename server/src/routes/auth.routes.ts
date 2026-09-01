import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';
import { config } from '../config.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
    });
    return;
  }

  const admin = store.getAdminUser();

  if (username !== admin.username) {
    res.status(401).json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    });
    return;
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  res.json({
    success: true,
    message: 'Đăng nhập trang quản trị thành công.',
    token,
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  });
});

// GET /api/auth/me (Verify session)
authRouter.get('/me', requireAuth, (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// POST /api/auth/change-password
authRouter.post('/change-password', requireAuth, (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.',
    });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
    });
    return;
  }

  const admin = store.getAdminUser();

  const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, admin.password_hash);
  if (!isCurrentPasswordValid) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu hiện tại không đúng.',
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);

  store.updateAdminPassword(newHash);

  res.json({
    success: true,
    message: 'Đổi mật khẩu quản trị viên thành công.',
  });
});

