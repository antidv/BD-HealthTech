import { pool } from "../src/database.js";

export const getHorarios = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT idhorario, hora_inicio, hora_fin FROM horario');
        connection.release();

        const formattedRows = rows.map(row => ({
            idhorario: row.idhorario,
            hora: `${formatTime(row.hora_inicio)} - ${formatTime(row.hora_fin)}`
        }));

        res.status(200).json(formattedRows);
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        res.status(500).send("Error al obtener los horarios");
    }
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
};

export const getHorario = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM horario WHERE idhorario = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({ error: "El horario no existe" });
        }
        res.status(200).json(rows[0]);
        connection.end();
    } catch (error) {
        console.error("Error al obtener el horario:", error);
        res.status(500).send("Error al obtener el horario");
    }
};
