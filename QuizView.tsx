
import React, { useState, useEffect } from 'react';
import { Subject, Question, User, Comment, ParticipationData } from '../types';
import CommentSection from './CommentSection';

interface QuizViewProps {
  subject: Subject;
  questions: Question[];
  onRecordAnswer: (isCorrect: boolean) => void;
  onBack: () => void;
  currentUser: User | null;
  comments: Comment[];
  onAddComment: (t: string, id: string) => void;
  participation: ParticipationData;
  onStartQuiz: (lectureId: string | number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ subject, questions, onRecordAnswer, onBack, currentUser, comments, onAddComment, participation, onStartQuiz }) => {
  const [selectedLecture, setSelectedLecture] = useState<number | 'RANDOM' | null>(null);
  const [quizQueue, setQuizQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0); 
  const [showFeedback, setShowFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [tempSelection, setTempSelection] = useState<string | null>(null);
  const [showNavigator, setShowNavigator] = useState(false);
  
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'RANDOM' | 'MISTAKES' | 'TRANSLATION' | null }>({
    isOpen: false,
    type: null
  });

  const [correctHistory, setCorrectHistory] = useState<Set<string>>(new Set());
  const [wrongHistory, setWrongHistory] = useState<Set<string>>(new Set());

  const startQuiz = (lecture: number | 'RANDOM') => {
    let filtered = questions;
    if (lecture !== 'RANDOM') {
      filtered = questions.filter(q => q.lecture === lecture);
    } else {
      filtered = [...questions].sort(() => Math.random() - 0.5);
    }
    
    if (filtered.length === 0) return;

    onStartQuiz(lecture); // تتبع المشاركة
    setQuizQueue(filtered);
    setOriginalTotal(filtered.length); 
    setSelectedLecture(lecture);
    setCurrentIdx(0);
    setShowFeedback(null);
    setTempSelection(null);
    setSessionCorrect(0);
    setSessionWrong(0);
  };

  const handleRandomizeClick = () => {
    setConfirmDialog({ isOpen: true, type: 'RANDOM' });
  };

  const handleMistakesClick = () => {
    setConfirmDialog({ isOpen: true, type: 'MISTAKES' });
  };

  const handleTranslationClick = () => {
    setConfirmDialog({ isOpen: true, type: 'TRANSLATION' });
  };

  const executeAction = (payload?: any) => {
    const actionType = confirmDialog.type;
    setConfirmDialog({ isOpen: false, type: null });

    if (actionType === 'TRANSLATION') {
      if (payload !== undefined) {
        setIsTranslationEnabled(payload);
      }
      return;
    }

    let baseQuestions = selectedLecture === 'RANDOM' 
      ? questions 
      : questions.filter(q => q.lecture === selectedLecture);

    if (actionType === 'RANDOM') {
      const remaining = baseQuestions.filter(q => !correctHistory.has(q.id));
      if (remaining.length === 0) {
        alert("لقد حللت جميع أسئلة هذا القسم بشكل صحيح! أحسنت.");
        return;
      }
      const shuffled = [...remaining].sort(() => Math.random() - 0.5);
      setQuizQueue(shuffled);
      setOriginalTotal(shuffled.length);
      setCurrentIdx(0);
      setTempSelection(null);
      setShowFeedback(null);
    } else if (actionType === 'MISTAKES') {
      const mistakes = baseQuestions.filter(q => wrongHistory.has(q.id));
      if (mistakes.length === 0) {
        alert("لا توجد أخطاء مسجلة حالياً في هذا القسم.");
        return;
      }
      setQuizQueue(mistakes);
      setOriginalTotal(mistakes.length);
      setCurrentIdx(0);
      setTempSelection(null);
      setShowFeedback(null);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (index >= quizQueue.length) return;
    setCurrentIdx(index);
    setShowFeedback(null);
    setTempSelection(null);
    setShowNavigator(false);
  };

  const confirmAnswer = () => {
    if (!tempSelection) return;

    const currentQ = quizQueue[currentIdx];
    const chosenLetter = tempSelection.trim().charAt(0).toUpperCase();
    const isCorrect = chosenLetter === currentQ.correctAnswer.toUpperCase();

    if (isCorrect) {
      setShowFeedback('CORRECT');
      onRecordAnswer(true);
      setSessionCorrect(prev => prev + 1);
      
      setCorrectHistory(prev => new Set(prev).add(currentQ.id));
      setWrongHistory(prev => {
        const next = new Set(prev);
        next.delete(currentQ.id);
        return next;
      });

      setTimeout(() => {
        proceedToNext();
      }, 800);
    } else {
      setShowFeedback('WRONG');
      onRecordAnswer(false);
      setSessionWrong(prev => prev + 1);
      
      setWrongHistory(prev => new Set(prev).add(currentQ.id));
      
      const updatedQueue = [...quizQueue];
      updatedQueue.push(currentQ);
      setQuizQueue(updatedQueue);
      
      setTimeout(() => {
        proceedToNext();
      }, 1800);
    }
  };

  const proceedToNext = () => {
    setShowFeedback(null);
    setTempSelection(null);
    if (currentIdx + 1 < quizQueue.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      alert("أحسنت! أكملت القائمة الحالية.");
      setSelectedLecture(null);
    }
  };

  const formatText = (text: string) => {
    const cleanStr = text.replace(/^(س|Q)\d+\/\s*/i, '');
    const parts = cleanStr.split(/(\([^)]+\))/);
    return parts.map((part, i) => 
      part.startsWith('(') && part.endsWith(')') 
        ? <span key={i} className="text-red-600 font-black">{part}</span> 
        : <span key={i} className="text-black font-black">{part}</span>
    );
  };

  const parseOption = (opt: string) => {
    const match = opt.match(/^([A-D]\.)\s*(.*)$/);
    if (match) {
      return { letter: match[1], content: match[2] };
    }
    return { letter: '', content: opt };
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-purple-100 animate-fadeIn">
        <button onClick={onBack} className="text-purple-600 font-black mb-8 hover:underline block mx-auto">← العودة</button>
        <span className="text-6xl block mb-4">📂</span>
        <h2 className="text-2xl font-black text-gray-400">لا توجد أسئلة متوفرة حالياً لهذا القسم</h2>
      </div>
    );
  }

  if (!selectedLecture) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 animate-fadeIn">
        <button onClick={onBack} className="text-purple-600 font-black mb-6 hover:underline flex items-center gap-2">
          <span>←</span> القائمة الرئيسية
        </button>
        <h2 className="text-3xl font-black text-purple-900 mb-6 flex items-center gap-3">
           <span>📝</span> اختبار {subject}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(num => {
            const partCount = participation[`quiz_${subject}_${num}`] || 0;
            return (
              <button key={num} onClick={() => startQuiz(num)} className="bg-purple-50 hover:bg-purple-100 text-purple-900 py-6 rounded-2xl border-2 border-transparent hover:border-purple-300 font-black transition-all relative group overflow-hidden">
                الموضوع {num}
                <span className="block text-xs font-bold opacity-40 mt-1">({questions.filter(q => q.lecture === num).length} سؤال)</span>
                {/* عداد المشاركة */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full text-[9px] font-black text-purple-600 border border-purple-100">
                   <span>👤</span>
                   {partCount}
                </div>
              </button>
            );
          })}
          <button onClick={() => startQuiz('RANDOM')} className="col-span-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 rounded-2xl shadow-lg font-black transition-all mt-4 relative group">
            🔄 اختبار شامل وعشوائي (400 سؤال)
            <div className="absolute top-2 right-4 flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-[10px] font-black">
               <span>👤</span>
               {participation[`quiz_${subject}_RANDOM`] || 0}
            </div>
          </button>
        </div>
        <div className="mt-12 border-t pt-8">
            <CommentSection comments={comments.filter(c => c.targetId === `quiz_${subject}`)} onAddComment={(t) => onAddComment(t, `quiz_${subject}`)} currentUser={currentUser} />
        </div>
      </div>
    );
  }

  const currentQ = quizQueue[currentIdx];
  const displayIdx = currentIdx < originalTotal ? currentIdx + 1 : originalTotal;
  const isRepeating = currentIdx >= originalTotal;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp relative">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-500 relative">
        
        <div className="flex justify-between items-start mb-8 gap-4">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="bg-purple-900 text-white px-5 py-2 rounded-2xl text-lg font-black whitespace-nowrap shadow-sm border-b-4 border-purple-700">
              {displayIdx}/{originalTotal}
              {isRepeating && <span className="mr-2 opacity-80 text-[10px] bg-yellow-400 text-purple-900 px-2 py-0.5 rounded-full">(🔄)</span>}
            </span>
            <div className="flex gap-1.5">
              <div className="bg-green-100 text-green-700 w-8 h-8 rounded-lg border border-green-200 flex items-center justify-center shadow-sm">
                 <span className="text-xs font-black">{sessionCorrect}</span>
              </div>
              <div className="bg-red-100 text-red-700 w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center shadow-sm">
                 <span className="text-xs font-black">{sessionWrong}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
             <button 
               onClick={handleTranslationClick}
               className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl border-2 border-blue-100 transition-all flex items-center justify-center shadow-sm"
               title="إعدادات الترجمة"
             >
               <span className="text-xl">🌐</span>
             </button>

             <button 
               onClick={handleMistakesClick}
               className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border-2 border-red-100 transition-all flex items-center justify-center shadow-sm"
               title="مراجعة الأخطاء فقط"
             >
               <span className="text-xl">⚠️</span>
             </button>
             
             {selectedLecture !== 'RANDOM' && (
               <button 
                 onClick={handleRandomizeClick}
                 className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border-2 border-indigo-100 transition-all flex items-center justify-center shadow-sm"
                 title="ترتيب عشوائي للقسم"
               >
                 <span className="text-xl font-black">🔀</span>
               </button>
             )}

             <button 
               onClick={() => setShowNavigator(true)}
               className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl border-2 border-purple-100 transition-all flex items-center gap-2 shadow-sm"
               title="قائمة الأسئلة"
             >
               <span className="text-xl">➔</span>
             </button>
             <button onClick={() => setSelectedLecture(null)} className="text-gray-300 hover:text-red-500 font-bold transition-colors p-2" title="إغلاق">✕</button>
          </div>
        </div>

        <div className="space-y-6 mb-12 bg-gray-50/50 p-6 rounded-3xl border border-dashed border-purple-100">
          <div className="flex items-start gap-4" dir="ltr">
             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black shrink-0 text-lg shadow-sm">Q{displayIdx}</div>
             <h3 className="text-xl md:text-2xl leading-relaxed text-left text-black font-black pt-1">{formatText(currentQ.textEn)}</h3>
          </div>
          
          {isTranslationEnabled && (
            <>
              <div className="border-t border-purple-100 my-4"></div>
              <div className="flex items-start gap-4" dir="rtl">
                 <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-black shrink-0 text-lg shadow-sm">س{displayIdx}</div>
                 <h3 className="text-xl md:text-2xl font-black leading-relaxed text-right text-black pt-1">{formatText(currentQ.textAr)}</h3>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => {
            const { letter, content } = parseOption(opt);
            const isSelected = tempSelection === opt;
            const isCorrect = letter.charAt(0) === currentQ.correctAnswer;
            
            let btnClass = "w-full p-5 rounded-2xl border-2 font-black transition-all flex items-center gap-3 text-left ";
            
            if (showFeedback) {
               btnClass += isCorrect ? "border-green-500 bg-green-50 text-green-900" : isSelected ? "border-red-500 bg-red-50 text-red-900" : "border-gray-100 opacity-40 text-gray-400";
            } else {
               btnClass += isSelected ? "border-purple-600 bg-purple-50 shadow-md scale-[1.01]" : "border-gray-100 hover:border-purple-200 hover:bg-gray-50 text-black";
            }

            const parts = content.split(' - ');
            const mainText = parts[0];
            const translatedText = parts[1];

            return (
              <button key={i} onClick={() => !showFeedback && setTempSelection(opt)} disabled={!!showFeedback} className={btnClass} dir="ltr">
                <span className="text-red-600 text-xl shrink-0 font-black">{letter}</span>
                <div className="flex flex-row items-center flex-wrap gap-2">
                  <span className={`text-lg md:text-xl whitespace-nowrap ${showFeedback ? '' : 'text-black'}`}>{mainText}</span>
                  {isTranslationEnabled && translatedText && (
                    <>
                      <span className="text-gray-400 font-bold">-</span>
                      <span className={`text-lg md:text-xl font-bold ${showFeedback ? '' : 'text-purple-900'}`} dir="rtl">
                        {translatedText}
                      </span>
                    </>
                  )}
                </div>
                {showFeedback && isCorrect && <span className="ml-auto text-2xl">✅</span>}
              </button>
            );
          })}
        </div>

        {tempSelection && !showFeedback && (
          <div className="mt-10 flex gap-4 animate-fadeIn">
             <button onClick={confirmAnswer} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
                <span>✔️</span> تأكيد الإجابة
             </button>
             <button onClick={() => setTempSelection(null)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-black py-4 rounded-2xl border-2 border-red-100 transition-all">
                إلغاء وتغيير
             </button>
          </div>
        )}

        {showFeedback === 'WRONG' && (
          <div className="mt-8 p-5 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl font-black text-center animate-pulse">
             ⚠️ إجابة خاطئة! سنعيد هذا السؤال لك لاحقاً لتتعلمه 💡
          </div>
        )}
      </div>

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-purple-900/10 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white/40 backdrop-blur-xl w-full max-w-sm overflow-hidden shadow-2xl animate-slideUp border-4 border-purple-800 rounded-[2.5rem] relative">
            
            {confirmDialog.type === 'TRANSLATION' ? (
              <>
                <div className="p-8 text-center text-white bg-blue-700/90 border-b-4 border-purple-800">
                  <div className="text-6xl mb-4 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-pulse">🌐</div>
                  <h3 className="text-2xl font-black tracking-widest uppercase">إعدادات الترجمة</h3>
                </div>
                <div className="p-8 text-center">
                  <p className="text-purple-950 font-black leading-relaxed mb-10 text-lg">
                    هل ترغب في عرض الترجمة العربية للأسئلة والخيارات أم إخفائها للتركيز على اللغة الإنجليزية؟
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => executeAction(true)}
                      className="w-full py-4 rounded-2xl font-black text-white bg-blue-800 hover:bg-blue-950 shadow-xl transition-all text-lg border-2 border-purple-900"
                    >
                      عرض الترجمة
                    </button>
                    <button 
                      onClick={() => executeAction(false)}
                      className="w-full py-4 rounded-2xl font-black text-white bg-gray-800 hover:bg-gray-950 shadow-xl transition-all text-lg border-2 border-purple-900"
                    >
                      إيقاف الترجمة
                    </button>
                    <button 
                      onClick={() => setConfirmDialog({ isOpen: false, type: null })}
                      className="w-full py-4 rounded-2xl font-black bg-white/80 text-purple-900 hover:bg-white transition-all border-2 border-purple-200 mt-2"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`p-8 text-center text-white ${confirmDialog.type === 'RANDOM' ? 'bg-indigo-700/90' : 'bg-red-700/90'} border-b-4 border-purple-800`}>
                  <div className="text-6xl mb-4 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-pulse">{confirmDialog.type === 'RANDOM' ? '🔀' : '⚠️'}</div>
                  <h3 className="text-2xl font-black tracking-widest uppercase">{confirmDialog.type === 'RANDOM' ? 'الوضع العشوائي' : 'مراجعة الأخطاء'}</h3>
                </div>
                <div className="p-8 text-center">
                  <p className="text-purple-950 font-black leading-relaxed mb-10 text-lg">
                    {confirmDialog.type === 'RANDOM' 
                      ? "سيقوم النظام باختيار أسئلة عشوائية من هذا القسم مع استبعاد الأسئلة التي قمت بحلها بشكل صحيح سابقاً لتجنب التكرار."
                      : "سيعرض لك النظام فقط الأسئلة التي أخطأت فيها سابقاً في هذا القسم لتتمكن من مراجعتها والتعلم من أخطائك."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => executeAction()}
                      className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all text-lg border-2 border-purple-900 ${confirmDialog.type === 'RANDOM' ? 'bg-indigo-800 hover:bg-indigo-950' : 'bg-red-800 hover:bg-red-950'}`}
                    >
                      موافق، ابدأ الآن
                    </button>
                    <button 
                      onClick={() => setConfirmDialog({ isOpen: false, type: null })}
                      className="w-full py-4 rounded-2xl font-black bg-white/80 text-purple-900 hover:bg-white hover:text-purple-600 transition-all border-2 border-purple-200"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showNavigator && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fadeIn"
            onClick={() => setShowNavigator(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl animate-slideLeft transform flex flex-col" dir="rtl">
            <div className="p-6 bg-purple-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">انتقل إلى سؤال</h3>
              <button onClick={() => setShowNavigator(false)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {quizQueue.slice(0, originalTotal).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-12 flex items-center justify-center rounded-xl font-black transition-all border-2 ${
                      currentIdx === idx 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-110' 
                        : 'bg-white border-purple-50 text-purple-900 hover:bg-purple-50 hover:border-purple-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizView;
