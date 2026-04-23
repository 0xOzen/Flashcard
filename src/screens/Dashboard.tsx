import { useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Plus, Edit2, Play, Grid2X2, PenTool, LayoutTemplate, ChevronRight, Flame, LibraryBig } from 'lucide-react';
import { GRAMMAR_SECTIONS, GRAMMAR_TOPICS } from '../grammarData';

export default function Dashboard({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists, getOverallProgress, getDifficultWordsList } = useApp();
  const { totalStudied, accuracy } = getOverallProgress();
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const difficultList = getDifficultWordsList();
  const allLists = difficultList ? [difficultList, ...lists] : lists;

  return (
    <div className="max-w-5xl mx-auto p-8 flex flex-col gap-10">
      <section className="bg-white rounded-3xl p-8 border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Genel İlerleme</h2>
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-medium tracking-tight text-gray-900">{accuracy}%</div>
            <div className="text-lg font-medium text-gray-400">başarı</div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50/50 rounded-2xl px-6 py-5 flex flex-col items-center justify-center border border-blue-100/50">
             <span className="text-2xl font-semibold text-blue-600">{totalStudied}</span>
             <span className="text-[11px] font-medium text-blue-600/70 uppercase tracking-wide mt-1">Kelime Çalışıldı</span>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-emerald-200/70 bg-[linear-gradient(135deg,_rgba(236,253,245,0.95),_rgba(255,255,255,0.98),_rgba(254,243,199,0.9))] p-8 shadow-[0_18px_60px_rgba(16,185,129,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <LibraryBig size={14} />
              Yeni Alan
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">Gramer Atlası</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Görsellerdeki tüm gramer başlıklarını tek bir sayfada topladım. Bölüm, seviye ve konu bazında gezebilir; her başlık için Türkçe özet, örnek ve dikkat noktalarını inceleyebilirsin.
            </p>
          </div>

          <button
            onClick={() => onNavigate({ type: 'grammar' })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <LibraryBig size={16} />
            Grameri Aç
          </button>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm">
            <div className="text-2xl font-semibold text-gray-900">{GRAMMAR_TOPICS.length}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Toplam konu</div>
          </div>
          {GRAMMAR_SECTIONS.slice(0, 3).map((section) => (
            <div key={section.id} className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">{section.title}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{section.titleTr}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Listelerim</h2>
          <button 
            onClick={() => onNavigate({ type: 'edit_list', listId: 'new' })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Yeni Liste
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {allLists.map(list => {
            const isDifficultList = list.id === 'difficult-words';
            const isExpanded = expandedListId === list.id;

            return (
              <div 
                key={list.id} 
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? (isDifficultList ? 'border-orange-200/60 shadow-[0_4px_20px_rgb(255,165,0,0.06)]' : 'border-blue-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.04)]') 
                  : (isDifficultList ? 'border-orange-100 shadow-sm hover:border-orange-300' : 'border-gray-200/60 shadow-sm hover:border-gray-300')
                } overflow-hidden`}
              >
                <div 
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer group ${isDifficultList ? 'hover:bg-orange-50/30' : 'hover:bg-gray-50/50'}`}
                  onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-blue-500' : 'text-gray-400'}`}>
                      <ChevronRight size={20} className={isDifficultList ? (isExpanded ? 'text-orange-500' : 'text-orange-400') : ''} />
                    </div>
                    {isDifficultList && <Flame size={18} className="text-orange-500 -ml-1" />}
                    <h3 className={`text-lg font-semibold tracking-tight ${isDifficultList ? 'text-orange-600' : 'text-gray-900'}`}>{list.title}</h3>
                    <span className={`font-medium text-xs px-2.5 py-1 rounded-full ${isDifficultList ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                      {list.words.length} kelime/ifade
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!list.isDefault && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate({ type: 'edit_list', listId: list.id });
                        }}
                        className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Listeyi Düzenle"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={`px-6 pb-6 pt-2 border-t ${isDifficultList ? 'border-orange-100/50 bg-orange-50/10' : 'border-gray-100 bg-gray-50/30'} animate-in slide-in-from-top-2 fade-in duration-200`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <button onClick={() => onNavigate({ type: 'study', mode: 'flashcard', listId: list.id })} className="bg-white hover:bg-blue-50 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 border border-gray-200/60 hover:border-blue-200 hover:text-blue-700 hover:shadow-sm transition-all group/btn">
                        <LayoutTemplate size={16} className="text-blue-500 group-hover/btn:scale-110 transition-transform" /> Kartlar
                      </button>
                      <button onClick={() => onNavigate({ type: 'study', mode: 'quiz', listId: list.id })} className="bg-white hover:bg-emerald-50 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 border border-gray-200/60 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-sm transition-all group/btn">
                        <Play size={16} className="text-emerald-500 group-hover/btn:scale-110 transition-transform" /> Test
                      </button>
                      <button onClick={() => onNavigate({ type: 'study', mode: 'write', listId: list.id })} className="bg-white hover:bg-purple-50 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 border border-gray-200/60 hover:border-purple-200 hover:text-purple-700 hover:shadow-sm transition-all group/btn">
                        <PenTool size={16} className="text-purple-500 group-hover/btn:scale-110 transition-transform" /> Yazma
                      </button>
                      <button onClick={() => onNavigate({ type: 'study', mode: 'match', listId: list.id })} className="bg-white hover:bg-rose-50 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 border border-gray-200/60 hover:border-rose-200 hover:text-rose-700 hover:shadow-sm transition-all group/btn">
                        <Grid2X2 size={16} className="text-rose-500 group-hover/btn:scale-110 transition-transform" /> Eşleştir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
