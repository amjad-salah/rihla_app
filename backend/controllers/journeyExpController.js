import asyncHandler from 'express-async-handler';
import JourneyExpense from '../models/journeyExpModel.js';
import Journey from '../models/journeyModel.js';
import Transaction from '../models/transactionModel.js';
import FinCategory from '../models/finCategoryModel.js';

//@desc Get All Expenses
//@rotue  GET /api/journeys/:code/expenses
//@access Private
const getAllExpenses = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({
    journeyNumber: req.params.code,
  }).populate('departureCity arrivalCity');

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expenses = await JourneyExpense.find({ journey: journey._id }).sort(
    '-createdAt'
  );
  res.status(200).json({ expenses, journey });
});

//@desc Get Single Expense
//@rotue  GET /api/journeys/:code/expenses/:id
//@access Private
const getExpense = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({
    journeyNumber: req.params.code,
  }).populate('departureCity arrivalCity');

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const expense = await JourneyExpense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense Not Found');
  }

  res.status(200).json({ expense, journey });
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

  //Create Global Expense
  let jrnCategory = await FinCategory.findOne({
    catName: 'الرحلات',
    catType: 'expense',
  });

  if (!jrnCategory) {
    jrnCategory = await FinCategory.create({
      catName: 'الرحلات',
      catType: 'expense',
    });
  }

  //Create expense
  await Transaction.create({
    txType: 'expense',
    category: jrnCategory._id,
    amount,
    description: `Journey ${journey.journeyNumber} - ${expType} - ${desc}`,
  });

  const newExpense = await JourneyExpense.create({
    ...req.body,
    journey: journey._id,
  });

  res.status(201).json({ newExpense });
});

//@desc Update Expense
//@rotue  PUT /api/journeys/:code/expenses/:id
//@access Private
// const updateExpense = asyncHandler(async (req, res) => {
//   const journey = await Journey.findOne({ journeyNumber: req.params.code });

//   if (!journey) {
//     res.status(404);
//     throw new Error('Journey Not Found');
//   }

//   const expense = await Journey.findById(req.params.id);

//   if (!expense) {
//     res.status(404);
//     throw new Error('Expense Not Found');
//   }

//   const updatedExpense = await JourneyExpense.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//     }
//   );

//   res.status(200).json({ updatedExpense });
// });

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

  //Creat a global income to balance this expense
  let jrnCategory = await FinCategory.findOne({
    catName: 'الرحلات',
    catType: 'income',
  });

  if (!jrnCategory) {
    jrnCategory = await FinCategory.create({
      catName: 'الرحلات',
      catType: 'income',
    });
  }

  //Create income
  await Transaction.create({
    txType: 'income',
    category: jrnCategory._id,
    amount: expense.amount,
    description: `Journey ${journey.journeyNumber} - ${expense.expType} - ${expense.desc} Epxpense Deleted`,
  });

  await JourneyExpense.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Expense deleted successfully!' });
});

export { getAllExpenses, getExpense, createExpense, deleteExpense };
