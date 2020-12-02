import express from 'express';
import UserRoute from './user';
import AuthRoute from './auth';
import RestaurantRoute from './restaurant';
import { verifyUser } from '../middleware/auth';
const router = express.Router();
router.use('/users', verifyUser, UserRoute);
router.use('/auth', AuthRoute);
router.use('/restaurants', verifyUser, RestaurantRoute);

export { router as Router };
