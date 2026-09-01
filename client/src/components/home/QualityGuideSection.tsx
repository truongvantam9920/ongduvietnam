import React from 'react';
import { Eye, Droplet, Wind, Sparkles, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';
import { CONTACT_INFO } from '../../constants/contact.js';

export const QualityGuideSection: React.FC = () => {
  const guides = [
    {
      icon: Eye,
      step: '01',
      title: 'Màu Sắc Vàng Nâu Ánh Trong',
      desc: 'Mật ong dú thật có màu vàng nâu tự nhiên, ánh trong và đồng nhất, không bị vẩn đục hay có màu sáng chói bất thường.',
    },
    {
      icon: Droplet,
      step: '02',
      title: 'Độ Sánh Lỏng Tự Nhiên',
      desc: 'Hơi lỏng hơn mật ong thường một chút do tổ kín ít bay hơi nước, nhưng vẫn có độ sánh dẻo tự nhiên khi rót.',
    },
    {
      icon: Wind,
      step: '03',
      title: 'Hương Thơm Hoa Cỏ Tự Nhiên',
      desc: 'Mùi thơm dịu mát đặc trưng của hoa rừng dại và thảo mộc, không hắc, không nồng mùi hương liệu hóa học hay đường nấu.',
    },
    {
      icon: Sparkles,
      step: '04',
      title: 'Vị Chua Ngọt Thanh Nhã',
      desc: 'Vị ngọt thanh nhẹ kết hợp hậu chua dịu sinh học đặc trưng do quá trình lên men tự nhiên trong tổ keo Cerumen, không gắt cổ.',
    },
  ];

  return (
    <section id="quality-guide" className="py-20 md:py-28 bg-gradient-to-b from-[#123b2a] via-[#0e2c20] to-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Cẩm Nang Người Tiêu Dùng</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            4 Dấu Hiệu Nhận Biết <span className="text-gold-gradient">Mật Ong Dú Chuẩn Thật</span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed font-normal">
            Do giá trị kinh tế cao và sản lượng khan hiếm, người tiêu dùng nên nắm rõ các đặc điểm cảm quan sau để chọn đúng mật ong dú nguyên chất.
          </p>
        </div>

        {/* 4 Bento Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0e2c20]/80 backdrop-blur-xl p-7 rounded-3xl border border-[#206147]/50 hover:border-[#d49a2a]/50 shadow-xl hover:shadow-2xl hover:shadow-[#d49a2a]/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#d49a2a]/30 group-hover:text-[#f0cf7e] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-[#14412f] border border-[#276e50]/60 text-emerald-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#f0cf7e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand Authenticity Guarantee Banner */}
        <div className="p-7 sm:p-8 bg-gradient-to-r from-[#113829]/95 via-[#0e2c20]/95 to-[#123b2a]/95 rounded-3xl border border-[#276e50]/70 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white flex items-center gap-2.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Cam Kết Chất Lượng Từ Ong Dú Việt Nam</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
              100% mật khai thác sinh thái từ chuỗi farm Khánh Hòa, Bình Phước & Đắk Lắk. Hoàn tiền 200% nếu phát hiện mật pha trộn hoặc kém chất lượng.
            </p>
          </div>

          <a
            href={`tel:${CONTACT_INFO.hotline.replace(/\s+/g, '')}`}
            className="px-7 py-3.5 bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-xs rounded-xl shrink-0 shadow-lg shadow-[#c6891e]/20 transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 fill-[#0c1a13]" />
            <span>Hotline: {CONTACT_INFO.hotline}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
