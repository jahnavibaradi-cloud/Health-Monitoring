const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  // Doctor-specific profile fields
  specialization: { type: String },
  bio: { type: String },
  phone: { type: String },
  licenseNumber: { type: String },
  yearsOfExperience: { type: Number },
  profilePicture: { type: String }, // Base64 encoded image
  // Patient-specific fields
  age: { type: Number },
  weight: { type: Number },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
