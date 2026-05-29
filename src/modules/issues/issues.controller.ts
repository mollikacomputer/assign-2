import type { Request, Response } from "express";
import { issueService } from "./issues.service";
//----end-create issue----
const createIssue = async(req: Request, res:Response )=>{
      try {
           const result = await issueService.createIssueIntoDB(req.body);
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
//----end-create issue----
export const issueController = {
    createIssue,
}