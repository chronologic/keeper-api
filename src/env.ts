import dotenv from 'dotenv';

dotenv.config();

export const LOG_LEVEL = (process.env.LOG_LEVEL as string) || 'info';

export const PORT = Number(process.env.PORT || 3000);
