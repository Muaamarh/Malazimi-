
import React, { useState } from 'react';
import { SectionType, User } from '../types';

interface HeaderProps {
  onNavigate: (section: SectionType) => void;
  activeSection: SectionType;
  onShowLeaderboard: () => void;
  onShowProfile: () => void;
  onLogout: () => void;
  user: User | null;
  stats: {
    totalRegistered: number;
    totalViews: number;
  };
  isSyncing?: boolean;
  onDevAccess: (pass: string) => boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection, onShowLeaderboard, onShowProfile, onLogout, user, stats, isSyncing, onDevAccess }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDevInput, setShowDevInput] = useState(false);
  const [devCode, setDevCode] = useState('');

  const isDev = user?.role === 'admin';
  const level = user ? Math.floor(user.points / 100) + 1 : 1;

  const handleDevSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDevAccess(devCode)) {
      setShowDevInput(false);
      setDevCode('');
    }
  };

  return (
    <>
      <header className="bg-purple-900 text-white sticky top-0 z-40 shadow-2xl border-b border-purple-800 h-[72px] flex items-center px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full relative">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDrawer(true)}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all flex items-center gap-3"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            {isSyncing && (
              <div className="hidden sm:flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Syncing...</span>
              </div>
            )}
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">ملازمي معمر</h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onShowLeaderboard}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 w-12 h-12 rounded-2xl shadow-lg transition-transform hover:rotate-6 flex items-center justify-center"
            >
              <span className="text-2xl">🏆</span>
            </button>
          </div>
        </div>
      </header>

      {showDrawer && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fadeIn" onClick={() => setShowDrawer(false)}></div>
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl animate-slideRight transform flex flex-col overflow-hidden" dir="rtl">
            <div className={`p-8 text-white flex flex-col items-center relative transition-colors duration-500 ${isDev ? 'bg-gradient-to-br from-red-700 to-red-950' : 'bg-gradient-to-br from-purple-800 to-indigo-950'}`}>
              <button onClick={() => setShowDrawer(false)} className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors text-2xl">✕</button>
              
              <div className="relative mb-4 group cursor-pointer" onClick={onShowProfile}>
                <div className={`w-24 h-24 rounded-full overflow-hidden border-4 bg-white shadow-2xl transition-transform group-hover:scale-105 ${isDev ? 'dev-avatar-border' : 'border-purple-400'}`}>
                   <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-1 -left-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-xs font-black shadow-lg ${isDev ? 'bg-red-600' : 'bg-yellow-400'}`}>
                   {isDev ? '💎' : `L${level}`}
                </div>
              </div>

              <div className="text-center">
                <h3 className={`text-xl font-black flex items-center justify-center gap-2 ${isDev ? 'dev-name-red brightness-150' : 'text-white'}`}>
                  {user?.name}
                  {isDev && <span className="text-blue-400 dev-badge-animate">🛡️</span>}
                </h3>
                <p className="text-white/60 font-bold text-xs">@{user?.username}</p>
                {isDev && (
                  <span className="mt-2 inline-block bg-red-500/30 px-3 py-1 rounded-full text-[10px] font-black border border-red-500/50 uppercase">Developer</span>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">الإحصائيات العامة</p>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                      <p className="text-[9px] font-black text-purple-400 uppercase">الأعضاء</p>
                      <p className="text-xl font-black text-purple-900">{stats.totalRegistered}</p>
                   </div>
                   <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-center">
                      <p className="text-[9px] font-black text-indigo-400 uppercase">المشاهدات</p>
                      <p className="text-xl font-black text-indigo-900">{stats.totalViews}</p>
                   </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <button onClick={() => { onShowProfile(); setShowDrawer(false); }} className="w-full text-right flex items-center gap-4 p-4 rounded-2xl font-black text-gray-600 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                   <span className="text-xl">👤</span> إعدادات الحساب
                 </button>
                 <button onClick={() => { onShowLeaderboard(); setShowDrawer(false); }} className="w-full text-right flex items-center gap-4 p-4 rounded-2xl font-black text-gray-600 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                   <span className="text-xl">🏆</span> قائمة المتصدرين
                 </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 space-y-4">
               {!isDev && !showDevInput && (
                 <button onClick={() => setShowDevInput(true)} className="w-full py-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-[10px] border border-gray-200 border-dashed">
                   🛠️ وضع المطور
                 </button>
               )}

               {showDevInput && (
                 <form onSubmit={handleDevSubmit} className="space-y-2">
                    <input 
                      type="password" 
                      placeholder="كلمة السر للمطور..." 
                      className="w-full p-4 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 font-black text-center text-xs"
                      autoFocus
                      value={devCode}
                      onChange={e => setDevCode(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button type="submit" className="flex-1 bg-red-600 text-white font-black py-2 rounded-xl text-xs">تفعيل</button>
                       <button type="button" onClick={() => setShowDevInput(false)} className="flex-1 bg-gray-100 text-gray-400 font-black py-2 rounded-xl text-xs">إلغاء</button>
                    </div>
                 </form>
               )}

               <button onClick={() => { onLogout(); setShowDrawer(false); }} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-black text-red-600 bg-red-50 hover:bg-red-100 transition-all">
                  <span>🚪</span> تسجيل الخروج
               </button>
               <p className="text-center text-[9px] font-black text-gray-300">v5.0.0 - Muaamar Platform</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
