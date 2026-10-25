/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AXIOMS_DATA, 
  SOLVED_PROBLEMS_DATA, 
  QUIZ_QUESTIONS_DATA 
} from './data/curriculumData';
import { SolvedProblem } from './types/geometry';
import { AxiomExplorer } from './components/AxiomExplorer';
import { StepByStepSolver } from './components/StepByStepSolver';
import { QuizSection } from './components/QuizSection';
import { SpaceHunterGame } from './components/SpaceHunterGame';
import { SandboxStudio } from './components/SandboxStudio';
import { DiscussionRoom } from './components/DiscussionRoom';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AiTutorModal } from './components/AiTutorModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProgressReportModal } from './components/ProgressReportModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Gamepad2, 
  Box, 
  MessageSquare, 
  GraduationCap, 
  Bot, 
  Trophy, 
  FileText, 
  Bell, 
  Sparkles, 
  Globe, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { sound } from './utils/soundEffects';

type NavTab = 'axioms' | 'solver' | 'quiz' | 'game' | 'sandbox' | 'discussion' | 'teacher';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('axioms');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Stats & Progress with LocalStorage Persistence
  const [userScore, setUserScore] = useState<number>(() => {
    const saved = localStorage.getItem('geospace_user_score');
    return saved ? parseInt(saved, 10) : 350;
  });
  const [streakDays, setStreakDays] = useState<number>(7);
  const [completedProblems, setCompletedProblems] = useState<string[]>(() => {
    const saved = localStorage.getItem('geospace_completed_problems');
    return saved ? JSON.parse(saved) : ['prob-1'];
  });
  const [masteredAxioms, setMasteredAxioms] = useState<string[]>(() => {
    const saved = localStorage.getItem('geospace_mastered_axioms');
    return saved ? JSON.parse(saved) : ['axiom-1', 'axiom-2'];
  });

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContextTitle, setAiContextTitle] = useState('');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // Sync online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save progress to LocalStorage
  useEffect(() => {
    localStorage.setItem('geospace_user_score', userScore.toString());
    localStorage.setItem('geospace_completed_problems', JSON.stringify(completedProblems));
    localStorage.setItem('geospace_mastered_axioms', JSON.stringify(masteredAxioms));
  }, [userScore, completedProblems, masteredAxioms]);

  // Handlers
  const handleCompleteProblem = (probId: string) => {
    if (!completedProblems.includes(probId)) {
      setCompletedProblems(prev => [...prev, probId]);
      setUserScore(prev => prev + 100);
    }
  };

  const handleMarkAxiomMastered = (axId: string) => {
    if (!masteredAxioms.includes(axId)) {
      setMasteredAxioms(prev => [...prev, axId]);
      setUserScore(prev => prev + 50);
    }
  };

  const handleSyncData = () => {
    sound.playClick();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      sound.playSuccess();
    }, 1000);
  };

  const handleOpenAiForProblem = (problem: SolvedProblem, stepIndex: number) => {
    sound.playClick();
    setAiContextTitle(`${problem.title} (Bước ${stepIndex + 1})`);
    setAiModalOpen(true);
  };

  const navItems = [
    { key: 'axioms', label: language === 'vi' ? '5 Tiên Đề' : '5 Axioms', icon: Compass },
    { key: 'solver', label: language === 'vi' ? 'Giải Bài Tập 3D' : '3D Solved Problems', icon: BookOpen },
    { key: 'quiz', label: language === 'vi' ? 'Trắc Nghiệm' : 'Quizzes', icon: HelpCircle },
    { key: 'game', label: language === 'vi' ? 'Thợ Săn Giao Tuyến' : '3D Quest Game', icon: Gamepad2 },
    { key: 'sandbox', label: language === 'vi' ? 'Phòng Thí Nghiệm' : '3D Sandbox', icon: Box },
    { key: 'discussion', label: language === 'vi' ? 'Thảo Luận Nhóm' : 'Discussions', icon: MessageSquare },
    { key: 'teacher', label: language === 'vi' ? 'Giáo Viên' : 'Educator', icon: GraduationCap },
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Main Navigation Bar */}
      <header className="h-14 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between flex-shrink-0 z-30 backdrop-blur-md">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-extrabold text-sm">
            G3D
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">GeoSpace 3D</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                Toán 11
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[280px]">
              {language === 'vi' ? 'Đường thẳng & Mặt phẳng, Các Tiên đề' : 'Lines, Planes & Axioms'}
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.key as NavTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2">
          {/* AI Tutor Assistant Button */}
          <button
            onClick={() => {
              sound.playClick();
              setAiContextTitle('Trợ giảng Hình học Không gian');
              setAiModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold shadow-sm transition-all"
            title="Mở AI Trợ Giảng Gemini 3.8 Flash"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">AI Trợ Giảng</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>

          {/* User Score & Streak Pill */}
          <button
            onClick={() => {
              sound.playClick();
              setLeaderboardOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono transition-colors"
            title="Xem Bảng xếp hạng"
          >
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {userScore} XP
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-orange-400 font-semibold">
              🔥 {streakDays}d
            </span>
          </button>

          {/* Leaderboard icon */}
          <button
            onClick={() => {
              sound.playClick();
              setLeaderboardOpen(true);
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title="Bảng xếp hạng"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Learning Progress Report icon */}
          <button
            onClick={() => {
              sound.playClick();
              setReportModalOpen(true);
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-colors"
            title="Xuất Báo cáo tiến trình học tập"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Notification drawer icon */}
          <button
            onClick={() => {
              sound.playClick();
              setNotifDrawerOpen(true);
            }}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800 relative transition-colors"
            title="Thông báo nhắc nhở"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {/* Pro Upgrade Button */}
          {!isPro && (
            <button
              onClick={() => {
                sound.playClick();
                setUpgradeModalOpen(true);
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gói Pro</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setLanguage(prev => (prev === 'vi' ? 'en' : 'vi'));
            }}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition-colors"
            title="Chuyển đổi ngôn ngữ Tiếng Việt / English"
          >
            {language === 'vi' ? 'VI' : 'EN'}
          </button>

          {/* Real-time sync / Offline status badge */}
          <button
            onClick={handleSyncData}
            className={`p-2 rounded-xl border transition-colors ${
              isOnline
                ? 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
                : 'bg-rose-950/40 border-rose-800/50 text-rose-400'
            }`}
            title={isOnline ? 'Đã kết nối trực tuyến (Nhấn để đồng bộ dữ liệu)' : 'Chế độ ngoại tuyến (Dữ liệu lưu an toàn trên máy)'}
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            ) : isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 p-3 grid grid-cols-2 gap-1.5 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.key as NavTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Tab Views Container */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'axioms' && (
          <AxiomExplorer
            masteredAxioms={masteredAxioms}
            onMarkMastered={handleMarkAxiomMastered}
            language={language}
          />
        )}

        {activeTab === 'solver' && (
          <StepByStepSolver
            problems={SOLVED_PROBLEMS_DATA}
            onCompleteProblem={handleCompleteProblem}
            onRequestAiHelp={handleOpenAiForProblem}
            language={language}
          />
        )}

        {activeTab === 'quiz' && (
          <div className="h-full bg-slate-950">
            <QuizSection
              questions={QUIZ_QUESTIONS_DATA}
              onQuizCompleted={(score, total) => {
                setUserScore(prev => prev + score * 20);
              }}
              language={language}
            />
          </div>
        )}

        {activeTab === 'game' && (
          <SpaceHunterGame
            onScoreSave={(score) => {
              setUserScore(prev => prev + Math.floor(score / 5));
            }}
            language={language}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxStudio
            language={language}
          />
        )}

        {activeTab === 'discussion' && (
          <DiscussionRoom
            language={language}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            onExportReport={() => setReportModalOpen(true)}
            language={language}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <AiTutorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        contextTitle={aiContextTitle}
        language={language}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        userScore={userScore}
        userStreak={streakDays}
        language={language}
      />

      <ProgressReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        userScore={userScore}
        streakDays={streakDays}
        completedProblemsCount={completedProblems.length}
        completedAxiomsCount={masteredAxioms.length}
        language={language}
      />

      <ProUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onSuccessUpgrade={() => setIsPro(true)}
        isPro={isPro}
        language={language}
      />

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        language={language}
      />
    </div>
  );
}
