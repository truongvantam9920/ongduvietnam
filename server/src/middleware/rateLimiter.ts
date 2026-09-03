import type { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil: number;
}

const attemptsMap = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 phút
const BLOCK_DURATION_MS = 15 * 60 * 1000; // Khóa 15 phút nếu vượt quá

// Lấy IP chuẩn của client (hỗ trợ cả Vercel, Cloudflare, Proxy)
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || req.ip || 'unknown-ip';
}

export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (record && record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    const remainingMinutes = Math.ceil(remainingSeconds / 60);

    res.status(429).json({
      success: false,
      message: `Hệ thống phát hiện đăng nhập sai nhiều lần. Để bảo vệ an toàn, vui lòng thử lại sau ${remainingMinutes} phút (${remainingSeconds}s).`,
      retryAfter: remainingSeconds,
    });
    return;
  }

  next();
}

export function recordFailedAttempt(ip: string): { remaining: number; isBlocked: boolean } {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attemptsMap.set(ip, {
      count: 1,
      firstAttempt: now,
      blockedUntil: 0,
    });
    return { remaining: MAX_ATTEMPTS - 1, isBlocked: false };
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return { remaining: 0, isBlocked: true };
  }

  return { remaining: MAX_ATTEMPTS - record.count, isBlocked: false };
}

export function resetAttempts(ip: string): void {
  attemptsMap.delete(ip);
}

export function getRemainingAttempts(ip: string): number {
  const record = attemptsMap.get(ip);
  if (!record) return MAX_ATTEMPTS;
  const now = Date.now();
  if (now - record.firstAttempt > WINDOW_MS) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - record.count);
}

// Tự động dọn dẹp bộ nhớ mỗi 10 phút
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attemptsMap.entries()) {
    if (now - record.firstAttempt > WINDOW_MS && record.blockedUntil < now) {
      attemptsMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);
