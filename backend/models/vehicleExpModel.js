import mongoose from 'mongoose';

const vehicleExpenseSchema = mongoose.Schema(
  {
    expType: {
      type: String,
      required: true,
      enum: [
        'صيانة',
        'ترخيص',
        'تأمين',
        'وقود',
        'أخرى',
        'Maintenance',
        'License',
        'Insurance',
        'Fuel',
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
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
  },
  {
    timestamps: true,
  }
);

const VehicleExpense = mongoose.model('VehicleExpense', vehicleExpenseSchema);

export default VehicleExpense;
