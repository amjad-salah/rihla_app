import asyncHandler from 'express-async-handler';
import Vehicle from '../models/vehicleModel.js';

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
    'journeys'
  );
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found');
  }
  res.status(200).json({ vehicle });
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
    !capacity ||
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

export {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
