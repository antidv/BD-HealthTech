import { pool } from "../src/database.js";

export const postHorario = async (req, res) => {
    try {
        const { hora_inicio, hora_fin } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const result = await connection.query(
                `INSERT INTO horario (hora_inicio, hora_fin)
                 VALUES (?, ?)`,
                [hora_inicio, hora_fin]
            );

            await connection.commit();
            res.json({ idhorario: result.insertId.toString() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error al crear el horario:", error);
        res.status(500).send("Error al registrar el horario");
    }
};

export const getHorarios = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM horario');
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        res.status(500).send("Error al obtener los horarios");
    }
};

export const getHorario = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM horario WHERE idhorario = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({ error: "El horario no existe" });
        }
        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error("Error al obtener el horario:", error);
        res.status(500).send("Error al obtener el horario");
    }
};

export const updateHorario = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { id } = req.params;
        const { hora_inicio, hora_fin } = req.body;

        const result = await connection.query(
            `UPDATE horario SET hora_inicio = ?, hora_fin = ? WHERE idhorario = ?`,
            [hora_inicio, hora_fin, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El horario no existe" });
        }

        const updatedHorario = await connection.query('SELECT * FROM horario WHERE idhorario = ?', [id]);
        res.json(updatedHorario[0]);
        connection.end();
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        res.status(500).send("Error al actualizar el horario");
    }
};

export const deleteHorario = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { id } = req.params;

        const result = await connection.query('DELETE FROM horario WHERE idhorario = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El horario no existe" });
        }

        res.json({ message: "Horario eliminado con éxito" });
        connection.end();
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        res.status(500).send("Error al eliminar el horario");
    }
};
