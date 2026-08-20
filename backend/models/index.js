const { sequelize } = require('../config/db');

const User = require('./User');
const Branch = require('./Branch');
const Trainer = require('./Trainer');
const Member = require('./Member');
const MembershipPlan = require('./MembershipPlan');
const Membership = require('./Membership');
const GymClass = require('./GymClass');
const Booking = require('./Booking');
const Waitlist = require('./Waitlist');
const Attendance = require('./Attendance');
const WorkoutPlan = require('./WorkoutPlan');
const NutritionPlan = require('./NutritionPlan');
const Progress = require('./Progress');
const Locker = require('./Locker');
const Notification = require('./Notification');
const Payment = require('./Payment');

// Associations

// User <-> Member
User.hasOne(Member, { foreignKey: 'userId', as: 'memberProfile', onDelete: 'CASCADE' });
Member.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

// User <-> Trainer
User.hasOne(Trainer, { foreignKey: 'userId', as: 'trainerProfile', onDelete: 'CASCADE' });
Trainer.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

// Branch <-> Trainer
Branch.hasMany(Trainer, { foreignKey: 'branchId', as: 'trainers' });
Trainer.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Branch <-> Member
Branch.hasMany(Member, { foreignKey: 'branchId', as: 'members' });
Member.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Trainer <-> Member
Trainer.hasMany(Member, { foreignKey: 'trainerId', as: 'assignedMembers' });
Member.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

// MembershipPlan <-> Member
MembershipPlan.hasMany(Member, { foreignKey: 'membershipPlanId', as: 'members' });
Member.belongsTo(MembershipPlan, { foreignKey: 'membershipPlanId', as: 'membershipPlan' });

// Member <-> Membership
Member.hasMany(Membership, { foreignKey: 'memberId', as: 'memberships' });
Membership.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// MembershipPlan <-> Membership
MembershipPlan.hasMany(Membership, { foreignKey: 'planId', as: 'memberships' });
Membership.belongsTo(MembershipPlan, { foreignKey: 'planId', as: 'plan' });

// Branch <-> GymClass
Branch.hasMany(GymClass, { foreignKey: 'branchId', as: 'classes' });
GymClass.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Trainer <-> GymClass
Trainer.hasMany(GymClass, { foreignKey: 'trainerId', as: 'classes' });
GymClass.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

// Member <-> Booking
Member.hasMany(Booking, { foreignKey: 'memberId', as: 'bookings' });
Booking.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// GymClass <-> Booking
GymClass.hasMany(Booking, { foreignKey: 'classId', as: 'bookings' });
Booking.belongsTo(GymClass, { foreignKey: 'classId', as: 'gymClass' });

// Member <-> Waitlist
Member.hasMany(Waitlist, { foreignKey: 'memberId', as: 'waitlistEntries' });
Waitlist.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// GymClass <-> Waitlist
GymClass.hasMany(Waitlist, { foreignKey: 'classId', as: 'waitlistEntries' });
Waitlist.belongsTo(GymClass, { foreignKey: 'classId', as: 'gymClass' });

// Member <-> Attendance
Member.hasMany(Attendance, { foreignKey: 'memberId', as: 'attendanceRecords' });
Attendance.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// Branch <-> Attendance
Branch.hasMany(Attendance, { foreignKey: 'branchId', as: 'attendanceRecords' });
Attendance.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Member <-> WorkoutPlan
Member.hasMany(WorkoutPlan, { foreignKey: 'memberId', as: 'workoutPlans' });
WorkoutPlan.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// Trainer <-> WorkoutPlan
Trainer.hasMany(WorkoutPlan, { foreignKey: 'trainerId', as: 'workoutPlans' });
WorkoutPlan.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

// Member <-> NutritionPlan
Member.hasMany(NutritionPlan, { foreignKey: 'memberId', as: 'nutritionPlans' });
NutritionPlan.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// Trainer <-> NutritionPlan
Trainer.hasMany(NutritionPlan, { foreignKey: 'trainerId', as: 'nutritionPlans' });
NutritionPlan.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

// Member <-> Progress
Member.hasMany(Progress, { foreignKey: 'memberId', as: 'progressRecords' });
Progress.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// User <-> Progress (recordedBy)
User.hasMany(Progress, { foreignKey: 'recordedBy', as: 'recordedProgress' });
Progress.belongsTo(User, { foreignKey: 'recordedBy', as: 'recorder' });

// Branch <-> Locker
Branch.hasMany(Locker, { foreignKey: 'branchId', as: 'lockers' });
Locker.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Member <-> Locker (assignedToMemberId)
Member.hasMany(Locker, { foreignKey: 'assignedToMemberId', as: 'lockers' });
Locker.belongsTo(Member, { foreignKey: 'assignedToMemberId', as: 'assignedMember' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Member <-> Payment
Member.hasMany(Payment, { foreignKey: 'memberId', as: 'payments' });
Payment.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

// Payment <-> Membership
Payment.hasMany(Membership, { foreignKey: 'paymentId', as: 'memberships' });
Membership.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

module.exports = {
  sequelize,
  User,
  Branch,
  Trainer,
  Member,
  MembershipPlan,
  Membership,
  GymClass,
  Booking,
  Waitlist,
  Attendance,
  WorkoutPlan,
  NutritionPlan,
  Progress,
  Locker,
  Notification,
  Payment
};
