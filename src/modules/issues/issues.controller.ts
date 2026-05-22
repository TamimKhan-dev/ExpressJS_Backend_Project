import { type Request, type Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issuesService } from "./issues.service";
import type { IIssueData } from "./issues.interface";

const createIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.createIssueIntoDB(req.body, req.user?.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully!",
      data: result[0] as IIssueData
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message,
      error: error
    });
  }
};

export const issuesController = {
    createIssues,
}