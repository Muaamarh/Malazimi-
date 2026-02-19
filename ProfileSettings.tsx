
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface ProfileSettingsProps {
  user: User;
  allUsers: User[];
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
  onDeleteAccount: (confirmation: string) => void;
  onKickUser: (userId: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, allUsers, onUpdate, onClose, onDeleteAccount, onKickUser }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [age, setAge] = useState<string>(user.age?.toString() || '');
  const [showAge, setShowAge] = useState(user.showAge ?? true);
  const [newPass, setNewPass] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ADMIN'>('PROFILE');

  // Image states
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isAdmin = user.role === 'admin';

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawImage(ev.target?.result as string);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (rawImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = rawImage;
      img.onload = () => {
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
          ctx.clearRect(0, 0, size, size);
          ctx.save();
          ctx.beginPath();
          ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
          ctx.clip();
          const aspect = img.width / img.height;
          let dw, dh;
          if (aspect > 1) { dh = size * zoom; dw = dh * aspect; }
          else { dw = size * zoom; dh = dw / aspect; }
          ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
          ctx.restore();
          setAvatar(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
    }
  }, [rawImage, zoom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ 
      ...user, 
      name, 
      bio, 
      age: age ? parseInt(age) : undefined, 
      showAge, 
      avatar, 
      password: newPass || user.password 
    });
    onClose();
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {isAdmin && (
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button onClick={() => setActiveTab('PROFILE')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'PROFILE' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>بروفايلي</button>
          <button onClick={() => setActiveTab('ADMIN')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'ADMIN' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}>لوحة المطور</button>
        </div>
      )}

      {activeTab === 'ADMIN' ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-black">إدارة الأعضاء</h3>
            <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black border border-red-100">إجمالي المشتركين: {allUsers.length}</span>
          </div>
          <div className="space-y-3">
            {allUsers.map(u => {
              const uIsDev = u.role === 'admin';
              return (
                <div key={u.id} className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 ${uIsDev ? 'border-red-500 shadow-lg' : 'border-gray-100'}`}>
                      <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-black text-sm ${uIsDev ? 'text-red-600' : 'text-black'}`}>{u.name}</h4>
                        {uIsDev && <span className="text-blue-500 text-xs">🛡️</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 font-black">@{u.username} • {u.points} نقطة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-left hidden sm:block">
                      <p className="text-[8px] font-black text-gray-400">الإجابات الصحيحة</p>
                      <p className="text-xs font-black text-green-600">{u.correctCount}</p>
                    </div>
                    {u.id !== user.id && (
                      <button 
                        onClick={() => onKickUser(u.id)}
                        className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-black"
                      >
                        طرد 🚫
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {!confirmDelete ? (
            <>
              <div className="text-center relative">
                <div className="relative inline-block group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <div className={`w-28 h-28 rounded-full border-4 ${isAdmin ? 'border-red-600 shadow-red-200' : 'border-purple-900 shadow-purple-200'} overflow-hidden mx-auto mb-4 shadow-2xl bg-white transition-transform active:scale-95`}>
                      <img src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-black uppercase">تغيير الصورة</span>
                   </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={onFileSelect} accept="image/*" className="hidden" />
                
                {rawImage && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
                     <canvas ref={canvasRef} className="hidden" />
                     <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tighter">ضبط أبعاد الصورة</label>
                     <input type="range" min="1" max="4" step="0.01" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className={`w-full h-1.5 ${isAdmin ? 'accent-red-600' : 'accent-purple-600'}`} />
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mt-4">
                  <h2 className={`text-3xl font-black ${isAdmin ? 'text-red-600' : 'text-black'}`}>{user.name}</h2>
                  {isAdmin && <span className="text-blue-500 text-3xl">🛡️</span>}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <p className={`${isAdmin ? 'text-red-400' : 'text-purple-600'} font-black text-xs`}>@{user.username}</p>
                  {user.showAge && user.age && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-black border border-gray-200">
                      {user.age} عاماً
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">الاسم الكامل</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black focus:bg-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">العمر</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black focus:bg-white transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">الخصوصية</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 flex-1">
                      <input type="checkbox" id="showAgeEdit" checked={showAge} onChange={e => setShowAge(e.target.checked)} className={`w-5 h-5 ${isAdmin ? 'accent-red-600' : 'accent-purple-600'}`} />
                      <label htmlFor="showAgeEdit" className="text-[10px] font-black text-gray-500 cursor-pointer">إظهار العمر</label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">نبذة عنك</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black resize-none h-24" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">تغيير كلمة المرور</label>
                  <input type="password" placeholder="اتركه فارغاً للحفاظ على الرمز الحالي" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black focus:bg-white transition-all" />
                </div>
                <div className="pt-6 space-y-3">
                   <button type="submit" className={`w-full ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-black py-4 rounded-2xl shadow-xl transition-all`}>تحديث البيانات</button>
                   <button type="button" onClick={onClose} className="w-full text-gray-400 font-black text-sm py-2">إلغاء</button>
                   <button 
                     type="button" 
                     onClick={() => setConfirmDelete(true)} 
                     className="w-full text-red-500 font-black text-xs py-2 opacity-50 hover:opacity-100 transition-opacity mt-4"
                   >
                     حذف الحساب نهائياً
                   </button>
                </div>
              </form>
            </>
          ) : (
            <div className="animate-slideUp space-y-6 py-6 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-black text-red-600">تنبيه هام جداً</h2>
              <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
                 <p className="text-gray-700 font-bold leading-relaxed mb-4">
                   سيتم وضع حسابك في قائمة الحذف وسيتم مسح البيانات نهائياً بعد 30 يوماً.
                 </p>
                 <p className="text-purple-600 font-black text-xs uppercase mb-6">
                   يمكنك إلغاء العملية ببساطة عن طريق تسجيل الدخول مرة أخرى قبل انتهاء هذه المدة.
                 </p>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">لتأكيد الطلب، يرجى كتابة "تأكيد" أدناه:</p>
                    <input 
                      type="text" 
                      value={deleteInput} 
                      onChange={e => setDeleteInput(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-white border-2 border-red-100 outline-none font-black text-center text-black focus:border-red-500 transition-all"
                      placeholder="اكتب هنا..."
                    />
                 </div>
              </div>
              <div className="pt-4 space-y-3">
                 <button 
                   onClick={() => onDeleteAccount(deleteInput)}
                   disabled={deleteInput !== 'تأكيد'}
                   className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all ${deleteInput === 'تأكيد' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300'}`}
                 >
                   تأكيد جدولة الحذف ➔
                 </button>
                 <button 
                   onClick={() => { setConfirmDelete(false); setDeleteInput(''); }}
                   className="w-full text-gray-400 font-black text-sm py-2"
                 >
                   تراجع عن الحذف
                 </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
