import { pool } from "../src/database.js";

export const postMedico = async (req, res, next) => {
    try {
        const { correo, contrasenia, nombre, apellidoP, apellidoM, especialidad, estado } = req.body;

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

            res.json({ idusuario: idusuario.toString(), idmedico: medicoResult.insertId.toString() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el médico');
    }
};

export const getMedicos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM medico');
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el médico');
    }
};

export const getMedico = async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM medico WHERE idmedico = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({ error: "El médico no existe" });
        }
        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el médico');
    }
}
  
export const updateMedicos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { id } = req.params;
        const { estado } = req.body;
        const result = await connection.query('UPDATE medico SET estado = ? WHERE idmedico = ?', [estado, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El médico no existe" });
        }
        const rows = await connection.query('SELECT * FROM medico WHERE idmedico = ?', [id]);
        res.json(rows[0]);
        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el médico');
    }
};
  
export const deleteMedicos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const { id } = req.params;

        const result = await connection.query('SELECT idusuario FROM medico WHERE idmedico = ?', [id]);
        const medico = result[0];

        if (!medico || medico.length <= 0) {
            await connection.rollback();
            return res.status(404).json({ error: "El médico no existe" });
        }

        const idusuario = medico.idusuario;

        const resultUsuario = await connection.query('DELETE FROM usuario WHERE idusuario = ?', [idusuario]);
        if (resultUsuario.affectedRows <= 0) {
            await connection.rollback();
            return res.status(404).json({ error: "El usuario no existe" });
        }

        await connection.commit();
        res.json('Datos de medico y usuario eliminados con éxito');
        connection.end();
    } catch (error) {
        console.error('Error durante la eliminación:', error);
        res.status(500).send('Error al eliminar el médico');
    }
};
