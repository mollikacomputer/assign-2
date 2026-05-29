import type { Request, Response } from "express";
import { issueService } from "./issues.service";
import type { IIssue } from "./issues.interface";
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
//----start-Get all issue----
const getAllIssues = async(req:Request, res:Response)=>{
    try {
        const result = await issueService.getAllIssuesFromDB();
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
//----end-Get all issue----
//----start-Get single issue----
// const getSingleIssues = async(req:Request, res:Response)=>{
//     const {id} = req.params.id;
//     try {
//         const result = await issueService.getSingleIssueFromDB(id);
//         res.status(200).json({
//         status:true,
//         message:"get single Issues successfully.",
//         data:result,
//         });
//     } catch (error:any) {
//     res.status(500).json({
//         success:false,
//         message:error.message,
//         error:error,
//     }); 
//     }
// }

const getSingleIssue = async(req:Request, res:Response) =>{
const userId = Number(req.params.id);
  try {
      const result = await issueService.getSingleIssueFromDB(userId);
       res.status(201).json({
        status:true,
        message:"Single issue shown successfully!!",
        data:result,
    });
  } catch (error:any) {
    res.status(404).json({
    success: false,
    message: error.message,
    error: error,
    });
  }
};
//----end-Get single issue----


export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
}