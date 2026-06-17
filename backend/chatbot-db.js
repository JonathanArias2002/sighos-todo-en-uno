import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// ──────────────────────────────────────────────────────────────────
// Pool de SOLO LECTURA exclusivo para el chatbot.
// Usa las credenciales CHATBOT_DB_* del .env (usuario chatbot_reader).
// ──────────────────────────────────────────────────────────────────

const chatbotConnectionConfig = {
  host: process.env.CHATBOT_DB_HOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.CHATBOT_DB_PORT || process.env.DB_PORT || 5432),
  user: process.env.CHATBOT_DB_USER || 'chatbot_reader',
  password: process.env.CHATBOT_DB_PASSWORD || '',
  database: process.env.CHATBOT_DB_NAME || process.env.DB_NAME || 'sighos',
  max: 5, // Limitar conexiones — el chatbot no necesita muchas
};

if (process.env.CHATBOT_DB_SSL === 'true' || process.env.DB_SSL === 'true') {
  chatbotConnectionConfig.ssl = { rejectUnauthorized: false };
}

export const chatbotPool = new Pool(chatbotConnectionConfig);

chatbotPool.on('error', (error) => {
  console.error('[chatbot-db] Unexpected pool error:', error);
});

/**
 * Execute a read-only query against the chatbot database pool.
 */
export const chatbotQuery = (text, params = []) => chatbotPool.query(text, params);

/**
 * Test the chatbot database connection.
 */
export const testChatbotConnection = async () => {
  const result = await chatbotQuery('SELECT 1 AS ok');
  console.log('[chatbot-db] Read-only connection verified ✓');
  return result;
};
