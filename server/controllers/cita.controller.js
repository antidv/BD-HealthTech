import { pool } from "../src/database.js";

const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

export const getCitasPaciente = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();
        const pacienteRows = await connection.query('SELECT idpaciente FROM paciente WHERE idusuario = ?', [idusuario]);

        const idpaciente = pacienteRows[0].idpaciente;
        const citas = await connection.query('SELECT * FROM cita WHERE idpaciente = ?', [idpaciente]);
        connection.release();

        if (citas.length === 0) {
            return res.status(404).json({ error: "El paciente no cuenta con citas." });
        }

        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener las citas del paciente:", error);
        res.status(500).send("Error al obtener las citas del paciente");
    }
};

export const getCitasMedico = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();

        const medicoRows = await connection.query('SELECT idmedico FROM medico WHERE idusuario = ?', [idusuario]);

        const idmedico = medicoRows[0].idmedico;
        const citas = await connection.query('SELECT * FROM cita WHERE idmedico = ?', [idmedico]);
        connection.release();

        if (citas.length === 0) {
            return res.status(404).json({ error: "El médico no cuenta con citas." });
        }

        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener las citas del médico:", error);
        res.status(500).send("Error al obtener las citas del médico");
    }
};

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
            res.status(201).json({ idcita: result.insertId.toString() });
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
