import { useMemo, useState } from 'react';
import { BookMarked, ChevronLeft, ExternalLink, Loader2, Search, Wand2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import { findDictionaryArticle, findDictionaryArticleMatches, findNearestDictionaryArticle } from '../lib/offlineDictionary';
import { GermanDictionaryEntry } from '../data/germanDictionary';
import { verifyArticleOnline } from '../services/articleLookup';

const feminineEndings = ['ung', 'heit', 'keit', 'schaft', 'tion', 'tät', 'ik', 'ei', 'in'];
const neuterEndings = ['chen', 'lein', 'ment', 'um', 'nis'];
const masculineEndings = ['er', 'ling', 'ismus', 'or'];

function normalize(value: string) {
  return value.toLocaleLowerCase('de-DE').replace(/[.,!?;:]/g, '').trim();
}

function findArticle(cards: Flashcard[], query: string) {
  const needle = normalize(query).replace(/^(der|die|das)\s+/, '');
  return cards.find((card) => card.wordType === 'noun' && normalize(card.term) === needle && card.article);
}

function findArticleMatches(cards: Flashcard[], query: string) {
  const needle = normalize(query).replace(/^(der|die|das)\s+/, '');
  if (!needle) return [];

  return cards
    .filter((card) => card.wordType === 'noun' && card.article && normalize(card.term).includes(needle))
    .sort((a, b) => normalize(a.term).indexOf(needle) - normalize(b.term).indexOf(needle))
    .slice(0, 10);
}

type ArticleCandidate =
  | { source: 'dictionary'; id: string; term: string; tr: string; article?: 'der' | 'die' | 'das'; plural?: string }
  | { source: 'cache'; id: string; term: string; tr: string; article?: 'der' | 'die' | 'das'; plural?: string; sourceUrl?: string }
  | { source: 'list'; id: string; term: string; tr: string; article?: string; plural?: string };

function getArticleTone(article?: string) {
  if (article === 'der') return 'border-sky-200 bg-sky-50 text-sky-800';
  if (article === 'die') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (article === 'das') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return 'border-claude-border bg-claude-surface text-claude-subtle';
}

function guessArticle(word: string) {
  const normalized = normalize(word).replace(/^(der|die|das)\s+/, '');

  if (feminineEndings.some((ending) => normalized.endsWith(ending))) {
    return { article: 'die', confidence: 'yüksek', reason: `-${feminineEndings.find((ending) => normalized.endsWith(ending))} son eki genelde die alır.` };
  }

  if (neuterEndings.some((ending) => normalized.endsWith(ending))) {
    return { article: 'das', confidence: 'orta', reason: `-${neuterEndings.find((ending) => normalized.endsWith(ending))} son eki çoğunlukla das alır.` };
  }

  if (masculineEndings.some((ending) => normalized.endsWith(ending))) {
    return { article: 'der', confidence: 'orta', reason: `-${masculineEndings.find((ending) => normalized.endsWith(ending))} son eki sıkça der alır.` };
  }

  return { article: 'der / die / das', confidence: 'düşük', reason: 'Bu kelime için güçlü bir son ek ipucu yok. Sözlükte yakın eşleşme varsa aşağıda önerilir.' };
}

function getEndingSignals(word: string) {
  const normalized = normalize(word).replace(/^(der|die|das)\s+/, '');
  const groups = [
    { article: 'die', endings: feminineEndings },
    { article: 'das', endings: neuterEndings },
    { article: 'der', endings: masculineEndings },
  ];

  return groups.flatMap((group) =>
    group.endings.map((ending) => ({
      ...group,
      ending,
      active: normalized.endsWith(ending),
    })),
  );
}

export default function ArticleFinder({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists, articleLookupCache, saveArticleLookup } = useApp();
  const cards = useMemo(() => lists.flatMap((list) => list.words), [lists]);
  const [query, setQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const cacheKey = normalize(query).replace(/^(der|die|das)\s+/, '');
  const cachedArticle = cacheKey ? articleLookupCache?.[cacheKey] : undefined;
  const dictionaryArticle = useMemo(() => findDictionaryArticle(query), [query]);
  const nearestDictionaryArticle = useMemo(() => findNearestDictionaryArticle(query), [query]);
  const localArticle = useMemo(() => findArticle(cards, query), [cards, query]);
  const activeArticle = dictionaryArticle || cachedArticle || localArticle || nearestDictionaryArticle;
  const dictionaryMatches = useMemo(() => findDictionaryArticleMatches(query), [query]);
  const localMatches = useMemo(() => findArticleMatches(cards, query), [cards, query]);
  const articleMatches = useMemo<ArticleCandidate[]>(() => {
    const dictionaryCandidates = dictionaryMatches.map((entry: GermanDictionaryEntry) => ({
      source: 'dictionary' as const,
      id: `dict-${entry.term}`,
      term: entry.term,
      tr: entry.tr,
      article: entry.article,
      plural: entry.plural,
    }));
    const listCandidates = localMatches.map((card) => ({
      source: 'list' as const,
      id: `list-${card.id}`,
      term: card.term,
      tr: card.translationTr || card.translation || '',
      article: card.article,
      plural: card.plural,
    }));
    const cacheCandidate = cachedArticle
      ? [
          {
            source: 'cache' as const,
            id: `cache-${cachedArticle.term}`,
            term: cachedArticle.term,
            tr: 'Web doğrulandı',
            article: cachedArticle.article,
            plural: cachedArticle.plural,
            sourceUrl: cachedArticle.sourceUrl,
          },
        ]
      : [];
    const seen = new Set<string>();
    return [...dictionaryCandidates, ...cacheCandidate, ...listCandidates].filter((candidate) => {
      const key = `${candidate.article}-${candidate.term.toLocaleLowerCase('de-DE')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [cachedArticle, dictionaryMatches, localMatches]);
  const articleGuess = useMemo(() => guessArticle(query), [query]);
  const endingSignals = useMemo(() => getEndingSignals(query), [query]);
  const articleStats = useMemo(() => {
    const counts = { der: 0, die: 0, das: 0 };
    articleMatches.forEach((card) => {
      if (card.article === 'der' || card.article === 'die' || card.article === 'das') {
        counts[card.article] += 1;
      }
    });
    return counts;
  }, [articleMatches]);

  const handleVerifyOnline = async () => {
    if (!query.trim()) return;

    setIsVerifying(true);
    setVerificationError('');
    const result = await verifyArticleOnline(query);
    if (result.ok) {
      saveArticleLookup(query, result.entry);
    } else if ('error' in result) {
      setVerificationError(result.error);
    }
    setIsVerifying(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 border-b border-claude-border pb-4">
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary h-9 px-3">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Panele dön</span>
        </button>
        <div className="mt-4 min-w-0">
          <div className="section-label">
            <BookMarked size={14} />
            Artikel Bulucu
          </div>
          <h1 className="mt-2 text-lg font-semibold text-claude-text">Canlı artikel bulucu</h1>
        </div>
      </div>

      <section className="codex-panel rounded-[14px] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-claude-muted" size={16} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVerificationError('');
            }}
            placeholder="örn. Entwicklung, Tisch, Mädchen"
            className="w-full rounded-[12px] border border-claude-border bg-claude-surface py-3 pl-10 pr-4 text-sm font-semibold text-claude-text outline-none focus:border-claude-accent"
          />
        </div>

        {query.trim() ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(['der', 'die', 'das'] as const).map((article) => {
              const isActive = activeArticle?.article === article || (!activeArticle && articleGuess.article === article);
              return (
                <div
                  key={article}
                  className={`rounded-[12px] border px-3 py-2 text-center transition-all ${
                    isActive ? getArticleTone(article) : 'border-claude-border bg-claude-surface text-claude-muted'
                  }`}
                >
                  <div className="text-lg font-semibold">{article}</div>
                  <div className="text-[11px] opacity-75">{articleStats[article]} eşleşme</div>
                </div>
              );
            })}
          </div>
        ) : null}

        {query.trim() ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={handleVerifyOnline} disabled={isVerifying} className="button-secondary h-9 px-3 disabled:opacity-50">
              {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
              Web'de doğrula
            </button>
            {cachedArticle?.sourceUrl ? (
              <a href={cachedArticle.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-claude-muted underline-offset-4 hover:text-claude-text hover:underline">
                Kaynak
              </a>
            ) : null}
            {verificationError ? <span className="text-sm font-semibold text-claude-warning">{verificationError}</span> : null}
          </div>
        ) : null}

        {query.trim() ? (
          <div className="mt-4 rounded-[12px] border border-claude-border bg-claude-surface p-4">
            {activeArticle ? (
              <>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">
                  {dictionaryArticle ? 'Sözlük eşleşmesi' : cachedArticle ? 'Web doğrulaması' : localArticle ? 'Liste eşleşmesi' : 'Yakın sözlük eşleşmesi'}
                </div>
                <div className={`mt-2 inline-flex rounded-[12px] border px-4 py-3 text-3xl font-semibold ${getArticleTone(activeArticle.article)}`}>
                  {activeArticle.article} {activeArticle.term}
                </div>
                <div className="mt-2 text-sm text-claude-muted">
                  {dictionaryArticle || nearestDictionaryArticle ? (dictionaryArticle || nearestDictionaryArticle)?.tr : cachedArticle ? 'Doğrulanmış artikel sonucu' : localArticle?.translationTr}
                </div>
                {!dictionaryArticle && !localArticle && nearestDictionaryArticle ? (
                  <div className="mt-2 text-sm font-semibold text-claude-warning">Bunu mu demek istedin?</div>
                ) : null}
                {activeArticle.plural ? <div className="mt-2 text-sm font-semibold text-claude-subtle">Çoğul: {activeArticle.plural}</div> : null}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">
                  <Wand2 size={13} />
                  Canlı son ek tahmini
                </div>
                <div className={`mt-2 inline-flex rounded-[12px] border px-4 py-3 text-3xl font-semibold ${getArticleTone(articleGuess.article)}`}>
                  {articleGuess.article}
                </div>
                <div className="mt-2 text-sm text-claude-muted">Güven: {articleGuess.confidence}</div>
                <div className="mt-2 text-sm leading-6 text-claude-subtle">{articleGuess.reason}</div>
              </>
            )}
          </div>
        ) : null}

        {query.trim() ? (
          <div className="mt-4 rounded-[12px] border border-claude-border bg-claude-surface p-3">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">Son ek sinyalleri</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {endingSignals.map((signal) => (
                <span
                  key={`${signal.article}-${signal.ending}`}
                  className={`rounded-[9px] border px-2.5 py-1 text-xs font-semibold ${
                    signal.active ? getArticleTone(signal.article) : 'border-claude-border bg-claude-panel text-claude-muted'
                  }`}
                >
                  -{signal.ending} {'->'} {signal.article}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {articleMatches.length > 0 ? (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">Yazarken bulunanlar</div>
            {articleMatches.map((card) => (
              <button
                key={card.id}
                onClick={() => setQuery(card.term)}
                className="flex w-full items-center justify-between gap-3 rounded-[10px] border border-claude-border bg-claude-surface px-3 py-2 text-left transition-colors hover:border-claude-accent/40"
              >
                <span>
                  <span className="font-semibold text-claude-text">{card.article} {card.term}</span>
                  <span className="ml-2 text-sm text-claude-muted">{card.tr}</span>
                </span>
                <span className={`rounded-[8px] border px-2 py-1 text-xs font-semibold ${getArticleTone(card.article)}`}>
                  {card.article}
                </span>
              </button>
            ))}
          </div>
        ) : null}

      </section>
    </div>
  );
}
