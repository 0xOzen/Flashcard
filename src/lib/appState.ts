import { AppState, Flashcard, VocabList, WordStats } from '../types';
import {
  LIST_ADJS,
  LIST_NOUNS,
  LIST_PHRASES_A1,
  LIST_PHRASES_A2,
  LIST_PHRASES_B1,
  LIST_PHRASES_B2,
  LIST_PHRASES_C1,
  LIST_VERBS,
} from '../extendedLists';

const DEFAULT_DIRECTION: AppState['studyDirection'] = 'DE_TO_TR';
const DEFAULT_AI_MODEL: NonNullable<AppState['aiModel']> = 'gemini-3.1-flash-image-preview';

const ALL_DEFAULT_LISTS: VocabList[] = [
  LIST_VERBS,
  LIST_ADJS,
  LIST_NOUNS,
  LIST_PHRASES_A1,
  LIST_PHRASES_A2,
  LIST_PHRASES_B1,
  LIST_PHRASES_B2,
  LIST_PHRASES_C1,
];

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
    studyDirection: DEFAULT_DIRECTION,
    aiModel: DEFAULT_AI_MODEL,
    browserApiKey: '',
    installHintDismissed: false,
  };
}

function migrateWord(rawWord: unknown): Flashcard {
  const word = (rawWord ?? {}) as Record<string, unknown>;

  return {
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
  };
}

function migrateList(rawList: unknown): VocabList | null {
  const list = (rawList ?? {}) as Record<string, unknown>;
  const words = Array.isArray(list.words) ? list.words.map(migrateWord) : [];

  if (!list.id || !list.title) {
    return null;
  }

  return {
    id: String(list.id),
    title: String(list.title),
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

  return {
    lists: migratedLists,
    stats: migrateStats(parsed.stats),
    studyDirection,
    aiModel,
    browserApiKey: typeof parsed.browserApiKey === 'string' ? parsed.browserApiKey : base.browserApiKey,
    installHintDismissed: Boolean(parsed.installHintDismissed),
  };
}
