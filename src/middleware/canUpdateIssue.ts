import type { NextFunction, Request, Response } from "express";
import { pool } from "../db";


export const canUpdateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user;

    const result = await pool.query(
      `SELECT * FROM issues WHERE id = $1`,
      [issueId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const issue = result.rows[0];

    // Maintainer → full access
    if (user.role === "maintainer") {
      req.issue = issue;
      return next();
    }

    // Contributor rules
    if (issue.reported_id !== user.id) {
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

    req.issue = issue;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};