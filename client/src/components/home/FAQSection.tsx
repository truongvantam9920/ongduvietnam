import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Plus, Minus } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Ong dú là con gì, khác ong mật thường ở đâu?',
      a: 'Ong dú (nhóm Meliponini, chi Tetragonula) là loài ong bản địa nhiệt đới cỡ nhỏ 2–8mm, hoàn toàn không có ngòi đốt nên không chích người. Chúng làm tổ bằng các túi sáp kết hợp keo nhựa cây (Cerumen) thay vì bánh sáp lục giác thông thường, tạo nên dòng mật đa hoa lên men tự nhiên có tính chất và dược tính vượt trội.',
    },
    {
      q: 'Vì sao mật ong dú có vị chua? Có phải bị hỏng không?',
      a: 'Không phải. Vị chua thanh nhẹ là đặc trưng tự nhiên độc bản của mật ong dú, sinh ra từ quá trình lên men sinh học tự nhiên với hàng chục chủng men vi sinh có lợi trong các hũ keo Cerumen. Mật đạt chuẩn có vị ngọt thanh xen chua dịu mát; chỉ khi mật chua gắt, sủi bọt khí mạnh bất thường hoặc có mùi rượu nồng mới là bảo quản sai cách.',
    },
    {
      q: 'Vì sao mật ong dú đắt hơn mật ong thường nhiều?',
      a: 'Vì sản lượng cực kỳ khan hiếm. Đàn ong dú nhỏ, mỗi tổ sau cả năm chỉ cho từ 0,3 đến 0,8 lít mật (so với 15–30+ lít ở ong mật nuôi thông thường). Quá trình thu hoạch cũng phải hút thủ công vô trùng từng túi keo sáp mà không thể vắt ly tâm công nghiệp hàng loạt.',
    },
    {
      q: 'Đường Trehalulose trong mật ong dú có tác dụng gì?',
      a: 'Trehalulose là loại đường tự nhiên quý hiếm được giới khoa học quốc tế quan tâm vì có tốc độ giải phóng chậm, ít gây tăng vọt đường huyết đột ngột so với đường tinh luyện hoặc glucose thông thường, rất an toàn và bồi bổ tốt cho sức khỏe.',
    },
    {
      q: 'Làm sao biết mật tôi mua là mật ong dú thật?',
      a: 'Mật ong dú thật có màu vàng nâu tự nhiên ánh trong, kết cấu hơi lỏng sánh đặc trưng, mùi thơm dịu mát của hoa rừng dại và vị ngọt thanh hậu chua dịu. Mỗi chai mật của Ong Dú Việt Nam đều có tem niêm phong và chứng nhận kiểm định chất lượng minh bạch.',
    },
    {
      q: 'Bảo quản mật ong dú thế nào cho đúng?',
      a: 'Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Do tính chất giữ nguyên vẹn hệ men sống và hàm lượng nước tự nhiên, nên đậy kín nắp sau khi dùng và có thể để ngăn mát tủ lạnh trong mùa nắng nóng. Tuyệt đối không đun nấu mật ở nhiệt độ cao vì sẽ phá hủy các enzyme sống quý giá.',
    },
    {
      q: 'Trẻ em và người cao tuổi có dùng được không?',
      a: 'Mật ong dú rất tốt cho người cao tuổi, người mới ốm dậy và người lớn cần bồi bổ. Lưu ý quan trọng: Tuyệt đối không dùng cho trẻ em dưới 1 tuổi (phòng ngừa nguy cơ botulinum do hệ tiêu hóa trẻ chưa hoàn thiện).',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#123b2a] via-[#0e2c20] to-[#091f17] text-stone-200 relative overflow-hidden border-t border-[#1d523c]/40">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#113829]/90 border border-[#23684c]/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-[#d49a2a]" />
            <span>Giải Đáp Thắc Mắc</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Câu Hỏi <span className="text-gold-gradient">Thường Gặp</span>
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/70 leading-relaxed max-w-2xl mx-auto font-normal">
            Tổng hợp những câu hỏi phổ biến nhất của khách hàng về đặc tính, hương vị và cách sử dụng mật ong dú chuẩn xác.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
                  isOpen
                    ? 'bg-[#0e2c20]/95 border-[#d49a2a]/50 shadow-2xl shadow-[#040e0a]/80'
                    : 'bg-[#0e2c20]/60 border-[#1f5e43]/50 hover:border-emerald-600/50 hover:bg-[#123829]/70'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  <span className={isOpen ? 'text-[#f0cf7e] font-bold' : 'text-white'}>
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#d49a2a] text-[#0c1a13] rotate-180 shadow-md shadow-[#d49a2a]/20' : 'bg-[#143e2e] text-emerald-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-emerald-100/80 leading-relaxed border-t border-[#1b553e]/60 animate-in fade-in duration-200 font-normal">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
