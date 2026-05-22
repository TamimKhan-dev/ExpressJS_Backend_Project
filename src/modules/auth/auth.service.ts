import { sql } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { ISignUp } from "./auth.interface";
import config from "../../config";

const createUserIntoDB = async (payload: ISignUp) => {
  const { name, email, password, role } = payload;

  const hashpassword = await bcrypt.hash(password, 10);

  const result = await sql`
     INSERT INTO users(name, email, password, role)
     VALUES(${name}, ${email}, ${hashpassword}, COALESCE(${role}, 'contributor'))
     RETURNING id, name, email, role, created_at, updated_at
    `;

  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await sql`
    SELECT * FROM users WHERE email=${email}
  `;

  const user = userData[0];

  if (!user) {
    
    throw new Error('Invalid Credentials!');
  }

  const matchPassword: boolean = await bcrypt.compare(password, user.password); 

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email
  }

  const accessToken = jwt.sign(jwtpayload, config.jwtSecret, {expiresIn: '1d'});

  const { password: pass, ...otherDetails} = user;

  return { token: accessToken, user: otherDetails};
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB
};
