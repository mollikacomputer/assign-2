import { Router } from "express";
import { issueController } from "./issues.controller";
import { issueService } from "./issues.service";

const router = Router();

router.post('/', issueController.createIssue);
router.get('/', issueController.getAllIssues)

export const issueRouter = router;