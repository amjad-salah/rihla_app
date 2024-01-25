import mongoose from 'mongoose';

const incomeSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinCategory',
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model('Income', incomeSchema);

export default Income;
