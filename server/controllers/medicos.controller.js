import { pool } from "../src/database.js";

export const postMedico = async (req, res, next) => {
  try {
    const {
      correo,
      contrasenia,
      nombre,
      apellidoP,
      apellidoM,
      dni,
      especialidad,
    } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `CALL sp_insertar_medico(?, ?, ?, ?, ?, ?, ?)`,
        [correo, contrasenia, nombre, apellidoP, apellidoM, dni, especialidad]
      );

      if (result[0] && result[0].mensaje === 'Médico registrado con éxito') {
        await connection.commit();
        res.status(201).json({ message: result[0].mensaje });
      } else {
        await connection.rollback();
        res.status(400).json({ error: result[0].mensaje });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).send("Error al registrar el médico");
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).send("Error en la conexión a la base de datos");
  }
};

export const getMedicos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { page = 1, limit = 10, search = '' } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        const query = `
            SELECT * FROM medico
            WHERE nombre LIKE ?
            LIMIT ? OFFSET ?
        `;
        const rows = await connection.query(query, [`%${search}%`, limitNumber, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total FROM medico
            WHERE nombre LIKE ?
        `;
        const [{ total }] = await connection.query(countQuery, [`%${search}%`]);
        const totalNumber = Number(total);
        const totalPages = Math.ceil(totalNumber / limitNumber);

        res.status(200).json({
            data: rows,
            total: totalNumber,
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages
        });

        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los médicos');
    }
};

export const getMedico = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM medico WHERE idmedico = ?",
      [req.params.id]
    );
    if (rows.length <= 0) {
      return res.status(404).json({ error: "El médico no existe" });
    }
    res.status(200).json(rows[0]);
    connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el médico");
  }
};

export const updateMedicos = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;
    const { disponible } = req.body;
    const result = await connection.query(
      "UPDATE medico SET disponible = ? WHERE idmedico = ?",
      [disponible, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "El médico no existe" });
    }
    const rows = await connection.query(
      "SELECT * FROM medico WHERE idmedico = ?",
      [id]
    );
    res.json(rows[0]);
    connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el médico");
  }
};
