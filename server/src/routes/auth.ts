import express, { Response } from 'express';
const router = express.Router();

import userController from '../controller/usersController';
import { verifyUser } from '../middleware/auth';
import { HttpStatus } from '../util/HttpStatus';
import config from '../config';
import jwt from 'jsonwebtoken';
import { sanitizeUser } from '../models/user';
import { Request } from 'types';

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/access-token', verifyUser, (req: Request, res: Response) => {
  try {
    const user = sanitizeUser(req.user);
    const newToken = jwt.sign({ user }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });
    const response = {
      user: user,
      access_token: newToken,
    };
    res.json(response);
  } catch (error) {
    console.log('Error signing up new user :', JSON.stringify(error));
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
});
router.post('/profile', verifyUser, userController.updateProfile);

export default router;
