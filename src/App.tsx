import { useEffect, useState } from 'react';
import { useApp } from './AppContext';
import Dashboard from './screens/Dashboard';
import ListEditor from './screens/ListEditor';
import FlashcardMode from './screens/FlashcardMode';
import QuizMode from './screens/QuizMode';
import WriteMode from './screens/WriteMode';
import MatchMode from './screens/MatchMode';
import GrammarHub from './screens/GrammarHub';
import { LibraryBig, Settings } from 'lucide-react';
import InstallBanner from './components/InstallBanner';
import SettingsModal from './components/SettingsModal';
import ConnectivityBadge from './components/ConnectivityBadge';

export type Screen = 
  | { type: 'dashboard' }
  | { type: 'grammar' }
  | { type: 'edit_list', listId: string }
  | { type: 'study', mode: 'flashcard' | 'quiz' | 'write' | 'match', listId: string };

export default function App() {
  const {
    isHydrated,
    aiModel,
    browserApiKey,
    clearBrowserApiKey,
    dismissInstallHint,
    exportBackup,
    importBackup,
    installHintDismissed,
    setBrowserApiKey,
    setAiModel,
    showInstallHint,
  } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'dashboard' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const navigate = (screen: Screen) => setCurrentScreen(screen);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleExportBackup = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `wortschatz-backup-${stamp}.json`;
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  if (!isHydrated) {
    return (
      <div className="w-full h-screen bg-[#f5f5f7] flex items-center justify-center font-sans text-[#1d1d1f]">
        <div className="bg-white rounded-3xl px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60">
          Veriler hazirlaniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#f5f5f7] flex flex-col font-sans text-[#1d1d1f] overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      <nav className="h-14 bg-white/70 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 shrink-0 relative z-10 w-full transition-all">
        <div 
          className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
          onClick={() => navigate({ type: 'dashboard' })}
        >
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-blue-600 font-semibold text-lg border border-black/5 shadow-sm bg-gradient-to-b from-white to-gray-50">
            W
          </div>
          <span className="text-xl font-medium tracking-tight text-[#1d1d1f]">WortSchatz</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ type: 'grammar' })}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
              currentScreen.type === 'grammar'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-black/5 bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <LibraryBig size={16} />
            Gramer
          </button>
          <ConnectivityBadge isOnline={isOnline} />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:text-gray-900"
          >
            <Settings size={16} />
            Ayarlar
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-auto relative">
        {!installHintDismissed && <InstallBanner onDismiss={dismissInstallHint} />}
        {currentScreen.type === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {currentScreen.type === 'grammar' && <GrammarHub onNavigate={navigate} />}
        {currentScreen.type === 'edit_list' && <ListEditor listId={currentScreen.listId} onNavigate={navigate} />}
        {currentScreen.type === 'study' && currentScreen.mode === 'flashcard' && <FlashcardMode listId={currentScreen.listId} onNavigate={navigate} />}
        {currentScreen.type === 'study' && currentScreen.mode === 'quiz' && <QuizMode listId={currentScreen.listId} onNavigate={navigate} />}
        {currentScreen.type === 'study' && currentScreen.mode === 'write' && <WriteMode listId={currentScreen.listId} onNavigate={navigate} />}
        {currentScreen.type === 'study' && currentScreen.mode === 'match' && <MatchMode listId={currentScreen.listId} onNavigate={navigate} />}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        isOnline={isOnline}
        selectedModel={aiModel || 'gemini-3.1-flash-image-preview'}
        browserApiKey={browserApiKey || ''}
        onClose={() => setIsSettingsOpen(false)}
        onModelChange={setAiModel}
        onSaveBrowserApiKey={setBrowserApiKey}
        onClearBrowserApiKey={clearBrowserApiKey}
        onShowInstallHint={showInstallHint}
        onExportBackup={handleExportBackup}
        onImportBackup={importBackup}
      />
    </div>
  );
}
