const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  membershipPlanId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  membershipStatus: {
    type: DataTypes.ENUM('Active', 'Expiring Soon', 'Expired', 'Cancelled', 'None'),
    defaultValue: 'None'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  qrCodeToken: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other', 'Unspecified'),
    defaultValue: 'Unspecified'
  },
  emergencyContact: {
    type: DataTypes.JSON,
    defaultValue: { name: '', phone: '', relation: '' }
  },
  fitnessGoal: {
    type: DataTypes.STRING,
    defaultValue: 'General Fitness & Muscle Gain'
  }
}, {
  timestamps: true
});

Member.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Member;
