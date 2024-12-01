import { pool } from "../src/database.js";

export const postConsultorioPosta = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { consultorios = [], nombre, ciudad, direccion, telefono } = req.body;

        await connection.beginTransaction();
        const postaResult = await connection.query(
            `INSERT INTO posta (nombre, ciudad, direccion, telefono) VALUES (?, ?, ?, ?)`,
            [nombre, ciudad, direccion, telefono]
        );
        const idposta = postaResult.insertId;

        if (consultorios.length > 0) {
            for (const idconsultorio of consultorios) {
                await connection.query(
                    `INSERT INTO consultorio_posta (idconsultorio, idposta) VALUES (?, ?)`,
                    [idconsultorio, idposta]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            idposta: idposta.toString(),
            nombre,
            ciudad,
            direccion,
            telefono,
            consultorios
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error al crear la relación Consultorio-Posta:", error);
        res.status(500).send("Error al crear la relación Consultorio-Posta");
    } finally {
        connection.release();
    }
};

export const getConsultorios = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT idconsultorio, nombre FROM consultorio`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener los consultorios:", error);
        res.status(500).send("Error al obtener los consultorios");
    }
}

export const getConsultoriosFaltantes = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { idposta } = req.params;

        const query = `
            SELECT c.idconsultorio, c.nombre
            FROM consultorio c
            WHERE c.idconsultorio NOT IN (
                SELECT cp.idconsultorio
                FROM consultorio_posta cp
                WHERE cp.idposta = ?
            )
        `;
        
        const rows = await connection.query(query, [idposta]);

        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener los consultorios faltantes:", error);
        res.status(500).send("Error al obtener los consultorios faltantes");
    }
};

export const getConsultorioPostas = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(`SELECT * FROM consultorio_posta`);
        res.status(200).json(rows);
        connection.end();
    } catch (error) {
        console.error("Error al obtener las relaciones Consultorio-Posta:", error);
        res.status(500).send("Error al obtener las relaciones Consultorio-Posta");
    }
};

export const getConsultorioPosta = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { page = 1, limit = 10 } = req.query;
        const { id } = req.params;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        if (!id) {
            return res.status(400).json({ error: "Se requiere el id de la posta" });
        }

        const query = `
            SELECT 
                c.idconsultorio, 
                c.nombre AS consultorio_nombre, 
                c.foto AS consultorio_foto,
                cp.disponible
            FROM consultorio_posta cp
            INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
            WHERE cp.idposta = ?
            LIMIT ? OFFSET ?;
        `;

        const params = [id, limitNumber, offset];
        const rows = await connection.query(query, params);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM consultorio_posta cp
            WHERE cp.idposta = ?;
        `;

        const [{ total }] = await connection.query(countQuery, [id]);
        const totalNumber = Number(total);
        const totalPages = Math.ceil(totalNumber / limitNumber);

        res.status(200).json({
            data: rows,
            total: totalNumber,
            page: pageNumber,
            limit: limitNumber,
            totalPages: totalPages
        });

        connection.release();
    } catch (error) {
        console.error("Error al obtener los consultorios por posta:", error);
        res.status(500).send("Error al obtener los consultorios por posta");
    }
};

export const updateConsultorioPosta = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE consultorio_posta SET disponible = ? WHERE idconsultorio_posta = ?`,
            [disponible, id]
        );

        const updatedRelation = await connection.query(
            `SELECT * FROM consultorio_posta WHERE idconsultorio_posta = ?`,
            [id]
        );
        res.json(updatedRelation[0]);
        connection.end();
    } catch (error) {
        console.error("Error al actualizar la relación Consultorio-Posta:", error);
        res.status(500).send("Error al actualizar la relación Consultorio-Posta");
    }
};
