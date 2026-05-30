import { type NextFunction, type Request, type Response } from "express";
import { issueService } from "../modules/issues/issues.service";


export const canDeleteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user;

    const issue = await issueService.findIssueById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Maintainer → can delete any issue
    if (user.role === "maintainer") {
      return next();
    }

    // Contributor → must be owner
    if (issue.reported_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only delete your own issues",
      });
    }

    // Contributor → issue must be open
    if (issue.status !== "open") {
      return res.status(403).json({
        success: false,
        message: "Only open issues can be deleted",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};