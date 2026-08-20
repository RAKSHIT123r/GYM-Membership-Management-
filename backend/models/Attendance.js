const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  checkInTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Granted', 'Denied'),
    defaultValue: 'Granted'
  },
  denialReason: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  verifiedBy: {
    type: DataTypes.STRING,
    defaultValue: 'QR Automated Kiosk'
  }
}, {
  timestamps: true
});

Attendance.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Attendance;
