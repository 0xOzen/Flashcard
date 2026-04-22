import { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { ChevronLeft, CornerDownLeft, ArrowDownUp } from 'lucide-react';

export default function WriteMode({ listId, onNavigate }: { listId: string, onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find(l => l.id === listId);
  const words = list?.words || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
         <button onClick={() => onNavigate({ type: 'dashboard' })} className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium transition-colors hover:bg-blue-600">Geri Dön</button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  useEffect(() => { if (feedback === 'idle' && inputRef.current) inputRef.current.focus(); }, [feedback, currentIndex]);

  // If DE_TO_TR (normal): prompt is TR, typed answer is DE.
  // If TR_TO_DE: prompt is DE, typed answer is TR.
  // Wait, the prompt for write mode historically was TR. Let's make it follow the pattern:
  // getQuestionText = what appears on screen. getAnswerText = what you type.
  const getQuestionText = (w: any) => studyDirection === 'TR_TO_DE' ? w.term : (w.translationTr || w.translationEn || w.translation || '');
  const getAnswerText = (w: any) => studyDirection === 'TR_TO_DE' ? (w.translationTr || w.translationEn || w.translation || '') : w.term;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || feedback !== 'idle') return;

    const answerStr = getAnswerText(currentWord);
    const cleanAnswer = answerStr.toLowerCase().trim();
    const cleanInput = inputVal.toLowerCase().trim();
    
    // Allow article inclusion if it's German target
    let withArticle = cleanAnswer;
    if (studyDirection === 'DE_TO_TR' && currentWord.article) {
       withArticle = `${currentWord.article.toLowerCase()} ${cleanAnswer}`.trim();
    }

    if (cleanInput === cleanAnswer || cleanInput === withArticle) {
      setFeedback('correct'); recordSuccess(currentWord.id);
    } else {
      setFeedback('incorrect'); recordFailure(currentWord.id);
    }
    setTimeout(() => {
      setFeedback('idle'); setInputVal('');
      if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
      else { alert("Yazma Modu Tamamlandı!"); onNavigate({ type: 'dashboard' }); }
    }, 1500);
  };

  const progress = ((currentIndex + (feedback !== 'idle' ? 1 : 0)) / words.length) * 100;
  const currentTranslation = currentWord.translationTr || currentWord.translationEn || currentWord.translation || '';

  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={toggleStudyDirection}
            className="flex items-center justify-center p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
            title="Yönü Çevir"
          >
            <ArrowDownUp size={18} strokeWidth={2} />
            <span className="text-[10px] uppercase font-bold tracking-widest ml-1.5 hidden sm:inline">
              {studyDirection === 'TR_TO_DE' ? 'TR ➔ DE (Almanca Gör)' : 'DE ➔ TR (Türkçe Gör)'}
            </span>
          </button>
        </div>
        <div className="w-1/3 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs font-semibold text-gray-400 tracking-widest">{currentIndex + 1} / {words.length}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
           <span className="text-gray-400 font-medium text-sm mb-4 border border-gray-200 px-3 py-1 rounded-full block mx-auto w-fit">Karşılığını yazın</span>
           <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">
             {studyDirection === 'DE_TO_TR' && currentWord.article && <span className="text-gray-400 font-normal italic mr-3">{currentWord.article}</span>}
             {getQuestionText(currentWord)}
           </h2>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={feedback !== 'idle'}
            autoComplete="off"
            placeholder="Terim..."
            className={`w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-2xl font-medium text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all focus:outline-none ${
               feedback === 'idle' ? 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900' :
               feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'
            }`}
          />
          {feedback === 'idle' && (
             <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 transition-all">
               <CornerDownLeft size={18} />
             </button>
          )}

          {feedback === 'incorrect' && (
             <div className="absolute top-full mt-6 left-0 w-full text-center text-lg font-medium text-red-500 opacity-90 block">
                Doğrusu: <span className="font-semibold text-gray-900">{studyDirection === 'DE_TO_TR' ? (currentWord.article ? currentWord.article + ' ' : '') + currentWord.term : getAnswerText(currentWord)}</span>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}
