import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { CornerDownLeft } from 'lucide-react';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';
import { getGermanTask, inferErrorType, isAnswerCorrect } from '../lib/germanLearning';

const CARDS_PER_ROUND = 20;
const WRITE_SESSION_STORAGE_KEY = 'write-study-session-v1';

type WriteSessionState = {
  deckSignature: string;
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
};

function readSessionMap(): Record<string, WriteSessionState> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(WRITE_SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, WriteSessionState>) : {};
  } catch (error) {
    console.error('Yazma oturum durumu okunamadı:', error);
    return {};
  }
}

function loadSession(listId: string, deckSignature: string, deckLength: number): WriteSessionState | null {
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

function saveSession(listId: string, state: WriteSessionState | null) {
  if (typeof window === 'undefined') return;

  const sessions = readSessionMap();

  if (!state) {
    delete sessions[listId];
  } else {
    sessions[listId] = state;
  }

  localStorage.setItem(WRITE_SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export default function WriteMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordReview, studyDirection, toggleStudyDirection, getDifficultWordsList, getDueWordsList } = useApp();
  const list =
    listId === 'difficult-words'
      ? getDifficultWordsList()
      : listId === 'today-review'
        ? getDueWordsList()
        : lists.find((item) => item.id === listId);

  const words = list?.words || [];
  const deckSignature = useMemo(() => words.map((word) => word.id).join('|'), [words]);
  const sessionKey = `write:${listId}`;
  const initialSession = useMemo(() => loadSession(sessionKey, deckSignature, words.length), [deckSignature, sessionKey, words.length]);

  const [deck, setDeck] = useState(words);
  const [currentIndex, setCurrentIndex] = useState(initialSession?.currentIndex ?? 0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctCount, setCorrectCount] = useState(initialSession?.correctCount ?? 0);
  const [incorrectCount, setIncorrectCount] = useState(initialSession?.incorrectCount ?? 0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDeck(words);

    const resumed = loadSession(sessionKey, deckSignature, words.length);
    if (!resumed) {
      setCurrentIndex(0);
      setInputVal('');
      setFeedback('idle');
      setCorrectCount(0);
      setIncorrectCount(0);
      setIsComplete(false);
      return;
    }

    setCurrentIndex(resumed.currentIndex);
    setInputVal('');
    setFeedback('idle');
    setCorrectCount(resumed.correctCount);
    setIncorrectCount(resumed.incorrectCount);
    setIsComplete(false);
  }, [sessionKey, deckSignature, words.length]);

  useEffect(() => {
    if (feedback === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback, currentIndex]);

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

  if (words.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Yazma için hazır kelime yok.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Listeye kelime eklediğinde bu alan otomatik olarak aktif hale gelecek.</p>
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
  const answerPreview = currentTask.answer;
  const progress = currentRoundSize > 0 ? ((indexInRound + (isComplete ? 1 : 0)) / currentRoundSize) * 100 : 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!inputVal.trim() || feedback !== 'idle') {
      return;
    }

    const isCorrect = isAnswerCorrect(inputVal, currentTask.acceptedAnswers);

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount((previous) => previous + 1);
      recordReview(currentWord.id, 'good');
    } else {
      setFeedback('incorrect');
      setIncorrectCount((previous) => previous + 1);
      recordReview(currentWord.id, 'again', inferErrorType(currentWord));
    }

    window.setTimeout(() => {
      setFeedback('idle');
      setInputVal('');

      if (currentIndex < deck.length - 1) {
        setCurrentIndex((previous) => previous + 1);
      } else {
        setIsComplete(true);
      }
    }, 1100);
  };

  return (
    <StudyModeShell
      modeLabel="Yazma"
      title="Pasif tanımayı aktif üretime çevir"
      description="Kelimenin karşılığını kendi başına yazarak gerçekten bellekte oturup oturmadığını test eder."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={isComplete ? currentRoundSize - 1 : indexInRound}
      total={currentRoundSize}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_DE' ? 'TR → DE' : 'DE → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="amber"
      progressNote="Cevabı gönderdiğinde doğru ya da yanlış geri bildirimi anında görünür; ardından sıradaki kelimeye geçilir."
      stats={[
        { label: 'Doğru', value: `${correctCount}` },
        { label: 'Yanlış', value: `${incorrectCount}` },
        { label: 'Tur', value: roundLabel },
        { label: 'Liste', value: list?.title || '-' },
      ]}
      footer={
        <div className="text-sm leading-7 text-claude-subtle">
          Yazım sırasında küçük harf kontrolü yapıyoruz. Almanca hedefte artikel ile birlikte yazman da doğru kabul edilir.
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Yazma turu tamamlandı"
          description="Bütün kart turları tamamlandı. Aynı listeyi yeniden deneyebilir ya da test moduna geçip hızını ölçebilirsin."
          primaryLabel="Tekrar yaz"
          onPrimary={() => {
            setCurrentIndex(0);
            setInputVal('');
            setFeedback('idle');
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
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-2">
          <div className="text-center">
            <div className="section-label">{currentTask.label}</div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-claude-text sm:text-5xl">
              {currentTask.question}
            </h2>
            {currentWord.example ? <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-claude-muted">{currentWord.example}</p> : null}
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(event) => setInputVal(event.target.value)}
                disabled={feedback !== 'idle'}
                autoComplete="off"
                placeholder="Cevabı yaz..."
                className={`w-full rounded-[16px] border px-6 py-5 text-center text-2xl font-semibold outline-none transition-all ${
                  feedback === 'idle'
                    ? 'border-claude-border bg-claude-surface text-claude-text shadow-soft focus:border-claude-warning focus:ring-4 focus:ring-claude-warning/10'
                    : feedback === 'correct'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-rose-300 bg-rose-50 text-rose-700'
                }`}
              />

              {feedback === 'idle' ? (
                <button type="submit" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[12px] border border-claude-border bg-claude-panel text-claude-muted transition-colors hover:text-claude-text">
                  <CornerDownLeft size={18} />
                </button>
              ) : null}
            </div>

            <div className="mt-5 min-h-10 text-center">
              {feedback === 'correct' ? <div className="text-sm font-semibold text-emerald-700">Harika, cevap doğru.</div> : null}
              {feedback === 'incorrect' ? (
                <div className="text-sm font-semibold text-rose-600">
                  Doğrusu: <span className="text-claude-text">{answerPreview}</span>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      )}
    </StudyModeShell>
  );
}
