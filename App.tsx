
import React, { useState, useEffect, useCallback } from 'react';
import { SectionType, Subject, User, Comment, ParticipationData, InteractionData, Material } from './types';
import { HISTOLOGY_QUESTIONS, MOCK_MATERIALS } from './constants';
import Header from './components/Header';
import UserAuth from './components/UserAuth';
import MaterialList from './components/MaterialList';
import QuizView from './components/QuizView';
import Leaderboard from './components/Leaderboard';
import ProfileSettings from './components/ProfileSettings';

// معرف فريد لقاعدة البيانات لضمان عدم التداخل
const PROJECT_ID = 'muaamar_hani_edu_v5_final';
const SYNC_API_URL = `https://kvdb.io/66n6uX9p8yG5mN6uX9p8yG/${PROJECT_ID}`;

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.MATERIALS);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [participation, setParticipation] = useState<ParticipationData>({});
  const [likes, setLikes] = useState<InteractionData>({});
  const [dislikes, setDislikes] = useState<InteractionData>({});
  const [totalViews, setTotalViews] = useState(0);

  // جلب البيانات من السحاب
  const fetchGlobalData = useCallback(async (isInitial = false) => {
    try {
      if (!isInitial) setIsSyncing(true);
      const response = await fetch(SYNC_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setParticipation(data.participation || {});
          setLikes(data.likes || {});
          setDislikes(data.dislikes || {});
          setTotalViews(data.totalViews || 0);
          setComments(data.comments || []);
          if (data.materials) setMaterials(data.materials);
          
          const rawUsers = data.users || [];
          setUsers(rawUsers);
          
          // تحديث بيانات المستخدم الحالي إذا تغيرت في السيرفر
          const savedUser = localStorage.getItem('mm_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            const serverUser = rawUsers.find((u: User) => u.id === parsed.id);
            if (serverUser) {
              setCurrentUser(serverUser);
              localStorage.setItem('mm_user', JSON.stringify(serverUser));
            }
          }
        }
      }
    } catch (e) {
      console.warn("Cloud offline or connection issue");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // دفع البيانات للسحاب
  const pushUpdate = async (overrides = {}) => {
    try {
      const currentState = {
        participation,
        likes,
        dislikes,
        comments,
        users,
        materials,
        totalViews,
        ...overrides
      };
      await fetch(SYNC_API_URL, {
        method: 'POST',
        body: JSON.stringify(currentState),
      });
    } catch (e) {
      console.error("Failed to push update to cloud");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('mm_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setShowAuth(true);
    }

    const init = async () => {
      await fetchGlobalData(true);
      // زيادة عدد المشاهدات عند كل دخول جديد
      setTotalViews(prev => {
        const newVal = prev + 1;
        pushUpdate({ totalViews: newVal });
        return newVal;
      });
    };
    init();

    // مزامنة تلقائية كل 15 ثانية
    const timer = setInterval(() => fetchGlobalData(), 15000);
    return () => clearInterval(timer);
  }, [fetchGlobalData]);

  const handleDevAccess = (pass: string) => {
    if (pass === 'Muaamar&yosr') {
      if (currentUser) {
        const adminUser = { ...currentUser, role: 'admin' as const };
        setCurrentUser(adminUser);
        localStorage.setItem('mm_user', JSON.stringify(adminUser));
        
        const updatedUsers = users.map(u => u.id === adminUser.id ? adminUser : u);
        if (!users.find(u => u.id === adminUser.id)) updatedUsers.push(adminUser);
        
        setUsers(updatedUsers);
        pushUpdate({ users: updatedUsers });
        alert("تم التوثيق بنجاح! أنت الآن مطور رسمي 🛡️");
        return true;
      }
    } else {
      alert("رمز التوثيق غير صحيح ❌");
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('mm_user');
    setCurrentUser(null);
    setShowAuth(true);
    setShowProfile(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
    localStorage.setItem('mm_user', JSON.stringify(user));
    
    const exists = users.find(u => u.id === user.id);
    const updated = exists 
      ? users.map(u => u.id === user.id ? user : u)
      : [...users, user];
    
    setUsers(updated);
    pushUpdate({ users: updated });
  };

  const handleAddComment = (text: string, targetId: string) => {
    if (!currentUser) return;
    const newComment: Comment = { 
      id: Math.random().toString(36).substr(2, 9), 
      userId: currentUser.id, 
      userName: currentUser.name, 
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      text: text, 
      timestamp: Date.now(), 
      targetId: targetId 
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    pushUpdate({ comments: updated });
  };

  const handleRecordAnswer = (isCorrect: boolean) => {
    if (!currentUser || currentUser.isGuest) return;
    const oldLevel = Math.floor(currentUser.points / 100) + 1;
    const newPoints = currentUser.points + (isCorrect ? 5 : 0); // مكافأة أكبر للإجابة الصحيحة
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    const updatedUser = { 
      ...currentUser, 
      points: newPoints,
      totalAnswered: currentUser.totalAnswered + 1,
      correctCount: isCorrect ? currentUser.correctCount + 1 : currentUser.correctCount,
      wrongCount: !isCorrect ? currentUser.wrongCount + 1 : currentUser.wrongCount
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('mm_user', JSON.stringify(updatedUser));
    
    if (newLevel > oldLevel) {
      setShowLevelUp(newLevel);
      setTimeout(() => setShowLevelUp(null), 4000);
    }
    
    const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updated);
    pushUpdate({ users: updated });
  };

  const handleUpdateMaterial = (mat: Material) => {
    const updated = materials.map(m => m.id === mat.id ? mat : m);
    setMaterials(updated);
    pushUpdate({ materials: updated });
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الملزمة؟")) {
      const updated = materials.filter(m => m.id !== id);
      setMaterials(updated);
      pushUpdate({ materials: updated });
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Header 
        onNavigate={setActiveSection} 
        activeSection={activeSection} 
        onShowLeaderboard={() => setShowLeaderboard(!showLeaderboard)}
        onShowProfile={() => setShowProfile(true)}
        onLogout={handleLogout}
        user={currentUser}
        stats={{ totalRegistered: users.length, totalViews }}
        isSyncing={isSyncing}
        onDevAccess={handleDevAccess}
      />

      <div className="max-w-6xl mx-auto mt-6 px-4 sticky top-[72px] z-30">
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-lg p-1.5 rounded-2xl shadow-xl border border-white/50 flex gap-1 w-full max-w-2xl">
            {[
              { id: SectionType.MATERIALS, label: 'الملازم', icon: '📕' },
              { id: SectionType.PRACTICE_EXAMS, label: 'الاختبارات', icon: '📝' },
              { id: SectionType.INTERACTIVE_QUIZ, label: 'التفاعلي', icon: '⚡' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setActiveSubject(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black transition-all ${
                  activeSection === item.id 
                  ? 'bg-purple-900 text-white shadow-lg scale-105' 
                  : 'text-gray-500 hover:bg-purple-50'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-8 px-4">
        {activeSection === SectionType.INTERACTIVE_QUIZ ? (
          !activeSubject ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {Object.values(Subject).map((subj) => (
                <button
                  key={subj}
                  onClick={() => setActiveSubject(subj)}
                  className="bg-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center group border-4 border-transparent hover:border-purple-200"
                >
                  <div className="text-7xl mb-6 group-hover:animate-float">
                    {subj === Subject.HISTOLOGY ? '🧬' : subj === Subject.HUMAN_RIGHTS ? '⚖️' : '🧪'}
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">{subj}</h3>
                  <div className="mt-4 bg-purple-50 text-purple-600 py-2 rounded-full font-black text-sm">ابدأ الآن</div>
                </button>
              ))}
            </div>
          ) : (
            <QuizView 
              subject={activeSubject} 
              questions={HISTOLOGY_QUESTIONS.filter(q => q.subject === activeSubject)}
              onRecordAnswer={handleRecordAnswer}
              onBack={() => setActiveSubject(null)}
              currentUser={currentUser}
              comments={comments}
              onAddComment={handleAddComment}
              participation={participation}
              onStartQuiz={(lec) => {
                const updated = { ...participation, [`quiz_${activeSubject}_${lec}`]: (participation[`quiz_${activeSubject}_${lec}`] || 0) + 1 };
                setParticipation(updated);
                pushUpdate({ participation: updated });
              }}
            />
          )
        ) : (
          <MaterialList 
            type={activeSection}
            materials={materials}
            activeSubject={activeSubject}
            onSubjectSelect={setActiveSubject}
            comments={comments}
            onAddComment={handleAddComment}
            currentUser={currentUser}
            participation={participation}
            onOpenMaterial={(id) => {
                const updated = { ...participation, [`mat_${id}`]: (participation[`mat_${id}`] || 0) + 1 };
                setParticipation(updated);
                pushUpdate({ participation: updated });
            }}
            likes={likes}
            dislikes={dislikes}
            onLike={(id) => {
                if (!currentUser) return;
                const newLikes = { ...likes };
                const list = likes[id] || [];
                newLikes[id] = list.includes(currentUser.id) ? list.filter(i => i !== currentUser.id) : [...list, currentUser.id];
                setLikes(newLikes);
                pushUpdate({ likes: newLikes });
            }}
            onDislike={(id) => {
                if (!currentUser) return;
                const newDis = { ...dislikes };
                const list = dislikes[id] || [];
                newDis[id] = list.includes(currentUser.id) ? list.filter(i => i !== currentUser.id) : [...list, currentUser.id];
                setDislikes(newDis);
                pushUpdate({ dislikes: newDis });
            }}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
          />
        )}
      </main>

      {showAuth && <UserAuth onLogin={handleLogin} users={users} />}
      
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-white rounded-[3rem] w-full max-w-md max-h-[85vh] overflow-hidden animate-slideUp shadow-2xl" onClick={e => e.stopPropagation()}>
             <Leaderboard users={users} />
          </div>
        </div>
      )}

      {showProfile && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
          <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl" onClick={e => e.stopPropagation()}>
             <ProfileSettings 
               user={currentUser} 
               allUsers={users}
               onUpdate={(u) => { 
                 const updated = users.map(us => us.id === u.id ? u : us);
                 setCurrentUser(u);
                 setUsers(updated);
                 pushUpdate({ users: updated });
                 localStorage.setItem('mm_user', JSON.stringify(u));
               }} 
               onClose={() => setShowProfile(false)} 
               onDeleteAccount={(confirm) => {
                 if (confirm === "تأكيد") {
                   const updated = users.filter(u => u.id !== currentUser.id);
                   setUsers(updated);
                   pushUpdate({ users: updated });
                   handleLogout();
                 }
               }}
               onKickUser={(id) => {
                 const updated = users.filter(u => u.id !== id);
                 setUsers(updated);
                 pushUpdate({ users: updated });
               }}
             />
          </div>
        </div>
      )}

      {showLevelUp && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
           <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-10 py-5 rounded-full shadow-2xl border-4 border-white font-black text-2xl flex items-center gap-4">
              <span>🌟</span> مستوى جديد: {showLevelUp} <span>🚀</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
