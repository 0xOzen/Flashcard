import { Bot, Download, FolderUp, KeyRound, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { AppState } from '../types';

type SettingsModalProps = {
  isOpen: boolean;
  isOnline: boolean;
  selectedModel: NonNullable<AppState['aiModel']>;
  browserApiKey: string;
  onClose: () => void;
  onModelChange: (model: NonNullable<AppState['aiModel']>) => void;
  onSaveBrowserApiKey: (apiKey: string) => void;
  onClearBrowserApiKey: () => void;
  onShowInstallHint: () => void;
  onExportBackup: () => void;
  onImportBackup: (raw: string) => { ok: boolean; message: string };
};

const MODEL_OPTIONS: Array<{
  id: NonNullable<AppState['aiModel']>;
  title: string;
  description: string;
}> = [
  {
    id: 'gemini-3.1-flash-image-preview',
    title: 'Nano Banana 2',
    description: 'Genel kullanim icin hizli ve kaliteli varsayilan secim.',
  },
  {
    id: 'gemini-2.5-flash-image',
    title: 'Nano Banana',
    description: 'Daha ekonomik ve hiz odakli secenek.',
  },
  {
    id: 'gemini-3-pro-image-preview',
    title: 'Nano Banana Pro',
    description: 'Daha agir ama daha yuksek kalite ve talimat takibi.',
  },
];

export default function SettingsModal({
  isOpen,
  isOnline,
  selectedModel,
  browserApiKey,
  onClose,
  onModelChange,
  onSaveBrowserApiKey,
  onClearBrowserApiKey,
  onShowInstallHint,
  onExportBackup,
  onImportBackup,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [browserKeyDraft, setBrowserKeyDraft] = useState(browserApiKey);

  useEffect(() => {
    setBrowserKeyDraft(browserApiKey);
  }, [browserApiKey, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const raw = await file.text();
    const result = onImportBackup(raw);
    setBackupMessage(result.message);
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/60 bg-[#fbfbfd] shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Ayarlar</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1d1d1f]">AI ve Kurulum</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Ayarlari kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Bot size={18} className="text-blue-500" />
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">AI Gorsel Modeli</h3>
            </div>
            <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
              isOnline ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}>
              {isOnline
                ? 'AI gorsel uretimi icin baglanti hazir.'
                : 'Cevrimdisisin. Kelime verileri lokal calisir, AI gorsel uretimi beklemeye alinmali.'}
            </div>
            <div className="space-y-3">
              {MODEL_OPTIONS.map((option) => {
                const isSelected = option.id === selectedModel;
                return (
                  <button
                    key={option.id}
                    onClick={() => onModelChange(option.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50 shadow-[0_10px_30px_rgba(59,130,246,0.08)]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900">{option.title}</div>
                        <div className="mt-1 text-sm text-gray-500">{option.description}</div>
                      </div>
                      {isSelected && (
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          Secili
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">{option.id}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <KeyRound size={18} className="text-blue-500" />
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">Kolay Mod: Browser API Key</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Buraya kendi Gemini API key'ini girersen AI gorsel uretimi dogrudan browser uzerinden calisir. Bu, server kurmadan kullanmanin en kolay yolu.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>Bu mod sadece kisisel kullanim icin uygundur. Key bu cihazda lokal saklanir ve production guvenligi saglamaz.</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                value={browserKeyDraft}
                onChange={(event) => setBrowserKeyDraft(event.target.value)}
                placeholder="Gemini API key"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onSaveBrowserApiKey(browserKeyDraft)}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Key'i Kaydet
                </button>
                <button
                  onClick={() => {
                    setBrowserKeyDraft('');
                    onClearBrowserApiKey();
                  }}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300"
                >
                  Browser Key'i Temizle
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {browserApiKey
                  ? 'Su an browser-key modu aktif. AI gorselleri server yerine bu cihazdaki key ile uretilir.'
                  : 'Browser key kayitli degil. Kayitli degilse uygulama proxy/server yolunu kullanir.'}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <FolderUp size={18} className="text-blue-500" />
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">Lokal Yedek</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Tum listelerini, istatistiklerini ve ayarlarini JSON dosyasi olarak disa aktarabilir veya daha once aldigin bir yedegi geri yukleyebilirsin.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onExportBackup();
                  setBackupMessage('Yedek dosyasi indirildi.');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                <Download size={16} />
                Yedegi Indir
              </button>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300"
              >
                <FolderUp size={16} />
                Yedek Ice Aktar
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            {backupMessage && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                {backupMessage}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">iPad Kurulum Yardimi</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Banneri tekrar gostermek veya kullaniciya ana ekrana ekleme akisini hatirlatmak icin bu dugmeyi kullanabilirsin.
            </p>
            <button
              onClick={onShowInstallHint}
              className="mt-4 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Kurulum Yardimini Tekrar Goster
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
