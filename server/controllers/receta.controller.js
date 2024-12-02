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

export const postDiagnostico = async (req, res) => {
    try {
        const { idcita } = req.params;
        const { idenfermedad, observacion, idmedicamento, dosis } = req.body;

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const diagnosticoResult = await connection.query(
            "INSERT INTO diagnostico (idcita, idenfermedad, observacion) VALUES (?, ?, ?)",
            [idcita, idenfermedad, observacion]
        );
        const iddiagnostico = diagnosticoResult.insertId;

        await connection.query(
            "INSERT INTO receta (iddiagnostico, idmedicamento, dosis) VALUES (?, ?, ?)",
            [iddiagnostico, idmedicamento, dosis]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({ message: "Diagnóstico y receta creados exitosamente" });
    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error("Error al crear el diagnóstico y la receta:", error);
        res.status(500).send("Error al crear el diagnóstico y la receta");
    }
};