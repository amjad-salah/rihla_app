import express from 'express';
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

router.route('/').get(getAllVehicles).post(createVehicle);

router.route('/:code').get(getVehicle).put(updateVehicle).delete(deleteVehicle);

router.route('/:code/journeys').get(getVehicleJrs);

router.route('/:code/expenses').get(getVehicleExps).post(createVehicleExp);

router.route('/:code/expenses/:id').delete(deleteVehicleExp);

export default router;