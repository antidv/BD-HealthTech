// controllers/cita.controller.js
import { pool } from "../src/database.js";

// Función para convertir BigInt a string en las respuestas JSON
const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

// Obtener todas las citas
export const getCitas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const citas = await connection.query('SELECT * FROM cita');
        connection.release();
        res.status(200).json(JSON.parse(JSON.stringify(citas, replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las citas');
    }
};

// Obtener una cita por ID
export const getCita = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const citas = await connection.query('SELECT * FROM cita WHERE idcita = ?', [id]);
        connection.release();
        if (citas.length === 0) {
            res.status(404).json({ error: "La cita no existe" });
        } else {
            res.status(200).json(JSON.parse(JSON.stringify(citas[0], replacer)));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la cita');
    }
};

// Crear una nueva cita
export const postCita = async (req, res) => {
    try {
        const {
            idpaciente,
            motivo,
            fecha,
            estado,
            consultorio,
            num_cupo,
            hora_aprox,
            triaje,
            idmedico,
            idprogramacion_cita
        } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar que el paciente exista
            const paciente = await connection.query('SELECT 1 FROM paciente WHERE idpaciente = ?', [idpaciente]);
            if (paciente.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "El paciente no existe" });
            }

            // Verificar que el médico exista
            const medico = await connection.query('SELECT 1 FROM medico WHERE idmedico = ?', [idmedico]);
            if (medico.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "El médico no existe" });
            }

            // Verificar que la programación de cita exista
            const programacionCita = await connection.query('SELECT 1 FROM programacion_cita WHERE idprogramacion_cita = ?', [idprogramacion_cita]);
            if (programacionCita.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "La programación de cita no existe" });
            }

            // Insertar la cita
            const result = await connection.query(
                `INSERT INTO cita (idpaciente, motivo, fecha, estado, consultorio, num_cupo, hora_aprox, triaje, idmedico, idprogramacion_cita)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [idpaciente, motivo, fecha, estado, consultorio, num_cupo, hora_aprox, triaje, idmedico, idprogramacion_cita]
            );

            await connection.commit();
            connection.release();
            res.status(201).json({ idcita: result.insertId.toString() }); // Convertir BigInt a string
        } catch (error) {
            await connection.rollback();
            connection.release();
            console.error(error);
            res.status(500).send('Error al crear la cita');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la cita');
    }
};

// Actualizar una cita existente
export const updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        }

        // Construir consulta dinámica
        let query = 'UPDATE cita SET ';
        const params = [];
        for (const [key, value] of Object.entries(fields)) {
            query += `${key} = ?, `;
            params.push(value);
        }
        query = query.slice(0, -2); // Eliminar la última coma y espacio
        query += ' WHERE idcita = ?';
        params.push(id);

        const connection = await pool.getConnection();
        const result = await connection.query(query, params);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "La cita no existe" });
        }

        const citaActualizada = await connection.query('SELECT * FROM cita WHERE idcita = ?', [id]);
        connection.release();
        res.json(JSON.parse(JSON.stringify(citaActualizada[0], replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la cita');
    }
};

// Eliminar una cita
export const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const result = await connection.query('DELETE FROM cita WHERE idcita = ?', [id]);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "La cita no existe" });
        }

        connection.release();
        res.json({ message: 'Cita eliminada con éxito' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).send('No se puede eliminar la cita porque está referenciada en otros registros.');
        } else {
            res.status(500).send('Error al eliminar la cita');
        }
    }
};
