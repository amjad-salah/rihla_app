import express from 'express';
import {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';

const router = express.Router();

router.route('/').get(getAllDestinations).post(createDestination);

router
  .route('/:id')
  .get(getDestination)
  .put(updateDestination)
  .delete(deleteDestination);

export default router;
