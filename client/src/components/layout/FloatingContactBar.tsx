import React from 'react';
import { Phone, ShoppingBag } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { PageRoute } from '../../types/index.js';

interface FloatingContactBarProps {
  onNavigate: (route: PageRoute) => void;
  currentRoute: PageRoute;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onNavigate, currentRoute }) => {
  const { hotline, zaloNumber } = CONTACT_INFO;

  const isAdminRoute = currentRoute === 'admin-login' || currentRoute === 'admin-dashboard';
  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md md:hidden">
      <div className="bg-[#0b2218]/95 backdrop-blur-2xl border border-[#24674d]/70 rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] grid grid-cols-3 gap-1 text-center">
        {/* Call button */}
        <a
          href={`tel:${hotline.replace(/\s+/g, '')}`}
          className="py-2.5 px-2 rounded-full bg-[#133f2e] text-[#f0cf7e] font-bold text-[11px] flex items-center justify-center gap-1.5 border border-[#266e4f]/60 active:scale-95 transition-all"
        >
          <Phone className="w-3.5 h-3.5 fill-[#f0cf7e]" />
          <span>Gọi ngay</span>
        </a>

        {/* Zalo button */}
        <a
          href={`https://zalo.me/${zaloNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-2 rounded-full bg-[#103526] text-[#d1fae5] font-bold text-[11px] flex items-center justify-center gap-1.5 border border-[#24684c]/60 active:scale-95 transition-all"
        >
          <ZaloIcon className="w-3.5 h-3.5 rounded-[3px]" />
          <span>Nhắn Zalo</span>
        </a>

        {/* Products button */}
        <button
          onClick={() => {
            onNavigate('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-2.5 px-2 rounded-full bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] text-[#0c1a13] font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-[#c6891e]/20 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#0c1a13]" />
          <span>Mua hàng</span>
        </button>
      </div>
    </div>
  );
};
