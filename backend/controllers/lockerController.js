const { Locker, Member, User, Branch } = require('../models');

// @desc    Get lockers for branch
// @route   GET /api/lockers
exports.getLockers = async (req, res) => {
  try {
    const { branchId, status } = req.query;
    let filter = {};
    if (branchId) filter.branchId = branchId;
    if (status) filter.status = status;

    const lockers = await Locker.findAll({
      where: filter,
      include: [
        { model: Member, as: 'assignedMember', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }] },
        { model: Branch, as: 'branch' }
      ],
      order: [['lockerNumber', 'ASC']]
    });

    res.json(lockers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign locker to member (Admin)
// @route   POST /api/lockers/:id/assign
exports.assignLocker = async (req, res) => {
  try {
    const { memberId, notes } = req.body;
    const locker = await Locker.findByPk(req.params.id);
    if (!locker) return res.status(404).json({ message: 'Locker not found' });

    locker.status = 'Assigned';
    locker.assignedToMemberId = memberId;
    locker.assignedDate = new Date();
    if (notes) locker.notes = notes;

    await locker.save();

    const updated = await Locker.findByPk(locker.id, {
      include: [{ model: Member, as: 'assignedMember', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }]
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release locker (Admin)
// @route   POST /api/lockers/:id/release
exports.releaseLocker = async (req, res) => {
  try {
    const locker = await Locker.findByPk(req.params.id);
    if (!locker) return res.status(404).json({ message: 'Locker not found' });

    locker.status = 'Available';
    locker.assignedToMemberId = null;
    locker.assignedDate = null;

    await locker.save();
    res.json({ message: `Locker #${locker.lockerNumber} released successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new locker
// @route   POST /api/lockers
exports.createLocker = async (req, res) => {
  try {
    const { lockerNumber, branchId, status } = req.body;
    const locker = await Locker.create({
      lockerNumber,
      branchId,
      status: status || 'Available'
    });
    res.status(201).json(locker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
