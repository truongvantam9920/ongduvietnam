import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { PageRoute } from '../../types/index.js';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { hotline, zaloNumber, address, email } = CONTACT_INFO;

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-emerald-950/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#092218]/90 border border-[#d49a2a]/40 p-1.5 flex items-center justify-center shadow-lg shadow-[#d49a2a]/15 shrink-0">
                <img
                  src="/logo-icon.png"
                  alt="Ong Dú Việt Nam Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block">
                  Ong Dú <span className="text-[#f0cf7e]">Việt Nam</span>
                </span>
                <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">
                  Mật Ong Dú Thượng Hạng
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tiên phong bảo tồn và nhân giống đàn ong dú bản địa Việt Nam (<em>Meliponini</em>). Cam kết mang tới những giọt mật đa hoa và keo ong Propolis thuần khiết nhất từ thiên nhiên đại ngàn.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Thuần khiết • Giàu Trehalulose • Không xử lý nhiệt</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Trang Chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Danh Sách Sản Phẩm
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Về Loài Ong Dú (Meliponini)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.querySelector('#comparison')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  So Sánh Mật Dú & Mật Thường
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.querySelector('#quality-guide')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Cách Nhận Biết Mật Chuẩn Thật
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-serif">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${hotline.replace(/\s+/g, '')}`} className="text-amber-400 font-bold hover:underline">
                  {hotline}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-amber-400">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Consultation & Hours */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-serif">
              Tư Vấn Trực Tuyến 24/7
            </h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Chuyên viên chăm sóc khách hàng và kỹ thuật viên ong học sẵn sàng tư vấn liều lượng sử dụng phù hợp với thể trạng của bạn.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`https://zalo.me/${zaloNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#14412f]/80 hover:bg-[#1b553e] border border-[#266e4f]/70 text-[#f0cf7e] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <ZaloIcon className="w-4 h-4 rounded-[4px]" />
                <span>Nhắn Zalo: {zaloNumber}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Hotline: {hotline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Discreet Admin Entry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Ong Dú Việt Nam. Bảo lưu mọi quyền. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>in Vietnam.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-400">100% Nông nghiệp sinh thái</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
