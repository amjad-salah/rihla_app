import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  getVehicleJrs,
  getVehicleExps,
  createVehicleExp,
  deleteVehicleExp,
} from '../controllers/fleetController.js';

const router = express.Router();

router.route('/').get(protect, getAllVehicles).post(protect, createVehicle);

router
  .route('/:code')
  .get(protect, getVehicle)
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

router.route('/:code/journeys').get(protect, getVehicleJrs);

router
  .route('/:code/expenses')
  .get(protect, getVehicleExps)
  .post(protect, createVehicleExp);

router.route('/:code/expenses/:id').delete(protect, deleteVehicleExp);

export default router;
