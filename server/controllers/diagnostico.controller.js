// controllers/diagnostico.controller.js
import { pool } from "../src/database.js";

// Función para convertir BigInt a string en las respuestas JSON
const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

// Obtener todos los diagnósticos
export const getDiagnosticos = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const diagnosticos = await connection.query('SELECT * FROM diagnostico');
        connection.release();
        res.status(200).json(JSON.parse(JSON.stringify(diagnosticos, replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los diagnósticos');
    }
};

// Obtener un diagnóstico por ID
export const getDiagnostico = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const diagnosticos = await connection.query('SELECT * FROM diagnostico WHERE iddiagnostico = ?', [id]);
        connection.release();
        if (diagnosticos.length === 0) {
            res.status(404).json({ error: "El diagnóstico no existe" });
        } else {
            res.status(200).json(JSON.parse(JSON.stringify(diagnosticos[0], replacer)));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el diagnóstico');
    }
};

// Crear un nuevo diagnóstico
export const postDiagnostico = async (req, res) => {
    try {
        const { idcita, idenfermedad, observacion } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar que la cita exista
            const cita = await connection.query('SELECT 1 FROM cita WHERE idcita = ?', [idcita]);
            if (cita.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "La cita no existe" });
            }

            // Verificar que la enfermedad exista
            const enfermedad = await connection.query('SELECT 1 FROM enfermedad WHERE idenfermedad = ?', [idenfermedad]);
            if (enfermedad.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "La enfermedad no existe" });
            }

            // Insertar el diagnóstico
            const result = await connection.query(
                `INSERT INTO diagnostico (idcita, idenfermedad, observacion)
                 VALUES (?, ?, ?)`,
                [idcita, idenfermedad, observacion]
            );

            await connection.commit();
            connection.release();
            res.status(201).json({ iddiagnostico: result.insertId.toString() }); // Convertir BigInt a string
        } catch (error) {
            await connection.rollback();
            connection.release();
            console.error(error);
            res.status(500).send('Error al crear el diagnóstico');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el diagnóstico');
    }
};

// Actualizar un diagnóstico existente
export const updateDiagnostico = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        }

        // Construir consulta dinámica
        let query = 'UPDATE diagnostico SET ';
        const params = [];
        for (const [key, value] of Object.entries(fields)) {
            query += `${key} = ?, `;
            params.push(value);
        }
        query = query.slice(0, -2); // Eliminar la última coma y espacio
        query += ' WHERE iddiagnostico = ?';
        params.push(id);

        const connection = await pool.getConnection();
        const result = await connection.query(query, params);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "El diagnóstico no existe" });
        }

        const diagnosticoActualizado = await connection.query('SELECT * FROM diagnostico WHERE iddiagnostico = ?', [id]);
        connection.release();
        res.json(JSON.parse(JSON.stringify(diagnosticoActualizado[0], replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el diagnóstico');
    }
};

// Eliminar un diagnóstico
export const deleteDiagnostico = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const result = await connection.query('DELETE FROM diagnostico WHERE iddiagnostico = ?', [id]);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "El diagnóstico no existe" });
        }

        connection.release();
        res.json({ message: 'Diagnóstico eliminado con éxito' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).send('No se puede eliminar el diagnóstico porque está referenciado en otros registros.');
        } else {
            res.status(500).send('Error al eliminar el diagnóstico');
        }
    }
};
