import { neon } from "@neondatabase/serverless";
import config from "../config";

export const sql = neon(config.connectionString);

export const initDB = async () => {
   try {
    await sql`
    CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY,
     name VARCHAR(20),
     email VARCHAR(20) UNIQUE NOT NULL,
     password TEXT NOT NULL,
     role VARCHAR(10) DEFAULT 'contributor',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
    )
    `;

    
    console.log('Database Connected Successfully!');
   } catch (error) {
     console.log(error);
   }
}