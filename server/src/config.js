import dotenv from 'dotenv';
dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "mytoken";

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'posta';
export const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;