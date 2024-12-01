import { pool } from "../src/database.js";

export const getEspecialidades = async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.query(`SELECT idespecialidad, nombre FROM especialidad`);
      res.status(200).json(rows);
      connection.release();
    } catch (error) {
      console.error("Error al obtener las especialidades:", error);
      res.status(500).send("Error al obtener las especialidades");
    }
  }

export const getConsultoriosFaltantes = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { idmedico } = req.params;

        const query = `
            SELECT 
                m.nombre AS medico_nombre,
                m.foto AS medico_foto,
                m.apellidoP AS medico_apellidoP,
                m.apellidoM AS medico_apellidoM,
                m.dni AS medico_dni,
                e.idespecialidad as medico_idespecialidad,
                e.nombre AS medico_especialidad,
                u.correo AS medico_correo,
                m.disponible AS medico_disponible,

                cp.idconsultorio_posta AS idconsultorio_posta,
                p.nombre AS nombre_posta,
                c.nombre AS nombre_consultorio
            FROM medico m
            INNER JOIN especialidad e ON m.idespecialidad = e.idespecialidad
            INNER JOIN usuario u ON m.idusuario = u.idusuario
            INNER JOIN consultorio c ON e.idconsultorio = c.idconsultorio
            INNER JOIN consultorio_posta cp ON cp.idconsultorio = c.idconsultorio
            INNER JOIN posta p ON cp.idposta = p.idposta
            LEFT JOIN medico_consultorio_posta mcp 
                ON cp.idconsultorio_posta = mcp.idconsultorio_posta 
                AND mcp.idmedico = m.idmedico
            WHERE 
                m.idmedico = ?
                AND cp.disponible = 1
                AND mcp.idmedconposta IS NULL
            ORDER BY p.nombre, c.nombre;
        `;

        const rows = await connection.query(query, [idmedico]);

        connection.release();

        const medicoData = {
            nombre: rows[0]?.medico_nombre || null,
            foto: rows[0]?.medico_foto || null,
            apellidoP: rows[0]?.medico_apellidoP || null,
            apellidoM: rows[0]?.medico_apellidoM || null,
            dni: rows[0]?.medico_dni || null,
            idespecialidad: rows[0]?.medico_idespecialidad || null,
            especialidad: rows[0]?.medico_especialidad || null,
            correo: rows[0]?.medico_correo || null,
            disponible: rows[0]?.medico_disponible === 1,
        };

        const consultoriosFaltantes = rows.map(row => ({
            idconsultorio_posta: row.idconsultorio_posta,
            nombre_posta: row.nombre_posta,
            nombre_consultorio: row.nombre_consultorio,
        }));

        res.status(200).json({ medico: medicoData, consultoriosFaltantes });
    } catch (error) {
        console.error("Error al obtener los consultorios faltantes:", error);
        res.status(500).send("Error al obtener los consultorios faltantes");
    }
};
