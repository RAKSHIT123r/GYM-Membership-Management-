const { Branch } = require('../models');

// @desc    Get all active branches
// @route   GET /api/branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new branch (Admin)
// @route   POST /api/branches
exports.createBranch = async (req, res) => {
  try {
    const { name, address, phone, email, openingHours, capacity } = req.body;
    const branch = await Branch.create({
      name,
      address,
      phone,
      email,
      openingHours: openingHours || '5:00 AM - 11:00 PM',
      capacity: capacity || 250
    });
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    await branch.update(req.body);
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
