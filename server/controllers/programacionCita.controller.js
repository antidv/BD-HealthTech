import { pool } from "../src/database.js";

export const postProgramacionCita = async (req, res) => {
  try {
    const { idmedconposta, idhorario, fecha, cupos_totales } = req.body;

    if (!idmedconposta || !idhorario || !cupos_totales || !fecha) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const cuposDisponibles = cupos_totales;
      const result = await connection.query(
        `INSERT INTO programacion_cita (idmedconposta, idhorario, fecha, cupos_totales, cupos_disponibles)
         VALUES (?, ?, ?, ?, ?)`,
        [idmedconposta, idhorario, fecha, cupos_totales, cuposDisponibles]
      );

      await connection.commit();

      res.status(201).json({
        idprogramacion_cita: result.insertId.toString(),
        message: "Programación creada exitosamente",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la programación de cita");
  }
};

export const getProgramacionesCita = async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const { page = 1, limit = 10, nombre = '', fecha= '' } = req.query;
  
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;
      
      const conditions = [];
      const params = [];

      if (nombre) {
          conditions.push('p.nombre LIKE ?');
          params.push(`%${nombre}%`);
      }
      if (fecha) {
          conditions.push("DATE(pc.fecha) = ?");
          params.push(fecha);
    }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT pc.idprogramacion_cita,
               DATE_FORMAT(pc.fecha, '%d-%m-%Y') AS fecha,
               m.nombre AS medico,
               m.apellidoP AS apellido,
               c.nombre AS consultorio, 
               p.nombre AS posta, 
               h.hora_inicio, 
               h.hora_fin,
               pc.cupos_totales,
               pc.cupos_disponibles
        FROM programacion_cita pc
        INNER JOIN medico_consultorio_posta mcp ON pc.idmedconposta = mcp.idmedconposta
        INNER JOIN medico m ON mcp.idmedico = m.idmedico
        INNER JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
        INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
        INNER JOIN posta p ON cp.idposta = p.idposta
        INNER JOIN horario h ON pc.idhorario = h.idhorario
        ${whereClause}
        ORDER BY pc.fecha DESC
        LIMIT ? OFFSET ?;
      `;

      params.push(limitNumber, offset);
      const rows = await connection.query(query, params);

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM programacion_cita pc
        INNER JOIN medico_consultorio_posta mcp ON pc.idmedconposta = mcp.idmedconposta
        INNER JOIN medico m ON mcp.idmedico = m.idmedico
        INNER JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
        INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
        ${whereClause}
      `;
  
      const [{ total }] = await connection.query(countQuery, params.slice(0, -2));
      const totalNumber = Number(total);
      const totalPages = Math.ceil(totalNumber / limitNumber);

      connection.release();

      const formattedRows = rows.map(row => ({
        idprogramacion_cita: row.idprogramacion_cita,
        fecha: row.fecha,
        nombre: row.medico,
        apellido: row.apellido,
        consultorio: row.consultorio,
        posta: row.posta,
        hora: `${formatTime(row.hora_inicio)} - ${formatTime(row.hora_fin)}`,
        cupos_totales: row.cupos_totales,
        cupos_disponibles: row.cupos_disponibles
    }));

      res.status(200).json({
        data: formattedRows,
        total: totalNumber,
        page: pageNumber,
        limit: limitNumber,
        totalPages: totalPages,
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las programaciones de citas");
    }
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
};

export const getProgramacionCita = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;

    const query = `
      SELECT * FROM programacion_cita WHERE idprogramacion_cita = ?;
    `;
    const rows = await connection.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "La programación de cita no existe" });
    }

    res.status(200).json(rows[0]);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la programación de cita");
  }
};

export const updateProgramacionCita = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;
    const { cupos_totales, idhorario } = req.body;

    const result = await connection.query(
      "UPDATE programacion_cita SET cupos_totales = ?, idhorario = ? WHERE idprogramacion_cita = ?",
      [cupos_totales, idhorario, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "La programación de cita no existe" });
    }

    const rows = await connection.query(
      "SELECT * FROM programacion_cita WHERE idprogramacion_cita = ?",
      [id]
    );

    res.status(200).json(rows[0]);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la programación de cita");
  }
};
