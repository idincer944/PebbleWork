const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  commitedAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
