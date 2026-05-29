import { pool } from "../db";
import type { ISignup } from "./auth.interface";
import bcrypt from "bcrypt";

const signupUserInToDB = async(payLoad:ISignup)=>{
    const {id, name, email,  password, role} = payLoad;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password:", hashedPassword);
    const result = await pool.query(`
        INSERT INTO users(name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *
        `,[name, email, hashedPassword, role],)
        delete result.rows[0].password;
        return result;
}
export const authService ={
    signupUserInToDB,
}