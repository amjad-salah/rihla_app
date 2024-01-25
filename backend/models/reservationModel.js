import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
  {
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
    },
    customerName: {
      type: String,
      required: true,
    },
    seatNumber: {
      type: String,
    },
    reservationStatus: {
      type: String,
      required: true,
      enum: ['حجز', 'مؤكد', 'ملغي'],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
// mongoose.models.VehicleExpense ||
// mongoose.model('VehicleExpense', VehicleExpenseSchema);
