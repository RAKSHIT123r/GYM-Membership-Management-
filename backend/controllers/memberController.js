const Member = require('../models/Member');
const User = require('../models/User');
const Membership = require('../models/Membership');

// @desc    Get all members (Admin / Trainer)
// @route   GET /api/members
exports.getAllMembers = async (req, res) => {
  try {
    const { branchId, status, search, trainerId } = req.query;
    let filter = {};

    if (branchId) filter.branchId = branchId;
    if (status) filter.membershipStatus = status;
    if (trainerId) filter.trainerId = trainerId;

    let members = await Member.find(filter)
      .populate('userId', 'name email phone profileImage createdAt')
      .populate('membershipPlanId')
      .populate('branchId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email' } });

    if (search) {
      const query = search.toLowerCase();
      members = members.filter(
        (m) =>
          (m.userId && m.userId.name.toLowerCase().includes(query)) ||
          (m.userId && m.userId.email.toLowerCase().includes(query)) ||
          (m.qrCodeToken && m.qrCodeToken.toLowerCase().includes(query))
      );
    }

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member details by ID
// @route   GET /api/members/:id
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('userId', '-password')
      .populate('membershipPlanId')
      .populate('branchId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email phone' } });

    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Also get active membership history
    const memberships = await Membership.find({ memberId: member._id }).populate('planId').sort({ createdAt: -1 });

    res.json({ member, memberships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update member profile / assign trainer / update status
// @route   PUT /api/members/:id
exports.updateMember = async (req, res) => {
  try {
    const { trainerId, branchId, fitnessGoal, autoRenew, membershipStatus, emergencyContact, gender, dateOfBirth } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (trainerId !== undefined) member.trainerId = trainerId || null;
    if (branchId) member.branchId = branchId;
    if (fitnessGoal) member.fitnessGoal = fitnessGoal;
    if (autoRenew !== undefined) member.autoRenew = autoRenew;
    if (membershipStatus) member.membershipStatus = membershipStatus;
    if (emergencyContact) member.emergencyContact = emergencyContact;
    if (gender) member.gender = gender;
    if (dateOfBirth) member.dateOfBirth = dateOfBirth;

    await member.save();

    const updatedMember = await Member.findById(member._id)
      .populate('userId', 'name email phone profileImage')
      .populate('membershipPlanId')
      .populate('branchId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email' } });

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete member (Admin)
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await User.findByIdAndDelete(member.userId);
    await Member.findByIdAndDelete(req.params.id);

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
