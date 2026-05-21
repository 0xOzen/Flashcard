import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';
import { getGermanTask, inferCardType, inferErrorType } from '../lib/germanLearning';

const CARDS_PER_ROUND = 20;
const QUIZ_SESSION_STORAGE_KEY = 'quiz-study-session-v1';

type QuizSessionState = {
  deckSignature: string;
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
};

function readSessionMap(): Record<string, QuizSessionState> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(QUIZ_SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, QuizSessionState>) : {};
  } catch (error) {
    console.error('Quiz oturum durumu okunamadı:', error);
    return {};
  }
}

function loadSession(listId: string, deckSignature: string, deckLength: number): QuizSessionState | null {
  if (!listId || !deckLength) return null;

  const sessions = readSessionMap();
  const saved = sessions[listId];
  if (!saved) return null;
  if (saved.deckSignature !== deckSignature) return null;
  if (!Number.isInteger(saved.currentIndex) || saved.currentIndex < 0 || saved.currentIndex >= deckLength) return null;

  return {
    deckSignature: saved.deckSignature,
    currentIndex: saved.currentIndex,
    correctCount: Number.isInteger(saved.correctCount) ? Math.max(0, saved.correctCount) : 0,
    incorrectCount: Number.isInteger(saved.incorrectCount) ? Math.max(0, saved.incorrectCount) : 0,
  };
}

function saveSession(listId: string, state: QuizSessionState | null) {
  if (typeof window === 'undefined') return;

  const sessions = readSessionMap();

  if (!state) {
    delete sessions[listId];
  } else {
    sessions[listId] = state;
  }

  localStorage.setItem(QUIZ_SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export default function QuizMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordReview, studyDirection, toggleStudyDirection, getDifficultWordsList, getDueWordsList } = useApp();
  const list =
    listId === 'difficult-words'
      ? getDifficultWordsList()
      : listId === 'today-review'
        ? getDueWordsList()
        : lists.find((item) => item.id === listId);

  const words = list?.words || [];
  const deckSignature = useMemo(() => words.map((word) => word.id).join('|'), [words]);
  const sessionKey = `quiz:${listId}`;
  const initialSession = useMemo(() => loadSession(sessionKey, deckSignature, words.length), [deckSignature, sessionKey, words.length]);

  const [deck, setDeck] = useState(words);
  const [currentIndex, setCurrentIndex] = useState(initialSession?.currentIndex ?? 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(initialSession?.correctCount ?? 0);
  const [incorrectCount, setIncorrectCount] = useState(initialSession?.incorrectCount ?? 0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDeck(words);

    const resumed = loadSession(sessionKey, deckSignature, words.length);
    if (!resumed) {
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setCorrectCount(0);
      setIncorrectCount(0);
      setIsComplete(false);
      return;
    }

    setCurrentIndex(resumed.currentIndex);
    setSelectedAnswer(null);
    setCorrectCount(resumed.correctCount);
    setIncorrectCount(resumed.incorrectCount);
    setIsComplete(false);
  }, [sessionKey, deckSignature, words.length]);

  useEffect(() => {
    if (!list || deck.length === 0) {
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
      correctCount,
      incorrectCount,
    });
  }, [deck.length, currentIndex, correctCount, deckSignature, incorrectCount, isComplete, list, sessionKey]);

  if (!list || deck.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Test için hazır kart yok.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Listeye kart eklediğinde çeldiricili test burada çalışır.</p>
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
            Panele dön
          </button>
        </div>
      </div>
    );
  }

  const totalRounds = Math.ceil(deck.length / CARDS_PER_ROUND);
  const roundIndex = Math.floor(currentIndex / CARDS_PER_ROUND);
  const roundStart = roundIndex * CARDS_PER_ROUND;
  const currentRoundSize = Math.min(CARDS_PER_ROUND, deck.length - roundStart);
  const indexInRound = currentIndex - roundStart;
  const activeRound = Math.min(roundIndex + 1, totalRounds);
  const roundLabel = `${activeRound}/${totalRounds}`;

  const currentWord = deck[currentIndex];
  const currentTask = getGermanTask(currentWord, studyDirection);

  const options = useMemo(() => {
    const cardType = inferCardType(currentWord);
    const fixedOptions =
      cardType === 'article'
        ? ['der', 'die', 'das']
        : cardType === 'preposition'
          ? ['auf', 'an', 'in', 'für', 'mit', 'zu']
          : currentWord.distractors;

    const wrongOptions = (fixedOptions || deck.map((word) => getGermanTask(word, studyDirection).answer))
      .filter((option) => option && option !== currentTask.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return Array.from(new Set([currentTask.answer, ...wrongOptions])).sort(() => 0.5 - Math.random());
  }, [currentIndex, currentWord, deck, studyDirection]);

  const correctOption = currentTask.answer;
  const progress = currentRoundSize > 0 ? ((indexInRound + (isComplete ? 1 : 0)) / currentRoundSize) * 100 : 0;

  const handleSelect = (option: string) => {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(option);

    if (option === correctOption) {
      recordReview(currentWord.id, 'good');
      setCorrectCount((previous) => previous + 1);
    } else {
      recordReview(currentWord.id, 'again', inferErrorType(currentWord));
      setIncorrectCount((previous) => previous + 1);
    }

    window.setTimeout(() => {
      setSelectedAnswer(null);

      if (currentIndex < deck.length - 1) {
        setCurrentIndex((previous) => previous + 1);
      } else {
        setIsComplete(true);
      }
    }, 950);
  };

  return (
    <StudyModeShell
      modeLabel="Test"
      title="Hızlı karar ve doğru çağırma pratiği"
      description="Çeldiriciler arasından doğru karşılığı seçerek kelimeyi gerçekten ayırt edip edemediğini ölçer."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={isComplete ? Math.max(0, currentRoundSize - 1) : indexInRound}
      total={currentRoundSize}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_DE' ? 'TR → DE' : 'DE → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="emerald"
      progressNote="Her soruda dört seçenek geliyor; kısa bekleme sonrası sistem seni otomatik olarak sonraki soruya taşıyor."
      stats={[
        { label: 'Doğru', value: `${correctCount}` },
        { label: 'Yanlış', value: `${incorrectCount}` },
        { label: 'Tur', value: roundLabel },
        { label: 'Liste', value: list?.title || '-' },
      ]}
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Test tamamlandı"
          description="Bütün kart turları bitti. İstersen aynı listeyi yeniden çözebilir ya da yazma moduna geçerek aktif üretimi deneyebilirsin."
          primaryLabel="Tekrar çöz"
          onPrimary={() => {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setCorrectCount(0);
            setIncorrectCount(0);
            setIsComplete(false);
          }}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Toplam soru', value: `${deck.length}` },
            { label: 'Doğru', value: `${correctCount}` },
            { label: 'Yanlış', value: `${incorrectCount}` },
            { label: 'Tur', value: roundLabel },
          ]}
        />
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
          <div className="text-center">
            <div className="section-label">{currentTask.label}</div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-claude-text sm:text-5xl">
              {currentTask.question}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {options.map((option) => {
              let buttonClassName =
                'border-claude-border bg-claude-surface text-claude-text hover:border-claude-accent/50 hover:-translate-y-0.5';

              if (selectedAnswer) {
                if (option === correctOption) {
                  buttonClassName = 'border-emerald-300 bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.24)]';
                } else if (option === selectedAnswer) {
                  buttonClassName = 'border-rose-300 bg-rose-500 text-white shadow-[0_18px_40px_rgba(244,63,94,0.2)]';
                } else {
                  buttonClassName = 'border-claude-border bg-claude-surface text-claude-muted opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`rounded-[16px] border px-4 py-5 text-left text-lg font-semibold transition-all ${buttonClassName}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </StudyModeShell>
  );
}
