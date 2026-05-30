import type { Request, Response } from "express";
import { issueService } from "./issues.service";
import type { IIssue } from "./issues.interface";
import { pool } from "../../db";
//----end-create issue----
const createIssue = async(req: Request, res:Response )=>{
      try {
           const result = await issueService.createIssueIntoDB(req.body);
            res.status(201).json({
            status:true,
            message:"Issue Created successfully.",
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
        message:"Get all Issues successfully.",
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
//----start-delete single issue----
const deleteIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);

  try {
    const result = await issueService.deleteIssueFromDB(issueId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//----end-delete single issue----
// ----start update issues ------
const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user;

    const { title, description, type } = req.body;

    const issue = await issueService.findIssueById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const isMaintainer = user.role === "maintainer";
    const isOwner = issue.reported_id === user.id;

    if (!isMaintainer) {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Not your issue",
        });
      }

      if (issue.status !== "open") {
        return res.status(403).json({
          success: false,
          message: "Only open issues can be updated",
        });
      }
    }

    const result = await issueService.updateIssueFromDB(issueId, {
      title,
      description,
      type,
    });

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
//----end update issue----

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    deleteIssue,
    updateIssue,
}