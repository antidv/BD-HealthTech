import mariadb from 'mariadb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } from '../server/src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  const connection = await mariadb.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    multipleStatements: true
  });

  try {
    console.log('--- Iniciando configuración de la base de datos ---');

    const sqlFiles = [
      '01_schema.sql',
      '02_logic.sql',
      '03_data.sql'
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        await connection.query(sql);
        console.log(`✔ Ejecutado: ${file}`);
      } else {
        console.warn(`⚠ Advertencia: No se encontró el archivo ${file}`);
      }
    }

    console.log('--- Configuración completada con éxito ---');
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();