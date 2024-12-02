import { pool } from "../src/database.js";

export const getEnfermedades = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT idenfermedad, nombre FROM enfermedad`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener las enfermedades:", error);
        res.status(500).send("Error al obtener las enfermedades");
    }
};

export const getMedicamentos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT idmedicamento, nombre FROM medicamento`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener los medicamentos:", error);
        res.status(500).send("Error al obtener los medicamentos");
    }
};