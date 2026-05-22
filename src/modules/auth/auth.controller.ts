import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import type { IAuthData } from "./auth.interface";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered Successfully!",
      data: result[0] as IAuthData
    });

  } catch (error: any) {
    sendResponse(res, {
      statusCode: 409,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
    try {
      const result = await authService.loginUserIntoDB(req.body);
      
      sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login successful!",
      data: result
    });
      
    } catch (error: any) {
      sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message,
      error: error,
    });
    }
}

export const authController = {
  createUser,
  loginUser
};
