import express from 'express';
const router = express.Router();

import restController from '../controller/restaurantsController';
import { verifyRole } from '../middleware/auth';
import { UserRoles } from '../types';

router.get('/', restController.getRestaurants);
router.post('/', verifyRole([UserRoles.owner]), restController.addRestaurant);
router.post(
  '/:id',
  verifyRole([UserRoles.admin]),
  restController.updateRestaurant
);
router.delete(
  '/:id',
  verifyRole([UserRoles.admin]),
  restController.deleteRestaurant
);

router.post(
  '/:restId/reviews',
  verifyRole([UserRoles.regular]),
  restController.addReview
);
router.post(
  '/:restId/reviews/reply',
  verifyRole([UserRoles.owner]),
  restController.replyReview
);
router.post(
  '/:restId/reviews/:id',
  verifyRole([UserRoles.admin]),
  restController.updateReview
);
router.delete(
  '/:restId/reviews/:id',
  verifyRole([UserRoles.admin]),
  restController.deleteReview
);

export default router;
