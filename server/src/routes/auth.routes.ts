import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';
import { config } from '../config.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { loginRateLimiter, recordFailedAttempt, resetAttempts, getClientIp } from '../middleware/rateLimiter.js';

export const authRouter = Router();

// Dummy constant hash with cost factor 10 to ensure timing is identical when username doesn't exist
const TIMING_SAFE_DUMMY_HASH = '$2b$10$e8iVw6wWbT8Xm/m12.3cvew4o1r9E8L6jI7jR.E3q9m8w6wWbT8Xm';

// POST /api/auth/login
authRouter.post('/login', loginRateLimiter, (req, res) => {
  const { username, password } = req.body;
  const clientIp = getClientIp(req);

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
    });
    return;
  }

  // Chống DoS: Giới hạn độ dài đầu vào để tránh attacker gửi chuỗi quá dài làm nghẽn CPU bcrypt
  if (username.length > 50 || password.length > 100) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu đăng nhập vượt quá độ dài cho phép.',
    });
    return;
  }

  const admin = store.getAdminUser();
  const isUsernameMatch = username === admin.username;

  // Run bcrypt verification regardless of username match to prevent timing attacks
  const hashToCompare = isUsernameMatch ? admin.password_hash : TIMING_SAFE_DUMMY_HASH;
  const isPasswordValid = bcrypt.compareSync(password, hashToCompare);

  if (!isUsernameMatch || !isPasswordValid) {
    const { remaining, isBlocked } = recordFailedAttempt(clientIp);
    const warning = isBlocked
      ? ' Hệ thống đã tạm khóa tính năng đăng nhập trong 15 phút để bảo vệ an toàn.'
      : ` (Còn ${remaining} lần thử trước khi bị tạm khóa)`;

    res.status(401).json({
      success: false,
      message: `Tên đăng nhập hoặc mật khẩu không chính xác.${warning}`,
    });
    return;
  }

  // Đăng nhập thành công -> Reset bộ đếm thử sai của IP này
  resetAttempts(clientIp);

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

