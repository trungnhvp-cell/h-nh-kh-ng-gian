import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  contextTitle?: string;
  language?: 'vi' | 'en';
}

export const AiTutorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialQuestion = '',
  contextTitle = '',
  language = 'vi'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: language === 'vi'
        ? `Xin chào! Thầy là **AI Trợ Giảng GeoSpace 3D**, chuyên gia Hình học Không gian lớp 11.\n\nEm đang gặp khó khăn ở phần nào trong chủ đề **Đường thẳng & Mặt phẳng trong không gian, các tiên đề, tìm giao tuyến hay thiết diện**? Thầy sẵn sàng hướng dẫn chi tiết từng bước cho em!`
        : `Hello! I am your **GeoSpace 3D AI Tutor**, specialized in solid geometry foundations (axioms, lines & planes, traces, and cross-sections).\n\nWhat would you like me to clarify for you today?`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [inputText, setInputText] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = language === 'vi' ? [
    'Quy tắc 4 bước tìm thiết diện hình chóp là gì?',
    'Làm sao để biết 2 đường thẳng trong không gian chéo nhau hay cắt nhau?',
    'Giải thích Tiên đề 4 bằng ví dụ thực tế trong đời sống',
    'Cách chọn mặt phẳng phụ để tìm giao điểm đường thẳng và mặt phẳng'
  ] : [
    'What is the 4-step algorithm to find a cross-section?',
    'How do I distinguish skew lines from intersecting lines?',
    'Explain Axiom 4 with a real-life analogy',
    'How to choose an auxiliary plane for line-plane intersection?'
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    sound.playClick();
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: contextTitle || 'Hình học không gian - Tiên đề',
          userQuestion: textToSend,
          language
        })
      });

      const data = await response.json();
      const aiText = data.explanation || (language === 'vi' 
        ? 'Dựa vào Tiên đề 4: Hai mặt phẳng phân biệt có điểm chung thì chúng có đường thẳng chung duy nhất là giao tuyến. Em hãy tìm hai điểm chung để xác định giao tuyến này.' 
        : 'By Axiom 4: Two distinct planes sharing a point meet along a unique line.');

      sound.playSuccess();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'vi' 
            ? 'Theo Tiên đề 3: Nếu một đường thẳng có hai điểm phân biệt cùng thuộc một mặt phẳng thì mọi điểm của đường thẳng đều thuộc mặt phẳng đó. Em hãy tận dụng tính chất này để chứng minh điểm chung!'
            : 'According to Axiom 3, if a line has two points in a plane, the entire line lies in that plane.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl h-[640px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {language === 'vi' ? 'AI Trợ Giảng Hình Học Không Gian' : 'AI Geometry Tutor'}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {contextTitle || (language === 'vi' ? 'Chuyên đề: Tiên đề & Mặt phẳng' : 'Solid Geometry Expert')}
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

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/40">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isAi
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-invert prose-xs">
                    {m.text}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 text-right">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-purple-300 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AI đang suy luận hình học và biên soạn lời giải...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/80 whitespace-nowrap flex-shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'vi' ? 'Nhập câu hỏi về hình không gian, tiên đề, thiết diện...' : 'Ask any solid geometry question...'}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-xl font-bold transition-all shadow-md ${
              inputText.trim() && !isLoading
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
