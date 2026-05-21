import { config as loadDotenv } from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

loadDotenv({ path: path.join(rootDir, '.env.local') });
loadDotenv();

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const imageModel = process.env.NANO_BANANA_MODEL || 'gemini-3.1-flash-image-preview';
const textModel = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const allowedModels = new Set([
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image',
  'gemini-3-pro-image-preview',
]);

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(apiKey),
    model: imageModel,
  });
});

app.post('/api/ai/image-mnemonic', async (req, res) => {
  if (!apiKey) {
    res.status(500).json({
      error: 'Missing GEMINI_API_KEY or GOOGLE_API_KEY on the server.',
    });
    return;
  }

  const term = String(req.body?.term || '').trim();
  const translation = String(req.body?.translation || '').trim();
  const aspectRatio = String(req.body?.aspectRatio || '1:1');
  const requestedModel = String(req.body?.model || imageModel);
  const activeModel = allowedModels.has(requestedModel) ? requestedModel : imageModel;

  if (!term) {
    res.status(400).json({ error: 'Term is required.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Create a highly descriptive, visually memorable, cartoonish mnemonic illustration for the German term "${term}". Meaning: "${translation}". Keep it image-first, fun, and useful for vocabulary recall. Minimal or no text in the image.`;

    const response = await ai.models.generateContent({
      model: activeModel,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        res.json({
          imageUrl: `data:image/png;base64,${part.inlineData.data}`,
          model: activeModel,
        });
        return;
      }
    }

    res.status(502).json({ error: 'No image was returned by the model.' });
  } catch (error) {
    console.error('Image generation failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown image generation error',
    });
  }
});

app.post('/api/ai/german-tools', async (req, res) => {
  if (!apiKey) {
    res.status(500).json({
      error: 'Missing GEMINI_API_KEY or GOOGLE_API_KEY on the server.',
    });
    return;
  }

  const prompt = String(req.body?.prompt || '').trim();
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });

    const text =
      response.text ||
      response.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() ||
      '';

    if (!text) {
      res.status(502).json({ error: 'No text was returned by the model.' });
      return;
    }

    res.json({ text, model: textModel });
  } catch (error) {
    console.error('German tools generation failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown German tools generation error',
    });
  }
});

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

app.get('/api/article-lookup', async (req, res) => {
  const rawWord = normalizeLookupWord(req.query.word);
  const word = toTitleCaseGerman(rawWord);

  if (!word) {
    res.status(400).json({ error: 'word is required.' });
    return;
  }

  for (const article of ['der', 'die', 'das']) {
    const sourceUrl = `https://der-artikel.de/${article}/${encodeURIComponent(word)}.html`;

    try {
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
        res.json(parsed);
        return;
      }
    } catch (error) {
      console.error(`Article lookup failed for ${sourceUrl}:`, error);
    }
  }

  res.status(404).json({ error: 'Artikel bulunamadı.' });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`WortSchatz API listening on http://localhost:${port}`);
});
