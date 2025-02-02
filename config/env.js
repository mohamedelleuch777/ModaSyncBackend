import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
    PORT: process.env.PORT || 3000,
    DB_PATH: process.env.DATABASE_PATH || "../database/database.sqlite",
    JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
    TOKEN_EXPIRE_AFTER : process.env.TOKEN_EXPIRE_AFTER || "1h",
    STATIC_URL: "//static.modasync.com"
};

export default CONFIG;
export const { PORT,
     DB_PATH, 
     JWT_SECRET, 
     TOKEN_EXPIRE_AFTER 
} = CONFIG;