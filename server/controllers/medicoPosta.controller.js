import { pool } from "../src/database.js";

export const postMedicoPosta = async (req, res) => {
    try {
        const { idmedico, idposta } = req.body;

        const connection = await pool.getConnection();
        const result = await connection.query(
            `INSERT INTO medico_posta (idmedico, idposta) VALUES (?, ?)`,
            [idmedico, idposta]
        );

        res.status(201).json({
            idmedico_posta: result.insertId.toString(),
            idmedico,
            idposta,
        });
        connection.end();
    } catch (error) {
        console.error("Error al crear la relación Medico-Posta:", error);
        res.status(500).send("Error al crear la relación Medico-Posta");
    }
};

export const getMedicoPostas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT * FROM medico_posta`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener las relaciones Medico-Posta:", error);
        res.status(500).send("Error al obtener las relaciones Medico-Posta");
    }
};

export const getMedicoPosta = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM medico_posta WHERE idmedico_posta = ?`,
            [id]
        );

        if (rows.length <= 0) {
            return res.status(404).json({ error: "La relación Medico-Posta no existe" });
        }

        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error("Error al obtener la relación Medico-Posta:", error);
        res.status(500).send("Error al obtener la relación Medico-Posta");
    }
};

export const updateMedicoPosta = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;

        const connection = await pool.getConnection();
        const result = await connection.query(
            `UPDATE medico_posta SET disponible = ? WHERE idmedico_posta = ?`,
            [disponible, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "La relación Medico-Posta no existe" });
        }

        const updatedRelation = await connection.query(
            `SELECT * FROM medico_posta WHERE idmedico_posta = ?`,
            [id]
        );
        res.json(updatedRelation[0]);
        connection.end();
    } catch (error) {
        console.error("Error al actualizar la relación Medico-Posta:", error);
        res.status(500).send("Error al actualizar la relación Medico-Posta");
    }
};

