import { NextFunction } from "express";

const errorCatch = (err: unknown, next: NextFunction) => {
  if (err instanceof Error) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

export default errorCatch;
