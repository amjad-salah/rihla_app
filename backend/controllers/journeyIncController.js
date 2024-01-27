import asyncHandler from 'express-async-handler';
import JourneyIncome from '../models/journeyIncModel.js';
import Journey from '../models/journeyModel.js';
import Transaction from '../models/transactionModel.js';
import FinCategory from '../models/finCategoryModel.js';

//@desc Get All Incomes
//@rotue  GET /api/journeys/:code/incomes
//@access Private
const getAllIncomes = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const incomes = await JourneyIncome.find({ journey: journey._id }).sort(
    '-createdAt'
  );
  res.status(200).json({ incomes, journey });
});

//@desc Get Single Income
//@rotue  GET /api/journeys/:code/incomes/:id
//@access Private
const getIncome = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const income = await JourneyIncome.findById(req.params.id);

  if (!income) {
    res.status(404);
    throw new Error('Income Not Found');
  }

  res.status(200).json({ income, journey });
});

//@desc Create Income
//@rotue  POST /api/journeys/:code/incomes
//@access Private
const createIncome = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const { desc, amount } = req.body;

  if (!desc || !amount) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newIncome = await JourneyIncome.create({
    ...req.body,
    journey: journey._id,
  });

  //Creat a global income
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
    amount,
    description: `Journey ${jrn.journeyNumber} - ${desc}`,
  });

  res.status(201).json({ newIncome });
});

//@desc Update Income
//@rotue  PUT /api/journeys/:code/incomes/:id
//@access Private
// const updateIncome = asyncHandler(async (req, res) => {
//   const journey = await Journey.findOne({ journeyNumber: req.params.code });

//   if (!journey) {
//     res.status(404);
//     throw new Error('Journey Not Found');
//   }

//   const income = await Journey.findById(req.params.id);

//   if (!income) {
//     res.status(404);
//     throw new Error('Income Not Found');
//   }

//   const updatedIncome = await JourneyIncome.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//     }
//   );

//   res.status(200).json({ updatedIncome });
// });

//@desc Delete Income
//@rotue  Delete /api/journeys/:code/incomes/:code
//@access Private
const deleteIncome = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const income = await JourneyIncome.findById(req.params.id);

  if (!income) {
    res.status(404);
    throw new Error('Income Not Found');
  }

  //Create Expense to balance this income
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
    amount: income.amount,
    description: `Journey ${journey.journeyNumber} Income Delete`,
  });

  await JourneyIncome.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Income deleted successfully!' });
});

export { getAllIncomes, getIncome, createIncome, deleteIncome };
