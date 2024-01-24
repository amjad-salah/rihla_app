import asyncHandler from 'express-async-handler';
import Journey from '../models/journeyModel.js';

//@desc Get All Journeys
//@rotue  GET /api/journeys
//@access Private
const getAllJourneys = asyncHandler(async (req, res) => {
  const journeys = await Journey.find()
    .sort('-createdAt')
    .populate('vehicle driver arrivalCity departureCity');
  res.status(200).json({ journeys });
});

//@desc Get Single Journey
//@rotue  GET /api/journeys/:code
//@access Private
const getJourney = asyncHandler(async (req, res) => {
  const journey = await Journey.findById(req.params.id).populate(
    'vehicle driver arrivalCity departureCity'
  );
  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }
  res.status(200).json({ journey });
});

//TODO: Add fucntion for reservation operations

//@desc Create Journey
//@rotue  POST /api/journeys
//@access Private
const createJourney = asyncHandler(async (req, res) => {
  const {
    journeyType,
    departureCity,
    arrivalCity,
    departureTime,
    status,
    vehicle,
    driver,
  } = req.body;

  if (
    !journeyType ||
    !arrivalCity ||
    !departureCity ||
    !departureTime ||
    !status ||
    !vehicle ||
    !driver
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newJourney = await Journey.create(req.body);

  res.status(201).json({ newJourney });
});

//@desc Update Journey
//@rotue  PUT /api/journeys/:code
//@access Private
const updateJourney = asyncHandler(async (req, res) => {
  const journey = await Journey.findById(req.params.id);

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const updatedJourney = await Journey.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedJourney });
});

//@desc Delete Journey
//@rotue  Delete /api/journeys/:code
//@access Private
const deleteJourney = asyncHandler(async (req, res) => {
  const journey = await Journey.findById(req.params.id);

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  await Journey.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Journey deleted successfully!' });
});

export {
  getAllJourneys,
  getJourney,
  createJourney,
  updateJourney,
  deleteJourney,
};
