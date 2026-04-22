import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { ChevronLeft, ArrowDownUp } from 'lucide-react';

export default function QuizMode({ listId, onNavigate }: { listId: string, onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find(l => l.id === listId);
  const words = list?.words || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  if (words.length < 4) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
         <p className="text-gray-500 font-medium mb-6">Test modu için listede en az 4 kelime bulunmalıdır.</p>
         <button onClick={() => onNavigate({ type: 'dashboard' })} className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium transition-colors hover:bg-blue-600">Geri Dön</button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const getQuestionText = (w: any) => studyDirection === 'TR_TO_DE' ? (w.translationTr || w.translationEn || w.translation || '') : w.term;
  const getAnswerText = (w: any) => studyDirection === 'TR_TO_DE' ? w.term : (w.translationTr || w.translationEn || w.translation || '');

  const options = useMemo(() => {
    const wrongOptions = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => getAnswerText(w));
    
    return [getAnswerText(currentWord), ...wrongOptions].sort(() => 0.5 - Math.random());
  }, [currentIndex, words, currentWord, studyDirection]);

  const handleSelect = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    
    const correctTranslation = getAnswerText(currentWord);
    if (option === correctTranslation) recordSuccess(currentWord.id);
    else recordFailure(currentWord.id);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
      else { alert("Test Tamamlandı!"); onNavigate({ type: 'dashboard' }); }
    }, 1200);
  };

  const progress = ((currentIndex + (selectedAnswer ? 1 : 0)) / words.length) * 100;
  const correctOption = getAnswerText(currentWord);

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
              {studyDirection === 'TR_TO_DE' ? 'TR ➔ DE' : 'DE ➔ TR'}
            </span>
          </button>
        </div>
        <div className="w-1/3 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs font-semibold text-gray-400 tracking-widest">{currentIndex + 1} / {words.length}</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-transparent mb-12 min-h-[140px] flex flex-col items-center justify-center text-center">
           <span className="text-gray-400 font-medium text-sm mb-4 border border-gray-200 px-3 py-1 rounded-full">{studyDirection === 'TR_TO_DE' ? 'Almanca karşılığı nedir?' : 'Türkçe karşılığı nedir?'}</span>
           <h2 className="text-5xl font-semibold text-gray-900 tracking-tight">
             {studyDirection === 'DE_TO_TR' && currentWord.article && <span className="text-gray-400 font-normal italic mr-3">{currentWord.article}</span>}
             {getQuestionText(currentWord)}
           </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto mb-12">
          {options.map((option, i) => {
            let btnClass = "bg-white text-gray-800 border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-gray-300 hover:bg-gray-50";
            if (selectedAnswer) {
              if (option === correctOption) btnClass = "bg-green-500 text-white border-green-500 shadow-md";
              else if (option === selectedAnswer) btnClass = "bg-red-500 text-white border-red-500 shadow-md";
              else btnClass = "bg-white text-gray-300 border-gray-100 opacity-40 shadow-none";
            }
            return (
              <button key={i} onClick={() => handleSelect(option)} disabled={selectedAnswer !== null}
                className={`w-full p-6 text-lg font-medium rounded-2xl transition-all text-center border ${btnClass}`}>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
