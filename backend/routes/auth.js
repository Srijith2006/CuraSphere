const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');

const sign = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// ── Register Patient ─────────────────────────────────────────
router.post('/register/patient', async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    if (await Patient.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const patient = await Patient.create({ name, email, password: hashed, phone, age });

    res.json({
      token: sign(patient._id, 'patient'),
      _id:   patient._id,
      name:  patient.name,
      email: patient.email,
      role:  'patient',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Register Doctor ──────────────────────────────────────────
router.post('/register/doctor', async (req, res) => {
  try {
    // ✅ RECTIFIED: Added 'experience' to the destructuring
    const { name, email, password, specialty, department, experience } = req.body;
    
    if (await Doctor.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    
    // ✅ RECTIFIED: Included 'experience' in the database creation
    const doctor = await Doctor.create({ 
      name, 
      email, 
      password: hashed, 
      specialty, 
      department, 
      experience 
    });

    res.json({
      token: sign(doctor._id, 'doctor'),
      _id:   doctor._id,
      name:  doctor.name,
      email: doctor.email,
      role:  'doctor',
      specialty:  doctor.specialty,
      department: doctor.department,
      experience: doctor.experience // ✅ Send it back to frontend
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Login (both roles) ───────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === 'doctor' ? Doctor : Patient;
    const user  = await Model.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: sign(user._id, role),
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role,
      // ✅ RECTIFIED: Pull all doctor-specific fields from the user document
      specialty:  user.specialty  || null,
      department: user.department || null,
      experience: user.experience || null, // 👈 THIS WAS THE MISSING LINK
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;