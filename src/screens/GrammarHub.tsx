import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, LibraryBig, Search, Sparkles } from 'lucide-react';
import { Screen } from '../App';
import { GRAMMAR_SECTIONS, GRAMMAR_SOURCES, GRAMMAR_TOPICS, getGrammarSection, getGrammarSources, getGrammarTopicsBySection } from '../grammarData';
import { GrammarLevel, GrammarSection, GrammarTopic } from '../types';

type GrammarHubProps = {
  onNavigate: (screen: Screen) => void;
};

type LevelFilter = GrammarLevel | 'ALL';

function getLevelChipClassName(level: GrammarLevel): string {
  if (level === 'A1') {
    return 'border-lime-200 bg-lime-50 text-lime-700';
  }

  if (level === 'A2') {
    return 'border-sky-200 bg-sky-50 text-sky-700';
  }

  return 'border-indigo-200 bg-indigo-50 text-indigo-700';
}

function getTopicCountLabel(count: number): string {
  if (count === 1) {
    return '1 konu';
  }

  return `${count} konu`;
}

function matchesTopicSearch(topic: GrammarTopic, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.toLocaleLowerCase('tr-TR');
  const haystack = [
    topic.chapter.toString(),
    topic.title,
    topic.titleTr,
    topic.summary,
    ...topic.highlights,
    ...topic.pitfalls,
  ]
    .join(' ')
    .toLocaleLowerCase('tr-TR');

  return haystack.includes(normalizedQuery);
}

function getSectionTopics(sectionId: GrammarSection['id'], level: LevelFilter, query: string): GrammarTopic[] {
  const sectionTopics = getGrammarTopicsBySection(sectionId);

  return sectionTopics.filter((topic) => {
    const levelMatches = level === 'ALL' ? true : topic.levels.includes(level);
    return levelMatches && matchesTopicSearch(topic, query);
  });
}

export default function GrammarHub({ onNavigate }: GrammarHubProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<GrammarSection['id']>(GRAMMAR_SECTIONS[0].id);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('ALL');
  const [query, setQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0]?.id ?? '');

  const selectedSection = getGrammarSection(selectedSectionId) ?? GRAMMAR_SECTIONS[0];
  const filteredTopics = getSectionTopics(selectedSectionId, selectedLevel, query);
  const allSectionTopics = getGrammarTopicsBySection(selectedSectionId);
  const selectedTopicCandidate =
    filteredTopics.find((topic) => topic.id === selectedTopicId) ??
    allSectionTopics.find((topic) => topic.id === selectedTopicId) ??
    filteredTopics[0] ??
    allSectionTopics[0];
  const selectedTopic = filteredTopics.length > 0 ? selectedTopicCandidate : undefined;
  const sectionSources = getGrammarSources(selectedSection.sourceIds);

  useEffect(() => {
    if (filteredTopics.length === 0) {
      return;
    }

    const hasSelectedTopic = filteredTopics.some((topic) => topic.id === selectedTopicId);
    if (!hasSelectedTopic) {
      setSelectedTopicId(filteredTopics[0].id);
    }
  }, [filteredTopics, selectedTopicId]);

  return (
    <div className="min-h-full bg-[#f6f1e8] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_rgba(246,241,232,0.45)_45%,_rgba(246,241,232,0)_70%)]" />
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => onNavigate({ type: 'dashboard' })}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-white"
            >
              <ArrowLeft size={16} />
              Panele Dön
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
              <Sparkles size={14} />
              Web araştırmasıyla derlendi
            </div>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,_rgba(20,83,45,0.1),_rgba(255,255,255,0.92)_35%,_rgba(217,119,6,0.12))] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_320px]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  <LibraryBig size={14} />
                  Gramer Atlası
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    Kitaptaki bütün gramer konuları artık tek bir sayfada, araştırılmış ve Türkçe açıklanmış durumda.
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                    Görsellerdeki 52 başlığı bölüm, seviye ve konu mantığıyla ayrıştırdım. Her başlık için kısa kural özeti, kalıp, örnek ve dikkat noktaları ekledim.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-2xl font-semibold text-slate-900">{GRAMMAR_TOPICS.length}</div>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Toplam konu</div>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-2xl font-semibold text-slate-900">{GRAMMAR_SECTIONS.length}</div>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Bölüm</div>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
                    <div className="text-2xl font-semibold text-slate-900">{GRAMMAR_SOURCES.length}</div>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Kaynak</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Mevcut bölüm</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold text-slate-900">{selectedSection.title}</div>
                      <div className="text-sm text-slate-500">{selectedSection.titleTr}</div>
                    </div>
                    <div
                      className="h-12 w-12 rounded-2xl border border-white/70 shadow-inner"
                      style={{ backgroundColor: `${selectedSection.color}1A` }}
                    />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{selectedSection.summary}</p>
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Filtre sonucu</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{getTopicCountLabel(filteredTopics.length)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <section className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Konu ara
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Örn: passiv, nicht, dativ..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Seviye filtresi</div>
                  <div className="flex flex-wrap gap-2">
                    {(['ALL', 'A1', 'A2', 'B1'] as LevelFilter[]).map((level) => {
                      const isSelected = selectedLevel === level;
                      const baseClassName =
                        level === 'ALL'
                          ? 'border-slate-200 bg-slate-100 text-slate-700'
                          : getLevelChipClassName(level);

                      return (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`rounded-full border px-3 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                            isSelected ? 'ring-2 ring-slate-300' : ''
                          } ${baseClassName}`}
                        >
                          {level === 'ALL' ? 'Tümü' : level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bölümler</div>
                <div className="space-y-3">
                  {GRAMMAR_SECTIONS.map((section) => {
                    const isSelected = section.id === selectedSectionId;
                    const topicCount = getGrammarTopicsBySection(section.id).length;

                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${
                          isSelected
                            ? 'border-slate-300 bg-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div
                            className="h-3 w-14 rounded-full"
                            style={{ backgroundColor: section.color }}
                          />
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            {getTopicCountLabel(topicCount)}
                          </span>
                        </div>
                        <div className="text-base font-semibold text-slate-900">{section.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{section.titleTr}</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/80 bg-[#1f2937] p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Araştırma notu</div>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Bu içerik, Lingolia başta olmak üzere IDS Grammis ve Deutsche Grammatik 2.0 kaynaklarından sentezlenerek Türkçeleştirildi.
                </p>
              </section>
            </aside>

            <main className="space-y-6">
              <section className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Konu listesi</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{selectedSection.title}</div>
                  </div>
                  <div className={`rounded-full border px-3 py-2 text-xs font-semibold ${selectedSection.accentClassName}`}>
                    {selectedSection.titleTr}
                  </div>
                </div>

                {filteredTopics.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div className="text-lg font-semibold text-slate-900">Eşleşen konu bulunamadı</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Arama kelimesini sadeleştir veya seviye filtresini genişlet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTopics.map((topic) => {
                      const isSelected = topic.id === selectedTopic?.id;

                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`rounded-[24px] border p-4 text-left transition-all ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              Kapitel {topic.chapter}
                            </div>
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {topic.levels.map((level) => (
                                <span
                                  key={level}
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                    isSelected ? 'border-white/20 bg-white/10 text-white' : getLevelChipClassName(level)
                                  }`}
                                >
                                  {level}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-lg font-semibold leading-6">{topic.title}</div>
                          <div className={`mt-2 text-sm leading-6 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {topic.titleTr}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {selectedTopic ? (
                <section className="overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.96))] p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Kapitel {selectedTopic.chapter}
                          </span>
                          {selectedTopic.levels.map((level) => (
                            <span key={level} className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLevelChipClassName(level)}`}>
                              {level}
                            </span>
                          ))}
                        </div>
                        <div>
                          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{selectedTopic.title}</h2>
                          <p className="mt-2 text-base leading-7 text-slate-600 sm:text-lg">{selectedTopic.titleTr}</p>
                        </div>
                      </div>

                      <div
                        className="rounded-[24px] border border-white/70 px-5 py-4 text-right shadow-inner"
                        style={{ backgroundColor: `${selectedSection.color}14` }}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bağlam</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{selectedSection.titleTr}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.2fr)_320px]">
                    <div className="space-y-6">
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Hızlı özet</div>
                        <p className="mt-3 text-base leading-8 text-slate-700">{selectedTopic.summary}</p>
                      </div>

                      {selectedTopic.pattern ? (
                        <div className="rounded-[24px] border border-slate-200 bg-[#111827] p-5 text-white">
                          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Temel kalıp</div>
                          <div className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm leading-7 text-emerald-200">
                            {selectedTopic.pattern}
                          </div>
                        </div>
                      ) : null}

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bu konuda odaklan</div>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          {selectedTopic.highlights.map((highlight) => (
                            <div key={highlight} className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Örnekler</div>
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          {selectedTopic.examples.map((example) => (
                            <div key={example.de} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Deutsch</div>
                              <div className="mt-2 text-lg font-semibold leading-7 text-slate-900">{example.de}</div>
                              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Türkçe</div>
                              <div className="mt-2 text-sm leading-6 text-slate-600">{example.tr}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-[24px] border border-amber-200 bg-amber-50/80 p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Dikkat noktaları</div>
                        <div className="mt-4 space-y-3">
                          {selectedTopic.pitfalls.map((pitfall) => (
                            <div key={pitfall} className="rounded-[18px] border border-amber-200 bg-white/80 px-4 py-4 text-sm leading-6 text-amber-900">
                              {pitfall}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Araştırma kaynakları</div>
                        <div className="mt-4 space-y-3">
                          {sectionSources.map((source) => (
                            <a
                              key={source.id}
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-start justify-between gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-slate-300 hover:bg-white"
                            >
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{source.title}</div>
                                <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{source.provider}</div>
                              </div>
                              <ExternalLink className="shrink-0 text-slate-400" size={16} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
