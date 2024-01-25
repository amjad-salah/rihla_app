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

import {
  getAllIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/journeyIncController.js';

import {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/journeyExpController.js';

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

router.route('/:code/incomes').get(getAllIncomes).post(createIncome);

router
  .route('/:code/incomes/:id')
  .get(getIncome)
  .put(updateIncome)
  .delete(deleteIncome);

router.route('/:code/expenses').get(getAllExpenses).post(createExpense);

router
  .route('/:code/expenses/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
