import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronsUp, RotateCcw, Shuffle, Undo2, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import Flashcard from '../Flashcard';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';
import { inferErrorType } from '../lib/germanLearning';
import { ReviewGrade } from '../types';

const CARDS_PER_ROUND = 20;
const FLASHCARD_SESSION_STORAGE_KEY = 'flashcard-study-session-v1';

type FlashcardSessionState = {
  deckSignature: string;
  currentIndex: number;
  knownCount: number;
  unknownCount: number;
};

function readSessionMap(): Record<string, FlashcardSessionState> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(FLASHCARD_SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, FlashcardSessionState>) : {};
  } catch (error) {
    console.error('Oturum durumu okunamadı:', error);
    return {};
  }
}

function loadSession(
  listId: string,
  deckSignature: string,
  deckLength: number,
): FlashcardSessionState | null {
  if (!listId || !deckLength) return null;

  const sessions = readSessionMap();
  const saved = sessions[listId];
  if (!saved) return null;
  if (saved.deckSignature !== deckSignature) return null;
  if (!Number.isInteger(saved.currentIndex) || saved.currentIndex < 0 || saved.currentIndex >= deckLength) return null;

  return {
    deckSignature: saved.deckSignature,
    currentIndex: saved.currentIndex,
    knownCount: Number.isInteger(saved.knownCount) ? Math.max(0, saved.knownCount) : 0,
    unknownCount: Number.isInteger(saved.unknownCount) ? Math.max(0, saved.unknownCount) : 0,
  };
}

function saveSession(listId: string, state: FlashcardSessionState | null) {
  if (typeof window === 'undefined') return;

  const sessions = readSessionMap();
  if (!state) {
    delete sessions[listId];
  } else {
    sessions[listId] = state;
  }
  localStorage.setItem(FLASHCARD_SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export default function FlashcardMode({
  listId,
  onNavigate,
}: {
  listId: string;
  onNavigate: (screen: Screen) => void;
}) {
  const { lists, recordReview, studyDirection, toggleStudyDirection, getDifficultWordsList, getDueWordsList } = useApp();
  const list =
    listId === 'difficult-words'
      ? getDifficultWordsList()
      : listId === 'today-review'
        ? getDueWordsList()
        : lists.find((item) => item.id === listId);

  const initialWords = list?.words || [];
  const deckSignature = useMemo(() => initialWords.map((word) => word.id).join('|'), [initialWords]);
  const sessionKey = `flashcard:${listId}`;
  const initialSession = useMemo(
    () => loadSession(sessionKey, deckSignature, initialWords.length),
    [deckSignature, initialWords.length, sessionKey],
  );

  const [deck, setDeck] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(initialSession?.currentIndex ?? 0);
  const [knownCount, setKnownCount] = useState(initialSession?.knownCount ?? 0);
  const [unknownCount, setUnknownCount] = useState(initialSession?.unknownCount ?? 0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDeck(initialWords);

    const resumed = loadSession(sessionKey, deckSignature, initialWords.length);
    if (!resumed) {
      setCurrentIndex(0);
      setKnownCount(0);
      setUnknownCount(0);
      setIsComplete(false);
      return;
    }

    setCurrentIndex(resumed.currentIndex);
    setKnownCount(resumed.knownCount);
    setUnknownCount(resumed.unknownCount);
    setIsComplete(false);
  }, [sessionKey, deckSignature, initialWords.length]);

  useEffect(() => {
    if (!list) {
      return;
    }

    if (isComplete || deck.length === 0) {
      saveSession(sessionKey, null);
      return;
    }

    saveSession(sessionKey, {
      deckSignature,
      currentIndex,
      knownCount,
      unknownCount,
    });
  }, [deck.length, deckSignature, currentIndex, knownCount, unknownCount, isComplete, list, sessionKey]);

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

  const currentCard = deck[currentIndex];
  const totalRounds = Math.ceil(deck.length / CARDS_PER_ROUND);
  const roundIndex = Math.floor(currentIndex / CARDS_PER_ROUND);
  const currentRoundSize = Math.min(CARDS_PER_ROUND, deck.length - roundIndex * CARDS_PER_ROUND);
  const indexInRound = currentIndex - roundIndex * CARDS_PER_ROUND;
  const activeRound = Math.min(roundIndex + 1, totalRounds);
  const roundProgress = currentRoundSize > 0 ? ((indexInRound + (isComplete ? 1 : 0)) / currentRoundSize) * 100 : 0;
  const shellCurrentIndex = isComplete ? Math.max(0, currentRoundSize - 1) : indexInRound;

  const roundLabel = `${activeRound}/${totalRounds}`;
  const progress = roundProgress;

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

  const goNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const handleGrade = (grade: ReviewGrade) => {
    recordReview(currentCard.id, grade, inferErrorType(currentCard));
    if (grade === 'good' || grade === 'easy') {
      setKnownCount((previous) => previous + 1);
    } else {
      setUnknownCount((previous) => previous + 1);
    }
    goNext();
  };

  return (
    <StudyModeShell
      modeLabel="Kartlar"
      title={listId === 'today-review' ? 'Bugünün tekrarları' : 'Kartla hızlı hatırlama'}
      description="Kartı çevir, cevabı gör ve tekrar zamanlamasını gerçek performansına göre ayarla."
      listTitle={list.title}
      progress={progress}
      currentIndex={shellCurrentIndex}
      total={currentRoundSize}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_DE' ? 'TR → DE' : 'DE → TR'}
      accentClassName="teal"
      stats={[
        { label: 'İyi', value: `${knownCount}` },
        { label: 'Tekrar', value: `${unknownCount}` },
        { label: 'Tur', value: roundLabel },
        { label: 'Liste', value: list.title },
      ]}
      footer={
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <button onClick={actions.shuffle} className="button-secondary" title="Karıştır">
              <Shuffle size={16} />
              Karıştır
            </button>
            <button onClick={actions.reset} className="button-secondary" title="Baştan al">
              <Undo2 size={16} />
              Baştan al
            </button>
          </div>
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Kart turu tamamlandı"
          description="Tüm kart turlarını tamamladığında bu ekranı görürsün. Bu sefer 20 kartlık turlar halinde ilerliyorsun."
          primaryLabel="Baştan al"
          onPrimary={actions.reset}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Bilinen', value: `${knownCount}` },
            { label: 'Zorlanan', value: `${unknownCount}` },
            { label: 'Toplam', value: `${deck.length}` },
            { label: 'Tur', value: `${roundLabel}` },
          ]}
        />
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 py-2">
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

          <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              onClick={() => handleGrade('again')}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-danger/50 hover:text-claude-danger"
            >
              <RotateCcw size={18} />
              Tekrar
            </button>
            <button
              onClick={() => handleGrade('hard')}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-warning/50 hover:text-claude-warning"
            >
              <X size={18} />
              Zor
            </button>
            <button
              onClick={() => handleGrade('good')}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-success/50 hover:text-claude-success"
            >
              <Check size={18} />
              İyi
            </button>
            <button
              onClick={() => handleGrade('easy')}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-info/50 hover:text-claude-info"
            >
              <ChevronsUp size={18} />
              Kolay
            </button>
          </div>
        </div>
      )}
    </StudyModeShell>
  );
}
