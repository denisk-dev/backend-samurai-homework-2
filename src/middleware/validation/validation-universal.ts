import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const sendErrorsIfAnyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);

  const errorMessages = result.array({ onlyFirstError: true }).map((error) => ({
    message: error.msg,
    // @ts-ignore
    field: error.path,
  }));

  if (errorMessages.length > 0) {
    return res.status(400).json({ errorMessages });
  }

  return next();
};
