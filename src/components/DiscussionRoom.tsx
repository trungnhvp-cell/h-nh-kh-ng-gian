import React, { useState, useEffect } from 'react';
import { DiscussionPost } from '../types/geometry';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  PlusCircle, 
  Sparkles, 
  User, 
  GraduationCap, 
  Tag, 
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Props {
  language?: 'vi' | 'en';
}

export const DiscussionRoom: React.FC<Props> = ({
  language = 'vi'
}) => {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Thiết diện');

  // Load initial discussions from server
  useEffect(() => {
    fetch('/api/discussions')
      .then(res => res.json())
      .then(data => {
        if (data.discussions) {
          setPosts(data.discussions);
          if (data.discussions.length > 0) {
            setSelectedPostId(data.discussions[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const activePost = posts.find(p => p.id === selectedPostId) || posts[0];

  const handleLike = (id: string) => {
    sound.playClick();
    setPosts(prev => prev.map(p => {
      if (p.id === id) return { ...p, likes: p.likes + 1 };
      return p;
    }));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activePost) return;
    sound.playClick();

    const userReply = {
      id: `rep-${Date.now()}`,
      author: 'Tôi (Học viên)',
      avatar: '🧑‍🎓',
      content: replyText,
      timestamp: 'Vừa xong'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === activePost.id) {
        return {
          ...p,
          replies: [...p.replies, userReply]
        };
      }
      return p;
    }));

    setReplyText('');

    // Send to backend
    try {
      await fetch(`/api/discussions/${activePost.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userReply.content,
          author: userReply.author
        })
      });
    } catch {}
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    sound.playSuccess();

    const newPostItem: DiscussionPost = {
      id: `disc-${Date.now()}`,
      author: 'Tôi (Học viên)',
      avatar: '🧑‍🎓',
      title: newTitle,
      content: newContent,
      timestamp: 'Vừa xong',
      likes: 1,
      tags: [selectedTag, 'Hình không gian'],
      replies: []
    };

    setPosts([newPostItem, ...posts]);
    setSelectedPostId(newPostItem.id);
    setShowNewPostModal(false);
    setNewTitle('');
    setNewContent('');

    try {
      await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostItem.title,
          content: newPostItem.content,
          author: newPostItem.author,
          tags: newPostItem.tags
        })
      });
    } catch {}
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-950 overflow-hidden">
      {/* Left Topic List */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col h-[40vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60">
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'vi' ? 'Thảo luận nhóm & Hỏi đáp' : 'Study Groups & Q&A'}
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowNewPostModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Đặt câu hỏi' : 'New Post'}</span>
          </button>
        </div>

        {/* List of Posts */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {posts.map((p) => {
            const isSelected = p.id === activePost?.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedPostId(p.id);
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <span>{p.avatar}</span>
                    <span className="truncate max-w-[140px]">{p.author}</span>
                  </div>
                  <span>{p.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2 mb-2">
                  {p.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    {p.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>💬 {p.replies.length}</span>
                    <span>👍 {p.likes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detailed Conversation View */}
      {activePost ? (
        <div className="flex-1 flex flex-col h-[60vh] lg:h-full bg-slate-900/40 overflow-hidden">
          {/* Active Post Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activePost.avatar}</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">{activePost.author}</div>
                  <div className="text-[10px] text-slate-400">{activePost.timestamp}</div>
                </div>
              </div>

              <button
                onClick={() => handleLike(activePost.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{activePost.likes} Thích</span>
              </button>
            </div>

            <h2 className="text-sm sm:text-base font-extrabold text-slate-100 mb-2 leading-snug">
              {activePost.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {activePost.content}
            </p>
          </div>

          {/* Replies Thread */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Ý kiến phản hồi & Giải đáp ({activePost.replies.length})</span>
            </div>

            {activePost.replies.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Chưa có câu trả lời nào. Hãy là người đầu tiên giúp đỡ bạn học nhé!
              </div>
            ) : (
              activePost.replies.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    rep.isTeacher
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
                      : rep.isAi
                        ? 'bg-purple-950/20 border-purple-800/40 text-purple-100'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span>{rep.avatar}</span>
                      <span className="font-bold text-slate-200">{rep.author}</span>
                      {rep.isTeacher && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Giáo viên
                        </span>
                      )}
                      {rep.isAi && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          AI Trợ giảng
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{rep.timestamp}</span>
                  </div>

                  <p className="text-xs leading-relaxed">{rep.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Reply Bar */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Nhập câu trả lời hoặc thảo luận phương pháp giải..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all shadow-md ${
                replyText.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          Chọn một chủ đề để xem thảo luận
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100">
                Tạo chủ đề thảo luận hình học không gian
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tiêu đề câu hỏi / Vấn đề cần hỗ trợ:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Làm sao tìm giao điểm nhanh trong hình chóp tứ giác?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Chủ đề thẻ:
                </label>
                <div className="flex gap-2">
                  {['Thiết diện', 'Tiên đề', 'Giao tuyến', 'Đồng quy'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        selectedTag === tag 
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nội dung chi tiết:
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Mô tả cụ thể giả thiết bài toán hoặc bước lập luận em đang thắc mắc..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={handleCreatePost}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
              >
                Đăng câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
