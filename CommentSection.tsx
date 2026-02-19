
import React, { useState } from 'react';
import { Comment, User } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  currentUser: User | null;
  compact?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, currentUser, compact = false }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const renderCommentText = (text: string) => {
    const isImageUrl = text.match(/\.(jpeg|jpg|gif|png)$/) != null || text.startsWith('https://media.giphy.com');
    if (isImageUrl) {
      return (
        <div className="mt-2 rounded-xl overflow-hidden max-w-xs shadow-md border border-purple-100">
          <img src={text} alt="Comment Media" className="w-full h-auto object-cover max-h-40" />
        </div>
      );
    }
    return <p className="text-black font-bold text-sm leading-relaxed">{text}</p>;
  };

  return (
    <div className={`space-y-4 ${compact ? 'mt-4' : 'mt-6'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💬</span>
        <h4 className="text-sm font-black text-black">التعليقات ({comments.length})</h4>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className={`w-8 h-8 rounded-full overflow-hidden border ${currentUser?.role === 'admin' ? 'border-red-400' : 'border-purple-200'} shrink-0 bg-white`}>
          <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 relative">
           <input 
             type="text"
             value={commentText}
             onChange={e => setCommentText(e.target.value)}
             className={`w-full px-4 py-2 rounded-xl bg-gray-100 border border-transparent focus:bg-white focus:border-purple-300 outline-none transition-all font-bold text-black text-xs ${currentUser?.role === 'admin' ? 'border-red-100' : ''}`}
             placeholder="اكتب تعليقك هنا..."
           />
           <button 
             type="submit" 
             disabled={!commentText.trim()} 
             className={`absolute left-2 top-1/2 -translate-y-1/2 font-black text-[10px] transition-colors disabled:opacity-30 ${currentUser?.role === 'admin' ? 'text-red-600 hover:text-red-800' : 'text-purple-600 hover:text-purple-800'}`}
           >
             نشر
           </button>
        </div>
      </form>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {comments.map(c => {
          // التحقق من رتبة الكاتب من خلال بيانات التعليق المخزنة
          const isDev = c.userRole === 'admin';
          return (
            <div key={c.id} className="flex gap-3 items-start animate-fadeIn">
              <div className={`w-7 h-7 rounded-full overflow-hidden border shrink-0 bg-white ${isDev ? 'border-red-500 shadow-sm' : 'border-gray-100'}`}>
                 <img src={c.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.userId}`} alt={c.userName} className="w-full h-full object-cover" />
              </div>
              <div className={`flex-1 p-2.5 rounded-2xl rounded-tr-none border shadow-sm ${isDev ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                   <p className={`font-black text-[10px] ${isDev ? 'text-red-600 brightness-110' : 'text-purple-900'}`}>{c.userName}</p>
                   {isDev && <span className="text-blue-500 text-[10px] animate-pulse">🛡️</span>}
                </div>
                {renderCommentText(c.text)}
              </div>
            </div>
          );
        })}
        {comments.length === 0 && (
          <p className="text-center text-[10px] text-gray-400 font-black py-4">لا توجد تعليقات بعد، كن الأول!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
