import asyncHandler from 'express-async-handler';
import JourneyExpense from '../models/journeyExpModel.js';
import Journey from '../models/journeyModel.js';

//@desc Get All Expenses
//@rotue  GET /api/journeys/:code/expenses
//@access Private
const getAllExpenses = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expenses = await JourneyExpense.find({ journey: journey._id }).sort(
    '-createdAt'
  );
  res.status(200).json({ expenses });
});

//@desc Get Single Expense
//@rotue  GET /api/journeys/:code/expenses/:id
//@access Private
const getExpense = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expense = await JourneyExpense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense Not Found');
  }

  res.status(200).json({ expense });
});

//@desc Create Expense
//@rotue  POST /api/journeys/:code/expenses
//@access Private
const createExpense = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const { desc, amount, expType } = req.body;

  if (!desc || !amount || !expType) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newExpense = await JourneyExpense.create({
    ...req.body,
    journey: journey._id,
  });

  res.status(201).json({ newExpense });
});

//@desc Update Expense
//@rotue  PUT /api/journeys/:code/expenses/:id
//@access Private
const updateExpense = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expense = await Journey.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense Not Found');
  }

  const updatedExpense = await JourneyExpense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedExpense });
});

//@desc Delete Expense
//@rotue  Delete /api/journeys/:code/expenses/:code
//@access Private
const deleteExpense = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expense = await JourneyExpense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense Not Found');
  }

  await JourneyExpense.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Expense deleted successfully!' });
});

export {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
