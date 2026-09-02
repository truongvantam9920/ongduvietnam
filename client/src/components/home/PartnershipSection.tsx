import React, { useState, useEffect } from 'react';
import {
  Handshake, ShieldCheck, TrendingUp, Sparkles, CheckCircle2,
  ArrowRight, PhoneCall, ExternalLink, HelpCircle, FileText,
  MapPin, Check, Clock, ChevronRight
} from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { Modal } from '../ui/Modal.js';
import { api } from '../../services/api.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import type { PartnershipProgram } from '../../types/index.js';

interface PartnershipSectionProps {
  onNavigate?: (route: any) => void;
}

export const PartnershipSection: React.FC<PartnershipSectionProps> = () => {
  const [partnerships, setPartnerships] = useState<PartnershipProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<PartnershipProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { hotline, zaloNumber } = CONTACT_INFO;

  useEffect(() => {
    let isMounted = true;
    const loadPrograms = async () => {
      try {
        const res = await api.getPartnerships();
        if (res.success && isMounted) {
          setPartnerships(res.data || []);
        }
      } catch {
        // Fallback silently
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadPrograms();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="partnership" className="py-20 sm:py-28 bg-[#06150f] relative overflow-hidden border-t border-[#1a4a37]/60 text-stone-100">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d49a2a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#18533c]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#092218]/90 border border-[#d49a2a]/60 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-xl">
            <Handshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Mô hình kinh tế nông nghiệp sinh thái bền vững • Ong Dú Việt Nam</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase font-serif drop-shadow-lg">
            Hợp Tác Liên Kết Phát Triển Mở Rộng Trại Nuôi Ong Dú Toàn Quốc <span className="text-gold-gradient whitespace-nowrap block sm:inline">Cùng Ong Dú Việt Nam</span>
          </h2>

          {/* Showcase Farm Banner Image */}
          <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden border border-[#d49a2a]/40 shadow-2xl shadow-black/60 group mt-4">
            <img
              src="/images/farm-banner.jpg"
              alt="Mô hình trang trại nuôi ong dú sinh thái Ong Dú Việt Nam"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Ambient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040f0a]/90 via-transparent to-black/20" />

            {/* Bottom floating badge on image */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#092218]/90 backdrop-blur-md border border-[#24674d]/80 text-left">
              <div>
                <span className="text-xs sm:text-sm font-bold text-white font-serif block">
                  Trang Trại Nuôi Ong Dú Sinh Thái Bản Địa • Khánh Hòa, Việt Nam
                </span>
                <span className="text-[11px] text-emerald-300">
                  Hệ thống thùng nuôi thông minh dưới tán rừng & vườn cây ăn trái đa tầng sinh thái
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-600/60 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tiêu Chuẩn Nông Nghiệp Hữu Cơ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Published Partnership Programs / Articles */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#235e46]/80 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Chương Trình & Chính Sách
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">
                Các Gói Hợp Tác Trọng Điểm Đang Triển Khai
              </h3>
            </div>
            <span className="text-xs text-emerald-300 font-medium">
              Cập nhật trực tiếp từ Ban Điều Hành Ong Dú Việt Nam
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-stone-400 flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500"></div>
              <span>Đang tải thông tin hợp tác...</span>
            </div>
          ) : partnerships.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {partnerships.map((prog) => (
                <div
                  key={prog.id}
                  className="rounded-3xl bg-[#092218]/95 border border-[#215d45] hover:border-[#d49a2a]/70 overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="md:w-5/12 relative aspect-4/3 md:aspect-auto overflow-hidden bg-black/40 shrink-0">
                    <img
                      src={prog.image_url || '/images/product-hive-box.jpg'}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#092218] via-transparent to-transparent md:hidden" />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-7 md:w-7/12 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {prog.subtitle && (
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                          {prog.subtitle}
                        </span>
                      )}

                      <h4 className="text-lg font-bold text-white font-serif leading-snug group-hover:text-amber-300 transition-colors">
                        {prog.title}
                      </h4>

                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                        {prog.summary}
                      </p>

                      {/* Benefits preview */}
                      {prog.benefits && prog.benefits.length > 0 && (
                        <ul className="space-y-1.5 pt-1">
                          {prog.benefits.slice(0, 2).map((b, bIdx) => (
                            <li key={bIdx} className="text-[11px] text-emerald-300 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#1a4a37] flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setSelectedProgram(prog)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#14412f] hover:bg-[#1b553e] text-amber-200 hover:text-white text-xs font-bold border border-[#2b7254] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Chi tiết chương trình</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <a
                        href={`https://zalo.me/${prog.contact_zalo || zaloNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d49a2a] to-[#c6891e] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <ZaloIcon className="w-3.5 h-3.5 rounded-[2px]" />
                        <span>Đăng Ký Ngay</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#092218]/60 border border-[#1b4b38] text-center text-stone-400 text-sm">
              Hiện tại các chương trình liên kết đang được cập nhật. Vui lòng liên hệ Hotline/Zalo để nhận hồ sơ hợp tác.
            </div>
          )}
        </div>

        {/* Bottom Contact Callout Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0d2d20] via-[#092218] to-[#0d2d20] border border-[#286f51] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white font-serif">
              Bạn Có Trang Trại / Vườn Cây & Muốn Nuôi Ong Dú Lấy Mật?
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Hãy liên hệ trực tiếp với chuyên gia Ong Dú Việt Nam để được khảo sát vị trí đặt tổ, tư vấn nguồn hoa tự nhiên và nhận chính sách hỗ trợ con giống tốt nhất.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href={`https://zalo.me/${zaloNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#0068FF] hover:bg-[#0058e0] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ZaloIcon className="w-4 h-4 rounded-[4px]" />
              <span>Trao Đổi Qua Zalo</span>
            </a>

            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-xs sm:text-sm shadow-xl shadow-[#c6891e]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#0c1a13]" />
              <span>Hotline: {hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Program */}
      {selectedProgram && (
        <Modal
          isOpen={Boolean(selectedProgram)}
          onClose={() => setSelectedProgram(null)}
          title={selectedProgram.title}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-stone-800 text-sm">
            {/* Header Image */}
            {selectedProgram.image_url && (
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
                <img
                  src={selectedProgram.image_url}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Subtitle / Program Info */}
            {selectedProgram.subtitle && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-semibold text-xs">
                {selectedProgram.subtitle}
              </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 leading-relaxed text-xs sm:text-sm">
              <strong>Tóm tắt:</strong> {selectedProgram.summary}
            </div>

            {/* Benefits List */}
            {selectedProgram.benefits && selectedProgram.benefits.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quyền Lợi & Cam Kết Đồng Hành</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProgram.benefits.map((b, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Content */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Nội Dung Chi Tiết Chương Trình</span>
              </h4>
              <div className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-stone-200">
                {selectedProgram.content}
              </div>
            </div>

            {/* Requirements if any */}
            {selectedProgram.requirements && (
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-sky-950 text-xs leading-relaxed">
                <strong>Yêu cầu điều kiện liên kết:</strong> {selectedProgram.requirements}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                Liên hệ hợp tác: <strong>{selectedProgram.contact_phone || hotline}</strong>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={`https://zalo.me/${selectedProgram.contact_zalo || zaloNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-[#0068FF] hover:bg-[#0058e0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ZaloIcon className="w-4 h-4 rounded-[3px]" />
                  <span>Nhắn Zalo Đăng Ký</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
