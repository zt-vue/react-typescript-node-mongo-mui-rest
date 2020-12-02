import config from '../config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';
import { Request, UserRoles } from '../types';
import { Response } from 'express';
import { User, sanitizeUser } from '../models/user';
import { Restaurant } from '../models/restaurant';
import { isValidObjectId } from 'mongoose';
import { HttpStatus, ErrorStatus } from '../util/HttpStatus';

export default {
  login: async (req: Request, res: Response) => {
    try {
      await check('email', 'Email is not valid').isEmail().run(req);
      await check('password', 'Password cannot be blank')
        .isLength({ min: 1 })
        .run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: true, message: errors.array()[0].msg });
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "User doesn't exist!" });
      }
      const isMatch = await bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid Credentials!' });
      }
      const payload = {
        user: sanitizeUser(user),
      };
      const access_token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });
      res.json({
        user: payload.user,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  },

  register: asyncHandler(async (req: Request, res: Response) => {
    try {
      await check('email', 'Email is not valid').isEmail().run(req);
      await check('password', 'Password cannot be blank')
        .isLength({ min: 1 })
        .run(req);
      await check('name', 'Name cannot be blank').isLength({ min: 1 }).run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: true, message: errors.array()[0].msg });
      const { name, email, password } = req.body;
      const exists = await User.exists({ email: req.body.email });
      if (exists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: true,
          message: 'Account with that email address already exists.',
        });
      }
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      const payload = {
        user: sanitizeUser(user),
      };
      const access_token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });
      res.json({
        user: payload.user,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),

  listUser: asyncHandler(async (req: Request, res: Response) => {
    try {
      const users = await User.find().select('-password');
      res.status(HttpStatus.OK).json({ users });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id))
      throw new ErrorStatus('User not found!');
    const reqUser = await User.findOne({ _id: req.params.id });
    if (!reqUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User Not Found!' });
    }
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('name', 'Name cannot be blank').isLength({ min: 1 }).run(req);
    await check('role', 'Role is not valid')
      .isIn(Object.keys(UserRoles))
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: errors.array()[0].msg });

    if (reqUser.email !== String(req.body.email)) {
      const exists = await User.exists({ email: req.body.email });
      if (exists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: true,
          message: 'Account with that email address already exists.',
        });
      }
    }
    reqUser.name = req.body.name;
    reqUser.role = req.body.role;
    reqUser.email = req.body.email;
    if (req.body.password) reqUser.password = req.body.password;
    await reqUser.save();
    res.status(HttpStatus.OK).json(sanitizeUser(reqUser));
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id))
      throw new ErrorStatus('User not found!');
    let reqUser = await User.findById(req.params.id);
    if (!reqUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User Not Found!' });
    }
    await User.findOneAndRemove({ _id: req.params.id });
    await Restaurant.deleteMany({ user: reqUser._id });
    res.status(HttpStatus.OK).json();
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    try {
      await check('email', 'Email is not valid').isEmail().run(req);
      await check('name', 'Name cannot be blank').isLength({ min: 1 }).run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: true, message: errors.array()[0].msg });

      const user = req.user;
      const { name, password, email, isUpdatePassword } = req.body;
      if (email) {
        const exists = await User.exists({ email: req.body.email });
        if (user.email !== email && exists) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Account with that email address already exists.',
          });
        }
        user.email = email;
      }
      user.name = name;
      if (isUpdatePassword) {
        if (!password)
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ error: true, message: 'Password cannot be blank' });
        user.password = password;
      }
      await user.save();
      const payload = {
        user: sanitizeUser(user),
      };
      const access_token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });
      res.json({
        user: payload.user,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }),
};
