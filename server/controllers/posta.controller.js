import { pool } from "../src/database.js";

export const getPostas = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { page = 1, limit = 10, search = '', city = '' } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const query = `
        SELECT * FROM posta
        WHERE nombre LIKE ? AND ciudad LIKE ?
        LIMIT ? OFFSET ?
    `;
    const rows = await connection.query(query, [`%${search}%`, `%${city}%`, limitNumber, offset]);

    const countQuery = `
        SELECT COUNT(*) AS total FROM posta
        WHERE nombre LIKE ? AND ciudad LIKE ?
    `;
    const [{ total }] = await connection.query(countQuery, [`%${search}%`, `%${city}%`]);

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
    res.status(500).send('Error al obtener las postas');
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
    const { disponible } = req.body;

    const result = await connection.query(
      `UPDATE posta SET disponible = ? WHERE idposta = ?`,
      [disponible, id]
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
