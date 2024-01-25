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
      enum: ['وقود', 'صيانة', 'طريق', 'أخرى'],
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
