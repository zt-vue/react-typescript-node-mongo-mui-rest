import jwt from 'jsonwebtoken';
import config from '../config';
import { HttpStatus } from '../util/HttpStatus';
import { User } from '../models/user';
import { Response, NextFunction } from 'express';
import { Request } from 'types';

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.header('authorization')) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'UnAuthorized, no token',
      });
    }
    const token = req.header('authorization').split(' ')[1];
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'UnAuthorized, no token',
      });
    }

    const payload: any = jwt.verify(token, config.jwtSecret);
    let userId = payload.user._id;
    req.user = await User.findById(userId);
    if (!req.user)
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'User Not found',
      });
    return next();
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ message: 'Invalid token' });
  }
};
export const verifyRole = (roleV: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (roleV.includes(role)) return next();
    return res.status(HttpStatus.FORBIDDEN).send({ message: 'Not allowed' });
  };
};
