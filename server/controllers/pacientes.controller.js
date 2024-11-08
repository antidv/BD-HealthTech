import { pool } from "../src/database.js";

export const verificarPaciente = async (req, res) => {
    try {
        const { dni } = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            "SELECT * FROM paciente WHERE dni = ?",
            [dni]
        );

        if (!result) {
            connection.release();
            return res.status(404).json({ error: "El paciente no existe" });
        }

        if (result.idusuario !== null && result.idusuario !== undefined) {
            connection.release();
            return res.status(400).json({ error: "El paciente ya tiene un usuario asignado" });
        }

        res.status(200).json({ message: "Paciente encontrado, puede crear usuario", paciente: result });
        connection.release();
    } catch (error) {
        res.status(500).json({ error: "Error al verificar el paciente" });
    }
};

export const registrarPaciente = async (req, res) => {
    try {
        const { dni, correo, contrasenia } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const result = await connection.query(
                "SELECT * FROM paciente WHERE dni = ?",
                [dni]
            );

            if (!result || result.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ error: "El paciente no existe" });
            }

            const paciente = result[0];

            if (paciente.idusuario) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "El paciente ya tiene un usuario asignado" });
            }

            const usuarioResult = await connection.query(
                "INSERT INTO usuario (rol, correo, contrasenia) VALUES ('paciente', ?, ?)",
                [correo, contrasenia]
            );

            const idusuario = usuarioResult.insertId;

            await connection.query(
                "UPDATE paciente SET idusuario = ? WHERE dni = ?",
                [idusuario, dni]
            );

            await connection.commit();

            res.json({ idusuario: idusuario.toString() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al registrar el paciente:', error);
        res.status(500).send('Error al registrar el paciente');
    }
};
