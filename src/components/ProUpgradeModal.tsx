import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  X, 
  Zap,
  Lock
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpgrade?: () => void;
  isPro?: boolean;
  language?: 'vi' | 'en';
}

export const ProUpgradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessUpgrade,
  isPro = false,
  language = 'vi'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'vnpay' | 'card'>('vietqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    sound.playClick();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      sound.playSuccess();
      onSuccessUpgrade?.();
    }, 1500);
  };

  const proPerks = language === 'vi' ? [
    'Mở khóa toàn bộ 3D Sandbox & Công cụ vẽ hình tự do',
    'Trợ giảng AI Gemini 3.8 Flash giải bài không giới hạn',
    'Tải trước tài liệu & mô hình 3D học ngoại tuyến 100%',
    'Xuất hình vẽ 3D độ phân giải 4K dùng cho bài thuyết trình',
    'Hỗ trợ giáo viên phân tích lỗi sai chi tiết của từng học sinh'
  ] : [
    'Unlock full 3D Sandbox & Custom Geometry Builder',
    'Unlimited AI Geometry Tutoring with Gemini 3.8 Flash',
    'Full offline document & 3D asset caching',
    '4K diagram export for assignments & presentations',
    'Teacher detailed error diagnosis tools'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-100 flex items-center gap-1.5">
                <span>{language === 'vi' ? 'Nâng Cấp GeoSpace Pro 3D' : 'Upgrade to GeoSpace Pro 3D'}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">PRO</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'vi' ? 'Thành thạo trọn vẹn Hình học Không gian với trợ lý AI 3D' : 'Master solid geometry with advanced 3D AI tools'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Price Tag */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Gói Học Tập Trọn Đời</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                199.000 <span className="text-xs font-normal text-slate-400">VND / vĩnh viễn</span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Tiết kiệm 65%
            </div>
          </div>

          {/* Perks list */}
          <div className="space-y-2">
            {proPerks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Chọn phương thức thanh toán an toàn:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('vietqr')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'vietqr'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>VietQR (Ngân hàng)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('momo')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'momo'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>Ví điện tử MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('vnpay')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'vnpay'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Cổng VNPAY-QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>Thẻ Quốc Tế / Visa</span>
              </button>
            </div>
          </div>

          {/* Secure badge note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mã hóa bảo mật 256-bit SSL • Hoàn tiền trong 7 ngày</span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing || isDone}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang xử lý kết nối...</span>
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã kích hoạt PRO!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Kích hoạt Gói Pro Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
