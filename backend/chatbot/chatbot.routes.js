// ──────────────────────────────────────────────────────────────────
// Chatbot Routes — Punto de entrada HTTP para el chatbot
// ──────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { processMessage } from './claude-agent.service.js';

const router = Router();

/**
 * POST /api/chatbot
 * Recibe la pregunta del usuario y la procesa a través del agente IA.
 *
 * Body: { message: string, history?: Array<{ sender: 'user'|'bot', text: string }> }
 * Response: { reply: string, toolsUsed?: string[] }
 */
router.post('/api/chatbot', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'El mensaje es obligatorio.' });
    }

    console.log(`[chatbot] User message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);

    const result = await processMessage(message.trim(), history || []);

    console.log(`[chatbot] Tools used: [${result.toolsUsed.join(', ')}]`);

    return res.json({
      reply: result.reply,
      toolsUsed: result.toolsUsed,
    });
  } catch (error) {
    console.error('[chatbot] Error:', error.message);
    return res.status(500).json({
      error: 'Error al procesar el mensaje del chatbot.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
