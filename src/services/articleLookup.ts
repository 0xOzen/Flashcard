import { ArticleLookupCacheEntry } from '../types';

export type ArticleLookupResult =
  | { ok: true; entry: ArticleLookupCacheEntry }
  | { ok: false; error: string };

export async function verifyArticleOnline(word: string): Promise<ArticleLookupResult> {
  if (!navigator.onLine) {
    return { ok: false, error: 'Çevrimdışısın. Web doğrulama için internet gerekiyor.' };
  }

  const query = word.trim();
  if (!query) {
    return { ok: false, error: 'Kelime gir.' };
  }

  try {
    const response = await fetch(`/api/article-lookup?word=${encodeURIComponent(query)}`);
    const payload = (await response.json().catch(() => ({}))) as Partial<ArticleLookupCacheEntry> & { error?: string };

    if (!response.ok || !payload.term || !payload.article) {
      return { ok: false, error: payload.error || 'Web doğrulama sonucu bulunamadı.' };
    }

    return {
      ok: true,
      entry: {
        term: payload.term,
        article: payload.article,
        plural: payload.plural,
        sourceUrl: payload.sourceUrl,
        checkedAt: payload.checkedAt || new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Article lookup failed:', error);
    return { ok: false, error: 'Web doğrulama servisine bağlanılamadı.' };
  }
}
