
import React from 'react';
import { User } from '../types';

interface LeaderboardProps {
  users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl rotate-3">👑</div>
        <h2 className="text-3xl font-black text-black">لوحة الشرف</h2>
        <p className="text-gray-400 font-bold text-xs mt-1">المراكز الأولى في الاختبارات</p>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {sortedUsers.length > 0 ? sortedUsers.map((u, i) => {
          const isDev = u.role === 'admin';
          return (
            <div 
              key={u.id} 
              className={`flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all hover:scale-[1.02] ${
                i === 0 ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 
                i === 1 ? 'bg-gray-50 border-gray-200 shadow-sm' : 
                i === 2 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-white border-gray-50'
              } ${isDev ? 'ring-2 ring-red-100' : ''}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center font-black rounded-xl shrink-0 ${
                i === 0 ? 'bg-yellow-400 text-white' : 
                i === 1 ? 'bg-gray-400 text-white' : 
                i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <div className={`w-11 h-11 rounded-full overflow-hidden border-2 shadow-md bg-white shrink-0 ${isDev ? 'border-red-500' : 'border-white'}`}>
                <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`font-black leading-none truncate ${isDev ? 'text-red-600' : 'text-black'}`}>
                    {u.name}
                  </p>
                  {isDev && <span className="text-blue-500 text-xs">🛡️</span>}
                </div>
                <p className={`text-[9px] font-black mt-1 uppercase ${isDev ? 'text-red-400' : 'text-purple-600'}`}>@{u.username}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-black">{u.points}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Pts</p>
              </div>
            </div>
          );
        }) : (
          <p className="text-center text-gray-400 font-bold py-8">لا يوجد طلاب متصدرين حالياً</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
