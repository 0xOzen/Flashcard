import { AppState } from '../types';

export type ImageMnemonicResult =
  | { ok: true; imageUrl: string }
  | { ok: false; error: string };

async function generateViaBrowserKey(
  term: string,
  translation: string,
  model: NonNullable<AppState['aiModel']>,
  apiKey: string,
): Promise<ImageMnemonicResult> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Create a highly descriptive, visually memorable, cartoonish mnemonic illustration for the German term "${term}". Meaning: "${translation}". Keep it image-first, fun, and useful for vocabulary recall. Minimal or no text in the image.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return {
          ok: true,
          imageUrl: `data:image/png;base64,${part.inlineData.data}`,
        };
      }
    }

    return {
      ok: false,
      error: 'Model gorsel donmedi. Farkli bir model veya farkli bir terim dene.',
    };
  } catch (error) {
    console.error('Browser-key image generation failed:', error);
    return {
      ok: false,
      error: 'Tarayici uzerinden AI cagrisi basarisiz oldu. API key ve kota durumunu kontrol et.',
    };
  }
}

export async function generateImageMnemonic(
  term: string,
  translation: string,
  model: NonNullable<AppState['aiModel']> = 'gemini-3.1-flash-image-preview',
  browserApiKey = '',
): Promise<ImageMnemonicResult> {
  if (!navigator.onLine) {
    return {
      ok: false,
      error: 'Cihaz su an cevrimdisi. AI gorsel uretimi icin internet baglantisi gerekiyor.',
    };
  }

  if (browserApiKey.trim()) {
    return generateViaBrowserKey(term, translation, model, browserApiKey.trim());
  }

  try {
    const response = await fetch('/api/ai/image-mnemonic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term,
        translation,
        model,
        aspectRatio: '1:1',
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        error: payload.error || 'AI servisi su anda yanit veremiyor.',
      };
    }

    const payload = (await response.json()) as { imageUrl?: string };
    if (!payload.imageUrl) {
      return {
        ok: false,
        error: 'Model gorsel donmedi. Farkli bir model veya farkli bir terim dene.',
      };
    }

    return {
      ok: true,
      imageUrl: payload.imageUrl,
    };
  } catch (error) {
    console.error('Failed to generate image:', error);
    return {
      ok: false,
      error: 'AI servisine baglanirken bir hata olustu. API sunucusunun calistigindan emin ol.',
    };
  }
}
