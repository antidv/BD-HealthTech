import { pool } from "../src/database.js";

export const postConsultorioPosta = async (req, res) => {
    try {
        const { idconsultorio, idposta } = req.body;

        const connection = await pool.getConnection();
        const result = await connection.query(
            `INSERT INTO consultorio_posta (idconsultorio, idposta) VALUES (?, ?)`,
            [idconsultorio, idposta]
        );

        res.status(201).json({
            idconsultorio_posta: result.insertId.toString(),
            idconsultorio,
            idposta,
        });
        connection.end();
    } catch (error) {
        console.error("Error al crear la relación Consultorio-Posta:", error);
        res.status(500).send("Error al crear la relación Consultorio-Posta");
    }
};

export const getConsultorioPostas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT * FROM consultorio_posta`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener las relaciones Consultorio-Posta:", error);
        res.status(500).send("Error al obtener las relaciones Consultorio-Posta");
    }
};

export const getConsultorioPosta = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM consultorio_posta WHERE idconsultorio_posta = ?`,
            [id]
        );

        if (rows.length <= 0) {
            return res.status(404).json({ error: "La relación Consultorio-Posta no existe" });
        }

        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error("Error al obtener la relación Consultorio-Posta:", error);
        res.status(500).send("Error al obtener la relación Consultorio-Posta");
    }
};

export const updateConsultorioPosta = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE consultorio_posta SET disponible = ? WHERE idconsultorio_posta = ?`,
            [disponible, id]
        );

        const updatedRelation = await connection.query(
            `SELECT * FROM consultorio_posta WHERE idconsultorio_posta = ?`,
            [id]
        );
        res.json(updatedRelation[0]);
        connection.end();
    } catch (error) {
        console.error("Error al actualizar la relación Consultorio-Posta:", error);
        res.status(500).send("Error al actualizar la relación Consultorio-Posta");
    }
};