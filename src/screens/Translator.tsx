import { useMemo, useState } from 'react';
import { ChevronLeft, Languages, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import { askGermanTool } from '../services/germanTools';
import { findDictionaryTokenMatches, findDictionaryTranslations, getDictionaryDisplayTerm } from '../lib/offlineDictionary';

type Direction = 'DE_TR' | 'TR_DE';

function normalize(value: string) {
  return value.toLocaleLowerCase('de-DE').replace(/[.,!?;:]/g, '').trim();
}

function findLocalTranslation(cards: Flashcard[], query: string, direction: Direction) {
  const needle = normalize(query);
  if (!needle) return [];

  return cards
    .filter((card) => {
      const german = normalize(`${card.article ? `${card.article} ` : ''}${card.term}`);
      const germanBare = normalize(card.term);
      const turkish = normalize(card.translationTr || card.translation || card.translationEn || '');
      return direction === 'DE_TR' ? german === needle || germanBare === needle : turkish.includes(needle);
    })
    .slice(0, 10);
}

function buildTranslatePrompt(query: string, direction: Direction) {
  const pair = direction === 'DE_TR' ? 'Almanca -> Türkçe' : 'Türkçe -> Almanca';
  return [
    `Sen Almanca-Türkçe öğrenme asistanısın. ${pair} çeviri yap.`,
    'Cevabı kısa, sözlük/kart uygulamasına uygun ver.',
    'Almanca isim varsa artikelini ve çoğulunu ekle.',
    'Fiil varsa Perfekt yardımcı fiilini ve kısa rektion bilgisini ekle.',
    'Telifli sözlük tanımı gibi uzun alıntı yapma; özgün açıklama yaz.',
    `Girdi: ${query}`,
  ].join('\n');
}

export default function Translator({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists, browserApiKey } = useApp();
  const cards = useMemo(() => lists.flatMap((list) => list.words), [lists]);
  const [direction, setDirection] = useState<Direction>('DE_TR');
  const [query, setQuery] = useState('');
  const [aiTranslation, setAiTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dictionaryTranslations = useMemo(() => findDictionaryTranslations(query, direction), [query, direction]);
  const tokenTranslations = useMemo(() => findDictionaryTokenMatches(query), [query]);
  const localTranslations = useMemo(() => findLocalTranslation(cards, query, direction), [cards, query, direction]);

  const runTranslate = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError('');
    setAiTranslation('');
    const result = await askGermanTool(buildTranslatePrompt(query, direction), browserApiKey || '');
    if (result.ok) {
      setAiTranslation(result.text);
    } else if ('error' in result) {
      setError(result.error);
    }
    setIsLoading(false);
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
            <Languages size={14} />
            Translator
          </div>
          <h1 className="mt-2 text-lg font-semibold text-claude-text">Almanca-Türkçe çeviri</h1>
        </div>
      </div>

      <section className="codex-panel rounded-[14px] p-4">
        <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-claude-border bg-claude-surface p-1">
          {[
            ['DE_TR', 'Almanca -> Türkçe'],
            ['TR_DE', 'Türkçe -> Almanca'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setDirection(value as Direction)}
              className={`rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors ${
                direction === value ? 'bg-claude-panel text-claude-text shadow-soft' : 'text-claude-muted hover:text-claude-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <textarea
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setAiTranslation('');
            setError('');
          }}
          placeholder="Kelime, ifade veya kısa cümle yaz..."
          className="mt-4 min-h-[180px] w-full resize-y rounded-[12px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-7 text-claude-text outline-none focus:border-claude-accent"
        />

        <button onClick={runTranslate} disabled={!query.trim() || isLoading} className="button-primary mt-3 h-9 px-3 disabled:opacity-50">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          AI ile çevir
        </button>

        <div className="mt-4 space-y-2">
          {dictionaryTranslations.length > 0 ? (
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">Sözlük sonucu</div>
              <div className="space-y-2">
                {dictionaryTranslations.map((entry) => (
                  <div key={`${entry.term}-${entry.pos}`} className="border-t border-claude-border pt-2 first:border-t-0 first:pt-0">
                    <div className="font-semibold text-claude-text">{getDictionaryDisplayTerm(entry)}</div>
                    <div className="mt-1 text-sm text-claude-muted">{entry.tr}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-claude-muted">
                      <span>{entry.pos}</span>
                      {entry.plural ? <span>Çoğul: {entry.plural}</span> : null}
                      {entry.perfekt ? <span>Perfekt: {entry.perfekt}</span> : null}
                      {entry.rektion ? <span>{entry.rektion}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {dictionaryTranslations.length === 0 && tokenTranslations.length > 0 ? (
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">Kelime kelime offline çözüm</div>
              <div className="flex flex-wrap gap-2">
                {tokenTranslations.map((entry) => (
                  <span key={`${entry.term}-${entry.pos}`} className="rounded-[9px] border border-claude-border bg-claude-panel px-2.5 py-1 text-xs font-semibold text-claude-subtle">
                    {getDictionaryDisplayTerm(entry)} = {entry.tr}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {localTranslations.map((card) => (
            <div key={card.id} className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-2">
              <div className="font-semibold text-claude-text">
                {card.article ? `${card.article} ` : ''}
                {card.term}
              </div>
              <div className="mt-1 text-sm text-claude-muted">{card.translationTr || card.translation}</div>
            </div>
          ))}
          {aiTranslation ? <pre className="whitespace-pre-wrap rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3 text-sm leading-6 text-claude-subtle">{aiTranslation}</pre> : null}
          {error ? <div className="rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{error}</div> : null}
        </div>
      </section>
    </div>
  );
}
