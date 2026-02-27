const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // Extra spaces remove pannudu
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,   // Same email twice register agadu
      lowercase: true, // Always lowercase store agum
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6, // Minimum 6 characters
    },
  },
  {
    timestamps: true, // Auto adds createdAt, updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);