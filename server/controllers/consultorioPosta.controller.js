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

export const getConsultorioPostaDetails = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { idconsultorio_posta } = req.params;

        const query = `
            SELECT 
                p.idposta AS posta_idposta,
                p.nombre AS posta_nombre,
                c.idconsultorio AS consultorio_idconsultorio,
                c.nombre AS consultorio_nombre,
                mcp.idmedconposta AS medico_consultorio_posta_id,
                m.idmedico AS medico_id,
                CONCAT(m.nombre, ' ', m.apellidoP, ' ', m.apellidoM) AS medico_nombre
            FROM consultorio_posta cp
            INNER JOIN posta p ON cp.idposta = p.idposta
            INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
            LEFT JOIN medico_consultorio_posta mcp ON mcp.idconsultorio_posta = cp.idconsultorio_posta AND mcp.disponible = 1
            LEFT JOIN medico m ON mcp.idmedico = m.idmedico
            WHERE cp.idconsultorio_posta = ?;
        `;

        const rows = await connection.query(query, [idconsultorio_posta]);

        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron resultados para el idconsultorio_posta proporcionado" });
        }

        const posta = {
            idposta: rows[0].posta_idposta,
            nombre: rows[0].posta_nombre,
        };

        const consultorio = {
            idconsultorio: rows[0].consultorio_idconsultorio,
            nombre: rows[0].consultorio_nombre,
        };

        const doctores = rows
            .filter(row => row.medico_consultorio_posta_id)
            .map(row => ({
                idconsultorio_medico_posta: row.medico_consultorio_posta_id,
                iddoctor: row.medico_id,
                nombre: row.medico_nombre,
            }));

        res.status(200).json({ posta, consultorio, doctores });
    } catch (error) {
        console.error("Error al obtener los detalles de Consultorio-Posta:", error);
        res.status(500).send("Error al obtener los detalles de Consultorio-Posta");
    }
};


export const getConsultorioPosta = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { page , limit } = req.query;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Se requiere el id de la posta" });
        }

        let query = `
            SELECT 
                c.idconsultorio,
                cp.idconsultorio_posta, 
                c.nombre AS consultorio_nombre, 
                c.foto AS consultorio_foto,
                cp.disponible
            FROM consultorio_posta cp
            INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
            WHERE cp.idposta = ?
        `;
        const params = [id];

        if (page && limit) {
            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const offset = (pageNumber - 1) * limitNumber;

            query += ` LIMIT ? OFFSET ?`;
            params.push(limitNumber, offset);
        }

        const rows = await connection.query(query, params);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM consultorio_posta cp
            WHERE cp.idposta = ?;
        `;

        const [{ total }] = await connection.query(countQuery, [id]);

        if (rows.length === 0) {
            return res.json([]);
        }

        const totalNumber = Number(total);
        const totalPages = limit === "all" ? 1 : Math.ceil(totalNumber / Number(limit));

        res.status(200).json({
            data: rows,
            total: totalNumber,
            page: page ? Number(page) : null,
            limit: limit ? Number(limit) : null,
            totalPages: totalPages
        });

        connection.release();
    } catch (error) {
        console.error("Error al obtener los consultorios por posta:", error);
        res.status(500).send("Error al obtener los consultorios por posta");
    }
};

export const updateConsultorioPosta = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const {
            nombre,
            ciudad,
            direccion,
            telefono,
            estado,
            consultorios,
            nuevos_consultorios,
        } = req.body;

        const consultoriosJSON = JSON.stringify(consultorios || []);
        const nuevosConsultoriosJSON = JSON.stringify(nuevos_consultorios || []);

        await connection.query('CALL actualizarPostaYConsultorios(?, ?, ?, ?, ?, ?, ?, ?)', [
            id,
            nombre,
            ciudad,
            direccion,
            telefono,
            estado,
            consultoriosJSON,
            nuevosConsultoriosJSON,
        ]);

        const [updatedPosta] = await connection.query('SELECT * FROM posta WHERE idposta = ?', [id]);

        const updatedConsultorios = await connection.query(
            `SELECT cp.idconsultorio_posta, cp.idposta, cp.idconsultorio, cp.disponible, c.nombre AS consultorio_nombre
             FROM consultorio_posta cp
             INNER JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
             WHERE cp.idposta = ?`,
            [id]
        );

        connection.release();

        res.status(200).json({
            posta: updatedPosta,
            consultorios: updatedConsultorios,
        });
    } catch (error) {
        console.error('Error al actualizar los datos de la posta y sus consultorios:', error);
        res.status(500).send('Error al actualizar los datos de la posta y sus consultorios');
    } finally {
        connection.release();
    }
};
