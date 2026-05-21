export type WordType = 'noun' | 'verb' | 'adjective' | 'phrase' | 'other';

export type GermanCardType =
  | 'meaning'
  | 'production'
  | 'article'
  | 'plural'
  | 'verb_form'
  | 'perfekt'
  | 'case_government'
  | 'preposition'
  | 'sentence_pattern'
  | 'redemittel'
  | 'error_correction'
  | 'pronunciation';

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export type ErrorType =
  | 'meaning'
  | 'article'
  | 'plural'
  | 'verb'
  | 'case'
  | 'preposition'
  | 'word_order'
  | 'redemittel'
  | 'pronunciation'
  | 'other';

export type SourceTag =
  | 'Goethe'
  | 'telc'
  | 'OESD'
  | 'DW'
  | 'Duden'
  | 'DWDS'
  | 'Wiktionary'
  | 'Verbformen'
  | 'Forvo'
  | 'Redemittel'
  | 'TurkishSpeakerErrors'
  | 'Custom';

export type LookupLinks = {
  duden?: string;
  dwds?: string;
  wiktionary?: string;
  verbformen?: string;
  youglish?: string;
  forvo?: string;
};

export type ArticleLookupCacheEntry = {
  term: string;
  article: 'der' | 'die' | 'das';
  plural?: string;
  sourceUrl?: string;
  checkedAt: string;
};

export type Flashcard = {
  id: string;
  term: string;
  translationEn?: string;
  translationTr?: string;
  translation?: string; // Fallback
  
  level?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;

  wordType?: WordType;
  cardType?: GermanCardType;
  sourceTags?: SourceTag[];
  lookupLinks?: LookupLinks;
  prompt?: string;
  answer?: string;
  distractors?: string[];
  errorType?: ErrorType;
  srs?: {
    dueDate: string;
    interval: number;
    ease: number;
    lastReviewed?: string;
    reviewCount: number;
    lapseCount: number;
  };
  
  // Noun
  article?: string;
  plural?: string;
  
  // Verb
  verbForms?: {
    auxiliary?: string;
    present?: string;
    conjugation?: string;
    preterite?: string;
    participle?: string;
    imperative?: string;
    usagePattern?: string;
  };
  
  // Adjective
  adjectiveForms?: {
    comparative?: string;
    superlative?: string;
    usage?: string;
  };

  // Phrase
  phraseForms?: {
    redemittel?: string;
    alltagssprache?: string;
  };

  imageUrl?: string;
};

export type VocabList = {
  id: string;
  title: string;
  isDefault?: boolean;
  words: Flashcard[];
};

export type WordStats = {
  correct: number;
  incorrect: number;
  lastReviewed?: string;
  errorCounts?: Partial<Record<ErrorType, number>>;
};

export type AppState = {
  lists: VocabList[];
  stats: Record<string, WordStats>;
  articleLookupCache?: Record<string, ArticleLookupCacheEntry>;
  studyDirection?: 'DE_TO_TR' | 'TR_TO_DE';
  desiredRetention?: number;
  dailyNewLimit?: number;
  aiModel?: 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
  browserApiKey?: string;
  installHintDismissed?: boolean;
};

export type GrammarLevel = 'A1' | 'A2' | 'B1';

export type GrammarSectionId =
  | 'verben'
  | 'nomen-artikel-pronomen'
  | 'adjektive-adverbien'
  | 'praepositionen'
  | 'wortbildung'
  | 'einfache-saetze'
  | 'zusammengesetzte-saetze';

export type GrammarSource = {
  id: string;
  title: string;
  url: string;
  provider: string;
};

export type GrammarTopicExample = {
  de: string;
  tr: string;
};

export type GrammarTopic = {
  id: string;
  chapter: number;
  sectionId: GrammarSectionId;
  title: string;
  titleTr: string;
  levels: GrammarLevel[];
  summary: string;
  pattern?: string;
  highlights: string[];
  examples: GrammarTopicExample[];
  pitfalls: string[];
};

export type GrammarSection = {
  id: GrammarSectionId;
  title: string;
  titleTr: string;
  color: string;
  accentClassName: string;
  summary: string;
  sourceIds: string[];
};
