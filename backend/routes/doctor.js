const express = require('express');
const router  = express.Router();
const Doctor  = require('../models/Doctor');

// GET all doctors — used by PatientDashboard
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET single doctor by ID — used by BookAppointment
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST add slots — used by DoctorDashboard "Manage Slots" tab
router.post('/:id/slots', async (req, res) => {
  try {
    const { slots } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const newSlots = slots
      .filter(s => s.date && s.time)   // ✅ ignore empty slots
      .map(s => ({ date: s.date, time: s.time, isBooked: false }));

    doctor.availableSlots.push(...newSlots);
    await doctor.save();

    res.json({ message: 'Slots added successfully', availableSlots: doctor.availableSlots });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;