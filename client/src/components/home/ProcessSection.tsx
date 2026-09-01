import React from 'react';
import { Sparkles, Flower2, Shield, Filter, PackageCheck, MapPin, TreePine } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Flower2,
      title: 'Nuôi Dưới Tán Rừng Dược Liệu',
      desc: 'Đàn ong Tetragonula tự tìm mật hoa dại tự nhiên quanh bán kính tổ, hoàn toàn không cho ăn đường hay dùng kháng sinh công nghiệp.',
    },
    {
      number: '02',
      icon: Shield,
      title: 'Khai Thác Hút Mật Vô Trùng',
      desc: 'Sử dụng hệ thống hút mật chân không vi sinh khép kín, rút mật từ các túi Cerumen mà không làm vỡ ấu trùng, bảo tồn đàn ong bền vững.',
    },
    {
      number: '03',
      icon: Filter,
      title: 'Lọc Lạnh Giữ Nguyên Men Sống',
      desc: 'Quy trình lọc lạnh giữ lại tối đa các hạt phấn hoa vi mô, keo ong quý giá và toàn bộ enzym sống tự nhiên, tuyệt đối không đun nhiệt cô đặc.',
    },
    {
      number: '04',
      icon: PackageCheck,
      title: 'Đóng Chai Thủy Tinh Cao Cấp',
      desc: 'Đóng chai thủy tinh sẫm màu chống quang hóa, niêm phong nắp kín chống thoát khí lên men, dán tem truy xuất nguồn gốc rõ ràng.',
    },
  ];

  const regionalModels = [
    {
      location: 'Khánh Hòa (Suối Cát, Cam Lâm)',
      stats: 'Gần 3.000 tổ ong dú sinh thái',
      desc: 'Trang trại quy mô lớn kết hợp chuyển giao kỹ thuật nuôi và tạo sinh kế bền vững cho các hộ đồng bào dân tộc thiểu số địa phương.',
    },
    {
      location: 'Bình Phước (TP. Đồng Xoài)',
      stats: 'Mô hình "Mang ong về phố"',
      desc: 'Nuôi ong dú tại các nhà vườn đô thị và trang trại hữu cơ, thu hoạch mật sạch trung bình ~500ml/thùng/năm.',
    },
    {
      location: 'Phú Yên & Bình Định',
      stats: 'Nông nghiệp xanh & Du lịch trải nghiệm',
      desc: 'Nhân rộng đàn ong dú gắn với du lịch sinh thái rừng và bảo tồn đa dạng sinh học các loài thực vật bản địa.',
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 bg-stone-950 text-stone-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            Nông Nghiệp Xanh & Khai Thác Sinh Thái
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
            Quy Trình Khai Thác <span className="text-gold-gradient">Nhân Đạo & Bền Vững</span>
          </h2>
          <p className="text-base sm:text-lg text-stone-400 leading-relaxed">
            Chúng tôi bảo tồn đàn ong dú và hệ sinh thái rừng tự nhiên, cam kết mang đến những giọt mật thuần khiết nhất đến tay người tiêu dùng.
          </p>
        </div>

        {/* 4 Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-stone-900/80 p-6 sm:p-7 rounded-3xl border border-emerald-900/40 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-serif text-emerald-500/40 group-hover:text-amber-400 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-600/50 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 font-serif group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regional Ecology Models Showcase */}
        <div className="p-8 bg-gradient-to-br from-stone-900 to-[#123b2a] rounded-3xl border border-emerald-900/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Các Mô Hình Nuôi Ong Dú Thực Tế Tại Việt Nam
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Phát triển kinh tế xanh & Bảo tồn bản địa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionalModels.map((item, idx) => (
              <div key={idx} className="p-5 bg-stone-950/70 rounded-2xl border border-stone-800/80 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm font-serif">{item.location}</h4>
                <div className="text-xs font-semibold text-emerald-300">{item.stats}</div>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
