import React from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      num: '01',
      highlight: 'Dược Tính',
      title: 'Hỗ Trợ Miễn Dịch Tự Nhiên',
      description: 'Giàu hợp chất chống oxy hóa tự nhiên (Polyphenol, Flavonoid) từ keo ong Cerumen, hỗ trợ nâng cao sức đề kháng cơ thể.',
      tag: 'Kháng khuẩn',
    },
    {
      num: '02',
      highlight: 'Vi Sinh',
      title: 'Hỗ Trợ Tiêu Hóa & Đường Ruột',
      description: 'Men vi sinh hữu cơ tự nhiên từ tổ ong hỗ trợ làm dịu niêm mạc, cải thiện chứng đầy hơi, ợ chua và khó tiêu.',
      tag: 'Men vi sinh',
    },
    {
      num: '03',
      highlight: 'Dinh Dưỡng',
      title: 'Chứa Đường Quý Trehalulose',
      description: 'Đường Trehalulose giải phóng năng lượng từ từ với chỉ số GI thấp, ít gây tăng vọt đường huyết so với đường thông thường.',
      tag: 'Chỉ số GI thấp',
    },
    {
      num: '04',
      highlight: 'Thanh Quản',
      title: 'Làm Dịu Cổ Họng & Giảm Ho',
      description: 'Vị chua ngọt thanh mát tự nhiên giúp làm dịu cảm giác ngứa rát họng, khản tiếng và ho do thay đổi thời tiết.',
      tag: 'Dịu êm thanh quản',
    },
    {
      num: '05',
      highlight: 'Phục Hồi',
      title: 'Bổ Sung Năng Lượng Tự Nhiên',
      description: 'Cung cấp enzyme tự nhiên và khoáng chất vi lượng, hỗ trợ bồi bổ thể lực cho người lớn tuổi, người vừa ốm dậy.',
      tag: 'Bồi bổ thể lực',
    },
    {
      num: '06',
      highlight: 'Làn Da',
      title: 'Chăm Sóc & Cấp Ẩm Sinh Học',
      description: 'Dùng thoa ngoài hỗ trợ làm dịu vết trầy xước, côn trùng cắn và cung cấp độ ẩm sinh học tự nhiên cho da mềm mịn.',
      tag: 'Cấp ẩm tự nhiên',
    },
  ];

  return (
    <section id="benefits" className="py-12 sm:py-16 md:py-20 bg-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background accents */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#d49a2a]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Giá Trị Sức Khỏe & Dược Tính Tự Nhiên</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif">
            6 Công Dụng Nổi Bật Của <span className="text-gold-gradient">Mật Ong Dú</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed font-normal max-w-2xl mx-auto">
            Sự kết tinh từ hoa rừng dại và quá trình ủ men tự nhiên trong tổ keo sáp mang đến nguồn dưỡng chất sinh học trân quý.
          </p>
        </div>

        {/* Grid Cards with Luxury Numbered Emblem Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.num}
              className="bg-[#0e2c20]/80 p-5 sm:p-6 rounded-2xl border border-[#206147]/50 hover:border-[#d49a2a]/50 hover:bg-[#123829]/95 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-lg hover:-translate-y-0.5"
            >
              <div className="space-y-3.5">
                {/* Header row: Numbered luxury emblem + category tag */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#1b553e]/40">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#d49a2a]/25 to-[#051710] border border-[#d49a2a]/40 text-amber-300 font-serif font-black text-xs shadow-inner group-hover:scale-105 transition-transform">
                      {benefit.num}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest font-mono">
                      {benefit.highlight}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-200/90 bg-[#081a12]/90 px-2.5 py-0.5 rounded-full border border-amber-600/35">
                    {benefit.tag}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#f0cf7e] transition-colors font-serif line-clamp-1 sm:line-clamp-none">
                  {benefit.title}
                </h3>
                <p className="text-xs text-emerald-100/70 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Medical Disclaimer Notice */}
        <div className="p-4 sm:p-5 bg-[#0e2c20]/80 rounded-2xl border border-[#d49a2a]/30 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-4xl mx-auto shadow-lg backdrop-blur-md text-xs text-emerald-100/80 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-bold shrink-0">
            <AlertTriangle className="w-4 h-4 text-[#d49a2a] shrink-0" />
            <span>Lưu ý:</span>
          </div>
          <p className="text-stone-300 text-[11px] sm:text-xs leading-normal">
            <strong>Không dùng cho trẻ dưới 1 tuổi</strong> (đề phòng nguy cơ ngộ độc <em>botulinum</em> do hệ tiêu hóa chưa hoàn thiện). Mật ong dú là thực phẩm hỗ trợ bồi bổ sức khỏe tự nhiên, không thay thế thuốc chữa bệnh.
          </p>
        </div>
      </div>
    </section>
  );
};
