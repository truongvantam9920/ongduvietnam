import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ShoppingBag, Sparkles, MessageCircle } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { PageRoute } from '../../types/index.js';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { hotline, zaloNumber } = CONTACT_INFO;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: PageRoute, hash?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(route);
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems: { label: string; route: PageRoute; hash?: string; icon?: React.ElementType }[] = [
    { label: 'Trang Chủ', route: 'home' },
    { label: 'Sản Phẩm', route: 'products', icon: ShoppingBag },
    { label: 'Liên Hệ', route: 'home', hash: '#contact', icon: MessageCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b ${
        isScrolled
          ? 'bg-[#123b2a]/90 backdrop-blur-xl border-emerald-500/20 shadow-2xl py-3'
          : 'bg-[#123b2a]/75 backdrop-blur-lg border-white/5 shadow-lg py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo & Emblem */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95 focus:outline-hidden cursor-pointer"
          >
            {/* Logo Emblem */}
            <div className="w-10 h-10 rounded-xl bg-[#092218]/90 border border-[#d49a2a]/40 p-1.5 flex items-center justify-center shadow-lg shadow-[#d49a2a]/15 group-hover:border-[#d49a2a] group-hover:shadow-[#d49a2a]/30 transition-all shrink-0">
              <img
                src="/logo-icon.png"
                alt="Ong Dú Việt Nam Logo"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Typography */}
            <div className="leading-tight">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                <span className="text-sm sm:text-lg font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Ong Dú
                </span>
                <span className="text-xs sm:text-lg italic text-amber-400 font-serif">
                  Việt Nam
                </span>
              </div>
              <span className="block text-[8px] sm:text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Mật Ong Dú Tự Nhiên
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-stone-950/40 border border-white/5 backdrop-blur-md">
            {navItems.map((item, idx) => {
              const isActive =
                (item.route === 'products' && currentRoute === 'products') ||
                (item.route === 'home' && currentRoute === 'home' && !item.hash);
              const Icon = item.icon;

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.route, item.hash)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'text-amber-300 bg-emerald-950/90 border border-amber-400/30 shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-amber-400' : 'text-stone-400'
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Zalo Link - Harmonious Forest/Gold Outline */}
            <a
              href={`https://zalo.me/${zaloNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#f0cf7e] bg-[#144130]/80 hover:bg-[#1b553f] border border-[#2a7354]/70 hover:border-[#d49a2a]/50 transition-all flex items-center gap-2 backdrop-blur-md shadow-xs"
            >
              <ZaloIcon className="w-4 h-4 rounded-[4px]" />
              <span>Chat Zalo</span>
            </a>

            {/* Hotline Button - Warm Honey Gold */}
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0c1a13] bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] shadow-md shadow-[#c6891e]/20 transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 fill-[#0c1a13]" />
              <span>Hotline: {hotline}</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="sm:hidden p-2 rounded-lg bg-[#d49a2a] text-[#0c1a13] shadow-sm"
              title="Gọi hotline"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-[#154633] border border-[#23684c]/60 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#d49a2a]" />
              ) : (
                <Menu className="w-5 h-5 text-[#d49a2a]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0e2c20] border-t border-[#23684c]/70 px-4 py-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive =
                (item.route === 'products' && currentRoute === 'products') ||
                (item.route === 'home' && currentRoute === 'home' && !item.hash);

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.route, item.hash)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#184c37] text-[#f0cf7e] border border-[#d49a2a]/40 font-bold'
                      : 'text-stone-200 hover:bg-[#133d2d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4 text-[#d49a2a]" />}
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#1c553e] grid grid-cols-2 gap-2">
            <a
              href={`https://zalo.me/${zaloNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg bg-[#144130]/90 border border-[#2a7354]/70 text-[#f0cf7e] text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <ZaloIcon className="w-4 h-4 rounded-[4px]" />
              <span>Chat Zalo</span>
            </a>
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#d49a2a] to-[#c6891e] text-[#0c1a13] text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md"
            >
              <Phone className="w-3.5 h-3.5 fill-[#0c1a13]" />
              <span>{hotline}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
