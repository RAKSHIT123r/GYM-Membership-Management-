const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Branch = require('../models/Branch');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'apexfit_jwt_secret_key_2026_super_secure!', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, branchId, specialization, fitnessGoal } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Member',
      phone: phone || ''
    });

    let defaultBranch = branchId;
    if (!defaultBranch) {
      const b = await Branch.findOne();
      if (b) defaultBranch = b._id;
    }

    if (user.role === 'Member') {
      const qrToken = `APEX-${user._id.toString().slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await Member.create({
        userId: user._id,
        branchId: defaultBranch,
        fitnessGoal: fitnessGoal || 'General Fitness',
        qrCodeToken: qrToken
      });
    } else if (user.role === 'Trainer') {
      await Trainer.create({
        userId: user._id,
        branchId: defaultBranch,
        specialization: specialization || 'Personal Fitness & Conditioning'
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // Fetch extra role details
      let roleDetails = null;
      if (user.role === 'Member') {
        roleDetails = await Member.findOne({ userId: user._id })
          .populate('membershipPlanId')
          .populate('branchId')
          .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email phone profileImage' } });
      } else if (user.role === 'Trainer') {
        roleDetails = await Trainer.findOne({ userId: user._id }).populate('branchId');
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        roleDetails,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let roleDetails = null;
    if (user.role === 'Member') {
      roleDetails = await Member.findOne({ userId: user._id })
        .populate('membershipPlanId')
        .populate('branchId')
        .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name email phone profileImage' } });
    } else if (user.role === 'Trainer') {
      roleDetails = await Trainer.findOne({ userId: user._id }).populate('branchId');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      roleDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins

    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Password reset link simulated. Check instructions below.',
      resetToken,
      resetUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
