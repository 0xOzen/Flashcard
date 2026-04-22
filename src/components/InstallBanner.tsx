import { Share, SquarePlus, X } from 'lucide-react';

type InstallBannerProps = {
  onDismiss: () => void;
};

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isAppleTouchDevice(): boolean {
  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const touchMac = platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || touchMac;
}

export default function InstallBanner({ onDismiss }: InstallBannerProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (isStandalone() || !isAppleTouchDevice()) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4">
      <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-[0_8px_30px_rgb(59,130,246,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">iPad Kurulum</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">Ana ekrana ekleyip uygulama gibi kullanabilirsin</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                <Share size={14} className="text-blue-500" />
                Paylas
              </span>
              <span className="text-gray-300">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5">
                <SquarePlus size={14} className="text-blue-500" />
                Add to Home Screen
              </span>
              <span className="text-gray-300">→</span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5">
                WortSchatz
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Kurulum bannerini kapat"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
