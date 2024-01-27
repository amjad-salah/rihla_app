import mongoose from 'mongoose';

const journeyExpenseSchema = mongoose.Schema(
  {
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
    },
    expType: {
      type: String,
      required: true,
      enum: [
        'وقود',
        'صيانة',
        'طريق',
        'أخرى',
        'Fuel',
        'Maintenance',
        'Road',
        'Other',
      ],
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

const JourneyExpense = mongoose.model('JourneyExpense', journeyExpenseSchema);

export default JourneyExpense;
