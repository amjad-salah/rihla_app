import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllDestinations)
  .post(protect, createDestination);

router
  .route('/:id')
  .get(protect, getDestination)
  .put(protect, updateDestination)
  .delete(protect, deleteDestination);

export default router;
