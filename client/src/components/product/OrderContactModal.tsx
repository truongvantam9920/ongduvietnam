import React, { useState } from 'react';
import { Phone, Plus, Minus, CheckCircle, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { ZaloIcon } from '../ui/ZaloIcon.js';
import { CONTACT_INFO } from '../../constants/contact.js';
import { Modal } from '../ui/Modal.js';
import { formatVND } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.js';

interface OrderContactModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderContactModal: React.FC<OrderContactModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { success, error } = useToast();

  const { hotline, zaloNumber } = CONTACT_INFO;

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleZaloOrder = () => {
    window.open(`https://zalo.me/${zaloNumber}`, '_blank');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      error('Vui lòng nhập số điện thoại để nhân viên liên hệ tư vấn & xác nhận.');
      return;
    }

    setIsSuccess(true);
    success(`Đã tiếp nhận yêu cầu đặt mua '${product.name}' (SL: ${quantity}). Nhân viên sẽ gọi lại cho bạn sớm nhất!`);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đặt Mua & Tư Vấn Sản Phẩm" maxWidth="lg">
      {isSuccess ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">Tiếp Nhận Thành Công!</h3>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            Cảm ơn bạn đã tin tưởng Ong Dú Việt Nam. Chuyên viên chăm sóc khách hàng sẽ liên hệ với bạn qua SĐT <strong>{customerPhone}</strong> để xác nhận địa chỉ và thời gian giao hàng.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Product Summary Card */}
          <div className="flex items-center gap-4 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-amber-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-stone-900 font-serif truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-extrabold text-amber-700 font-serif">{formatVND(product.price)}</span>
                {product.volume && <span className="text-xs text-stone-500">• {product.volume}</span>}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-sm font-bold text-stone-700">Số lượng:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-stone-900 text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-stone-600">Tổng thanh toán dự kiến:</span>
            <span className="text-xl font-extrabold text-amber-700 font-serif">{formatVND(totalPrice)}</span>
          </div>

          {/* Consultation / Order Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Họ và tên của bạn:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Số điện thoại nhận hàng / tư vấn <span className="text-rose-500">*</span>:
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Địa chỉ giao hàng (Tùy chọn):
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ghi chú thêm:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm outline-hidden"
              />
            </div>

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Đặt Hàng (Gọi Lại Ngay)</span>
              </button>

              <button
                type="button"
                onClick={handleZaloOrder}
                className="w-full py-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm border border-sky-200 transition-colors flex items-center justify-center gap-2"
              >
                <ZaloIcon className="w-4 h-4 rounded-[4px]" />
                <span>Đặt Nhanh Qua Zalo ({zaloNumber})</span>
              </button>

              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hoặc gọi trực tiếp Hotline: {hotline}</span>
              </a>
            </div>
          </form>

          {/* Safe Purchase Guarantee */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Kiểm tra hàng trước khi nhận
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 100% Nguyên chất
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};
