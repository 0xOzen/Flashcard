import { ArrowRight, BookOpen, CalendarClock, Edit2, Flame, Gauge, Grid2X2, LibraryBig, PenLine, Plus, RefreshCw, Target } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { VocabList, WordStats, WordType } from '../types';
import { isDue, todayIso } from '../lib/germanLearning';

type ListInsight = {
  studiedCount: number;
  accuracy: number;
  totalAttempts: number;
  dueCount: number;
  weakCount: number;
  newCount: number;
  mastery: number;
  lastStudiedLabel: string;
  typeLabel: string;
  recommendation: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function formatLastStudied(timestamp?: number): string {
  if (!timestamp) return 'Noch nicht gelernt';

  const diffDays = Math.floor((Date.now() - timestamp) / DAY_MS);
  if (diffDays <= 0) return 'Heute gelernt';
  if (diffDays === 1) return 'Gestern gelernt';
  return `Vor ${diffDays} Tagen`;
}

function getListTypeLabel(list: VocabList, topType?: WordType): string {
  if (list.id === 'difficult-words') return 'Schwierige Wörter';
  if (list.id === 'today-review') return 'Fällige Karten';
  if (!topType || topType === 'other') return list.isDefault ? 'Bereite Liste' : 'Gemischte Liste';

  const labels: Partial<Record<WordType, string>> = {
    noun: 'Nomen',
    verb: 'Verben',
    adjective: 'Adjektive',
    phrase: 'Redemittel',
  };

  return labels[topType] ?? 'Gemischte Liste';
}

function getListRecommendation(insight: Omit<ListInsight, 'recommendation'>): string {
  if (insight.dueCount > 0) return `Heute sind in dieser Liste ${insight.dueCount} Karten fällig.`;
  if (insight.weakCount > 0) return `${insight.weakCount} schwache Karten eignen sich für eine kurze Wiederholung.`;
  if (insight.newCount > 0) return `${insight.newCount} neue Karten sind bereit.`;
  if (insight.lastStudiedLabel.includes('Tagen')) return `${insight.lastStudiedLabel} gelernt; 5 Minuten Auffrischung wären gut.`;
  if (insight.accuracy >= 85 && insight.totalAttempts > 0) return 'Diese Liste wirkt stark; du kannst Easy-fokussiert weitergehen.';
  return 'Diese Liste passt gut für eine kurze aktive Erinnerung.';
}

function getTopWordType(list: VocabList): WordType | undefined {
  const counts = list.words.reduce<Partial<Record<WordType, number>>>((accumulator, word) => {
    if (!word.wordType) return accumulator;
    accumulator[word.wordType] = (accumulator[word.wordType] || 0) + 1;
    return accumulator;
  }, {});

  const [topType] =
    Object.entries(counts).sort(([, countA], [, countB]) => (countB || 0) - (countA || 0))[0] || [];

  return topType as WordType | undefined;
}

function isWeakWord(wordStats?: WordStats): boolean {
  if (!wordStats) return false;

  const total = wordStats.correct + wordStats.incorrect;
  if (total === 0) return false;

  return wordStats.incorrect > 0 && (wordStats.incorrect >= wordStats.correct || wordStats.incorrect / total > 0.3);
}

function getListInsight(list: VocabList, stats: Record<string, WordStats>): ListInsight {
  let studiedCount = 0;
  let totalCorrect = 0;
  let totalAttempts = 0;
  let dueCount = 0;
  let weakCount = 0;
  let newCount = 0;
  let lastStudiedTimestamp = 0;

  list.words.forEach((word) => {
    const wordStats = stats[word.id];
    const attempts = wordStats ? wordStats.correct + wordStats.incorrect : 0;
    const reviewCount = word.srs?.reviewCount || 0;

    if (attempts > 0 || reviewCount > 0) {
      studiedCount += 1;
      totalCorrect += wordStats?.correct || 0;
      totalAttempts += attempts;
    } else {
      newCount += 1;
    }

    if (reviewCount > 0 && isDue(word)) {
      dueCount += 1;
    }

    if (isWeakWord(wordStats)) {
      weakCount += 1;
    }

    const reviewedAt = wordStats?.lastReviewed || word.srs?.lastReviewed;
    if (reviewedAt) {
      const parsed = Date.parse(reviewedAt);
      if (!Number.isNaN(parsed)) {
        lastStudiedTimestamp = Math.max(lastStudiedTimestamp, parsed);
      }
    }
  });

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const mastery = list.words.length > 0 ? Math.min(100, Math.round((studiedCount / list.words.length) * accuracy)) : 0;
  const baseInsight = {
    studiedCount,
    accuracy,
    totalAttempts,
    dueCount,
    weakCount,
    newCount,
    mastery,
    lastStudiedLabel: formatLastStudied(lastStudiedTimestamp || undefined),
    typeLabel: getListTypeLabel(list, getTopWordType(list)),
  };

  return {
    ...baseInsight,
    recommendation: getListRecommendation(baseInsight),
  };
}

type DashboardProps = {
  selectedListId: string;
  onSelectList: (listId: string) => void;
  onNavigate: (screen: Screen) => void;
};

export default function Dashboard({ selectedListId, onSelectList, onNavigate }: DashboardProps) {
  const {
    lists,
    stats,
    studyDirection,
    toggleStudyDirection,
    getDifficultWordsList,
    getDueWordsList,
    getWeakAreas,
    desiredRetention,
    dailyNewLimit,
    setDesiredRetention,
  } = useApp();
  const difficultList = getDifficultWordsList();
  const dueList = getDueWordsList();
  const selectableLists = [dueList, difficultList, ...lists].filter((list): list is VocabList => Boolean(list));
  const primaryList =
    selectableLists.find((list) => list.id === selectedListId) ??
    lists.find((list) => list.id === selectedListId) ??
    lists[0] ??
    difficultList ??
    null;
  const primaryInsight = primaryList ? getListInsight(primaryList, stats) : null;
  const listTiles = primaryList
    ? [primaryList, ...selectableLists.filter((list) => list.id !== primaryList.id)].slice(0, 4)
    : selectableLists.slice(0, 4);
  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);
  const directionLabel = studyDirection === 'TR_TO_DE' ? 'TR -> DE' : 'DE -> TR';
  const weakAreas = getWeakAreas();
  const allWords = lists.flatMap((list) => list.words);
  const today = todayIso();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const dueReviewCount = allWords.filter((word) => (word.srs?.reviewCount || 0) > 0 && isDue(word, today)).length;
  const newCardCount = Math.min(allWords.filter((word) => !word.srs?.reviewCount).length, dailyNewLimit || 12);
  const weakCardCount = difficultList?.words.length || 0;
  const tomorrowCount = allWords.filter((word) => word.srs?.dueDate === tomorrow).length;
  const retentionValue = desiredRetention || 0.9;
  const retentionPercent = Math.round(retentionValue * 100);
  const reviewPressure = retentionValue >= 0.95 ? 1.35 : retentionValue >= 0.9 ? 1.15 : 1;
  const estimatedLoad = Math.ceil(dueReviewCount * reviewPressure) + newCardCount;

  if (!primaryList) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center px-5 py-8">
        <section className="codex-panel w-full rounded-[14px] p-5">
          <div className="text-sm font-semibold text-claude-text">WortSchatz</div>
          <div className="mt-2 text-sm text-claude-muted">Henüz liste yok.</div>
          <button onClick={() => onNavigate({ type: 'edit_list', listId: 'new' })} className="button-primary mt-5">
            <Plus size={15} />
            İlk listeyi oluştur
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-claude-text">WortSchatz</h1>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-claude-muted">
            <span className="badge bg-claude-panel text-claude-subtle">{lists.length} liste</span>
            <span className="badge bg-claude-panel text-claude-subtle">{totalWords} kelime</span>
            <span className="badge bg-claude-accentSoft text-claude-accent">{directionLabel}</span>
          </div>
        </div>
        <button
          onClick={toggleStudyDirection}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[12px] border border-claude-border bg-claude-panel px-3 text-xs font-semibold text-claude-subtle transition-colors hover:border-claude-accent/40 hover:text-claude-text"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Yön değiştir</span>
        </button>
      </div>

      <section className="dashboard-focus-panel overflow-hidden rounded-[18px] p-3 sm:p-4">
        <button
          onClick={() => onNavigate({ type: 'study', mode: 'flashcard', listId: dueList?.id || primaryList.id })}
          className="today-start-card flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3.5 text-left transition-colors sm:px-4 sm:py-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/18 sm:h-11 sm:w-11">
            <CalendarClock size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold tracking-tight sm:text-lg">Bugünün tekrarına başla</span>
            <span className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] font-semibold text-white/86">
              <span className="rounded-full bg-white/18 px-2 py-0.5">{dueReviewCount} tekrar</span>
              <span className="rounded-full bg-white/18 px-2 py-0.5">{newCardCount} yeni</span>
              <span className="rounded-full bg-white/18 px-2 py-0.5">{estimatedLoad} yük</span>
            </span>
          </span>
          <ArrowRight size={18} className="shrink-0" />
        </button>

        <div className="compact-srs-card mt-2.5 rounded-[14px] px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-claude-accentSoft text-claude-accent">
              <Gauge size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-claude-text">SRS hedefi</div>
                  <div className="mt-0.5 flex gap-1.5 text-[11px] font-semibold text-claude-muted">
                    <span>{weakCardCount} zayıf</span>
                    <span>{tomorrowCount} yarın</span>
                  </div>
                </div>
                <div className="rounded-full border border-claude-border bg-claude-panel px-2.5 py-1 text-xs font-semibold text-claude-text">
                  {retentionPercent}%
                </div>
              </div>
              <input
                type="range"
                min={75}
                max={98}
                step={1}
                value={retentionPercent}
                onChange={(event) => setDesiredRetention(Number(event.target.value) / 100)}
                className="mt-2 h-1.5 w-full accent-claude-accent"
                aria-label="SRS retention hedefi"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-3">
        <div className="soft-tile rounded-[16px] p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <span className="codex-action-icon">
              {primaryList.id === 'difficult-words' ? <Flame size={16} /> : <BookOpen size={16} />}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-claude-muted">Zu lernende Liste</div>
                  <div className="mt-1 truncate text-base font-semibold text-claude-text">{primaryList.title}</div>
                </div>
                <span className="shrink-0 rounded-full border border-claude-border bg-claude-accentSoft px-2.5 py-1 text-[11px] font-semibold text-claude-accent">
                  {primaryInsight?.typeLabel}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-medium text-claude-subtle">{primaryInsight?.recommendation}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {listTiles.map((list) => {
              const tileInsight = getListInsight(list, stats);
              const highlightValue = tileInsight.dueCount || tileInsight.newCount || list.words.length;
              const highlightLabel = tileInsight.dueCount ? 'Fällig' : tileInsight.newCount ? 'Neu' : 'Karten';
              const active = list.id === primaryList.id;

              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => onSelectList(list.id)}
                  className={`min-w-0 rounded-[12px] border p-2.5 text-left transition-all hover:border-claude-accent/50 ${
                    active
                      ? 'border-claude-accent bg-claude-accentSoft shadow-soft'
                      : 'border-claude-border bg-claude-surface'
                  }`}
                  aria-pressed={active}
                  title={`${list.title} · ${list.words.length} Karten`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 truncate text-xs font-semibold text-claude-text">{list.title}</span>
                    <span className="shrink-0 rounded-full bg-claude-panel px-1.5 py-0.5 text-[10px] font-bold text-claude-accent">
                      {highlightValue}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[10px] font-semibold text-claude-muted">
                    {tileInsight.typeLabel} · {list.words.length} Karten · {highlightLabel}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-claude-border">
                    <div className="h-full rounded-full bg-claude-accent" style={{ width: `${tileInsight.mastery}%` }} />
                  </div>
                </button>
              );
            })}
          </div>

          <label className="mt-3 block" htmlFor="study-list-select">
            <span className="text-xs font-semibold text-claude-muted">Alle Listen</span>
            <select
              id="study-list-select"
              value={primaryList.id}
              onChange={(event) => onSelectList(event.target.value)}
              className="mt-1.5 w-full rounded-[12px] border border-claude-border bg-claude-panel px-3 py-2 text-sm font-semibold text-claude-text outline-none transition-colors focus:border-claude-accent"
            >
              {selectableLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title} · {list.words.length} Karten
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3 rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5">
            <div className="flex justify-between gap-3 text-xs font-semibold">
              <span className="text-claude-muted">Sicherheit</span>
              <span className="text-claude-text">{primaryInsight?.mastery ?? 0}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-claude-border">
              <div className="h-full rounded-full bg-claude-accent" style={{ width: `${primaryInsight?.mastery ?? 0}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-claude-muted">
              <span>{primaryInsight?.studiedCount ?? 0} gelernt</span>
              <span>{primaryInsight?.newCount ?? 0} neu</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <button onClick={() => onNavigate({ type: 'study', mode: 'flashcard', listId: primaryList.id })} className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] border border-claude-border bg-claude-panel px-1.5 text-xs font-semibold text-claude-text transition-colors hover:border-claude-accent/50">
              <BookOpen size={16} className="text-claude-accent" />
              <span className="truncate">Karten</span>
            </button>
            <button onClick={() => onNavigate({ type: 'study', mode: 'quiz', listId: primaryList.id })} className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] border border-claude-border bg-claude-panel px-1.5 text-xs font-semibold text-claude-text transition-colors hover:border-claude-accent/50">
              <ArrowRight size={16} className="text-claude-success" />
              <span className="truncate">Test</span>
            </button>
            <button onClick={() => onNavigate({ type: 'study', mode: 'write', listId: primaryList.id })} className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] border border-claude-border bg-claude-panel px-1.5 text-xs font-semibold text-claude-text transition-colors hover:border-claude-accent/50">
              <PenLine size={16} className="text-claude-warning" />
              <span className="truncate">Schreiben</span>
            </button>
            <button onClick={() => onNavigate({ type: 'study', mode: 'match', listId: primaryList.id })} className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] border border-claude-border bg-claude-panel px-1.5 text-xs font-semibold text-claude-text transition-colors hover:border-claude-accent/50">
              <Grid2X2 size={16} className="text-claude-skill" />
              <span className="truncate">Zuordnen</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              ['Fällig', primaryInsight?.dueCount ?? 0],
              ['Schwach', primaryInsight?.weakCount ?? 0],
              ['Quote', `${primaryInsight?.accuracy ?? 0}%`],
              ['Zuletzt', primaryInsight?.lastStudiedLabel ?? '-'],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-[12px] bg-claude-accentSoft/60 px-2.5 py-2">
                <div className="truncate text-[10px] font-semibold text-claude-muted">{label}</div>
                <div className="mt-1 truncate text-sm font-semibold text-claude-text">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-tile rounded-[16px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <Target size={16} className="text-claude-accent" />
            Zayıf alanlar
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {weakAreas.length ? (
              weakAreas.map((area) => (
                <span key={area.label} className="badge bg-claude-accentSoft text-claude-subtle">
                  {area.label} · {area.count}
                </span>
              ))
            ) : (
              <span className="badge bg-claude-panel text-claude-muted">Henüz sinyal yok</span>
            )}
          </div>
        </div>

        <div className="soft-tile rounded-[16px] p-4">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onNavigate({ type: 'edit_list', listId: 'new' })} className="button-secondary h-11 px-2 text-xs">
              <Plus size={15} />
              Yeni
            </button>
            <button
              onClick={() => onNavigate({ type: 'edit_list', listId: primaryList.isDefault ? lists[0]?.id ?? 'new' : primaryList.id })}
              className="button-secondary h-11 px-2 text-xs"
            >
              <Edit2 size={15} />
              Düzenle
            </button>
            <button onClick={() => onNavigate({ type: 'grammar' })} className="button-secondary h-11 px-2 text-xs">
              <LibraryBig size={15} />
              Gramer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
