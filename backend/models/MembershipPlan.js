const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MembershipPlan = sequelize.define('MembershipPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  accessLevel: {
    type: DataTypes.ENUM('Basic', 'Standard', 'VIP Premium', 'All Access'),
    defaultValue: 'Standard'
  },
  classAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  branchAccess: {
    type: DataTypes.ENUM('Single Branch', 'Multi-Branch Access'),
    defaultValue: 'Single Branch'
  },
  autoRenewEligible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

MembershipPlan.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = MembershipPlan;
