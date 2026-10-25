import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  Calendar, 
  Mail, 
  Sparkles, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'reminder' | 'teacher' | 'ai';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language?: 'vi' | 'en';
}

export const NotificationDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  language = 'vi'
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Nhắc nhở chuỗi học tập hàng ngày 🔥',
      desc: 'Đừng quên hoàn thành 1 bài toán 3D hôm nay để duy trì chuỗi 8 ngày liên tiếp nhé!',
      time: '30 phút trước',
      unread: true,
      type: 'reminder'
    },
    {
      id: 'notif-2',
      title: 'Bài tập mới từ Thầy Trần Quang Vinh 👨‍🏫',
      desc: 'Lớp 11A1 vừa nhận bài tập 3D: "Tìm thiết diện tứ diện ABCD cắt bởi mặt phẳng (MNP)". Hạn nộp: 30/10.',
      time: '2 giờ trước',
      unread: true,
      type: 'teacher'
    },
    {
      id: 'notif-3',
      title: 'Gợi ý cá nhân hóa từ AI GeoSpace 🤖',
      desc: 'Thầy AI nhận thấy bạn vừa đạt điểm tối đa ở Tiên đề 2! Hãy thử sức tiếp với Tiên đề 4 (Giao tuyến 2 mặt phẳng).',
      time: 'Hôm qua',
      unread: false,
      type: 'ai'
    }
  ]);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    sound.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    sound.playClick();
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'vi' ? 'Thông Báo & Nhắc Nhở Học Tập' : 'Notifications & Reminders'}
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={handleMarkAllRead}
            className="hover:text-blue-400 font-medium"
          >
            Đánh dấu đã đọc
          </button>
          <button
            onClick={handleClearAll}
            className="hover:text-rose-400 font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Không có thông báo mới nào
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  n.unread
                    ? 'bg-slate-950/90 border-blue-500/50 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                  <span>{n.title}</span>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">
                  {n.desc}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  {n.time}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Settings Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Gửi thông báo qua Email</span>
            </span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="accent-blue-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Giờ nhắc học bài mỗi ngày:</span>
            </span>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
