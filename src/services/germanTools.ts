export type GermanToolResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

function extractText(response: { text?: string; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }): string {
  if (response.text) return response.text;
  return response.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
}

async function generateViaBrowserKey(prompt: string, apiKey: string): Promise<GermanToolResult> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = extractText(response);
    if (!text) {
      return { ok: false, error: 'AI metin cevabı dönmedi.' };
    }

    return { ok: true, text };
  } catch (error) {
    console.error('German tools browser AI failed:', error);
    return { ok: false, error: 'Tarayıcı API anahtarı ile AI çağrısı başarısız oldu.' };
  }
}

export async function askGermanTool(prompt: string, browserApiKey = ''): Promise<GermanToolResult> {
  if (!navigator.onLine) {
    return { ok: false, error: 'Çevrimdışı modda AI çeviri/açıklama çalışmaz.' };
  }

  if (browserApiKey.trim()) {
    return generateViaBrowserKey(prompt, browserApiKey.trim());
  }

  try {
    const response = await fetch('/api/ai/german-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: payload.error || 'AI servisi şu anda yanıt veremiyor.' };
    }

    const payload = (await response.json()) as { text?: string };
    return payload.text ? { ok: true, text: payload.text } : { ok: false, error: 'AI metin cevabı boş döndü.' };
  } catch (error) {
    console.error('German tools API failed:', error);
    return { ok: false, error: 'AI servisine bağlanırken bir hata oluştu.' };
  }
}
