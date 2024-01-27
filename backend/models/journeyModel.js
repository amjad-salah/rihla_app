import mongoose from 'mongoose';
import Counter from './counterModel.js';

const journeySchema = mongoose.Schema(
  {
    journeyType: {
      type: String,
      required: true,
      enum: ['ركاب', 'شحن', 'Paasenger', 'Shippng'],
    },
    departureCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    arrivalCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    departureTime: {
      type: Date,
      required: true,
    },
    journeyNumber: {
      type: Number,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

journeySchema.virtual('expenses', {
  ref: 'JourneyExpense',
  localField: '_id',
  foreignField: 'journey',
});

journeySchema.virtual('incomes', {
  ref: 'JourneyIncome',
  localField: '_id',
  foreignField: 'journey',
});

journeySchema.pre('save', async function () {
  if (!this.isNew) return;
  const newCode = await Counter.increment('journey');
  this.journeyNumber = newCode;
  return;
});

const Journey = mongoose.model('Journey', journeySchema);

export default Journey;
// mongoose.models.VehicleExpense ||
// mongoose.model('VehicleExpense', VehicleExpenseSchema);
