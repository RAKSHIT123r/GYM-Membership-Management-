const { Attendance, Member, User, MembershipPlan, Branch } = require('../models');
const QRCode = require('qrcode');

// @desc    Get QR Code payload/image for logged-in member
// @route   GET /api/attendance/member-qr
exports.getMemberQR = async (req, res) => {
  try {
    const member = await Member.findOne({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: MembershipPlan, as: 'membershipPlan' }
      ]
    });

    if (!member) return res.status(404).json({ message: 'Member record not found' });

    if (!member.qrCodeToken) {
      member.qrCodeToken = `APEX-${member.id.toString().slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await member.save();
    }

    const qrDataUrl = await QRCode.toDataURL(member.qrCodeToken);

    res.json({
      qrToken: member.qrCodeToken,
      qrDataUrl,
      memberName: member.user ? member.user.name : '',
      status: member.membershipStatus,
      planName: member.membershipPlan ? member.membershipPlan.name : 'No Plan',
      expiryDate: member.endDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify QR Code / Check-in member at reception
// @route   POST /api/attendance/check-in
exports.checkInMember = async (req, res) => {
  try {
    const { qrToken, memberId, branchId } = req.body;

    let member = null;
    if (qrToken) {
      member = await Member.findOne({
        where: { qrCodeToken: qrToken },
        include: [
          { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage'] },
          { model: MembershipPlan, as: 'membershipPlan' },
          { model: Branch, as: 'branch' }
        ]
      });
    } else if (memberId) {
      member = await Member.findByPk(memberId, {
        include: [
          { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'profileImage'] },
          { model: MembershipPlan, as: 'membershipPlan' },
          { model: Branch, as: 'branch' }
        ]
      });
    }

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR Pass or Member ID not found.'
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetBranch = branchId || (member.branch ? member.branch.id : member.branchId);

    // Membership verification check
    if (member.membershipStatus === 'Expired' || member.membershipStatus === 'Cancelled' || member.membershipStatus === 'None') {
      await Attendance.create({
        memberId: member.id,
        branchId: targetBranch || 1,
        date: todayStr,
        status: 'Denied',
        denialReason: `Membership ${member.membershipStatus}. Renewal required.`
      });

      return res.status(403).json({
        success: false,
        status: 'Denied',
        message: `⛔ ACCESS DENIED: Member "${member.user ? member.user.name : ''}" has an ${member.membershipStatus.toUpperCase()} membership.`,
        member: {
          name: member.user ? member.user.name : '',
          status: member.membershipStatus,
          plan: member.membershipPlan ? member.membershipPlan.name : 'None',
          endDate: member.endDate
        }
      });
    }

    // Check if already checked in today
    const existingLog = await Attendance.findOne({ where: { memberId: member.id, date: todayStr, status: 'Granted' } });

    const attendanceLog = await Attendance.create({
      memberId: member.id,
      branchId: targetBranch || 1,
      date: todayStr,
      status: 'Granted',
      verifiedBy: req.user ? req.user.name : 'Reception Scanner'
    });

    res.status(200).json({
      success: true,
      status: 'Granted',
      message: `✅ ACCESS GRANTED: Welcome to ApexFit, ${member.user ? member.user.name : ''}!`,
      alreadyCheckedInToday: !!existingLog,
      member: {
        id: member.id,
        _id: member.id,
        name: member.user ? member.user.name : '',
        email: member.user ? member.user.email : '',
        profileImage: member.user ? member.user.profileImage : '',
        status: member.membershipStatus,
        plan: member.membershipPlan ? member.membershipPlan.name : 'Active Plan',
        endDate: member.endDate
      },
      attendanceLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance logs (Admin/Trainer)
// @route   GET /api/attendance
exports.getAttendanceLogs = async (req, res) => {
  try {
    const { branchId, date, memberId } = req.query;
    let filter = {};

    if (branchId) filter.branchId = branchId;
    if (date) filter.date = date;
    if (memberId) filter.memberId = memberId;

    const logs = await Attendance.findAll({
      where: filter,
      include: [
        { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'profileImage'] }] },
        { model: Branch, as: 'branch' }
      ],
      order: [['checkInTime', 'DESC']],
      limit: 100
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
