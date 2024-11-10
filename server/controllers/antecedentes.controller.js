import { pool } from "../src/database.js";

export const postAntecedentes = async (req, res) => {
    try {
        const idpaciente = req.userId;
        const { alergias, enfermedades } = req.body;
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const [resultAntecedentes] = await connection.query(
            "INSERT INTO antecedentes (idpaciente) VALUES (?)",
            [idpaciente]
        );
        const idantecedentes = resultAntecedentes.insertId;

        for (const idalergia of alergias) {
            await connection.query(
                "INSERT INTO alergia_historia (idantecedentes, idalergia) VALUES (?, ?)",
                [idantecedentes, idalergia]
            );
        }

        for (const idenfermedad of enfermedades) {
            await connection.query(
                "INSERT INTO enfermedad_historia (idantecedentes, idenfermedad) VALUES (?, ?)",
                [idantecedentes, idenfermedad]
            );
        }

        await connection.commit();
        connection.release();
        res.status(201).json({ message: "Antecedentes creados exitosamente", idantecedentes });
    } catch (error) {
        res.status(500).json({ error: "Error al crear antecedentes" });
    }
}
export const getAntecedentes = async (req, res) => {
    try {
        const idpaciente = req.userId;
        const connection = await pool.getConnection();

        const [antecedentes] = await connection.query(
            "SELECT * FROM antecedentes WHERE idpaciente = ?",
            [idpaciente]
        );

        if (!antecedentes || antecedentes.length === 0) {
            connection.release();
            return res.status(404).json({ error: "No se encontraron antecedentes" });
        }

        const antecedentesArray = Array.isArray(antecedentes) ? antecedentes : [antecedentes];

        for (const antecedente of antecedentesArray) {
            const [alergiasResult] = await connection.query(
                `SELECT a.nombre FROM alergia a
                 JOIN alergia_historia ah ON a.idalergia = ah.idalergia
                 WHERE ah.idantecedentes = ?`,
                [antecedente.idantecedentes]
            );

            const alergias = Array.isArray(alergiasResult) ? alergiasResult : [alergiasResult];

            const [enfermedadesResult] = await connection.query(
                `SELECT e.nombre FROM enfermedad e
                 JOIN enfermedad_historia eh ON e.idenfermedad = eh.idenfermedad
                 WHERE eh.idantecedentes = ?`,
                [antecedente.idantecedentes]
            );

            const enfermedades = Array.isArray(enfermedadesResult) ? enfermedadesResult : [enfermedadesResult];

            antecedente.alergias = alergias.map(alergia => alergia.nombre);
            antecedente.enfermedades = enfermedades.map(enfermedad => enfermedad.nombre);
        }

        connection.release();
        res.status(200).json({ antecedentes: antecedentesArray });
    } catch (error) {
        console.error('Error al obtener antecedentes:', error);
        res.status(500).json({ error: "Error al obtener antecedentes" });
    }
};
export const updateAntecedentes = async (req, res) => {}
export const deleteAntecedentes = async (req, res) => {}