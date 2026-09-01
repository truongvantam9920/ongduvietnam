import React from 'react';
import { Phone, Sparkles, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { PageRoute } from '../../types/index.js';

interface CTASectionProps {
  onNavigate: (route: PageRoute) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  const { hotline, zaloNumber } = CONTACT_INFO;

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-[#091f17] via-[#123b2a] to-[#071710] text-white relative overflow-hidden border-t border-[#1d523c]/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-[#d49a2a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-9">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#d49a2a]" />
          <span>Tinh Hoa Dược Liệu Tự Nhiên Cho Gia Đình</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight tracking-tight">
          Trải Nghiệm Hương Vị Mật Ong Dú <span className="text-gold-gradient">Thuần Khiết Đại Ngàn</span>
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/75 max-w-2xl mx-auto leading-relaxed font-normal">
          Giao hàng toàn quốc — Được mở hộp kiểm tra màu sắc & độ sánh trước khi thanh toán — Cam kết hoàn tiền 200% nếu phát hiện mật giả hoặc pha trộn đường.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-sm shadow-xl shadow-[#c6891e]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đặt Hàng Ngay</span>
            <ArrowRight className="w-4 h-4 text-[#0c1a13]" />
          </button>

          <a
            href={`https://zalo.me/${zaloNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0e2c20]/90 hover:bg-[#14412f] text-emerald-100 font-semibold text-sm border border-[#24674d]/70 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ZaloIcon className="w-4 h-4 rounded-[4px]" />
            <span>Chat Zalo ({zaloNumber})</span>
          </a>

          <a
            href={`tel:${hotline.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0e2c20]/90 hover:bg-[#14412f] text-[#f0cf7e] font-semibold text-sm border border-[#d49a2a]/40 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#d49a2a]" />
            <span>Hotline: {hotline}</span>
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-100/60">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Miễn phí đổi trả 7 ngày
          </span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#d49a2a]" /> Đóng chai thủy tinh cao cấp
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Nguồn gốc sinh thái minh bạch
          </span>
        </div>
      </div>
    </section>
  );
};
