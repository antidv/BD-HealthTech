import pg from 'pg';
import { DB_HOST, DB_PASSWORD, DB_NAME, DB_USER, DB_PORT } from './config.js';

const { Pool } = pg;

// Mapeo y normalización para que las propiedades en camelCase (apellidoP, apellidoM, etc.)
// estén presentes como propiedades directas del objeto al serializarse a JSON (res.json)
function normalizeRow(row) {
    if (!row || typeof row !== 'object') return row;
    const mapped = { ...row };

    if ('apellidop' in mapped) mapped.apellidoP = mapped.apellidop;
    if ('apellidom' in mapped) mapped.apellidoM = mapped.apellidom;
    if ('medico_apellidop' in mapped) mapped.medico_apellidoP = mapped.medico_apellidop;
    if ('medico_apellidom' in mapped) mapped.medico_apellidoM = mapped.medico_apellidom;
    if ('medico_idespecialidad' in mapped) mapped.medico_idespecialidad = mapped.medico_idespecialidad;
    if ('paciente_apellidop' in mapped) mapped.paciente_apellidoP = mapped.paciente_apellidop;
    if ('paciente_apellidom' in mapped) mapped.paciente_apellidoM = mapped.paciente_apellidom;

    return wrapRow(mapped);
}

// Helper para acceder a propiedades de filas sin importar mayúsculas/minúsculas
function wrapRow(row) {
    if (!row || typeof row !== 'object') return row;
    return new Proxy(row, {
        get(target, prop, receiver) {
            if (typeof prop === 'string') {
                if (prop in target) return target[prop];
                const lowerProp = prop.toLowerCase();
                for (const key of Object.keys(target)) {
                    if (key.toLowerCase() === lowerProp) {
                        return target[key];
                    }
                }
            }
            return Reflect.get(target, prop, receiver);
        },
        has(target, prop) {
            if (typeof prop === 'string') {
                if (prop in target) return true;
                const lowerProp = prop.toLowerCase();
                for (const key of Object.keys(target)) {
                    if (key.toLowerCase() === lowerProp) return true;
                }
            }
            return Reflect.has(target, prop);
        }
    });
}

function processQuery(sql, params = []) {
    let pgSql = sql.trim();
    let pgParams = [];
    let paramIndex = 1;

    // Convertir llamadas especiales de MySQL
    if (/^CALL\s+sp_insertar_medico/i.test(pgSql)) {
        pgSql = pgSql.replace(/^CALL\s+/i, 'SELECT * FROM ');
    }

    // Convertir placeholders ? a $1, $2... manejando arrays para cláusulas IN (?)
    let transformedSql = '';
    let currentParamPos = 0;

    for (let i = 0; i < pgSql.length; i++) {
        if (pgSql[i] === '?') {
            const val = params[currentParamPos++];
            if (Array.isArray(val)) {
                if (val.length === 0) {
                    transformedSql += 'NULL';
                } else {
                    const placeholders = val.map(() => {
                        pgParams.push(val.shift ? undefined : undefined); // placeholder
                    });
                    const expanded = val.map(item => {
                        pgParams.push(item);
                        return `$${paramIndex++}`;
                    }).join(', ');
                    transformedSql += expanded;
                }
            } else {
                pgParams.push(val);
                transformedSql += `$${paramIndex++}`;
            }
        } else {
            transformedSql += pgSql[i];
        }
    }

    // Para INSERTs sin RETURNING, agregar RETURNING * para obtener el ID generado
    const isInsert = /^\s*INSERT\s+INTO\s+/i.test(transformedSql);
    const hasReturning = /\bRETURNING\b/i.test(transformedSql);
    if (isInsert && !hasReturning) {
        transformedSql += ' RETURNING *';
    }

    return { sql: transformedSql, params: pgParams };
}

function formatResult(res, isSpInsertarMedico = false) {
    const rows = (res.rows || []).map(normalizeRow);

    let insertId = null;
    if (rows.length > 0) {
        const firstRow = res.rows[0];
        // Buscar campos tipo id... o serial
        for (const [key, value] of Object.entries(firstRow)) {
            if (key.toLowerCase().startsWith('id') && Number.isInteger(Number(value))) {
                insertId = Number(value);
                break;
            }
        }
        if (insertId === null) {
            const firstVal = Object.values(firstRow)[0];
            if (Number.isInteger(Number(firstVal))) {
                insertId = Number(firstVal);
            }
        }
    }

    if (isSpInsertarMedico) {
        const specialResult = [rows];
        specialResult.insertId = insertId;
        specialResult.affectedRows = res.rowCount || 0;
        return specialResult;
    }

    rows.insertId = insertId;
    rows.affectedRows = res.rowCount || 0;
    return rows;
}

const rawPool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
});

export const pool = {
    async query(sql, params = []) {
        const isSp = /^\s*CALL\s+sp_insertar_medico/i.test(sql);
        const { sql: finalSql, params: finalParams } = processQuery(sql, params);
        const res = await rawPool.query(finalSql, finalParams);
        return formatResult(res, isSp);
    },

    async getConnection() {
        const client = await rawPool.connect();
        let inTransaction = false;

        return {
            async query(sql, params = []) {
                const isSp = /^\s*CALL\s+sp_insertar_medico/i.test(sql);
                const { sql: finalSql, params: finalParams } = processQuery(sql, params);
                const res = await client.query(finalSql, finalParams);
                return formatResult(res, isSp);
            },
            async beginTransaction() {
                await client.query('BEGIN');
                inTransaction = true;
            },
            async commit() {
                await client.query('COMMIT');
                inTransaction = false;
            },
            async rollback() {
                await client.query('ROLLBACK');
                inTransaction = false;
            },
            release() {
                try {
                    client.release();
                } catch {}
            },
            end() {
                try {
                    client.release();
                } catch {}
            }
        };
    }
};

export async function getConnection() {
    return pool.getConnection();
}

(async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Conexión exitosa a la base de datos PostgreSQL");
        connection.release();
    } catch (error) {
        console.warn("Aviso de conexión inicial a la base de datos:", error.message);
    }
})();