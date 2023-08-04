const mongoose = require('mongoose');
const slugify = require('slugify');

const userSchema = mongoose.Schema(
  {
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
    is_admin: {
      type: Boolean,
      default: false,
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
  },
  {
    virtuals: {
      // Create a virtual property `fullName` with a getter and setter
      fullName: {
        get() {
          return `${this.firstname} ${this.lastname}`;
        },
        set(v) {
          // `v` is the value being set, so use the value to set
          // `firstName` and `lastName`.
          const firstname = v.substring(0, v.indexOf(' '));
          const lastname = v.substring(v.indexOf(' ') + 1);
          this.set({ firstname, lastname });
        },
      },
    },
  }
);

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

userSchema.set('toJSON', {
  virtuals: true,
  getters: true,
  setters: true,
  _id: false,
});

module.exports = mongoose.model('User', userSchema);
