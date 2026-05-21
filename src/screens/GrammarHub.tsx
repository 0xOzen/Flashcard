import { GRAMMAR_TOPICS, getGrammarSection, getGrammarTopicsBySection } from '../grammarData';
import { GrammarLevel, GrammarSection, GrammarTopic } from '../types';

export type GrammarSectionFilter = GrammarSection['id'] | 'ALL';
export type GrammarLevelFilter = GrammarLevel | 'ALL';

type GrammarHubProps = {
  selectedSectionFilter: GrammarSectionFilter;
  selectedLevel: GrammarLevelFilter;
  query: string;
  selectedTopicId: string;
};

function getTopicCountLabel(count: number): string {
  return count === 1 ? '1 konu' : `${count} konu`;
}

function getTopicsForSection(sectionFilter: GrammarSectionFilter): GrammarTopic[] {
  return sectionFilter === 'ALL' ? GRAMMAR_TOPICS : getGrammarTopicsBySection(sectionFilter);
}

function matchesTopicSearch(topic: GrammarTopic, query: string): boolean {
  if (!query.trim()) return true;

  const normalizedQuery = query.toLocaleLowerCase('tr-TR');
  const haystack = [topic.chapter.toString(), topic.title, topic.titleTr, topic.summary, ...topic.highlights, ...topic.pitfalls]
    .join(' ')
    .toLocaleLowerCase('tr-TR');

  return haystack.includes(normalizedQuery);
}

function getFilteredTopics(sectionFilter: GrammarSectionFilter, level: GrammarLevelFilter, query: string): GrammarTopic[] {
  return getTopicsForSection(sectionFilter).filter((topic) => {
    const levelMatches = level === 'ALL' ? true : topic.levels.includes(level);
    return levelMatches && matchesTopicSearch(topic, query);
  });
}

function getGrammarExplanation(topic: GrammarTopic): string[] {
  const primaryExample = topic.examples[0];
  const focusBySection: Record<GrammarSection['id'], string> = {
    verben: 'çekimli fiili, varsa ikinci fiil parçasını ve yardımcı fiil seçimini birlikte kontrol etmek',
    'nomen-artikel-pronomen': 'artikel, sayı ve kasus bilgisini tek paket olarak görmek',
    'adjektive-adverbien': 'niteliğin cümlede isimden önce mi, fiilden sonra mı yoksa zarf göreviyle mi durduğunu ayırmak',
    praepositionen: 'edatı tek başına değil, istediği kasus ve anlam ilişkisiyle birlikte öğrenmek',
    wortbildung: 'kökü, eki, birleşen parçaları ve özellikle son unsurun görevini bulmak',
    'einfache-saetze': 'çekimli fiilin yerini, özneyi ve ek bilgilerin cümledeki sırasını birlikte okumak',
    'zusammengesetzte-saetze': 'bağlacın kurduğu anlam ilişkisini ve yan cümlede fiilin nereye gittiğini izlemek',
  };
  const patternNote = topic.pattern
    ? `Temel kalıp olarak "${topic.pattern}" çizgisini takip et. Bu kalıp, önce iskeleti görmeni, sonra değişen parçaları kontrollü biçimde yerleştirmeni sağlar.`
    : 'Bu konuyu tek bir ezber cümlesiyle değil, cümlede hangi görevi üstlendiğini görerek çalışmak daha kalıcı olur.';
  const usageNotes = topic.highlights.slice(0, 2).join(' ');
  const exampleNote = primaryExample
    ? `"${primaryExample.de}" örneğinde yapı gerçek bir cümle içinde görünür: ${primaryExample.tr} Bu yüzden sadece kuralı değil, kuralın cümlede nerede durduğunu da takip et.`
    : 'Örnekleri okurken önce çekimli fiili, sonra artikel/kasus veya ikinci fiil parçasını bulmak yapıyı daha görünür kılar.';
  const pitfallNote = topic.pitfalls[0]
    ? `En kritik nokta: ${topic.pitfalls[0]} Bu hatayı azaltmak için yeni cümle kurarken ${focusBySection[topic.sectionId]} iyi bir kontrol alışkanlığıdır.`
    : `Yeni cümle kurarken ${focusBySection[topic.sectionId]} iyi bir kontrol alışkanlığıdır.`;

  return [
    patternNote,
    `${usageNotes} ${exampleNote}`,
    pitfallNote,
  ];
}

export default function GrammarHub({
  selectedSectionFilter,
  selectedLevel,
  query,
  selectedTopicId,
}: GrammarHubProps) {
  const filteredTopics = getFilteredTopics(selectedSectionFilter, selectedLevel, query);
  const selectedTopic =
    filteredTopics.find((topic) => topic.id === selectedTopicId) ??
    GRAMMAR_TOPICS.find((topic) => topic.id === selectedTopicId) ??
    filteredTopics[0] ??
    GRAMMAR_TOPICS[0];
  const activeSection = selectedSectionFilter === 'ALL' ? undefined : getGrammarSection(selectedSectionFilter);
  const topicExplanation = selectedTopic ? getGrammarExplanation(selectedTopic) : [];

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="mx-auto w-full max-w-3xl border-b border-claude-border pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-claude-muted">Gramer</div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-claude-text">
              {selectedSectionFilter === 'ALL' ? 'All' : activeSection?.title ?? 'Gramer Atlası'}
            </h1>
            <div className="mt-1 text-sm text-claude-muted">{getTopicCountLabel(filteredTopics.length)}</div>
          </div>
        </div>
      </header>

      <article className="min-w-0 flex-1 py-5">
        {selectedTopic ? (
          <div className="mx-auto max-w-3xl">
            <div className="border-b border-claude-border pb-5">
              <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Kapitel {selectedTopic.chapter}</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-claude-text">{selectedTopic.title}</h2>
              <p className="mt-2 text-base leading-7 text-claude-subtle">{selectedTopic.titleTr}</p>
            </div>

            <section className="border-b border-claude-border py-5">
              <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Özet</div>
              <p className="mt-3 text-sm leading-7 text-claude-subtle">{selectedTopic.summary}</p>
            </section>

            <section className="border-b border-claude-border py-5">
              <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Konu Anlatımı</div>
              <div className="mt-3 space-y-3 text-sm leading-7 text-claude-subtle">
                {topicExplanation.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {selectedTopic.pattern ? (
              <section className="border-b border-claude-border py-5">
                <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Kalıp</div>
                <pre className="mt-3 overflow-auto border-l-2 border-claude-accent/60 py-1 pl-4 font-mono-ui text-sm leading-7 text-claude-text">
                  {selectedTopic.pattern}
                </pre>
              </section>
            ) : null}

            <section className="border-b border-claude-border py-5">
              <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Örnekler</div>
              <div className="mt-3 divide-y divide-claude-border">
                {selectedTopic.examples.map((example) => (
                  <div key={example.de} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="text-base font-medium leading-7 text-claude-text">{example.de}</div>
                    <div className="text-sm leading-7 text-claude-subtle">{example.tr}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-5 border-b border-claude-border py-5 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Dikkat</div>
                <div className="mt-3 divide-y divide-claude-border">
                  {selectedTopic.highlights.map((highlight) => (
                    <p key={highlight} className="py-3 text-sm leading-7 text-claude-subtle">
                      {highlight}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-claude-muted">Sık Hata</div>
                <div className="mt-3 divide-y divide-claude-border">
                  {selectedTopic.pitfalls.map((pitfall) => (
                    <p key={pitfall} className="py-3 text-sm leading-7 text-claude-subtle">
                      {pitfall}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-claude-muted">Konu seçilmedi.</div>
        )}
      </article>
    </div>
  );
}
