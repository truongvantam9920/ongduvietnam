import type { Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error Middleware]:', err);

  const isHttpError = err instanceof Error;
  const status = isHttpError && 'status' in err && typeof (err as HttpError).status === 'number'
    ? (err as HttpError).status
    : isHttpError && 'statusCode' in err && typeof (err as HttpError).statusCode === 'number'
    ? (err as HttpError).statusCode
    : 500;

  const message = isHttpError ? err.message : 'Đã có lỗi xảy ra trên hệ thống máy chủ.';
  const stack = isHttpError && process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(status || 500).json({
    success: false,
    message,
    stack,
  });
}
