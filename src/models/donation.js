const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  currency: {
    type: String,
    required: 'TRY',
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
  isAnonymous: {
    type: Boolean,
    default: false,
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

// transactionId: A field to store the transaction ID associated with the donation. This might be provided by the payment processor or gateway.
// donationStatus: A field to track the status of the donation. It uses an enumeration to limit the values to 'pending', 'completed', or 'failed'. The default status is 'pending', assuming that the donation is pending until it is processed.
