import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { FloatingContactBar } from './components/layout/FloatingContactBar.js';
import { HomePage } from './pages/HomePage.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { Agentation } from 'agentation';
import type { PageRoute } from './types/index.js';

function pathToRoute(path: string): PageRoute {
  const normalized = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (normalized === '/san-pham' || normalized === '/products') {
    return 'products';
  }
  if (normalized === '/admin' || normalized === '/admin-login' || normalized === '/admin/login') {
    return 'admin-login';
  }
  if (normalized === '/admin/dashboard' || normalized === '/admin-dashboard') {
    return 'admin-dashboard';
  }
  return 'home';
}

function routeToPath(route: PageRoute): string {
  switch (route) {
    case 'products':
      return '/san-pham';
    case 'admin-login':
      return '/admin';
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'home':
    default:
      return '/';
  }
}

const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    pathToRoute(window.location.pathname)
  );

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(pathToRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    const newPath = routeToPath(route);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  // Route security & auto-redirects
  useEffect(() => {
    if (isAuthLoading) return;

    if (currentRoute === 'admin-login' && isAuthenticated) {
      navigateTo('admin-dashboard');
    } else if (currentRoute === 'admin-dashboard' && !isAuthenticated) {
      navigateTo('admin-login');
    }
  }, [currentRoute, isAuthenticated, isAuthLoading]);

  const isAdminRoute = currentRoute === 'admin-login' || currentRoute === 'admin-dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      {!isAdminRoute && (
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />
      )}

      <main className="flex-1">
        {currentRoute === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentRoute === 'products' && <ProductsPage onNavigate={navigateTo} />}
        {currentRoute === 'admin-login' && <AdminLoginPage onNavigate={navigateTo} />}
        {currentRoute === 'admin-dashboard' && (
          isAuthLoading ? (
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : isAuthenticated ? (
            <AdminDashboardPage onNavigate={navigateTo} />
          ) : (
            <AdminLoginPage onNavigate={navigateTo} />
          )
        )}
      </main>

      {!isAdminRoute && (
        <>
          <Footer onNavigate={navigateTo} />
          <FloatingContactBar onNavigate={navigateTo} currentRoute={currentRoute} />
        </>
      )}

      {/* Agentation Visual Feedback Toolbar (Development Only) */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
