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
  registered_at: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
  },
  created_events: {
    type: Array,
  },
  joined_events: {
    type: Array,
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
