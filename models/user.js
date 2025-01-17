const { Schema, model } = require('mongoose');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: emailRegexp,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: {
    type: String,
    default: '',
  },
  avatarURL: {
    type: String,
  },
});

const User = model('user', userSchema);

module.exports = {
  User,
  emailRegexp,
};
