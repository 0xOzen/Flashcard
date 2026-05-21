function normalizeLookupWord(value) {
  return String(value || '')
    .trim()
    .replace(/^(der|die|das)\s+/i, '')
    .replace(/[^\p{L}äöüÄÖÜß-]/gu, '');
}

function toTitleCaseGerman(value) {
  if (!value) return '';
  return value.charAt(0).toLocaleUpperCase('de-DE') + value.slice(1);
}

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseDerArtikelHtml(html, fallbackWord, article, sourceUrl) {
  const headingMatch = html.match(/<h1[^>]*>[\s\S]*?<span[^>]*>\s*(der|die|das)\s*<\/span>\s*([^<&]+)[\s\S]*?<\/h1>/i);
  if (!headingMatch) return null;

  const term = stripHtml(headingMatch[2] || fallbackWord).replace(/\s+/g, ' ').trim();
  const nominativeMatch = html.match(/NOMINATIV[\s\S]*?<td[^>]*>[\s\S]*?<i>\s*(der|die|das)\s*<\/i>\s*([^<]+)<\/td>[\s\S]*?<td[^>]*>[\s\S]*?<i>\s*die\s*<\/i>\s*([^<]+)<\/td>/i);
  const plural = nominativeMatch?.[3] ? `die ${stripHtml(nominativeMatch[3])}` : undefined;

  return {
    term,
    article,
    plural,
    sourceUrl,
    checkedAt: new Date().toISOString(),
  };
}

async function handleArticleLookup(request) {
  const url = new URL(request.url);
  const rawWord = normalizeLookupWord(url.searchParams.get('word'));
  const word = toTitleCaseGerman(rawWord);

  if (!word) {
    return Response.json({ error: 'word is required.' }, { status: 400 });
  }

  for (const article of ['der', 'die', 'das']) {
    const sourceUrl = `https://der-artikel.de/${article}/${encodeURIComponent(word)}.html`;
    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'WortSchatz/1.0 article lookup',
      },
    });

    if (!response.ok) {
      continue;
    }

    const html = await response.text();
    const parsed = parseDerArtikelHtml(html, word, article, sourceUrl);
    if (parsed) {
      return Response.json(parsed);
    }
  }

  return Response.json({ error: 'Artikel bulunamadı.' }, { status: 404 });
}

function jsonResponse(payload, init = {}) {
  return Response.json(payload, {
    ...init,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      ...(init.headers || {}),
    },
  });
}

function extractGeminiText(payload) {
  return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
}

async function handleGermanTools(request, env) {
  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { error: 'Canlı AI servisi için GEMINI_API_KEY veya GOOGLE_API_KEY secret olarak tanımlı değil.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt = String(body?.prompt || '').trim();
  if (!prompt) {
    return jsonResponse({ error: 'Prompt is required.' }, { status: 400 });
  }

  const model = env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return jsonResponse(
      { error: payload?.error?.message || 'AI servisi şu anda yanıt veremiyor.' },
      { status: response.status },
    );
  }

  const text = extractGeminiText(payload);
  if (!text) {
    return jsonResponse({ error: 'AI metin cevabı boş döndü.' }, { status: 502 });
  }

  return jsonResponse({ text, model });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return jsonResponse({}, { status: 204 });
    }

    if (url.pathname === '/api/health') {
      return jsonResponse({
        ok: true,
        hasApiKey: Boolean(env.GEMINI_API_KEY || env.GOOGLE_API_KEY),
        model: env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash',
      });
    }

    if (url.pathname === '/api/ai/german-tools' && request.method === 'POST') {
      return handleGermanTools(request, env);
    }

    if (url.pathname === '/api/article-lookup') {
      return handleArticleLookup(request);
    }

    return env.ASSETS.fetch(request);
  },
};
