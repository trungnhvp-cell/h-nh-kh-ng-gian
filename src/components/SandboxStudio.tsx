import React, { useState } from 'react';
import { Geometry3DCanvas } from './Geometry3DCanvas';
import { SANDBOX_PRESETS } from '../data/curriculumData';
import { 
  Box, 
  Pyramid, 
  Layers, 
  Sliders, 
  Camera, 
  RotateCcw, 
  Eye, 
  Info,
  Sparkles,
  Compass
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  language?: 'vi' | 'en';
}

export const SandboxStudio: React.FC<Props> = ({
  language = 'vi'
}) => {
  const [selectedSolidKey, setSelectedSolidKey] = useState<'tetrahedron' | 'pyramid_quad' | 'box_prism'>('tetrahedron');
  const [showCuttingPlane, setShowCuttingPlane] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const activeModel = SANDBOX_PRESETS[selectedSolidKey] || SANDBOX_PRESETS.tetrahedron;

  const handleSelectSolid = (key: 'tetrahedron' | 'pyramid_quad' | 'box_prism') => {
    sound.playClick();
    setSelectedSolidKey(key);
    setSelectedPoint(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 overflow-hidden">
      {/* 3D Visualizer Canvas */}
      <div className="flex-1 relative h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800">
        <Geometry3DCanvas
          modelData={activeModel}
          showCuttingPlane={showCuttingPlane}
          onPointClick={(ptName) => setSelectedPoint(ptName)}
          language={language}
        />

        {/* Floating Top Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg backdrop-blur-md">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-100">
            {activeModel.title}
          </span>
        </div>
      </div>

      {/* Right Control & Exploration Panel */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col h-[50vh] lg:h-full bg-slate-900/95 border-l border-slate-800 p-4 sm:p-5 overflow-y-auto justify-between">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              <Compass className="w-4 h-4" />
              <span>{language === 'vi' ? 'Phòng Thí Nghiệm Không Gian 3D' : '3D Geometry Sandbox'}</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-100">
              {language === 'vi' ? 'Khảo Sát Khối Đa Diện & Thiết Diện Cắt' : 'Polyhedral & Cross-Section Explorer'}
            </h2>
          </div>

          {/* Solid Switcher */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              {language === 'vi' ? 'Chọn khối hình học mẫu:' : 'Select 3D Geometry Solid:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSelectSolid('tetrahedron')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedSolidKey === 'tetrahedron'
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Pyramid className="w-4 h-4 text-blue-400" />
                <span>Tứ diện ABCD</span>
              </button>

              <button
                onClick={() => handleSelectSolid('pyramid_quad')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedSolidKey === 'pyramid_quad'
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Hình chóp S.ABCD</span>
              </button>

              <button
                onClick={() => handleSelectSolid('box_prism')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedSolidKey === 'box_prism'
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Box className="w-4 h-4 text-amber-400" />
                <span>Hình hộp chữ nhật</span>
              </button>
            </div>
          </div>

          {/* Model Description */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {activeModel.description}
          </div>

          {/* Cutting plane toggle & details */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-200">
                  {language === 'vi' ? 'Mặt phẳng cắt không gian (P)' : 'Interactive Slicing Plane'}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCuttingPlane(!showCuttingPlane);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  showCuttingPlane
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {showCuttingPlane ? 'Đang bật' : 'Đang tắt'}
              </button>
            </div>
            <p className="text-xs text-cyan-200/80 leading-relaxed">
              Mặt phẳng cắt màu xanh lơ trong suốt. Bạn có thể sử dụng thanh trượt ở thanh điều khiển phía dưới đáy màn hình 3D để thay đổi độ cao và quan sát thiết diện biến đổi theo thời gian thực!
            </p>
          </div>

          {/* Geometric Properties Checklist */}
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Đặc tính hình học:
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span>Số đỉnh:</span>
              <span className="font-mono text-slate-200 font-bold">{activeModel.points.length} đỉnh</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span>Số cạnh:</span>
              <span className="font-mono text-slate-200 font-bold">{activeModel.edges.length} cạnh</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span>Số mặt phẳng bao quanh:</span>
              <span className="font-mono text-slate-200 font-bold">{activeModel.faces.length} mặt</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>GeoSpace 3D Engine v2.4</span>
          <span className="text-blue-400 font-mono">Render: Three.js PBR</span>
        </div>
      </div>
    </div>
  );
};
