import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, ArticleLookupCacheEntry, ErrorType, Flashcard, ReviewGrade, VocabList } from './types';
import { createDefaultAppState, migrateAppState } from './lib/appState';
import { loadPersistedAppState, savePersistedAppState } from './lib/persistence';
import { buildLookupLinks, inferCardType, inferErrorType, isDue, scheduleReview, todayIso } from './lib/germanLearning';

interface AppContextType extends AppState {
  isHydrated: boolean;
  addList: (title: string, words?: Flashcard[]) => void;
  updateList: (id: string, title: string, words: Flashcard[]) => void;
  deleteList: (id: string) => void;
  recordSuccess: (wordId: string) => void;
  recordFailure: (wordId: string, errorType?: ErrorType) => void;
  recordReview: (wordId: string, grade: ReviewGrade, errorType?: ErrorType) => void;
  saveArticleLookup: (word: string, entry: ArticleLookupCacheEntry) => void;
  getDueWordsList: () => VocabList | null;
  getOverallProgress: () => { totalStudied: number; accuracy: number };
  getWeakAreas: () => { label: string; count: number }[];
  getDifficultWordsList: () => VocabList | null;
  toggleStudyDirection: () => void;
  setDesiredRetention: (retention: number) => void;
  setAiModel: (model: NonNullable<AppState['aiModel']>) => void;
  setBrowserApiKey: (apiKey: string) => void;
  clearBrowserApiKey: () => void;
  dismissInstallHint: () => void;
  showInstallHint: () => void;
  exportBackup: () => AppState;
  importBackup: (raw: string) => { ok: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDefaultAppState());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const persistedState = await loadPersistedAppState();
        if (isCancelled) {
          return;
        }

        setState(persistedState);
      } catch (error) {
        console.error('App state could not be restored:', error);
      } finally {
        if (!isCancelled) {
          setIsHydrated(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void savePersistedAppState(state);
  }, [isHydrated, state]);

  const normalizeWords = (words: Flashcard[]) =>
    words.map((word) => ({
      ...word,
      cardType: word.cardType ?? inferCardType(word),
      lookupLinks: buildLookupLinks(word),
    }));

  const addList = (title: string, customWords: Flashcard[] = []) => {
    setState(prev => ({
      ...prev,
      lists: [...prev.lists, { id: crypto.randomUUID(), title, words: normalizeWords(customWords) }]
    }));
  };

  const updateList = (id: string, title: string, words: Flashcard[]) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list => list.id === id ? { ...list, title, words: normalizeWords(words) } : list)
    }));
  };

  const deleteList = (id: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.filter(list => list.id !== id)
    }));
  };

  const updateWord = (wordId: string, updater: (word: Flashcard) => Flashcard) => (list: VocabList): VocabList => ({
    ...list,
    words: list.words.map((word) => (word.id === wordId ? updater(word) : word)),
  });

  const recordSuccess = (wordId: string) => {
    setState(prev => {
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [wordId]: { ...wordStats, correct: wordStats.correct + 1, lastReviewed: todayIso() }
        }
      };
    });
  };

  const recordFailure = (wordId: string, explicitErrorType?: ErrorType) => {
    setState(prev => {
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      const word = prev.lists.flatMap((list) => list.words).find((item) => item.id === wordId);
      const errorType = explicitErrorType ?? (word ? inferErrorType(word) : 'other');
      const errorCounts = {
        ...(wordStats.errorCounts || {}),
        [errorType]: (wordStats.errorCounts?.[errorType] || 0) + 1,
      };

      return {
        ...prev,
        stats: {
          ...prev.stats,
          [wordId]: { ...wordStats, incorrect: wordStats.incorrect + 1, lastReviewed: todayIso(), errorCounts }
        }
      };
    });
  };

  const recordReview = (wordId: string, grade: ReviewGrade, explicitErrorType?: ErrorType) => {
    setState(prev => {
      const isCorrect = grade === 'good' || grade === 'easy';
      const word = prev.lists.flatMap((list) => list.words).find((item) => item.id === wordId);
      const errorType = explicitErrorType ?? (word ? inferErrorType(word) : 'other');
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      const errorCounts =
        isCorrect
          ? wordStats.errorCounts
          : {
              ...(wordStats.errorCounts || {}),
              [errorType]: (wordStats.errorCounts?.[errorType] || 0) + 1,
            };

      return {
        ...prev,
        lists: prev.lists.map(updateWord(wordId, (item) => scheduleReview(item, grade))),
        stats: {
          ...prev.stats,
          [wordId]: {
            ...wordStats,
            correct: wordStats.correct + (isCorrect ? 1 : 0),
            incorrect: wordStats.incorrect + (isCorrect ? 0 : 1),
            lastReviewed: todayIso(),
            errorCounts,
          },
        },
      };
    });
  };

  const saveArticleLookup = (word: string, entry: ArticleLookupCacheEntry) => {
    const key = word.toLocaleLowerCase('de-DE').replace(/^(der|die|das)\s+/, '').trim();
    if (!key) return;

    setState((prev) => ({
      ...prev,
      articleLookupCache: {
        ...(prev.articleLookupCache || {}),
        [key]: entry,
      },
    }));
  };

  const getOverallProgress = () => {
    let totalCorrect = 0;
    let totalAttempts = 0;
    const studiedWordIds = Object.keys(state.stats);

    studiedWordIds.forEach(id => {
      totalCorrect += state.stats[id].correct;
      totalAttempts += state.stats[id].correct + state.stats[id].incorrect;
    });

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    
    return {
      totalStudied: studiedWordIds.length,
      accuracy
    };
  };

  const getDueWordsList = (): VocabList | null => {
    const allWords = state.lists.flatMap((list) => list.words);
    const dueReviewWords = allWords.filter((word) => (word.srs?.reviewCount || 0) > 0 && isDue(word));
    const newWords = allWords.filter((word) => !word.srs?.reviewCount).slice(0, state.dailyNewLimit || 12);
    const dueWords = [...dueReviewWords, ...newWords];

    if (dueWords.length === 0) return null;

    return {
      id: 'today-review',
      title: 'Bugünün Tekrarı',
      isDefault: true,
      words: dueWords,
    };
  };

  const getWeakAreas = () => {
    const totals: Record<string, number> = {};

    Object.values(state.stats as AppState['stats']).forEach((wordStats) => {
      Object.entries(wordStats.errorCounts || {}).forEach(([type, count]: [string, number | undefined]) => {
        totals[type] = (totals[type] || 0) + (count || 0);
      });
    });

    const labels: Record<string, string> = {
      meaning: 'Anlam',
      article: 'Artikel',
      plural: 'Çoğul',
      verb: 'Fiil',
      case: 'Kasus',
      preposition: 'Edat',
      word_order: 'Kelime sırası',
      redemittel: 'Redemittel',
      pronunciation: 'Telaffuz',
      other: 'Diğer',
    };

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ label: labels[type] || type, count }));
  };

  const toggleStudyDirection = () => {
    setState(prev => ({
      ...prev,
      studyDirection: prev.studyDirection === 'TR_TO_DE' ? 'DE_TO_TR' : 'TR_TO_DE'
    }));
  };

  const setDesiredRetention = (retention: number) => {
    const normalizedRetention = Math.min(0.98, Math.max(0.75, retention));
    setState(prev => ({
      ...prev,
      desiredRetention: normalizedRetention,
    }));
  };

  const setAiModel = (model: NonNullable<AppState['aiModel']>) => {
    setState(prev => ({
      ...prev,
      aiModel: model,
    }));
  };

  const setBrowserApiKey = (apiKey: string) => {
    setState(prev => ({
      ...prev,
      browserApiKey: apiKey.trim(),
    }));
  };

  const clearBrowserApiKey = () => {
    setState(prev => ({
      ...prev,
      browserApiKey: '',
    }));
  };

  const dismissInstallHint = () => {
    setState(prev => ({
      ...prev,
      installHintDismissed: true,
    }));
  };

  const showInstallHint = () => {
    setState(prev => ({
      ...prev,
      installHintDismissed: false,
    }));
  };

  const exportBackup = () => state;

  const importBackup = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      const migrated = migrateAppState(parsed);
      setState(migrated);
      return {
        ok: true,
        message: 'Yedek başarıyla içe aktarıldı.',
      };
    } catch (error) {
      console.error('Backup import failed:', error);
      return {
        ok: false,
        message: 'Yedek dosyası okunamadı. Geçerli bir JSON dosyası seç.',
      };
    }
  };

  const getDifficultWordsList = (): VocabList | null => {
    const difficultIds = Object.keys(state.stats).filter(id => {
      const s = state.stats[id];
      // Condition for difficult word: at least 1 failure, and error rate > 30% or more failures than successes
      const total = s.correct + s.incorrect;
      if (total === 0) return false;
      const errorRate = s.incorrect / total;
      return s.incorrect > 0 && errorRate > 0.3;
    });

    if (difficultIds.length === 0) return null;

    const allWords = state.lists.flatMap(l => l.words);
    const uniqueMap = new Map<string, Flashcard>();
    
    difficultIds.forEach(id => {
      const word = allWords.find(w => w.id === id);
      if (word && !uniqueMap.has(id)) {
        uniqueMap.set(id, word);
      }
    });

    const difficultWords = Array.from(uniqueMap.values());
    if (difficultWords.length === 0) return null;

    // Sort by most incorrect
    difficultWords.sort((a, b) => state.stats[b.id].incorrect - state.stats[a.id].incorrect);

    return {
      id: 'difficult-words',
      title: 'Zorlandıklarım',
      isDefault: true,
      words: difficultWords
    };
  };

  return (
    <AppContext.Provider value={{
      ...state,
      isHydrated,
      addList,
      updateList,
      deleteList,
      recordSuccess,
      recordFailure,
      recordReview,
      saveArticleLookup,
      getDueWordsList,
      getOverallProgress,
      getWeakAreas,
      getDifficultWordsList,
      toggleStudyDirection,
      setDesiredRetention,
      setAiModel,
      setBrowserApiKey,
      clearBrowserApiKey,
      dismissInstallHint,
      showInstallHint,
      exportBackup,
      importBackup
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
