import asyncHandler from 'express-async-handler';
import Reservation from '../models/reservationModel.js';
import Journey from '../models/journeyModel.js';

//@desc Get All Reservations
//@rotue  GET /api/journeys/:code/reservations
//@access Private
const getAllReservations = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservations = await Reservation.find({ journey: journey._id })
    .sort('-createdAt')
    .populate('journey');
  res.status(200).json({ reservations });
});

//@desc Get Single Reservation
//@rotue  GET /api/journeys/:code/reservations/:id
//@access Private
const getReservation = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation Not Found');
  }
  res.status(200).json({ reservation });
});

//@desc Create Reservation
//@rotue  POST /api/journeys/:code/reservations
//@access Private
const createReservation = asyncHandler(async (req, res) => {
  const jrn = await Journey.findOne({ journeyNumber: req.params.code });

  if (!jrn) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const { journey, customerName, seatNumber, reservationStatus, amount } =
    req.body;

  if (
    !journey ||
    !customerName ||
    !seatNumber ||
    !reservationStatus ||
    !amount
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newReservation = await Reservation.create(req.body);

  res.status(201).json({ newReservation });
});

//@desc Update Reservation
//@rotue  PUT /api/journeys/:code/reservations/:id
//@access Private
const updateReservation = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation Not Found');
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedReservation });
});

//@desc Delete Reservation
//@rotue  Delete /api/journeys/:code/reservations/:code
//@access Private
const deleteReservation = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation Not Found');
  }

  await Reservation.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Reservation deleted successfully!' });
});

export {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
