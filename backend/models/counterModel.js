import mongoose from 'mongoose';

const counterSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 100,
  },
});

counterSchema.static('increment', async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 10 } },
    { new: true, upsert: true }
  );
  return count.seq;
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
