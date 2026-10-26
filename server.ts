import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Setup Gemini AI client if API key is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // API endpoint for Ask PhonePe Shop AI Assistant
  app.post('/api/gemini/shop-assistant', async (req, res) => {
    const { message, catalogContext, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        fallback: true,
        reply: null,
      });
    }

    try {
      const prompt = `You are "Ask PhonePe Shop", a friendly, smart, Indian ecommerce shopping advisor inside the PhonePe app.
Your task is to help users find the best products in PhonePe Shop based on their requirements, budget, or concerns.

Available PhonePe Shop Catalog:
${catalogContext}

User Query: "${message}"

Previous conversation:
${(chatHistory || []).map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join('\n')}

Instructions:
1. Provide a concise, helpful response (max 3-4 sentences) in a friendly Indian conversational ecommerce tone (e.g., mention UPI savings, verified seller warranty, fast delivery).
2. Recommend 1 to 3 relevant product IDs from the catalog above by listing their IDs in square brackets at the very end like [RECOMMENDED: id1, id2].
3. If no product matches, suggest the closest alternative from Electronics or Beauty.
4. Keep the tone trustworthy, warm, and authentic to PhonePe.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const replyText = response.text || '';
      
      // Extract recommended IDs
      const match = replyText.match(/\[RECOMMENDED:\s*([^\]]+)\]/i);
      const recommendedIds = match
        ? match[1].split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const cleanReply = replyText.replace(/\[RECOMMENDED:\s*[^\]]+\]/gi, '').trim();

      return res.json({
        reply: cleanReply,
        recommendedProductIds: recommendedIds,
        fallback: false,
      });
    } catch (error: any) {
      console.error('Gemini API call error:', error);
      return res.json({
        fallback: true,
        reply: null,
        error: error.message,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhonePe Shop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
