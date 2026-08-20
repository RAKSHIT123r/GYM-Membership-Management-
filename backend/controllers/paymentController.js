const { Payment, Member, MembershipPlan, Membership, Notification, User } = require('../models');

// @desc    Process payment for plan purchase or renewal
// @route   POST /api/payments/create
exports.processPayment = async (req, res) => {
  try {
    const { planId, paymentMethod, autoRenew } = req.body;

    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: 'Member profile not found' });

    const plan = await MembershipPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ message: 'Membership plan not found' });

    const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const endDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const payment = await Payment.create({
      memberId: member.id,
      amount: plan.price,
      transactionId,
      paymentMethod: paymentMethod || 'Razorpay',
      status: 'Success',
      paymentType: member.membershipStatus === 'Active' ? 'Membership Renewal' : 'Membership Purchase',
      associatedId: plan.id.toString(),
      receiptUrl: `/invoices/${transactionId}.pdf`
    });

    // Update Member record
    member.membershipPlanId = plan.id;
    member.membershipStatus = 'Active';
    member.startDate = now;
    member.endDate = endDate;
    member.autoRenew = autoRenew !== undefined ? autoRenew : true;
    await member.save();

    // Create Membership log entry
    await Membership.create({
      memberId: member.id,
      planId: plan.id,
      startDate: now,
      endDate,
      status: 'Active',
      autoRenew: member.autoRenew,
      pricePaid: plan.price,
      paymentId: payment.id
    });

    // Send Notification
    await Notification.create({
      userId: req.user.id,
      title: 'Payment Successful! 💳',
      message: `Your payment of ₹${plan.price.toLocaleString()} for ${plan.name} was successful. Membership active until ${endDate.toLocaleDateString()}.`,
      type: 'Membership'
    });

    res.status(201).json({
      success: true,
      message: 'Payment completed successfully!',
      transactionId,
      amount: plan.price,
      planName: plan.name,
      validUntil: endDate,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Member') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (!member) return res.status(404).json({ message: 'Member profile not found' });
      filter.memberId = member.id;
    }

    const payments = await Payment.findAll({
      where: filter,
      include: [
        { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate prorated refund preview
// @route   POST /api/payments/refund-preview
exports.calculateRefundPreview = async (req, res) => {
  try {
    const { memberId } = req.body;
    let targetMemberId = memberId;

    if (!targetMemberId && req.user.role === 'Member') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (member) targetMemberId = member.id;
    }

    const member = await Member.findByPk(targetMemberId, {
      include: [{ model: MembershipPlan, as: 'membershipPlan' }]
    });
    if (!member || !member.membershipPlan) {
      return res.status(400).json({ message: 'No active plan associated with this member' });
    }

    const plan = member.membershipPlan;
    const now = new Date();
    const endDate = new Date(member.endDate);

    const diffTime = endDate.getTime() - now.getTime();
    const unusedDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalDays = plan.durationDays || 30;
    const dailyRate = plan.price / totalDays;
    const calculatedRefund = Math.max(0, Math.round(unusedDays * dailyRate));

    res.json({
      planName: plan.name,
      totalPrice: plan.price,
      totalDurationDays: totalDays,
      dailyRate: parseFloat(dailyRate.toFixed(2)),
      startDate: member.startDate,
      endDate: member.endDate,
      unusedDays,
      calculatedRefund
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process cancellation & prorated refund (Admin or Member request)
// @route   POST /api/payments/process-refund
exports.processRefund = async (req, res) => {
  try {
    const { memberId, reason } = req.body;

    let targetMemberId = memberId;
    if (!targetMemberId && req.user.role === 'Member') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (member) targetMemberId = member.id;
    }

    const member = await Member.findByPk(targetMemberId, {
      include: [
        { model: MembershipPlan, as: 'membershipPlan' },
        { model: User, as: 'user' }
      ]
    });
    if (!member || !member.membershipPlan) {
      return res.status(400).json({ message: 'Active membership required to initiate refund' });
    }

    const plan = member.membershipPlan;
    const now = new Date();
    const endDate = new Date(member.endDate);

    const diffTime = endDate.getTime() - now.getTime();
    const unusedDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalDays = plan.durationDays || 30;
    const dailyRate = plan.price / totalDays;
    const refundAmount = Math.max(0, Math.round(unusedDays * dailyRate));

    const refundTxnId = `RFD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const refundLog = await Payment.create({
      memberId: member.id,
      amount: refundAmount,
      transactionId: refundTxnId,
      paymentMethod: 'Razorpay Refund',
      status: 'Refunded',
      paymentType: 'Refund',
      associatedId: plan.id.toString(),
      receiptUrl: `/invoices/${refundTxnId}.pdf`
    });

    // Update member status
    member.membershipStatus = 'Cancelled';
    member.autoRenew = false;
    await member.save();

    // Update active membership log
    const activeMembership = await Membership.findOne({ where: { memberId: member.id, status: 'Active' } });
    if (activeMembership) {
      activeMembership.status = 'Cancelled';
      activeMembership.refundedAmount = refundAmount;
      activeMembership.cancellationDate = now;
      activeMembership.cancellationReason = reason || 'Early cancellation by member request';
      await activeMembership.save();
    }

    // Notification
    if (member.user) {
      await Notification.create({
        userId: member.user.id,
        title: 'Membership Cancelled & Refund Processed 💵',
        message: `Your membership was cancelled. A prorated refund of ₹${refundAmount.toLocaleString()} (${unusedDays} unused days) has been credited.`,
        type: 'Membership'
      });
    }

    res.json({
      success: true,
      message: `Prorated refund of ₹${refundAmount.toLocaleString()} successfully processed for ${unusedDays} unused days.`,
      refundAmount,
      unusedDays,
      transactionId: refundTxnId,
      refundLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
