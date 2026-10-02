import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } from '../server/src/config.js';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureDatabaseExists() {
  const targetDb = DB_NAME || 'posta';
  const adminClient = new Client({
    host: DB_HOST || 'localhost',
    user: DB_USER || 'postgres',
    password: DB_PASSWORD || '',
    port: Number(DB_PORT) || 5432,
    database: 'postgres'
  });

  try {
    await adminClient.connect();
    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb]
    );

    if (res.rowCount === 0) {
      console.log(`Creando base de datos "${targetDb}"...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Base de datos "${targetDb}" creada con éxito.`);
    } else {
      console.log(`Base de datos "${targetDb}" ya existe.`);
    }
  } catch (err) {
    console.warn(`Aviso al verificar/crear base de datos: ${err.message}`);
  } finally {
    try {
      await adminClient.end();
    } catch {}
  }
}

async function setupDatabase() {
  console.log('--- Iniciando configuración de la base de datos PostgreSQL ---');
  await ensureDatabaseExists();

  const targetDb = DB_NAME || 'posta';
  const client = new Client({
    host: DB_HOST || 'localhost',
    user: DB_USER || 'postgres',
    password: DB_PASSWORD || '',
    port: Number(DB_PORT) || 5432,
    database: targetDb
  });

  try {
    await client.connect();
    console.log(`Conectado a la base de datos "${targetDb}".`);

    const sqlFiles = [
      '01_schema.sql',
      '02_logic.sql',
      '03_data.sql'
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`✔ Ejecutado: ${file}`);
      } else {
        console.warn(`⚠ Advertencia: No se encontró el archivo ${file}`);
      }
    }

    console.log('--- Configuración completada con éxito en PostgreSQL ---');
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

setupDatabase();