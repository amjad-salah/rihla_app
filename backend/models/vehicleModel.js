import mongoose from 'mongoose';
import Counter from './counterModel.js';

const vehicleSchema = mongoose.Schema(
  {
    vehMake: {
      type: String,
      required: true,
    },
    vehModel: {
      type: String,
      required: true,
    },
    vehYear: {
      type: String,
      required: true,
    },
    registerNumber: {
      type: String,
      required: true,
    },
    vehType: {
      type: String,
      required: true,
      enum: ['باص', 'ميني باص', 'شاحنة'],
    },
    capacity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['متوفر', 'في الطريق', 'في الصيانة'],
    },
    vehCode: {
      type: Number,
    },
    nextMaintenanceDate: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

vehicleSchema.virtual('expenses', {
  ref: 'VehicleExpense',
  localField: '_id',
  foreignField: 'vehicle',
});

vehicleSchema.virtual('journeys', {
  ref: 'Journey',
  localField: '_id',
  foreignField: 'vehicle',
});

vehicleSchema.pre('save', async function () {
  if (!this.isNew) return;
  const code = await Counter.increment('vehicle');
  this.vehCode = code;
  return;
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
