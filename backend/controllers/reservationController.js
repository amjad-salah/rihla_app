import asyncHandler from 'express-async-handler';
import Reservation from '../models/reservationModel.js';
import Journey from '../models/journeyModel.js';
import Vehicle from '../models/vehicleModel.js';
import JourneyIncom from '../models/journeyIncModel.js';

//@desc Get All Reservations
//@rotue  GET /api/journeys/:code/reservations
//@access Private
const getAllReservations = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservations = await Reservation.find({ journey: journey._id }).sort(
    '-createdAt'
  );
  res.status(200).json({ reservations });
});

//@desc Get Confirmed Reservations
//@rotue  GET /api/journeys/:code/confirm-reserv
//@access Private
const getConfirmedReservations = asyncHandler(async (req, res) => {
  const journey = await Journey.findOne({ journeyNumber: req.params.code });

  if (!journey) {
    res.status(404);
    throw new Error('Journey Not Found');
  }

  const reservations = await Reservation.find({
    journey: journey._id,
    reservationStatus: 'مؤكد',
  }).sort('-createdAt');
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

  //Check for seat availability if journey type is passenger
  if (jrn.journeyType === 'ركاب') {
    const vehicle = await Vehicle.findById(jrn.vehicle);
    const reservations = await Reservation.find({
      journey: jrn._id,
      reservationStatus: 'مؤكد',
    });

    if (vehicle.capacity === reservations.length) {
      res.status(400);
      throw new Error('No seat available in this journey');
    }
  }

  const { customerName, seatNumber, reservationStatus, amount } = req.body;

  if (!customerName || !seatNumber || !reservationStatus || !amount) {
    res.status(400);
    throw new Error('All fields are required');
  }

  //Check is the seat number is taken
  const reserv = await Reservation.findOne({
    journey: jrn._id,
    seatNumber,
    reservationStatus: 'مؤكد',
  });

  if (reserv) {
    res.status(400);
    throw new Error('Seat number already taken');
  }

  const newReservation = await Reservation.create({
    ...req.body,
    journey: jrn._id,
  });

  //Creat journey income if status is confirmed
  if (reservationStatus === 'مؤكد') {
    await JourneyIncom.create({
      journey: jrn._id,
      reservation: newReservation._id,
      desc: `Reservation ${newReservation.customerName}`,
      amount,
    });
  }

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

  //Check status changed to confirmed or canceled
  if (req.body.reservationStatus) {
    if (
      req.body.reservationStatus === 'مؤكد' &&
      reservation.reservationStatus !== 'مؤكد'
    ) {
      //Check for seat availability if journey type is passenger
      if (journey.journeyType === 'ركاب') {
        const vehicle = await Vehicle.findById(jrn.vehicle);
        const reservations = await Reservation.find({
          journey: jrn._id,
          reservationStatus: 'مؤكد',
        });

        if (vehicle.capacity === reservations.length) {
          res.status(400);
          throw new Error('No seat available in this journey');
        }
      }

      //Create journey Income
      await JourneyIncom.create({
        journey: jrn._id,
        reservation: newReservation._id,
        desc: `Reservation ${newReservation.customerName}`,
        amount,
      });
    }

    //Check for cancel
    if (
      req.body.reservationStatus === 'ملغاة' &&
      reservation.reservationStatus === 'مؤكد'
    ) {
      await JourneyIncom.findOneAndDelete({ reservation: reservation._id });
    }
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

  //Check for cancel
  if (reservation.reservationStatus === 'مؤكد') {
    await JourneyIncom.findOneAndDelete({ reservation: reservation._id });
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
  getConfirmedReservations,
};
