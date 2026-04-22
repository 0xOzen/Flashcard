import { useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import Flashcard from '../Flashcard';
import { ChevronLeft, Shuffle, Undo2, Check, X, ArrowDownUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FlashcardMode({ listId, onNavigate }: { listId: string, onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection } = useApp();
  const list = lists.find(l => l.id === listId);
  
  const [deck, setDeck] = useState(list?.words || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!list || deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
        <p className="text-lg font-medium text-gray-500 mb-6">Bu listede çalışılacak kelime yok.</p>
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium transition-colors hover:bg-blue-600">Geri Dön</button>
      </div>
    );
  }

  const handleNext = () => { if (currentIndex < deck.length - 1) setCurrentIndex(p => p + 1); };
  const handleKnown = () => { recordSuccess(deck[currentIndex].id); handleNext(); };
  const handleUnknown = () => { recordFailure(deck[currentIndex].id); handleNext(); };
  const shuffleDeck = () => { setDeck([...list.words].sort(() => Math.random() - 0.5)); setCurrentIndex(0); };
  const resetDeck = () => { setDeck(list.words); setCurrentIndex(0); };

  const progress = ((currentIndex + 1) / deck.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 font-sans text-gray-900 h-full w-full">
      <div className="w-full max-w-sm mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate({ type: 'dashboard' })}
              className="flex items-center text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={toggleStudyDirection}
              className="flex items-center justify-center p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              title="Yönü Çevir (Almanca-Türkçe / Türkçe-Almanca)"
            >
              <ArrowDownUp size={18} strokeWidth={2} />
              <span className="text-[10px] uppercase font-bold tracking-widest ml-1.5 hidden sm:inline">
                {studyDirection === 'TR_TO_DE' ? 'TR ➔ DE' : 'DE ➔ TR'}
              </span>
            </button>
          </div>
          <div className="text-xs font-semibold text-gray-400 tracking-widest">
            {currentIndex + 1} / {deck.length}
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
          <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={deck[currentIndex].id + currentIndex + (studyDirection || '')} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="w-full">
          <Flashcard card={deck[currentIndex]} studyDirection={studyDirection} />
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm mt-12 flex flex-col gap-6">
        <div className="flex justify-center items-center gap-6">
          <button onClick={handleUnknown} className="w-16 h-16 flex flex-col items-center justify-center bg-white hover:bg-gray-50 text-gray-400 hover:text-red-500 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all">
            <X size={24} strokeWidth={2} />
          </button>
          <button onClick={handleKnown} className="w-16 h-16 flex flex-col items-center justify-center bg-white hover:bg-gray-50 text-gray-400 hover:text-green-500 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all">
            <Check size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex justify-center gap-8 mt-4">
          <button onClick={shuffleDeck} className="text-gray-400 hover:text-gray-700 transition-colors tooltip relative">
            <Shuffle size={20} strokeWidth={1.5} />
          </button>
          <button onClick={resetDeck} className="text-gray-400 hover:text-gray-700 transition-colors">
            <Undo2 size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
