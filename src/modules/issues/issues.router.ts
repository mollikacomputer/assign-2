import { Router } from "express";
import { issueController } from "./issues.controller";
import { issueService } from "./issues.service";
import { authMiddleware } from "../../middleware/authMiddleware";
import { canUpdateIssue } from "../../middleware/canUpdateIssue";

const router = Router();

router.post('/', issueController.createIssue);
router.get('/', issueController.getAllIssues);
router.get('/:id', issueController.getSingleIssue);
router.delete('/:id', authMiddleware, canUpdateIssue, issueController.deleteIssue);
router.patch('/:id', authMiddleware, canUpdateIssue, issueController.updateIssue );
export const issueRouter = router;