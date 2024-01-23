import express from 'express';
import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../controllers/driverController.js';

const router = express.Router();

router.route('/').get(getAllDrivers).post(createDriver);

router.route('/:id').get(getDriver).put(updateDriver).delete(deleteDriver);

export default router;
