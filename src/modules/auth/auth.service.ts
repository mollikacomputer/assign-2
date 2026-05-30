import config from "../../config";
import { pool } from "../../db";
import type { ILogin, ISignup } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//--------start signup service logic -------------
const signupUserInToDB = async(payLoad:ISignup)=>{
    const {id, name, email,  password, role} = payLoad;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
        INSERT INTO users(name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *
        `,[name, email, hashedPassword, role],)
        delete result.rows[0].password;
        return result.rows[0];
}
//--------end signup or register-------------
//--------start login service logic -------------
const loginIntoDB = async(payLoad:ILogin) =>{
    const {email, password, role} = payLoad;
    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])
        
        if(userData.rows.length === 0){
            throw new Error("Invalid Email or Credintials!!");
        };
    const user =userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password)
    if(!matchPassword){
        throw new Error("Invalid Password!!");
    }
// token
const jwtpayload = {
    id:user.id,
    name:user.name,
    email:user.email,
    role:user.role,
};
const accessToken = jwt.sign(jwtpayload, config.secret as string, {expiresIn:"1d"});
delete user.password;
return {accessToken, user};
}
//--------start login service logic -------------


export const authService ={
    signupUserInToDB,
    loginIntoDB,
}