const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['USD', 'TRY'],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  currency: {
    type: String,
    enum: ['USD', 'TRY'],
    required: true,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Donation', donationSchema);

// donationStatus: A field to track the status of the donation. It uses an enumeration to limit the values to 'pending', 'completed', or 'failed'. The default status is 'pending', assuming that the donation is pending until it is processed.
