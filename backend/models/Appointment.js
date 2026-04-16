const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  patientName: { type: String, required: true },
  doctorName:  { type: String, required: true },
  department:  { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  reason:      { type: String, required: true },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);