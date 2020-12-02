import { Request, Response, NextFunction } from 'express';
import Logger from '../util/logger';
import { ErrorStatus } from '../util/HttpStatus';

/**
 * Generic Error handler
 *
 * @param {Error} err The Error object.
 * @param {Request} req The Request interface of the HTTP API represents a resource request.
 * @param {Response} res The Response interface of the HTTP API represents the response to a request.
 * @param {NextFunction} next The NextFunction interface who calls the next middleware in the call chain.
 * @returns {void}
 */

const ErrorHandler = (
  err: ErrorStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err.message || String(err));

  if (!err.status) Logger.error(err.stack);

  // Default to 400 Bad request error
  return res.status(err.status || 400).json({
    error: true,
    message: err.message || err,
  });
};

export { ErrorHandler };
