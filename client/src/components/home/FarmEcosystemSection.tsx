import React from 'react';
import { QrCode, MapPin } from 'lucide-react';

export const FarmEcosystemSection: React.FC = () => {
  const farms = [
    {
      name: 'FARM ONG DÚ KHÁNH HÒA - SUỐI CÁT',
      location: 'Huyện Cam Lâm, Tỉnh Khánh Hòa',
      hives: 300,
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
      tag: 'Farm trung tâm',
    },
    {
      name: 'FARM ONG DÚ BÌNH PHƯỚC - ĐỒNG XOÀI',
      location: 'TP. Đồng Xoài, Tỉnh Bình Phước',
      hives: 150,
      image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
      tag: 'Mô hình phố',
    },
    {
      name: 'FARM ONG DÚ TÂY NGUYÊN - ĐẮK LẮK',
      location: 'Huyện Cư M\'gar, Tỉnh Đắk Lắk',
      hives: 120,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      tag: 'Rừng hữu cơ',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#123b2a] text-stone-200 relative overflow-hidden border-t border-emerald-900/40">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              Nuôi Thật · Ghi Chép Thật · Minh Bạch Từng Tổ
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
              Hệ Thống Farm & <span className="text-gold-gradient">Truy Xuất QR Từng Tổ</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
              Mỗi thùng ong dú đều thuộc về một farm có thật, có chuyên viên chăm sóc và hồ sơ điện tử ghi nhận minh bạch trọn đời.
            </p>
          </div>

          {/* Live Farm Counters */}
          <div className="flex items-center gap-3 bg-stone-900/90 border border-emerald-800/60 p-4 rounded-3xl shrink-0 shadow-xl">
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-2xl font-extrabold text-amber-400 font-serif">570+</div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Tổ ong</div>
            </div>
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-2xl font-extrabold text-emerald-400 font-serif">3</div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Farm sinh thái</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-extrabold text-white font-serif">620+</div>
              <div className="text-[10px] text-stone-400 uppercase font-semibold">Lượt ghi nhận</div>
            </div>
          </div>
        </div>

        {/* 3 Farm Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farms.map((farm, idx) => (
            <div
              key={idx}
              className="bg-stone-900/80 rounded-3xl overflow-hidden border border-emerald-900/40 hover:border-amber-500/40 shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-950">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-600/40 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xs">
                  {farm.tag}
                </div>
                <div className="absolute bottom-3 right-3 bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                  {farm.hives} tổ ong
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white font-serif leading-snug group-hover:text-amber-400 transition-colors">
                  {farm.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{farm.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
