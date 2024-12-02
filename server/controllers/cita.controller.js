import { pool } from "../src/database.js";

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
            ORDER BY c.fecha DESC
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
            ORDER BY c.fecha DESC
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

export const getCitaPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const citaQuery = `
            SELECT 
                c.idcita, 
                c.fecha, 
                c.motivo, 
                c.consultorio, 
                m.nombre AS medico_nombre, 
                m.apellidoP AS medico_apellido
            FROM cita c
            INNER JOIN medico m ON c.idmedico = m.idmedico
            WHERE c.idcita = ?
        `;
        const citaRows = await connection.query(citaQuery, [id]);

        if (citaRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: "La cita no existe" });
        }

        const cita = citaRows[0];

        const diagnosticoQuery = `
            SELECT 
                d.iddiagnostico, 
                e.nombre AS nombre_enfermedad, 
                r.idreceta, 
                med.nombre AS nombre_medicamento,
                r.dosis
            FROM diagnostico d
            INNER JOIN enfermedad e ON d.idenfermedad = e.idenfermedad
            LEFT JOIN receta r ON d.iddiagnostico = r.iddiagnostico
            LEFT JOIN medicamento med ON r.idmedicamento = med.idmedicamento
            WHERE d.idcita = ?
        `;
        const diagnosticoRows = await connection.query(diagnosticoQuery, [id]);

        connection.release();

        const diagnosticos = {};
        diagnosticoRows.forEach(row => {
            if (!diagnosticos[row.nombre_enfermedad]) {
                diagnosticos[row.nombre_enfermedad] = [];
            }
            if (row.nombre_medicamento) {
                diagnosticos[row.nombre_enfermedad].push({
                    nombre_medicamento: row.nombre_medicamento,
                    dosis: row.dosis
                });
            }
        });

        const result = {
            idcita: cita.idcita,
            fecha: formatDate(cita.fecha),
            motivo: cita.motivo,
            consultorio: cita.consultorio,
            medico_nombre: cita.medico_nombre,
            medico_apellido: cita.medico_apellido,
            estado: cita.estado,
            diagnosticos: diagnosticos
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener la cita del paciente:", error);
        res.status(500).send("Error al obtener la cita del paciente");
    }
};

export const getCitaMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const citaQuery = `
            SELECT 
                c.idcita, 
                c.fecha, 
                c.motivo, 
                c.consultorio, 
                p.nombre AS paciente_nombre, 
                p.apellidoP AS paciente_apellido
            FROM cita c
            INNER JOIN paciente p ON c.idpaciente = p.idpaciente
            WHERE c.idcita = ?
        `;
        const citaRows = await connection.query(citaQuery, [id]);

        if (citaRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: "La cita no existe" });
        }

        const cita = citaRows[0];

        const diagnosticoQuery = `
            SELECT 
                d.iddiagnostico, 
                e.nombre AS nombre_enfermedad, 
                r.idreceta, 
                med.nombre AS nombre_medicamento,
                r.dosis
            FROM diagnostico d
            INNER JOIN enfermedad e ON d.idenfermedad = e.idenfermedad
            LEFT JOIN receta r ON d.iddiagnostico = r.iddiagnostico
            LEFT JOIN medicamento med ON r.idmedicamento = med.idmedicamento
            WHERE d.idcita = ?
        `;
        const diagnosticoRows = await connection.query(diagnosticoQuery, [id]);

        connection.release();

        const diagnosticos = {};
        diagnosticoRows.forEach(row => {
            if (!diagnosticos[row.nombre_enfermedad]) {
                diagnosticos[row.nombre_enfermedad] = [];
            }
            if (row.nombre_medicamento) {
                diagnosticos[row.nombre_enfermedad].push({
                    nombre_medicamento: row.nombre_medicamento,
                    dosis: row.dosis
                });
            }
        });

        const result = {
            idcita: cita.idcita,
            fecha: formatDate(cita.fecha),
            motivo: cita.motivo,
            consultorio: cita.consultorio,
            paciente_nombre: cita.paciente_nombre,
            paciente_apellido: cita.paciente_apellido,
            estado: cita.estado,
            diagnosticos: diagnosticos
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener la cita del paciente:", error);
        res.status(500).send("Error al obtener la cita del paciente");
    }
};

export const postCita = async (req, res) => {
    try {
      const { idmedico, idprogramacion_cita, motivo, fecha, consultorio } = req.body;
  
      if (!idmedico || !idprogramacion_cita || !motivo || !fecha || !consultorio) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
      }
  
      const idusuario = req.userId;
      const connection = await pool.getConnection();
  
      try {
        const pacienteRows = await connection.query(
          `SELECT idpaciente FROM paciente WHERE idusuario = ?`,
          [idusuario]
        );
  
        if (pacienteRows.length === 0) {
          return res.status(404).json({ error: "Paciente no encontrado" });
        }
  
        const { idpaciente } = pacienteRows[0];

        const existingCitaQuery = `
            SELECT COUNT(*) AS count
            FROM cita
            WHERE idpaciente = ? AND idprogramacion_cita = ? AND estado = 'En espera'
        `;

        const [existingCita] = await connection.query(existingCitaQuery, [idpaciente, idprogramacion_cita]);

        if (existingCita.count > 0) {
        return res.status(409).json({
            error: "El paciente ya tiene una cita en espera para esta programación.",
        });
        }
  
        await connection.beginTransaction();
  
        const cupoQuery = `
          SELECT cupos_disponibles
          FROM programacion_cita
          WHERE idprogramacion_cita = ? FOR UPDATE
        `;

        const [programacion] = await connection.query(cupoQuery, [idprogramacion_cita]);
  
        if (!programacion || programacion.cupos_disponibles <= 0) {
          return res.status(400).json({ error: "No hay cupos disponibles para esta programación de cita" });
        }
  
        const num_cupo = programacion.cupos_disponibles;
  
        const [day, month, year] = fecha.split("-");
        const formattedDate = `${year}-${month}-${day}`;

        const insertCitaQuery = `
          INSERT INTO cita (
            idpaciente, motivo, fecha, consultorio, num_cupo, triaje, idmedico, idprogramacion_cita
          )
          VALUES (?, ?, ?, ?, ?, '', ?, ?)
        `;
        const result = await connection.query(insertCitaQuery, [
          idpaciente,
          motivo,
          formattedDate,
          consultorio,
          num_cupo,
          idmedico,
          idprogramacion_cita,
        ]);
  
        await connection.commit();
  
        res.status(201).json({
          idcita: result.insertId.toString(),
          message: "Cita creada exitosamente",
        });
      } catch (error) {
        await connection.rollback();
  
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            error: "Ya existe una cita con los datos proporcionados",
          });
        }
  
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear la cita");
    }
  };
  

  export const updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        // Verificar que solo se actualicen los campos 'estado' o 'triaje'
        const allowedFields = ['estado', 'triaje'];
        const keys = Object.keys(fields);
        const invalidFields = keys.filter(key => !allowedFields.includes(key));

        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Los campos no permitidos para actualizar: ${invalidFields.join(', ')}` });
        }

        if (keys.length === 0) {
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
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.status(200).json({ message: "Cita actualizada exitosamente" });
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).send("Error al actualizar la cita");
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