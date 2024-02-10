import mongoose from 'mongoose';
import Counter from './counterModel.js';

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
    txNumber: {
      type: String,
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

transactionSchema.pre('save', async function () {
  if (!this.isNew) return;
  const code = await Counter.increment('transaction');
  this.txNumber = code;
  return;
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
