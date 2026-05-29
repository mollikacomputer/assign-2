import type { Request, Response } from "express";
import { authService } from "./auth.service";

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
export const authController = {
    signUpUser,
}