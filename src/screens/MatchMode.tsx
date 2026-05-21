import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';

type CardType = 'GERMAN' | 'TURKISH';
type GridItem = {
  id: string;
  wordId: string;
  text: string;
  type: CardType;
  isMatched: boolean;
};

type MatchSessionState = {
  deckSignature: string;
  currentIndex: number;
  mistakes: number;
};

const CARDS_PER_ROUND = 20;
const MATCH_SESSION_STORAGE_KEY = 'match-study-session-v1';
const WORDS_PER_ROUND = CARDS_PER_ROUND / 2;

function createGrid(words: Flashcard[]): GridItem[] {
  const pairCount = Math.min(words.length, WORDS_PER_ROUND);
  const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, pairCount);
  const initialCards: GridItem[] = [];

  pool.forEach((word) => {
    initialCards.push({ id: crypto.randomUUID(), wordId: word.id, text: word.term, type: 'GERMAN', isMatched: false });
    initialCards.push({
      id: crypto.randomUUID(),
      wordId: word.id,
      text: word.translationTr || word.translationEn || word.translation || '',
      type: 'TURKISH',
      isMatched: false,
    });
  });

  return initialCards.sort(() => 0.5 - Math.random());
}

function readSessionMap(): Record<string, MatchSessionState> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(MATCH_SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, MatchSessionState>) : {};
  } catch (error) {
    console.error('Eşleştirme oturum durumu okunamadı:', error);
    return {};
  }
}

function loadSession(listId: string, deckSignature: string, deckLength: number): MatchSessionState | null {
  if (!listId || !deckLength) return null;

  const sessions = readSessionMap();
  const saved = sessions[listId];
  if (!saved) return null;
  if (saved.deckSignature !== deckSignature) return null;
  if (!Number.isInteger(saved.currentIndex) || saved.currentIndex < 0 || saved.currentIndex >= deckLength) return null;

  return {
    deckSignature: saved.deckSignature,
    currentIndex: saved.currentIndex,
    mistakes: Number.isInteger(saved.mistakes) ? Math.max(0, saved.mistakes) : 0,
  };
}

function saveSession(listId: string, state: MatchSessionState | null) {
  if (typeof window === 'undefined') return;

  const sessions = readSessionMap();

  if (!state) {
    delete sessions[listId];
  } else {
    sessions[listId] = state;
  }

  localStorage.setItem(MATCH_SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

function normalizeRoundStart(index: number, words: number) {
  if (!words) return 0;
  const maxRoundIndex = Math.max(0, Math.floor((words - 1) / WORDS_PER_ROUND));
  const clamped = Math.max(0, Math.min(Math.floor(index / WORDS_PER_ROUND) * WORDS_PER_ROUND, maxRoundIndex * WORDS_PER_ROUND));
  return clamped;
}

export default function MatchMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const words = list?.words || [];

  const deckSignature = useMemo(() => words.map((word) => word.id).join('|'), [words]);
  const sessionKey = `match:${listId}`;
  const initialSession = useMemo(() => loadSession(sessionKey, deckSignature, words.length), [deckSignature, sessionKey, words.length]);

  const [currentIndex, setCurrentIndex] = useState(initialSession ? normalizeRoundStart(initialSession.currentIndex, words.length) : 0);
  const [cards, setCards] = useState<GridItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [mistakes, setMistakes] = useState(initialSession?.mistakes ?? 0);
  const [isComplete, setIsComplete] = useState(false);

  const roundWordStart = useMemo(() => normalizeRoundStart(currentIndex, words.length), [currentIndex, words.length]);
  const roundWords = useMemo(
    () => words.slice(roundWordStart, roundWordStart + WORDS_PER_ROUND),
    [roundWordStart, words],
  );
  const roundPairCount = roundWords.length;
  const roundSignature = useMemo(() => roundWords.map((word) => word.id).join('|'), [roundWords]);
  const totalRounds = Math.ceil(words.length / WORDS_PER_ROUND);
  const activeRound = totalRounds > 0 ? Math.floor(roundWordStart / WORDS_PER_ROUND) + 1 : 0;

  useEffect(() => {
    if (!words.length) {
      setCards([]);
      setSelectedIds([]);
      setIsProcessing(false);
      setMatchedPairs(0);
      setMistakes(0);
      setIsComplete(false);
      return;
    }

    const resumed = loadSession(sessionKey, deckSignature, words.length);
    if (!resumed) {
      setCurrentIndex(0);
      setMatchedPairs(0);
      setMistakes(0);
      setSelectedIds([]);
      setIsProcessing(false);
      setIsComplete(false);
      return;
    }

    setCurrentIndex(normalizeRoundStart(resumed.currentIndex, words.length));
    setMistakes(resumed.mistakes);
    setMatchedPairs(0);
    setSelectedIds([]);
    setIsProcessing(false);
    setIsComplete(false);
  }, [sessionKey, deckSignature, words.length]);

  useEffect(() => {
    if (roundWords.length < 2) {
      setCards([]);
      setSelectedIds([]);
      setIsProcessing(false);
      setMatchedPairs(0);
      setIsComplete(true);
      return;
    }

    setCards(createGrid(roundWords));
    setSelectedIds([]);
    setIsProcessing(false);
    setMatchedPairs(0);
  }, [roundSignature]);

  useEffect(() => {
    if (!list || words.length === 0) {
      saveSession(sessionKey, null);
      return;
    }

    if (isComplete) {
      saveSession(sessionKey, null);
      return;
    }

    saveSession(sessionKey, {
      deckSignature,
      currentIndex,
      mistakes,
    });
  }, [deckSignature, currentIndex, isComplete, list, mistakes, sessionKey, words.length]);

  if (words.length < 2 || cards.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Eşleştirme için en az 2 kelime gerekli.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Küçük bir liste bile yeterli; birkaç kelime daha eklediğinde oyun akışı açılır.</p>
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
            Panele dön
          </button>
        </div>
      </div>
    );
  }

  const totalPairs = roundPairCount;
  const progress = totalPairs > 0 ? ((matchedPairs + (isComplete ? 1 : 0)) / totalPairs) * 100 : 0;
  const shellCurrentIndex = isComplete ? Math.max(0, totalPairs - 1) : matchedPairs;
  const roundLabel = `${activeRound}/${totalRounds}`;

  const resetSession = () => {
    setCurrentIndex(0);
    setCards(createGrid(words.slice(0, WORDS_PER_ROUND)));
    setSelectedIds([]);
    setIsProcessing(false);
    setMatchedPairs(0);
    setMistakes(0);
    setIsComplete(false);
  };

  const handleRoundComplete = () => {
    const nextRoundStart = roundWordStart + totalPairs;
    if (nextRoundStart < words.length) {
      setCurrentIndex(nextRoundStart);
      return;
    }

    setIsComplete(true);
  };

  const handleCardClick = (card: GridItem) => {
    if (isProcessing || card.isMatched || selectedIds.includes(card.id) || isComplete) {
      return;
    }

    const newSelected = [...selectedIds, card.id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const firstCard = cards.find((item) => item.id === newSelected[0]);
      const secondCard = cards.find((item) => item.id === newSelected[1]);

      if (!firstCard || !secondCard) {
        setSelectedIds([]);
        setIsProcessing(false);
        return;
      }

      if (firstCard.wordId === secondCard.wordId && firstCard.type !== secondCard.type) {
        recordSuccess(firstCard.wordId);
        window.setTimeout(() => {
          setCards((previous) =>
            previous.map((item) =>
              item.wordId === firstCard.wordId ? { ...item, isMatched: true } : item,
            ),
          );

          setMatchedPairs((previous) => {
            const nextValue = previous + 1;
            if (nextValue === totalPairs) {
              handleRoundComplete();
            }
            return nextValue;
          });

          setSelectedIds([]);
          setIsProcessing(false);
        }, 320);
      } else {
        recordFailure(firstCard.wordId);
        setMistakes((previous) => previous + 1);
        window.setTimeout(() => {
          setSelectedIds([]);
          setIsProcessing(false);
        }, 700);
      }
    }
  };

  return (
    <StudyModeShell
      modeLabel="Eşleştir"
      title="Kısa tur, yüksek tempo, oyun hissi"
      description="Almanca ve Türkçe kartları eşleyerek özellikle hızlı tekrar ve dikkat tazeleme için güçlü bir mod oluşturur."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={shellCurrentIndex}
      total={Math.max(totalPairs, 1)}
      onBack={() => onNavigate({ type: 'dashboard' })}
      accentClassName="rose"
      progressNote="Doğru eşleşmeler sahneden kalkar; yanlış seçimler kısa bir gecikmeyle geri kapanır ve tempo korunur."
      stats={[
        { label: 'Çift', value: `${matchedPairs}/${totalPairs}` },
        { label: 'Hata', value: `${mistakes}` },
        { label: 'Tur', value: roundLabel },
        { label: 'Kart', value: `${cards.length}` },
        { label: 'Liste', value: list?.title || '-' },
      ]}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-7 text-claude-subtle">Önce Almanca ya da Türkçe fark etmez; iki kart açtığında eşleşme varsa kartlar sahneden çıkar.</div>
          <button
            onClick={resetSession}
            className="button-secondary self-start"
          >
            Turu yenile
          </button>
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Eşleştirme turu bitti"
          description="Bütün kart turları tamamlandı. İstersen yeni bir karışım açabilir ya da kart moduna geçip derin tekrar yapabilirsin."
          primaryLabel="Yeni tur"
          onPrimary={() => {
            resetSession();
          }}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Çift', value: `${Math.min(totalPairs, words.length)}` },
            { label: 'Hata', value: `${mistakes}` },
            { label: 'Kart', value: `${cards.length}` },
            { label: 'Tur', value: roundLabel },
          ]}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const isSelected = selectedIds.includes(card.id);
            let buttonClassName =
              'border-claude-border bg-claude-surface text-claude-text hover:border-claude-accent/50 hover:-translate-y-0.5';

            if (card.isMatched) {
              buttonClassName = 'pointer-events-none border-emerald-200 bg-emerald-100/70 text-emerald-700 opacity-50';
            } else if (isSelected) {
              if (selectedIds.length === 2) {
                const firstCard = cards.find((item) => item.id === selectedIds[0]);
                const secondCard = cards.find((item) => item.id === selectedIds[1]);
                if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
                  buttonClassName = 'border-emerald-300 bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.22)]';
                } else {
                  buttonClassName = 'border-rose-300 bg-rose-500 text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)]';
                }
              } else {
                buttonClassName = 'border-sky-200 bg-sky-50 text-sky-700';
              }
            }

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`flex min-h-32 items-center justify-center rounded-[16px] border px-4 py-5 text-center text-lg font-semibold transition-all ${buttonClassName}`}
              >
                <span className="line-clamp-3">{card.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </StudyModeShell>
  );
}
