import express from 'express';
import {
  getAllJourneys,
  getJourney,
  createJourney,
  updateJourney,
  deleteJourney,
} from '../controllers/journeyController.js';
import {
  getReservation,
  getAllReservations,
  createReservation,
  deleteReservation,
  updateReservation,
} from '../controllers/reservationController.js';

const router = express.Router();

router.route('/').get(getAllJourneys).post(createJourney);

router.route('/:code').get(getJourney).put(updateJourney).delete(deleteJourney);
router
  .route('/:code/reservations')
  .get(getAllReservations)
  .post(createReservation);
router
  .route('/:code/reservations/:id')
  .get(getReservation)
  .put(updateReservation)
  .delete(deleteReservation);

export default router;
