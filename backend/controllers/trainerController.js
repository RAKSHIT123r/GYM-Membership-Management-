const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Member = require('../models/Member');
const GymClass = require('../models/GymClass');

// @desc    Get all trainers
// @route   GET /api/trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const { branchId, search } = req.query;
    let filter = {};
    if (branchId) filter.branchId = branchId;

    let trainers = await Trainer.find(filter)
      .populate('userId', 'name email phone profileImage createdAt')
      .populate('branchId');

    if (search) {
      const q = search.toLowerCase();
      trainers = trainers.filter(
        (t) =>
          (t.userId && t.userId.name.toLowerCase().includes(q)) ||
          t.specialization.toLowerCase().includes(q)
      );
    }

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer details including assigned members & classes
// @route   GET /api/trainers/:id
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('userId', '-password')
      .populate('branchId');

    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const assignedMembers = await Member.find({ trainerId: trainer._id }).populate('userId', 'name email phone profileImage');
    const classes = await GymClass.find({ trainerId: trainer._id }).sort({ date: 1, startTime: 1 });

    res.json({ trainer, assignedMembers, classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create trainer (Admin)
// @route   POST /api/trainers
exports.createTrainer = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experienceYears, certifications, bio, branchId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

    const user = await User.create({
      name,
      email,
      password: password || 'Trainer@123',
      role: 'Trainer',
      phone: phone || ''
    });

    const trainer = await Trainer.create({
      userId: user._id,
      branchId,
      specialization,
      experienceYears: experienceYears || 3,
      certifications: certifications || ['Certified Personal Trainer (CPT)'],
      bio: bio || ''
    });

    const populated = await Trainer.findById(trainer._id).populate('userId', '-password').populate('branchId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update trainer profile
// @route   PUT /api/trainers/:id
exports.updateTrainer = async (req, res) => {
  try {
    const { specialization, experienceYears, certifications, bio, availability, branchId, name, phone } = req.body;

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    if (specialization) trainer.specialization = specialization;
    if (experienceYears) trainer.experienceYears = experienceYears;
    if (certifications) trainer.certifications = certifications;
    if (bio !== undefined) trainer.bio = bio;
    if (availability) trainer.availability = availability;
    if (branchId) trainer.branchId = branchId;

    await trainer.save();

    if (name || phone) {
      await User.findByIdAndUpdate(trainer.userId, { name, phone });
    }

    const updated = await Trainer.findById(trainer._id).populate('userId', '-password').populate('branchId');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    await User.findByIdAndDelete(trainer.userId);
    await Trainer.findByIdAndDelete(req.params.id);

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
