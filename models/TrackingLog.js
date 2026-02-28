
const mongoose = require('mongoose');

const trackingLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: String, // "08:00"
      required: true,
    },
    date: {
      type: String, // "2024-01-15"
      required: true,
    },
    status: {
      type: String,
      enum: ['taken', 'missed', 'pending'],
      default: 'pending',
    },
    takenAt: {
      type: Date, // Actual time when taken
    },
  },
  { timestamps: true }
);

// Same medicine same time same date — once matrum!
trackingLogSchema.index(
  { userId: 1, medicineId: 1, scheduledTime: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model('TrackingLog', trackingLogSchema);