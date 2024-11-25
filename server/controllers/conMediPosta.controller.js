import { pool } from "../src/database.js";

export const postConsultorioMediposta = async (req, res) => {
    try {
        const { idconsultorio_posta, idhorario, idmedico_posta, fecha, dia_semana, cupos } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const result = await connection.query(
                `INSERT INTO consultoriomediposta (idconsultorio_posta, idhorario, idmedico_posta, fecha, dia_semana, cupos)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [idconsultorio_posta, idhorario, idmedico_posta, fecha, dia_semana, cupos]
            );

            await connection.commit();
            res.json({ idconMediPosta: result.insertId.toString() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error al crear el consultorio-medico-posta:", error);
        res.status(500).send("Error al registrar el consultorio-medico-posta");
    }
};

export const getConsultoriosMedipostas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM consultoriomediposta');
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener los consultorios-medicos-postas:", error);
        res.status(500).send("Error al obtener los consultorios-medicos-postas");
    }
};

export const getConsultorioMediposta = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM consultoriomediposta WHERE idconMediPosta = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({ error: "El consultorio-medico-posta no existe" });
        }
        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error("Error al obtener el consultorio-medico-posta:", error);
        res.status(500).send("Error al obtener el consultorio-medico-posta");
    }
};

export const updateConsultorioMediposta = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { id } = req.params;
        const { fecha, dia_semana, cupos } = req.body;

        const result = await connection.query(
            `UPDATE consultoriomediposta SET fecha = ?, dia_semana = ?, cupos = ?
             WHERE idconMediPosta = ?`,
            [fecha, dia_semana, cupos, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El consultorio-medico-posta no existe" });
        }

        const updatedConsultorioMediposta = await connection.query('SELECT * FROM consultoriomediposta WHERE idconMediPosta = ?', [id]);
        res.json(updatedConsultorioMediposta[0]);
        connection.end();
    } catch (error) {
        console.error("Error al actualizar el consultorio-medico-posta:", error);
        res.status(500).send("Error al actualizar el consultorio-medico-posta");
    }
};

export const deleteConsultorioMediposta = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { id } = req.params;

        const result = await connection.query('DELETE FROM consultoriomediposta WHERE idconMediPosta = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El consultorio-medico-posta no existe" });
        }

        res.json({ message: "Consultorio-medico-posta eliminada con éxito" });
        connection.end();
    } catch (error) {
        console.error("Error al eliminar el consultorio-medico-posta:", error);
        res.status(500).send("Error al eliminar el consultorio-medico-posta");
    }
};
