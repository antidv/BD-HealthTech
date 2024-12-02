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

export const verPacientes = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const result = await connection.query("SELECT * FROM paciente");
        res.json(result);
        connection.release();
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(500).send('Error al obtener los pacientes');
    }
};

export const verPaciente = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM paciente WHERE idpaciente = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({ error: "El paciente no existe" });
        }
        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el paciente');
    }
};

export const perfilPaciente = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();

        const rows = await connection.query('SELECT * FROM paciente WHERE idusuario = ?', [idusuario]);
        if (rows.length <= 0) {
            connection.release();
            return res.status(404).json({ error: "El paciente no existe" });
        }

        const paciente = rows[0];
        if (paciente.fecha_nacimiento) {
            paciente.fecha_nacimiento = formatDate(paciente.fecha_nacimiento);
        }

        connection.release();
        res.status(200).json(paciente);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el paciente');
    }
};

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

export const updatePaciente = async (req, res) => {
    try{
        const idusuario = req.userId;
        const connection = await pool.getConnection();

        const paciente = await connection.query(
            "SELECT idpaciente FROM paciente WHERE idusuario = ?",
            [idusuario]
        );

        const idpaciente = paciente[0].idpaciente;

        await connection.beginTransaction();

        const { correo, contrasenia, celular } = req.body;

        if(celular){
            await connection.query(
                "UPDATE paciente SET celular = ? WHERE idpaciente = ?",
                [celular, idpaciente]
            );
        }
        if(correo || contrasenia){
            const updates = [];
            const params = [];

            if (correo) {
                updates.push("correo = ?");
                params.push(correo);
            }

            if (contrasenia) {
                updates.push("contrasenia = ?");
                params.push(contrasenia);
            }

            params.push(idusuario);

            await connection.query(
                `UPDATE usuario SET ${updates.join(", ")} WHERE idusuario = ?`,
                params
            );
        }

        await connection.commit();
        res.json({ message: "Paciente actualizado" });
        connection.release();

    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(500).send('Error al actualizar el paciente');
    }
};