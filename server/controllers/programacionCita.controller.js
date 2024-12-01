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
        `INSERT INTO programacion_cita (idmedconposta, idhorario, fecha, cupos_totales)
         VALUES (?, ?, ?, ?)`,
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

// Por las dudas

export const getProgramacionesCita = async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const { page = 1, limit = 10, nombre = '', especialidad = '', consultorio= '' } = req.query;
  
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;
      
      const conditions = [];
      const params = [];

      if (nombre) {
          conditions.push('m.nombre LIKE ?');
          params.push(`%${nombre}%`);
      }
      if (especialidad) {
          conditions.push('m.especialidad LIKE ?');
          params.push(`%${especialidad}%`);
      }
      if (consultorio) {
          conditions.push('c.nombre LIKE ?');
          params.push(`%${consultorio}%`);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT pc.idprogramacion_cita,
               m.nombre AS medico, 
               m.especialidad, 
               c.nombre AS consultorio, 
               p.nombre AS posta, 
               h.hora_inicio, 
               h.hora_fin
        FROM programacion_cita pc
        INNER JOIN medico_consultorio_posta mcp ON pc.idmedconposta = mcp.idmedconposta
        INNER JOIN medico m ON mcp.idmedico = m.idmedico
        INNER JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
        INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
        INNER JOIN posta p ON cp.idposta = p.idposta
        INNER JOIN horario h ON pc.idhorario = h.idhorario
        ${whereClause}
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

      res.status(200).json({
        data: rows,
        total: Number(total),
        page: pageNumber,
        limit: limitNumber,
      });
  
      connection.release();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las programaciones de citas");
    }
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
