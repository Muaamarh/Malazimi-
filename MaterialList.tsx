
import React, { useState } from 'react';
import { SectionType, Subject, Material, Comment, User, ParticipationData, InteractionData } from '../types';
import { SUBJECT_ICONS } from '../constants';
import CommentSection from './CommentSection';

interface MaterialListProps {
  type: SectionType;
  materials: Material[];
  activeSubject: Subject | null;
  onSubjectSelect: (s: Subject | null) => void;
  comments: Comment[];
  onAddComment: (t: string, id: string) => void;
  currentUser: User | null;
  participation: ParticipationData;
  onOpenMaterial: (id: string) => void;
  likes: InteractionData;
  dislikes: InteractionData;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onUpdateMaterial: (mat: Material) => void;
  onDeleteMaterial: (id: string) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ 
  type, materials, activeSubject, onSubjectSelect, comments, onAddComment, 
  currentUser, participation, onOpenMaterial, likes, dislikes, onLike, onDislike,
  onUpdateMaterial, onDeleteMaterial
}) => {
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [editingMat, setEditingMat] = useState<Material | null>(null);

  const sectionMaterials = materials.filter(m => m.section === type);
  const filteredMaterials = activeSubject 
    ? sectionMaterials.filter(m => m.subject === activeSubject) 
    : sectionMaterials;

  const isAdmin = currentUser?.role === 'admin';

  const getSectionTitle = () => {
    return type === SectionType.MATERIALS ? 'الملازم الدراسية' : 'ملازم الاختبارات التدريبية';
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMat) {
      onUpdateMaterial(editingMat);
      setEditingMat(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Filter */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-purple-900">{getSectionTitle()}</h2>
          <p className="text-gray-500 font-bold mt-1">تصفح وحمل الملفات برابط مباشر من تليجرام</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => onSubjectSelect(null)}
             className={`px-5 py-2 rounded-full font-bold transition-all ${!activeSubject ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
           >
             الكل
           </button>
           {Object.values(Subject).map(subj => (
             <button 
               key={subj}
               onClick={() => onSubjectSelect(subj)}
               className={`px-5 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeSubject === subj ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
             >
               <span>{SUBJECT_ICONS[subj]}</span>
               {subj}
             </button>
           ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredMaterials.map(mat => {
          const partCount = participation[`mat_${mat.id}`] || 0;
          const currentItemLikes = likes[mat.id] || [];
          const currentItemDislikes = dislikes[mat.id] || [];
          const matComments = comments.filter(c => c.targetId === `mat_${mat.id}`);
          
          const hasLiked = currentUser ? currentItemLikes.includes(currentUser.id) : false;
          const hasDisliked = currentUser ? currentItemDislikes.includes(currentUser.id) : false;
          const isCommentsOpen = openComments === mat.id;

          return (
            <div key={mat.id} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col relative">
              
              {/* واجهة المطور */}
              {isAdmin && (
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => setEditingMat(mat)} className="bg-blue-600 text-white p-2 rounded-lg text-[10px] font-black shadow-lg">تعديل 📝</button>
                  <button onClick={() => onDeleteMaterial(mat.id)} className="bg-red-600 text-white p-2 rounded-lg text-[10px] font-black shadow-lg">حذف 🗑️</button>
                </div>
              )}

              <div className="p-6 flex items-start gap-4">
                <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {mat.type === 'PDF' ? '📕' : mat.type === 'QUIZ' ? '📝' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-lg font-black text-black truncate">{mat.title}</h3>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 shrink-0">
                        <span className="text-[10px]">👤</span>
                        <span className="text-[10px] font-black text-gray-600">{partCount}</span>
                    </div>
                  </div>
                  <p className="text-purple-600 font-black text-[10px] mb-4 uppercase tracking-wider">{mat.subject}</p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                     <a 
                       href={mat.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       onClick={() => onOpenMaterial(mat.id)}
                       className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-black shadow-md transition-all flex items-center gap-2 text-[10px]"
                     >
                       📥 فتح الرابط
                     </a>
                     
                     <div className="flex items-center gap-2 ml-auto">
                       <button 
                          onClick={() => onLike(mat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                            hasLiked ? 'bg-green-600 text-white border-green-700' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-green-50'
                          }`}
                       >
                          <span className="text-xs">👍</span>
                          <span className="text-[10px] font-black">{currentItemLikes.length}</span>
                       </button>
                       <button 
                          onClick={() => onDislike(mat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                            hasDisliked ? 'bg-red-600 text-white border-red-700' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-red-50'
                          }`}
                       >
                          <span className="text-xs">👎</span>
                          <span className="text-[10px] font-black">{currentItemDislikes.length}</span>
                       </button>
                       <button 
                          onClick={() => setOpenComments(isCommentsOpen ? null : mat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                            isCommentsOpen ? 'bg-purple-600 text-white border-purple-700 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-purple-50'
                          }`}
                       >
                          <span className="text-xs">💬</span>
                          <span className="text-[10px] font-black">{matComments.length}</span>
                       </button>
                     </div>
                  </div>
                </div>
              </div>

              {isCommentsOpen && (
                <div className="bg-gray-50/80 p-6 border-t border-gray-100 animate-slideDown">
                  <CommentSection 
                    compact
                    comments={matComments}
                    onAddComment={(t) => onAddComment(t, `mat_${mat.id}`)}
                    currentUser={currentUser}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingMat && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl w-full max-w-md p-8 space-y-4 animate-slideUp">
            <h3 className="text-2xl font-black text-black mb-6">تعديل الملزمة</h3>
            <input 
              type="text" 
              value={editingMat.title} 
              onChange={e => setEditingMat({...editingMat, title: e.target.value})} 
              placeholder="عنوان الملزمة"
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 font-black outline-none"
            />
            <input 
              type="text" 
              value={editingMat.url} 
              onChange={e => setEditingMat({...editingMat, url: e.target.value})} 
              placeholder="رابط التليجرام"
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 font-black outline-none"
            />
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-purple-600 text-white font-black py-4 rounded-2xl">حفظ التغييرات</button>
              <button type="button" onClick={() => setEditingMat(null)} className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-2xl">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MaterialList;
