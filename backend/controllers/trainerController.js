const { Trainer, User, Member, GymClass, Branch } = require('../models');

// @desc    Get all trainers
// @route   GET /api/trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const { branchId, search } = req.query;
    let filter = {};
    if (branchId) filter.branchId = branchId;

    let trainers = await Trainer.findAll({
      where: filter,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage', 'createdAt'] },
        { model: Branch, as: 'branch' }
      ]
    });

    if (search) {
      const q = search.toLowerCase();
      trainers = trainers.filter(
        (t) =>
          (t.user && t.user.name.toLowerCase().includes(q)) ||
          (t.specialization && t.specialization.toLowerCase().includes(q))
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
    const trainer = await Trainer.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Branch, as: 'branch' }
      ]
    });

    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const assignedMembers = await Member.findAll({
      where: { trainerId: trainer.id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage'] }]
    });

    const classes = await GymClass.findAll({
      where: { trainerId: trainer.id },
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

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

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

    const user = await User.create({
      name,
      email,
      password: password || 'Trainer@123',
      role: 'Trainer',
      phone: phone || ''
    });

    const trainer = await Trainer.create({
      userId: user.id,
      branchId: branchId || null,
      specialization: specialization || 'Personal Fitness & Conditioning',
      experienceYears: experienceYears || 3,
      certifications: certifications || ['Certified Personal Trainer (CPT)'],
      bio: bio || ''
    });

    const populated = await Trainer.findByPk(trainer.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Branch, as: 'branch' }
      ]
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update trainer profile
// @route   PUT /api/trainers/:id
exports.updateTrainer = async (req, res) => {
  try {
    const { specialization, experienceYears, certifications, bio, branchId, name, phone } = req.body;

    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    if (specialization) trainer.specialization = specialization;
    if (experienceYears) trainer.experienceYears = experienceYears;
    if (certifications) trainer.certifications = certifications;
    if (bio !== undefined) trainer.bio = bio;
    if (branchId) trainer.branchId = branchId;

    await trainer.save();

    if (name || phone) {
      const user = await User.findByPk(trainer.userId);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        await user.save();
      }
    }

    const updated = await Trainer.findByPk(trainer.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Branch, as: 'branch' }
      ]
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const userId = trainer.userId;
    await trainer.destroy();
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
