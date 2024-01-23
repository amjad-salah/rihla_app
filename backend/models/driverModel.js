import mongoose from 'mongoose';

const driverSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseExpDate: {
      type: Date,
      required: true,
    },
    contactNumber: {
      type: String,
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

driverSchema.virtual('journeys', {
  ref: 'Journey',
  localField: '_id',
  foreignField: 'driver',
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
