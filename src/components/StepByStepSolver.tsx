import React, { useState } from 'react';
import { SolvedProblem } from '../types/geometry';
import { Geometry3DCanvas } from './Geometry3DCanvas';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Award, 
  Compass, 
  BookOpen, 
  ArrowRight,
  RotateCcw,
  Bot
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  problems: SolvedProblem[];
  onCompleteProblem?: (problemId: string) => void;
  onRequestAiHelp?: (problem: SolvedProblem, currentStepIndex: number) => void;
  language?: 'vi' | 'en';
}

export const StepByStepSolver: React.FC<Props> = ({
  problems,
  onCompleteProblem,
  onRequestAiHelp,
  language = 'vi'
}) => {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedProblemsMap, setCompletedProblemsMap] = useState<{ [id: string]: boolean }>({});

  const problem = problems[selectedProblemIndex] || problems[0];
  const step = problem.steps[currentStepIndex] || problem.steps[0];
  const totalSteps = problem.steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNextStep = () => {
    sound.playStep();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed problem
      sound.playSuccess();
      setCompletedProblemsMap(prev => ({ ...prev, [problem.id]: true }));
      onCompleteProblem?.(problem.id);
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSelectProblem = (idx: number) => {
    sound.playClick();
    setSelectedProblemIndex(idx);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 overflow-hidden">
      {/* Left / Main 3D Interactive Viewport */}
      <div className="flex-1 relative h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800">
        <Geometry3DCanvas
          modelData={problem.modelData}
          activeStepElements={step.highlightElements}
          language={language}
        />

        {/* Step indicator pill on 3D viewport */}
        <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold text-slate-200">
            {language === 'vi' ? `Bước ${currentStepIndex + 1}/${totalSteps}` : `Step ${currentStepIndex + 1}/${totalSteps}`}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {problem.categoryLabel}
          </span>
        </div>
      </div>

      {/* Right Walkthrough & Mathematical Reasoning Panel */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col h-[50vh] lg:h-full bg-slate-900/95 border-l border-slate-800 overflow-y-auto">
        {/* Header Problem Selector */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                {language === 'vi' ? 'Bài toán mẫu có lời giải 3D' : '3D Solved Problems'}
              </span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              problem.difficulty === 'Cơ bản' ? 'bg-emerald-500/20 text-emerald-300' :
              problem.difficulty === 'Thông hiểu' ? 'bg-blue-500/20 text-blue-300' :
              problem.difficulty === 'Vận dụng' ? 'bg-amber-500/20 text-amber-300' :
              'bg-purple-500/20 text-purple-300'
            }`}>
              {problem.difficulty}
            </span>
          </div>

          {/* Quick Problem Tabs */}
          <div className="grid grid-cols-2 gap-1.5">
            {problems.map((p, idx) => {
              const isSelected = idx === selectedProblemIndex;
              const isDone = completedProblemsMap[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(idx)}
                  className={`text-left p-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-200 font-semibold shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate pr-1">
                    {language === 'vi' ? `Bài ${idx + 1}: ${p.categoryLabel}` : `Prob ${idx + 1}: ${p.categoryLabelEn}`}
                  </span>
                  {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Problem Title & Prompt */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40">
          <h2 className="text-sm font-bold text-slate-100 leading-snug mb-1.5">
            {language === 'vi' ? problem.title : problem.titleEn}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
            {language === 'vi' ? problem.description : problem.descriptionEn}
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-1 mr-3">
            {problem.steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all flex-1 ${
                    isActive 
                      ? 'bg-amber-400 w-6' 
                      : isPassed 
                        ? 'bg-blue-500' 
                        : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Bước ${idx + 1}: ${s.title}`}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono font-semibold text-amber-400">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Active Step Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                {step.stepNumber}
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                {language === 'vi' ? step.title : step.titleEn}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {language === 'vi' ? step.content : step.contentEn}
            </p>

            {/* Geometric Axiom & Reasoning Box */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Lập luận hình học & Tiên đề:' : 'Geometric Deduction:'}</span>
              </div>
              <p className="text-xs text-blue-200 font-mono leading-relaxed">
                {language === 'vi' ? step.geometryReasoning : step.geometryReasoningEn}
              </p>
            </div>

            {/* AI Tutor Assistant Hint Trigger */}
            <button
              onClick={() => onRequestAiHelp?.(problem, currentStepIndex)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-800/50 hover:to-blue-800/50 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span>{language === 'vi' ? 'Hỏi AI trợ giảng về bước này' : 'Ask AI Tutor about this step'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-800/40 border-slate-800 text-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'vi' ? 'Bước trước' : 'Previous'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setCurrentStepIndex(0);
              }}
              title="Xem lại từ đầu"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNextStep}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isLastStep
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <span>
                {isLastStep 
                  ? (language === 'vi' ? 'Hoàn thành bài toán' : 'Complete Problem')
                  : (language === 'vi' ? 'Bước tiếp theo' : 'Next Step')}
              </span>
              {isLastStep ? <Award className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
