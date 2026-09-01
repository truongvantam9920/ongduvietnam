import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { config } from '../config.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import type { User } from '../types/index.js';

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

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
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
      id: user.id,
      username: user.username,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  res.json({
    success: true,
    message: 'Đăng nhập trang quản trị thành công.',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
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

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Chưa xác thực người dùng.',
    });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id) as User | undefined;
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy tài khoản người dùng.',
    });
    return;
  }

  const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password_hash);
  if (!isCurrentPasswordValid) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu hiện tại không đúng.',
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);

  db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newHash, user.id);

  res.json({
    success: true,
    message: 'Đổi mật khẩu quản trị viên thành công.',
  });
});
