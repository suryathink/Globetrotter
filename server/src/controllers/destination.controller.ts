import { Request, Response } from "express";
import httpStatus from "http-status";
import { logApiError } from "../helpers/logApiError";
import { DestinationService } from "../services/destination.service";

export class DestinationController {
  // Gets a random destination with limited clues
  public static async Random(req: Request, res: Response) {
    try {
      const response = await DestinationService.random();

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
