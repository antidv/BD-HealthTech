const mariadb = require('mariadb');
const { DB_HOST, DB_PASSWORD, DB_NAME, DB_USER, DB_PORT } = require('./config');

const pool = mariadb.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    ssl: { rejectUnauthorized: false },
});

async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getConnection };