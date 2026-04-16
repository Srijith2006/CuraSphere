const router      = require('express').Router();
const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const protect     = require('../middleware/auth');

// ── Book appointment (patient) ───────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, department, date, timeSlot, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const slotIndex = doctor.availableSlots.findIndex(
      s => s.date === date && s.time === timeSlot && !s.isBooked
    );

    if (slotIndex === -1)
      return res.status(400).json({ message: 'Invalid or already booked slot' });

    doctor.availableSlots[slotIndex].isBooked = true;
    await doctor.save();

    const appt = await Appointment.create({
      patientId:   req.user.id,
      doctorId,
      patientName: req.body.patientName || req.user.name || 'Patient',
      doctorName:  doctor.name,
      department:  department || doctor.department,
      date,
      time:        timeSlot,
      reason,
      status:      'pending' // Default status
    });

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get patient's appointments ───────────────────────────────
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const appts = await Appointment
      .find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialty department experience') 
      .sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get doctor's appointments ────────────────────────────────
router.get('/doctor/:doctorId', protect, async (req, res) => {
  try {
    const appts = await Appointment
      .find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name age phone') 
      .sort({ date: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Update appointment status (Fixed for Dashboard Buttons) ──
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, doctorNotes } = req.body;

    // Convert to lowercase to match your model's enum
    const normalizedStatus = status?.toLowerCase();
    
    // Validate status
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !allowed.includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: normalizedStatus, 
        doctorNotes: doctorNotes // This saves the text from the "drops given" box
      },
      { new: true }
    ).populate('patientId', 'name age phone');

    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;