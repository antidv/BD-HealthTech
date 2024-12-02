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

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "Esta programación de cita ya existe",
        });
      }
      
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la programación de cita");
  }
};

export const getCitasProgramadas = async (req, res) => {
  try {
    const idusuario = req.userId;
    const connection = await pool.getConnection();

    const pacienteRows = await connection.query('SELECT ciudad FROM paciente WHERE idusuario = ?', [idusuario]);
    const { ciudad }= pacienteRows[0];

    const { page = 1, limit = 10, idconsultorio, fecha = '' } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const conditions = [`p.ciudad = ?`];
    const params = [ciudad];

    if (idconsultorio) {
      conditions.push(`c.idconsultorio = ?`);
      params.push(idconsultorio);
    }
    
    if (fecha) {
      conditions.push("DATE(pc.fecha) = ?");
      params.push(fecha);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

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
      INNER JOIN posta p ON cp.idposta = p.idposta
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
      cupos_disponibles: row.cupos_disponibles,
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
        INNER JOIN posta p ON cp.idposta = p.idposta
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
      SELECT pc.idprogramacion_cita,
             DATE_FORMAT(pc.fecha, '%d-%m-%Y') AS fecha,
             m.idmedico as idmedico,
             CONCAT(m.nombre, ' ', m.apellidoP, ' ', m.apellidoM) AS medico,
             c.nombre AS consultorio, 
             p.nombre AS posta, 
             h.hora_inicio, 
             h.hora_fin,
             h.idhorario as idhorario
      FROM programacion_cita pc
      INNER JOIN medico_consultorio_posta mcp ON pc.idmedconposta = mcp.idmedconposta
      INNER JOIN medico m ON mcp.idmedico = m.idmedico
      INNER JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
      INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
      INNER JOIN posta p ON cp.idposta = p.idposta
      INNER JOIN horario h ON pc.idhorario = h.idhorario
      WHERE pc.idprogramacion_cita = ?;
    `;

    const rows = await connection.query(query, [id]);

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "La programación de cita no existe" });
    }

    const row = rows[0];
    const formattedRow = {
      idprogramacion_cita: row.idprogramacion_cita,
      fecha: row.fecha,
      idmedico: row.idmedico,
      nombre: row.medico,
      consultorio: row.consultorio,
      posta: row.posta,
      idhorario: row.idhorario,
      hora: `${formatTime(row.hora_inicio)} - ${formatTime(row.hora_fin)}`,
    };

    connection.release();
    res.status(200).json(formattedRow);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la programación de cita");
  }
};

export const deleteProgramacionCita = async (req, res) => {
  let connection;
    try {
        connection = await pool.getConnection();
        const { id } = req.params;
        const rows = await connection.query(
            `SELECT cupos_disponibles, cupos_totales 
             FROM programacion_cita 
             WHERE idprogramacion_cita = ?`,
            [id]
        );

        if (rows.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Programación de cita no encontrada" });
        }

        const { cupos_disponibles, cupos_totales } = rows[0];

        if (cupos_disponibles !== cupos_totales) {
            connection.release();
            return res.status(400).json({ message: "No se puede eliminar la programación de cita porque ya hay pacientes que han programado una cita para esa fecha" });
        }

        await connection.query(
            `DELETE FROM programacion_cita 
             WHERE idprogramacion_cita = ?`,
            [id]
        );

        connection.release();
        res.status(200).json({ message: "Programación de cita eliminada exitosamente" });
    } catch (error) {
        if (connection) {
            connection.release();
        }
        console.error("Error al eliminar la programación de cita:", error);
        res.status(500).send("Error al eliminar la programación de cita");
    }
}
