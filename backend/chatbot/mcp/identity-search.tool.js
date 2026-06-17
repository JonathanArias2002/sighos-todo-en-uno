// ──────────────────────────────────────────────────────────────────
// MCP Tool: Identity Search (RENIEC via Json.pe)
// Permite a Claude consultar datos de ciudadanos peruanos
// por su número de DNI.
// ──────────────────────────────────────────────────────────────────

import { consultarDNI } from '../reniec.service.js';

/**
 * Search for a person's identity by their DNI number.
 *
 * @param {{ document_number: string }} args
 * @returns {Promise<string>} JSON string with identity data or error
 */
export async function execute(args = {}) {
  const { document_number } = args;

  if (!document_number) {
    return JSON.stringify({
      error: 'No se proporcionó un número de documento. Usa el parámetro "document_number".',
    });
  }

  const cleanNumber = String(document_number).trim();

  // DNI — 8 digits
  if (/^\d{8}$/.test(cleanNumber)) {
    console.log(`[identity-search] Consulting DNI: ${cleanNumber}`);
    const result = await consultarDNI(cleanNumber);
    return JSON.stringify(result);
  }

  return JSON.stringify({
    error: `El número de documento "${cleanNumber}" no tiene un formato válido. ` +
           `Un DNI debe tener exactamente 8 dígitos numéricos.`,
  });
}
