import React from 'react';
import { ShieldCheck, Heart, Apple, Sparkles, Sun, Activity, AlertTriangle } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      color: 'bg-[#14412f] border-[#276e50]/60 text-emerald-300',
      title: 'Hỗ Trợ Miễn Dịch Tự Nhiên',
      description: 'Giàu hợp chất chống oxy hóa (Polyphenol, Flavonoid) từ keo ong Cerumen, hỗ trợ nâng cao sức đề kháng cơ thể.',
      tag: 'Kháng khuẩn',
    },
    {
      icon: Heart,
      color: 'bg-[#3b171c] border-[#662832]/60 text-rose-300',
      title: 'Hỗ Trợ Tiêu Hóa & Đường Ruột',
      description: 'Men vi sinh hữu cơ tự nhiên hỗ trợ làm dịu niêm mạc, cải thiện chứng đầy hơi và khó tiêu.',
      tag: 'Men vi sinh',
    },
    {
      icon: Apple,
      color: 'bg-[#2a2211] border-[#5e481c]/60 text-[#f0cf7e]',
      title: 'Chứa Đường Quý Trehalulose',
      description: 'Trehalulose giải phóng năng lượng từ từ, chỉ số GI thấp, ít gây tăng vọt đường huyết so với đường tinh luyện.',
      tag: 'Chỉ số GI thấp',
    },
    {
      icon: Activity,
      color: 'bg-[#14412f] border-[#276e50]/60 text-emerald-300',
      title: 'Làm Dịu Cổ Họng & Giảm Ho',
      description: 'Vị chua ngọt thanh mát tự nhiên giúp làm dịu cảm giác ngứa rát họng, khản tiếng và ho do thay đổi thời tiết.',
      tag: 'Dịu thanh quản',
    },
    {
      icon: Sun,
      color: 'bg-[#2a2211] border-[#5e481c]/60 text-[#f0cf7e]',
      title: 'Bổ Sung Năng Lượng Sạch',
      description: 'Bổ sung enzyme và khoáng chất vi lượng, giúp phục hồi thể lực cho người lớn tuổi, người mệt mỏi.',
      tag: 'Bồi bổ thể lực',
    },
    {
      icon: Sparkles,
      color: 'bg-[#241738] border-[#4b2d75]/60 text-purple-300',
      title: 'Chăm Sóc & Dưỡng Ẩm Da',
      description: 'Dùng bôi ngoài da hỗ trợ làm dịu vết trầy xước, côn trùng cắn và cấp ẩm sinh học tự nhiên.',
      tag: 'Dưỡng ẩm tự nhiên',
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

        {/* Grid Cards (Compact) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#0e2c20]/80 p-5 sm:p-6 rounded-2xl border border-[#206147]/50 hover:border-[#d49a2a]/40 hover:bg-[#123829]/90 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-lg hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border ${benefit.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-200/90 bg-[#081a12]/80 px-2.5 py-0.5 rounded-md border border-[#1b553e]/50">
                      {benefit.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#f0cf7e] transition-colors font-serif pt-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-emerald-100/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
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
