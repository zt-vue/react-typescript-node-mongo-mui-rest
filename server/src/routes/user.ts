import express from 'express';
const router = express.Router();

import userController from '../controller/usersController';
import { verifyRole } from '../middleware/auth';
import { UserRoles } from '../types';

router.get('/', verifyRole([UserRoles.admin]), userController.listUser);
router.post('/:id', verifyRole([UserRoles.admin]), userController.updateUser);
router.delete('/:id', verifyRole([UserRoles.admin]), userController.deleteUser);

export default router;
