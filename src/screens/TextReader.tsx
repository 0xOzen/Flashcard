import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpenText, ChevronLeft, Loader2, Pause, Play, Plus, Square, Volume2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { GermanDictionaryEntry, OFFLINE_GERMAN_DICTIONARY } from '../data/germanDictionary';
import { normalizeDictionaryText, stripArticle } from '../lib/offlineDictionary';
import { Flashcard, VocabList, WordType } from '../types';
import { askGermanTool } from '../services/germanTools';

type TextPart =
  | { type: 'text'; value: string; key: string }
  | { type: 'word'; value: string; sentence: string; key: string };

type WordDetail = {
  word: string;
  sentence: string;
  dictionaryEntry?: GermanDictionaryEntry;
  localCard?: Flashcard;
  aiEntry?: AiWordLookup;
};

type AiWordLookup = {
  term: string;
  translationTr: string;
  wordType: WordType;
  typeLabel: string;
  article?: string;
  plural?: string;
  level?: string;
  usageNotes: string[];
  exampleTranslation?: string;
};

const WORD_PATTERN = /[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)*/g;

const POS_LABELS: Record<GermanDictionaryEntry['pos'], string> = {
  noun: 'İsim',
  verb: 'Fiil',
  adjective: 'Sıfat',
  adverb: 'Zarf',
  phrase: 'İfade',
  preposition: 'Edat',
  pronoun: 'Zamir',
  conjunction: 'Bağlaç',
};

function getSentenceAt(text: string, start: number, end: number) {
  const before = Math.max(
    text.lastIndexOf('.', start - 1),
    text.lastIndexOf('!', start - 1),
    text.lastIndexOf('?', start - 1),
    text.lastIndexOf('\n', start - 1),
  );
  const afterIndexes = ['.', '!', '?', '\n']
    .map((mark) => text.indexOf(mark, end))
    .filter((index) => index !== -1);
  const after = afterIndexes.length ? Math.min(...afterIndexes) : text.length;

  return text
    .slice(before + 1, after + (after < text.length && text[after] !== '\n' ? 1 : 0))
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTextParts(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  Array.from(text.matchAll(WORD_PATTERN)).forEach((match, index) => {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    if (start > cursor) {
      parts.push({ type: 'text', value: text.slice(cursor, start), key: `text-${index}-${cursor}` });
    }

    parts.push({ type: 'word', value, sentence: getSentenceAt(text, start, end), key: `word-${index}-${start}` });
    cursor = end;
  });

  if (cursor < text.length) {
    parts.push({ type: 'text', value: text.slice(cursor), key: `text-tail-${cursor}` });
  }

  return parts;
}

function findDictionaryEntry(word: string) {
  const needle = stripArticle(word);
  if (!needle) return undefined;

  return OFFLINE_GERMAN_DICTIONARY.find((entry) => {
    const term = normalizeDictionaryText(entry.term);
    const bareTerm = stripArticle(entry.term);
    return term === needle || bareTerm === needle;
  });
}

function findLocalCard(lists: VocabList[], word: string) {
  const needle = stripArticle(word);
  if (!needle) return undefined;

  return lists
    .flatMap((list) => list.words)
    .find((card) => {
      const term = normalizeDictionaryText(card.term);
      const withArticle = normalizeDictionaryText(`${card.article ? `${card.article} ` : ''}${card.term}`);
      return term === needle || stripArticle(withArticle) === needle;
    });
}

function posToWordType(pos?: GermanDictionaryEntry['pos']): WordType {
  if (pos === 'noun') return 'noun';
  if (pos === 'verb') return 'verb';
  if (pos === 'adjective' || pos === 'adverb') return 'adjective';
  if (pos === 'phrase') return 'phrase';
  return 'other';
}

function buildUsageRows(detail: WordDetail) {
  const { dictionaryEntry, localCard, aiEntry, sentence } = detail;
  const rows = [
    dictionaryEntry?.article ? `Artikel: ${dictionaryEntry.article}` : '',
    dictionaryEntry?.plural
      ? `Çoğul: ${dictionaryEntry.plural}`
      : localCard?.plural
        ? `Çoğul: ${localCard.plural}`
        : aiEntry?.plural
          ? `Çoğul: ${aiEntry.plural}`
          : '',
    dictionaryEntry?.perfekt
      ? `Perfekt: ${dictionaryEntry.perfekt}`
      : localCard?.verbForms?.participle
        ? `Perfekt: ${localCard.verbForms.participle}`
        : '',
    dictionaryEntry?.preterite
      ? `Präteritum: ${dictionaryEntry.preterite}`
      : localCard?.verbForms?.preterite
        ? `Präteritum: ${localCard.verbForms.preterite}`
        : '',
    dictionaryEntry?.rektion
      ? `Kullanım: ${dictionaryEntry.rektion}`
      : localCard?.verbForms?.usagePattern
        ? `Kullanım: ${localCard.verbForms.usagePattern}`
        : '',
    ...(aiEntry?.usageNotes || []),
    dictionaryEntry?.note || localCard?.note || '',
    sentence ? `Bağlam: ${sentence}` : '',
    aiEntry?.exampleTranslation ? `Bağlam çevirisi: ${aiEntry.exampleTranslation}` : '',
  ];

  return rows.filter(Boolean);
}

function createCardFromDetail(detail: WordDetail): Flashcard {
  const entry = detail.dictionaryEntry;
  const localCard = detail.localCard;
  const aiEntry = detail.aiEntry;
  const wordType = entry ? posToWordType(entry.pos) : localCard?.wordType || aiEntry?.wordType || 'other';
  const translationTr = entry?.tr || localCard?.translationTr || localCard?.translation || aiEntry?.translationTr || '';

  return {
    id: crypto.randomUUID(),
    term: entry?.term || localCard?.term || aiEntry?.term || detail.word,
    translationTr,
    wordType,
    cardType: wordType === 'noun' && (entry?.article || aiEntry?.article) ? 'article' : wordType === 'verb' ? 'production' : 'meaning',
    errorType: wordType === 'noun' && (entry?.article || aiEntry?.article) ? 'article' : wordType === 'verb' ? 'verb' : 'meaning',
    article: entry?.article || localCard?.article || aiEntry?.article,
    plural: entry?.plural || localCard?.plural || aiEntry?.plural,
    level: entry?.level || localCard?.level || aiEntry?.level,
    example: detail.sentence || localCard?.example || '',
    exampleTranslation: localCard?.exampleTranslation || aiEntry?.exampleTranslation || '',
    note: entry?.note || localCard?.note || aiEntry?.usageNotes.join(' ') || 'Metin Okuma ekranından eklendi.',
    verbForms:
      wordType === 'verb'
        ? {
            preterite: entry?.preterite || localCard?.verbForms?.preterite,
            participle: entry?.perfekt || localCard?.verbForms?.participle,
            usagePattern: entry?.rektion || localCard?.verbForms?.usagePattern,
          }
        : localCard?.verbForms,
    sourceTags: ['Custom'],
  };
}

function normalizeAiWordType(value: string): WordType {
  const normalized = value.toLocaleLowerCase('tr-TR');
  if (normalized.includes('noun') || normalized.includes('isim') || normalized.includes('nomen')) return 'noun';
  if (normalized.includes('verb') || normalized.includes('fiil')) return 'verb';
  if (normalized.includes('adj') || normalized.includes('sıfat') || normalized.includes('adjektiv')) return 'adjective';
  if (normalized.includes('phrase') || normalized.includes('ifade')) return 'phrase';
  return 'other';
}

function parseAiLookup(text: string, fallbackTerm: string): AiWordLookup {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as Partial<AiWordLookup> & {
        wordType?: string;
        type?: string;
        usageNotes?: unknown;
      };
      const wordType = normalizeAiWordType(parsed.wordType || parsed.type || '');
      return {
        term: parsed.term || fallbackTerm,
        translationTr: parsed.translationTr || '',
        wordType,
        typeLabel: parsed.typeLabel || (wordType === 'other' ? 'Bilinmiyor' : wordType),
        article: parsed.article,
        plural: parsed.plural,
        level: parsed.level,
        usageNotes: Array.isArray(parsed.usageNotes) ? parsed.usageNotes.map(String).filter(Boolean).slice(0, 4) : [],
        exampleTranslation: parsed.exampleTranslation,
      };
    } catch (error) {
      console.error('AI lookup JSON parse failed:', error);
    }
  }

  return {
    term: fallbackTerm,
    translationTr: text.split('\n')[0]?.replace(/^Anlam:\s*/i, '').trim() || text.trim(),
    wordType: 'other',
    typeLabel: 'AI açıklaması',
    usageNotes: text.split('\n').slice(1, 5).map((line) => line.trim()).filter(Boolean),
  };
}

function buildAiLookupPrompt(word: string, sentence: string) {
  return [
    'Sen Almanca-Türkçe öğrenme asistanısın. Almanca metindeki tek bir kelimeyi bağlama göre açıkla.',
    'Yalnızca JSON döndür. Markdown kullanma.',
    'Şema: {"term":"...","translationTr":"...","wordType":"noun|verb|adjective|phrase|other","typeLabel":"Türkçe tür adı","article":"der/die/das veya boş","plural":"...","level":"A1-C1 tahmini","usageNotes":["kısa kullanım notu"],"exampleTranslation":"bağlam cümlesinin Türkçesi"}',
    'Eğer kelime özel isim, Latince ifade veya Almanca olmayan alıntıysa bunu usageNotes içinde belirt.',
    `Kelime: ${word}`,
    `Bağlam: ${sentence || word}`,
  ].join('\n');
}

export default function TextReader({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists, addList, updateList, browserApiKey } = useApp();
  const editableLists = useMemo(() => lists.filter((list) => !list.isDefault), [lists]);
  const [text, setText] = useState('');
  const [selectedWord, setSelectedWord] = useState<{ value: string; sentence: string } | null>(null);
  const [targetListId, setTargetListId] = useState(editableLists[0]?.id || '');
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [generatedLevel, setGeneratedLevel] = useState('A2');
  const [generatedTopic, setGeneratedTopic] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [aiLookups, setAiLookups] = useState<Record<string, AiWordLookup>>({});
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const parts = useMemo(() => splitTextParts(text), [text]);
  const selectedLookupKey = selectedWord ? `${normalizeDictionaryText(selectedWord.value)}|${selectedWord.sentence}` : '';
  const selectedDetail = useMemo<WordDetail | null>(() => {
    if (!selectedWord) return null;

    return {
      word: selectedWord.value,
      sentence: selectedWord.sentence,
      dictionaryEntry: findDictionaryEntry(selectedWord.value),
      localCard: findLocalCard(lists, selectedWord.value),
      aiEntry: aiLookups[selectedLookupKey],
    };
  }, [aiLookups, lists, selectedLookupKey, selectedWord]);
  const usageRows = selectedDetail ? buildUsageRows(selectedDetail) : [];
  const meaning =
    selectedDetail?.dictionaryEntry?.tr ||
    selectedDetail?.localCard?.translationTr ||
    selectedDetail?.localCard?.translation ||
    selectedDetail?.aiEntry?.translationTr ||
    '';
  const wordTypeLabel = selectedDetail?.dictionaryEntry
    ? POS_LABELS[selectedDetail.dictionaryEntry.pos]
    : selectedDetail?.localCard?.wordType || selectedDetail?.aiEntry?.typeLabel || 'Bilinmiyor';
  const selectedList = editableLists.find((list) => list.id === targetListId);
  const selectedTermKey = selectedDetail ? stripArticle(selectedDetail.dictionaryEntry?.term || selectedDetail.localCard?.term || selectedDetail.word) : '';
  const isAlreadyInTarget = Boolean(
    selectedList &&
      selectedTermKey &&
      selectedList.words.some((word) => stripArticle(`${word.article ? `${word.article} ` : ''}${word.term}`) === selectedTermKey),
  );

  useEffect(() => {
    if (!targetListId && editableLists[0]) {
      setTargetListId(editableLists[0].id);
    }
  }, [editableLists, targetListId]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const nextVoices = window.speechSynthesis.getVoices();
      const germanVoices = nextVoices.filter((voice) => voice.lang.toLocaleLowerCase('de-DE').startsWith('de'));
      setVoices(germanVoices.length ? germanVoices : nextVoices);
      setSelectedVoiceURI((current) => current || germanVoices[0]?.voiceURI || nextVoices[0]?.voiceURI || '');
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speakValue = (value: string, mode: 'text' | 'word' = 'text') => {
    if (!value.trim() || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    const voice = voices.find((item) => item.voiceURI === selectedVoiceURI);
    utterance.lang = 'de-DE';
    utterance.voice = voice || null;
    utterance.rate = mode === 'word' ? Math.max(0.65, speechRate - 0.1) : speechRate;
    utterance.pitch = speechPitch;
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const speak = () => speakValue(text);

  const pauseOrResume = () => {
    if (!isReading) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const addSelectedWord = () => {
    if (!selectedDetail || isAlreadyInTarget) return;

    const card = createCardFromDetail(selectedDetail);
    const targetList = editableLists.find((list) => list.id === targetListId);

    if (targetList) {
      updateList(targetList.id, targetList.title, [...targetList.words, card]);
      setSaveMessage(`${card.term} "${targetList.title}" listesine eklendi.`);
    } else {
      addList('Metin Okuma Kelimeleri', [card]);
      setSaveMessage(`${card.term} yeni "Metin Okuma Kelimeleri" listesine eklendi.`);
    }
  };

  const generateText = async () => {
    setIsGeneratingText(true);
    setGenerationError('');
    const topic = generatedTopic.trim() || 'günlük hayatta kısa bir diyalog ve anlatım';
    const result = await askGermanTool(
      [
        'Sen Almanca öğrenen Türkçe ana dilli bir öğrenci için okuma metni yazıyorsun.',
        `Seviye: ${generatedLevel}`,
        `Konu: ${topic}`,
        'Metin sadece Almanca olsun.',
        '120-180 kelime arasında yaz.',
        'Seviyeye uygun kelime ve gramer kullan.',
        'Metinde diyalog varsa tırnak işareti kullanma; kısa ve doğal cümleler kur.',
        'Sonuna Türkçe açıklama, başlık, liste veya markdown ekleme.',
      ].join('\n'),
      browserApiKey || '',
    );

    if (result.ok) {
      setText(result.text.trim());
      setSelectedWord(null);
      setAiLookups({});
      setLookupError('');
      setSaveMessage('');
    } else if ('error' in result) {
      setGenerationError(result.error);
    }

    setIsGeneratingText(false);
  };

  const lookupWithAi = useCallback(async () => {
    if (!selectedWord || !selectedLookupKey) return;

    setIsLookingUp(true);
    setLookupError('');
    const result = await askGermanTool(buildAiLookupPrompt(selectedWord.value, selectedWord.sentence), browserApiKey || '');

    if (result.ok) {
      setAiLookups((previous) => ({
        ...previous,
        [selectedLookupKey]: parseAiLookup(result.text, selectedWord.value),
      }));
    } else if ('error' in result) {
      setLookupError(result.error);
    }

    setIsLookingUp(false);
  }, [browserApiKey, selectedLookupKey, selectedWord]);

  useEffect(() => {
    if (!selectedDetail || meaning || selectedDetail.aiEntry || isLookingUp || lookupError) return;

    void lookupWithAi();
  }, [isLookingUp, lookupError, lookupWithAi, meaning, selectedDetail]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 pb-28 sm:px-6 sm:pb-8 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-claude-border pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary h-9 px-3">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Panele dön</span>
          </button>
          <div className="min-w-0">
            <div className="section-label">
              <BookOpenText size={14} />
              Metin Okuma
            </div>
            <h1 className="mt-2 text-lg font-semibold text-claude-text">Yapıştır, dinle, kelimeyi yakala</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={speak} disabled={!text.trim()} className="button-primary h-9 px-3 disabled:opacity-50">
            <Volume2 size={16} />
            Oku
          </button>
          <button onClick={pauseOrResume} disabled={!isReading} className="button-secondary h-9 px-3 disabled:opacity-50" aria-label={isPaused ? 'Devam ettir' : 'Duraklat'}>
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button onClick={stop} disabled={!isReading} className="button-secondary h-9 px-3 disabled:opacity-50" aria-label="Okumayı durdur">
            <Square size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="codex-panel rounded-[14px] p-4">
          <div className="mb-4 rounded-[12px] border border-claude-border bg-claude-surface p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-claude-text">AI metin oluştur</div>
                <div className="mt-0.5 text-xs text-claude-muted">Seviyeye uygun Almanca okuma metni</div>
              </div>
              <button onClick={generateText} disabled={isGeneratingText} className="button-primary h-9 px-3 disabled:opacity-50">
                {isGeneratingText ? <Loader2 size={16} className="animate-spin" /> : <BookOpenText size={16} />}
                Oluştur
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
              <label className="text-xs font-semibold text-claude-muted">
                Seviye
                <select
                  value={generatedLevel}
                  onChange={(event) => setGeneratedLevel(event.target.value)}
                  className="mt-1 h-10 w-full rounded-[10px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-text outline-none focus:border-claude-accent"
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold text-claude-muted">
                Konu
                <input
                  value={generatedTopic}
                  onChange={(event) => setGeneratedTopic(event.target.value)}
                  placeholder="örn. okul, iş görüşmesi, alışveriş..."
                  className="mt-1 h-10 w-full rounded-[10px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-text outline-none placeholder:text-claude-muted focus:border-claude-accent"
                />
              </label>
            </div>
            {generationError ? <div className="mt-3 rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{generationError}</div> : null}
          </div>

          <div className="mb-4 grid gap-3 rounded-[12px] border border-claude-border bg-claude-surface p-3 sm:grid-cols-[minmax(0,1fr)_150px_150px]">
            <label className="min-w-0 text-xs font-semibold text-claude-muted">
              Ses
              <select
                value={selectedVoiceURI}
                onChange={(event) => setSelectedVoiceURI(event.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-text outline-none focus:border-claude-accent"
              >
                {voices.length ? (
                  voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} · {voice.lang}
                    </option>
                  ))
                ) : (
                  <option value="">Tarayıcı varsayılanı</option>
                )}
              </select>
            </label>
            <label className="text-xs font-semibold text-claude-muted">
              Hız {speechRate.toFixed(1)}x
              <input
                type="range"
                min={0.6}
                max={1.2}
                step={0.1}
                value={speechRate}
                onChange={(event) => setSpeechRate(Number(event.target.value))}
                className="mt-4 h-2 w-full accent-claude-accent"
              />
            </label>
            <label className="text-xs font-semibold text-claude-muted">
              Ton {speechPitch.toFixed(1)}
              <input
                type="range"
                min={0.8}
                max={1.2}
                step={0.1}
                value={speechPitch}
                onChange={(event) => setSpeechPitch(Number(event.target.value))}
                className="mt-4 h-2 w-full accent-claude-accent"
              />
            </label>
          </div>

          <label className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Almanca metin</label>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setSaveMessage('');
            }}
            placeholder="Okumak istediğin Almanca metni buraya yapıştır..."
            className="mt-2 min-h-[180px] w-full resize-y rounded-[12px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-7 text-claude-text outline-none focus:border-claude-accent"
          />

          <div className="mt-4 rounded-[12px] border border-claude-border bg-claude-surface p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-claude-text">Okuma metni</div>
              <div className="text-xs text-claude-muted">{parts.filter((part) => part.type === 'word').length} kelime</div>
            </div>
            {text.trim() ? (
              <div className="max-h-[520px] overflow-y-auto whitespace-pre-wrap text-[15px] leading-8 text-claude-subtle">
                {parts.map((part) =>
                  part.type === 'word' ? (
                    <button
                      key={part.key}
                      type="button"
                      onClick={() => {
                        setSelectedWord({ value: part.value, sentence: part.sentence });
                        setLookupError('');
                        setSaveMessage('');
                      }}
                      className={`rounded-[6px] px-0.5 font-medium transition-colors hover:bg-claude-accentSoft hover:text-claude-text ${
                        selectedWord?.value === part.value && selectedWord?.sentence === part.sentence ? 'bg-claude-accentSoft text-claude-text' : ''
                      }`}
                    >
                      {part.value}
                    </button>
                  ) : (
                    <span key={part.key}>{part.value}</span>
                  ),
                )}
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-claude-border px-4 py-10 text-center text-sm leading-6 text-claude-muted">
                Metni yapıştırınca kelimeler burada tıklanabilir hale gelir.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-[76px] lg:self-start">
          <section className="codex-panel rounded-[14px] p-4">
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Kelime detayı</div>
            {selectedDetail ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-semibold text-claude-text">
                      {selectedDetail.dictionaryEntry?.article || selectedDetail.aiEntry?.article ? `${selectedDetail.dictionaryEntry?.article || selectedDetail.aiEntry?.article} ` : ''}
                      {selectedDetail.dictionaryEntry?.term || selectedDetail.localCard?.term || selectedDetail.aiEntry?.term || selectedDetail.word}
                    </div>
                    <div className="mt-1 text-sm text-claude-muted">{wordTypeLabel}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetail.dictionaryEntry?.level || selectedDetail.localCard?.level || selectedDetail.aiEntry?.level ? (
                      <span className="badge bg-claude-accentSoft text-claude-accent">{selectedDetail.dictionaryEntry?.level || selectedDetail.localCard?.level || selectedDetail.aiEntry?.level}</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => speakValue(selectedDetail.dictionaryEntry?.term || selectedDetail.localCard?.term || selectedDetail.aiEntry?.term || selectedDetail.word, 'word')}
                      className="button-secondary h-8 px-2"
                      aria-label="Kelimeyi seslendir"
                      title="Kelimeyi seslendir"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">Türkçe anlam</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-claude-text">
                    {meaning || (isLookingUp ? 'Bağlama göre çözülüyor...' : 'Sözlükte yok; AI ile bağlamdan çözebilirsin.')}
                  </div>
                </div>

                {!meaning ? (
                  <button onClick={lookupWithAi} disabled={isLookingUp} className="button-secondary mt-3 w-full justify-center disabled:opacity-50">
                    {isLookingUp ? <Loader2 size={16} className="animate-spin" /> : <BookOpenText size={16} />}
                    AI ile bağlamdan çöz
                  </button>
                ) : null}
                {lookupError ? <div className="mt-3 rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{lookupError}</div> : null}

                <div className="mt-3 space-y-2">
                  {usageRows.map((row) => (
                    <div key={row} className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-2 text-sm leading-6 text-claude-subtle">
                      {row}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm leading-6 text-claude-muted">Bir kelimeye tıkladığında anlamı, türü ve kullanım bilgileri burada açılır.</div>
            )}
          </section>

          <section className="codex-panel rounded-[14px] p-4">
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Listeye ekle</div>
            <select
              value={targetListId}
              onChange={(event) => setTargetListId(event.target.value)}
              className="mt-3 h-10 w-full rounded-[10px] border border-claude-border bg-claude-surface px-3 text-sm font-semibold text-claude-text outline-none focus:border-claude-accent"
            >
              {editableLists.length ? (
                editableLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title} · {list.words.length} kelime
                  </option>
                ))
              ) : (
                <option value="">Yeni Metin Okuma listesi</option>
              )}
            </select>
            <button
              onClick={addSelectedWord}
              disabled={!selectedDetail || isAlreadyInTarget}
              className="button-primary mt-3 w-full justify-center disabled:opacity-50"
            >
              <Plus size={16} />
              {isAlreadyInTarget ? 'Zaten listede' : 'Ekle'}
            </button>
            {saveMessage ? <div className="mt-3 text-sm font-semibold text-claude-success">{saveMessage}</div> : null}
            {!editableLists.length ? (
              <div className="mt-3 text-sm leading-6 text-claude-muted">Özel listen yoksa ilk eklemede otomatik bir liste oluşturulur.</div>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
