import React from 'react';
import { Sparkles, Check, X, Info, Zap } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonRows = [
    {
      criterion: 'Loài ong tạo mật',
      ongDu: 'Ong dú (Meliponini) — 100% không ngòi đốt, kích thước 2–8mm',
      ongMat: 'Ong mật thông thường (ong nội, ong ngoại) — có ngòi đốt',
      highlight: false,
    },
    {
      criterion: 'Sản lượng / tổ / năm',
      ongDu: 'Rất ít (chỉ 0,3 – 0,8 lít/năm), thu hoạch 1–2 lần',
      ongMat: 'Nhiều hơn đáng kể (15 – 30+ lít/năm/thùng)',
      highlight: true,
    },
    {
      criterion: 'Hương vị đặc trưng',
      ongDu: 'Vị ngọt thanh xen lẫn vị chua nhẹ tự nhiên, thơm hoa cỏ',
      ongMat: 'Vị ngọt đậm, ngọt sắc hoặc khé cổ',
      highlight: true,
    },
    {
      criterion: 'Độ đặc / Kết cấu',
      ongDu: 'Lỏng sánh tự nhiên (do tổ kín ít thông hơi nước)',
      ongMat: 'Đặc sánh hơn, độ ẩm thường thấp hơn',
      highlight: false,
    },
    {
      criterion: 'Nguồn hoa lấy mật',
      ongDu: 'Mật đa hoa (hút từ nhiều loài hoa dại li ti, cây dược liệu rừng)',
      ongMat: 'Thường là mật đơn hoa (hoa nhãn, hoa cà phê, hoa tràm...)',
      highlight: false,
    },
    {
      criterion: 'Thành phần nổi bật',
      ongDu: 'Giàu Trehalulose, enzyme sống, polyphenol & keo Cerumen',
      ongMat: 'Chủ yếu là đường khử Glucose và Fructose thông thường',
      highlight: true,
    },
    {
      criterion: 'Giá trị thị trường',
      ongDu: 'Phân khúc đặc sản quý hiếm (từ 1,5 – 2,5+ triệu đồng/lít)',
      ongMat: 'Phổ biến, mức giá bình dân hơn',
      highlight: false,
    },
  ];

  return (
    <section id="comparison" className="py-20 md:py-28 bg-gradient-to-b from-[#123b2a] via-[#0e2c20] to-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[30rem] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-[#f0cf7e] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Phân Biệt Khoa Học & Giá Trị</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Mật Ong Dú Khác Gì Mật Ong Thông Thường?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed font-normal">
            Tại sao mật ong dú (ở Úc còn gọi là <em>"sugar bag honey"</em>) lại được các chuyên gia dinh dưỡng và giới sành mật săn đón đặc biệt?
          </p>
        </div>

        {/* Modern Comparison Table */}
        <div className="bg-[#0e2c20]/80 backdrop-blur-2xl rounded-3xl border border-[#206147]/60 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[580px]">
              <thead>
                <tr className="border-b border-[#1b553e]/60 bg-[#071911]/90">
                  <th className="py-5 px-6 font-bold text-emerald-200/70 uppercase text-xs w-1/4">
                    Tiêu Chí So Sánh
                  </th>
                  <th className="py-5 px-6 font-bold text-[#f0cf7e] text-base w-3/8 bg-[#113d2b]/80 border-x border-[#206147]/50">
                    <div className="flex items-center gap-2">
                      <span>🐝</span>
                      <span className="font-extrabold">Mật Ong Dú Bản Địa</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#d49a2a] text-[#0c1a13] font-bold ml-1">Đặc sản quý</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 font-bold text-stone-300 text-base w-3/8">
                    Mật Ong Nuôi Thông Thường
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b553e]/40">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-[#123829]/50 transition-colors ${
                      row.highlight ? 'bg-[#d49a2a]/5' : ''
                    }`}
                  >
                    <td className="py-4.5 px-6 font-bold text-stone-200 text-xs sm:text-sm">
                      {row.criterion}
                    </td>
                    <td className="py-4.5 px-6 font-medium text-emerald-100 bg-[#113d2b]/40 border-x border-[#206147]/40 text-xs sm:text-sm">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{row.ongDu}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-emerald-100/60 text-xs sm:text-sm leading-relaxed">
                      {row.ongMat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-[#071911]/95 border-t border-[#1b553e]/60 flex items-center gap-3 text-xs text-emerald-100/70 backdrop-blur-md">
            <Info className="w-4 h-4 text-[#d49a2a] shrink-0" />
            <span className="leading-relaxed">
              Mật ong dú là nguồn mật đa hoa tự nhiên lên men trong tổ keo Cerumen, mang lại hương vị chua thanh dịu mát không trùng lặp với bất kỳ loại mật nào khác.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
