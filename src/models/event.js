const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  category: {
    type: String,
    enum: [
      'charity',
      'education',
      'environment',
      'health',
      'animals',
      'community',
      'other',
    ],
    required: true,
  },

  maxParticipants: {
    type: Number,
    default: 0,
  },
  registrationDeadline: {
    type: Date,
    default() {
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
      return new Date(this.time.getTime() - oneDay);
    },
  },
  eventWebsite: {
    type: String,
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
});

module.exports = mongoose.model('Event', eventSchema);
