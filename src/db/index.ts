import { neon } from "@neondatabase/serverless";
import config from "../config";

export const sql = neon(config.connectionString);

export const initDB = async () => {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password TEXT NOT NULL,
     role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
    )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS issues(
       id SERIAL PRIMARY KEY,
       reporter_id INT NOT NULL,
       title VARCHAR(150) NOT NULL,
       description TEXT NOT NULL,
       type TEXT CHECK (type IN ('bug', 'feature_request')),
       status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
      )
      `;

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
