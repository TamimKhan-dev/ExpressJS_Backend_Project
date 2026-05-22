import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { user_roles } from "../../types";

const router = Router();

router.post('/', auth(user_roles.contributor, user_roles.maintainer),issuesController.createIssues);

export const issuesRoute = router;