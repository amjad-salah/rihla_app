import mongoose from 'mongoose';

const destinationSchema = mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    city: {
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

destinationSchema.virtual('fromJours', {
  ref: 'Journey',
  localField: '_id',
  foreignField: 'departureCity',
});

destinationSchema.virtual('toJours', {
  ref: 'Journey',
  localField: '_id',
  foreignField: 'arrivalCity',
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
