// ──────────────────────────────────────────────────────────────────
// MCP Tool: Table Explorer
// Permite a Claude explorar el esquema de la base de datos
// antes de generar consultas SQL.
// ──────────────────────────────────────────────────────────────────

import { chatbotQuery } from '../../chatbot-db.js';

/**
 * Get the schema (columns, types, constraints) for tables in the hospital database.
 *
 * @param {{ table_name?: string }} args
 * @returns {Promise<string>} JSON string with schema information
 */
export async function execute(args = {}) {
  try {
    const { table_name } = args;

    // ── Build the query for columns ──────────────────────────────
    let columnsQuery = `
      SELECT 
        c.table_name    AS tabla,
        c.column_name   AS columna,
        c.data_type     AS tipo_dato,
        c.is_nullable   AS permite_nulo,
        c.column_default AS valor_por_defecto
      FROM information_schema.columns c
      WHERE c.table_schema = 'public'
    `;
    const params = [];

    if (table_name) {
      columnsQuery += ` AND c.table_name = $1`;
      params.push(table_name.toLowerCase().trim());
    }

    columnsQuery += ` ORDER BY c.table_name, c.ordinal_position`;

    const { rows: columns } = await chatbotQuery(columnsQuery, params);

    if (columns.length === 0) {
      if (table_name) {
        return JSON.stringify({
          error: `No se encontró la tabla "${table_name}". Usa explore_tables sin parámetros para ver todas las tablas disponibles.`,
        });
      }
      return JSON.stringify({ error: 'No se encontraron tablas en el esquema público.' });
    }

    // ── Fetch foreign key relationships ──────────────────────────
    let fkQuery = `
      SELECT
        tc.table_name       AS tabla_origen,
        kcu.column_name     AS columna_origen,
        ccu.table_name      AS tabla_destino,
        ccu.column_name     AS columna_destino
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `;
    const fkParams = [];

    if (table_name) {
      fkQuery += ` AND tc.table_name = $1`;
      fkParams.push(table_name.toLowerCase().trim());
    }

    fkQuery += ` ORDER BY tc.table_name`;

    const { rows: foreignKeys } = await chatbotQuery(fkQuery, fkParams);

    // ── Group columns by table ───────────────────────────────────
    const tables = {};
    for (const col of columns) {
      if (!tables[col.tabla]) {
        tables[col.tabla] = { columnas: [], relaciones: [] };
      }
      tables[col.tabla].columnas.push({
        nombre: col.columna,
        tipo: col.tipo_dato,
        nulo: col.permite_nulo === 'YES',
        default: col.valor_por_defecto,
      });
    }

    // ── Attach foreign keys to their tables ──────────────────────
    for (const fk of foreignKeys) {
      if (tables[fk.tabla_origen]) {
        tables[fk.tabla_origen].relaciones.push({
          columna: fk.columna_origen,
          referencia: `${fk.tabla_destino}.${fk.columna_destino}`,
        });
      }
    }

    return JSON.stringify({
      descripcion: 'Esquema de la base de datos del hospital SIGHOS',
      tablas: tables,
    });
  } catch (error) {
    console.error('[table-explorer] Error:', error.message);
    return JSON.stringify({
      error: `Error al explorar las tablas: ${error.message}`,
    });
  }
}
