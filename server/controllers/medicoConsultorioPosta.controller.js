import { pool } from "../src/database.js";

export const postMedicoConsultorioPosta = async (req, res) => {
  try {
    const { idmedico, idconsultorio_posta} = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const result = await connection.query(
        `INSERT INTO medico_consultorio_posta (idmedico, idconsultorio_posta)
         VALUES (?, ?)`,
        [idmedico, idconsultorio_posta]
      );

      await connection.commit();
      res.status(201).json({ idmedconposta: result.insertId.toString() });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el médico en el consultorio o posta");
  }
};

//Por las dudas

export const getMedicoConsultorioPostas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { page = 1, limit = 10, nombre = '', especialidad = '' } = req.query;

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

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
            SELECT
                mcp.idmedconposta, 
                m.nombre AS medico_nombre,
                m.especialidad AS medico_especialidad,
                c.nombre AS consultorio_nombre,
                p.nombre AS posta_nombre,
                p.direccion AS posta_direccion
            FROM medico_consultorio_posta mcp
            INNER JOIN medico m ON m.idmedico = mcp.idmedico
            INNER JOIN consultorio_posta cp ON cp.idconsultorio_posta = mcp.idconsultorio_posta
            INNER JOIN consultorio c ON c.idconsultorio = cp.idconsultorio
            INNER JOIN posta p ON p.idposta = cp.idposta
            ${whereClause}
            LIMIT ? OFFSET ?
        `;

        params.push(limitNumber, offset);

        const rows = await connection.query(query, params);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM medico_consultorio_posta mcp
            INNER JOIN medico m ON m.idmedico = mcp.idmedico
            INNER JOIN consultorio_posta cp ON cp.idconsultorio_posta = mcp.idconsultorio_posta
            INNER JOIN consultorio c ON c.idconsultorio = cp.idconsultorio
            INNER JOIN posta p ON p.idposta = cp.idposta
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
        res.status(500).send('Error al obtener la información de médicos, consultorios y postas');
    }
  };


export const getMedicoConsultorioPosta = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM medico_consultorio_posta WHERE idmedconposta = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "El registro no existe" });
    }

    res.status(200).json(rows[0]);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el registro de médico-consultorio-posta");
  }
};

export const updateMedicoConsultorioPosta = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;
    const { disponible } = req.body;

    const result = await connection.query(
      "UPDATE medico_consultorio_posta SET disponible = ? WHERE idmedconposta = ?",
      [disponible, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "El registro no existe" });
    }

    const updatedRows = await connection.query(
      "SELECT * FROM medico_consultorio_posta WHERE idmedconposta = ?",
      [id]
    );

    res.json(updatedRows[0]);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el registro de médico-consultorio-posta");
  }
};
