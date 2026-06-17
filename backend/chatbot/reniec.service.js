// ──────────────────────────────────────────────────────────────────
// Servicio RENIEC — Consulta de DNI vía Json.pe
// Docs: https://docs.json.pe
// ──────────────────────────────────────────────────────────────────

const JSONPE_BASE_URL = 'https://api.json.pe/api';
const TIMEOUT_MS = 8000;

/**
 * Get the Json.pe Bearer token from environment.
 * @returns {string}
 */
function getToken() {
  const token = process.env.JSONPE_API_TOKEN || '';
  if (!token) {
    throw new Error('JSONPE_API_TOKEN no está configurado en las variables de entorno.');
  }
  return token;
}

/**
 * Consultar datos de una persona por su DNI (8 dígitos) en RENIEC
 * vía la API de Json.pe.
 *
 * @param {string} dni - Número de DNI (8 dígitos)
 * @returns {Promise<object>} Datos del ciudadano
 */
export async function consultarDNI(dni) {
  // Validate DNI format
  if (!dni || !/^\d{8}$/.test(dni)) {
    return {
      success: false,
      error: `El DNI "${dni}" no es válido. Debe tener exactamente 8 dígitos numéricos.`,
    };
  }

  try {
    const token = getToken();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${JSONPE_BASE_URL}/dni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dni }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Sin detalle');
      console.error(`[reniec] Json.pe API error ${response.status}:`, errorBody);

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Error de autenticación con la API de Json.pe. Verifica el token JSONPE_API_TOKEN.',
        };
      }

      if (response.status === 404 || response.status === 422) {
        return {
          success: false,
          error: `No se encontraron datos para el DNI ${dni} en RENIEC.`,
        };
      }

      return {
        success: false,
        error: `Error al consultar RENIEC (HTTP ${response.status}).`,
      };
    }

    const data = await response.json();

    // Json.pe returns { success, message, data: { ... } }
    if (data.success === false || data.error) {
      return {
        success: false,
        error: data.message || data.error || `No se encontraron datos para el DNI ${dni}.`,
      };
    }

    // The actual citizen data is nested inside data.data
    const citizen = data.data || data;

    return {
      success: true,
      data: {
        dni: citizen.numero || citizen.dni || dni,
        nombres: citizen.nombres || '',
        apellidoPaterno: citizen.apellido_paterno || citizen.apellidoPaterno || '',
        apellidoMaterno: citizen.apellido_materno || citizen.apellidoMaterno || '',
        nombreCompleto: citizen.nombre_completo
          || citizen.nombreCompleto
          || [citizen.nombres, citizen.apellido_paterno, citizen.apellido_materno]
              .filter(Boolean)
              .join(' ')
          || 'No disponible',
        direccion: citizen.direccion_completa || citizen.direccion || '',
        codigoVerificacion: citizen.codigo_verificacion || '',
      },
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'La consulta a RENIEC tardó demasiado (timeout). Intenta de nuevo.',
      };
    }

    console.error('[reniec] Unexpected error:', error.message);
    return {
      success: false,
      error: `Error inesperado al consultar RENIEC: ${error.message}`,
    };
  }
}
