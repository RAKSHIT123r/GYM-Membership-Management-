const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Locker = sequelize.define('Locker', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lockerNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Available', 'Assigned', 'Maintenance'),
    defaultValue: 'Available'
  },
  assignedToMemberId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  assignedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true
});

Locker.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Locker;
