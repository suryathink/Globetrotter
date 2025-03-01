import { Request, Response } from "express";
import httpStatus from "http-status";
import { logApiError } from "../helpers/logApiError";
import { UserService } from "../services/user.service";

export class UserController {
  public static async create(req: Request, res: Response) {
    try {
      const { username } = req.body;

      const response = await UserService.create(username);

      if (response && "isError" in response && response.isError) {
        return res.status(httpStatus.NOT_FOUND).send({
          statusCode: httpStatus.NOT_FOUND,
          message: response?.message,
          data: response?.data,
        });
      } else {
        return res.send({
          statusCode: httpStatus.OK,
          data: response?.data,
        });
      }
    } catch (error) {
      logApiError(req, error as unknown as any);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
  // Get user by username
  public static async verifyUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const response = await UserService.verifyUsername(username);

      if (response && "isError" in response && response.isError) {
        return res.status(httpStatus.NOT_FOUND).send({
          statusCode: httpStatus.NOT_FOUND,
          message: response?.message,
          data: response?.data,
        });
      } else {
        return res.send({
          statusCode: httpStatus.OK,
          data: response?.data,
        });
      }
    } catch (error) {
      logApiError(req, error as unknown as any);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
  public static async updateUserScore(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { correct } = req.body;

      const response = await UserService.updateUserScore(username, correct);

      if (response && "isError" in response && response.isError) {
        return res.status(httpStatus.NOT_FOUND).send({
          statusCode: httpStatus.NOT_FOUND,
          message: response?.message,
          data: response?.data,
        });
      } else {
        return res.send({
          statusCode: httpStatus.OK,
          data: response?.data,
        });
      }
    } catch (error) {
      logApiError(req, error as unknown as any);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
}
