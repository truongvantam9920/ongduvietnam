import React from 'react';
import { Droplets, Sparkles, CheckCircle2, Shield, Heart, Flower2, Scale, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-[#d49a2a]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Loài Ong Xã Hội Nhỏ Nhất Thế Giới</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ong Dú Là Gì? <span className="text-gold-gradient">"Vàng Lỏng"</span> Của Rừng Nhiệt Đới
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed font-normal">
            Ong dú (dân gian gọi là <strong className="text-stone-200">ong rú, ong lỗ, ong muỗi</strong>; tên khoa học <strong className="text-[#f0cf7e]">Meliponini</strong>, tiếng Anh: <em>"stingless bee"</em>) là nhóm ong bản địa đặc trưng của rừng nhiệt đới Việt Nam.
          </p>
        </div>

        {/* 3 Core Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e2c20]/80 p-7 sm:p-8 rounded-3xl border border-[#206147]/50 hover:border-emerald-500/50 transition-all duration-300 space-y-4 backdrop-blur-md group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#14412f] border border-[#276e50]/60 text-emerald-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#f0cf7e] transition-colors">
              Hoàn Toàn Không Có Ngòi Đốt
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Cùng họ <em>Apidae</em> với ong mật nhưng không có ngòi chích để tự vệ. Ong dú cực kỳ hiền lành, an toàn tuyệt đối cho người già, trẻ nhỏ và hệ sinh thái vườn nhà.
            </p>
          </div>

          <div className="bg-[#0e2c20]/80 p-7 sm:p-8 rounded-3xl border border-[#206147]/50 hover:border-[#d49a2a]/50 transition-all duration-300 space-y-4 backdrop-blur-md group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#173e2c] border border-[#2c7756]/60 text-[#f0cf7e] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#f0cf7e] transition-colors">
              Lấy Mật Từ Hoa Li Ti & Cây Thuốc
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Kích thước tí hon chỉ từ <strong>2–8mm</strong> giúp ong dú chui sâu vào nhị các loài hoa dại rừng và cây dược liệu siêu nhỏ mà các loài ong lớn không thể chạm tới.
            </p>
          </div>

          <div className="bg-[#0e2c20]/80 p-7 sm:p-8 rounded-3xl border border-[#206147]/50 hover:border-emerald-500/50 transition-all duration-300 space-y-4 backdrop-blur-md group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#14412f] border border-[#276e50]/60 text-emerald-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#f0cf7e] transition-colors">
              Tổ Bằng Keo Sáp Cerumen
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Tổ cấu tạo từ hỗn hợp sáp và keo ong tự nhiên (<em>Cerumen</em>). Mật được ủ kín trong túi keo kháng khuẩn, lên men tự nhiên tạo vị chua ngọt thanh mát trứ danh.
            </p>
          </div>
        </div>

        {/* Detailed Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#246b4e]/50 aspect-[4/3] bg-[#071911] relative group p-2 bg-gradient-to-br from-emerald-600/20 to-transparent">
              <div className="relative rounded-2xl overflow-hidden w-full h-full">
                <img
                  src="/images/about-cerumen-nest.jpg"
                  alt="Cấu trúc tổ ong dú và hũ mật sáp Cerumen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06160f]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#0a2318]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#d49a2a]/30 shadow-xl">
                  <span className="text-xs font-bold text-[#f0cf7e] block">Giống Ong Tetragonula Bản Địa</span>
                  <span className="text-[11px] text-emerald-100/70">Việt Nam ghi nhận ~10 loài thuộc 4 giống (Viện Hàn lâm KH&CN VN)</span>
                </div>
              </div>
            </div>

            {/* Production Yield Table */}
            <div className="p-6 bg-gradient-to-br from-[#0e2c20]/90 to-[#123b2a]/70 rounded-3xl border border-[#206147]/60 space-y-4 backdrop-blur-xl shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#d49a2a]" />
                <span>Sản Lượng Thu Hoạch / Tổ / Năm</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 bg-[#081b13]/85 rounded-2xl border border-[#1b553e]/60">
                  <div className="font-extrabold text-[#e2b34d] text-sm">0,3 – 0,8L</div>
                  <div className="text-[11px] text-emerald-100/60 mt-0.5">Mật ong dú</div>
                </div>
                <div className="p-3 bg-[#081b13]/85 rounded-2xl border border-[#1b553e]/60">
                  <div className="font-extrabold text-emerald-300 text-sm">50 – 100g</div>
                  <div className="text-[11px] text-emerald-100/60 mt-0.5">Phấn hoa</div>
                </div>
                <div className="p-3 bg-[#081b13]/85 rounded-2xl border border-[#1b553e]/60">
                  <div className="font-extrabold text-[#e2b34d] text-sm">100 – 200g</div>
                  <div className="text-[11px] text-emerald-100/60 mt-0.5">Keo Propolis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Scientific Distinctions */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tại Sao Mật Ong Dú Thuộc Phân Khúc Đặc Sản Giá Trị Cao?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0e2c20]/80 border border-[#206147]/60 hover:border-[#d49a2a]/40 transition-all backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d49a2a] to-[#b67a16] text-[#081711] flex items-center justify-center shrink-0 shadow-md mt-0.5 font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Mật Đa Hoa Rừng Tự Nhiên</h4>
                  <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 leading-relaxed">
                    Ong dú hút mật từ hàng trăm loài hoa dại, cây dược liệu trong bán kính quanh tổ, khác biệt hoàn toàn với các loại mật đơn hoa nuôi công nghiệp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0e2c20]/80 border border-[#206147]/60 hover:border-emerald-500/40 transition-all backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#18533b] text-emerald-200 border border-[#297856] flex items-center justify-center shrink-0 shadow-md mt-0.5 font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Hàm Lượng Đường Quý Trehalulose</h4>
                  <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 leading-relaxed">
                    Giới khoa học quốc tế đặc biệt quan tâm đến mật ong dú vì chứa <strong>Trehalulose</strong> — loại đường tự nhiên giải phóng chậm, ít gây tăng vọt đường huyết đột ngột so với đường thông thường.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0e2c20]/80 border border-[#206147]/60 hover:border-[#d49a2a]/40 transition-all backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d49a2a] to-[#b67a16] text-[#081711] flex items-center justify-center shrink-0 shadow-md mt-0.5 font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Vai Trò Sinh Thái & Nông Nghiệp Xanh</h4>
                  <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 leading-relaxed">
                    Ong dú thụ phấn hiệu quả cho cây rừng và nông sản, cạnh tranh thức ăn với sâu rầy hại, giúp giảm phụ thuộc vào thuốc BVTV, bảo vệ môi trường sinh thái.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e3224]/90 border border-[#23684c]/70 flex items-center gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                Mỗi lít mật ong dú trên thị trường có giá từ <strong>1,5 – 2,5+ triệu đồng</strong> do tính quý hiếm, sản lượng ít và công phu bảo tồn tự nhiên.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
