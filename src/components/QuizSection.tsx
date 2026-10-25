import React, { useState } from 'react';
import { QuizQuestion } from '../types/geometry';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  Zap, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';

interface Props {
  questions: QuizQuestion[];
  onQuizCompleted?: (score: number, total: number) => void;
  language?: 'vi' | 'en';
}

export const QuizSection: React.FC<Props> = ({
  questions,
  onQuizCompleted,
  language = 'vi'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const currentAnswer = selectedAnswers[currentQ.id];

  const handleSelectOption = (key: string) => {
    if (showExplanation || isFinished) return;
    sound.playClick();
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleConfirmAnswer = () => {
    if (!currentAnswer) return;

    const isCorrect = currentAnswer === currentQ.correctKey;
    if (isCorrect) {
      sound.playSuccess();
      setScore(prev => prev + 1);
    } else {
      sound.playError();
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    sound.playClick();
    setShowExplanation(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed Quiz
      setIsFinished(true);
      const finalScore = score + (currentAnswer === currentQ.correctKey ? 0 : 0); // score already updated
      onQuizCompleted?.(score, totalQuestions);

      if (score >= Math.floor(totalQuestions * 0.7)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
  };

  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 shadow-lg border border-amber-500/30">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-slate-100 mb-2">
          {language === 'vi' ? 'Hoàn thành bài trắc nghiệm!' : 'Quiz Completed!'}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {language === 'vi' 
            ? 'Bạn đã hoàn thành bộ câu hỏi kiểm tra kiến thức về Đường thẳng, Mặt phẳng và Các tiên đề.' 
            : 'You completed the solid geometry axioms assessment.'}
        </p>

        {/* Score Card */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="text-4xl font-extrabold text-blue-400 font-mono mb-1">
            {score} / {totalQuestions}
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {percentage}% {language === 'vi' ? 'Độ chính xác' : 'Accuracy'}
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all ${
                percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
            <Zap className="w-4 h-4" />
            <span>+{score * 20} XP Đã cộng vào hồ sơ học viên</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'vi' ? 'Làm lại bài kiểm tra' : 'Retake Quiz'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 sm:p-6 overflow-y-auto">
      {/* Top Progression Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'vi' ? 'Câu hỏi' : 'Question'}
          </span>
          <span className="text-xs font-mono font-bold text-blue-400">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Điểm: {score * 20} XP</span>
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
        <div 
          className="bg-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5 shadow-xl">
        {currentQ.axiomRef && (
          <span className="inline-block text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20 mb-2.5">
            {currentQ.axiomRef}
          </span>
        )}
        <h3 className="text-base font-bold text-slate-100 leading-snug">
          {language === 'vi' ? currentQ.question : currentQ.questionEn}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((opt) => {
          const isSelected = currentAnswer === opt.key;
          const isCorrectAnswer = opt.key === currentQ.correctKey;
          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800';

          if (showExplanation) {
            if (isCorrectAnswer) {
              btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
            } else if (isSelected && !isCorrectAnswer) {
              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500';
            }
          } else if (isSelected) {
            btnStyle = 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm';
          }

          return (
            <button
              key={opt.key}
              onClick={() => handleSelectOption(opt.key)}
              disabled={showExplanation}
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-slate-700">
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {language === 'vi' ? opt.text : opt.textEn}
                </span>
              </div>

              {showExplanation && isCorrectAnswer && (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />
              )}
              {showExplanation && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 mb-6 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wide mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'vi' ? 'Lời giải chi tiết & Căn cứ Tiên đề:' : 'Detailed Explanation:'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'vi' ? currentQ.explanation : currentQ.explanationEn}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto pt-4 flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={!currentAnswer}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              currentAnswer
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            {language === 'vi' ? 'Kiểm tra đáp án' : 'Check Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>{currentIndex < totalQuestions - 1 ? (language === 'vi' ? 'Câu tiếp theo' : 'Next') : (language === 'vi' ? 'Xem kết quả' : 'See Results')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
