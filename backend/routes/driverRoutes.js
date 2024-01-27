import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../controllers/driverController.js';

const router = express.Router();

router.route('/').get(protect, getAllDrivers).post(protect, createDriver);

router
  .route('/:id')
  .get(protect, getDriver)
  .put(protect, updateDriver)
  .delete(protect, deleteDriver);

export default router;
