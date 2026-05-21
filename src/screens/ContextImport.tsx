import { useMemo, useState } from 'react';
import { ChevronLeft, FileText, Plus, Wand2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';

const STOP_WORDS = new Set([
  'ich',
  'du',
  'er',
  'sie',
  'es',
  'wir',
  'ihr',
  'der',
  'die',
  'das',
  'den',
  'dem',
  'ein',
  'eine',
  'und',
  'oder',
  'aber',
  'weil',
  'dass',
  'ist',
  'sind',
  'war',
  'waren',
  'haben',
  'sein',
  'mit',
  'für',
  'auf',
  'in',
  'im',
  'am',
  'zu',
  'von',
]);

function inferArticle(sentence: string, word: string) {
  const match = sentence.match(new RegExp(`\\b(der|die|das)\\s+${word}\\b`, 'i'));
  return match?.[1]?.toLowerCase();
}

function inferLevel(word: string) {
  if (word.length <= 5) return 'A1-A2';
  return 'B1';
}

function extractCards(text: string): Flashcard[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const seen = new Set<string>();

  return sentences.flatMap((sentence, sentenceIndex): Flashcard[] => {
    const words = sentence.match(/[A-Za-zÄÖÜäöüß-]{4,}/g) || [];
    return words
      .map((rawWord) => rawWord.replace(/^-|-$/g, ''))
      .filter((word) => word && !STOP_WORDS.has(word.toLocaleLowerCase('de-DE')))
      .slice(0, 4)
      .map((word, wordIndex): Flashcard | null => {
        const normalized = word.toLocaleLowerCase('de-DE');
        if (seen.has(normalized)) return null;
        seen.add(normalized);

        const article = inferArticle(sentence, word);
        return {
          id: `import_${Date.now()}_${sentenceIndex}_${wordIndex}`,
          term: word,
          translationTr: '',
          wordType: article ? 'noun' : word.endsWith('en') ? 'verb' : 'other',
          cardType: article ? 'article' : word.endsWith('en') ? 'production' : 'meaning',
          errorType: article ? 'article' : word.endsWith('en') ? 'verb' : 'meaning',
          article,
          level: inferLevel(word),
          example: sentence,
          exampleTranslation: '',
          note: 'Context Import ile üretildi. Türkçe anlamı ve çekim alanlarını düzenleyicide tamamlayabilirsin.',
          sourceTags: ['Custom'],
        };
      })
      .filter((card): card is Flashcard => Boolean(card));
  });
}

export default function ContextImport({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { addList } = useApp();
  const [title, setTitle] = useState('Metinden Gelen Almanca Kartlar');
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const cards = useMemo(() => extractCards(text).slice(0, 40), [text]);

  const saveCards = () => {
    if (!cards.length || !title.trim()) return;
    addList(title.trim(), cards);
    setSaved(true);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-claude-border pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary h-9 px-3">
            <ChevronLeft size={16} />
            Panele dön
          </button>
          <div>
            <div className="section-label">
              <FileText size={14} />
              Context Import
            </div>
            <h1 className="mt-2 text-lg font-semibold text-claude-text">Almanca metinden kart çıkar</h1>
          </div>
        </div>
        <button onClick={saveCards} disabled={!cards.length} className="button-primary h-9 px-3 disabled:opacity-50">
          <Plus size={16} />
          Liste oluştur
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="codex-panel rounded-[14px] p-4">
          <label className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Liste adı</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5 text-sm font-semibold text-claude-text outline-none focus:border-claude-accent" />

          <label className="mt-5 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Almanca metin</label>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setSaved(false);
            }}
            placeholder="Makale, YouTube transcript veya kendi okuma metnini buraya yapıştır..."
            className="mt-2 min-h-[320px] w-full resize-y rounded-[12px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-7 text-claude-text outline-none focus:border-claude-accent"
          />
          {saved ? <div className="mt-3 text-sm font-semibold text-claude-success">Liste oluşturuldu. Panelden seçip düzenleyebilirsin.</div> : null}
        </section>

        <aside className="codex-panel rounded-[14px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <Wand2 size={16} className="text-claude-accent" />
            Önerilen kartlar
          </div>
          <div className="mt-3 space-y-2">
            {cards.length ? (
              cards.map((card) => (
                <div key={card.id} className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-claude-text">{card.article ? `${card.article} ` : ''}{card.term}</span>
                    <span className="text-xs text-claude-muted">{card.level}</span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs leading-5 text-claude-muted">{card.example}</div>
                </div>
              ))
            ) : (
              <div className="text-sm leading-6 text-claude-muted">Metin girdikçe isim, fiil ve bağlam cümleleri burada görünür.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
