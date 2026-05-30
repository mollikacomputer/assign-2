import type { Request, Response } from "express";
import { authService } from "./auth.service";
//---------start signupUser controller logic-------
const signUpUser = async(req:Request, res:Response)=>{
    try {
       const result = await authService.signupUserInToDB(req.body);
        res.status(201).json({
        status:true,
        message:"User registered successfully.",
        data:result,
        });
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message,
            error:error,
        });
    }
}
//-----------------end signupUser logic-------------
// --------start login controller---------------------
const loginUser = async(req: Request, res:Response)=>{
    try {
    const result = await authService.loginIntoDB(req.body);
         res.status(404).json({
        status:true,
        message:"Login Successfully",
        data:result,
        });
    } catch (error:any) {
        res.status(403).json({
        success:false,
        message:error.message,
        error:error,
        });
    }
}
// --------end login Controller---------------------
export const authController = {
    signUpUser,
    loginUser,
}