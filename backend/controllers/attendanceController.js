const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const QRCode = require('qrcode');

// @desc    Get QR Code payload/image for logged-in member
// @route   GET /api/attendance/member-qr
exports.getMemberQR = async (req, res) => {
  try {
    const member = await Member.findOne({ userId: req.user._id })
      .populate('userId', 'name email')
      .populate('membershipPlanId');

    if (!member) return res.status(404).json({ message: 'Member record not found' });

    if (!member.qrCodeToken) {
      member.qrCodeToken = `APEX-${member._id.toString().slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await member.save();
    }

    const qrDataUrl = await QRCode.toDataURL(member.qrCodeToken);

    res.json({
      qrToken: member.qrCodeToken,
      qrDataUrl,
      memberName: member.userId.name,
      status: member.membershipStatus,
      planName: member.membershipPlanId ? member.membershipPlanId.name : 'No Plan',
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
      member = await Member.findOne({ qrCodeToken: qrToken })
        .populate('userId', 'name email phone profileImage')
        .populate('membershipPlanId')
        .populate('branchId');
    } else if (memberId) {
      member = await Member.findById(memberId)
        .populate('userId', 'name email phone profileImage')
        .populate('membershipPlanId')
        .populate('branchId');
    }

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR Pass or Member ID not found.'
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetBranch = branchId || member.branchId._id || member.branchId;

    // Membership verification check
    if (member.membershipStatus === 'Expired' || member.membershipStatus === 'Cancelled' || member.membershipStatus === 'None') {
      await Attendance.create({
        memberId: member._id,
        branchId: targetBranch,
        date: todayStr,
        status: 'Denied',
        denialReason: `Membership ${member.membershipStatus}. Renewal required.`
      });

      return res.status(403).json({
        success: false,
        status: 'Denied',
        message: `⛔ ACCESS DENIED: Member "${member.userId.name}" has an ${member.membershipStatus.toUpperCase()} membership.`,
        member: {
          name: member.userId.name,
          status: member.membershipStatus,
          plan: member.membershipPlanId ? member.membershipPlanId.name : 'None',
          endDate: member.endDate
        }
      });
    }

    // Check if already checked in today
    const existingLog = await Attendance.findOne({ memberId: member._id, date: todayStr, status: 'Granted' });

    const attendanceLog = await Attendance.create({
      memberId: member._id,
      branchId: targetBranch,
      date: todayStr,
      status: 'Granted',
      verifiedBy: req.user ? req.user.name : 'Reception Scanner'
    });

    res.status(200).json({
      success: true,
      status: 'Granted',
      message: `✅ ACCESS GRANTED: Welcome to ApexFit, ${member.userId.name}!`,
      alreadyCheckedInToday: !!existingLog,
      member: {
        id: member._id,
        name: member.userId.name,
        email: member.userId.email,
        profileImage: member.userId.profileImage,
        status: member.membershipStatus,
        plan: member.membershipPlanId ? member.membershipPlanId.name : 'Active Plan',
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

    const logs = await Attendance.find(filter)
      .populate({ path: 'memberId', populate: { path: 'userId', select: 'name email profileImage' } })
      .populate('branchId')
      .sort({ checkInTime: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
