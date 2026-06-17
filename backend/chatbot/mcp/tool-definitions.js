// ──────────────────────────────────────────────────────────────────
// Declaraciones de herramientas MCP para Claude Tool Use.
// Estas definiciones le dicen a Claude qué herramientas tiene
// disponibles y cómo invocarlas.
// ──────────────────────────────────────────────────────────────────

/**
 * Tool declarations in a shared format.
 * Converted to Claude's tools[] schema at runtime by the agent service.
 */
export const TOOL_DECLARATIONS = [
  {
    name: 'explore_tables',
    description:
      'Retorna el esquema de la base de datos del hospital SIGHOS: tablas disponibles, ' +
      'sus columnas, tipos de datos y relaciones (foreign keys). ' +
      'Usa esta herramienta PRIMERO para entender la estructura antes de generar consultas SQL. ' +
      'Puedes filtrar por una tabla específica pasando su nombre.',
    parameters: {
      type: 'OBJECT',
      properties: {
        table_name: {
          type: 'STRING',
          description:
            'Nombre opcional de una tabla específica para obtener su esquema. ' +
            'Ejemplos: "pacientes", "citas", "servicios", "especialidades", "personal", ' +
            '"historial_clinico", "horarios_laborales". ' +
            'Si no se proporciona, se retorna el esquema de todas las tablas.',
        },
      },
    },
  },
  {
    name: 'execute_query',
    description:
      'Ejecuta una consulta SQL SELECT de solo lectura contra la base de datos del hospital. ' +
      'La consulta será validada por seguridad antes de ejecutarse: solo se permiten SELECT, ' +
      'se prohíben INSERT/UPDATE/DELETE/DROP, y se aplica un límite máximo de 100 filas. ' +
      'SIEMPRE usa explore_tables primero para conocer la estructura antes de generar SQL. ' +
      'Genera consultas que usen los nombres reales de las columnas en español.',
    parameters: {
      type: 'OBJECT',
      properties: {
        sql_query: {
          type: 'STRING',
          description:
            'La consulta SQL SELECT a ejecutar. Debe usar los nombres reales de tablas y ' +
            'columnas de la base de datos (en español). Ejemplo: ' +
            '"SELECT nombre_completo, dni FROM pacientes WHERE dni = \'12345678\'"',
        },
      },
      required: ['sql_query'],
    },
  },
  {
    name: 'search_identity',
    description:
      'Busca información de una persona en RENIEC (Registro Nacional de Identificación) ' +
      'por su número de DNI usando la API externa de Json.pe. ' +
      'Usa esta herramienta cuando el usuario mencione un DNI y necesites obtener el ' +
      'nombre completo de la persona, o cuando quieras verificar la identidad de alguien. ' +
      'Retorna nombres, apellidos y datos de ubicación del ciudadano.',
    parameters: {
      type: 'OBJECT',
      properties: {
        document_number: {
          type: 'STRING',
          description: 'El número de DNI a consultar. Debe tener exactamente 8 dígitos numéricos.',
        },
      },
      required: ['document_number'],
    },
  },
];
