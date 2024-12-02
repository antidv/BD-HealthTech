import { pool } from "../src/database.js";

const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

export const getCitasPaciente = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();
        const pacienteRows = await connection.query('SELECT idpaciente FROM paciente WHERE idusuario = ?', [idusuario]);

        const idpaciente = pacienteRows[0].idpaciente;

        const { page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        const query = `
            SELECT c.idcita, c.fecha, c.hora_aprox, c.num_cupo, c.motivo, c.consultorio, 
            m.nombre AS medico_nombre, m.apellidoP AS medico_apellido, c.estado
            FROM cita c
            INNER JOIN medico m ON c.idmedico = m.idmedico
            WHERE idpaciente = ?
            LIMIT ? OFFSET ?
        `;
        const citas = await connection.query(query, [idpaciente, limitNumber, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM cita
            WHERE idpaciente = ?
        `;
        const [{ total }] = await connection.query(countQuery, [idpaciente]);
        const totalNumber = Number(total);
        const totalPages = Math.ceil(totalNumber / limitNumber);

        connection.release();
        const formattedCitas = citas.map(cita => ({
            ...cita,
            fecha: formatDate(cita.fecha),
            hora_aprox: formatTime(cita.hora_aprox)
        }));

        res.status(200).json({
            data: formattedCitas,
            total: totalNumber,
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages
        });
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

        const { page = 1, limit = 10 } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        const query = `
            SELECT c.idcita, c.fecha, c.hora_aprox, c.num_cupo, c.motivo, c.consultorio, 
            p.nombre AS paciente_nombre, p.apellidoP AS paciente_apellido, c.estado
            FROM cita c
            INNER JOIN paciente p ON c.idpaciente = p.idpaciente
            WHERE idmedico = ?
            LIMIT ? OFFSET ?
        `;

        const citas = await connection.query(query, [idmedico, limitNumber, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM cita
            WHERE idmedico = ?
        `;
        const [{ total }] = await connection.query(countQuery, [idmedico]);
        const totalNumber = Number(total);
        const totalPages = Math.ceil(totalNumber / limitNumber);

        connection.release();
        const formattedCitas = citas.map(cita => ({
            ...cita,
            fecha: formatDate(cita.fecha),
            hora_aprox: formatTime(cita.hora_aprox)
        }));

        res.status(200).json({
            data: formattedCitas,
            total: totalNumber,
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages
        });
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

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
};