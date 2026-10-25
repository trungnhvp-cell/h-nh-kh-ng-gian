import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  FileDown, 
  CheckCircle, 
  Clock, 
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface StudentData {
  id: string;
  name: string;
  class: string;
  axiomsMastered: number;
  solvedProblems: number;
  quizAccuracy: number;
  streakDays: number;
  status: 'Xuất sắc' | 'Đạt yêu cầu' | 'Cần trợ giúp';
  weakPoint: string;
}

const MOCK_STUDENTS: StudentData[] = [
  { id: 'st-1', name: 'Nguyễn Văn Minh', class: '11A1', axiomsMastered: 5, solvedProblems: 4, quizAccuracy: 92, streakDays: 14, status: 'Xuất sắc', weakPoint: 'Không có' },
  { id: 'st-2', name: 'Lê Thuỳ Trang', class: '11A1', axiomsMastered: 4, solvedProblems: 3, quizAccuracy: 84, streakDays: 8, status: 'Đạt yêu cầu', weakPoint: 'Tiên đề 4 (Giao tuyến hai mặt phẳng)' },
  { id: 'st-3', name: 'Trần Gia Huy', class: '11A1', axiomsMastered: 5, solvedProblems: 4, quizAccuracy: 95, streakDays: 11, status: 'Xuất sắc', weakPoint: 'Không có' },
  { id: 'st-4', name: 'Phạm Hoàng Nam', class: '11A1', axiomsMastered: 2, solvedProblems: 1, quizAccuracy: 58, streakDays: 2, status: 'Cần trợ giúp', weakPoint: 'Kéo dài cạnh tìm giao điểm đáy (Tiên đề 3)' },
  { id: 'st-5', name: 'Đỗ Hải Yến', class: '11A1', axiomsMastered: 4, solvedProblems: 3, quizAccuracy: 78, streakDays: 6, status: 'Đạt yêu cầu', weakPoint: 'Xác định thiết diện tứ giác' },
  { id: 'st-6', name: 'Vũ Quốc Bảo', class: '11A1', axiomsMastered: 3, solvedProblems: 2, quizAccuracy: 64, streakDays: 3, status: 'Cần trợ giúp', weakPoint: 'Phân biệt đường chéo nhau và cắt nhau' }
];

interface Props {
  onExportReport?: () => void;
  language?: 'vi' | 'en';
}

export const TeacherDashboard: React.FC<Props> = ({
  onExportReport,
  language = 'vi'
}) => {
  const [students, setStudents] = useState<StudentData[]>(MOCK_STUDENTS);
  const [filterClass, setFilterClass] = useState('11A1');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');

  const avgAccuracy = Math.round(students.reduce((acc, s) => acc + s.quizAccuracy, 0) / students.length);
  const totalMastered = students.filter(s => s.axiomsMastered === 5).length;
  const strugglingCount = students.filter(s => s.status === 'Cần trợ giúp').length;

  const handleAssignExercise = () => {
    if (!assignTitle.trim()) return;
    sound.playSuccess();
    setShowAssignModal(false);
    setAssignTitle('');
    alert(language === 'vi' ? 'Đã giao bài tập 3D thành công tới toàn bộ học sinh lớp ' + filterClass : 'Assigned successfully!');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-slate-950 overflow-y-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {language === 'vi' ? 'Cổng Dành Cho Giáo Viên & Quản Trị' : 'Educator & Teacher Dashboard'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100">
            {language === 'vi' ? 'Theo Dõi Tiến Trình Học Sinh: Hình Học Không Gian 11' : 'Student Progress Analytics: Solid Geometry 11'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAssignModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'vi' ? 'Giao bài tập mới' : 'Assign Exercise'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExportReport?.();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold shadow-md transition-all"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>{language === 'vi' ? 'Xuất báo cáo PDF/Excel' : 'Export Class Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Tổng số học sinh lớp</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {students.length} <span className="text-xs font-normal text-slate-400">học sinh</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            100% đã đăng nhập học trong 48h qua
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Độ chính xác trắc nghiệm TB</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Tăng +6.5% so với tuần trước
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Thành thạo cả 5 Tiên đề</span>
            <CheckCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {totalMastered} / {students.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {Math.round((totalMastered / students.length) * 100)}% sĩ số lớp đạt chuẩn
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Học sinh cần bồi dưỡng thêm</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {strugglingCount} <span className="text-xs font-normal text-slate-400">em</span>
          </div>
          <div className="text-[11px] text-rose-400 font-medium mt-1">
            Chủ yếu ở bài toán Tìm thiết diện mở rộng
          </div>
        </div>
      </div>

      {/* AI Pedagogical Insight Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-slate-900 border border-purple-500/30 mb-6 flex items-start gap-3 shadow-lg">
        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-1">
            Khuyến nghị Sư phạm từ Trí tuệ Nhân tạo (GeoSpace AI Assistant)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống phân tích cho thấy <span className="text-amber-300 font-semibold">42% học sinh</span> trong lớp gặp khó khăn khi liên hệ giữa <span className="text-blue-300 font-semibold">Tiên đề 3</span> và việc kéo dài hai cạnh đồng phẳng để tìm điểm chung thứ hai. Thầy/Cô nên dành 10 phút đầu tiết để minh họa trực quan 3D mô hình <span className="font-semibold text-emerald-300">Bài toán 1 (Hình chóp S.ABCD đáy hình thang)</span> trên máy chiếu.
          </p>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Danh sách học sinh lớp {filterClass}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Cập nhật đồng bộ thời gian thực
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Tiên đề hoàn thành</th>
                <th className="py-3 px-4">Bài toán 3D đã giải</th>
                <th className="py-3 px-4">Độ chính xác</th>
                <th className="py-3 px-4">Chuỗi học tập</th>
                <th className="py-3 px-4">Điểm cần chú ý</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{st.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{st.class}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-blue-400 font-bold">{st.axiomsMastered}</span> / 5
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-emerald-400 font-bold">{st.solvedProblems}</span> / 4
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span>{st.quizAccuracy}%</span>
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full ${st.quizAccuracy >= 80 ? 'bg-emerald-500' : st.quizAccuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${st.quizAccuracy}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">
                    🔥 {st.streakDays} ngày
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {st.weakPoint}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.status === 'Xuất sắc' ? 'bg-emerald-500/20 text-emerald-300' :
                      st.status === 'Đạt yêu cầu' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Giao bài tập hình học không gian mới
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Bài tập sẽ được gửi thông báo ngay tới toàn bộ học sinh lớp {filterClass}.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tiêu đề bài tập 3D:
                </label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="Ví dụ: Tìm thiết diện tứ diện ABCD cắt bởi mặt phẳng (MNP)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Hạn nộp bài:
                </label>
                <input
                  type="date"
                  defaultValue="2026-10-30"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAssignExercise}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
              >
                Xác nhận giao bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
