import mongoose from 'mongoose';

const journeyIncomeSchema = mongoose.Schema(
  {
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
    },
    reservation: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: true,
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

const JourneyIncome = mongoose.model('JourneyIncome', journeyIncomeSchema);

export default JourneyIncome;
// mongoose.models.VehicleExpense ||
// mongoose.model('VehicleExpense', VehicleExpenseSchema);
