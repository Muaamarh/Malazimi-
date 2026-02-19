
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface UserAuthProps {
  onLogin: (user: User) => void;
  users: User[];
}

const UserAuth: React.FC<UserAuthProps> = ({ onLogin, users }) => {
  const [view, setView] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT' | 'SETUP_AVATAR' | 'SETUP_BIO'>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState<string>('');
  const [showAge, setShowAge] = useState(true);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Image Setup State
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [finalAvatar, setFinalAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      onLogin(found);
    } else {
      setError('اسم المستخدم أو الرمز غير صحيح');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (users.find(u => u.username === username)) {
      setError('اسم المستخدم هذا موجود مسبقاً');
      return;
    }
    if (password.length < 4) {
      setError('الرمز السري قصير جداً');
      return;
    }
    setView('SETUP_AVATAR');
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setRawImage(readerEvent.target?.result as string);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFinalImage = () => {
    if (!rawImage || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
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
        let drawWidth, drawHeight;
        if (aspect > 1) {
          drawHeight = size * zoom;
          drawWidth = drawHeight * aspect;
        } else {
          drawWidth = size * zoom;
          drawHeight = drawWidth / aspect;
        }
        
        const x = (size - drawWidth) / 2;
        const y = (size - drawHeight) / 2;
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();
        
        setFinalAvatar(canvas.toDataURL('image/jpeg', 0.8));
      }
    };
  };

  useEffect(() => {
    if (rawImage) generateFinalImage();
  }, [rawImage, zoom]);

  const handleCompleteSetup = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username,
      password,
      bio,
      age: age ? parseInt(age) : undefined,
      showAge: age ? showAge : false,
      avatar: finalAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      points: 0, 
      totalAnswered: 0, 
      correctCount: 0, 
      wrongCount: 0,
      isGuest: false,
    };
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-slideUp border-4 border-white/20">
        
        {(view === 'LOGIN' || view === 'SIGNUP') && (
          <div className="flex border-b border-gray-100">
            <button onClick={() => setView('LOGIN')} className={`flex-1 py-5 font-black text-sm transition-all ${view === 'LOGIN' ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50' : 'text-gray-400'}`}>تسجيل الدخول</button>
            <button onClick={() => setView('SIGNUP')} className={`flex-1 py-5 font-black text-sm transition-all ${view === 'SIGNUP' ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50' : 'text-gray-400'}`}>إنشاء حساب</button>
          </div>
        )}

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black mb-1">
              {view === 'LOGIN' && 'مرحباً بك'}
              {view === 'SIGNUP' && 'حساب جديد'}
              {view === 'SETUP_AVATAR' && 'صورتك الشخصية'}
              {view === 'SETUP_BIO' && 'بياناتك الشخصية'}
              {view === 'FORGOT' && 'استعادة'}
            </h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">Edu-Muaamar Hani</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-2xl text-center font-black text-xs border border-red-100 animate-shake">{error}</div>}

          {view === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="text" placeholder="اسم المستخدم" required value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black" />
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="الرمز السري" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">{showPass ? '🙈' : '👁️'}</button>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-purple-700 transition-all active:scale-95">دخول</button>
            </form>
          )}

          {view === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="الاسم الكامل (مثال: معمر هاني أحمد)" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black" 
              />
              <input 
                type="text" 
                placeholder="اسم المستخدم (مثال: MuaamarHani)" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black" 
              />
              <input 
                type="password" 
                placeholder="الرمز السري (مثال: MuaamarHani_)" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black" 
              />
              <button type="submit" className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-purple-700 transition-all active:scale-95">متابعة ➔</button>
            </form>
          )}

          {view === 'SETUP_AVATAR' && (
            <div className="space-y-6 animate-fadeIn text-center">
              <input type="file" ref={fileInputRef} onChange={onFileSelect} accept="image/*" className="hidden" />
              
              {!rawImage ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-purple-300 hover:bg-purple-50 transition-all text-gray-400 group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition-transform">🖼️</span>
                    <span className="font-black text-sm">اختر صورة من جهازك</span>
                  </button>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">أو يمكنك المتابعة بدون صورة</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-8 border-purple-50 shadow-2xl bg-gray-50">
                    <canvas ref={previewCanvasRef} className="w-full h-full" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-tighter">تحكم في التكبير / الأبعاد</label>
                    <input 
                      type="range" min="1" max="4" step="0.01" value={zoom} 
                      onChange={e => setZoom(parseFloat(e.target.value))} 
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="text-purple-600 font-black text-[10px] hover:underline uppercase">تغيير الصورة</button>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setView('SIGNUP')} className="flex-1 bg-gray-100 text-gray-600 font-black py-4 rounded-2xl">السابق</button>
                 <button 
                  onClick={() => setView('SETUP_BIO')} 
                  className={`flex-[2] text-white font-black py-4 rounded-2xl shadow-xl transition-all bg-purple-600 hover:bg-purple-700 active:scale-95 flex items-center justify-center gap-2`}
                 >
                   {finalAvatar ? 'حفظ ومتابعة' : 'تخطي ومتابعة'}
                   <span className="text-lg">➔</span>
                 </button>
              </div>
            </div>
          )}

          {view === 'SETUP_BIO' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="العمر" 
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black"
                />
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <input 
                    type="checkbox" 
                    id="showAge" 
                    checked={showAge} 
                    onChange={e => setShowAge(e.target.checked)} 
                    className="w-5 h-5 accent-purple-600"
                  />
                  <label htmlFor="showAge" className="text-[10px] font-black text-gray-500 cursor-pointer">إظهار العمر للعامة</label>
                </div>
              </div>
              <textarea 
                placeholder="اكتب نبذة قصيرة عنك لتظهر للآخرين..." 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none font-black text-black min-h-[140px] resize-none focus:bg-white focus:ring-4 focus:ring-purple-50" 
              />
              <button onClick={handleCompleteSetup} className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-purple-700 transition-all active:scale-95">بدء رحلة التعلم 🚀</button>
              <button onClick={() => setView('SETUP_AVATAR')} className="w-full text-gray-400 font-black hover:text-purple-600 text-sm">السابق</button>
            </div>
          )}

          {(view === 'LOGIN' || view === 'SIGNUP') && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={() => onLogin({ id: 'guest', name: 'زائر', username: 'guest', points: 0, totalAnswered: 0, correctCount: 0, wrongCount: 0, isGuest: true })} className="w-full text-gray-400 font-black hover:text-purple-600 transition text-sm">التصفح كزائر</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
