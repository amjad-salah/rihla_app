import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  logoutUser,
  authUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(protect, getAllUsers).post(protect, createUser);

router.route('/auth').get(logoutUser).post(authUser);

router
  .route('/:id')
  .get(protect, getUser)
  .put(updateUser)
  .delete(protect, deleteUser);

export default router;
