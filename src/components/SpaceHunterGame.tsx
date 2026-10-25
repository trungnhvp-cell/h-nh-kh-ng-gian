import React, { useState, useEffect } from 'react';
import { Geometry3DCanvas } from './Geometry3DCanvas';
import { SANDBOX_PRESETS } from '../data/curriculumData';
import { 
  Trophy, 
  Timer, 
  Flame, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Sparkles,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';

interface GameQuestion {
  question: string;
  questionEn: string;
  presetKey: 'tetrahedron' | 'pyramid_quad' | 'box_prism';
  options: string[];
  correctAnswer: string;
  hint: string;
}

const GAME_QUESTIONS: GameQuestion[] = [
  {
    question: 'Trong hình chóp tứ giác S.ABCD, giao tuyến của hai mặt phẳng (SAB) và (SBC) là:',
    questionEn: 'In pyramid S.ABCD, the intersection line of planes (SAB) and (SBC) is:',
    presetKey: 'pyramid_quad',
    options: ['Cạnh SB', 'Cạnh SA', 'Cạnh SC', 'Đường chéo AC'],
    correctAnswer: 'Cạnh SB',
    hint: 'Hai mặt phẳng (SAB) và (SBC) có hai điểm chung rõ ràng là S và B.'
  },
  {
    question: 'Trong tứ diện ABCD, hai đường thẳng AB và CD có vị trí tương đối nào?',
    questionEn: 'In tetrahedron ABCD, what is the relative position of lines AB and CD?',
    presetKey: 'tetrahedron',
    options: ['Chéo nhau', 'Cắt nhau', 'Song song', 'Trùng nhau'],
    correctAnswer: 'Chéo nhau',
    hint: 'Bốn điểm A, B, C, D không đồng phẳng nên AB và CD không cùng thuộc một mặt phẳng.'
  },
  {
    question: 'Trong hình chóp S.ABCD, giao tuyến của hai mặt phẳng (SAC) và (SBD) đi qua đỉnh S và:',
    questionEn: 'In pyramid S.ABCD, the intersection line of (SAC) and (SBD) passes through S and:',
    presetKey: 'pyramid_quad',
    options: ['Giao điểm O của AC và BD', 'Trung điểm cạnh CD', 'Điểm A', 'Không có điểm thứ hai'],
    correctAnswer: 'Giao điểm O của AC và BD',
    hint: 'O = AC ∩ BD nằm trên cả hai đường chéo đáy nên thuộc cả (SAC) và (SBD).'
  },
  {
    question: 'Một mặt phẳng cắt hình tứ diện ABCD có thể tạo ra thiết diện là hình gì nhiều nhất?',
    questionEn: 'A plane slicing tetrahedron ABCD can yield a polygon with at most how many sides?',
    presetKey: 'tetrahedron',
    options: ['Tứ giác (4 cạnh)', 'Tam giác (3 cạnh)', 'Ngũ giác (5 cạnh)', 'Lục giác (6 cạnh)'],
    correctAnswer: 'Tứ giác (4 cạnh)',
    hint: 'Tứ diện có 4 mặt, mặt phẳng cắt tối đa 4 mặt nên thiết diện có tối đa 4 cạnh.'
  },
  {
    question: 'Trong hình hộp ABCD.A\'B\'C\'D\', mặt phẳng (ABCD) và (A\'B\'C\'D\') có bao nhiêu điểm chung?',
    questionEn: 'In box ABCD.A\'B\'C\'D\', how many common points do (ABCD) and (A\'B\'C\'D\') share?',
    presetKey: 'box_prism',
    options: ['0 điểm chung (song song)', '1 điểm chung', 'Vô số điểm chung', '4 điểm chung'],
    correctAnswer: '0 điểm chung (song song)',
    hint: 'Hai mặt đáy của hình hộp là hai mặt phẳng song song phân biệt.'
  }
];

interface Props {
  onScoreSave?: (score: number) => void;
  language?: 'vi' | 'en';
}

export const SpaceHunterGame: React.FC<Props> = ({
  onScoreSave,
  language = 'vi'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQ = GAME_QUESTIONS[currentQIndex % GAME_QUESTIONS.length];
  const activeModel = SANDBOX_PRESETS[currentQ.presetKey] || SANDBOX_PRESETS.tetrahedron;

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPlaying(false);
            sound.playSuccess();
            confetti();
            onScoreSave?.(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, onScoreSave]);

  const handleStartGame = () => {
    sound.playClick();
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setCombo(1);
    setCurrentQIndex(0);
    setFeedback(null);
  };

  const handleAnswer = (ans: string) => {
    if (!isPlaying) return;

    if (ans === currentQ.correctAnswer) {
      sound.playSuccess();
      const points = 100 * combo;
      setScore(prev => prev + points);
      setCombo(prev => Math.min(prev + 1, 5));
      setFeedback('correct');
    } else {
      sound.playError();
      setCombo(1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQIndex(prev => prev + 1);
    }, 600);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 overflow-hidden">
      {/* 3D Visual Scene */}
      <div className="flex-1 relative h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800">
        <Geometry3DCanvas
          modelData={activeModel}
          language={language}
        />

        {/* Top HUD overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg backdrop-blur-md">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              {language === 'vi' ? 'Thợ Săn Giao Tuyến 3D' : 'Space Geometry Quest'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg font-mono text-xs font-bold text-amber-400 backdrop-blur-md">
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg font-mono text-xs font-bold text-blue-400 backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>{score} pts</span>
            </div>

            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl shadow-lg font-mono text-xs font-extrabold text-white">
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                <span>{combo}x Combo!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Control & Question Panel */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col h-[50vh] lg:h-full bg-slate-900/95 border-l border-slate-800 p-5 overflow-y-auto justify-between">
        {!isPlaying && timeLeft === 45 ? (
          /* Start Screen */
          <div className="my-auto text-center p-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl text-white">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-100 mb-2">
              {language === 'vi' ? 'Mini-Game: Thợ Săn Giao Tuyến' : 'Mini-Game: Space Geometry Hunter'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mb-6">
              {language === 'vi' 
                ? 'Thử thách phản xạ không gian trong 45 giây! Nhìn mô hình 3D và chọn nhanh vị trí tương đối, giao tuyến hoặc giao điểm chính xác để tích lũy điểm combo!' 
                : 'Test your 3D spatial intuition in 45s! Identify intersection lines and plane relations against the timer.'}
            </p>

            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'vi' ? 'Bắt đầu thử thách ngay' : 'Start Challenge'}</span>
            </button>
          </div>
        ) : !isPlaying && timeLeft === 0 ? (
          /* Game Over Screen */
          <div className="my-auto text-center p-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl border border-amber-500/30">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-100 mb-1">
              {language === 'vi' ? 'Hết giờ!' : 'Time\'s Up!'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'vi' ? 'Bạn đã hoàn thành lượt chơi xuất sắc' : 'Great run!'}
            </p>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <div className="text-3xl font-extrabold text-amber-400 font-mono mb-1">
                {score}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'vi' ? 'Điểm tích lũy' : 'Total Score'}
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'vi' ? 'Chơi lại' : 'Play Again'}</span>
            </button>
          </div>
        ) : (
          /* Active Playing Screen */
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  {language === 'vi' ? `Câu hỏi #${(currentQIndex % GAME_QUESTIONS.length) + 1}` : `Question #${(currentQIndex % GAME_QUESTIONS.length) + 1}`}
                </span>
                <span className="text-xs text-slate-400">
                  {activeModel.title}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-slate-100 leading-snug">
                  {language === 'vi' ? currentQ.question : currentQ.questionEn}
                </h3>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-slate-700/80 text-left text-xs font-semibold text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    <Zap className="w-3.5 h-3.5 opacity-40" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Feedback Toast */}
            {feedback && (
              <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                feedback === 'correct'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500 text-rose-300'
              }`}>
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chính xác! +{100 * combo} điểm</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Chưa đúng! Gợi ý: {currentQ.hint}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
