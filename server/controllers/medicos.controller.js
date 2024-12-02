import { pool } from "../src/database.js";

export const postMedico = async (req, res, next) => {
  try {
    const {
      correo,
      contrasenia,
      nombre,
      apellidoP,
      apellidoM,
      dni,
      especialidad,
    } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `CALL sp_insertar_medico(?, ?, ?, ?, ?, ?, ?)`,
        [correo, contrasenia, nombre, apellidoP, apellidoM, dni, especialidad]
      );

      if (result[0] && result[0].mensaje === 'Médico registrado con éxito') {
        await connection.commit();
        res.status(201).json({
          message: result[0].mensaje,
          data: {
            idusuario: result[0].usuario_id,
            correo: result[0].correo,
            nombre: result[0].nombre,
            apellidoP: result[0].apellidoP,
            apellidoM: result[0].apellidoM,
            dni: result[0].dni,
            especialidad: result[0].especialidad
          }
        });
      } else {
        await connection.rollback();
        res.status(400).json({ error: result[0].mensaje });
      }
    } catch (error) {
      await connection.rollback();
      res.status(500).send("Error al registrar el médico");
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).send("Error en la conexión a la base de datos");
  }
};

export const perfilMedico = async (req, res) => {
  try {
    const idusuario = req.userId;
    const connection = await pool.getConnection();

    const medicoRows = await connection.query(
      "SELECT idmedico FROM medico WHERE idusuario = ?",
      [idusuario]
    );

    if (medicoRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El médico no existe" });
    }

    const idmedico = medicoRows[0].idmedico;

    const query = `
      SELECT  
        m.nombre, 
        m.apellidoP, 
        m.apellidoM, 
        m.dni, 
        m.foto, 
        m.disponible, 
        e.nombre AS especialidad
      FROM medico m
      JOIN especialidad e ON m.idespecialidad = e.idespecialidad
      WHERE m.idmedico = ?
    `;
    const rows = await connection.query(query, [idmedico]);

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El médico no existe" });
    }

    const medico = rows[0];

    connection.release();
    res.status(200).json(medico);
  } catch (error) {
    console.error("Error al obtener el médico:", error);
    res.status(500).send("Error al obtener el médico");
  }
}

export const getMedicos = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const query = `
          SELECT 
            m.idmedico, 
            m.nombre, 
            m.apellidoP, 
            m.dni, 
            e.nombre AS especialidad, 
            m.foto, 
            m.disponible
          FROM medico m
          JOIN especialidad e ON m.idespecialidad = e.idespecialidad
          WHERE m.nombre LIKE ?
          LIMIT ? OFFSET ?
        `;
    const rows = await connection.query(query, [
      `%${search}%`,
      limitNumber,
      offset,
    ]);

    const countQuery = `
            SELECT COUNT(*) AS total
            FROM medico m
            JOIN especialidad e ON m.idespecialidad = e.idespecialidad
            WHERE m.nombre LIKE ?
        `;
    const [{ total }] = await connection.query(countQuery, [`%${search}%`]);
    const totalNumber = Number(total);
    const totalPages = Math.ceil(totalNumber / limitNumber);

    res.status(200).json({
      data: rows,
      total: totalNumber,
      page: pageNumber,
      limit: limitNumber,
      totalPages: totalPages,
    });

    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los médicos");
  }
};

export const getMedico = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;

    const medicoQuery = `
      SELECT 
        m.idmedico, 
        m.nombre, 
        m.apellidoP, 
        m.dni, 
        e.nombre AS especialidad, 
        m.foto, 
        m.disponible
      FROM medico m
      JOIN especialidad e ON m.idespecialidad = e.idespecialidad
      WHERE m.idmedico = ?
    `;
    const medicoRows = await connection.query(medicoQuery, [id]);

    if (medicoRows.length <= 0) {
      connection.release();
      return res.status(404).json({ error: "El médico no existe" });
    }

    const medico = medicoRows[0];

    const consultorioPostaQuery = `
      SELECT 
        p.nombre AS nombre_posta, 
        c.nombre AS nombre_consultorio, 
        mcp.disponible AS estado_consultorio,
        mcp.idmedconposta as id_mcp
      FROM medico_consultorio_posta mcp
      JOIN consultorio_posta cp ON mcp.idconsultorio_posta = cp.idconsultorio_posta
      JOIN posta p ON cp.idposta = p.idposta
      JOIN consultorio c ON cp.idconsultorio = c.idconsultorio
      WHERE mcp.idmedico = ?
    `;
    const consultorioPostaRows = await connection.query(consultorioPostaQuery, [id]);

    connection.release();

    if (!Array.isArray(consultorioPostaRows)) {
      return res.status(500).json({ error: "Error al obtener los consultorios y postas asociados" });
    }

    const postas = consultorioPostaRows.reduce((result, row) => {
      const posta = result.find(p => p.nombre_posta === row.nombre_posta);
      if (!posta) {
        result.push({
          nombre_posta: row.nombre_posta,
          consultorios: [
            {
              nombre_consultorio: row.nombre_consultorio,
              idmedconposta: row.id_mcp,
              estado: row.estado_consultorio,
            },
          ],
        });
      } else {
        posta.consultorios.push({
          nombre_consultorio: row.nombre_consultorio,
          estado: row.estado_consultorio,
        });
      }
      return result;
    }, []);

    const result = {
      idmedico: medico.idmedico,
      nombre: medico.nombre,
      apellidoP: medico.apellidoP,
      dni: medico.dni,
      especialidad: medico.especialidad,
      foto: medico.foto,
      disponible: medico.disponible,
      postas: postas
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener el médico:", error);
    res.status(500).send("Error al obtener el médico");
  }
};

export const updateMedicos = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id } = req.params;
    const {
      nombre,
      apellidoP,
      apellidoM,
      dni,
      especialidad,
      idconsultorio_posta,
      correo,
      disponible,
      contrasenia,
    } = req.body;

    await connection.beginTransaction();

    const updateMedicoQuery = `
      UPDATE medico
      SET nombre = COALESCE(?, nombre),
          apellidoP = COALESCE(?, apellidoP),
          apellidoM = COALESCE(?, apellidoM),
          dni = COALESCE(?, dni),
          idespecialidad = COALESCE(?, idespecialidad),
          disponible = COALESCE(?, disponible)
      WHERE idmedico = ?
    `;
    const updateMedicoParams = [
      nombre,
      apellidoP,
      apellidoM,
      dni,
      especialidad,
      disponible,
      id,
    ];
    await connection.query(updateMedicoQuery, updateMedicoParams);

    const updateUserQuery = `
      UPDATE usuario
      SET correo = COALESCE(?, correo),
          contrasenia = COALESCE(?, contrasenia)
      WHERE idusuario = (SELECT idusuario FROM medico WHERE idmedico = ?)
    `;
    const updateUserParams = [correo, contrasenia, id];
    await connection.query(updateUserQuery, updateUserParams);

    if (idconsultorio_posta && idconsultorio_posta.length > 0) {
      for (const idconsultorioPosta of idconsultorio_posta) {
        await connection.query(
          `INSERT INTO medico_consultorio_posta (idmedico, idconsultorio_posta)
           VALUES (?, ?)`,
          [id, idconsultorioPosta]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.status(200).json({ message: "Médico actualizado exitosamente" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Error al actualizar el médico:", error);
    res.status(500).send("Error al actualizar el médico");
  }
};

export const updateMedicoDisponible = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { id } = req.params;

    const [currentRow] = await connection.query(
      "SELECT disponible FROM medico WHERE idmedico = ?",
      [id]
    );

    if (!currentRow) {
      connection.release();
      return res.status(404).json({ error: "El médico no existe" });
    }

    const newDisponible = currentRow.disponible === 1 ? 0 : 1;

    const result = await connection.query(
      "UPDATE medico SET disponible = ? WHERE idmedico = ?",
      [newDisponible, id]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(500).json({ error: "No se pudo actualizar el registro del médico" });
    }

    const [updatedRow] = await connection.query(
      "SELECT * FROM medico WHERE idmedico = ?",
      [id]
    );

    res.json(updatedRow);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el registro del médico");
  }
};
