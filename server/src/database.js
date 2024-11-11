import mariadb from 'mariadb';
import { DB_HOST, DB_PASSWORD, DB_NAME, DB_USER, DB_PORT } from './config.js';

export const pool = mariadb.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    ssl: { rejectUnauthorized: false },
});

export async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.log(error);
    }
}

(async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Conexión exitosa a la base de datos");
        connection.release();
    } catch (error) {
        console.error("Errorcín", error);
    }
})();