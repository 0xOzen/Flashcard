import { useState, type ReactNode } from 'react';
import { Flashcard, WordType } from '../types';
import { ChevronDown, Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { generateImageMnemonic } from '../services/gemini';
import { useApp } from '../AppContext';

interface WordEditorItemProps {
  key?: string;
  word: Flashcard;
  isDefault?: boolean;
  onUpdate: (id: string, field: keyof Flashcard, value: unknown) => void;
  onRemove: (id: string) => void;
}

const Label = ({ children }: { children: ReactNode }) => (
  <label className="mb-2 block pl-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-claude-muted">{children}</label>
);

const inputClassName =
  'w-full rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5 text-[15px] font-medium text-claude-text outline-none transition-all placeholder:font-normal placeholder:text-claude-muted focus:border-claude-accent focus:ring-4 focus:ring-claude-accent/10 disabled:opacity-50';

const textareaClassName = `${inputClassName} min-h-[96px] resize-y`;

export default function WordEditorItem({ word, isDefault, onUpdate, onRemove }: WordEditorItemProps) {
  const hasAdvancedFields = Boolean(
    word.article ||
      word.plural ||
      word.verbForms ||
      word.adjectiveForms ||
      word.phraseForms ||
      word.example ||
      word.exampleTranslation ||
      word.note ||
      word.imageUrl,
  );
  const [showDetails, setShowDetails] = useState(hasAdvancedFields);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { aiModel, browserApiKey } = useApp();

  const handleGenerateImage = async () => {
    if (!word.term) {
      setImageError('Lütfen önce terimi gir.');
      return;
    }

    const safeTranslation = word.translationTr || word.translationEn || word.translation || '';
    setIsGenerating(true);
    setImageError(null);

    const result = await generateImageMnemonic(
      word.term,
      safeTranslation,
      aiModel || 'gemini-3.1-flash-image-preview',
      browserApiKey || '',
    );

    if (result.ok) {
      onUpdate(word.id, 'imageUrl', result.imageUrl);
    } else if ('error' in result) {
      setImageError(result.error);
    }

    setIsGenerating(false);
  };

  const updateVerbForm = (field: string, value: string) => {
    const updated = { ...(word.verbForms || {}), [field]: value };
    onUpdate(word.id, 'verbForms', updated);
  };

  const updateAdjForm = (field: string, value: string) => {
    const updated = { ...(word.adjectiveForms || {}), [field]: value };
    onUpdate(word.id, 'adjectiveForms', updated);
  };

  const updatePhraseForm = (field: string, value: string) => {
    const updated = { ...(word.phraseForms || {}), [field]: value };
    onUpdate(word.id, 'phraseForms', updated);
  };

  const termLabel =
    word.wordType === 'noun'
      ? 'Almanca isim'
      : word.wordType === 'verb'
        ? 'Almanca fiil'
        : word.wordType === 'adjective'
          ? 'Almanca sıfat'
          : word.wordType === 'phrase'
            ? 'Almanca ifade'
            : 'Almanca terim';

  const glossLabel = word.wordType === 'phrase' ? 'Türkçe anlam' : 'Türkçe karşılık';

  return (
    <div className="group relative overflow-hidden rounded-[18px] border border-claude-border bg-claude-panel p-4 shadow-soft transition-all hover:border-claude-border sm:p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-[220px_140px]">
          <div>
            <Label>Kart türü</Label>
            <select
              value={word.wordType || 'other'}
              onChange={(event) => onUpdate(word.id, 'wordType', event.target.value as WordType)}
              disabled={isDefault}
              className={inputClassName}
            >
              <option value="other">Seç...</option>
              <option value="noun">İsim</option>
              <option value="verb">Fiil</option>
              <option value="adjective">Sıfat</option>
              <option value="phrase">İfade</option>
            </select>
          </div>
          <div>
            <Label>Seviye</Label>
            <select value={word.level || ''} onChange={(event) => onUpdate(word.id, 'level', event.target.value)} disabled={isDefault} className={inputClassName}>
              <option value="">Yok</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
        </div>

        {!isDefault ? (
          <button
            onClick={() => onRemove(word.id)}
            className="inline-flex items-center gap-2 self-start rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 opacity-100 transition-colors hover:bg-rose-100 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <Trash2 size={15} />
            Kaldır
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label>{termLabel}</Label>
          <input value={word.term || ''} onChange={(event) => onUpdate(word.id, 'term', event.target.value)} disabled={isDefault} className={inputClassName} />
        </div>
        <div>
          <Label>{glossLabel}</Label>
          <input
            value={word.translationTr || word.translation || ''}
            onChange={(event) => onUpdate(word.id, 'translationTr', event.target.value)}
            disabled={isDefault}
            className={inputClassName}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((previous) => !previous)}
        className="mt-5 flex w-full items-center justify-between rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5 text-left text-sm font-semibold text-claude-subtle transition-colors hover:text-claude-text"
        aria-expanded={showDetails}
      >
        <span>Detaylar</span>
        <ChevronDown size={16} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
      </button>

      {showDetails ? (
        <>
      {word.wordType === 'noun' ? (
        <div className="mt-5 grid gap-5 border-t border-claude-border pt-5 md:grid-cols-2">
          <div>
            <Label>Artikel</Label>
            <select value={word.article || ''} onChange={(event) => onUpdate(word.id, 'article', event.target.value)} disabled={isDefault} className={inputClassName}>
              <option value="">Seç...</option>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </select>
          </div>
          <div>
            <Label>Çoğul</Label>
            <input value={word.plural || ''} onChange={(event) => onUpdate(word.id, 'plural', event.target.value)} disabled={isDefault} className={inputClassName} />
          </div>
        </div>
      ) : null}

      {word.wordType === 'verb' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">Fiil çekimleri</h4>
            <p className="text-sm leading-6 text-claude-muted">Fiili kartlarda daha kullanışlı hale getiren temel biçimler.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <Label>Yardımcı fiil</Label>
              <select value={word.verbForms?.auxiliary || ''} onChange={(event) => updateVerbForm('auxiliary', event.target.value)} disabled={isDefault} className={inputClassName}>
                <option value="">Seç</option>
                <option value="haben">haben</option>
                <option value="sein">sein</option>
              </select>
            </div>
            <div>
              <Label>Präsens</Label>
              <input value={word.verbForms?.present || ''} onChange={(event) => updateVerbForm('present', event.target.value)} disabled={isDefault} placeholder="er/sie/es geht" className={inputClassName} />
            </div>
            <div>
              <Label>Präteritum</Label>
              <input value={word.verbForms?.preterite || ''} onChange={(event) => updateVerbForm('preterite', event.target.value)} disabled={isDefault} placeholder="ging" className={inputClassName} />
            </div>
            <div>
              <Label>Perfekt</Label>
              <input value={word.verbForms?.participle || ''} onChange={(event) => updateVerbForm('participle', event.target.value)} disabled={isDefault} placeholder="gegangen" className={inputClassName} />
            </div>
            <div>
              <Label>Imperativ</Label>
              <input value={word.verbForms?.imperative || ''} onChange={(event) => updateVerbForm('imperative', event.target.value)} disabled={isDefault} placeholder="geh!" className={inputClassName} />
            </div>
            <div>
              <Label>Kullanım / hal</Label>
              <input value={word.verbForms?.usagePattern || ''} onChange={(event) => updateVerbForm('usagePattern', event.target.value)} disabled={isDefault} placeholder="warten auf + Akk" className={inputClassName} />
            </div>
          </div>
        </div>
      ) : null}

      {word.wordType === 'adjective' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">Sıfat biçimleri</h4>
            <p className="text-sm leading-6 text-claude-muted">Karşılaştırma ve kullanım bilgileri burada dursun.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Komparativ</Label>
              <input value={word.adjectiveForms?.comparative || ''} onChange={(event) => updateAdjForm('comparative', event.target.value)} disabled={isDefault} placeholder="wichtiger" className={inputClassName} />
            </div>
            <div>
              <Label>Superlativ</Label>
              <input value={word.adjectiveForms?.superlative || ''} onChange={(event) => updateAdjForm('superlative', event.target.value)} disabled={isDefault} placeholder="am wichtigsten" className={inputClassName} />
            </div>
            <div>
              <Label>Kullanım kalıbı</Label>
              <input value={word.adjectiveForms?.usage || ''} onChange={(event) => updateAdjForm('usage', event.target.value)} disabled={isDefault} placeholder="wichtig für + Akk" className={inputClassName} />
            </div>
          </div>
        </div>
      ) : null}

      {word.wordType === 'phrase' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">İfade detayları</h4>
            <p className="text-sm leading-6 text-claude-muted">Kalıp ve gündelik kullanım varyasyonları burada saklanır.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Redemittel / kalıplar</Label>
              <textarea value={word.phraseForms?.redemittel || ''} onChange={(event) => updatePhraseForm('redemittel', event.target.value)} disabled={isDefault} placeholder="örn. in diesem Zusammenhang..." className={textareaClassName} />
            </div>
            <div>
              <Label>Alltagssprache</Label>
              <textarea value={word.phraseForms?.alltagssprache || ''} onChange={(event) => updatePhraseForm('alltagssprache', event.target.value)} disabled={isDefault} placeholder="örn. Da hast du recht" className={textareaClassName} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 border-t border-claude-border pt-5">
        <div className="grid gap-5">
          <div>
            <Label>Örnek cümle</Label>
            <textarea value={word.example || ''} onChange={(event) => onUpdate(word.id, 'example', event.target.value)} disabled={isDefault} className={textareaClassName} />
          </div>
          <div>
            <Label>Örnek çeviri</Label>
            <input value={word.exampleTranslation || ''} onChange={(event) => onUpdate(word.id, 'exampleTranslation', event.target.value)} disabled={isDefault} className={inputClassName} />
          </div>
          <div>
            <Label>Dilbilgisi notu</Label>
            <textarea value={word.note || ''} onChange={(event) => onUpdate(word.id, 'note', event.target.value)} disabled={isDefault} className={textareaClassName} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-claude-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {word.imageUrl ? (
            <div className="h-16 w-16 overflow-hidden rounded-[14px] border border-claude-border bg-claude-surface shadow-sm">
              <img src={word.imageUrl} alt="Hatırlatıcı görsel" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="button-secondary"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            AI görsel oluştur
          </button>
        </div>

        <div className="text-sm leading-6 text-claude-muted">Terim ve çeviri doluysa hatırlatıcı görsel üretebilirsin.</div>
      </div>

      {imageError ? <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{imageError}</div> : null}
        </>
      ) : null}
    </div>
  );
}
