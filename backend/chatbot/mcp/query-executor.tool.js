// ──────────────────────────────────────────────────────────────────
// MCP Tool: Query Executor (Secure)
// Ejecuta consultas SQL generadas por Claude, pasando
// obligatoriamente por el Validador SQL antes de ejecutarse.
// ──────────────────────────────────────────────────────────────────

import { chatbotQuery } from '../../chatbot-db.js';
import { validateSQL } from '../sql-validator.service.js';

/**
 * Execute a SQL query after validating it for safety.
 *
 * @param {{ sql_query: string }} args
 * @returns {Promise<string>} JSON string with query results or error
 */
export async function execute(args = {}) {
  const { sql_query } = args;

  if (!sql_query) {
    return JSON.stringify({
      error: 'No se proporcionó una consulta SQL. Usa el parámetro "sql_query".',
    });
  }

  // ── Step 1: Validate the SQL ───────────────────────────────────
  const validation = validateSQL(sql_query);

  if (!validation.valid) {
    console.warn('[query-executor] SQL rejected:', validation.error);
    return JSON.stringify({
      error: `Consulta SQL rechazada por seguridad: ${validation.error}`,
      consulta_original: sql_query,
    });
  }

  const safeSql = validation.sql;
  console.log('[query-executor] Executing validated SQL:', safeSql);

  // ── Step 2: Execute against the read-only pool ─────────────────
  try {
    const startTime = Date.now();
    const { rows, rowCount } = await chatbotQuery(safeSql);
    const durationMs = Date.now() - startTime;

    return JSON.stringify({
      success: true,
      filas_retornadas: rows.length,
      filas_afectadas: rowCount,
      tiempo_ms: durationMs,
      datos: rows,
    });
  } catch (error) {
    console.error('[query-executor] SQL execution error:', error.message);

    // Provide useful error info back to Claude so it can retry
    return JSON.stringify({
      error: `Error al ejecutar la consulta SQL: ${error.message}`,
      consulta_ejecutada: safeSql,
      sugerencia:
        'Verifica que los nombres de tablas y columnas sean correctos. ' +
        'Usa la herramienta explore_tables para consultar el esquema actualizado.',
    });
  }
}
