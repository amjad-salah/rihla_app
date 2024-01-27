import asyncHandler from 'express-async-handler';
import Driver from '../models/driverModel.js';

//@desc Get All Drivers
//@rotue  GET /api/drivers
//@access Private
const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find().sort('-createdAt').populate('journeys');
  res.status(200).json({ drivers });
});

//@desc Get Single Driver
//@rotue  GET /api/drivers/:id
//@access Private
const getDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate('journeys');
  if (!driver) {
    res.status(404);
    throw new Error('Driver Not Found');
  }
  res.status(200).json({ driver });
});

//@desc Create Driver
//@rotue  POST /api/drivers
//@access Private
const createDriver = asyncHandler(async (req, res) => {
  const { fullName, licenseNumber, licenseExpDate, contactNumber } = req.body;

  if (!fullName || !licenseExpDate || !licenseNumber || !contactNumber) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newDriver = await Driver.create(req.body);

  res.status(201).json({ newDriver });
});

//@desc Update Driver
//@rotue  PUT /api/drivers/:id
//@access Private
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error('Driver Not Found');
  }

  const updatedDriver = await Driver.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedDriver });
});

//@desc Delete Driver
//@rotue  Delete /api/drivers/:id
//@access Private
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error('Driver Not Found');
  }

  await Driver.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Driver deleted successfully!' });
});

export { getAllDrivers, getDriver, createDriver, updateDriver, deleteDriver };
