import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';

const router = express.Router();

router.route('/').get(protect, getAllCompanies).post(protect, createCompany);

router
  .route('/:id')
  .get(protect, getCompany)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

export default router;
