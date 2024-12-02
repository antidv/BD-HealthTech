import { pool } from "../src/database.js";

export const postAntecedentes = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();

        const paciente = await connection.query(
            "SELECT idpaciente FROM paciente WHERE idusuario = ?",
            [idusuario]
        );

        const idpaciente = paciente;
        const [existingAntecedentes] = await connection.query(
            "SELECT * FROM antecedentes WHERE idpaciente = ?",
            [idpaciente]
        );

        if (existingAntecedentes && existingAntecedentes.length > 0) {
            connection.release();
            return res.status(400).json({ error: "Antecedentes ya existentes" });
        }

        const result = await connection.query(
            "INSERT INTO antecedentes (idpaciente) VALUES (?)",
            [idpaciente[0].idpaciente]
        );

        const idantecedentes = result.insertId;

        const alergias = req.body.alergias || [];
        for (const idalergia of alergias) {
            await connection.query(
                "INSERT INTO alergia_historia (idantecedentes, idalergia) VALUES (?, ?)",
                [idantecedentes, idalergia]
            );
        }

        const enfermedades = req.body.enfermedades || [];
        for (const idenfermedad of enfermedades) {
            await connection.query(
                "INSERT INTO enfermedad_historia (idantecedentes, idenfermedad) VALUES (?, ?)",
                [idantecedentes, idenfermedad]
            );
        }

        connection.release();
        res.status(201).json({ message: "Antecedentes creados exitosamente" });
    } catch (error) {
        console.error('Error al crear antecedentes:', error);
        res.status(500).json({ error: "Error al crear antecedentes" });
    }
};

export const getAntecedentes = async (req, res) => {
    try {
        const idusuario = req.userId;
        const connection = await pool.getConnection();

        const paciente = await connection.query(
            "SELECT idpaciente FROM paciente WHERE idusuario = ?",
            [idusuario]
        );

        const idpaciente = paciente[0].idpaciente;

        const antecedentes = await connection.query(
            "SELECT * FROM antecedentes WHERE idpaciente = ?",
            [idpaciente]
        );

        if (!antecedentes || antecedentes.length === 0) {
            connection.release();
            return res.json([]);
        }

        for (const antecedente of antecedentes) {
            const alergiasResult = await connection.query(
                `SELECT a.nombre FROM alergia a
                 JOIN alergia_historia ah ON a.idalergia = ah.idalergia
                 WHERE ah.idantecedentes = ?`,
                [antecedente.idantecedentes]
            );

            antecedente.alergias = Array.isArray(alergiasResult) ? alergiasResult.map(alergia => alergia.nombre) : [];

            const enfermedadesResult = await connection.query(
                `SELECT e.nombre FROM enfermedad e
                 JOIN enfermedad_historia eh ON e.idenfermedad = eh.idenfermedad
                 WHERE eh.idantecedentes = ?`,
                [antecedente.idantecedentes]
            );

            antecedente.enfermedades = Array.isArray(enfermedadesResult) ? enfermedadesResult.map(enfermedad => enfermedad.nombre) : [];
        }

        connection.release();
        res.status(200).json({ antecedentes });
    } catch (error) {
        console.error('Error al obtener antecedentes:', error);
        res.status(500).json({ error: "Error al obtener antecedentes" });
    }
};

export const getAntecedenteAleEnf = async (req, res) => {
    try {
        const { idpaciente } = req.params;
        const connection = await pool.getConnection();

        const antecedentes = await connection.query(
            "SELECT idantecedentes FROM antecedentes WHERE idpaciente = ?",
            [idpaciente]
        );

        if (antecedentes.length === 0) {
            connection.release();
            return res.status(404).json({ error: "No se encontraron antecedentes para el paciente" });
        }

        const alergiasRelacionadas = await connection.query(
            `SELECT DISTINCT a.idalergia
             FROM alergia a
             JOIN alergia_historia ah ON a.idalergia = ah.idalergia
             WHERE ah.idantecedentes IN (?)`,
            [antecedentes.map((a) => a.idantecedentes)]
        );

        const alergiasRelacionadasIds = alergiasRelacionadas.map((ar) => ar.idalergia);

        const alergiasFaltantes = await connection.query(
            `SELECT * FROM alergia WHERE idalergia NOT IN (?)`,
            [alergiasRelacionadasIds.length > 0 ? alergiasRelacionadasIds : [0]]
        );

        const enfermedadesRelacionadas = await connection.query(
            `SELECT DISTINCT e.idenfermedad
             FROM enfermedad e
             JOIN enfermedad_historia eh ON e.idenfermedad = eh.idenfermedad
             WHERE eh.idantecedentes IN (?)`,
            [antecedentes.map((a) => a.idantecedentes)]
        );

        const enfermedadesRelacionadasIds = enfermedadesRelacionadas.map((er) => er.idenfermedad);

        const enfermedadesFaltantes = await connection.query(
            `SELECT * FROM enfermedad WHERE idenfermedad NOT IN (?)`,
            [enfermedadesRelacionadasIds.length > 0 ? enfermedadesRelacionadasIds : [0]]
        );

        connection.release();

        res.status(200).json({
            alergias_faltantes: alergiasFaltantes,
            enfermedades_faltantes: enfermedadesFaltantes,
        });
    } catch (error) {
        console.error("Error al obtener antecedentes:", error);
        res.status(500).json({ error: "Error al obtener antecedentes" });
    }
};

export const updateAntecedentes = async (req, res) => {
    try {
        const idusuario = req.userId;

        const connection = await pool.getConnection();

        const paciente = await connection.query(
            "SELECT idpaciente FROM paciente WHERE idusuario = ?",
            [idusuario]
        );

        const idpaciente = paciente[0].idpaciente;

        const antecedenteResult = await connection.query(
            "SELECT idantecedentes FROM antecedentes WHERE idpaciente = ?",
            [idpaciente]
        );

        if (!antecedenteResult || antecedenteResult.length === 0) {
            connection.release();
            return res.status(404).json({ error: "Antecedente no encontrado" });
        }

        const idantecedentes = antecedenteResult[0].idantecedentes;

        await connection.beginTransaction();

        const alergias = req.body.alergias || [];

        for (const idalergia of alergias) {
            const existingAlergia = await connection.query(
                "SELECT * FROM alergia_historia WHERE idantecedentes = ? AND idalergia = ?",
                [idantecedentes, idalergia]
            );

            if (!existingAlergia || existingAlergia.length === 0) {
                await connection.query(
                    "INSERT INTO alergia_historia (idantecedentes, idalergia) VALUES (?, ?)",
                    [idantecedentes, idalergia]
                );
            }
        }
    
        const enfermedades = req.body.enfermedades || [];

        for (const idenfermedad of enfermedades) {
            const existingEnfermedad = await connection.query(
                "SELECT * FROM enfermedad_historia WHERE idantecedentes = ? AND idenfermedad = ?",
                [idantecedentes, idenfermedad]
            );

            if (!existingEnfermedad || existingEnfermedad.length === 0) {
                await connection.query(
                    "INSERT INTO enfermedad_historia (idantecedentes, idenfermedad) VALUES (?, ?)",
                    [idantecedentes, idenfermedad]
                );
            }
        }
        
        await connection.commit();
        connection.release();
        res.status(200).json({ message: "Antecedentes actualizados exitosamente" });
    } catch (error) {
        console.error('Error al actualizar antecedentes:', error);
        res.status(500).json({ error: "Error al actualizar antecedentes" });
    }
}