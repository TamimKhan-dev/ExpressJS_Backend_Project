import { neon } from "@neondatabase/serverless";
import config from "../config";

export const sql = neon(config.connectionString);

export const initDB = () => {
   try {
    console.log('Database Connected Successfully!');
   } catch (error) {
     console.log(error);
   }
}