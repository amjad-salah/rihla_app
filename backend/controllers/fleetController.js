import asyncHandler from 'express-async-handler';
import Vehicle from '../models/vehicleModel.js';
import Journey from '../models/journeyModel.js';
import VehicleExpense from '../models/vehicleExpModel.js';
import FinCategory from '../models/finCategoryModel.js';
import Transaction from '../models/transactionModel.js';

//@desc Get All Vehicles
//@rotue  GET /api/fleet
//@access Private
const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find().sort('-createdAt').populate('journeys');
  res.status(200).json({ vehicles });
});

//@desc Get Single Vehicle
//@rotue  GET /api/fleet/:code
//@access Private
const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code }).populate(
    'expenses'
  );

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }
  const journeys = await Journey.find({ vehicle: vehicle._id }).populate(
    'incomes departureCity arrivalCity'
  );

  res.status(200).json({ vehicle, journeys });
});

//@desc Create Vehicle
//@rotue  POST /api/fleet
//@access Private
const createVehicle = asyncHandler(async (req, res) => {
  const {
    vehMake,
    vehModel,
    vehYear,
    registerNumber,
    vehType,
    capacity,
    status,
    nextMaintenanceDate,
  } = req.body;

  if (
    !vehMake ||
    !vehModel ||
    !vehYear ||
    !registerNumber ||
    !vehType ||
    !status ||
    !nextMaintenanceDate
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  //Check if vehicle with same register number exists
  const existVehicle = await Vehicle.findOne({ registerNumber });

  if (existVehicle) {
    res.status(400);
    throw new Error('Vehicle with this register number already exists');
  }

  const newVehicle = await Vehicle.create({
    vehMake,
    vehModel,
    vehType,
    vehYear,
    registerNumber,
    nextMaintenanceDate,
    capacity,
    status,
  });

  res.status(201).json({ newVehicle });
});

//@desc Update Vehicle
//@rotue  PUT /api/fleet/:id
//@access Private
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    vehicle._id,
    req.body,
    { new: true }
  );

  res.status(200).json({ updatedVehicle });
});

//@desc Delete Vehicle
//@rotue  Delete /api/fleet/:id
//@access Private
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }

  await Vehicle.findByIdAndDelete(vehicle._id);

  res.status(200).json({ message: 'Vehicle deleted successfully!' });
});

//@desc  Get All Vehicle Expenses
//@rotue  GET /api/fleet/:code/expenses
//@access Private
const getVehicleExps = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }

  const expenses = await VehicleExpense.find({ vehicle: vehicle._id }).sort(
    '-createdAt'
  );

  res.status(200).json({ expenses, vehicle });
});

//@desc  Create Vehicle Journeys
//@rotue  POST /api/fleet/:code/expenses
//@access Private
const createVehicleExp = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }

  const { expType, desc, amount } = req.body;

  if (!expType || !desc || !amount) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newExpenses = await VehicleExpense.create({
    ...req.body,
    vehicle: vehicle._id,
  });

  //Create a global expense
  let vehCategory = await FinCategory.findOne({
    catName: 'المركبات',
    catType: 'expense',
  });

  if (!vehCategory) {
    vehCategory = await FinCategory.create({
      catName: 'المركبات',
      catType: 'expense',
    });
  }

  //Create expense
  await Transaction.create({
    txType: 'expense',
    category: vehCategory._id,
    amount,
    description: `Vehicle ${vehicle.vehCode} - ${expType} - ${desc}`,
  });

  res.status(200).json({ newExpenses });
});

//@desc  Delete a Vehicle Expense
//@rotue  Delete /api/fleet/:code/expenses/:id
//@access Private
const deleteVehicleExp = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ vehCode: req.params.code });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }

  const expense = await VehicleExpense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error('Expense Not Found');
  }

  //Create a global income to balance the expense
  let vehCategory = await FinCategory.findOne({
    catName: 'المركبات',
    catType: 'income',
  });

  if (!vehCategory) {
    vehCategory = await FinCategory.create({
      catName: 'المركبات',
      catType: 'income',
    });
  }

  //Create expense
  await Transaction.create({
    txType: 'income',
    category: vehCategory._id,
    amount: expense.amount,
    description: `Vehicle ${vehicle.vehCode} - ${expense.expType} - ${expense.desc} expense deleted`,
  });

  await VehicleExpense.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Deleted successfully' });
});

export {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleExps,
  createVehicleExp,
  deleteVehicleExp,
};
