import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDownUp, Check, ChevronLeft, Shuffle, Undo2, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import Flashcard from '../Flashcard';

function getDirectionLabel(direction?: 'DE_TO_TR' | 'TR_TO_DE') {
  return direction === 'TR_TO_DE' ? 'TR -> DE' : 'DE -> TR';
}

export default function FlashcardMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const initialWords = list?.words || [];

  const [deck, setDeck] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex + (isComplete ? 1 : 0)) / deck.length) * 100 : 0;

  const resetSession = (nextDeck = initialWords) => {
    setDeck(nextDeck);
    setCurrentIndex(0);
    setKnownCount(0);
    setUnknownCount(0);
    setIsComplete(false);
  };

  const actions = useMemo(
    () => ({
      shuffle: () => resetSession([...initialWords].sort(() => Math.random() - 0.5)),
      reset: () => resetSession(initialWords),
    }),
    [initialWords],
  );

  if (!list || deck.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-lg font-medium text-stone-400">Bu listede çalışılacak kelime yok.</p>
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
          Panele dön
        </button>
      </div>
    );
  }

  const goNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const handleKnown = () => {
    recordSuccess(currentCard.id);
    setKnownCount((previous) => previous + 1);
    goNext();
  };

  const handleUnknown = () => {
    recordFailure(currentCard.id);
    setUnknownCount((previous) => previous + 1);
    goNext();
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-6 text-gray-900">
      <div className="w-full max-w-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate({ type: 'dashboard' })} className="flex items-center text-stone-500 transition-colors hover:text-stone-200">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={toggleStudyDirection}
              className="flex items-center justify-center rounded-lg border border-transparent p-1.5 text-stone-500 transition-colors hover:border-white/10 hover:bg-white/[0.04] hover:text-stone-200"
              title="Yönü çevir"
            >
              <ArrowDownUp size={18} strokeWidth={2} />
              <span className="ml-1.5 hidden text-[10px] font-bold uppercase tracking-widest sm:inline">{getDirectionLabel(studyDirection)}</span>
            </button>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{list.title}</div>
            <div className="mt-1 text-xs font-semibold tracking-widest text-stone-400">
              {Math.min(currentIndex + 1, deck.length)} / {deck.length}
            </div>
          </div>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-white/75" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <div className="mt-8 w-full">
        {isComplete ? (
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <div className="text-lg font-medium text-stone-100">Kart turu tamamlandı.</div>
            <div className="mt-3 text-sm leading-7 text-stone-400">
              Bilinen: {knownCount} · Zorlanan: {unknownCount}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button onClick={actions.reset} className="button-primary">
                Baştan al
              </button>
              <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary">
                Panele dön
              </button>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCard.id}-${currentIndex}-${studyDirection || ''}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Flashcard card={currentCard} studyDirection={studyDirection} />
              </motion.div>
            </AnimatePresence>

            <div className="mx-auto mt-12 flex w-full max-w-sm flex-col gap-6">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handleUnknown}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-[0_2px_15px_rgba(0,0,0,0.04)] transition-all hover:bg-gray-50 hover:text-red-500"
                >
                  <X size={24} strokeWidth={2} />
                </button>
                <button
                  onClick={handleKnown}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-[0_2px_15px_rgba(0,0,0,0.04)] transition-all hover:bg-gray-50 hover:text-green-500"
                >
                  <Check size={24} strokeWidth={2} />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-8">
                <button onClick={actions.shuffle} className="text-stone-500 transition-colors hover:text-stone-200" title="Karıştır">
                  <Shuffle size={20} strokeWidth={1.5} />
                </button>
                <button onClick={actions.reset} className="text-stone-500 transition-colors hover:text-stone-200" title="Baştan al">
                  <Undo2 size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
