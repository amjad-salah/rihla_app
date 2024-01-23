import express from 'express';
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
} from '../controllers/fleetController.js';

const router = express.Router();

router.route('/').get(getAllVehicles).post(createVehicle);

router.route('/:code').get(getVehicle).put(updateVehicle).delete(deleteVehicle);

export default router;
