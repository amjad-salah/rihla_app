import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';

//@desc Get All Transactions
//@rotue  GET /api/transactions
//@access Private
const getAllTransactions = asyncHandler(async (req, res) => {
  const incomes = await Transaction.find({ txType: 'income' })
    .sort('-createdAt')
    .populate('category');

  const expenses = await Transaction.find({ txType: 'expense' })
    .sort('-createdAt')
    .populate('category');

  res.status(200).json({ incomes, expenses });
});

//@desc Get Single Transaction
//@rotue  GET /api/transactions/:id
//@access Private
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate(
    'category'
  );
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction Not Found');
  }
  res.status(200).json({ transaction });
});

//@desc Create Transaction
//@rotue  POST /api/transactions
//@access Private
const createTransaction = asyncHandler(async (req, res) => {
  const { txType, category, amount, description } = req.body;

  if (!txType || !category || !amount || !description) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newTransaction = await Transaction.create(req.body);

  res.status(201).json({ newCat });
});

//@desc Update Transaction
//@rotue  PUT /api/transactions/:id
//@access Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction Not Found');
  }

  const updatedTx = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedTx });
});

//@desc Delete Transaction
//@rotue  Delete /api/transactions/:id
//@access Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction Not Found');
  }

  await Transaction.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Transaction deleted successfully!' });
});

export {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
