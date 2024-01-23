import asyncHandler from 'express-async-handler';
import Destination from '../models/destinationModel.js';

//@desc Get All Destinations
//@rotue  GET /api/destinations
//@access Private
const getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort('-createdAt');
  res.status(200).json({ destinations });
});

//@desc Get Single Destination
//@rotue  GET /api/destinations/:id
//@access Private
const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error('Destination Not Found');
  }
  res.status(200).json({ destination });
});

//@desc Create Destination
//@rotue  POST /api/destinations
//@access Private
const createDestination = asyncHandler(async (req, res) => {
  const { country, city } = req.body;

  if (!country || !city) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newDestination = await Destination.create(req.body);

  res.status(201).json({ newDestination });
});

//@desc Update Destination
//@rotue  PUT /api/destinations/:id
//@access Private
const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination Not Found');
  }

  const updatedDestination = await Destination.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedDestination });
});

//@desc Delete Destination
//@rotue  Delete /api/destinations/:id
//@access Private
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination Not Found');
  }

  await Destination.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Destination deleted successfully!' });
});

export {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
};
