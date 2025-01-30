import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
    PORT: process.env.PORT || 3000,
    DB_PATH: process.env.DATABASE_PATH || "../database/database.duckdb",
    JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
};

export default CONFIG;
export const { PORT, DB_PATH, JWT_SECRET } = CONFIG;