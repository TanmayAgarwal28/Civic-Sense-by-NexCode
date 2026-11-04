import { CONFIG } from '../config.js';

/**
 * CivicSense Gemini Generative AI Client
 * 
 * Directly queries the Google Gemini REST API when GEMINI_API_KEY is configured.
 * Uses system instructions tailored for Assamese-English campus issue understanding.
 */
export async function queryGeminiGenerativeModel({ prompt, imageBase64 = null, mimeType = 'image/jpeg' }) {
  if (!CONFIG.GEMINI_API_KEY) {
    return null; // Signals caller to use the high-performance local AI engine
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

  const parts = [{ text: prompt }];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: imageBase64
      }
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[Gemini API] Request returned status ${response.status}. Using fallback NLP engine.`);
      return null;
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return generatedText || null;
  } catch (err) {
    console.warn(`[Gemini API] Error contacting Gemini API: ${err.message}. Seamlessly falling back to built-in Assamese NLP engine.`);
    return null;
  }
}
