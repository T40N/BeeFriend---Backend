import { Request } from "express";
import { validationResult } from "express-validator";

const validationResoulteCheck = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }
};

export default validationResoulteCheck;
