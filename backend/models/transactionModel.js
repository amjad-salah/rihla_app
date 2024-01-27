import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
  {
    txType: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
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

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
