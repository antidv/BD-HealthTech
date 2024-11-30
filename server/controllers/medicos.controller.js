import { pool } from "../src/database.js";

export const postMedico = async (req, res, next) => {
  try {
    const {
      correo,
      contrasenia,
      nombre,
      apellidoP,
      apellidoM,
      especialidad,
      estado,
    } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const resultadoCorreo = await connection.query(
        "SELECT 1 FROM usuario WHERE correo = ?",
        [correo]
      );

      if (resultadoCorreo.length > 0) {
        return res.status(400).json({ error: "El correo ingresado ya existe" });
      }

      const usuarioResult = await connection.query(
        `INSERT INTO usuario (rol, correo, contrasenia)
                 VALUES ('medico', ?, ?)`,
        [correo, contrasenia]
      );

      const idusuario = usuarioResult.insertId;

      const medicoResult = await connection.query(
        `INSERT INTO medico (idusuario, nombre, apellidoP, apellidoM, especialidad, estado)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [idusuario, nombre, apellidoP, apellidoM, especialidad, estado]
      );

      await connection.commit();

      res.json({
        idusuario: idusuario.toString(),
        idmedico: medicoResult.insertId.toString(),
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el médico");
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
    const { estado } = req.body;
    const result = await connection.query(
      "UPDATE medico SET estado = ? WHERE idmedico = ?",
      [estado, id]
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
