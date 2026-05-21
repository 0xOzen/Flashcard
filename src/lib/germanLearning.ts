import { ErrorType, Flashcard, GermanCardType, LookupLinks, ReviewGrade } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

export const CARD_TYPE_LABELS: Record<GermanCardType, string> = {
  meaning: 'Anlam',
  production: 'Üretim',
  article: 'Artikel',
  plural: 'Çoğul',
  verb_form: 'Fiil çekimi',
  perfekt: 'Perfekt',
  case_government: 'Kasus/Rektion',
  preposition: 'Edat',
  sentence_pattern: 'Cümle kalıbı',
  redemittel: 'Redemittel',
  error_correction: 'Hata düzeltme',
  pronunciation: 'Telaffuz',
};

export const ERROR_TYPE_LABELS: Record<ErrorType, string> = {
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

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days: number, base = new Date()): string {
  const next = new Date(base.getTime() + Math.max(0, days) * DAY_MS);
  return next.toISOString().slice(0, 10);
}

export function inferCardType(card: Flashcard): GermanCardType {
  if (card.cardType) return card.cardType;
  if (card.wordType === 'noun' && card.article) return 'article';
  if (card.wordType === 'verb' && card.verbForms?.participle) return 'perfekt';
  if (card.wordType === 'phrase' && card.phraseForms?.redemittel) return 'redemittel';
  return 'meaning';
}

export function inferErrorType(card: Flashcard): ErrorType {
  if (card.errorType) return card.errorType;
  const cardType = inferCardType(card);
  if (cardType === 'article') return 'article';
  if (cardType === 'plural') return 'plural';
  if (cardType === 'verb_form' || cardType === 'perfekt') return 'verb';
  if (cardType === 'case_government') return 'case';
  if (cardType === 'preposition') return 'preposition';
  if (cardType === 'sentence_pattern') return 'word_order';
  if (cardType === 'redemittel') return 'redemittel';
  if (cardType === 'pronunciation') return 'pronunciation';
  return 'meaning';
}

export function isDue(card: Flashcard, dateIso = todayIso()): boolean {
  return !card.srs?.dueDate || card.srs.dueDate <= dateIso;
}

export function scheduleReview(card: Flashcard, grade: ReviewGrade): Flashcard {
  const current = card.srs ?? {
    dueDate: todayIso(),
    interval: 0,
    ease: 2.5,
    reviewCount: 0,
    lapseCount: 0,
  };

  let ease = current.ease;
  let interval = current.interval;
  let lapseCount = current.lapseCount;

  if (grade === 'again') {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
    lapseCount += 1;
  } else if (grade === 'hard') {
    interval = Math.max(1, Math.round(interval * 1.2) || 2);
    ease = Math.max(1.3, ease - 0.05);
  } else if (grade === 'good') {
    interval = interval <= 0 ? 3 : Math.max(3, Math.round(interval * ease));
  } else {
    interval = interval <= 0 ? 5 : Math.max(5, Math.round(interval * (ease + 0.35)));
    ease = Math.min(3.2, ease + 0.15);
  }

  return {
    ...card,
    srs: {
      dueDate: addDaysIso(interval),
      interval,
      ease,
      lastReviewed: todayIso(),
      reviewCount: current.reviewCount + 1,
      lapseCount,
    },
  };
}

export function getGermanTask(card: Flashcard, direction: 'DE_TO_TR' | 'TR_TO_DE' = 'DE_TO_TR') {
  const translation = card.translationTr || card.translationEn || card.translation || '';
  const cardType = inferCardType(card);

  if (card.prompt && card.answer) {
    return {
      label: CARD_TYPE_LABELS[cardType],
      question: card.prompt,
      answer: card.answer,
      acceptedAnswers: [card.answer],
    };
  }

  if (cardType === 'article' && card.wordType === 'noun') {
    return {
      label: 'Artikel sorusu',
      question: `___ ${card.term}`,
      answer: `${card.article || ''} ${card.term}`.trim(),
      acceptedAnswers: [card.article || '', `${card.article || ''} ${card.term}`.trim()].filter(Boolean),
    };
  }

  if (cardType === 'plural' && card.plural) {
    return {
      label: 'Çoğul sorusu',
      question: `${card.article ? `${card.article} ` : ''}${card.term}`,
      answer: card.plural,
      acceptedAnswers: [card.plural],
    };
  }

  if (cardType === 'perfekt' && card.verbForms?.participle) {
    const auxiliary = card.verbForms.auxiliary === 'sein' ? 'ist' : card.verbForms.auxiliary === 'haben' ? 'hat' : card.verbForms.auxiliary || '';
    return {
      label: 'Perfekt sorusu',
      question: `${card.term} fiilinin Perfekt hali`,
      answer: `${auxiliary} ${card.verbForms.participle}`.trim(),
      acceptedAnswers: [`${auxiliary} ${card.verbForms.participle}`.trim(), card.verbForms.participle],
    };
  }

  if (cardType === 'verb_form' && card.verbForms?.preterite) {
    return {
      label: 'Fiil çekimi',
      question: `${card.term} / Präteritum`,
      answer: card.verbForms.preterite,
      acceptedAnswers: [card.verbForms.preterite],
    };
  }

  if (direction === 'TR_TO_DE') {
    return {
      label: 'Türkçe -> Almanca',
      question: translation,
      answer: `${card.article && card.wordType === 'noun' ? `${card.article} ` : ''}${card.term}`.trim(),
      acceptedAnswers: [card.term, `${card.article || ''} ${card.term}`.trim()].filter(Boolean),
    };
  }

  return {
    label: 'Almanca -> Türkçe',
    question: `${card.article && card.wordType === 'noun' ? `${card.article} ` : ''}${card.term}`.trim(),
    answer: translation,
    acceptedAnswers: [translation],
  };
}

export function normalizeAnswer(value: string): string {
  return value
    .toLocaleLowerCase('de-DE')
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAnswerCorrect(input: string, acceptedAnswers: string[]): boolean {
  const normalizedInput = normalizeAnswer(input);
  return acceptedAnswers.some((answer) => normalizeAnswer(answer) === normalizedInput);
}

export function buildLookupLinks(card: Flashcard): LookupLinks {
  const query = encodeURIComponent(card.term);
  return {
    duden: `https://www.duden.de/suchen/dudenonline/${query}`,
    dwds: `https://www.dwds.de/wb/${query}`,
    wiktionary: `https://de.wiktionary.org/wiki/${query}`,
    verbformen: card.wordType === 'verb' ? `https://www.verbformen.de/konjugation/${query}.htm` : undefined,
    youglish: `https://youglish.com/pronounce/${query}/german`,
    forvo: `https://forvo.com/word/${query}/#de`,
    ...card.lookupLinks,
  };
}

export function estimateDailyLoad(cards: Flashcard[], desiredRetention = 0.9): number {
  const due = cards.filter((card) => isDue(card)).length;
  const pressure = desiredRetention >= 0.95 ? 1.35 : desiredRetention >= 0.9 ? 1.15 : 1;
  return Math.ceil(due * pressure);
}
