export type WordType = 'noun' | 'verb' | 'adjective' | 'phrase' | 'other';

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
};

export type AppState = {
  lists: VocabList[];
  stats: Record<string, WordStats>;
  studyDirection?: 'DE_TO_TR' | 'TR_TO_DE';
  aiModel?: 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
  browserApiKey?: string;
  installHintDismissed?: boolean;
};
