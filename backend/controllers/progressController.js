const { Progress, Member } = require('../models');

// @desc    Get member progress history
// @route   GET /api/progress/member/:memberId
exports.getProgressHistory = async (req, res) => {
  try {
    let memberId = req.params.memberId;
    if (memberId === 'my') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      memberId = member.id;
    }

    const history = await Progress.findAll({
      where: { memberId },
      order: [['date', 'ASC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add progress measurement record
// @route   POST /api/progress
exports.addProgressRecord = async (req, res) => {
  try {
    const { memberId, weightKg, bodyFatPercentage, chestCm, waistCm, armCm, legCm, personalRecords, notes } = req.body;

    let targetMemberId = memberId;
    if (!targetMemberId && req.user.role === 'Member') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (member) targetMemberId = member.id;
    }

    if (!targetMemberId) return res.status(400).json({ message: 'Member ID is required' });

    // Calculate BMI if height is estimated (assume average height 1.75m or metric default)
    const heightM = 1.75;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    const record = await Progress.create({
      memberId: targetMemberId,
      recordedBy: req.user.id,
      date: req.body.date || new Date(),
      weightKg,
      bodyFatPercentage: bodyFatPercentage || 0,
      bmi,
      chestCm: chestCm || 0,
      waistCm: waistCm || 0,
      armCm: armCm || 0,
      legCm: legCm || 0,
      personalRecords: personalRecords || '',
      notes: notes || ''
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
