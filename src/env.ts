import dotenv from 'dotenv';

dotenv.config();

export const LOG_LEVEL = process.env.LOG_LEVEL as string;

export const NODE_ENV = process.env.NODE_ENV as string;

export const PORT = Number(process.env.PORT || 3000);
