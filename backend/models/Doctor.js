const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date:     { type: String, required: true },   // "2025-06-15"
  time:     { type: String, required: true },   // "10:00"
  isBooked: { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  specialty:      { type: String, required: true },
  department:     { type: String, required: true },
  qualification:  { type: String, default: '' },
  experience:     { type: Number, default: 0 },
  bio:            { type: String, default: '' },
  available:      { type: Boolean, default: true },
  availableSlots: { type: [slotSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);