import { AppState, Flashcard, VocabList, WordStats } from '../types';
import { buildLookupLinks, inferCardType } from './germanLearning';
import {
  LIST_ADJS,
  LIST_NOUNS,
  LIST_PHRASES_A1,
  LIST_PHRASES_A2,
  LIST_PHRASES_B1,
  LIST_BERLITZ,
  LIST_VERBS,
  LIST_GERMAN_SKILL_PACK,
} from '../extendedLists';

const DEFAULT_DIRECTION: AppState['studyDirection'] = 'DE_TO_TR';
const DEFAULT_AI_MODEL: NonNullable<AppState['aiModel']> = 'gemini-3.1-flash-image-preview';

const ALL_DEFAULT_LISTS: VocabList[] = [
  LIST_VERBS,
  LIST_ADJS,
  LIST_NOUNS,
  LIST_BERLITZ,
  LIST_PHRASES_A1,
  LIST_PHRASES_A2,
  LIST_PHRASES_B1,
  LIST_GERMAN_SKILL_PACK,
];

const REMOVED_ADVANCED_LIST_IDS = new Set([`phrases-${'b'}${2}`, `phrases-${'c'}${1}`]);
const SUPPORTED_LEVELS = new Set(['A1', 'A2', 'B1', 'A1-A2', 'A2-B1']);
const ADVANCED_LEVEL_PATTERN = new RegExp(`${'b'}${2}|${'c'}${1}|${'c'}${2}`, 'i');

function isSupportedLevel(level?: string): boolean {
  return !level || SUPPORTED_LEVELS.has(level);
}

function isAdvancedListLike(id: string, title: string): boolean {
  return REMOVED_ADVANCED_LIST_IDS.has(id) || ADVANCED_LEVEL_PATTERN.test(id) || ADVANCED_LEVEL_PATTERN.test(title);
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultLists(): VocabList[] {
  return cloneValue(ALL_DEFAULT_LISTS);
}

export function createDefaultAppState(): AppState {
  return {
    lists: createDefaultLists(),
    stats: {},
    articleLookupCache: {},
    studyDirection: DEFAULT_DIRECTION,
    desiredRetention: 0.9,
    dailyNewLimit: 12,
    aiModel: DEFAULT_AI_MODEL,
    browserApiKey: '',
    installHintDismissed: false,
  };
}

function migrateWord(rawWord: unknown): Flashcard {
  const word = (rawWord ?? {}) as Record<string, unknown>;

  const migratedWord = {
    ...word,
    id: String(word.id ?? crypto.randomUUID()),
    term: String(word.term || word.german || ''),
    translationEn: typeof word.translationEn === 'string' ? word.translationEn : undefined,
    translationTr: String(word.translationTr || word.turkish || word.translation || ''),
    translation: typeof word.translation === 'string' ? word.translation : undefined,
    example: String(word.example || word.exampleGerman || ''),
    exampleTranslation: String(word.exampleTranslation || word.exampleTurkish || ''),
    note: typeof word.note === 'string' ? word.note : undefined,
    wordType: typeof word.wordType === 'string' ? (word.wordType as Flashcard['wordType']) : undefined,
    article: typeof word.article === 'string' ? word.article : undefined,
    plural: typeof word.plural === 'string' ? word.plural : undefined,
    level: typeof word.level === 'string' ? word.level : undefined,
    verbForms:
      typeof word.verbForms === 'object' && word.verbForms !== null
        ? (word.verbForms as Flashcard['verbForms'])
        : word.wordType === 'verb'
          ? {
              auxiliary: String(word.verbAuxiliary || ''),
              present: String(word.verbThirdPerson || ''),
              preterite: String(word.verbPrateritum || ''),
              participle: String(word.verbPerfekt || ''),
            }
          : undefined,
    adjectiveForms:
      typeof word.adjectiveForms === 'object' && word.adjectiveForms !== null
        ? (word.adjectiveForms as Flashcard['adjectiveForms'])
        : word.wordType === 'adjective'
          ? {
              comparative: String(word.adjComparative || ''),
              superlative: String(word.adjSuperlative || ''),
            }
          : undefined,
    phraseForms:
      typeof word.phraseForms === 'object' && word.phraseForms !== null
        ? (word.phraseForms as Flashcard['phraseForms'])
        : undefined,
    imageUrl: typeof word.imageUrl === 'string' ? word.imageUrl : undefined,
    cardType: typeof word.cardType === 'string' ? (word.cardType as Flashcard['cardType']) : undefined,
    sourceTags: Array.isArray(word.sourceTags) ? (word.sourceTags as Flashcard['sourceTags']) : undefined,
    lookupLinks:
      typeof word.lookupLinks === 'object' && word.lookupLinks !== null
        ? (word.lookupLinks as Flashcard['lookupLinks'])
        : undefined,
    prompt: typeof word.prompt === 'string' ? word.prompt : undefined,
    answer: typeof word.answer === 'string' ? word.answer : undefined,
    distractors: Array.isArray(word.distractors) ? word.distractors.map(String) : undefined,
    errorType: typeof word.errorType === 'string' ? (word.errorType as Flashcard['errorType']) : undefined,
    srs:
      typeof word.srs === 'object' && word.srs !== null
        ? {
            dueDate: String((word.srs as Record<string, unknown>).dueDate || new Date().toISOString().slice(0, 10)),
            interval: Number((word.srs as Record<string, unknown>).interval ?? 0),
            ease: Number((word.srs as Record<string, unknown>).ease ?? 2.5),
            lastReviewed:
              typeof (word.srs as Record<string, unknown>).lastReviewed === 'string'
                ? String((word.srs as Record<string, unknown>).lastReviewed)
                : undefined,
            reviewCount: Number((word.srs as Record<string, unknown>).reviewCount ?? 0),
            lapseCount: Number((word.srs as Record<string, unknown>).lapseCount ?? 0),
          }
        : undefined,
  };

  migratedWord.cardType = migratedWord.cardType ?? inferCardType(migratedWord);
  migratedWord.lookupLinks = buildLookupLinks(migratedWord);

  return migratedWord;
}

function migrateList(rawList: unknown): VocabList | null {
  const list = (rawList ?? {}) as Record<string, unknown>;
  const words = Array.isArray(list.words) ? list.words.map(migrateWord).filter((word) => isSupportedLevel(word.level)) : [];

  if (!list.id || !list.title) {
    return null;
  }

  const id = String(list.id);
  const title = String(list.title);

  if (isAdvancedListLike(id, title)) {
    return null;
  }

  return {
    id,
    title,
    isDefault: Boolean(list.isDefault),
    words,
  };
}

function migrateStats(rawStats: unknown): Record<string, WordStats> {
  if (!rawStats || typeof rawStats !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawStats as Record<string, unknown>).map(([wordId, value]) => {
      const stats = (value ?? {}) as Record<string, unknown>;
      return [
        wordId,
        {
          correct: Number(stats.correct ?? 0),
          incorrect: Number(stats.incorrect ?? 0),
          lastReviewed: typeof stats.lastReviewed === 'string' ? stats.lastReviewed : undefined,
          errorCounts:
            typeof stats.errorCounts === 'object' && stats.errorCounts !== null
              ? (stats.errorCounts as WordStats['errorCounts'])
              : undefined,
        },
      ];
    }),
  );
}

export function migrateAppState(rawState: unknown): AppState {
  const base = createDefaultAppState();
  const parsed = (rawState ?? {}) as Record<string, unknown>;
  const incomingLists = Array.isArray(parsed.lists) ? parsed.lists : [];

  const migratedLists = incomingLists
    .map(migrateList)
    .filter((list): list is VocabList => list !== null)
    .filter((list) => list.id !== 'default' && list.id !== 'phrases-daily');

  const latestDefaultLists = createDefaultLists();

  latestDefaultLists.forEach((defaultList) => {
    const existingIndex = migratedLists.findIndex((list) => list.id === defaultList.id);
    if (existingIndex === -1) {
      migratedLists.push(defaultList);
      return;
    }

    migratedLists[existingIndex] = defaultList;
  });

  const studyDirection =
    parsed.studyDirection === 'TR_TO_DE' || parsed.studyDirection === 'DE_TO_TR'
      ? parsed.studyDirection
      : base.studyDirection;

  const aiModel =
    parsed.aiModel === 'gemini-3.1-flash-image-preview' ||
    parsed.aiModel === 'gemini-2.5-flash-image' ||
    parsed.aiModel === 'gemini-3-pro-image-preview'
      ? parsed.aiModel
      : base.aiModel;

  const activeWordIds = new Set(migratedLists.flatMap((list) => list.words.map((word) => word.id)));
  const migratedStats = Object.fromEntries(
    Object.entries(migrateStats(parsed.stats)).filter(([wordId]) => activeWordIds.has(wordId)),
  );

  return {
    lists: migratedLists,
    stats: migratedStats,
    articleLookupCache:
      typeof parsed.articleLookupCache === 'object' && parsed.articleLookupCache !== null
        ? (parsed.articleLookupCache as AppState['articleLookupCache'])
        : base.articleLookupCache,
    studyDirection,
    desiredRetention: Number(parsed.desiredRetention ?? base.desiredRetention),
    dailyNewLimit: Number(parsed.dailyNewLimit ?? base.dailyNewLimit),
    aiModel,
    browserApiKey: typeof parsed.browserApiKey === 'string' ? parsed.browserApiKey : base.browserApiKey,
    installHintDismissed: Boolean(parsed.installHintDismissed),
  };
}
