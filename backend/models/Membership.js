const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Membership = sequelize.define('Membership', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Expiring Soon', 'Expired', 'Cancelled'),
    defaultValue: 'Active'
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pricePaid: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  refundedAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  cancellationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

Membership.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Membership;
