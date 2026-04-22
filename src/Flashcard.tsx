import { motion } from 'motion/react';
import { useState } from 'react';
import { Flashcard as FlashcardType } from './types';
import { RefreshCcw, Volume2 } from 'lucide-react';

interface FlashcardProps { 
  card: FlashcardType; 
  studyDirection?: 'DE_TO_TR' | 'TR_TO_DE';
}

export default function Flashcard({ card, studyDirection = 'DE_TO_TR' }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const displayTranslation = card.translationTr || card.translationEn || card.translation || '';

  const playAudioTerm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.term);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  const frontText = studyDirection === 'TR_TO_DE' ? displayTranslation : card.term;
  const backText = studyDirection === 'TR_TO_DE' ? card.term : displayTranslation;
  const frontArticle = studyDirection === 'TR_TO_DE' ? null : card.article;
  const backArticle = studyDirection === 'TR_TO_DE' ? card.article : null;

  return (
    <div className="w-full max-w-sm aspect-[4/5] [perspective:1000px] mx-auto select-none relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE (Term + Image + Grammar) */}
        <div 
          className="absolute w-full h-full flex flex-col p-6 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 backface-hidden overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {card.imageUrl && studyDirection !== 'TR_TO_DE' ? (
            <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 shrink-0 bg-gray-50 border border-gray-100">
              <img src={card.imageUrl} alt="Mnemonic" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex-1 flex flex-col justify-center items-center text-center w-full">
            {card.level && (
              <div className="flex gap-2 mb-3">
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-[6px] tracking-wide ${
                  card.level.includes('A1') ? 'bg-green-100 text-green-700' :
                  card.level.includes('A2') ? 'bg-emerald-100 text-emerald-700' :
                  card.level.includes('B1') ? 'bg-blue-100 text-blue-700' :
                  card.level.includes('B2') ? 'bg-indigo-100 text-indigo-700' :
                  card.level.includes('C1') ? 'bg-purple-100 text-purple-700' :
                  card.level.includes('C2') ? 'bg-rose-100 text-rose-700' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {card.level}
                </span>
              </div>
            )}
          
            <div className="flex items-baseline justify-center gap-2 flex-wrap mb-2 relative group/audio">
              {card.wordType === 'noun' && frontArticle && (
                <span className="text-2xl font-medium text-gray-400 italic">{frontArticle}</span>
              )}
              <h2 className="text-4xl font-semibold text-gray-900 tracking-tight break-words">
                {frontText}
              </h2>
              {studyDirection === 'DE_TO_TR' && (
                <button 
                  onClick={playAudioTerm}
                  className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all active:scale-95"
                  title="Telaffuzu Dinle"
                >
                  <Volume2 size={24} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Additional Grammar Info */}
            <div className="mt-4 flex flex-col w-full px-2">
               {card.wordType === 'noun' && card.plural && (
                  <div className="flex items-center justify-between py-2 border-t border-gray-100/80">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plural</span>
                     <span className="text-[15px] font-medium text-gray-800">{card.plural}</span>
                  </div>
               )}
               {card.wordType === 'verb' && card.verbForms && (
                  <div className="flex flex-col w-full mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-3 text-left">
                       <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100">
                         <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Present (or 3rd)</div>
                         <div className="text-[13px] font-medium text-gray-800 px-0.5">{card.verbForms.present ? `er/sie/es ${card.verbForms.present}` : '-'}</div>
                       </div>
                       <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100">
                         <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Simple Past</div>
                         <div className="text-[13px] font-medium text-gray-800 px-0.5">{card.verbForms.preterite || '-'}</div>
                       </div>
                       <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100">
                         <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Participle</div>
                         <div className="text-[13px] font-medium text-gray-800 px-0.5">{card.verbForms.auxiliary ? (card.verbForms.auxiliary === 'sein' ? 'ist ' : card.verbForms.auxiliary === 'haben' ? 'hat ' : card.verbForms.auxiliary + ' ') : ''}{card.verbForms.participle || '-'}</div>
                       </div>
                       <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100">
                         <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Imperative</div>
                         <div className="text-[13px] font-medium text-gray-800 px-0.5">{card.verbForms.imperative || '-'}</div>
                       </div>
                    </div>
                    {card.verbForms.usagePattern && (
                      <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-100/50 text-left">
                         <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Pattern</div>
                         <div className="text-[13px] font-medium text-blue-900 px-0.5">{card.verbForms.usagePattern}</div>
                      </div>
                    )}
                  </div>
               )}
               {card.wordType === 'adjective' && card.adjectiveForms && (
                  <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                    <div className="flex justify-between w-full py-2 border-t border-gray-100/80">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest self-center">Comp.</span>
                      <span className="text-[14px] font-medium text-gray-800">{card.adjectiveForms.comparative || '-'}</span>
                    </div>
                    <div className="flex justify-between w-full py-2 border-t border-gray-100/80">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest self-center">Superlative</span>
                      <span className="text-[14px] font-medium text-gray-800">{card.adjectiveForms.superlative || '-'}</span>
                    </div>
                    {card.adjectiveForms.usage && (
                       <div className="flex justify-between w-full py-2 border-t border-gray-100/80 text-left">
                         <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest self-center">Usage</span>
                         <span className="text-[14px] font-medium text-gray-800 text-right">{card.adjectiveForms.usage}</span>
                       </div>
                    )}
                  </div>
               )}
               {card.wordType === 'phrase' && card.phraseForms && (
                  <div className="flex flex-col w-full mt-2 space-y-2">
                    {card.phraseForms.redemittel && (
                       <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100 text-left">
                         <div className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Redemittel</div>
                         <div className="text-[13px] font-medium text-orange-900 px-0.5 whitespace-pre-line leading-relaxed">{card.phraseForms.redemittel}</div>
                       </div>
                    )}
                    {card.phraseForms.alltagssprache && (
                       <div className="bg-pink-50/50 rounded-xl p-3 border border-pink-100 text-left">
                         <div className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mb-1.5 mt-0.5 ml-0.5">Alltagssprache</div>
                         <div className="text-[13px] font-medium text-pink-900 px-0.5 whitespace-pre-line leading-relaxed">{card.phraseForms.alltagssprache}</div>
                       </div>
                    )}
                  </div>
               )}
            </div>
          </div>
          <div className="mt-auto pt-4 w-full flex justify-center opacity-40 group-hover:opacity-100 transition-opacity pb-2 shrink-0">
            <RefreshCcw size={20} className="text-gray-400" />
          </div>
        </div>

        {/* BACK SIDE (Translation + Examples + Note) */}
        <div 
          className="absolute w-full h-full flex flex-col items-center justify-center p-8 bg-[#1d1d1f] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-[#2d2d2f] backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex flex-col justify-center items-center text-center w-full">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-6 border border-gray-700/50 px-3 py-1 rounded-full flex gap-2">
              <span>{studyDirection === 'TR_TO_DE' ? 'ALMANCA' : 'ÇEVİRİ'}</span>
            </div>
            
            <div className="flex items-baseline justify-center gap-2 flex-wrap mb-8 relative group/audio">
              {card.wordType === 'noun' && backArticle && (
                <span className="text-2xl font-medium text-gray-400 italic">{backArticle}</span>
              )}
              <h2 className="text-4xl font-semibold text-white tracking-tight break-words">
                {backText}
              </h2>
              {studyDirection === 'TR_TO_DE' && (
                <button 
                  onClick={playAudioTerm}
                  className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-all active:scale-95"
                  title="Telaffuzu Dinle"
                >
                  <Volume2 size={24} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {(card.example || card.exampleTranslation) && (
              <div className="mt-2 space-y-4 w-full">
                {card.example && (
                  <p className="text-gray-300 text-[15px] font-medium leading-relaxed">
                    "{card.example}"
                  </p>
                )}
                {card.exampleTranslation && (
                  <p className="text-gray-500 text-sm">
                    {card.exampleTranslation}
                  </p>
                )}
              </div>
            )}
            
            {card.note && (
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 w-full text-left">
                 <div className="text-amber-500/80 text-[10px] uppercase font-bold tracking-widest mb-1.5">Note</div>
                 <p className="text-amber-200/90 text-sm font-medium leading-relaxed">{card.note}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
