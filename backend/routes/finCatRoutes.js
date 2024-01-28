import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/finCatController.js';

const router = express.Router();

router.route('/').get(protect, getAllCategories).post(protect, createCategory);

router
  .route('/:id')
  .get(protect, getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
