import express from 'express';
import protect from '../middleware/authMiddleware.js';

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

router.route('/').get(protect, getAllJourneys).post(protect, createJourney);

router
  .route('/:code')
  .get(protect, getJourney)
  .put(protect, updateJourney)
  .delete(protect, deleteJourney);

router
  .route('/:code/reservations')
  .get(protect, getAllReservations)
  .post(protect, createReservation);

router
  .route('/:code/reservations/:id')
  .get(protect, getReservation)
  .put(protect, updateReservation)
  .delete(protect, deleteReservation);

router
  .route('/:code/incomes')
  .get(protect, getAllIncomes)
  .post(protect, createIncome);

router
  .route('/:code/incomes/:id')
  .get(protect, getIncome)
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

router
  .route('/:code/expenses')
  .get(protect, getAllExpenses)
  .post(protect, createExpense);

router
  .route('/:code/expenses/:id')
  .get(protect, getExpense)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;
