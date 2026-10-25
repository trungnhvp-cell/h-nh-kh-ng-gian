import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  X, 
  Sparkles, 
  Award,
  Crown,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface LeaderboardUser {
  rank: number;
  name: string;
  school: string;
  score: number;
  streak: number;
  badges: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userScore?: number;
  userStreak?: number;
  language?: 'vi' | 'en';
}

export const LeaderboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userScore = 480,
  userStreak = 5,
  language = 'vi'
}) => {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const [boardData, setBoardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard) {
          setBoardData(data.leaderboard);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-100 flex items-center gap-1.5">
                <span>{language === 'vi' ? 'Bảng Xếp Hạng Cao Thủ Không Gian' : 'Geometry Master Leaderboard'}</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'vi' ? 'Vinh danh những học viên có chuỗi học tập & điểm số xuất sắc' : 'Honoring top solid geometry learners'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setTab('weekly');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'weekly'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'vi' ? 'Tuần này' : 'This Week'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab('alltime');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'alltime'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'vi' ? 'Toàn quốc' : 'All Time'}
          </button>
        </div>

        {/* User Rank Card */}
        <div className="p-3.5 mx-4 mt-3 bg-blue-950/30 border border-blue-800/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
              #8
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">
                Bạn (Học viên GeoSpace)
              </div>
              <div className="text-[10px] text-blue-300">
                🔥 Chuỗi {userStreak} ngày học liên tiếp
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-extrabold text-blue-400 font-mono">
              {userScore} XP
            </div>
            <div className="text-[10px] text-slate-400">Hạng Bạc</div>
          </div>
        </div>

        {/* Top Learners List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {boardData.map((u, idx) => {
            const isTop1 = u.rank === 1;
            const isTop2 = u.rank === 2;
            const isTop3 = u.rank === 3;

            return (
              <div
                key={u.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isTop1 
                    ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/60 shadow-lg' 
                    : isTop2
                      ? 'bg-slate-900 border-slate-700 shadow-md'
                      : isTop3
                        ? 'bg-slate-900 border-amber-900/40'
                        : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isTop1 ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md' :
                    isTop2 ? 'bg-slate-300 text-slate-950 font-extrabold' :
                    isTop3 ? 'bg-amber-700 text-white font-extrabold' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${u.rank}`}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {isTop1 && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400">{u.school}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-amber-400">
                    {u.score} pts
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    🔥 {u.streak} ngày
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
