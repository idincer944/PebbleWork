const mongoose = require('mongoose');
const slugify = require('slugify');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  password_hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  registered_at: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
  },
  created_events: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  joined_events: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
});

userSchema.pre('validate', function (next) {
  // slugify username
  this.username = slugify(
    this.username.trim().replace(/[^a-zA-Z0-9 .]/g, '.'),
    {
      replacement: '.',
      lower: 'true',
      strict: 'true',
    }
  );
  next();
});

module.exports = mongoose.model('User', userSchema);
