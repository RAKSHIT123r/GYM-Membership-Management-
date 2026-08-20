const { Member, User, Membership, MembershipPlan, Branch, Trainer } = require('../models');

// @desc    Get all members (Admin / Trainer)
// @route   GET /api/members
exports.getAllMembers = async (req, res) => {
  try {
    const { branchId, status, search, trainerId } = req.query;
    let filter = {};

    if (branchId) filter.branchId = branchId;
    if (status) filter.membershipStatus = status;
    if (trainerId) filter.trainerId = trainerId;

    let members = await Member.findAll({
      where: filter,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage', 'createdAt'] },
        { model: MembershipPlan, as: 'membershipPlan' },
        { model: Branch, as: 'branch' },
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }
      ]
    });

    if (search) {
      const query = search.toLowerCase();
      members = members.filter(
        (m) =>
          (m.user && m.user.name.toLowerCase().includes(query)) ||
          (m.user && m.user.email.toLowerCase().includes(query)) ||
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
    const member = await Member.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: MembershipPlan, as: 'membershipPlan' },
        { model: Branch, as: 'branch' },
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }] }
      ]
    });

    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Also get active membership history
    const memberships = await Membership.findAll({
      where: { memberId: member.id },
      include: [{ model: MembershipPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });

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

    const member = await Member.findByPk(req.params.id);
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

    const updatedMember = await Member.findByPk(member.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage'] },
        { model: MembershipPlan, as: 'membershipPlan' },
        { model: Branch, as: 'branch' },
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }
      ]
    });

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete member (Admin)
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const userId = member.userId;
    await member.destroy();
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
