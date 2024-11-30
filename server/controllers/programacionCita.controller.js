import { pool } from "../src/database.js";

export const postProgramacionCita = async (req, res) => {
  try {
    const { idmedconposta, idhorario, cupos_totales } = req.body;

    if (!idmedconposta || !idhorario || !cupos_totales) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const cuposDisponibles = cupos_totales;
      const result = await connection.query(
        `INSERT INTO programacion_cita (idmedconposta, idhorario, cupos_totales, cupos_disponibles)
         VALUES (?, ?, ?, ?)`,
        [idmedconposta, idhorario, cupos_totales, cuposDisponibles]
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
      const { page = 1, limit = 10, search = "" } = req.query;
  
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;
  
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
        WHERE (m.nombre LIKE ? OR ? = '')
            AND (m.especialidad LIKE ? OR ? = '')
            AND (c.nombre LIKE ? OR ? = '')
        LIMIT ? OFFSET ?;
      `;
      const rows = await connection.query(query, [
        `%${search}%`, search,
        `%${search}%`, search,
        `%${search}%`, search,
        limitNumber,
        offset,
      ]);
  
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM programacion_cita pc
        INNER JOIN medico_consultorio_posta mcp ON pc.idmedconposta = mcp.idmedconposta
        INNER JOIN medico m ON mcp.idmedico = m.idmedico
        INNER JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
        INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
        WHERE (m.nombre LIKE ? OR ? = '')
            AND (m.especialidad LIKE ? OR ? = '')
            AND (c.nombre LIKE ? OR ? = '')
      `;
      const [{ total }] = await connection.query(countQuery, [
        `%${search}%`, search,
        `%${search}%`, search,
        `%${search}%`, search,
      ]);

      const totalNumber = Number(total);
  
      res.status(200).json({
        data: rows,
        total: totalNumber,
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
