import React, { useState } from 'react';
import { AXIOMS_DATA, PLANE_DETERMINATION_METHODS } from '../data/curriculumData';
import { Geometry3DCanvas } from './Geometry3DCanvas';
import { 
  CheckCircle, 
  Compass, 
  Lightbulb, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  onMarkMastered?: (axiomId: string) => void;
  masteredAxioms?: string[];
  language?: 'vi' | 'en';
}

export const AxiomExplorer: React.FC<Props> = ({
  onMarkMastered,
  masteredAxioms = [],
  language = 'vi'
}) => {
  const [selectedAxiomIndex, setSelectedAxiomIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'axioms' | 'determination'>('axioms');

  const currentAxiom = AXIOMS_DATA[selectedAxiomIndex] || AXIOMS_DATA[0];
  const isMastered = masteredAxioms.includes(currentAxiom.id);

  const handleSelectAxiom = (idx: number) => {
    sound.playClick();
    setSelectedAxiomIndex(idx);
  };

  const handleToggleMastered = () => {
    sound.playSuccess();
    onMarkMastered?.(currentAxiom.id);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 overflow-hidden">
      {/* 3D Visualizer Canvas for Current Axiom */}
      <div className="flex-1 relative h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800">
        <Geometry3DCanvas
          modelData={currentAxiom.modelData}
          language={language}
        />

        {/* Floating Axiom Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-100">
            {language === 'vi' ? `Tiên đề ${currentAxiom.number}` : `Axiom ${currentAxiom.number}`}
          </span>
          <span className="text-xs text-blue-400 font-mono">
            {currentAxiom.title.split(':')[1]?.trim() || ''}
          </span>
        </div>
      </div>

      {/* Right Content & Curriculum Guide Panel */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col h-[50vh] lg:h-full bg-slate-900/95 border-l border-slate-800 overflow-y-auto">
        {/* Mode Selector Tabs (5 Tiên đề vs 3 Cách xác định mặt phẳng) */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('axioms');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'axioms'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>5 Tiên Đề Không Gian</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('determination');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'determination'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3 Cách Xác Định Mặt Phẳng</span>
            </button>
          </div>

          {/* Axioms List Buttons */}
          {viewMode === 'axioms' && (
            <div className="grid grid-cols-5 gap-1.5">
              {AXIOMS_DATA.map((ax, idx) => {
                const isSelected = idx === selectedAxiomIndex;
                const isDone = masteredAxioms.includes(ax.id);
                return (
                  <button
                    key={ax.id}
                    onClick={() => handleSelectAxiom(idx)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>TĐ {ax.number}</span>
                    {isDone && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* View Mode: Axioms Detail */}
        {viewMode === 'axioms' ? (
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  {language === 'vi' ? `Tiên đề số ${currentAxiom.number}` : `Axiom #${currentAxiom.number}`}
                </span>
                <h2 className="text-base font-extrabold text-slate-100 leading-snug">
                  {language === 'vi' ? currentAxiom.title : currentAxiom.titleEn}
                </h2>
              </div>

              {/* Exact Axiom Statement */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/50 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Phát biểu tiên đề:' : 'Axiom Statement:'}</span>
                </div>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed italic">
                  "{language === 'vi' ? currentAxiom.statement : currentAxiom.statementEn}"
                </p>
              </div>

              {/* Detailed Mathematical Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'vi' ? 'Ý nghĩa & Bản chất toán học:' : 'Meaning & Mathematical Significance:'}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'vi' ? currentAxiom.explanation : currentAxiom.explanationEn}
                </p>
              </div>

              {/* Core Symbolism & Formula */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  {language === 'vi' ? 'Công thức & Kí hiệu ghi nhớ:' : 'Key Notation & Rule:'}
                </div>
                <div className="text-xs font-mono font-medium text-emerald-200">
                  {language === 'vi' ? currentAxiom.keyRule : currentAxiom.keyRuleEn}
                </div>
              </div>

              {/* Practical / Real-world Application */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Ứng dụng thực tế & Mẹo giải toán:' : 'Practical Application:'}</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {language === 'vi' ? currentAxiom.practicalApplication : currentAxiom.practicalApplicationEn}
                </p>
              </div>
            </div>

            {/* Bottom Action: Mark Mastered */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={handleToggleMastered}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isMastered
                    ? 'bg-emerald-600/30 border border-emerald-500/60 text-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isMastered 
                    ? (language === 'vi' ? 'Đã thành thạo tiên đề này (Nhận 50 XP)' : 'Mastered (50 XP awarded)')
                    : (language === 'vi' ? 'Đánh dấu đã hiểu & Thành thạo (+50 XP)' : 'Mark as Mastered (+50 XP)')}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* View Mode: 3 Ways to Determine a Plane */
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div className="mb-2">
              <h2 className="text-sm font-extrabold text-slate-100">
                {language === 'vi' ? 'Ba Cách Cơ Bản Xác Định Một Mặt Phẳng' : 'Three Ways to Determine a Plane'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'vi' 
                  ? 'Một mặt phẳng hoàn toàn được xác định (duy nhất) khi biết một trong ba điều kiện sau:' 
                  : 'A plane is uniquely determined by satisfying any of the 3 conditions:'}
              </p>
            </div>

            {PLANE_DETERMINATION_METHODS.map((method, idx) => (
              <div 
                key={method.id} 
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-400">
                    {language === 'vi' ? method.title : method.titleEn}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[11px] font-semibold">
                    {method.formula}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {method.description}
                </div>
                <div className="text-[11px] font-mono bg-slate-950 p-2 rounded-lg text-emerald-300 border border-slate-800">
                  <span className="text-slate-500 mr-2">Điều kiện:</span>
                  {method.condition}
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
              <span className="font-bold">Lưu ý then chốt:</span> Bốn điểm bất kì trong không gian chưa chắc đã đồng phẳng! Muốn chứng minh 4 điểm đồng phẳng, hãy tìm mặt phẳng xác định bởi 3 điểm và chứng minh điểm thứ tư cũng thuộc mặt phẳng đó (dùng Tiên đề 3).
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
