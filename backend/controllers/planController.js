const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all membership plans
// @route   GET /api/plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new plan (Admin)
// @route   POST /api/plans
exports.createPlan = async (req, res) => {
  try {
    const { name, durationDays, price, description, features, accessLevel, classAccess, branchAccess, autoRenewEligible } = req.body;

    const plan = await MembershipPlan.create({
      name,
      durationDays,
      price,
      description,
      features: features || [],
      accessLevel: accessLevel || 'Standard',
      classAccess: classAccess !== undefined ? classAccess : true,
      branchAccess: branchAccess || 'Single Branch',
      autoRenewEligible: autoRenewEligible !== undefined ? autoRenewEligible : true
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
exports.updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete plan
// @route   DELETE /api/plans/:id
exports.deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
