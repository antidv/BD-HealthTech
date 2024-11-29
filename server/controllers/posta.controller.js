import { pool } from "../src/database.js";

export const postPosta = async (req, res) => {
  try {
    const { nombre, ciudad, direccion, telefono, estado } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const result = await connection.query(
        `INSERT INTO posta (nombre, ciudad, direccion, telefono, estado)
                 VALUES (?, ?, ?, ?, ?)`,
        [nombre, ciudad, direccion, telefono, estado]
      );

      await connection.commit();
      res.json({ idposta: result.insertId.toString() });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error al crear la posta:", error);
    res.status(500).send("Error al registrar la posta");
  }
};

export const getPostas = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { page = 1, limit = 10 } = req.query;

    // Asegurar que page y limit sean números
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Consulta principal con límite y desplazamiento
    const query = `SELECT * FROM posta LIMIT ? OFFSET ?`;
    const rows = await connection.query(query, [limitNumber, offset]);

    // Consulta para contar el total de registros
    const countQuery = `SELECT COUNT(*) AS total FROM posta`;
    const [{ total }] = await connection.query(countQuery);

    // Convertir total de BigInt a Number
    const totalNumber = Number(total);

    const totalPages = Math.ceil(totalNumber / limitNumber);

    connection.release(); // Libera la conexión al pool

    res.status(200).json({
      data: rows,
      currentPage: pageNumber,
      totalPages,
      total: totalNumber, // Asegura que el total sea un número
    });
  } catch (error) {
    console.error("Error al obtener las postas: ", error);
    res.status(500).send("Error al obtener las postas");
  }
};

export const getPosta = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM posta WHERE idposta = ?",
      [req.params.id]
    );
    if (rows.length <= 0) {
      return res.status(404).json({ error: "La posta no existe" });
    }
    res.status(200).json(rows[0]);
    connection.end();
  } catch (error) {
    console.error("Error al obtener la posta:", error);
    res.status(500).send("Error al obtener la posta");
  }
};

export const updatePosta = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;
    const { estado } = req.body;

    const result = await connection.query(
      `UPDATE posta SET estado = ? WHERE idposta = ?`,
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "La posta no existe" });
    }

    const updatedPosta = await connection.query(
      "SELECT * FROM posta WHERE idposta = ?",
      [id]
    );
    res.json(updatedPosta[0]);
    connection.end();
  } catch (error) {
    console.error("Error al actualizar la posta:", error);
    res.status(500).send("Error al actualizar la posta");
  }
};

export const deletePosta = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;

    const result = await connection.query(
      "DELETE FROM posta WHERE idposta = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "La posta no existe" });
    }

    res.json({ message: "Posta eliminada con éxito" });
    connection.end();
  } catch (error) {
    console.error("Error al eliminar la posta:", error);
    res.status(500).send("Error al eliminar la posta");
  }
};
