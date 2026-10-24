const User = require('../models/User');

// Get list of all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialization profilePicture bio yearsOfExperience');
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Assign a doctor to the current patient
exports.assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    user.assignedDoctor = doctorId;
    await user.save();

    // Return updated user
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('assignedDoctor', 'name specialization profilePicture');

    res.json(updatedUser);
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: error.message });
  }
};
