import { useMemo, useState } from 'react';
import { ChevronLeft, Mic, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';

const tasks = [
  {
    title: 'Fikrini savun',
    prompt: 'Online öğrenmenin sınıf eğitiminden daha etkili olup olmadığı hakkında 45 saniyelik bir cevap hazırla.',
    useful: ['Meiner Meinung nach...', 'Ich bin der Ansicht, dass...', 'Ein wichtiger Punkt ist...', 'Andererseits...'],
  },
  {
    title: 'Nazikçe itiraz et',
    prompt: 'Bir arkadaşın Almanca konuşma pratiğinin gereksiz olduğunu söylüyor. Nazikçe karşı çık.',
    useful: ['Da bin ich anderer Meinung.', 'Ich kann das nachvollziehen, aber...', 'Aus meiner Sicht...', 'Es wäre sinnvoll, ... zu'],
  },
  {
    title: 'Çözüm öner',
    prompt: 'Dil kursunda konuşma pratiği az. Kurs yönetimine yapıcı bir öneri sun.',
    useful: ['Ich würde vorschlagen, dass...', 'Eine mögliche Lösung wäre...', 'Man könnte...', 'Das hätte den Vorteil, dass...'],
  },
  {
    title: 'Şikayet yazısı provası',
    prompt: 'Satın aldığın online kurs vaad edilen materyalleri içermiyor. Kısa ve resmi bir şikayet cevabı hazırla.',
    useful: ['Hiermit möchte ich mich darüber beschweren, dass...', 'Ich bitte Sie darum, ...', 'Leider musste ich feststellen, dass...', 'Mit freundlichen Grüßen'],
  },
];

function scoreResponse(response: string, useful: string[]) {
  const normalized = response.toLocaleLowerCase('de-DE');
  const used = useful.filter((phrase) => normalized.includes(phrase.replace('...', '').toLocaleLowerCase('de-DE').trim()));
  const hasVerbEnd = /\bweil\b.+\b(bin|ist|sind|habe|hat|kann|muss|sollte)\.?$/i.test(response.trim());
  const hasConnectors = ['aber', 'denn', 'weil', 'deshalb', 'trotzdem', 'andererseits', 'außerdem'].filter((item) => normalized.includes(item));

  return {
    used,
    hasVerbEnd,
    hasConnectors,
    wordCount: response.trim() ? response.trim().split(/\s+/).length : 0,
  };
}

export default function RedemittelLab({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists } = useApp();
  const redemittelCards = useMemo(
    () => lists.flatMap((list) => list.words).filter((word) => word.wordType === 'phrase' && word.phraseForms?.redemittel).slice(0, 24),
    [lists],
  );
  const [taskIndex, setTaskIndex] = useState(0);
  const [response, setResponse] = useState('');
  const task = tasks[taskIndex];
  const feedback = scoreResponse(response, task.useful);

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
              <Mic size={14} />
              Redemittel Lab
            </div>
            <h1 className="mt-2 text-lg font-semibold text-claude-text">Konuşma ve yazma üretimi</h1>
          </div>
        </div>
        <button
          onClick={() => {
            setTaskIndex((current) => (current + 1) % tasks.length);
            setResponse('');
          }}
          className="button-secondary h-9 px-3"
        >
          <RefreshCw size={16} />
          Yeni görev
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="codex-panel rounded-[14px] p-4">
          <div className="rounded-[12px] border border-claude-border bg-claude-surface p-4">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-claude-muted">{task.title}</div>
            <p className="mt-3 text-lg font-semibold leading-8 text-claude-text">{task.prompt}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {task.useful.map((phrase) => (
              <button
                key={phrase}
                onClick={() => setResponse((current) => `${current}${current ? ' ' : ''}${phrase} `)}
                className="rounded-[10px] border border-claude-border bg-claude-panel px-3 py-2 text-xs font-semibold text-claude-subtle transition-colors hover:text-claude-text"
              >
                {phrase}
              </button>
            ))}
          </div>

          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Cevabını Almanca yaz veya sesli prova ederken ana cümlelerini buraya not et..."
            className="mt-4 min-h-[240px] w-full resize-y rounded-[12px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-7 text-claude-text outline-none focus:border-claude-accent"
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="text-xs text-claude-muted">Kelime</div>
              <div className="mt-1 font-semibold text-claude-text">{feedback.wordCount}</div>
            </div>
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="text-xs text-claude-muted">Kalıp</div>
              <div className="mt-1 font-semibold text-claude-text">{feedback.used.length}</div>
            </div>
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="text-xs text-claude-muted">Bağlaç</div>
              <div className="mt-1 font-semibold text-claude-text">{feedback.hasConnectors.length}</div>
            </div>
            <div className="rounded-[10px] border border-claude-border bg-claude-surface px-3 py-3">
              <div className="text-xs text-claude-muted">Yan cümle</div>
              <div className="mt-1 font-semibold text-claude-text">{feedback.hasVerbEnd ? 'var' : 'kontrol'}</div>
            </div>
          </div>
        </section>

        <aside className="codex-panel rounded-[14px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <Sparkles size={16} className="text-claude-accent" />
            Bankadan kalıplar
          </div>
          <div className="mt-3 space-y-2">
            {redemittelCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setResponse((current) => `${current}${current ? ' ' : ''}${card.term} `)}
                className="w-full rounded-[10px] border border-claude-border bg-claude-surface px-3 py-2 text-left transition-colors hover:border-claude-accent/40"
              >
                <div className="text-sm font-semibold text-claude-text">{card.term}</div>
                <div className="mt-1 text-xs text-claude-muted">{card.translationTr}</div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
