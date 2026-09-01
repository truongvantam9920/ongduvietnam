import React from 'react';
import { BookOpen, Calendar, ArrowRight, Sparkles, Clock, ArrowUpRight } from 'lucide-react';

export const KnowledgeSection: React.FC = () => {
  const articles = [
    {
      title: 'Nuôi Ong Dú — Mô hình nông nghiệp xanh tiềm năng bền vững',
      date: '18/08/2026',
      readTime: '4 phút đọc',
      desc: 'Ong dú tuy nhỏ bé nhưng đang mở ra hướng phát triển kinh tế sinh thái đầy tiềm năng. Không tốn thức ăn, không độc hại và bảo vệ môi trường tự nhiên.',
      image: '/images/knowledge-eco-farm.jpg',
      tag: 'Mô hình kinh tế',
    },
    {
      title: 'Kỹ thuật tách đàn ong dú: Nhân giống an toàn không hại tổ mẹ',
      date: '05/08/2026',
      readTime: '6 phút đọc',
      desc: 'Chọn đúng thời điểm đàn sung mãn, chia trứng chúa và quân thợ hợp lý giúp nhân giống thành công mà vẫn bảo toàn tuyệt đối lượng mật tích trữ.',
      image: '/images/knowledge-hive-split.jpg',
      tag: 'Kỹ thuật nuôi',
    },
    {
      title: 'Khám phá Farm ong dú Khánh Hòa: Trải nghiệm chạm vào đàn ong không đốt',
      date: '22/07/2026',
      readTime: '5 phút đọc',
      desc: 'Tour trải nghiệm sinh thái: Tự tay mở nắp thùng quan sát hũ mật Cerumen, nếm thử mật tươi tại vườn và hiểu sâu về tập tính loài ong tí hon.',
      image: '/images/knowledge-honey-harvest.jpg',
      tag: 'Du lịch trải nghiệm',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#123b2a] via-[#0e2c20] to-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[45rem] h-[25rem] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-[#d49a2a]" />
              <span>Hiểu Đúng · Dùng Đúng</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Kiến Thức Về <span className="text-gold-gradient">Ong Dú</span>
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/70 leading-relaxed font-normal">
              Cẩm nang sinh học, kỹ thuật nuôi dưỡng và kinh nghiệm thưởng thức mật ong dú nguyên bản đúng chuẩn.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0e2c20]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#206147]/50 hover:border-[#d49a2a]/50 shadow-xl hover:shadow-2xl hover:shadow-[#d49a2a]/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#071911]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06160f]/80 via-transparent to-transparent opacity-50" />
                <div className="absolute top-3.5 left-3.5 bg-[#0a2419]/90 backdrop-blur-md border border-[#24694d]/60 text-[#d1fae5] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                  {item.tag}
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-emerald-100/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d49a2a]" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#f0cf7e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/70 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1b553e]/50 flex items-center justify-between text-xs font-bold text-[#f0cf7e] group-hover:text-amber-200">
                  <span>Đọc bài viết</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
