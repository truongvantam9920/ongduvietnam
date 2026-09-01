import React from 'react';
import { Award, ShieldCheck, CheckCircle2, TreePine } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const certs = [
    {
      title: 'Hội Nông Dân Tỉnh Khánh Hòa',
      sub: 'Đối tác phát triển mô hình kinh tế nông thôn',
      icon: TreePine,
    },
    {
      title: 'Chứng Nhận An Toàn Thực Phẩm',
      sub: 'Quy trình khai thác vô trùng khép kín',
      icon: ShieldCheck,
    },
    {
      title: 'HTX Nông Nghiệp Sinh Thái',
      sub: 'Chuỗi cung ứng mật ong rừng bền vững',
      icon: CheckCircle2,
    },
    {
      title: 'Kiểm Định Chất Lượng HMF & Đường',
      sub: 'Đạt tiêu chuẩn mật ong tự nhiên cao cấp',
      icon: Award,
    },
  ];

  return (
    <section className="py-16 bg-[#123b2a] text-stone-300 border-t border-emerald-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">
            Được Kiểm Chứng & Đồng Hành
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Chứng Nhận & Đối Tác Sinh Thái
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {certs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-stone-900/60 rounded-2xl border border-emerald-900/30 text-center space-y-2 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/40 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white font-serif">{c.title}</h4>
                <p className="text-[11px] text-stone-400 leading-snug">{c.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
