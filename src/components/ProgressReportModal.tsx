import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle, 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userScore?: number;
  streakDays?: number;
  completedProblemsCount?: number;
  completedAxiomsCount?: number;
  language?: 'vi' | 'en';
}

export const ProgressReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userScore = 520,
  streakDays = 7,
  completedProblemsCount = 4,
  completedAxiomsCount = 5,
  language = 'vi'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-100">
                {language === 'vi' ? 'Báo Cáo Kết Quả Học Tập Định Kỳ' : 'Periodic Learning Progress Report'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'vi' ? 'Chuyên đề: Đường thẳng & Mặt phẳng trong không gian, Các tiên đề' : 'Solid Geometry Foundations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'vi' ? 'In / Lưu PDF' : 'Print / PDF'}</span>
            </button>

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
        </div>

        {/* Printable Report Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-200 bg-slate-900">
          {/* Certificate / Official Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-950 to-slate-900 border border-blue-800/40 text-center relative overflow-hidden shadow-lg">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">
              HỌC VIỆN HÌNH HỌC KHÔNG GIAN 3D • GEOSPACE
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mb-1 tracking-tight">
              BẢNG TỔNG KẾT TIẾN TRÌNH HỌC TẬP
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Chứng nhận kết quả rèn luyện năng lực trực quan không gian và phương pháp giải toán hình học 11
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-slate-300">
              <div><span className="text-slate-500">Học viên:</span> Nguyễn Văn Minh (11A1)</div>
              <div><span className="text-slate-500">Ngày xuất:</span> {currentDateStr}</div>
              <div><span className="text-slate-500">Mã hồ sơ:</span> GS-2026-X89</div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-blue-400 font-mono">{userScore}</div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Tổng điểm XP</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">{completedAxiomsCount}/5</div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Tiên đề thành thạo</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">{completedProblemsCount}/4</div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Bài toán 3D đã giải</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-purple-400 font-mono">🔥 {streakDays}</div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Chuỗi ngày học</div>
            </div>
          </div>

          {/* Detailed Skill Breakdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Đánh giá mức độ thành thạo kỹ năng tư duy không gian</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Hiểu và vận dụng 5 Tiên đề không gian</span>
                  <span className="font-mono text-emerald-400 font-bold">100% (Hoàn thành)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Kỹ năng tìm giao tuyến của hai mặt phẳng (Tiên đề 4)</span>
                  <span className="font-mono text-blue-400 font-bold">95% (Xuất sắc)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Kỹ năng tìm giao điểm đường thẳng và mặt phẳng</span>
                  <span className="font-mono text-amber-400 font-bold">85% (Tốt)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Kỹ thuật mở rộng mặt phẳng xác định thiết diện đa giác</span>
                  <span className="font-mono text-purple-400 font-bold">88% (Tốt)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Signature & QR Verification */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
                <QrCode className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-slate-200">Xác thực số học viên</div>
                <div className="text-[10px] text-slate-500">Quét mã QR để kiểm tra dữ liệu đối chiếu trên hệ thống</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-200">Ban Cố Vấn Chuyên Môn Toán</div>
              <div className="text-[10px] text-slate-500 italic mt-1">Đã ký điện tử & xác nhận đạt chuẩn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
