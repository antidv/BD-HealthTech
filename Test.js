const { getConnection } = require('./server/src/database');

async function testConnection() {
    let connection;
    try {
        connection = await getConnection();
        if (connection) {
            console.log('Conexión exitosa');
            connection.end();
        } else {
            console.error('No se pudo obtener una conexión');
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

testConnection();