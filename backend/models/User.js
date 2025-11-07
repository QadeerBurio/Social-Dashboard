const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // for password hashing

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true, // usernames should be unique
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // emails should also be unique
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'], // basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // basic strength check
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // skip if not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
