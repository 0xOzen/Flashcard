import { GermanDictionaryEntry, OFFLINE_GERMAN_DICTIONARY } from '../data/germanDictionary';

export function normalizeDictionaryText(value: string) {
  return value
    .toLocaleLowerCase('de-DE')
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripArticle(value: string) {
  return normalizeDictionaryText(value).replace(/^(der|die|das)\s+/, '');
}

export function findDictionaryTranslations(query: string, direction: 'DE_TR' | 'TR_DE') {
  const needle = normalizeDictionaryText(query);
  const bareNeedle = stripArticle(query);
  if (!needle) return [];

  const exact = OFFLINE_GERMAN_DICTIONARY.filter((entry) => {
    const term = normalizeDictionaryText(entry.term);
    const bareTerm = stripArticle(entry.term);
    const tr = normalizeDictionaryText(entry.tr);
    return direction === 'DE_TR' ? term === needle || bareTerm === bareNeedle : tr === needle || tr.includes(needle);
  });

  if (exact.length) return exact.slice(0, 10);

  return OFFLINE_GERMAN_DICTIONARY.filter((entry) => {
    const term = normalizeDictionaryText(entry.term);
    const bareTerm = stripArticle(entry.term);
    const tr = normalizeDictionaryText(entry.tr);
    return direction === 'DE_TR' ? term.includes(bareNeedle) || needle.includes(term) : tr.includes(needle);
  }).slice(0, 10);
}

export function findDictionaryTokenMatches(query: string) {
  const tokens = normalizeDictionaryText(query)
    .split(' ')
    .filter((token) => token.length > 1);

  if (tokens.length <= 1) return [];

  const matches = tokens
    .map((token) => OFFLINE_GERMAN_DICTIONARY.find((entry) => normalizeDictionaryText(entry.term) === token))
    .filter((entry): entry is GermanDictionaryEntry => Boolean(entry));

  return Array.from(new Map(matches.map((entry) => [normalizeDictionaryText(entry.term), entry])).values());
}

export function findDictionaryArticle(query: string) {
  const needle = stripArticle(query);
  return OFFLINE_GERMAN_DICTIONARY.find((entry) => entry.pos === 'noun' && stripArticle(entry.term) === needle && entry.article);
}

export function findDictionaryArticleMatches(query: string) {
  const needle = stripArticle(query);
  if (!needle) return [];

  return OFFLINE_GERMAN_DICTIONARY.filter((entry) => {
    if (entry.pos !== 'noun' || !entry.article) return false;
    const term = stripArticle(entry.term);
    return term.includes(needle) || getEditDistance(term, needle) <= 1;
  })
    .sort((a, b) => stripArticle(a.term).indexOf(needle) - stripArticle(b.term).indexOf(needle))
    .slice(0, 10);
}

export function findNearestDictionaryArticle(query: string) {
  const needle = stripArticle(query);
  if (!needle || needle.length < 3) return undefined;

  return OFFLINE_GERMAN_DICTIONARY
    .filter((entry) => entry.pos === 'noun' && entry.article)
    .map((entry) => ({ entry, distance: getEditDistance(stripArticle(entry.term), needle) }))
    .filter((item) => item.distance <= 2)
    .sort((a, b) => a.distance - b.distance)[0]?.entry;
}

function getEditDistance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

export function getDictionaryDisplayTerm(entry: GermanDictionaryEntry) {
  return `${entry.article ? `${entry.article} ` : ''}${entry.term}`;
}
