// controllers/receta.controller.js
import { pool } from "../src/database.js";

// Función para convertir BigInt a string en las respuestas JSON
const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

// Obtener todas las recetas
export const getRecetas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const recetas = await connection.query('SELECT * FROM receta');
        connection.release();
        res.status(200).json(JSON.parse(JSON.stringify(recetas, replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las recetas');
    }
};

// Obtener una receta por ID
export const getReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const recetas = await connection.query('SELECT * FROM receta WHERE idreceta = ?', [id]);
        connection.release();
        if (recetas.length === 0) {
            res.status(404).json({ error: "La receta no existe" });
        } else {
            res.status(200).json(JSON.parse(JSON.stringify(recetas[0], replacer)));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la receta');
    }
};

// Crear una nueva receta
export const postReceta = async (req, res) => {
    try {
        const { iddiagnostico, idmedicamento, dosis } = req.body;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar que el diagnóstico exista
            const diagnostico = await connection.query('SELECT 1 FROM diagnostico WHERE iddiagnostico = ?', [iddiagnostico]);
            if (diagnostico.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "El diagnóstico no existe" });
            }

            // Verificar que el medicamento exista
            const medicamento = await connection.query('SELECT 1 FROM medicamento WHERE idmedicamento = ?', [idmedicamento]);
            if (medicamento.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: "El medicamento no existe" });
            }

            // Insertar la receta
            const result = await connection.query(
                `INSERT INTO receta (iddiagnostico, idmedicamento, dosis)
                 VALUES (?, ?, ?)`,
                [iddiagnostico, idmedicamento, dosis]
            );

            await connection.commit();
            connection.release();
            res.status(201).json({ idreceta: result.insertId.toString() }); // Convertir BigInt a string
        } catch (error) {
            await connection.rollback();
            connection.release();
            console.error(error);
            res.status(500).send('Error al crear la receta');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la receta');
    }
};

// Actualizar una receta existente
export const updateReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        }

        // Construir consulta dinámica
        let query = 'UPDATE receta SET ';
        const params = [];
        for (const [key, value] of Object.entries(fields)) {
            query += `${key} = ?, `;
            params.push(value);
        }
        query = query.slice(0, -2); // Eliminar la última coma y espacio
        query += ' WHERE idreceta = ?';
        params.push(id);

        const connection = await pool.getConnection();
        const result = await connection.query(query, params);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "La receta no existe" });
        }

        const recetaActualizada = await connection.query('SELECT * FROM receta WHERE idreceta = ?', [id]);
        connection.release();
        res.json(JSON.parse(JSON.stringify(recetaActualizada[0], replacer)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la receta');
    }
};

// Eliminar una receta
export const deleteReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        const result = await connection.query('DELETE FROM receta WHERE idreceta = ?', [id]);

        if (result.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: "La receta no existe" });
        }

        connection.release();
        res.json({ message: 'Receta eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la receta');
    }
};
