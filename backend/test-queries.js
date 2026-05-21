import { query } from './db.js';

async function testQueries() {
  try {
    const { rows: r1 } = await query(`SELECT COUNT(*) FROM citas WHERE date_trunc('month', fecha_cita) = date_trunc('month', CURRENT_DATE)`);
    console.log('Citas mes:', r1[0]);

    const { rows: r2 } = await query(`
      SELECT SUM(s.precio) as sum
      FROM citas c
      JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE date_trunc('day', c.fecha_cita) = date_trunc('day', CURRENT_DATE)
    `);
    console.log('Ingresos hoy:', r2[0]);

    const { rows: r3 } = await query(`
      SELECT SUM(s.precio) as sum
      FROM citas c
      JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE date_trunc('month', c.fecha_cita) = date_trunc('month', CURRENT_DATE)
    `);
    console.log('Ingresos mes:', r3[0]);

    const { rows: r4 } = await query(`SELECT SUM(salario) as sum FROM personal WHERE estado = 'ACTIVO'`);
    console.log('Gastos:', r4[0]);

    const { rows: r5 } = await query(`SELECT COUNT(*) FROM citas WHERE estado = 'EN ESPERA'`);
    console.log('Esperando:', r5[0]);

    const { rows: r6 } = await query(`SELECT COUNT(*) FROM citas WHERE estado = 'COMPLETADA' AND date_trunc('month', fecha_cita) = date_trunc('month', CURRENT_DATE)`);
    console.log('Completadas mes:', r6[0]);

    const { rows: r7 } = await query(`
      SELECT s.nombre as name, COUNT(*)::int as value
      FROM citas c
      JOIN servicios s ON c.id_servicio = s.id_servicio
      WHERE date_trunc('month', c.fecha_cita) = date_trunc('month', CURRENT_DATE)
      GROUP BY s.nombre
      ORDER BY value DESC
      LIMIT 10
    `);
    console.log('Top services:', r7);

  } catch (err) {
    console.error(err);
  }
}
testQueries();
