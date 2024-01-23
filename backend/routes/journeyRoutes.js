import express from 'express';
import {
  getAllJourneys,
  getJourney,
  createJourney,
  updateJourney,
  deleteJourney,
} from '../controllers/journeyController.js';

const router = express.Router();

router.route('/').get(getAllJourneys).post(createJourney);

router.route('/:id').get(getJourney).put(updateJourney).delete(deleteJourney);

export default router;
