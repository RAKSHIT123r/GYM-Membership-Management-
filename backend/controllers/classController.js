const { GymClass, Booking, Waitlist, Member, Notification, Trainer, Branch, User } = require('../models');

// @desc    Get all classes with filter
// @route   GET /api/classes
exports.getAllClasses = async (req, res) => {
  try {
    const { branchId, category, trainerId, date } = req.query;
    let filter = {};

    if (branchId) filter.branchId = branchId;
    if (category) filter.category = category;
    if (trainerId) filter.trainerId = trainerId;
    if (date) filter.date = date;

    const classes = await GymClass.findAll({
      where: filter,
      include: [
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'profileImage'] }] },
        { model: Branch, as: 'branch' }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

    let memberId = null;
    if (req.user && req.user.role === 'Member') {
      const member = await Member.findOne({ where: { userId: req.user.id } });
      if (member) memberId = member.id;
    }

    const responseClasses = await Promise.all(
      classes.map(async (c) => {
        const doc = c.toJSON();
        if (memberId) {
          const userBooking = await Booking.findOne({ where: { memberId, classId: c.id, status: 'Booked' } });
          const userWaitlist = await Waitlist.findOne({ where: { memberId, classId: c.id, status: 'Waiting' } });

          doc.userStatus = userBooking ? 'Booked' : userWaitlist ? `Waitlisted (#${userWaitlist.position})` : 'Available';
          doc.bookingId = userBooking ? userBooking.id : null;
          doc.waitlistId = userWaitlist ? userWaitlist.id : null;
        } else {
          doc.userStatus = 'Available';
        }
        return doc;
      })
    );

    res.json(responseClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new class (Admin/Trainer)
// @route   POST /api/classes
exports.createClass = async (req, res) => {
  try {
    const { name, category, trainerId, branchId, date, startTime, endTime, durationMinutes, capacity, description, locationRoom } = req.body;

    const gymClass = await GymClass.create({
      name,
      category,
      trainerId,
      branchId,
      date,
      startTime,
      endTime,
      durationMinutes: durationMinutes || 60,
      capacity: capacity || 20,
      description: description || '',
      locationRoom: locationRoom || 'Studio A'
    });

    const populated = await GymClass.findByPk(gymClass.id, {
      include: [
        { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
        { model: Branch, as: 'branch' }
      ]
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a class or join waitlist
// @route   POST /api/classes/:id/book
exports.bookClass = async (req, res) => {
  try {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ message: 'Member profile not found' });

    if (member.membershipStatus !== 'Active' && member.membershipStatus !== 'Expiring Soon') {
      return res.status(403).json({ message: 'Active membership required to book classes. Please renew your plan.' });
    }

    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });

    // Check existing active booking
    const existingBooking = await Booking.findOne({ where: { memberId: member.id, classId: gymClass.id, status: 'Booked' } });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    // Check capacity
    if (gymClass.bookedSeats < gymClass.capacity) {
      gymClass.bookedSeats += 1;
      await gymClass.save();

      const booking = await Booking.create({
        memberId: member.id,
        classId: gymClass.id,
        status: 'Booked'
      });

      await Notification.create({
        userId: req.user.id,
        title: 'Class Booking Confirmed 🎉',
        message: `Your booking for ${gymClass.name} on ${gymClass.date} at ${gymClass.startTime} is confirmed!`,
        type: 'Class'
      });

      return res.status(201).json({
        message: 'Class booked successfully!',
        type: 'Booking',
        booking
      });
    } else {
      // Capacity is full -> Join Waitlist
      const existingWaitlist = await Waitlist.findOne({ where: { memberId: member.id, classId: gymClass.id, status: 'Waiting' } });
      if (existingWaitlist) {
        return res.status(400).json({ message: `You are already on the waitlist at position #${existingWaitlist.position}` });
      }

      const currentWaitingCount = await Waitlist.count({ where: { classId: gymClass.id, status: 'Waiting' } });
      const newPosition = currentWaitingCount + 1;

      const waitlistEntry = await Waitlist.create({
        memberId: member.id,
        classId: gymClass.id,
        position: newPosition,
        status: 'Waiting'
      });

      await Notification.create({
        userId: req.user.id,
        title: 'Added to Waitlist ⏳',
        message: `Class "${gymClass.name}" is full. You are at waitlist position #${newPosition}. We will notify you if a spot opens!`,
        type: 'Waitlist'
      });

      return res.status(201).json({
        message: `Class is full. Added to waitlist at position #${newPosition}`,
        type: 'Waitlist',
        position: newPosition,
        waitlist: waitlistEntry
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking & trigger automatic waitlist promotion
// @route   POST /api/classes/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member && req.user.role !== 'Admin') return res.status(404).json({ message: 'Member profile not found' });

    const gymClass = await GymClass.findByPk(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });

    const targetMemberId = member ? member.id : req.body.memberId;

    // Check if user is booked or on waitlist
    const booking = await Booking.findOne({ where: { memberId: targetMemberId, classId: gymClass.id, status: 'Booked' } });
    const waitlist = await Waitlist.findOne({ where: { memberId: targetMemberId, classId: gymClass.id, status: 'Waiting' } });

    if (waitlist) {
      waitlist.status = 'Cancelled';
      await waitlist.save();
      return res.json({ message: 'Removed from waitlist successfully' });
    }

    if (!booking) {
      return res.status(400).json({ message: 'No active booking found for this class' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    gymClass.bookedSeats = Math.max(0, gymClass.bookedSeats - 1);
    await gymClass.save();

    // AUTOMATIC WAITLIST PROMOTION LOGIC
    const nextWaitlistMember = await Waitlist.findOne({
      where: { classId: gymClass.id, status: 'Waiting' },
      order: [['position', 'ASC']]
    });

    let promotedInfo = null;
    if (nextWaitlistMember) {
      nextWaitlistMember.status = 'Promoted';
      await nextWaitlistMember.save();

      // Create new booking for waitlisted member
      await Booking.create({
        memberId: nextWaitlistMember.memberId,
        classId: gymClass.id,
        status: 'Booked'
      });

      gymClass.bookedSeats += 1;
      await gymClass.save();

      const promotedMember = await Member.findByPk(nextWaitlistMember.memberId, {
        include: [{ model: User, as: 'user' }]
      });
      if (promotedMember && promotedMember.user) {
        await Notification.create({
          userId: promotedMember.user.id,
          title: 'Waitlist Promotion Success! 🎊',
          message: `A spot opened up in ${gymClass.name} on ${gymClass.date}! You have been automatically booked into the class.`,
          type: 'Waitlist'
        });
        promotedInfo = promotedMember.user.name;
      }
    }

    res.json({
      message: 'Booking cancelled successfully.',
      promotedMember: promotedInfo ? `Promoted waitlisted member ${promotedInfo} to class!` : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete class (Admin)
// @route   DELETE /api/classes/:id
exports.deleteClass = async (req, res) => {
  try {
    await GymClass.destroy({ where: { id: req.params.id } });
    await Booking.destroy({ where: { classId: req.params.id } });
    await Waitlist.destroy({ where: { classId: req.params.id } });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
