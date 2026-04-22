import { useState } from 'react';
import { Flashcard, WordType } from '../types';
import { Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { generateImageMnemonic } from '../services/gemini';
import { useApp } from '../AppContext';

interface WordEditorItemProps {
  word: Flashcard;
  isDefault?: boolean;
  onUpdate: (id: string, field: keyof Flashcard, value: unknown) => void;
  onRemove: (id: string) => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5 pl-0.5">
    {children}
  </label>
);

export default function WordEditorItem({ word, isDefault, onUpdate, onRemove }: WordEditorItemProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { aiModel, browserApiKey } = useApp();

  const handleGenerateImage = async () => {
    if (!word.term) {
      setImageError('Lutfen once terimi gir.');
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
    } else {
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

  const termLabel = word.wordType === 'noun' ? 'GERMAN NOUN' :
                    word.wordType === 'verb' ? 'GERMAN INFINITIVE' :
                    word.wordType === 'adjective' ? 'GERMAN ADJECTIVE' :
                    word.wordType === 'phrase' ? 'GERMAN PHRASE' : 'GERMAN (TERM)';

  const glossLabel = word.wordType === 'phrase' ? 'ENGLISH MEANING' : 'ENGLISH GLOSS';

  return (
    <div className="p-6 md:p-8 bg-white rounded-[24px] border border-gray-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative group mb-6 transition-all hover:border-gray-300/80">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="w-full sm:w-64">
          <Label>CARD TYPE</Label>
          <select 
            value={word.wordType || 'other'} 
            onChange={(e) => onUpdate(word.id, 'wordType', e.target.value as WordType)}
            disabled={isDefault}
            className="w-full bg-white border border-gray-200 rounded-[14px] px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 transition-all"
          >
            <option value="other">Select...</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="phrase">Phrase</option>
          </select>
        </div>
        <div className="w-full sm:w-32">
          <Label>LEVEL</Label>
          <select 
            value={word.level || ''} 
            onChange={(e) => onUpdate(word.id, 'level', e.target.value)}
            disabled={isDefault}
            className="w-full bg-white border border-gray-200 rounded-[14px] px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 transition-all appearance-none"
          >
             <option value="">N/A</option>
             <option value="A1">A1</option>
             <option value="A2">A2</option>
             <option value="B1">B1</option>
             <option value="B2">B2</option>
             <option value="C1">C1</option>
             <option value="C2">C2</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div>
          <Label>{termLabel}</Label>
          <input value={word.term || ''} onChange={(e) => onUpdate(word.id, 'term', e.target.value)} disabled={isDefault}
                 className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all" />
        </div>
        <div>
          <Label>{glossLabel}</Label>
          <input value={word.translationTr || word.translation || ''} onChange={(e) => onUpdate(word.id, 'translationTr', e.target.value)} disabled={isDefault}
                 className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all" />
        </div>
      </div>

      {/* Noun Type Fields */}
      {word.wordType === 'noun' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div>
            <Label>ARTICLE</Label>
            <select value={word.article || ''} onChange={(e) => onUpdate(word.id, 'article', e.target.value)} disabled={isDefault} 
                    className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all appearance-none cursor-pointer">
              <option value="">Select...</option>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </select>
          </div>
          <div>
            <Label>PLURAL</Label>
            <input value={word.plural || ''} onChange={(e) => onUpdate(word.id, 'plural', e.target.value)} disabled={isDefault} 
                   className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all" />
          </div>
        </div>
      )}

      {/* Verb Type Fields */}
      {word.wordType === 'verb' && (
        <div className="mb-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-5">
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight whitespace-nowrap">Tense snapshots</h4>
            <p className="text-[15px] text-gray-500">Capture the forms learners usually memorize together for German verbs.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] gap-4 mb-4">
            <div>
              <Label>AUXILIARY</Label>
              <select value={word.verbForms?.auxiliary || ''} onChange={(e) => updateVerbForm('auxiliary', e.target.value)} disabled={isDefault} 
                      className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all appearance-none cursor-pointer">
                <option value="">Select</option>
                <option value="haben">haben</option>
                <option value="sein">sein</option>
              </select>
            </div>
            <div>
              <Label>PRESENT 3RD SINGULAR</Label>
              <input value={word.verbForms?.present || ''} onChange={(e) => updateVerbForm('present', e.target.value)} disabled={isDefault} 
                     placeholder="er/sie/es geht"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
            <div>
              <Label>SIMPLE PAST</Label>
              <input value={word.verbForms?.preterite || ''} onChange={(e) => updateVerbForm('preterite', e.target.value)} disabled={isDefault} 
                     placeholder="ging"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>PAST PARTICIPLE</Label>
              <input value={word.verbForms?.participle || ''} onChange={(e) => updateVerbForm('participle', e.target.value)} disabled={isDefault} 
                     placeholder="gegangen"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
            <div>
              <Label>IMPERATIVE</Label>
              <input value={word.verbForms?.imperative || ''} onChange={(e) => updateVerbForm('imperative', e.target.value)} disabled={isDefault} 
                     placeholder="geh!"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
          </div>
          <div className="sm:w-1/2">
            <Label>PATTERN / CASE</Label>
            <input value={word.verbForms?.usagePattern || ''} onChange={(e) => updateVerbForm('usagePattern', e.target.value)} disabled={isDefault} 
                   placeholder="warten auf + Akk"
                   className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
          </div>
        </div>
      )}

      {/* Adjective Type Fields */}
      {word.wordType === 'adjective' && (
        <div className="mb-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-5">
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight whitespace-nowrap">Adjective forms</h4>
            <p className="text-[15px] text-gray-500">Save the forms and usage hints that matter most in comparison drills.</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label>COMPARATIVE</Label>
              <input value={word.adjectiveForms?.comparative || ''} onChange={(e) => updateAdjForm('comparative', e.target.value)} disabled={isDefault} 
                     placeholder="wichtiger"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
            <div>
              <Label>SUPERLATIVE</Label>
              <input value={word.adjectiveForms?.superlative || ''} onChange={(e) => updateAdjForm('superlative', e.target.value)} disabled={isDefault} 
                     placeholder="am wichtigsten"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
            <div>
              <Label>USAGE PATTERN</Label>
              <input value={word.adjectiveForms?.usage || ''} onChange={(e) => updateAdjForm('usage', e.target.value)} disabled={isDefault} 
                     placeholder="wichtig für + Akk"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Phrase Type Fields */}
      {word.wordType === 'phrase' && (
        <div className="mb-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-5">
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight whitespace-nowrap">Expression specifics</h4>
            <p className="text-[15px] text-gray-500">Record common usages (Redemittel) and everyday vernacular (Alltagssprache).</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label>REDEMITTEL / EXPRESSIONS</Label>
              <textarea value={word.phraseForms?.redemittel || ''} onChange={(e) => updatePhraseForm('redemittel', e.target.value)} disabled={isDefault}
                     placeholder="e.g., in diesem Zusammenhang..."
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 resize-y min-h-[90px] transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
            <div>
              <Label>ALLTAGSSPRACHE (EVERYDAY SLANG/USAGE)</Label>
              <textarea value={word.phraseForms?.alltagssprache || ''} onChange={(e) => updatePhraseForm('alltagssprache', e.target.value)} disabled={isDefault} 
                     placeholder="e.g., 'Da hast du recht', 'Echt jetzt?'"
                     className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 resize-y min-h-[90px] transition-all placeholder:font-normal placeholder:text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Global Fields */}
      <div className="space-y-5 mb-5">
        <div>
          <Label>EXAMPLE SENTENCE</Label>
          <textarea value={word.example || ''} onChange={(e) => onUpdate(word.id, 'example', e.target.value)} disabled={isDefault}
             className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 resize-y min-h-[90px] transition-all placeholder:font-normal placeholder:text-gray-400"
          />
        </div>
        <div>
          <Label>EXAMPLE TRANSLATION</Label>
          <input value={word.exampleTranslation || ''} onChange={(e) => onUpdate(word.id, 'exampleTranslation', e.target.value)} disabled={isDefault}
             className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-2.5 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 transition-all placeholder:font-normal placeholder:text-gray-400"
          />
        </div>
        <div>
          <Label>GRAMMAR NOTE</Label>
          <textarea value={word.note || ''} onChange={(e) => onUpdate(word.id, 'note', e.target.value)} disabled={isDefault}
             className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 resize-y min-h-[90px] transition-all placeholder:font-normal placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-4">
        <div className="flex items-center gap-4">
          {word.imageUrl && (
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 shadow-sm">
               <img src={word.imageUrl} alt="Mnemonic" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          )}
          <button 
            onClick={handleGenerateImage} 
            disabled={isGenerating}
            className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:hover:text-gray-600 bg-white border border-gray-200/80 shadow-sm px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            AI Görsel Oluştur
          </button>
        </div>
      </div>

      {imageError && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {imageError}
        </div>
      )}

      {!isDefault && (
        <button onClick={() => onRemove(word.id)} className="absolute -right-3 -top-3 bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full p-2.5 opacity-0 group-hover:opacity-100 shadow-sm transition-all focus:opacity-100 z-10">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
