import { pool } from "../src/database.js";
import { createAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../src/config.js";

export const login = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const connection = await pool.getConnection();
        const result = await connection.query(
            "SELECT * FROM usuario WHERE correo = ?",
            [correo]
        );

        console.log('Resultado de la consulta:', result);

        if (!result || result.length === 0) {
            connection.release();
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const userFound = result[0];

        if (contrasenia !== userFound.contrasenia) {
            connection.release();
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = await createAccesToken({ id: userFound.idusuario, rol: userFound.rol });

        res.cookie("token", token);
        res.json({
            id: userFound.idusuario,
            correo: userFound.correo,
            rol: userFound.rol
        });

        connection.release();
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout exitoso" });
}

export const verify = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const rows = await pool.query('SELECT idusuario, correo, rol FROM usuario WHERE idusuario = ?',
             [decoded.id]);
        const userFound = rows[0];

        if (!userFound) {
            return res.status(401).json({ message: "No autorizado" });
        }

        return res.json({
            id: userFound.idusuario,
            correo: userFound.correo,
            rol: userFound.rol
        });
    } catch (err) {
        return res.status(401).json({ message: "No autorizado" });
    }
};
