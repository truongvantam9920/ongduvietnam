import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { db } from '../db/database.js';
import type { UserSanitized } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: UserSanitized;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Yêu cầu quyền quản trị viên. Vui lòng đăng nhập.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: number;
      username: string;
      role: string;
    };

    // Verify user still exists in database
    const user = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(decoded.id) as UserSanitized | undefined;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị xóa.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
    });
  }
}
