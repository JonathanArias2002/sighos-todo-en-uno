// ──────────────────────────────────────────────────────────────────
// Claude Agent Service — Core del AI Agent con Tool Use
//
// Este servicio implementa un loop de agente: envía la pregunta
// del usuario a Claude junto con las herramientas MCP disponibles.
// Claude decide cuál herramienta invocar, el agente la ejecuta,
// devuelve el resultado y repite hasta obtener respuesta final.
// ──────────────────────────────────────────────────────────────────

import { TOOL_DECLARATIONS } from './mcp/tool-definitions.js';
import * as tableExplorer from './mcp/table-explorer.tool.js';
import * as queryExecutor from './mcp/query-executor.tool.js';
import * as identitySearch from './mcp/identity-search.tool.js';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

/** Maximum number of tool-calling rounds to prevent infinite loops. */
const MAX_AGENT_ITERATIONS = 8;

/**
 * Map of tool names to their executor functions.
 */
const TOOL_EXECUTORS = {
  explore_tables: tableExplorer.execute,
  execute_query: queryExecutor.execute,
  search_identity: identitySearch.execute,
};

/**
 * System prompt that defines the agent's role and behavior.
 */
const SYSTEM_PROMPT = `Eres el asistente virtual inteligente de SIGHOS, un sistema de gestión hospitalaria. Tu nombre es "Asistente SIGHOS".

## Tu Rol
Eres un agente de IA con acceso a herramientas que te permiten consultar la base de datos del hospital y buscar información de identidad en RENIEC. Tu objetivo es responder preguntas sobre el sistema hospitalario de forma precisa y en lenguaje natural.

## Herramientas Disponibles
Tienes 3 herramientas MCP (Model Context Protocol):

1. **explore_tables**: Explora el esquema de la base de datos (tablas, columnas, tipos, relaciones).
   - SIEMPRE usa esta herramienta PRIMERO antes de generar cualquier consulta SQL.
   - Te ayuda a conocer los nombres exactos de las tablas y columnas.

2. **execute_query**: Ejecuta consultas SQL SELECT contra la base de datos.
   - Solo genera consultas SELECT (lectura).
   - Usa los nombres de columnas en español tal como están en la base de datos.
   - Las consultas pasan por un validador de seguridad antes de ejecutarse.
   - Si una consulta falla, revisa el error y corrige usando explore_tables.

3. **search_identity**: Busca información de una persona en RENIEC por su DNI.
   - Usa esta herramienta cuando el usuario mencione un DNI (8 dígitos).
   - Retorna nombre completo, apellidos y datos de ubicación del ciudadano.
   - Útil para verificar la identidad antes de buscar en la base de datos interna.

## Estrategia de Respuesta
Cuando un usuario haga una pregunta:
1. Si menciona un DNI, usa **search_identity** para obtener el nombre del ciudadano.
2. Usa **explore_tables** para entender la estructura de las tablas relevantes.
3. Genera y ejecuta la consulta SQL apropiada con **execute_query**.
4. Combina toda la información obtenida en una respuesta clara en español.

## Reglas Importantes
- Responde SIEMPRE en español.
- Sé conciso pero informativo.
- Formatea las respuestas de manera legible (usa listas, negritas, y estructura cuando sea útil).
- **NUNCA reveles contraseñas** (columna "password") ni información sensible de seguridad.
- Si no encuentras datos, dilo claramente. No inventes información.
- Si el usuario pregunta algo no relacionado con el hospital, responde brevemente pero guía la conversación al ámbito hospitalario.
- Cuando presentes datos numéricos (conteos, precios), sé preciso con los números.
- Para montos monetarios, usa el formato "S/ X.XX" (Soles peruanos).
- Si una consulta SQL falla, intenta corregirla automáticamente revisando el esquema con explore_tables.`;

/**
 * Convert TOOL_DECLARATIONS to Claude's tools format.
 * Claude uses { name, description, input_schema } with JSON Schema.
 */
function getClaudeTools() {
  return TOOL_DECLARATIONS.map((decl) => {
    const inputSchema = {
      type: 'object',
      properties: {},
      required: decl.parameters?.required || [],
    };

    if (decl.parameters?.properties) {
      for (const [key, prop] of Object.entries(decl.parameters.properties)) {
        inputSchema.properties[key] = {
          type: prop.type.toLowerCase(),
          description: prop.description || '',
        };
      }
    }

    return {
      name: decl.name,
      description: decl.description,
      input_schema: inputSchema,
    };
  });
}

/**
 * Process a user message through the Claude AI agent with MCP tools.
 *
 * @param {string} userMessage - The user's natural language question
 * @param {Array<{sender: string, text: string}>} history - Conversation history
 * @returns {Promise<{reply: string, toolsUsed: string[]}>}
 */
export async function processMessage(userMessage, history = []) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY no está configurada en las variables de entorno.');
  }

  // ── Build conversation messages ─────────────────────────────────
  const messages = [];

  // Add conversation history
  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      });
    }
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  // Track which tools were used
  const toolsUsed = [];

  // ── Agent Loop ──────────────────────────────────────────────────
  for (let iteration = 0; iteration < MAX_AGENT_ITERATIONS; iteration++) {
    const response = await callClaude(messages);

    // Check if Claude wants to use tools
    const contentBlocks = response.content || [];
    const toolUseBlocks = contentBlocks.filter((b) => b.type === 'tool_use');
    const textBlocks = contentBlocks.filter((b) => b.type === 'text');

    if (toolUseBlocks.length === 0) {
      // No tool calls — Claude is returning a text response (final answer)
      const reply = textBlocks.map((b) => b.text).join('\n') || 'Lo siento, no pude generar una respuesta.';
      return { reply, toolsUsed };
    }

    // ── Execute tool calls ────────────────────────────────────────
    // Add Claude's response (with tool_use blocks) to the conversation
    messages.push({
      role: 'assistant',
      content: contentBlocks,
    });

    // Execute each tool call and collect tool_result blocks
    const toolResultBlocks = [];

    for (const toolBlock of toolUseBlocks) {
      const { id, name, input: args } = toolBlock;
      console.log(`[claude-agent] Iteration ${iteration + 1}: Calling tool "${name}" with args:`, JSON.stringify(args));

      toolsUsed.push(name);

      const executor = TOOL_EXECUTORS[name];
      if (!executor) {
        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: id,
          content: JSON.stringify({ error: `Herramienta "${name}" no encontrada.` }),
          is_error: true,
        });
        continue;
      }

      try {
        const resultString = await executor(args || {});
        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: id,
          content: resultString,
        });
      } catch (error) {
        console.error(`[claude-agent] Tool "${name}" execution error:`, error.message);
        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: id,
          content: JSON.stringify({ error: `Error al ejecutar la herramienta: ${error.message}` }),
          is_error: true,
        });
      }
    }

    // Add the tool results as a user message (Claude's convention)
    messages.push({
      role: 'user',
      content: toolResultBlocks,
    });
  }

  // If we exhausted iterations, return what we have
  return {
    reply:
      'He procesado tu consulta pero necesité demasiadas operaciones. ' +
      'Por favor, intenta hacer una pregunta más específica.',
    toolsUsed,
  };
}

/**
 * Call the Claude API (Anthropic Messages API) with tool use support.
 *
 * @param {Array} messages - Conversation messages
 * @returns {Promise<object>} Claude API response
 */
async function callClaude(messages) {
  const requestBody = {
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
    tools: getClaudeTools(),
  };

  const response = await fetch(CLAUDE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Sin detalle');
    console.error(`[claude-agent] Claude API error ${response.status}:`, errorBody);
    throw new Error(`Error de Claude API (HTTP ${response.status})`);
  }

  return response.json();
}
