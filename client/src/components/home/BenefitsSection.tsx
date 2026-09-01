import React from 'react';
import { ShieldCheck, Heart, Apple, Sparkles, Sun, Activity, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      color: 'bg-[#14412f] border-[#276e50]/60 text-emerald-300',
      title: 'Hỗ Trợ Tăng Cường Miễn Dịch',
      description: 'Giàu hợp chất chống oxy hóa tự nhiên (Polyphenol, Flavonoid) và dưỡng chất từ keo ong Cerumen, hỗ trợ nâng cao hàng rào phòng vệ tự nhiên của cơ thể.',
      tag: 'Kháng khuẩn tự nhiên',
    },
    {
      icon: Heart,
      color: 'bg-[#3b171c] border-[#662832]/60 text-rose-300',
      title: 'Hỗ Trợ Tiêu Hóa & Đường Ruột',
      description: 'Nhờ các chủng men vi sinh lên men tự nhiên trong tổ, mật ong dú hỗ trợ làm dịu niêm mạc đường ruột, hỗ trợ cải thiện tình trạng đầy bụng, khó tiêu và táo bón.',
      tag: 'Men vi sinh hữu cơ',
    },
    {
      icon: Apple,
      color: 'bg-[#2a2211] border-[#5e481c]/60 text-[#f0cf7e]',
      title: 'Chứa Đường Quý Trehalulose',
      description: 'Trehalulose là loại đường giải phóng năng lượng từ từ, được giới khoa học đánh giá ít gây tăng vọt đường huyết đột ngột so với các loại đường tinh luyện.',
      tag: 'Chỉ số GI thấp',
    },
    {
      icon: Activity,
      color: 'bg-[#14412f] border-[#276e50]/60 text-emerald-300',
      title: 'Hỗ Trợ Dịu Họng & Giảm Ho',
      description: 'Vị chua thanh mát cùng hoạt tính kháng khuẩn nhẹ giúp làm dịu cảm giác đau rát vòm họng, khản tiếng và hỗ trợ các vấn đề hô hấp nhẹ theo mùa.',
      tag: 'Dịu êm thanh quản',
    },
    {
      icon: Sun,
      color: 'bg-[#2a2211] border-[#5e481c]/60 text-[#f0cf7e]',
      title: 'Năng Lượng Tự Nhiên Nhanh Chóng',
      description: 'Cung cấp năng lượng sạch, enzyme và khoáng chất vi lượng, phù hợp cho người mới ốm dậy, người cao tuổi, người lao động trí óc và vận động viên.',
      tag: 'Bồi bổ thể lực',
    },
    {
      icon: Sparkles,
      color: 'bg-[#241738] border-[#4b2d75]/60 text-purple-300',
      title: 'Kháng Viêm Nhẹ & Chăm Sóc Da',
      description: 'Dùng thoa ngoài hỗ trợ sát khuẩn, làm dịu vết côn trùng cắn, trầy xước nhẹ và cấp ẩm tự nhiên cho làn da mềm mịn.',
      tag: 'Dưỡng ẩm sinh học',
    },
  ];

  return (
    <section id="benefits" className="py-20 md:py-28 bg-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background accents */}
      <div className="absolute top-1/3 left-10 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-[#d49a2a]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Giá Trị Sức Khỏe & Dược Tính Tự Nhiên</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            6 Công Dụng Hỗ Trợ Nổi Bật Của <span className="text-gold-gradient">Mật Ong Dú</span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed font-normal">
            Sự kết tinh từ hoa rừng dại và quá trình ủ men trong tổ keo sáp mang đến nguồn dưỡng chất sinh học trân quý cho gia đình.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#0e2c20]/80 p-7 sm:p-8 rounded-3xl border border-[#206147]/50 hover:border-[#d49a2a]/40 hover:bg-[#123829]/90 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border ${benefit.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-200/80 bg-[#081a12]/80 px-2.5 py-1 rounded-lg border border-[#1b553e]/50">
                      {benefit.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#f0cf7e] transition-colors pt-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1b553e]/50 flex items-center gap-2 text-xs font-semibold text-[#f0cf7e]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Đa Hoa Rừng Tự Nhiên</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Medical Disclaimer Notice */}
        <div className="p-7 sm:p-8 bg-[#0e2c20]/90 rounded-3xl border border-[#d49a2a]/30 space-y-4 max-w-4xl mx-auto shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5 text-[#f0cf7e] font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-[#d49a2a] shrink-0" />
            <span>Lưu Ý Sử Dụng Quan Trọng</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed list-disc list-inside">
            <li>
              <strong>Không dùng cho trẻ em dưới 1 tuổi:</strong> Tuyệt đối không cho trẻ dưới 1 tuổi sử dụng bất kỳ loại mật ong nào để phòng tránh nguy cơ ngộ độc <em>botulinum</em> do hệ tiêu hóa của trẻ chưa hoàn thiện.
            </li>
            <li>
              <strong>Sản phẩm hỗ trợ sức khỏe:</strong> Các công dụng trên dựa trên kinh nghiệm dân gian và các nghiên cứu bước đầu, không thay thế thuốc điều trị bệnh.
            </li>
            <li>
              Người có bệnh lý nền (tiểu đường nặng, tiền sử dị ứng phấn hoa) nên tham khảo ý kiến bác sĩ hoặc chuyên gia y tế trước khi sử dụng thường xuyên.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
