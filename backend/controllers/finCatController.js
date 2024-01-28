import asyncHandler from 'express-async-handler';
import FinCategory from '../models/finCategoryModel.js';
import Transaction from '../models/transactionModel.js';

//@desc Get All Categories
//@rotue  GET /api/fin-cats
//@access Private
const getAllCategories = asyncHandler(async (req, res) => {
  const expCats = await FinCategory.find({ catType: 'expense' })
    .sort('-createdAt')
    .populate('transactions');

  const incCats = await FinCategory.find({ catType: 'income' })
    .sort('-createdAt')
    .populate('transactions');
  res.status(200).json({ expCats, incCats });
});

//@desc Get Single Category
//@rotue  GET /api/fin-cats/:id
//@access Private
const getCategory = asyncHandler(async (req, res) => {
  const category = await FinCategory.findById(req.params.id).populate(
    'transactions'
  );
  if (!category) {
    res.status(404);
    throw new Error('Category Not Found');
  }
  res.status(200).json({ category });
});

//@desc Create Category
//@rotue  POST /api/fin-cats
//@access Private
const createCategory = asyncHandler(async (req, res) => {
  const { catName, catType } = req.body;

  if (!catName || !catType) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newCat = await FinCategory.create(req.body);

  res.status(201).json({ newCat });
});

//@desc Update Category
//@rotue  PUT /api/fin-cats/:id
//@access Private
const updateCategory = asyncHandler(async (req, res) => {
  const category = await FinCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category Not Found');
  }

  const updatedCat = await FinCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedCat });
});

//@desc Delete Category
//@rotue  Delete /api/fin-cats/:id
//@access Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await FinCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category Not Found');
  }

  const transactions = await Transaction.find({ category: req.params.id });

  if (transactions.length !== 0) {
    res.status(400);
    throw new Error('Category Has transactions, please delete them first');
  }
  await FinCategory.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Category deleted successfully!' });
});

export {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
