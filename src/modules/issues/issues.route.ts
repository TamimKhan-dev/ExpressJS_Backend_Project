import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { user_roles } from "../../types";

const router = Router();

router.post('/', auth(user_roles.contributor, user_roles.maintainer),issuesController.createIssues);
router.get('/', issuesController.getAllIssues);
router.get('/:id', issuesController.getSingleIssue);
router.patch('/:id', auth(user_roles.contributor, user_roles.maintainer), issuesController.updateSingleIssue);

export const issuesRoute = router;