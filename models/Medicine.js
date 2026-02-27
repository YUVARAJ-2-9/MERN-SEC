const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // User model-oda _id reference
      ref: 'User',                           // User collection-oda link
      required: true,
    },

    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true, // "  Paracetamol  " → "Paracetamol"
    },

    dosage: {
      type: String,
      required: [true, 'Dosage is required'], // "500mg", "1 tablet"
    },

    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'twice daily', 'as needed'], // Only these values allowed
      default: 'daily',
    },

    times: [
      {
        type: String, // ["08:00", "20:00"] morning and night
      },
    ],

    startDate: {
      type: Date,
      default: Date.now, // Today by default
    },

    endDate: {
      type: Date, // Optional — course end date
    },

    notes: {
      type: String,
      default: '', // "Take after food" etc
    },

    isActive: {
      type: Boolean,
      default: true, // false = medicine stopped
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Medicine', medicineSchema);