import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, User as UserIcon, Key, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import type { PageRoute } from '../types/index.js';

interface AdminLoginPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('admin-dashboard');
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      error('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(username.trim(), password);
      success('Đăng nhập quản trị viên thành công!');
      onNavigate('admin-dashboard');
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFillDefaultCredentials = () => {
    setUsername('admin');
    setPassword('your_secure_password_here');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-b from-stone-900 via-stone-950 to-black text-stone-200 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ Website</span>
        </button>

        {/* Login Box */}
        <div className="bg-stone-900/90 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
              Khu Vực Quản Trị Ẩn
            </h1>
            <p className="text-xs text-stone-400">
              Cổng quản lý sản phẩm và danh mục dành cho Quản trị viên Ong Dú Việt Nam.
            </p>
          </div>

          {/* Quick Default Credentials Note */}
          <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700 text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tài khoản mặc định:
              </span>
              <button
                type="button"
                onClick={handleFillDefaultCredentials}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
              >
                Tự động điền
              </button>
            </div>
            <div className="text-[11px] text-stone-300 space-y-0.5 font-mono">
              <div>User: <strong>admin</strong></div>
              <div>Pass: <strong>your_secure_password_here</strong></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Tên tài khoản quản trị:
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-800/80 border border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white text-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-800/80 border border-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white text-xs outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[11px] text-stone-500">
              Trang quản trị được bảo mật bằng JWT và chuẩn mã hóa mật khẩu an toàn.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
