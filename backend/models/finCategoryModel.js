import mongoose from 'mongoose';

const finCategorySchema = mongoose.Schema(
  {
    catType: {
      type: String,
      required: true,
      enum: ['expense', 'income'],
    },
    catName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

finCategorySchema.virtual('incomes', {
  ref: 'Income',
  localField: '_id',
  foreignField: 'category',
});

finCategorySchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'category',
});

const FinCategory = mongoose.model('FinCategory', finCategorySchema);

export default FinCategory;
