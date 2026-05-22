import { sql } from "../../db";
import bcrypt from "bcrypt";
import type { ISignUp } from "./auth.interface";

const createUserIntoDB = async (payload: ISignUp) => {
    const {name, email, password, role} = payload;

    const hashpassword = await bcrypt.hash(password, 10);

    const result = await sql`
     INSERT INTO users(name, email, password, role)
     VALUES(${name}, ${email}, ${hashpassword}, COALESCE(${role}, 'contributor'))
     RETURNING id, name, email, role, created_at, updated_at
    `;

    return result;
};

export const authService = {
    createUserIntoDB,
}